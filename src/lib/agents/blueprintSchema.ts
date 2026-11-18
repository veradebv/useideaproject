import { z } from 'zod';

export const IdeaBlueprintSchema = z.object({
  projectName: z.string(),
  tagline: z.string(),
  businessModel: z.enum([
    'SAAS_SUBSCRIPTION',
    'ECOMMERCE_D2C',
    'SERVICE_BOOKING',
    'MARKETPLACE',
    'WAITLIST_VALIDATION',
  ]),
  brand: z.object({
    primaryHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    tone: z.string(),
  }),
  valueProposition: z.object({
    headline: z.string(),
    subheadline: z.string(),
    targetAudience: z.string(),
    primaryCtaText: z.string(),
  }),
  pricingTiers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.string(),
      cycle: z.string(),
      features: z.array(z.string()),
      highlighted: z.boolean(),
    })
  ),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum([
        'HERO',
        'FEATURES_GRID',
        'INTERACTIVE_CALCULATOR',
        'PRICING_TABLE',
        'SOCIAL_PROOF',
        'FAQ',
      ]),
      label: z.string(),
      enabled: z.boolean(),
    })
  ),
  showAnnualToggle: z.boolean(),
  showWhatsAppButton: z.boolean(),
  embeddedAgentConfig: z.object({
    enabled: z.boolean(),
    agentName: z.string(),
    greeting: z.string(),
    knowledgeSummary: z.string(),
  }),
});
