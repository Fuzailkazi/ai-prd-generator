import { useState, useCallback } from 'react';
import type { PrdDocument, PrdFormData, PrdSection, TemplateType } from '../types/prd.types';
import { EMPTY_FORM } from '../types/prd.types';
import { usePrdGeneration } from '../hooks/usePrdGeneration';
import { usePrdHistory } from '../hooks/usePrdHistory';
import HistoryRail from './HistoryRail';
import PrdForm from './PrdForm';
import PrdOutput from './PrdOutput';

export default function StudioPage() {
  const [formData, setFormData] = useState<PrdFormData>(EMPTY_FORM);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const { streamContent, isGenerating, error, generate, regenerateSection } = usePrdGeneration();
  const { history, save, remove } = usePrdHistory();

  const handleGenerate = async () => {
    try {
      const content = await generate(formData);
      const doc: PrdDocument = {
        id: crypto.randomUUID(),
        title: formData.productName || 'Untitled PRD',
        rawContent: content,
        formData,
        createdAt: Date.now(),
      };
      save(doc);
      setActiveDocId(doc.id);
    } catch {
      // error is set in hook
    }
  };

  const handleDocSelect = (doc: PrdDocument) => {
    setFormData(doc.formData);
    setActiveDocId(doc.id);
  };

  const handleTemplateSelect = (t: TemplateType) => {
    setFormData(prev => ({ ...prev, template: t }));
  };

  const handleNewPrd = () => {
    setFormData(EMPTY_FORM);
    setActiveDocId(null);
  };

  const handleSectionsChange = useCallback((_sections: PrdSection[]) => {
    // Could persist section edits back to history here if needed
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F8F8F5] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <HistoryRail
          history={history}
          activeTemplate={formData.template}
          activeDocId={activeDocId}
          onTemplateSelect={handleTemplateSelect}
          onDocSelect={handleDocSelect}
          onDocDelete={remove}
          onNewPrd={handleNewPrd}
        />
        <PrdForm
          formData={formData}
          isGenerating={isGenerating}
          onChange={setFormData}
          onGenerate={handleGenerate}
        />
        <PrdOutput
          streamContent={streamContent}
          isGenerating={isGenerating}
          error={error}
          formData={formData}
          onRegenerateSection={regenerateSection}
          onSectionsChange={handleSectionsChange}
        />
      </div>
    </div>
  );
}
