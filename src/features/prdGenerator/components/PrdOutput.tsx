import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { PrdSection, PrdFormData } from '../types/prd.types';
import { getFormTitle } from '../types/prd.types';
import { parsePrdSections, stripMarkdown } from '../utils/parseSections';

interface PrdOutputProps {
  streamContent: string;
  isGenerating: boolean;
  error: string | null;
  formData: PrdFormData;
  onRegenerateSection: (title: string, formData: PrdFormData) => Promise<string>;
  onSectionsChange: (sections: PrdSection[]) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-14 h-14 rounded-2xl bg-[#F0F0EC] border border-[#E4E4DF] flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h3 className="text-[13px] font-semibold text-[#52525B] mb-1">Your PRD will appear here</h3>
      <p className="text-[11px] text-[#A1A1AA] max-w-[280px] leading-relaxed">
        Fill in the form and click Generate PRD. The document streams in section by section.
      </p>
      <div className="mt-6 space-y-2 w-full max-w-[320px]">
        {['Executive Summary', 'Problem Statement', 'User Stories', 'Requirements', 'Success Metrics'].map(s => (
          <div key={s} className="flex items-center gap-2 px-3 py-2 bg-[#F7F7F4] rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4D4D0]" />
            <span className="text-[10px] text-[#C0C0BC]">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SectionCardProps {
  section: PrdSection;
  onRegenerate: (title: string) => Promise<string>;
  onUpdate: (id: string, content: string) => void;
}

function SectionCard({ section, onRegenerate, onUpdate }: SectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editValue, setEditValue] = useState(section.content);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newContent = await onRegenerate(section.title);
      onUpdate(section.id, newContent);
      setEditValue(newContent);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    onUpdate(section.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className={`rounded-xl border bg-white transition-all ${isRegenerating ? 'border-green-200 opacity-70' : 'border-[#E4E4DF] hover:border-[#C8C8C2]'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0EC]">
        <h3 className="text-[11px] font-bold text-[#18181B] tracking-tight">{section.title}</h3>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[9px] text-[#A1A1AA] hover:text-[#52525B] px-2 py-1 rounded-md hover:bg-[#F5F5F2] transition-colors cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="text-[9px] text-[#A1A1AA] hover:text-green-600 px-2 py-1 rounded-md hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-40"
              >
                {isRegenerating ? (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 border border-green-400 border-t-transparent rounded-full animate-spin" />
                    Regenerating
                  </span>
                ) : (
                  '↺ Regenerate'
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="text-[9px] text-green-700 font-semibold px-2 py-1 rounded-md bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => { setEditValue(section.content); setIsEditing(false); }}
                className="text-[9px] text-[#A1A1AA] px-2 py-1 rounded-md hover:bg-[#F5F5F2] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      <div className="px-4 py-3">
        {isEditing ? (
          <textarea
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            className="w-full text-[11px] text-[#18181B] bg-[#F8F8F5] border border-[#E4E4DF] rounded-lg p-3 focus:outline-none focus:border-green-400 resize-none leading-relaxed"
            rows={8}
          />
        ) : (
          <div className="prose-prd text-[11px] text-[#3F3F46] leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-[13px] font-bold text-[#18181B] mb-2 mt-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-[12px] font-bold text-[#18181B] mb-2 mt-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-[11px] font-semibold text-[#18181B] mb-1.5 mt-2">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2 pl-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2 pl-2">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-[#18181B]">{children}</strong>,
                code: ({ children }) => <code className="bg-[#F0F0EC] px-1 py-0.5 rounded text-[10px]">{children}</code>,
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrdOutput({
  streamContent,
  isGenerating,
  error,
  formData,
  onRegenerateSection,
  onSectionsChange,
}: PrdOutputProps) {
  const [sections, setSections] = useState<PrdSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [copied, setCopied] = useState<'md' | 'text' | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const streamRef = useRef<HTMLDivElement>(null);

  // Parse sections when streaming ends
  useEffect(() => {
    if (!isGenerating && streamContent) {
      const parsed = parsePrdSections(streamContent);
      setSections(parsed);
      onSectionsChange(parsed);
      if (parsed.length > 0) setActiveSection(parsed[0].id);
    }
  }, [isGenerating, streamContent, onSectionsChange]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isGenerating && streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [streamContent, isGenerating]);

  const handleSectionUpdate = (id: string, content: string) => {
    setSections(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, content } : s));
      onSectionsChange(updated);
      return updated;
    });
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(streamContent);
    setCopied('md');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyPlainText = async () => {
    await navigator.clipboard.writeText(stripMarkdown(streamContent));
    setCopied('text');
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadMd = () => {
    const name = getFormTitle(formData);
    const blob = new Blob([streamContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}-prd.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
            <span className="text-red-400 text-lg">!</span>
          </div>
          <p className="text-[12px] font-semibold text-[#52525B] mb-1">Generation failed</p>
          <p className="text-[11px] text-[#A1A1AA]">{error}</p>
        </div>
      </div>
    );
  }

  if (!streamContent && !isGenerating) {
    return <EmptyState />;
  }

  return (
    <div className="w-full">
      {/* Export bar + section nav */}
      {(streamContent || isGenerating) && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          {/* Section nav pills */}
          {sections.length > 0 && !isGenerating && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`text-[9px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                    activeSection === s.id
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : 'bg-white text-[#71717A] border-[#E4E4DF] hover:border-[#C8C8C2] hover:text-[#18181B]'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}
          {isGenerating && (
            <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Writing your PRD...
            </span>
          )}

          {/* Export buttons */}
          {streamContent && !isGenerating && (
            <div className="flex items-center gap-1.5 ml-auto">
              <button onClick={copyMarkdown} className="text-[9px] font-medium text-[#71717A] hover:text-[#18181B] px-2.5 py-1.5 rounded-lg border border-[#E4E4DF] hover:border-[#C8C8C2] bg-white transition-colors cursor-pointer">
                {copied === 'md' ? '✓ Copied' : 'Copy MD'}
              </button>
              <button onClick={copyPlainText} className="text-[9px] font-medium text-[#71717A] hover:text-[#18181B] px-2.5 py-1.5 rounded-lg border border-[#E4E4DF] hover:border-[#C8C8C2] bg-white transition-colors cursor-pointer">
                {copied === 'text' ? '✓ Copied' : 'Copy Text'}
              </button>
              <button onClick={downloadMd} className="text-[9px] font-semibold text-white bg-[#18181B] hover:bg-green-700 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                Download .md
              </button>
            </div>
          )}
        </div>
      )}

      {/* Streaming view */}
      {isGenerating && (
        <div ref={streamRef} className="bg-white rounded-2xl border border-[#E4E4DF] px-8 py-6 shadow-sm">
          <div className="text-[11px] text-[#3F3F46] leading-relaxed whitespace-pre-wrap">
            {streamContent}
            <span className="inline-block w-0.5 h-3.5 bg-green-500 ml-0.5 animate-pulse align-middle" />
          </div>
        </div>
      )}

      {/* Sections view */}
      {!isGenerating && sections.length > 0 && (
        <div className="space-y-3">
          {sections.map(s => (
            <div key={s.id} ref={el => { sectionRefs.current[s.id] = el; }}>
              <SectionCard
                section={s}
                onRegenerate={title => onRegenerateSection(title, formData)}
                onUpdate={handleSectionUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
