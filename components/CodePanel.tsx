'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, LANGUAGES } from '@/lib/types';
import { HighlightedLine } from '@/lib/syntax';

interface CodePanelProps {
  code: Record<Language, string>;
  currentLine: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];
const TAB_SIZES = [2, 4, 8];

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-500' : 'bg-[var(--border-strong)]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
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
  const settingsRef = useRef<HTMLDivElement>(null);

  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [wordWrap, setWordWrap] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const rawLines = useMemo(() => code[language].split('\n'), [code, language]);

  // Detect the base indent unit in the source code (smallest non-zero leading whitespace)
  const baseIndent = useMemo(() => {
    let minIndent = Infinity;
    for (const line of rawLines) {
      if (line.trim().length === 0) continue;
      const leading = line.match(/^( +)/);
      if (leading && leading[1].length > 0 && leading[1].length < minIndent) {
        minIndent = leading[1].length;
      }
    }
    return minIndent === Infinity ? 2 : minIndent;
  }, [rawLines]);

  // Re-indent lines when tabSize changes
  const lines = useMemo(() => {
    if (tabSize === baseIndent) return rawLines;
    return rawLines.map((line) => {
      const leading = line.match(/^( *)/);
      if (!leading || leading[1].length === 0) return line;
      const level = Math.round(leading[1].length / baseIndent);
      return ' '.repeat(level * tabSize) + line.trimStart();
    });
  }, [rawLines, tabSize, baseIndent]);

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

  // Close settings on outside click
  useEffect(() => {
    if (!showSettings) return;
    function handleClick(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings]);

  const lineHeight = Math.round(fontSize * 1.7);

  return (
    <div className="code-block flex flex-col h-full overflow-hidden">
      {/* Header: Language Tabs + Settings */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
        <div className="flex items-center gap-1">
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

        {/* Settings Button */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`p-1.5 rounded-md transition-all duration-200 ${
              showSettings
                ? 'text-blue-300 bg-[rgba(102,126,234,0.2)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)]'
            }`}
            title="Editor Settings"
          >
            <SettingsIcon />
          </button>

          {/* Settings Dropdown */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 z-50 w-64 glass-strong rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Editor Settings
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col gap-3.5">
                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Font size</span>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="bg-[var(--bg-overlay)] text-xs text-[var(--text-primary)] border border-[var(--border-default)] rounded-md px-2 py-1 outline-none focus:border-blue-500/50"
                    >
                      {FONT_SIZES.map((s) => (
                        <option key={s} value={s}>{s}px</option>
                      ))}
                    </select>
                  </div>

                  {/* Tab Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Tab size</span>
                    <select
                      value={tabSize}
                      onChange={(e) => setTabSize(Number(e.target.value))}
                      className="bg-[var(--bg-overlay)] text-xs text-[var(--text-primary)] border border-[var(--border-default)] rounded-md px-2 py-1 outline-none focus:border-blue-500/50"
                    >
                      {TAB_SIZES.map((s) => (
                        <option key={s} value={s}>{s} spaces</option>
                      ))}
                    </select>
                  </div>

                  {/* Word Wrap */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Word wrap</span>
                    <Toggle checked={wordWrap} onChange={setWordWrap} />
                  </div>

                  {/* Line Numbers */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Line numbers</span>
                    <Toggle checked={showLineNumbers} onChange={setShowLineNumbers} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Code Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-3 font-mono"
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
      >
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
              style={{ minHeight: `${lineHeight}px` }}
            >
              {/* Line Number */}
              {showLineNumbers && (
                <span
                  className={`inline-block w-10 shrink-0 text-right pr-4 select-none ${
                    isActive ? 'text-blue-400 font-bold' : 'text-[var(--text-muted)]'
                  }`}
                  style={{ fontSize: `${Math.max(fontSize - 2, 10)}px`, lineHeight: `${lineHeight}px` }}
                >
                  {lineNum}
                </span>
              )}

              {/* Code Content */}
              <span
                className="flex-1"
                style={{
                  whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                  wordBreak: wordWrap ? 'break-all' : undefined,
                }}
              >
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
