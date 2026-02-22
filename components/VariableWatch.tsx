'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface VariableWatchProps {
  variables: Record<string, unknown>;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`;
  }
  try {
    return JSON.stringify(value, null, 0);
  } catch {
    return String(value);
  }
}

export default function VariableWatch({ variables }: VariableWatchProps) {
  const prevVarsRef = useRef<Record<string, string>>({});
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());

  const entries = Object.entries(variables);

  useEffect(() => {
    const newChanged = new Set<string>();
    const currentFormatted: Record<string, string> = {};

    for (const [key, val] of entries) {
      const formatted = formatValue(val);
      currentFormatted[key] = formatted;
      if (prevVarsRef.current[key] !== undefined && prevVarsRef.current[key] !== formatted) {
        newChanged.add(key);
      }
    }

    prevVarsRef.current = currentFormatted;
    setChangedKeys(newChanged);

    if (newChanged.size > 0) {
      const timer = setTimeout(() => setChangedKeys(new Set()), 600);
      return () => clearTimeout(timer);
    }
  }, [variables]); // eslint-disable-line react-hooks/exhaustive-deps

  if (entries.length === 0) return null;

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
        Variables
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {entries.map(([key, val]) => {
          const isChanged = changedKeys.has(key);
          return (
            <motion.div
              key={key}
              animate={
                isChanged
                  ? {
                      backgroundColor: [
                        'rgba(102, 126, 234, 0.2)',
                        'rgba(18, 18, 26, 0.6)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
            >
              <span className="text-xs text-[var(--text-muted)]">{key}</span>
              <span className="text-sm font-mono text-[var(--text-primary)] truncate" title={formatValue(val)}>
                {formatValue(val)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
