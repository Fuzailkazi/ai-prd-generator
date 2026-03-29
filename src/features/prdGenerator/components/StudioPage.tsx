import { useState, useCallback } from 'react';
import type { PrdDocument, PrdFormData, PrdSection, TemplateType } from '../types/prd.types';
import { EMPTY_FORMS, getFormTitle } from '../types/prd.types';
import { usePrdGeneration } from '../hooks/usePrdGeneration';
import { usePrdHistory } from '../hooks/usePrdHistory';
import HistoryRail from './HistoryRail';
import PrdForm from './PrdForm';
import PrdOutput from './PrdOutput';

export default function StudioPage() {
  const [formData, setFormData] = useState<PrdFormData>(EMPTY_FORMS.feature);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const { streamContent, isGenerating, error, generate, regenerateSection } = usePrdGeneration();
  const { history, save, remove } = usePrdHistory();

  const handleGenerate = async () => {
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
    } catch {
      // error surfaced via hook
    }
  };

  const handleFormChange = (data: PrdFormData) => {
    // Reset form when template switches
    if (data.template !== formData.template) {
      setFormData(EMPTY_FORMS[data.template]);
    } else {
      setFormData(data);
    }
  };

  const handleDocSelect = (doc: PrdDocument) => {
    setFormData(doc.formData);
    setActiveDocId(doc.id);
  };

  const handleTemplateSelect = (t: TemplateType) => {
    setFormData(EMPTY_FORMS[t]);
    setActiveDocId(null);
  };

  const handleNewPrd = () => {
    setFormData(EMPTY_FORMS[formData.template]);
    setActiveDocId(null);
  };

  const handleSectionsChange = useCallback((_sections: PrdSection[]) => {}, []);

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
          onChange={handleFormChange}
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
