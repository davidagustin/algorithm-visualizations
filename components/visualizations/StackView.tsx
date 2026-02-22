'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StackVisualization, HIGHLIGHT_COLORS } from '@/lib/types';

interface StackViewProps {
  visualization: StackVisualization;
}

const ACTION_STYLES: Record<string, { color: string; label: string }> = {
  push:     { color: 'text-emerald-400', label: 'PUSH' },
  pop:      { color: 'text-rose-400',    label: 'POP' },
  match:    { color: 'text-emerald-400', label: 'MATCH' },
  mismatch: { color: 'text-rose-400',    label: 'MISMATCH' },
  idle:     { color: 'text-[var(--text-muted)]', label: 'IDLE' },
};

export default function StackView({ visualization }: StackViewProps) {
  const { items, inputChars, currentIndex, action } = visualization;
  const actionStyle = action ? ACTION_STYLES[action] || ACTION_STYLES.idle : null;

  return (
    <div className="flex items-start justify-center gap-8 w-full py-4 flex-wrap">
      {/* Input String */}
      <div className="flex flex-col items-center gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Input
        </h4>
        <div className="flex gap-1">
          {inputChars.map((char, i) => {
            const isCurrent = i === currentIndex;
            const isPast = i < currentIndex;
            const colors = isCurrent
              ? HIGHLIGHT_COLORS['active']
              : isPast
              ? HIGHLIGHT_COLORS['visited']
              : HIGHLIGHT_COLORS['default'];

            return (
              <motion.div
                key={i}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 font-mono font-bold text-sm ${colors.bg} ${colors.border} ${colors.text}`}
                animate={
                  isCurrent
                    ? { scale: [1, 1.1, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
              >
                {char}
              </motion.div>
            );
          })}
        </div>
        {/* Position indicator arrow */}
        <div className="flex gap-1">
          {inputChars.map((_, i) => (
            <div key={i} className="w-10 flex justify-center">
              {i === currentIndex && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-blue-400 text-xs font-bold"
                >
                  ^
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="flex flex-col items-center gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
          Stack
        </h4>

        {/* Action indicator */}
        {actionStyle && action !== 'idle' && (
          <motion.span
            key={action}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${actionStyle.color}`}
            style={{
              background:
                action === 'push' || action === 'match'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : action === 'pop' || action === 'mismatch'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'transparent',
            }}
          >
            {actionStyle.label}
          </motion.span>
        )}

        {/* Stack container */}
        <div
          className="flex flex-col-reverse items-center gap-1 min-h-[120px] border-b-2 border-l-2 border-r-2 border-[var(--border-default)] rounded-b-lg px-2 pb-2 pt-1"
          style={{ minWidth: 64 }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const isTop = i === items.length - 1;
              const colors = isTop
                ? HIGHLIGHT_COLORS['active']
                : HIGHLIGHT_COLORS['default'];

              return (
                <motion.div
                  key={`${item}-${i}`}
                  layout
                  initial={{ opacity: 0, y: -30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={`flex items-center justify-center w-14 h-10 rounded-lg border-2 font-mono font-bold text-sm ${colors.bg} ${colors.border} ${colors.text}`}
                >
                  {item}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {items.length === 0 && (
            <span className="text-xs text-[var(--text-muted)] italic py-6">
              empty
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
