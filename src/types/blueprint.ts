export type BusinessModelId =
  | 'SAAS_SUBSCRIPTION'
  | 'ECOMMERCE_D2C'
  | 'SERVICE_BOOKING'
  | 'MARKETPLACE'
  | 'WAITLIST_VALIDATION';

export type SectionType =
  | 'HERO'
  | 'FEATURES_GRID'
  | 'INTERACTIVE_CALCULATOR'
  | 'PRICING_TABLE'
  | 'SOCIAL_PROOF'
  | 'FAQ';

export interface BlueprintSection {
  id: string;
  type: SectionType;
  label: string;
  enabled: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  cycle: string;
  features: string[];
  highlighted: boolean;
}

export interface IdeaBlueprint {
  projectName: string;
  tagline: string;
  businessModel: BusinessModelId;
  brand: { primaryHex: string; accentHex: string; tone: string };
  valueProposition: {
    headline: string;
    subheadline: string;
    targetAudience: string;
    primaryCtaText: string;
  };
  pricingTiers: PricingTier[];
  sections: BlueprintSection[];
  showAnnualToggle: boolean;
  showWhatsAppButton: boolean;
  embeddedAgentConfig: {
    enabled: boolean;
    agentName: string;
    greeting: string;
    knowledgeSummary: string;
  };
}

export interface BuildLogEntry {
  id: string;
  agent: 'Strategist' | 'Architect' | 'Validator' | 'System';
  message: string;
  status: 'running' | 'done' | 'healed' | 'error';
}

export interface ChatMessage {
  role: 'agent' | 'user';
  text: string;
}
