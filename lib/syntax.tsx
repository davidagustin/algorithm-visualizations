import React from 'react';

const KEYWORDS = new Set([
  'function', 'return', 'if', 'else', 'elif', 'for', 'while', 'do',
  'const', 'let', 'var', 'def', 'class', 'import', 'from', 'in',
  'not', 'and', 'or', 'true', 'false', 'True', 'False', 'null',
  'None', 'new', 'this', 'void', 'int', 'String', 'boolean',
  'public', 'private', 'static', 'Map', 'HashMap', 'List',
  'ArrayList', 'int[]', 'break', 'continue', 'switch', 'case',
  'throw', 'try', 'catch', 'finally', 'extends', 'implements',
  'interface', 'package', 'range', 'len', 'append', 'pop',
  'push', 'get', 'put', 'set', 'has', 'delete', 'Math',
  'max', 'min', 'abs', 'create', 'initialize', 'empty',
  'exists', 'length', 'size', 'END', 'FUNCTION', 'RETURN',
  'IF', 'ELSE', 'FOR', 'WHILE', 'TO', 'DO', 'THEN',
]);

const TOKEN_REGEX = /(\/\/.*$|#[^{].*$|"[^"]*"|'[^']*'|\b\d+\.?\d*\b|[a-zA-Z_]\w*|\S)/gm;

interface Token {
  text: string;
  className: string;
}

function classifyToken(text: string): string {
  if (text.startsWith('//') || text.startsWith('#')) return 'text-gray-500 italic';
  if (text.startsWith('"') || text.startsWith("'")) return 'text-emerald-400';
  if (/^\d+\.?\d*$/.test(text)) return 'text-amber-400';
  if (KEYWORDS.has(text)) return 'text-purple-400 font-medium';
  if (/^[a-zA-Z_]\w*$/.test(text)) return 'text-gray-200';
  return 'text-gray-400';
}

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(TOKEN_REGEX)) {
    const idx = match.index!;
    if (idx > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, idx), className: '' });
    }
    tokens.push({ text: match[0], className: classifyToken(match[0]) });
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), className: '' });
  }

  return tokens;
}

export function HighlightedLine({ line }: { line: string }) {
  const tokens = tokenizeLine(line);
  return (
    <>
      {tokens.map((t, i) =>
        t.className ? (
          <span key={i} className={t.className}>{t.text}</span>
        ) : (
          <React.Fragment key={i}>{t.text}</React.Fragment>
        )
      )}
    </>
  );
}
