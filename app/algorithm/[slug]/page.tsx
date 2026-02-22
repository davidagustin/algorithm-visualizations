'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CATEGORIES,
  getProblemById,
  getCategoryForProblem,
} from '@/lib/algorithms/registry';
import type { ProblemInfo, CategoryInfo } from '@/lib/algorithms/registry';
import { getVisualization } from '@/lib/algorithms/index';
import type { AlgorithmDefinition, Language, AlgorithmStep } from '@/lib/types';
import { LANGUAGES } from '@/lib/types';
import Header from '@/components/Header';
import AIChatDrawer from '@/components/AIChatDrawer';
import CodePanel from '@/components/CodePanel';
import Controls from '@/components/Controls';
import StepExplanation from '@/components/StepExplanation';
import VariableWatch from '@/components/VariableWatch';
import InputPanel from '@/components/InputPanel';
import ArrayBars from '@/components/visualizations/ArrayBars';

// ─── Visualization ID mapping ────────────────────────────────
// Some registry problem IDs differ from the visualization file IDs.
// This map handles those cases.
const VIZ_ID_MAP: Record<string, string> = {
  'find-the-insertion-index': 'binary-search-insertion',
  'longest-substring-with-unique-characters': 'sliding-window-unique-chars',
};

function resolveVizId(slug: string): string {
  return VIZ_ID_MAP[slug] || slug;
}

// ─── Main Page Component ─────────────────────────────────────
export default function AlgorithmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [algorithm, setAlgorithm] = useState<AlgorithmDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Visualization state
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [language, setLanguage] = useState<Language>('pseudocode');
  const [inputValues, setInputValues] = useState<Record<string, unknown>>({});

  // Look up registry info
  const problemInfo: ProblemInfo | undefined = getProblemById(slug);
  const categoryInfo: CategoryInfo | undefined = getCategoryForProblem(slug);

  // Load the visualization
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const vizId = resolveVizId(slug);
        const algo = await getVisualization(vizId);

        if (cancelled) return;

        if (algo) {
          setAlgorithm(algo);
          setInputValues(algo.defaultInput);
          const generatedSteps = algo.generateSteps(algo.defaultInput);
          setSteps(generatedSteps);
          setCurrentStep(0);
        } else {
          setAlgorithm(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load visualization'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Run with custom input
  const handleRunInput = useCallback(() => {
    if (!algorithm) return;
    try {
      const generatedSteps = algorithm.generateSteps(inputValues);
      setSteps(generatedSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    } catch {
      // Silently handle invalid input
    }
  }, [algorithm, inputValues]);

  // Playback controls
  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleStepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const handleSeek = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, steps.length - 1)));
  }, [steps.length]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const interval = setInterval(
      () => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      },
      1200 / speed
    );

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  // Current step data
  const step = steps[currentStep] || null;

  // Difficulty badge
  const difficulty = algorithm?.difficulty || problemInfo?.difficulty;
  const difficultyClass =
    difficulty === 'Easy'
      ? 'badge-easy'
      : difficulty === 'Medium'
      ? 'badge-medium'
      : 'badge-hard';

  // ─── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-mesh min-h-screen">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">
              Loading visualization...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-mesh min-h-screen">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="glass rounded-xl p-8 text-center max-w-md">
            <div className="text-4xl mb-4">&#9888;&#65039;</div>
            <p className="text-[var(--text-primary)] font-semibold mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-4">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-110"
              style={{ background: 'var(--gradient-brand)' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Problem not found ──────────────────────────────────────
  if (!problemInfo && !algorithm) {
    return (
      <div className="bg-mesh min-h-screen">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="glass rounded-xl p-8 text-center max-w-md">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-[var(--text-primary)] font-semibold mb-2">
              Problem not found
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              No problem with ID &ldquo;{slug}&rdquo; was found in the registry.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-110"
              style={{ background: 'var(--gradient-brand)' }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Title and metadata ─────────────────────────────────────
  const title = algorithm?.title || problemInfo?.title || slug;
  const description =
    algorithm?.description || problemInfo?.description || '';
  const leetcodeNum = algorithm?.leetcodeNumber || problemInfo?.leetcodeNumber;
  const tags = algorithm?.tags || problemInfo?.tags || [];
  const catName = categoryInfo?.name || algorithm?.category || '';

  // ─── Has Visualization ──────────────────────────────────────
  if (algorithm && steps.length > 0) {
    return (
      <div className="bg-mesh min-h-screen">
        <Header />

        <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb catName={catName} catId={categoryInfo?.id || ''} title={title} />

          {/* Title bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                {title}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                {leetcodeNum && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--bg-overlay)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    LC #{leetcodeNum}
                  </span>
                )}
                {difficulty && (
                  <span
                    className={`${difficultyClass} px-2.5 py-0.5 text-xs font-medium rounded-full`}
                  >
                    {difficulty}
                  </span>
                )}
                {catName && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      categoryInfo?.borderColor || 'border-[var(--border-default)]'
                    } bg-gradient-to-r ${
                      categoryInfo?.gradient || ''
                    } ${categoryInfo?.color || 'text-[var(--text-secondary)]'}`}
                  >
                    {catName}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
              {description}
            </p>
            {tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Custom Input */}
          <div className="mb-6 ">
            <InputPanel
              fields={algorithm.inputFields}
              values={inputValues}
              onChange={setInputValues}
              onSubmit={handleRunInput}
            />
          </div>

          {/* Explanation + Variables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 ">
            {step && (
              <>
                <div className="glass rounded-xl p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                    Explanation
                  </h3>
                  <StepExplanation
                    explanation={step.explanation}
                    stepNumber={currentStep}
                    totalSteps={steps.length}
                  />
                </div>
                <VariableWatch variables={step.variables} />
              </>
            )}
          </div>

          {/* Main visualization layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 ">
            {/* Left: Code Panel */}
            <div className="h-[350px] sm:h-[450px] lg:h-[500px] flex flex-col">
              <CodePanel
                code={algorithm.code}
                currentLine={step?.line || 0}
                language={language}
                onLanguageChange={setLanguage}
              />
            </div>

            {/* Right: Visualization */}
            <div className="glass rounded-xl p-3 sm:p-4 h-[300px] sm:h-[400px] lg:h-[500px] flex flex-col overflow-hidden">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3 shrink-0">
                Visualization
              </h3>
              <div className="flex-1 flex items-center justify-center overflow-auto">
                <AnimatePresence mode="wait">
                  {step && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-full"
                    >
                      <VisualizationRenderer visualization={step.visualization} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 ">
            <Controls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onSeek={handleSeek}
              speed={speed}
              onSpeedChange={setSpeed}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
        </div>

        {/* AI Chat Drawer */}
        <AIChatDrawer
          algorithm={algorithm}
          currentStep={step}
          currentStepIndex={currentStep}
          totalSteps={steps.length}
          language={language}
        />
      </div>
    );
  }

  // ─── Coming Soon (no visualization) ─────────────────────────
  return (
    <div className="bg-mesh min-h-screen">
      <Header />

      <div className="pt-20 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb catName={catName} catId={categoryInfo?.id || ''} title={title} />

        {/* Title bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {leetcodeNum && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--bg-overlay)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  LC #{leetcodeNum}
                </span>
              )}
              {difficulty && (
                <span
                  className={`${difficultyClass} px-2.5 py-0.5 text-xs font-medium rounded-full`}
                >
                  {difficulty}
                </span>
              )}
              {catName && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    categoryInfo?.borderColor || 'border-[var(--border-default)]'
                  } bg-gradient-to-r ${
                    categoryInfo?.gradient || ''
                  } ${categoryInfo?.color || 'text-[var(--text-secondary)]'}`}
                >
                  {catName}
                </span>
              )}
            </div>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            {description}
          </p>
          {tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-full bg-[var(--bg-overlay)] border border-[var(--border-subtle)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Banner */}
        <div className="glass-strong rounded-2xl p-8 text-center mb-8 ">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'var(--gradient-brand)' }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Visualization Coming Soon
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
            We are building an interactive step-by-step visualization for this
            algorithm. Check back soon or explore other visualized problems.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:brightness-110"
              style={{ background: 'var(--gradient-brand)' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Browse All Problems
            </Link>
          </div>
        </div>

        {/* Category description */}
        {categoryInfo && (
          <div className="glass rounded-xl p-6 ">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{categoryInfo.icon}</span>
              <h3 className={`text-lg font-semibold ${categoryInfo.color}`}>
                {categoryInfo.name}
              </h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Explore other problems in this category:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categoryInfo.problems
                .filter((p) => p.id !== slug)
                .slice(0, 6)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/algorithm/${p.id}`}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors duration-150 group"
                  >
                    {p.hasVisualization && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                    {!p.hasVisualization && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] shrink-0" />
                    )}
                    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-150 truncate">
                      {p.title}
                    </span>
                    <span
                      className={`ml-auto shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        p.difficulty === 'Easy'
                          ? 'badge-easy'
                          : p.difficulty === 'Medium'
                          ? 'badge-medium'
                          : 'badge-hard'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Breadcrumb Component ─────────────────────────────────────

function Breadcrumb({ catName, catId, title }: { catName: string; catId: string; title: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 pt-4">
      <Link
        href="/"
        className="hover:text-[var(--text-secondary)] transition-colors duration-150"
      >
        Home
      </Link>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-40"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      {catName && (
        <>
          <Link
            href={`/?category=${catId}#problems`}
            className="hover:text-[var(--text-secondary)] transition-colors duration-150"
          >
            {catName}
          </Link>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-40"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </>
      )}
      <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
        {title}
      </span>
    </nav>
  );
}

// ─── Visualization Renderer ───────────────────────────────────

function VisualizationRenderer({
  visualization,
}: {
  visualization: AlgorithmStep['visualization'];
}) {
  switch (visualization.type) {
    case 'array':
      return <ArrayBars visualization={visualization} />;

    case 'stack':
      return <StackViz visualization={visualization} />;

    case 'tree':
      return <TreeViz visualization={visualization} />;

    case 'dp-table':
      return <DPTableViz visualization={visualization} />;

    default:
      return (
        <div className="text-center text-[var(--text-muted)] text-sm">
          Unsupported visualization type
        </div>
      );
  }
}

// ─── Inline Stack Visualization ───────────────────────────────

import type { StackVisualization, TreeVisualization, DPVisualization } from '@/lib/types';
import { HIGHLIGHT_COLORS } from '@/lib/types';

function StackViz({ visualization }: { visualization: StackVisualization }) {
  const { items, inputChars, currentIndex, action } = visualization;

  const actionColor =
    action === 'push'
      ? 'border-blue-400 bg-blue-500/20'
      : action === 'pop' || action === 'match'
      ? 'border-emerald-400 bg-emerald-500/20'
      : action === 'mismatch'
      ? 'border-rose-400 bg-rose-500/20'
      : 'border-[var(--border-default)] bg-[var(--bg-surface)]';

  return (
    <div className="flex flex-col items-center gap-6 w-full py-4">
      {/* Input string */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {inputChars.map((char, i) => (
          <span
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono font-bold border transition-all duration-200 ${
              i === currentIndex
                ? 'border-blue-400 bg-blue-500/20 text-blue-200 scale-110'
                : i < currentIndex
                ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]'
                : 'border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)]'
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Stack */}
      <div className="flex flex-col-reverse items-center gap-1 min-h-[120px]">
        {items.length === 0 ? (
          <span className="text-xs text-[var(--text-muted)] italic">
            (empty stack)
          </span>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={`${i}-${item}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-12 h-10 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-sm ${
                i === items.length - 1 ? actionColor : 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
              }`}
            >
              {item}
            </motion.div>
          ))
        )}
      </div>

      <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
        Stack
      </span>
    </div>
  );
}

// ─── Inline Tree Visualization ────────────────────────────────

function TreeViz({ visualization }: { visualization: TreeVisualization }) {
  const { nodes, highlights } = visualization;

  if (nodes.length === 0) {
    return (
      <div className="text-center text-[var(--text-muted)] text-sm py-8">
        Empty tree
      </div>
    );
  }

  // Calculate tree depth
  const depth = Math.floor(Math.log2(nodes.length)) + 1;
  const levels: { index: number; value: number | null }[][] = [];

  for (let d = 0; d < depth; d++) {
    const start = Math.pow(2, d) - 1;
    const end = Math.min(Math.pow(2, d + 1) - 1, nodes.length);
    const level: { index: number; value: number | null }[] = [];
    for (let i = start; i < end; i++) {
      level.push({ index: i, value: nodes[i] ?? null });
    }
    levels.push(level);
  }

  function getHighlightColor(idx: number) {
    const colorName = highlights[idx];
    if (!colorName || !HIGHLIGHT_COLORS[colorName]) return HIGHLIGHT_COLORS['default'];
    return HIGHLIGHT_COLORS[colorName];
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full py-4 overflow-x-auto">
      {levels.map((level, d) => (
        <div
          key={d}
          className="flex items-center justify-center"
          style={{ gap: `${Math.max(8, 60 / (d + 1))}px` }}
        >
          {level.map(({ index, value }) => {
            if (value === null || value === undefined) {
              return (
                <div
                  key={index}
                  className="w-10 h-10 flex items-center justify-center"
                />
              );
            }

            const color = getHighlightColor(index);

            return (
              <motion.div
                key={index}
                animate={{
                  scale: highlights[index] ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-mono font-bold text-xs ${color.bg} ${color.border} ${color.text}`}
              >
                {value}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Inline DP Table Visualization ────────────────────────────

function DPTableViz({ visualization }: { visualization: DPVisualization }) {
  const { values, highlights, labels } = visualization;

  function getHighlightColor(idx: number) {
    const colorName = highlights[idx];
    if (!colorName || !HIGHLIGHT_COLORS[colorName]) return HIGHLIGHT_COLORS['default'];
    return HIGHLIGHT_COLORS[colorName];
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full py-4 overflow-x-auto">
      <div className="flex items-end gap-1.5 flex-wrap justify-center">
        {values.map((value, index) => {
          const color = getHighlightColor(index);
          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scale: highlights[index] ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-sm ${color.bg} ${color.border} ${color.text}`}
              >
                {value ?? '-'}
              </motion.div>
              {labels[index] !== undefined && (
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
