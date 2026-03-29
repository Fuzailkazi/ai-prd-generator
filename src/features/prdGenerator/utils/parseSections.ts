import type { PrdSection } from '../types/prd.types';

export function parsePrdSections(content: string): PrdSection[] {
  const lines = content.split('\n');
  const sections: PrdSection[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];

  const flush = () => {
    const body = currentLines.join('\n').trim();
    if (currentTitle && body) {
      sections.push({
        id: crypto.randomUUID(),
        title: currentTitle,
        content: body,
      });
    }
  };

  for (const line of lines) {
    // Match ## 1. Title  or  ## Title
    const h2Match = line.match(/^##\s+(?:\d+\.\s+)?(.+)$/);
    if (h2Match) {
      flush();
      currentTitle = h2Match[1].trim();
      currentLines = [];
      continue;
    }
    if (currentTitle) {
      currentLines.push(line);
    }
  }
  flush();

  return sections;
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
