'use client';

import { useState } from 'react';

interface CsvActionKeywordInputProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  placeholder: string;
}

export function parseActionKeywords(text: string): string[] {
  return text.split(',').map((v) => v.trim()).filter(Boolean);
}

function sameKeywords(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * A comma-separated keyword list. The field shows the text as typed and
 * reports the parsed list; rendering the parsed list back would strip a
 * trailing comma or space the moment it is typed, so neither could be
 * entered. A list replaced from outside (a loaded saved mapping) resets it.
 */
export function CsvActionKeywordInput({ keywords, onKeywordsChange, placeholder }: CsvActionKeywordInputProps) {
  const [draft, setDraft] = useState(() => keywords.join(', '));
  const [lastKeywords, setLastKeywords] = useState(keywords);

  if (!sameKeywords(keywords, lastKeywords)) {
    setLastKeywords(keywords);
    if (!sameKeywords(keywords, parseActionKeywords(draft))) {
      setDraft(keywords.join(', '));
    }
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        onKeywordsChange(parseActionKeywords(e.target.value));
      }}
      placeholder={placeholder}
      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    />
  );
}
