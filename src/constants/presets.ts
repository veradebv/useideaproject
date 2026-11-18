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
    id: 'SAAS_SUBSCRIPTION',
    name: 'SaaS / Subscription',
    tag: 'Recurring Revenue',
    desc: 'Tiered plans, ROI/usage calculator, free trial & self-serve onboarding.',
    defaultColor: '#2563EB',
    sampleIdea: 'Automated WhatsApp & email invoice reminder platform for digital agencies in Southeast Asia.',
  },
  {
    id: 'ECOMMERCE_D2C',
    name: 'E-Commerce / D2C',
    tag: 'Product & Cart',
    desc: 'Product showcase, bundle configurator, instant checkout & order tracking.',
    defaultColor: '#D97706',
    sampleIdea: 'Specialty single-origin Indonesian coffee subscription box tailored for remote workers in Jakarta.',
  },
  {
    id: 'SERVICE_BOOKING',
    name: 'Service / Booking Agency',
    tag: 'Appointments',
    desc: 'Service packages, case studies, trust badges & interactive consultation scheduler.',
    defaultColor: '#059669',
    sampleIdea: 'On-demand modern aesthetic dental & smile studio in South Jakarta with transparent package pricing.',
  },
  {
    id: 'MARKETPLACE',
    name: 'Two-Sided Marketplace',
    tag: 'Supply & Demand',
    desc: 'Dual onboarding for providers & buyers, directory preview & commission calculator.',
    defaultColor: '#7C3AED',
    sampleIdea: 'Curated marketplace connecting verified freelance product designers with seed-stage fintech startups.',
  },
  {
    id: 'WAITLIST_VALIDATION',
    name: 'Waitlist / MVP Validation',
    tag: 'Pre-Launch',
    desc: 'Problem-agitation hero, interactive feature voting & viral early-access referral capture.',
    defaultColor: '#E11D48',
    sampleIdea: 'AI-powered personal tax & e-Faktur assistant built specifically for Indonesian freelancers.',
  },
];

export function createFallbackBlueprint(
  modelId: BusinessModelId,
  ideaText: string,
  primaryHex: string,
  enableAgent: boolean
): IdeaBlueprint {
  const isCoffee = ideaText.toLowerCase().includes('coffee') || modelId === 'ECOMMERCE_D2C';

  if (isCoffee) {
    return {
      projectName: 'KopiRiset Roasters',
      tagline: 'Freshly roasted single-origin beans delivered on your schedule.',
      businessModel: modelId,
      brand: { primaryHex, accentHex: '#F59E0B', tone: 'modern-minimal' },
      valueProposition: {
        headline: 'Barista-Grade Indonesian Specialty Coffee, Delivered Weekly.',
        subheadline:
          'Curated micro-lot beans from Aceh Gayo, Flores, and Toraja—roasted 24 hours before dispatch for remote workers.',
        targetAudience: 'Remote workers & home brewers in Greater Jakarta',
        primaryCtaText: 'Build My Coffee Box',
      },
      pricingTiers: [
        {
          id: 't1',
          name: 'Solo Brewer',
          price: 'Rp 145k',
          cycle: '/ 2 weeks',
          features: ['250g Single-Origin Beans', 'Custom Grind Profile', 'Free Jabodetabek Delivery'],
          highlighted: false,
        },
        {
          id: 't2',
          name: 'Deep Work Pass',
          price: 'Rp 265k',
          cycle: '/ 2 weeks',
          features: ['2x 250g Rotating Origins', 'Priority Same-Day Roast', 'Free Dripper on 1st Box'],
          highlighted: true,
        },
        {
          id: 't3',
          name: 'Studio Team',
          price: 'Rp 690k',
          cycle: '/ month',
          features: ['1.5kg Office Supply', '3 Origin Varieties', 'Dedicated Account Concierge'],
          highlighted: false,
        },
      ],
      sections: [
        { id: 's1', type: 'HERO', label: 'Hero & Value Proposition', enabled: true },
        { id: 's2', type: 'INTERACTIVE_CALCULATOR', label: 'Interactive Cup & Savings Estimator', enabled: true },
        { id: 's3', type: 'PRICING_TABLE', label: 'Subscription & Pricing Tiers', enabled: true },
        { id: 's4', type: 'SOCIAL_PROOF', label: 'Customer Trust & Reviews', enabled: true },
      ],
      showAnnualToggle: false,
      showWhatsAppButton: true,
      embeddedAgentConfig: {
        enabled: enableAgent,
        agentName: 'Barista AI Concierge',
        greeting: 'Hi! Need help picking a roast profile or grind size for your brewer?',
        knowledgeSummary:
          'KopiRiset delivers fresh Indonesian specialty coffee in Jakarta. Plans start at Rp 145k (250g) and Rp 265k (500g).',
      },
    };
  }

  return {
    projectName: 'TagihFlow',
    tagline: 'Get paid 3x faster without awkward client follow-ups.',
    businessModel: modelId,
    brand: { primaryHex, accentHex: '#10B981', tone: 'corporate-trust' },
    valueProposition: {
      headline: 'Automated Invoice Reminders That Clients Actually Pay.',
      subheadline:
        'Connect your billing in 2 minutes. Smart WhatsApp & email sequences follow up politely before due dates.',
      targetAudience: 'Digital agencies, studios & B2B service operators',
      primaryCtaText: 'Start 14-Day Free Trial',
    },
    pricingTiers: [
      {
        id: 't1',
        name: 'Starter',
        price: '$19',
        cycle: '/ month',
        features: ['Up to 30 Active Invoices', 'Email & WhatsApp Reminders', 'Basic Payment Links'],
        highlighted: false,
      },
      {
        id: 't2',
        name: 'Agency Pro',
        price: '$49',
        cycle: '/ month',
        features: ['Unlimited Invoices', 'Custom Tone Escalation', 'Auto Bank & Xendit Sync'],
        highlighted: true,
      },
      {
        id: 't3',
        name: 'Scale',
        price: '$119',
        cycle: '/ month',
        features: ['Multi-Entity Workspaces', 'Dedicated Webhook API', 'Priority SLA Support'],
        highlighted: false,
      },
    ],
    sections: [
      { id: 's1', type: 'HERO', label: 'Hero & Value Proposition', enabled: true },
      { id: 's2', type: 'INTERACTIVE_CALCULATOR', label: 'Cashflow Recovery Calculator', enabled: true },
      { id: 's3', type: 'PRICING_TABLE', label: 'Subscription & Pricing Tiers', enabled: true },
      { id: 's4', type: 'SOCIAL_PROOF', label: 'Agency Social Proof', enabled: true },
    ],
    showAnnualToggle: true,
    showWhatsAppButton: false,
    embeddedAgentConfig: {
      enabled: enableAgent,
      agentName: 'TagihFlow Sales Specialist',
      greeting: 'Hello! Want to see how much overdue cashflow TagihFlow can recover for your agency?',
      knowledgeSummary:
        'TagihFlow automates B2B invoice reminders via WhatsApp and Email. Plans: Starter ($19/mo), Agency Pro ($49/mo), Scale ($119/mo).',
    },
  };
}
