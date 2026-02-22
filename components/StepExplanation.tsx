'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepExplanationProps {
  explanation: string;
  stepNumber: number;
  totalSteps: number;
}

export default function StepExplanation({
  explanation,
  stepNumber,
  totalSteps,
}: StepExplanationProps) {
  return (
    <div
      className="relative pl-4 py-3"
      style={{
        borderLeft: '3px solid transparent',
        borderImage: 'var(--gradient-brand) 1',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-[var(--text-muted)]">
          {stepNumber + 1}/{totalSteps}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={`${stepNumber}-${explanation}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="text-sm text-[var(--text-secondary)] leading-relaxed"
        >
          {explanation}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
