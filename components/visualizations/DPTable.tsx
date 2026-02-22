'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DPVisualization, HIGHLIGHT_COLORS } from '@/lib/types';

interface DPTableProps {
  visualization: DPVisualization;
}

function getColor(colorName: string | undefined) {
  if (!colorName || !HIGHLIGHT_COLORS[colorName]) {
    return HIGHLIGHT_COLORS['default'];
  }
  return HIGHLIGHT_COLORS[colorName];
}

export default function DPTable({ visualization }: DPTableProps) {
  const { values, highlights, labels } = visualization;
  const prevValuesRef = useRef<(number | null)[]>([]);
  const [justFilled, setJustFilled] = useState<Set<number>>(new Set());

  useEffect(() => {
    const newFilled = new Set<number>();
    for (let i = 0; i < values.length; i++) {
      if (
        values[i] !== null &&
        (prevValuesRef.current[i] === null || prevValuesRef.current[i] === undefined)
      ) {
        newFilled.add(i);
      }
    }

    prevValuesRef.current = [...values];
    setJustFilled(newFilled);

    if (newFilled.size > 0) {
      const timer = setTimeout(() => setJustFilled(new Set()), 500);
      return () => clearTimeout(timer);
    }
  }, [values]);

  return (
    <div className="flex flex-col items-center gap-4 w-full py-4 overflow-x-auto">
      <div className="flex items-start gap-1.5">
        {values.map((value, index) => {
          const color = getColor(highlights[index]);
          const isFilled = justFilled.has(index);
          const label = labels[index];

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {/* Cell */}
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 font-mono font-bold text-sm ${color.bg} ${color.border} ${color.text}`}
                animate={
                  isFilled
                    ? { scale: [1, 1.15, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {value !== null ? value : ''}
              </motion.div>

              {/* Label */}
              {label !== undefined && (
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
