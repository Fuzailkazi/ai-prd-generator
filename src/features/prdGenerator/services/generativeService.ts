import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { buildPrdTemplatePrompt, buildSectionRegenerationPrompt } from '../utils/promptTemplate';
import type { PrdFormData } from '../types/prd.types';

// Primary model first; fall back to less-loaded models when the primary is
// overloaded (Gemini returns a transient 503 under high demand).
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
const MAX_RETRIES = 3;

function getModel(modelName: string): GenerativeModel {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  return genAI.getGenerativeModel({ model: modelName });
}

function isTransient(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  // Gemini surfaces overload/rate-limit as 503/429/500 with these markers.
  return /\b(429|500|503)\b|overloaded|high demand|UNAVAILABLE|rate limit/i.test(message);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs `fn` against each model in MODELS in order. Each model gets retried with
 * exponential backoff on transient errors; if it stays overloaded, we advance to
 * the next model. Non-transient errors throw immediately.
 */
async function withModelFallback<T>(fn: (model: GenerativeModel) => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (const modelName of MODELS) {
    const model = getModel(modelName);
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        return await fn(model);
      } catch (error) {
        lastError = error;
        if (!isTransient(error)) throw error;
        if (attempt < MAX_RETRIES) {
          await sleep(500 * 2 ** attempt + Math.random() * 250);
        }
      }
    }
    // Primary exhausted its retries while overloaded — fall through to next model.
  }
  throw lastError;
}

export async function* generatePrdStream(formData: PrdFormData): AsyncGenerator<string> {
  const prompt = buildPrdTemplatePrompt(formData);
  const result = await withModelFallback((model) => model.generateContentStream(prompt));
  for await (const chunk of result.stream) {
    yield chunk.text();
  }
}

export async function regenerateSectionContent(
  sectionTitle: string,
  formData: PrdFormData,
): Promise<string> {
  const prompt = buildSectionRegenerationPrompt(sectionTitle, formData);
  const result = await withModelFallback((model) => model.generateContent(prompt));
  return result.response.text();
}
