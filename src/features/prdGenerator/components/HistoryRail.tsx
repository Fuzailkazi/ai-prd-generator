import type { PrdDocument, TemplateType } from '../types/prd.types';
import { TEMPLATE_META } from '../types/prd.types';

interface HistoryRailProps {
  history: PrdDocument[];
  activeTemplate: TemplateType;
  activeDocId: string | null;
  onTemplateSelect: (t: TemplateType) => void;
  onDocSelect: (doc: PrdDocument) => void;
  onDocDelete: (id: string) => void;
  onNewPrd: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function HistoryRail({
  history,
  activeTemplate,
  activeDocId,
  onTemplateSelect,
  onDocSelect,
  onDocDelete,
  onNewPrd,
}: HistoryRailProps) {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-[#E4E4DF] bg-[#F7F7F4] overflow-hidden">
      {/* Logo + New */}
      <div className="px-4 pt-5 pb-4 border-b border-[#E4E4DF]">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-tight text-[#18181B]">Prodably</span>
          <button
            onClick={onNewPrd}
            className="text-[10px] font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md px-2 py-1 transition-colors cursor-pointer"
          >
            + New
          </button>
        </div>
        <p className="text-[10px] text-[#A1A1AA] mt-1 leading-relaxed">
          AI-powered PRD generator
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {/* Templates */}
        <section>
          <p className="text-[9px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2 px-1">
            Templates
          </p>
          <div className="space-y-1">
            {(Object.keys(TEMPLATE_META) as TemplateType[]).map(t => (
              <button
                key={t}
                onClick={() => onTemplateSelect(t)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTemplate === t
                    ? 'bg-white border border-[#E4E4DF] shadow-sm'
                    : 'hover:bg-white/70'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold leading-tight ${
                    activeTemplate === t ? 'text-green-700' : 'text-[#3F3F46]'
                  }`}
                >
                  {TEMPLATE_META[t].label}
                </p>
                <p className="text-[9px] text-[#A1A1AA] mt-0.5 leading-tight">
                  {TEMPLATE_META[t].description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section>
            <p className="text-[9px] font-semibold text-[#A1A1AA] uppercase tracking-widest mb-2 px-1">
              Recent
            </p>
            <div className="space-y-1">
              {history.map(doc => (
                <div
                  key={doc.id}
                  className={`group relative rounded-lg px-3 py-2 cursor-pointer transition-all ${
                    activeDocId === doc.id
                      ? 'bg-white border border-[#E4E4DF] shadow-sm'
                      : 'hover:bg-white/70'
                  }`}
                  onClick={() => onDocSelect(doc)}
                >
                  <p className="text-[11px] font-medium text-[#3F3F46] truncate pr-5">
                    {doc.title}
                  </p>
                  <p className="text-[9px] text-[#A1A1AA] mt-0.5">{timeAgo(doc.createdAt)}</p>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDocDelete(doc.id);
                    }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-[#A1A1AA] hover:text-red-400 transition-all text-[10px] cursor-pointer"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#E4E4DF]">
        <a
          href="https://twitter.com/fuzailkazi_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-[#A1A1AA] hover:text-[#71717A] transition-colors"
        >
          by @fuzailkazi_
        </a>
      </div>
    </aside>
  );
}
