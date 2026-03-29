import type { PrdFormData } from '../types/prd.types';
import { TEMPLATE_META, TEMPLATE_FIELDS } from '../types/prd.types';

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
  const fields = TEMPLATE_FIELDS[formData.template];
  const data = formData as unknown as Record<string, string>;

  const setField = (key: string) => (value: string) =>
    onChange({ ...formData, [key]: value } as PrdFormData);

  // Require first 2 fields to be filled
  const firstTwoKeys = fields.slice(0, 2).map(f => f.key);
  const isValid = firstTwoKeys.every(k => data[k]?.trim());

  return (
    <div className="w-[360px] shrink-0 flex flex-col border-r border-[#E4E4DF] bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#E4E4DF]">
        <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
          {TEMPLATE_META[formData.template].label}
        </span>
        <h2 className="text-[13px] font-bold text-[#18181B] mt-2 leading-tight">
          Define your product
        </h2>
        <p className="text-[10px] text-[#A1A1AA] mt-0.5">
          {TEMPLATE_META[formData.template].description}
        </p>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {fields.map(field => (
          <Field
            key={field.key}
            label={field.label}
            hint={field.hint}
            value={data[field.key] || ''}
            multiline={field.multiline}
            rows={field.rows}
            onChange={setField(field.key)}
          />
        ))}

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
            Fill in the first two fields to continue
          </p>
        )}
      </div>
    </div>
  );
}
