'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrayVisualization, HIGHLIGHT_COLORS } from '@/lib/types';

interface ArrayBarsProps {
  visualization: ArrayVisualization;
}

function getColor(colorName: string | undefined) {
  if (!colorName || !HIGHLIGHT_COLORS[colorName]) {
    return HIGHLIGHT_COLORS['default'];
  }
  return HIGHLIGHT_COLORS[colorName];
}

export default function ArrayBars({ visualization }: ArrayBarsProps) {
  const { array, highlights, labels, auxData } = visualization;

  // Calculate box width based on array length
  const boxWidth = Math.max(48, Math.min(72, Math.floor(600 / Math.max(array.length, 1))));

  return (
    <div className="flex flex-col items-center gap-6 w-full py-4">
      {/* Array Boxes */}
      <div className="flex items-end justify-center gap-1.5 flex-wrap">
        {array.map((value, index) => {
          const color = getColor(highlights[index]);

          return (
            <motion.div
              key={index}
              layout
              layoutId={`array-el-${index}`}
              className="flex flex-col items-center gap-1"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Value Box */}
              <motion.div
                className={`flex items-center justify-center rounded-lg border-2 font-mono font-bold text-sm ${color.bg} ${color.border} ${color.text}`}
                style={{
                  width: boxWidth,
                  height: boxWidth,
                  minWidth: 48,
                  minHeight: 48,
                }}
                animate={{
                  scale: highlights[index] ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>

              {/* Index */}
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                {index}
              </span>

              {/* Label (pointer) */}
              {labels && labels[index] && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-blue-400 mt-0.5"
                >
                  {labels[index]}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Aux Data Table */}
      {auxData && auxData.entries.length > 0 && (
        <div className="w-full max-w-md">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            {auxData.label}
          </h4>
          <div className="glass rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="px-3 py-1.5 text-left text-xs text-[var(--text-muted)] font-medium">
                    Key
                  </th>
                  <th className="px-3 py-1.5 text-left text-xs text-[var(--text-muted)] font-medium">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {auxData.entries.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    <td className="px-3 py-1.5 font-mono text-[var(--text-secondary)]">
                      {entry.key}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-[var(--text-primary)]">
                      {entry.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
