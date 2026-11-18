import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { IdeaBlueprintSchema } from '@/lib/agents/blueprintSchema';
import { createFallbackBlueprint } from '@/constants/presets';

export async function POST(req: Request) {
  const { businessModel, ideaPrompt, primaryHex, enableEmbeddedAgent } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      blueprint: createFallbackBlueprint(businessModel, ideaPrompt, primaryHex, enableEmbeddedAgent),
      mode: 'local-fallback',
    });
  }

  try {
    const strategistModel = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-pro',
      temperature: 0.4,
      apiKey: process.env.GEMINI_API_KEY,
    }).withStructuredOutput(IdeaBlueprintSchema);

    const blueprint = await strategistModel.invoke([
      [
        'system',
        'You are the Lead Business Strategist inside IdeaProject (useideaproject.com). Convert the business model and idea into a structured, conversion-focused IdeaBlueprint JSON. Never use Lorem Ipsum.',
      ],
      [
        'user',
        `Business Model: ${businessModel}\nIdea: ${ideaPrompt}\nPrimary Color: ${primaryHex}\nEmbedded Agent: ${enableEmbeddedAgent}`,
      ],
    ]);

    return NextResponse.json({ blueprint, mode: 'live-agent' });
  } catch {
    return NextResponse.json({
      blueprint: createFallbackBlueprint(businessModel, ideaPrompt, primaryHex, enableEmbeddedAgent),
      mode: 'local-fallback',
    });
  }
}
