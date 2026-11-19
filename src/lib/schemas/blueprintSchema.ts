import { z } from 'zod';

export const IdeaBlueprintSchema = z.object({
  projectName: z.string().describe('Short, memorable brand name tailored to the business idea'),
  businessModel: z.enum([
    'SAAS',
    'ECOMMERCE_D2C',
    'SERVICE_BOOKING',
    'MARKETPLACE',
    'WAITLIST_MVP',
  ]),
  brand: z.object({
    primaryHex: z.string().describe('Primary brand hex color code, e.g. #059669'),
    secondaryHex: z.string().describe('Complementary secondary hex color code, e.g. #0F172A'),
    fontTone: z.enum(['modern-sans', 'editorial-serif', 'tech-mono']),
  }),
  valueProposition: z.object({
    headline: z.string().describe('High-converting hero headline (max 12 words)'),
    subheadline: z.string().describe('Clear 1-2 sentence explanation of how the product solves the user problem'),
    primaryCtaText: z.string().describe('Action-oriented primary button label'),
  }),
  pricingTiers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.string().describe('Localized price string such as Rp 149K or $29'),
        cycle: z.string().describe('Billing cycle such as /month or /order'),
        features: z.array(z.string()).min(3).max(5),
        highlighted: z.boolean().describe('Set true only for the recommended middle tier'),
      })
    )
    .length(3),
  sections: z.array(
    z.object({
      id: z.string(),
      type: z.enum([
        'HERO',
        'INTERACTIVE_CALCULATOR',
        'PRICING_TABLE',
        'SOCIAL_PROOF',
      ]),
      label: z.string(),
      enabled: z.boolean(),
    })
  ),
  embeddedAgentConfig: z.object({
    enabled: z.boolean(),
    agentName: z.string().describe('Friendly name for the embedded customer support/sales bot'),
    greeting: z.string().describe('First message shown when a visitor opens the chat widget'),
    knowledgeSummary: z.string().describe('Concise summary of the business offering and pricing for the bot to reference'),
  }),
  showAnnualToggle: z.boolean(),
  showWhatsAppButton: z.boolean(),
});
