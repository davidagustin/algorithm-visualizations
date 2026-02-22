'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { CategoryInfo, ProblemInfo } from '@/lib/algorithms/registry';
import type { Difficulty } from '@/lib/types';

type ViewMode = 'cards' | 'table';
type DifficultyFilter = 'All' | Difficulty;

interface ProblemBrowserProps {
  categories: CategoryInfo[];
}

export default function ProblemBrowser({ categories }: ProblemBrowserProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Sync category filter from URL search params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.some((c) => c.id === cat)) {
      setCategoryFilter(cat);
    }
  }, [searchParams, categories]);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [vizOnly, setVizOnly] = useState(false);

  const allProblems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.problems.map((p) => ({ ...p, categoryName: cat.name, categoryColor: cat.color, categoryGradient: cat.gradient, categoryBorderColor: cat.borderColor }))
    );
  }, [categories]);

  const filtered = useMemo(() => {
    return allProblems.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.leetcodeNumber && String(p.leetcodeNumber).includes(q));
        if (!matchesSearch) return false;
      }
      if (categoryFilter !== 'all') {
        const cat = categories.find((c) => c.id === categoryFilter);
        if (cat && !cat.problems.some((cp) => cp.id === p.id)) return false;
      }
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (vizOnly && !p.hasVisualization) return false;
      return true;
    });
  }, [allProblems, search, categoryFilter, difficultyFilter, vizOnly, categories]);

  const difficultyBadge = (d: Difficulty) => {
    const cls =
      d === 'Easy'
        ? 'badge-easy'
        : d === 'Medium'
        ? 'badge-medium'
        : 'badge-hard';
    return (
      <span className={`${cls} px-2 py-0.5 text-xs font-medium rounded-full`}>
        {d}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ─── Filter Bar ─────────────────────────────────────── */}
      <div className="glass-strong rounded-2xl p-4 sm:p-6 mb-8">
        <div className="flex flex-col gap-4">
          {/* Top row: Search + View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search problems, tags, or LeetCode number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors duration-200"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  viewMode === 'cards'
                    ? 'bg-[rgba(102,126,234,0.2)] text-blue-300'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Cards
                </span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-[rgba(102,126,234,0.2)] text-blue-300'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  Table
                </span>
              </button>
            </div>
          </div>

          {/* Second row: Category, Difficulty, VizOnly */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
            {/* Category select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-blue-500/50 transition-colors duration-200 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name} ({cat.problems.length})
                </option>
              ))}
            </select>

            {/* Difficulty pills */}
            <div className="flex items-center gap-1">
              {(['All', 'Easy', 'Medium', 'Hard'] as DifficultyFilter[]).map(
                (d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      difficultyFilter === d
                        ? d === 'Easy'
                          ? 'badge-easy'
                          : d === 'Medium'
                          ? 'badge-medium'
                          : d === 'Hard'
                          ? 'badge-hard'
                          : 'bg-[rgba(102,126,234,0.2)] text-blue-300 border border-blue-500/30'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)]'
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>

            {/* Visualized Only toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
              <span className="text-xs text-[var(--text-muted)]">
                Interactive only
              </span>
              <button
                role="switch"
                aria-checked={vizOnly}
                onClick={() => setVizOnly(!vizOnly)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                  vizOnly
                    ? 'bg-blue-500/40 border-blue-500/50'
                    : 'bg-[var(--bg-overlay)] border-[var(--border-default)]'
                } border`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200 ${
                    vizOnly
                      ? 'translate-x-4 bg-blue-400'
                      : 'translate-x-0 bg-[var(--text-muted)]'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
          <p className="text-xs text-[var(--text-muted)]">
            Showing{' '}
            <span className="text-[var(--text-primary)] font-semibold">
              {filtered.length}
            </span>{' '}
            of {allProblems.length} problems
            {vizOnly && ' (interactive only)'}
          </p>
        </div>
      </div>

      {/* ─── Results ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CardView problems={filtered} difficultyBadge={difficultyBadge} />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TableView problems={filtered} difficultyBadge={difficultyBadge} />
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)] text-lg mb-2">
            No problems found
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Card View ──────────────────────────────────────────────── */

type EnrichedProblem = ProblemInfo & {
  categoryName: string;
  categoryColor: string;
  categoryGradient: string;
  categoryBorderColor: string;
};

function CardView({
  problems,
  difficultyBadge,
}: {
  problems: EnrichedProblem[];
  difficultyBadge: (d: Difficulty) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem, index) => (
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
        >
          <Link
            href={`/algorithm/${problem.id}`}
            className="card-hover glass rounded-xl p-5 block h-full group relative overflow-hidden"
          >
            {/* Gradient accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--gradient-brand)' }}
            />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {problem.leetcodeNumber && (
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      #{problem.leetcodeNumber}
                    </span>
                  )}
                  {difficultyBadge(problem.difficulty)}
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-white transition-colors duration-200 truncate">
                  {problem.title}
                </h3>
              </div>

              {problem.hasVisualization && (
                <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Interactive
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3 leading-relaxed">
              {problem.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${problem.categoryBorderColor} bg-gradient-to-r ${problem.categoryGradient} ${problem.categoryColor}`}
              >
                {problem.categoryName}
              </span>

              <div className="flex items-center gap-1 flex-wrap justify-end">
                {problem.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-overlay)]"
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags.length > 2 && (
                  <span className="text-[10px] text-[var(--text-muted)]">
                    +{problem.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Table View ─────────────────────────────────────────────── */

function TableView({
  problems,
  difficultyBadge,
}: {
  problems: EnrichedProblem[];
  difficultyBadge: (d: Difficulty) => React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">
                Tags
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider w-20">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <Link
                key={problem.id}
                href={`/algorithm/${problem.id}`}
                className="contents"
              >
                <tr
                  className={`border-b border-[var(--border-subtle)] hover:bg-[var(--bg-overlay)] transition-colors duration-150 cursor-pointer ${
                    index % 2 === 0
                      ? 'bg-transparent'
                      : 'bg-[rgba(18,18,26,0.3)]'
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
                    {problem.leetcodeNumber || '--'}
                  </td>
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                    {problem.title}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs font-medium ${problem.categoryColor}`}
                    >
                      {problem.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {difficultyBadge(problem.difficulty)}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 flex-wrap">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-overlay)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {problem.hasVisualization ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-medium">VIZ</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)]">
                        --
                      </span>
                    )}
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
