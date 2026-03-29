export type TemplateType = 'feature' | 'new-product' | 'technical-spec' | 'api-design';

export interface PrdFormData {
  template: TemplateType;
  productName: string;
  problemStatement: string;
  targetUsers: string;
  keyFeatures: string;
  successMetrics: string;
  outOfScope: string;
}

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

export const TEMPLATE_META: Record<TemplateType, { label: string; description: string }> = {
  feature: { label: 'Feature PRD', description: 'New feature in an existing product' },
  'new-product': { label: 'New Product', description: 'Launch a brand-new product' },
  'technical-spec': { label: 'Technical Spec', description: 'Technical implementation guide' },
  'api-design': { label: 'API Design', description: 'API design and integration spec' },
};

export const EMPTY_FORM: PrdFormData = {
  template: 'feature',
  productName: '',
  problemStatement: '',
  targetUsers: '',
  keyFeatures: '',
  successMetrics: '',
  outOfScope: '',
};
