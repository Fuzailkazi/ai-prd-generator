import type {
  PrdFormData,
  FeaturePrdForm,
  NewProductForm,
  TechnicalSpecForm,
  ApiDesignForm,
} from '../types/prd.types';

// ── Per-template prompt builders ──────────────────────────────────────────────

function featurePrompt(f: FeaturePrdForm): string {
  return `
You are a senior product manager. Write a comprehensive Feature PRD for the following:

FEATURE NAME: ${f.featureName}
PROBLEM STATEMENT: ${f.problemStatement}
TARGET USERS: ${f.targetUsers}
USER STORIES: ${f.userStories}
ACCEPTANCE CRITERIA: ${f.acceptanceCriteria}
SUCCESS METRICS: ${f.successMetrics}
OUT OF SCOPE: ${f.outOfScope}

Generate the PRD with these sections (use ## for each heading):
## 1. Executive Summary
## 2. Problem Statement & Context
## 3. User Personas & Target Users
## 4. User Stories & Requirements
## 5. Acceptance Criteria
## 6. Functional Requirements
## 7. Non-Functional Requirements
## 8. UX & Design Considerations
## 9. Success Metrics & Analytics
## 10. Implementation Plan & Timeline
## 11. Risks & Mitigations
## 12. Open Questions

Include a metadata block at the top: Feature, Owner, Status, Version, Last Updated.
Be specific, measurable, and professional. Output the PRD only — no preamble.
`;
}

function newProductPrompt(f: NewProductForm): string {
  return `
You are a senior product manager. Write a comprehensive New Product PRD for the following:

PRODUCT NAME: ${f.productName}
PROBLEM & MARKET GAP: ${f.problemMarketGap}
TARGET MARKET: ${f.targetMarket}
VALUE PROPOSITION: ${f.valueProposition}
CORE FEATURES: ${f.coreFeatures}
BUSINESS MODEL: ${f.businessModel}
COMPETITIVE LANDSCAPE: ${f.competitiveLandscape}
SUCCESS METRICS: ${f.successMetrics}

Generate the PRD with these sections (use ## for each heading):
## 1. Product Vision & Executive Summary
## 2. Market Opportunity & Problem
## 3. Target Market & User Personas
## 4. Value Proposition & Differentiation
## 5. Core Product Features (MVP)
## 6. Business Model & Monetisation
## 7. Competitive Analysis
## 8. Go-to-Market Strategy
## 9. Non-Functional Requirements
## 10. Success Metrics & KPIs
## 11. Phased Roadmap & Milestones
## 12. Risks, Assumptions & Dependencies

Include a metadata block at the top: Product, Owner, Status, Version, Last Updated.
Be specific, measurable, and professional. Output the PRD only — no preamble.
`;
}

function technicalSpecPrompt(f: TechnicalSpecForm): string {
  return `
You are a senior staff engineer and technical product manager. Write a comprehensive Technical Spec for the following:

SYSTEM / COMPONENT: ${f.systemName}
PROBLEM STATEMENT: ${f.problemStatement}
PROPOSED ARCHITECTURE: ${f.architecture}
DATA MODELS: ${f.dataModels}
API CONTRACTS: ${f.apiContracts}
EDGE CASES & ERROR HANDLING: ${f.edgeCases}
PERFORMANCE REQUIREMENTS: ${f.performanceRequirements}
DEPENDENCIES: ${f.dependencies}

Generate the spec with these sections (use ## for each heading):
## 1. Overview & Scope
## 2. Problem Statement & Motivation
## 3. System Architecture
## 4. Data Models & Schema Design
## 5. API Contracts & Interfaces
## 6. Business Logic & Processing Rules
## 7. Error Handling & Edge Cases
## 8. Security Considerations
## 9. Performance & Scalability
## 10. Testing Strategy & Acceptance Criteria
## 11. Deployment & Rollout Plan
## 12. Open Questions & Future Considerations

Include a metadata block at the top: System, Author, Status, Version, Last Updated.
Be precise and engineering-grade. Output the spec only — no preamble.
`;
}

function apiDesignPrompt(f: ApiDesignForm): string {
  return `
You are a senior API architect. Write a comprehensive API Design Document for the following:

API NAME: ${f.apiName}
PURPOSE & USE CASES: ${f.purpose}
AUTHENTICATION METHOD: ${f.authMethod}
ENDPOINTS: ${f.endpoints}
REQUEST / RESPONSE SCHEMA: ${f.requestResponseSchema}
ERROR HANDLING: ${f.errorHandling}
RATE LIMITS & QUOTAS: ${f.rateLimits}
CONSUMERS / INTEGRATORS: ${f.consumers}

Generate the API design document with these sections (use ## for each heading):
## 1. API Overview
## 2. Authentication & Authorisation
## 3. Base URL & Versioning
## 4. Endpoint Reference
## 5. Request & Response Schemas
## 6. Error Codes & Error Handling
## 7. Rate Limiting & Quotas
## 8. Webhooks & Events (if applicable)
## 9. SDK & Integration Guide
## 10. Security Considerations
## 11. Performance & Reliability SLAs
## 12. Changelog & Migration Notes

Include a metadata block at the top: API, Author, Status, Version, Last Updated.
Be precise and developer-grade. Output the document only — no preamble.
`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function buildPrdTemplatePrompt(formData: PrdFormData): string {
  switch (formData.template) {
    case 'feature': return featurePrompt(formData);
    case 'new-product': return newProductPrompt(formData);
    case 'technical-spec': return technicalSpecPrompt(formData);
    case 'api-design': return apiDesignPrompt(formData);
  }
}

export function buildSectionRegenerationPrompt(
  sectionTitle: string,
  formData: PrdFormData,
): string {
  const context = Object.entries(formData)
    .filter(([k]) => k !== 'template')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  return `
You are a senior product manager. Regenerate ONLY the content for the section titled "${sectionTitle}".

Context:
${context}

Output ONLY the markdown content for this section. Do NOT include the section heading. Be thorough and professional.
`;
}
