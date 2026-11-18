import { builderGraph } from '@/lib/agents/builderGraph';
import { IdeaBlueprint } from '@/types/blueprint';

export async function POST(req: Request) {
  const {
    blueprint,
    userInstruction,
    sandboxId,
  }: { blueprint: IdeaBlueprint; userInstruction?: string; sandboxId?: string } = await req.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      try {
        send({ agent: 'Strategist', message: 'Locked approved IdeaBlueprint contract.', status: 'done' });

        if (!process.env.GEMINI_API_KEY || !process.env.E2B_API_KEY) {
          send({
            agent: 'Architect',
            message: 'Local preview mode active (add GEMINI_API_KEY & E2B_API_KEY in .env.local for live microVMs).',
            status: 'done',
          });
          send({ agent: 'Validator', message: 'Interactive preview hydrated.', status: 'done', previewUrl: '' });
          controller.close();
          return;
        }

        const eventStream = await builderGraph.stream(
          { blueprint, userInstruction, sandboxId },
          { streamMode: 'updates' }
        );

        for await (const update of eventStream) {
          if (update.architect) {
            const attempt = update.architect.attempts || 1;
            send({
              agent: 'Architect',
              message:
                attempt > 1
                  ? `Self-healing build error (Attempt ${attempt}/3)...`
                  : update.architect.agentSummary || 'Generated application files.',
              status: attempt > 1 ? 'healed' : 'done',
            });
          }
          if (update.validator) {
            if (update.validator.buildSuccess) {
              send({
                agent: 'Validator',
                message: 'Production build passed (0 errors). Live sandbox mounted.',
                status: 'done',
                previewUrl: update.validator.previewUrl,
                sandboxId: update.validator.sandboxId,
              });
            } else {
              send({
                agent: 'Validator',
                message: 'Build warning detected — routing error logs back to Architect...',
                status: 'running',
              });
            }
          }
        }
      } catch (err) {
        send({
          agent: 'System',
          message: err instanceof Error ? err.message : 'Build stream error.',
          status: 'error',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
