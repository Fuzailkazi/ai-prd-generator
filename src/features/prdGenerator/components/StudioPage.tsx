import { useState, useCallback, useRef, useEffect } from 'react';
import type { PrdDocument, PrdFormData, PrdSection, TemplateType } from '../types/prd.types';
import { EMPTY_FORMS, getFormTitle, TEMPLATE_META } from '../types/prd.types';
import { usePrdGeneration } from '../hooks/usePrdGeneration';
import { usePrdHistory } from '../hooks/usePrdHistory';
import PrdForm from './PrdForm';
import PrdOutput from './PrdOutput';

type ViewState = 'idle' | 'generating' | 'done';

// ── History Dropdown ──────────────────────────────────────────────────────────

function HistoryDropdown({
  history,
  onSelect,
  onDelete,
}: {
  history: PrdDocument[];
  onSelect: (doc: PrdDocument) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (history.length === 0) return null;

  function timeAgo(ts: number) {
    const m = Math.floor((Date.now() - ts) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#52525B] hover:text-[#18181B] px-3 py-1.5 rounded-lg hover:bg-[#F0F0EC] transition-colors cursor-pointer"
      >
        History
        <span className="bg-[#E4E4DF] text-[#52525B] rounded-full px-1.5 py-0.5 text-[9px] font-bold">
          {history.length}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-[#E4E4DF] shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[#F0F0EC]">
            <p className="text-[9px] font-semibold text-[#A1A1AA] uppercase tracking-widest">
              Recent PRDs
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {history.map(doc => (
              <div
                key={doc.id}
                className="group flex items-center justify-between px-3 py-2.5 hover:bg-[#F7F7F4] cursor-pointer transition-colors"
                onClick={() => { onSelect(doc); setOpen(false); }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-[#18181B] truncate">{doc.title}</p>
                  <p className="text-[9px] text-[#A1A1AA] mt-0.5">
                    {TEMPLATE_META[doc.formData.template].label} · {timeAgo(doc.createdAt)}
                  </p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(doc.id); }}
                  className="opacity-0 group-hover:opacity-100 text-[#C0C0BC] hover:text-red-400 text-[11px] ml-2 transition-all cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [formData, setFormData] = useState<PrdFormData>(EMPTY_FORMS.feature);
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [, setActiveDocId] = useState<string | null>(null);
  const { streamContent, isGenerating, error, generate, regenerateSection } = usePrdGeneration();
  const { history, save, remove } = usePrdHistory();
  const outputRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setViewState('generating');
    try {
      const content = await generate(formData);
      const doc: PrdDocument = {
        id: crypto.randomUUID(),
        title: getFormTitle(formData),
        rawContent: content,
        formData,
        createdAt: Date.now(),
      };
      save(doc);
      setActiveDocId(doc.id);
      setViewState('done');
    } catch {
      setViewState('idle');
    }
  };

  const handleFormChange = (data: PrdFormData) => {
    if (data.template !== formData.template) {
      setFormData(EMPTY_FORMS[data.template]);
    } else {
      setFormData(data);
    }
  };

  const handleDocSelect = (doc: PrdDocument) => {
    setFormData(doc.formData);
    setActiveDocId(doc.id);
    setViewState('done');
  };

  const handleNewPrd = () => {
    setFormData(EMPTY_FORMS[formData.template]);
    setActiveDocId(null);
    setViewState('idle');
  };

  const handleTemplateSelect = (t: TemplateType) => {
    setFormData(EMPTY_FORMS[t]);
  };

  const handleSectionsChange = useCallback((_sections: PrdSection[]) => {}, []);

  // Scroll to output when generation starts
  useEffect(() => {
    if (viewState !== 'idle' && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [viewState]);

  // Cmd+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && viewState === 'idle') {
        handleGenerate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewState, formData]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] overflow-x-hidden" style={{ backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(22,163,74,0.07) 0%, transparent 70%)' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-[#E8E8E3]">
        <button
          onClick={handleNewPrd}
          className="text-[15px] font-black tracking-tight text-[#18181B] hover:text-green-700 transition-colors cursor-pointer"
        >
          ChatPRD
        </button>
        <div className="flex items-center gap-2">
          <HistoryDropdown history={history} onSelect={handleDocSelect} onDelete={remove} />
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {viewState === 'idle' && (
        <main className="flex flex-col items-center px-6 pt-16 pb-32">

          {/* Badge */}
          <a
            href="https://twitter.com/fuzailkazi_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white border border-[#E4E4DF] rounded-full px-3 py-1.5 shadow-sm mb-8 hover:border-[#C8C8C2] transition-colors"
          >
            <span className="text-[10px] font-semibold text-[#52525B] tracking-wide">
              built by @fuzailkazi_
            </span>
          </a>

          {/* Headline */}
          <h1 className="text-[42px] sm:text-[52px] font-black text-[#18181B] text-center leading-[1.1] tracking-tight max-w-[640px] mb-4">
            Generate PRDs{' '}
            <span className="text-green-600">in seconds.</span>
          </h1>
          <p className="text-[13px] text-[#71717A] text-center max-w-[420px] leading-relaxed mb-10">
            Describe your product idea. Get a comprehensive, structured PRD ready to share with your team.
          </p>

          {/* Template tabs */}
          <div className="flex items-center gap-2 flex-wrap justify-center mb-6">
            {(Object.keys(TEMPLATE_META) as TemplateType[]).map(t => (
              <button
                key={t}
                onClick={() => handleTemplateSelect(t)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                  formData.template === t
                    ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm'
                    : 'bg-white text-[#52525B] border-[#E4E4DF] hover:border-[#18181B] hover:text-[#18181B]'
                }`}
              >
                {TEMPLATE_META[t].label}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div className="w-full max-w-[640px] bg-white rounded-2xl border border-[#E4E4DF] shadow-xl shadow-black/[0.04] overflow-hidden">
            <PrdForm
              formData={formData}
              isGenerating={isGenerating}
              onChange={handleFormChange}
              onGenerate={handleGenerate}
              layout="card"
            />
          </div>

          <p className="text-[10px] text-[#C0C0BC] mt-4 tracking-wide">
            ⌘ + Enter to generate
          </p>
        </main>
      )}

      {/* ── Output ───────────────────────────────────────────────────────────── */}
      {viewState !== 'idle' && (
        <div ref={outputRef}>
          {/* Compact form recap */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E4E4DF]">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-[#18181B]">
                {getFormTitle(formData)}
              </span>
              <span className="text-[9px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                {TEMPLATE_META[formData.template].label}
              </span>
            </div>
            <button
              onClick={handleNewPrd}
              className="text-[11px] font-semibold text-[#52525B] hover:text-[#18181B] px-3 py-1.5 rounded-lg border border-[#E4E4DF] hover:border-[#C8C8C2] bg-white transition-colors cursor-pointer"
            >
              + New PRD
            </button>
          </div>

          <main className="max-w-[860px] mx-auto px-6 py-8">
            <PrdOutput
              streamContent={streamContent}
              isGenerating={isGenerating}
              error={error}
              formData={formData}
              onRegenerateSection={regenerateSection}
              onSectionsChange={handleSectionsChange}
            />
          </main>
        </div>
      )}
    </div>
  );
}
