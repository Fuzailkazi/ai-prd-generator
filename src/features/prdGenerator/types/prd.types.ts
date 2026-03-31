export type TemplateType = 'feature' | 'new-product' | 'technical-spec' | 'api-design';

// ── Per-template form shapes ──────────────────────────────────────────────────

export interface FeaturePrdForm {
  template: 'feature';
  featureName: string;
  problemStatement: string;
  targetUsers: string;
  userStories: string;
  acceptanceCriteria: string;
  successMetrics: string;
  outOfScope: string;
}

export interface NewProductForm {
  template: 'new-product';
  productName: string;
  problemMarketGap: string;
  targetMarket: string;
  valueProposition: string;
  coreFeatures: string;
  businessModel: string;
  competitiveLandscape: string;
  successMetrics: string;
}

export interface TechnicalSpecForm {
  template: 'technical-spec';
  systemName: string;
  problemStatement: string;
  architecture: string;
  dataModels: string;
  apiContracts: string;
  edgeCases: string;
  performanceRequirements: string;
  dependencies: string;
}

export interface ApiDesignForm {
  template: 'api-design';
  apiName: string;
  purpose: string;
  authMethod: string;
  endpoints: string;
  requestResponseSchema: string;
  errorHandling: string;
  rateLimits: string;
  consumers: string;
}

export type PrdFormData =
  | FeaturePrdForm
  | NewProductForm
  | TechnicalSpecForm
  | ApiDesignForm;

// ── Metadata ──────────────────────────────────────────────────────────────────

export const TEMPLATE_META: Record<TemplateType, { label: string; description: string }> = {
  feature: { label: 'Feature PRD', description: 'New feature in an existing product' },
  'new-product': { label: 'New Product', description: 'Launch a brand-new product' },
  'technical-spec': { label: 'Technical Spec', description: 'Technical implementation guide' },
  'api-design': { label: 'API Design', description: 'API design and integration spec' },
};

// ── Field configs per template ────────────────────────────────────────────────

export interface FieldConfig {
  key: string;
  label: string;
  hint: string;
  multiline?: boolean;
  rows?: number;
}

export const TEMPLATE_FIELDS: Record<TemplateType, FieldConfig[]> = {
  feature: [
    {
      key: 'featureName',
      label: 'Feature Name',
      hint: 'e.g. One-click checkout, Dark mode toggle',
    },
    {
      key: 'problemStatement',
      label: 'Problem Statement',
      hint: 'What problem does this feature solve? Who feels it and how often?',
      multiline: true,
      rows: 3,
    },
    {
      key: 'targetUsers',
      label: 'Target Users',
      hint: 'e.g. Mobile shoppers, power users, new signups',
    },
    {
      key: 'userStories',
      label: 'User Stories',
      hint: 'As a [user], I want [goal] so that [benefit] — one per line',
      multiline: true,
      rows: 4,
    },
    {
      key: 'acceptanceCriteria',
      label: 'Acceptance Criteria',
      hint: 'How will you know it is done? List testable conditions',
      multiline: true,
      rows: 3,
    },
    {
      key: 'successMetrics',
      label: 'Success Metrics',
      hint: 'e.g. Checkout conversion +15%, support tickets -30%',
    },
    {
      key: 'outOfScope',
      label: 'Out of Scope',
      hint: 'What are you explicitly NOT building in this iteration?',
    },
  ],

  'new-product': [
    {
      key: 'productName',
      label: 'Product Name',
      hint: 'e.g. Prodably, Stripe for Africa',
    },
    {
      key: 'problemMarketGap',
      label: 'Problem & Market Gap',
      hint: 'What gap in the market does this fill? Why does it exist today?',
      multiline: true,
      rows: 3,
    },
    {
      key: 'targetMarket',
      label: 'Target Market',
      hint: 'e.g. Early-stage startup founders in Southeast Asia',
    },
    {
      key: 'valueProposition',
      label: 'Value Proposition',
      hint: 'Why will customers choose this over existing alternatives?',
      multiline: true,
      rows: 2,
    },
    {
      key: 'coreFeatures',
      label: 'Core Features',
      hint: 'Must-have features at launch — one per line',
      multiline: true,
      rows: 4,
    },
    {
      key: 'businessModel',
      label: 'Business Model',
      hint: 'e.g. Freemium SaaS, usage-based pricing, marketplace take rate',
    },
    {
      key: 'competitiveLandscape',
      label: 'Competitive Landscape',
      hint: 'Key competitors and your key differentiator against each',
    },
    {
      key: 'successMetrics',
      label: 'Success Metrics',
      hint: 'e.g. 100 paying customers in 90 days, $10k MRR at 6 months',
    },
  ],

  'technical-spec': [
    {
      key: 'systemName',
      label: 'System / Component Name',
      hint: 'e.g. Payment Processing Service, Auth Middleware',
    },
    {
      key: 'problemStatement',
      label: 'Problem Statement',
      hint: 'What technical problem are you solving and why now?',
      multiline: true,
      rows: 3,
    },
    {
      key: 'architecture',
      label: 'Proposed Architecture',
      hint: 'High-level design, components, patterns, technology choices',
      multiline: true,
      rows: 4,
    },
    {
      key: 'dataModels',
      label: 'Data Models',
      hint: 'Key entities, schema design, relationships, storage strategy',
      multiline: true,
      rows: 3,
    },
    {
      key: 'apiContracts',
      label: 'API Contracts',
      hint: 'Endpoint signatures, request/response shapes, versioning',
      multiline: true,
      rows: 3,
    },
    {
      key: 'edgeCases',
      label: 'Edge Cases & Error Handling',
      hint: 'Known edge cases, failure modes, retry logic',
      multiline: true,
      rows: 3,
    },
    {
      key: 'performanceRequirements',
      label: 'Performance Requirements',
      hint: 'e.g. p99 latency < 200ms, 99.9% uptime, 10k RPS',
    },
    {
      key: 'dependencies',
      label: 'Dependencies',
      hint: 'External services, internal teams, third-party libraries',
    },
  ],

  'api-design': [
    {
      key: 'apiName',
      label: 'API Name',
      hint: 'e.g. Payments API v2, Notification Service',
    },
    {
      key: 'purpose',
      label: 'Purpose & Use Cases',
      hint: 'What will consumers use this API for? List the primary use cases',
      multiline: true,
      rows: 2,
    },
    {
      key: 'authMethod',
      label: 'Authentication Method',
      hint: 'e.g. OAuth 2.0, API Key in header, JWT bearer token',
    },
    {
      key: 'endpoints',
      label: 'Endpoints to Define',
      hint: 'e.g. POST /payments, GET /users/:id, DELETE /sessions',
      multiline: true,
      rows: 4,
    },
    {
      key: 'requestResponseSchema',
      label: 'Request / Response Schema',
      hint: 'Key fields, data types, required vs optional, example payloads',
      multiline: true,
      rows: 4,
    },
    {
      key: 'errorHandling',
      label: 'Error Handling',
      hint: 'Error codes, human-readable messages, retry recommendations',
      multiline: true,
      rows: 2,
    },
    {
      key: 'rateLimits',
      label: 'Rate Limits & Quotas',
      hint: 'e.g. 1000 req/min per API key, burst limit of 50 req/s',
    },
    {
      key: 'consumers',
      label: 'Consumers / Integrators',
      hint: 'Who will integrate with this API? Internal teams, partners, public?',
    },
  ],
};

// ── Empty form defaults ────────────────────────────────────────────────────────

export const EMPTY_FORMS: Record<TemplateType, PrdFormData> = {
  feature: {
    template: 'feature',
    featureName: '',
    problemStatement: '',
    targetUsers: '',
    userStories: '',
    acceptanceCriteria: '',
    successMetrics: '',
    outOfScope: '',
  },
  'new-product': {
    template: 'new-product',
    productName: '',
    problemMarketGap: '',
    targetMarket: '',
    valueProposition: '',
    coreFeatures: '',
    businessModel: '',
    competitiveLandscape: '',
    successMetrics: '',
  },
  'technical-spec': {
    template: 'technical-spec',
    systemName: '',
    problemStatement: '',
    architecture: '',
    dataModels: '',
    apiContracts: '',
    edgeCases: '',
    performanceRequirements: '',
    dependencies: '',
  },
  'api-design': {
    template: 'api-design',
    apiName: '',
    purpose: '',
    authMethod: '',
    endpoints: '',
    requestResponseSchema: '',
    errorHandling: '',
    rateLimits: '',
    consumers: '',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getFormTitle(formData: PrdFormData): string {
  switch (formData.template) {
    case 'feature': return formData.featureName || 'Untitled Feature';
    case 'new-product': return formData.productName || 'Untitled Product';
    case 'technical-spec': return formData.systemName || 'Untitled Spec';
    case 'api-design': return formData.apiName || 'Untitled API';
  }
}

// ── Document ──────────────────────────────────────────────────────────────────

export interface PrdSection {
  id: string;
  title: string;
  content: string;
}

export interface PrdDocument {
  id: string;
  title: string;
  rawContent: string;
  formData: PrdFormData;
  createdAt: number;
}
