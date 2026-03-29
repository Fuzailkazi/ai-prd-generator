import type { PrdFormData, TemplateType } from '../types/prd.types';

const TEMPLATE_STRUCTURES: Record<TemplateType, string> = {
  feature: `
1. Executive Summary
2. Problem Statement & Opportunity
3. User Requirements & Stories
4. Functional Requirements (Must Have / Nice to Have)
5. Technical Requirements & Architecture
6. UX Requirements & Design Principles
7. Non-Functional Requirements (Security, Performance, Reliability)
8. Success Metrics & Analytics
9. Implementation Plan & Timeline
10. Risk Assessment & Mitigation`,

  'new-product': `
1. Product Vision & Strategic Alignment
2. Market Opportunity & Problem Definition
3. Target Audience & User Personas
4. Core Product Features & Value Proposition
5. Technical Architecture & Stack
6. Go-to-Market Strategy
7. Non-Functional Requirements
8. Success Metrics & KPIs
9. Phased Launch Plan & Milestones
10. Risks, Dependencies & Mitigation`,

  'technical-spec': `
1. Overview & Scope
2. System Architecture & Components
3. Data Models & Schema Design
4. API Contracts & Interfaces
5. Business Logic & Processing Rules
6. Error Handling & Edge Cases
7. Security & Authentication Design
8. Performance Requirements & SLAs
9. Testing Strategy & Acceptance Criteria
10. Deployment & Rollout Plan`,

  'api-design': `
1. API Overview & Use Cases
2. Authentication & Authorization
3. Endpoint Definitions & HTTP Methods
4. Request / Response Schemas
5. Error Codes & Error Handling
6. Rate Limiting & Quotas
7. Versioning Strategy
8. SDK & Integration Guide
9. Performance & Reliability SLAs
10. Changelog & Migration Notes`,
};

export const buildPrdTemplatePrompt = (formData: PrdFormData): string => `
You are a senior product manager at a top-tier tech company. Produce a comprehensive, professional Product Requirements Document (PRD) using the information below.

---
PRODUCT NAME: ${formData.productName}
TEMPLATE TYPE: ${formData.template}
PROBLEM STATEMENT: ${formData.problemStatement}
TARGET USERS: ${formData.targetUsers}
KEY FEATURES: ${formData.keyFeatures}
SUCCESS METRICS: ${formData.successMetrics}
OUT OF SCOPE: ${formData.outOfScope}
---

OUTPUT STRUCTURE — follow this EXACTLY, using ## for each numbered section heading:
${TEMPLATE_STRUCTURES[formData.template]}

REQUIREMENTS:
- Use ## for section headings (e.g. ## 1. Executive Summary)
- Use clear, concise, professional language
- Include specific, measurable acceptance criteria where relevant
- User stories format: "As a [persona], I want [goal] so that [benefit]"
- Include a metadata block at the very top with: Product, Owner, Status, Version, Last Updated
- Do not add any preamble or closing remarks — output the PRD only

Generate the complete PRD now.
`;

export const buildSectionRegenerationPrompt = (
  sectionTitle: string,
  formData: PrdFormData,
): string => `
You are a senior product manager. Regenerate ONLY the content for the section titled "${sectionTitle}" of a PRD with these details:

Product: ${formData.productName}
Problem: ${formData.problemStatement}
Target Users: ${formData.targetUsers}
Key Features: ${formData.keyFeatures}
Success Metrics: ${formData.successMetrics}
Out of Scope: ${formData.outOfScope}

Output ONLY the markdown content for this section. Do NOT include the section heading itself. Be thorough and professional.
`;
