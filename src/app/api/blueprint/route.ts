import { NextResponse } from 'next/server';
import { IdeaBlueprintSchema } from '@/lib/schemas/blueprintSchema';
import { createFallbackBlueprint } from '@/constants/presets';
import { BusinessModelId } from '@/types/blueprint';

const MODELS = [
  'gemini-3.8-flash',
  'gemini-3.8-flash-lite',
  'gemini-3.8-pro',
  'gemini-3.8-flash',
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  const body = await req.json();
  const {
    businessModel,
    ideaPrompt,
    primaryHex,
    enableEmbeddedAgent,
  }: {
    businessModel: BusinessModelId;
    ideaPrompt: string;
    primaryHex: string;
    enableEmbeddedAgent: boolean;
  } = body;

  const fallback = createFallbackBlueprint(businessModel, ideaPrompt, primaryHex, enableEmbeddedAgent);
  const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/^["']|["']$/g, '');

  if (!apiKey) {
    console.warn('Missing GEMINI_API_KEY');
    return NextResponse.json({ blueprint: fallback, mode: 'local-fallback' });
  }

  const prompt = `You are the Strategist Agent for IdeaProject. Convert this business idea into a raw JSON object (no markdown) matching this exact structure:
{
  "projectName": "short memorable brand name",
  "businessModel": "${businessModel}",
  "brand": { "primaryHex": "${primaryHex}", "secondaryHex": "#0F172A", "fontTone": "modern-sans" },
  "valueProposition": { "headline": "max 12 words", "subheadline": "1-2 clear sentences", "primaryCtaText": "action CTA" },
  "pricingTiers": [
    { "id": "tier-1", "name": "Starter tier", "price": "localized price", "cycle": "/month", "features": ["feature 1", "feature 2", "feature 3"], "highlighted": false },
    { "id": "tier-2", "name": "Pro tier", "price": "localized price", "cycle": "/month", "features": ["feature 1", "feature 2", "feature 3"], "highlighted": true },
    { "id": "tier-3", "name": "Enterprise tier", "price": "localized price", "cycle": "/month", "features": ["feature 1", "feature 2", "feature 3"], "highlighted": false }
  ],
  "sections": [
    { "id": "sec-hero", "type": "HERO", "label": "Hero & Value Proposition", "enabled": true },
    { "id": "sec-calc", "type": "INTERACTIVE_CALCULATOR", "label": "Interactive Value Estimator", "enabled": true },
    { "id": "sec-price", "type": "PRICING_TABLE", "label": "Subscription & Pricing Tiers", "enabled": true },
    { "id": "sec-proof", "type": "SOCIAL_PROOF", "label": "Customer Social Proof", "enabled": true }
  ],
  "embeddedAgentConfig": {
    "enabled": ${enableEmbeddedAgent},
    "agentName": "Brand Concierge",
    "greeting": "Welcome message",
    "knowledgeSummary": "Summary of offering and pricing"
  },
  "showAnnualToggle": true,
  "showWhatsAppButton": false
}

Business Model: ${businessModel}
Idea: ${ideaPrompt}
Primary Brand Hex: ${primaryHex}`;

  for (let i = 0; i < MODELS.length; i++) {
    const modelName = MODELS[i];
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(25000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: 'application/json',
              ...(modelName.includes('flash') ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
            },
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`${modelName} failed (${res.status}):`, errText.slice(0, 180));
        if (res.status === 503 || res.status === 429) {
          await sleep(1200 * (i + 1));
        }
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      const parsed = IdeaBlueprintSchema.parse(JSON.parse(cleaned));

      console.log(`Blueprint generated live with ${modelName}:`, parsed.projectName);
      return NextResponse.json({ blueprint: parsed, mode: 'live-ai', model: modelName });
    } catch (err) {
      console.warn(`${modelName} exception:`, err);
    }
  }

  return NextResponse.json({ blueprint: fallback, mode: 'error-fallback' });
}
