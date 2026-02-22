'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
}

const SPEEDS = [0.5, 1, 1.5, 2];

// SVG Icon components
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function StepForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6h2v12h-2zm-10 6l8.5-6v12z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 1 3.3-6.9" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}

export default function Controls({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
}: ControlsProps) {
  const isAtStart = currentStep <= 0;
  const isAtEnd = currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="glass-strong rounded-xl px-4 py-3">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-[var(--bg-overlay)] rounded-full mb-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--gradient-brand)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isAtStart && !isPlaying}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Reset"
          >
            <ResetIcon />
          </button>

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={isAtStart}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step backward"
          >
            <StepBackIcon />
          </button>

          {/* Play/Pause */}
          <motion.button
            onClick={onTogglePlay}
            disabled={isAtEnd && !isPlaying}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: isPlaying
                ? 'rgba(239, 68, 68, 0.3)'
                : 'var(--gradient-brand)',
              border: isPlaying
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(102, 126, 234, 0.4)',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={isAtEnd}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Step forward"
          >
            <StepForwardIcon />
          </button>
        </div>

        {/* Step Counter */}
        <div className="text-sm text-[var(--text-secondary)] font-mono tabular-nums">
          Step{' '}
          <span className="text-[var(--text-primary)] font-semibold">
            {currentStep + 1}
          </span>{' '}
          of{' '}
          <span className="text-[var(--text-primary)] font-semibold">
            {totalSteps}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-[var(--text-muted)] mr-1">Speed:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all duration-200 ${
                speed === s
                  ? 'bg-[rgba(102,126,234,0.2)] text-blue-300 border border-blue-500/30'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)]'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
