import { BusinessModelId, IdeaBlueprint } from '@/types/blueprint';

export const BUSINESS_MODELS: {
  id: BusinessModelId;
  name: string;
  tag: string;
  desc: string;
  defaultColor: string;
  sampleIdea: string;
}[] = [
  {
    id: 'SAAS',
    name: 'SaaS / Micro-SaaS',
    tag: 'Recurring',
    desc: 'Interactive ROI calculator, tiered subscription pricing, and automated onboarding.',
    defaultColor: '#2563EB',
    sampleIdea: 'An AI bookkeeping assistant for independent coffee shops in Jakarta that scans supplier receipts via WhatsApp.',
  },
  {
    id: 'ECOMMERCE_D2C',
    name: 'E-Commerce & D2C',
    tag: 'Physical / Digital',
    desc: 'Product showcase, bundle savings estimator, and direct checkout flow.',
    defaultColor: '#D97706',
    sampleIdea: 'A weekly single-origin Indonesian specialty coffee subscription box for home brewers.',
  },
  {
    id: 'SERVICE_BOOKING',
    name: 'Service & Booking',
    tag: 'High-Ticket',
    desc: 'Package comparison, scope estimator, and instant consultation scheduling.',
    defaultColor: '#059669',
    sampleIdea: 'An on-demand mobile physiotherapy and sports recovery service in South Jakarta.',
  },
  {
    id: 'MARKETPLACE',
    name: 'Two-Sided Marketplace',
    tag: 'Network',
    desc: 'Dual buyer/supplier value props, take-rate calculator, and verified trust badges.',
    defaultColor: '#7C3AED',
    sampleIdea: 'A B2B marketplace connecting local packaging factories with F&B startups.',
  },
  {
    id: 'WAITLIST_MVP',
    name: 'Waitlist & MVP Validation',
    tag: 'Pre-Launch',
    desc: 'High-urgency value prop, founding member perks, and referral waitlist capture.',
    defaultColor: '#E11D48',
    sampleIdea: 'A privacy-first personal finance app that syncs Indonesian e-wallets without bank passwords.',
  },
];

export function createFallbackBlueprint(
  businessModel: BusinessModelId,
  ideaPrompt: string,
  primaryHex: string,
  enableEmbeddedAgent: boolean
): IdeaBlueprint {
  const shortSummary = ideaPrompt.trim() || '[Your Business Idea Description]';

  return {
    projectName: '[YourVentureName]',
    businessModel,
    brand: {
      primaryHex: primaryHex || '#2563EB',
      secondaryHex: '#0F172A',
      fontTone: 'modern-sans',
    },
    valueProposition: {
      headline: '[Your Primary Value Proposition Headline]',
      subheadline: `[Fallback Mode] ${shortSummary}`,
      primaryCtaText: '[Primary CTA Button]',
    },
    pricingTiers: [
      {
        id: 'tier-1',
        name: '[Starter Plan]',
        price: '[Price 1]',
        cycle: '/month',
        features: ['[Core Feature 1]', '[Core Feature 2]', '[Core Feature 3]'],
      },
      {
        id: 'tier-2',
        name: '[Pro Plan]',
        price: '[Price 2]',
        cycle: '/month',
        features: ['[Everything in Starter]', '[Pro Feature 1]', '[Priority Support]'],
        highlighted: true,
      },
      {
        id: 'tier-3',
        name: '[Enterprise Plan]',
        price: '[Price 3]',
        cycle: '/month',
        features: ['[Unlimited Usage]', '[Custom Integrations]', '[Dedicated Account Manager]'],
      },
    ],
    sections: [
      { id: 'sec-hero', type: 'HERO', label: 'Hero & Value Proposition', enabled: true },
      { id: 'sec-calc', type: 'INTERACTIVE_CALCULATOR', label: 'Interactive Value Estimator', enabled: true },
      { id: 'sec-price', type: 'PRICING_TABLE', label: 'Subscription & Pricing Tiers', enabled: true },
      { id: 'sec-proof', type: 'SOCIAL_PROOF', label: 'Customer Social Proof', enabled: true },
    ],
    embeddedAgentConfig: {
      enabled: enableEmbeddedAgent,
      agentName: '[YourVentureName] Assistant',
      greeting: 'Hi! Welcome to [YourVentureName]. Ask me anything about our plans or offering.',
      knowledgeSummary: shortSummary,
    },
    showAnnualToggle: true,
    showWhatsAppButton: false,
  };
}
