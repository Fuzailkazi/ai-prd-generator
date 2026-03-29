import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrdTemplatePrompt, buildSectionRegenerationPrompt } from '../utils/promptTemplate';
import type { PrdFormData } from '../types/prd.types';

function getModel() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

export async function* generatePrdStream(formData: PrdFormData): AsyncGenerator<string> {
  const model = getModel();
  const prompt = buildPrdTemplatePrompt(formData);
  const result = await model.generateContentStream(prompt);
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

export async function regenerateSectionContent(
  sectionTitle: string,
  formData: PrdFormData,
): Promise<string> {
  const model = getModel();
  const prompt = buildSectionRegenerationPrompt(sectionTitle, formData);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
