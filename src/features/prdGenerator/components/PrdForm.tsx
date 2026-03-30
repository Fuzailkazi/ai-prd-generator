import type { PrdFormData } from '../types/prd.types';
import { TEMPLATE_META, TEMPLATE_FIELDS } from '../types/prd.types';

interface PrdFormProps {
  formData: PrdFormData;
  isGenerating: boolean;
  onChange: (data: PrdFormData) => void;
  onGenerate: () => void;
  layout?: 'card' | 'panel';
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
    'w-full bg-[#F7F7F4] border border-[#E8E8E3] rounded-lg px-3 py-2.5 text-[11px] text-[#18181B] placeholder-[#C0C0BC] focus:outline-none focus:border-green-400 focus:bg-white transition-colors resize-none leading-relaxed';

  return (
    <div>
      <label className="block text-[9px] font-bold text-[#71717A] uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={hint} className={base} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={hint} className={base} />
      )}
    </div>
  );
}

export default function PrdForm({ formData, isGenerating, onChange, onGenerate, layout = 'panel' }: PrdFormProps) {
  const fields = TEMPLATE_FIELDS[formData.template];
  const data = formData as unknown as Record<string, string>;
  const setField = (key: string) => (value: string) =>
    onChange({ ...formData, [key]: value } as PrdFormData);

  const firstTwoKeys = fields.slice(0, 2).map(f => f.key);
  const isValid = firstTwoKeys.every(k => data[k]?.trim());

  if (layout === 'card') {
    return (
      <div>
        {/* Card header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F0F0EC]">
          <p className="text-[10px] font-semibold text-[#A1A1AA]">
            {TEMPLATE_META[formData.template].description}
          </p>
        </div>

        {/* Fields — 2-col grid for single-line, full-width for multiline */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {fields.map(field => (
            <div key={field.key} className={field.multiline ? 'col-span-2' : 'col-span-1'}>
              <Field
                label={field.label}
                hint={field.hint}
                value={data[field.key] || ''}
                multiline={field.multiline}
                rows={field.rows ? Math.max(2, field.rows - 1) : 2}
                onChange={setField(field.key)}
              />
            </div>
          ))}
        </div>

        {/* Generate button */}
        <div className="px-6 pb-6">
          <button
            onClick={onGenerate}
            disabled={isGenerating || !isValid}
            className={`w-full py-3.5 rounded-xl text-[12px] font-black tracking-wide transition-all cursor-pointer ${
              isGenerating || !isValid
                ? 'bg-[#F0F0EC] text-[#C0C0BC] cursor-not-allowed'
                : 'bg-[#18181B] text-white hover:bg-green-700 active:scale-[0.99] shadow-sm'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating your PRD...
              </span>
            ) : (
              'Generate PRD →'
            )}
          </button>
        </div>
      </div>
    );
  }

  // panel layout (legacy, kept for compatibility)
  return (
    <div className="w-[360px] shrink-0 flex flex-col border-r border-[#E4E4DF] bg-white overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[#E4E4DF]">
        <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-0.5">
          {TEMPLATE_META[formData.template].label}
        </span>
        <h2 className="text-[13px] font-bold text-[#18181B] mt-2">Define your product</h2>
        <p className="text-[10px] text-[#A1A1AA] mt-0.5">{TEMPLATE_META[formData.template].description}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {fields.map(field => (
          <Field key={field.key} label={field.label} hint={field.hint} value={data[field.key] || ''} multiline={field.multiline} rows={field.rows} onChange={setField(field.key)} />
        ))}
      </div>
      <div className="px-5 py-4 border-t border-[#E4E4DF]">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          className={`w-full py-3 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${isGenerating || !isValid ? 'bg-[#F0F0EC] text-[#A1A1AA] cursor-not-allowed' : 'bg-[#18181B] text-white hover:bg-[#27272A]'}`}
        >
          {isGenerating ? 'Generating...' : 'Generate PRD'}
        </button>
      </div>
    </div>
  );
}
