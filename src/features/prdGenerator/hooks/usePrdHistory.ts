import { useState, useCallback } from 'react';
import type { PrdDocument } from '../types/prd.types';

const STORAGE_KEY = 'prodably_history';
const MAX_ITEMS = 20;

function loadFromStorage(): PrdDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(docs: PrdDocument[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function usePrdHistory() {
  const [history, setHistory] = useState<PrdDocument[]>(loadFromStorage);

  const save = useCallback((doc: PrdDocument) => {
    setHistory(prev => {
      const updated = [doc, ...prev.filter(d => d.id !== doc.id)].slice(0, MAX_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(d => d.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return { history, save, remove };
}
