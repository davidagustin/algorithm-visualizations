'use client';

import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
}

const SPEEDS = [0.5, 1, 1.5, 2];

// SVG Icon components — filled shapes for crisp rendering at small sizes
function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="5" width="3" height="14" rx="1" />
      <path d="M20 5.14v13.72a1 1 0 0 1-1.5.86l-9-5.63a1 1 0 0 1 0-1.72l9-5.63a1 1 0 0 1 1.5.86z" />
    </svg>
  );
}

function StepForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5.14v13.72a1 1 0 0 0 1.5.86l9-5.63a1 1 0 0 0 0-1.72l-9-5.63A1 1 0 0 0 4 5.14z" />
      <rect x="17" y="5" width="3" height="14" rx="1" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4z" />
    </svg>
  );
}

export default function Controls({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
}: ControlsProps) {
  const isAtStart = currentStep <= 0;
  const isAtEnd = currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const progressBarRef = useRef<HTMLDivElement>(null);

  const seekFromEvent = useCallback(
    (clientX: number) => {
      const bar = progressBarRef.current;
      if (!bar || totalSteps <= 1) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const step = Math.round(ratio * (totalSteps - 1));
      onSeek(step);
    },
    [totalSteps, onSeek]
  );

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      seekFromEvent(e.clientX);
    },
    [seekFromEvent]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      seekFromEvent(e.touches[0].clientX);
    },
    [seekFromEvent]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      seekFromEvent(e.touches[0].clientX);
    },
    [seekFromEvent]
  );

  return (
    <div className="glass-strong rounded-xl px-3 sm:px-4 py-3">
      {/* Clickable Progress Bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="w-full h-3 sm:h-2.5 bg-[var(--bg-overlay)] rounded-full mb-3 cursor-pointer relative group touch-none"
        role="slider"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Step progress"
        tabIndex={0}
      >
        <motion.div
          className="h-full rounded-full pointer-events-none"
          style={{ background: 'var(--gradient-brand)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* Thumb indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-blue-400 bg-[var(--bg-elevated)] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          animate={{ left: `calc(${progress}% - 8px)` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Playback Buttons — centered */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={isAtStart && !isPlaying}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-overlay)] border border-transparent hover:border-[var(--border-default)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Reset (R)"
        >
          <ResetIcon />
        </button>

        {/* Step Backward */}
        <button
          onClick={onStepBackward}
          disabled={isAtStart}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-overlay)] border border-transparent hover:border-[var(--border-default)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step backward (←)"
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
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </motion.button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={isAtEnd}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-overlay)] border border-transparent hover:border-[var(--border-default)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Step forward (→)"
        >
          <StepForwardIcon />
        </button>
      </div>

      {/* Step Counter + Speed — row below */}
      <div className="flex items-center justify-between">
        {/* Step Counter */}
        <div className="text-xs text-[var(--text-secondary)] font-mono tabular-nums">
          Step{' '}
          <span className="text-[var(--text-primary)] font-semibold">
            {currentStep + 1}
          </span>{' '}
          / {totalSteps}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-[var(--text-muted)] mr-1">Speed</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 text-xs font-mono rounded-md transition-all duration-200 ${
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
