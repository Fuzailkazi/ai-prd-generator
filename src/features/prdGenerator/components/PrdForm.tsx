import type { PrdFormData, TemplateType } from '../types/prd.types';
import { TEMPLATE_META } from '../types/prd.types';

interface PrdFormProps {
  formData: PrdFormData;
  isGenerating: boolean;
  onChange: (data: PrdFormData) => void;
  onGenerate: () => void;
}

interface FieldProps {
  label: string;
  hint: string;
  value: string;
  multiline?: boolean;
  rows?: number;
  onChange: (v: string) => void;
}

function Field({ label, hint, value, multiline = false, rows = 3, onChange }: FieldProps) {
  const base =
    'w-full bg-[#F5F5F2] border border-[#E4E4DF] rounded-lg px-3 py-2 text-[11px] text-[#18181B] placeholder-[#C0C0BC] focus:outline-none focus:border-green-400 focus:bg-white transition-colors resize-none leading-relaxed';

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={hint}
          className={base}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={hint}
          className={base}
        />
      )}
    </div>
  );
}

export default function PrdForm({ formData, isGenerating, onChange, onGenerate }: PrdFormProps) {
  const set = (key: keyof PrdFormData) => (value: string) =>
    onChange({ ...formData, [key]: value });

  const isValid =
    formData.productName.trim() &&
    formData.problemStatement.trim() &&
    formData.targetUsers.trim() &&
    formData.keyFeatures.trim();

  return (
    <div className="w-[360px] shrink-0 flex flex-col border-r border-[#E4E4DF] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#E4E4DF]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
            {TEMPLATE_META[formData.template].label}
          </span>
        </div>
        <h2 className="text-[13px] font-bold text-[#18181B] mt-2 leading-tight">
          Define your product
        </h2>
        <p className="text-[10px] text-[#A1A1AA] mt-0.5">
          Fill in the details below to generate a comprehensive PRD
        </p>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <Field
          label="Product Name"
          hint="e.g. Payments v2, User Onboarding Flow"
          value={formData.productName}
          onChange={set('productName')}
        />
        <Field
          label="Problem Statement"
          hint="What problem does this solve? Who feels it?"
          value={formData.problemStatement}
          multiline
          rows={3}
          onChange={set('problemStatement')}
        />
        <Field
          label="Target Users"
          hint="e.g. Mobile shoppers aged 18-35"
          value={formData.targetUsers}
          onChange={set('targetUsers')}
        />
        <Field
          label="Key Features"
          hint="List the main capabilities, one per line"
          value={formData.keyFeatures}
          multiline
          rows={4}
          onChange={set('keyFeatures')}
        />
        <Field
          label="Success Metrics"
          hint="e.g. Checkout conversion +15%, drop-off -30%"
          value={formData.successMetrics}
          onChange={set('successMetrics')}
        />
        <Field
          label="Out of Scope"
          hint="What are you explicitly NOT building?"
          value={formData.outOfScope}
          onChange={set('outOfScope')}
        />

        {/* Template switcher */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">
            Template
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(TEMPLATE_META) as TemplateType[]).map(t => (
              <button
                key={t}
                onClick={() => onChange({ ...formData, template: t })}
                className={`text-left px-2.5 py-2 rounded-lg border text-[10px] font-medium transition-all cursor-pointer ${
                  formData.template === t
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-[#F5F5F2] border-[#E4E4DF] text-[#71717A] hover:border-[#C8C8C2]'
                }`}
              >
                {TEMPLATE_META[t].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="px-5 py-4 border-t border-[#E4E4DF] bg-white">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          className={`w-full py-3 rounded-xl text-[12px] font-bold tracking-wide transition-all cursor-pointer ${
            isGenerating || !isValid
              ? 'bg-[#F0F0EC] text-[#A1A1AA] cursor-not-allowed'
              : 'bg-[#18181B] text-white hover:bg-[#27272A] active:scale-[0.99] shadow-sm hover:shadow-md'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate PRD'
          )}
        </button>
        {!isValid && !isGenerating && (
          <p className="text-[9px] text-[#A1A1AA] text-center mt-2">
            Fill in required fields to continue
          </p>
        )}
      </div>
    </div>
  );
}
