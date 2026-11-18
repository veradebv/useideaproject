import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { IdeaBlueprint } from '@/types/blueprint';
import { provisionAndBuildSite } from '@/lib/sandbox/e2bManager';

const GeneratedFilesSchema = z.object({
  files: z.array(z.object({ path: z.string(), content: z.string() })),
  summary: z.string(),
});

const BuilderGraphState = Annotation.Root({
  blueprint: Annotation<IdeaBlueprint>(),
  userInstruction: Annotation<string | undefined>(),
  sandboxId: Annotation<string | undefined>(),
  files: Annotation<Record<string, string>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
    default: () => ({}),
  }),
  buildSuccess: Annotation<boolean>({ reducer: (_, next) => next, default: () => false }),
  errorLog: Annotation<string | undefined>(),
  previewUrl: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  attempts: Annotation<number>({ reducer: (_, next) => next, default: () => 0 }),
  agentSummary: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
});

function getCodingModel() {
  return new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-pro',
    temperature: 0.2,
    apiKey: process.env.GEMINI_API_KEY,
  }).withStructuredOutput(GeneratedFilesSchema);
}

async function architectNode(state: typeof BuilderGraphState.State) {
  const isRetry = Boolean(state.errorLog && state.attempts > 0);
  const prompt = isRetry
    ? `Fix this Next.js build error inside IdeaProject.\nStderr:\n${state.errorLog}\nExisting files:\n${JSON.stringify(
        state.files
      )}\nReturn ONLY patched files so 'npm run build' exits 0.`
    : `You are the Principal Frontend Architect inside IdeaProject.
Generate a complete Next.js (App Router) + Tailwind CSS + Lucide React app for this IdeaBlueprint:
${JSON.stringify(state.blueprint, null, 2)}
${state.userInstruction ? `Apply user edit: "${state.userInstruction}"` : ''}
Write 'src/app/page.tsx' implementing all enabled sections, brand hex colors, interactive state, and the embedded AI assistant widget if enabled.`;

  const result = await getCodingModel().invoke(prompt);
  const updatedFiles: Record<string, string> = {};
  for (const f of result.files) {
    updatedFiles[`/home/user/app/${f.path}`] = f.content;
  }

  return { files: updatedFiles, attempts: state.attempts + 1, agentSummary: result.summary };
}

async function validatorNode(state: typeof BuilderGraphState.State) {
  const res = await provisionAndBuildSite(state.files, state.sandboxId);
  return {
    sandboxId: res.sandboxId,
    buildSuccess: res.success,
    previewUrl: res.previewUrl,
    errorLog: res.errorLog,
  };
}

function routeAfterValidation(state: typeof BuilderGraphState.State) {
  if (state.buildSuccess || state.attempts >= 3) return END;
  return 'architect';
}

export const builderGraph = new StateGraph(BuilderGraphState)
  .addNode('architect', architectNode)
  .addNode('validator', validatorNode)
  .addEdge(START, 'architect')
  .addEdge('architect', 'validator')
  .addConditionalEdges('validator', routeAfterValidation, { architect: 'architect', [END]: END })
  .compile();
