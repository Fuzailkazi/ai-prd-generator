import { useState, useCallback } from 'react';
import { generatePrdStream, regenerateSectionContent } from '../services/generativeService';
import type { PrdFormData } from '../types/prd.types';

export function usePrdGeneration() {
  const [streamContent, setStreamContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (formData: PrdFormData): Promise<string> => {
    setIsGenerating(true);
    setStreamContent('');
    setError(null);
    let full = '';
    try {
      for await (const chunk of generatePrdStream(formData)) {
        full += chunk;
        setStreamContent(full);
      }
      return full;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Generation failed. Check your API key.';
      setError(msg);
      throw e;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const regenerateSection = useCallback(
    async (sectionTitle: string, formData: PrdFormData): Promise<string> => {
      return regenerateSectionContent(sectionTitle, formData);
    },
    [],
  );

  return { streamContent, isGenerating, error, generate, regenerateSection };
}
