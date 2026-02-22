'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Language, LANGUAGES } from '@/lib/types';
import { HighlightedLine } from '@/lib/syntax';

interface CodePanelProps {
  code: Record<Language, string>;
  currentLine: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function CodePanel({
  code,
  currentLine,
  language,
  onLanguageChange,
}: CodePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const visitedLines = useRef<Set<number>>(new Set());

  const lines = useMemo(() => code[language].split('\n'), [code, language]);

  // Track visited lines
  useEffect(() => {
    if (currentLine > 0) {
      visitedLines.current.add(currentLine);
    }
  }, [currentLine]);

  // Reset visited lines when language changes
  useEffect(() => {
    visitedLines.current = new Set();
  }, [language]);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeLine = activeLineRef.current;
      const containerRect = container.getBoundingClientRect();
      const lineRect = activeLine.getBoundingClientRect();

      const lineTop = lineRect.top - containerRect.top + container.scrollTop;
      const lineCenter = lineTop - containerRect.height / 2 + lineRect.height / 2;

      container.scrollTo({
        top: Math.max(0, lineCenter),
        behavior: 'smooth',
      });
    }
  }, [currentLine]);

  return (
    <div className="code-block flex flex-col h-full overflow-hidden">
      {/* Language Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              language === lang.id
                ? 'bg-[rgba(102,126,234,0.2)] text-blue-300 border border-blue-500/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)]'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 font-mono text-sm leading-6">
        {lines.map((line, index) => {
          const lineNum = index + 1;
          const isActive = lineNum === currentLine;
          const isVisited = !isActive && visitedLines.current.has(lineNum);

          return (
            <div
              key={lineNum}
              ref={isActive ? activeLineRef : undefined}
              className={`flex items-start px-2 transition-colors duration-200 ${
                isActive
                  ? 'code-line-active'
                  : isVisited
                  ? 'code-line-visited'
                  : ''
              }`}
            >
              {/* Line Number */}
              <span
                className={`inline-block w-10 shrink-0 text-right pr-4 select-none text-xs leading-6 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-[var(--text-muted)]'
                }`}
              >
                {lineNum}
              </span>

              {/* Code Content */}
              <span className="flex-1 whitespace-pre">
                {isActive ? (
                  <motion.span
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HighlightedLine line={line} />
                  </motion.span>
                ) : (
                  <HighlightedLine line={line} />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
