'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmDefinition, Language, AlgorithmStep } from '@/lib/types';
import CodePanel from '@/components/CodePanel';
import Controls from '@/components/Controls';
import StepExplanation from '@/components/StepExplanation';
import InputPanel from '@/components/InputPanel';
import VariableWatch from '@/components/VariableWatch';
import ArrayBars from '@/components/visualizations/ArrayBars';
import StackView from '@/components/visualizations/StackView';
import TreeView from '@/components/visualizations/TreeView';
import DPTable from '@/components/visualizations/DPTable';

interface VisualizerProps {
  algorithm: AlgorithmDefinition;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function VisualizationCanvas({ step }: { step: AlgorithmStep }) {
  const viz = step.visualization;

  switch (viz.type) {
    case 'array':
      return <ArrayBars visualization={viz} />;
    case 'stack':
      return <StackView visualization={viz} />;
    case 'tree':
      return <TreeView visualization={viz} />;
    case 'dp-table':
      return <DPTable visualization={viz} />;
    default:
      return (
        <div className="flex items-center justify-center h-48 text-[var(--text-muted)]">
          Unsupported visualization type
        </div>
      );
  }
}

export default function Visualizer({ algorithm }: VisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState<Language>('pseudocode');
  const [customInput, setCustomInput] = useState<Record<string, unknown>>(
    () => ({ ...algorithm.defaultInput })
  );
  const [showInput, setShowInput] = useState(false);
  const [showVariables, setShowVariables] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate steps from current input
  const steps: AlgorithmStep[] = useMemo(() => {
    try {
      return algorithm.generateSteps(customInput);
    } catch {
      return [];
    }
  }, [algorithm, customInput]);

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep] || steps[0];

  // Playback interval
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && totalSteps > 0) {
      const interval = 1000 / speed;
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, totalSteps]);

  const handleTogglePlay = useCallback(() => {
    if (currentStep >= totalSteps - 1 && !isPlaying) {
      // If at the end, restart from the beginning
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStep, totalSteps, isPlaying]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleSeek = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const handleInputChange = useCallback((values: Record<string, unknown>) => {
    setCustomInput(values);
  }, []);

  const handleInputSubmit = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleStepBackward();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleStepForward, handleStepBackward, handleReset]);

  if (!currentStepData) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
        No steps generated. Check your input values.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top: Explanation + Variables side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StepExplanation
          explanation={currentStepData.explanation}
          stepNumber={currentStep}
          totalSteps={totalSteps}
        />
        <VariableWatch variables={currentStepData.variables} />
      </div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onReset={handleReset}
        onSeek={handleSeek}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {/* Main Split View: Code + Visualization */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[400px]">
        {/* Left: Code Panel */}
        <div className="w-full lg:w-2/5 xl:w-1/3 min-h-[300px] lg:min-h-0">
          <CodePanel
            code={algorithm.code}
            currentLine={currentStepData.line}
            language={language}
            onLanguageChange={setLanguage}
          />
        </div>

        {/* Right: Visualization Canvas */}
        <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Visualization
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              {currentStepData.visualization.type}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                <VisualizationCanvas step={currentStepData} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Custom Input (collapsible) */}
      <div>
        <button
          onClick={() => setShowInput((v) => !v)}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2"
        >
          <ChevronIcon open={showInput} />
          <span className="font-medium">Custom Input</span>
        </button>
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <InputPanel
                fields={algorithm.inputFields}
                values={customInput}
                onChange={handleInputChange}
                onSubmit={handleInputSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
