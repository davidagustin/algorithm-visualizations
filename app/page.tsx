import { CATEGORIES, getAllProblems } from '@/lib/algorithms/registry';
import type { CategoryInfo } from '@/lib/algorithms/registry';
import Header from '@/components/Header';
import { DonationAddresses } from '@/components/DonationAddresses';
import ProblemBrowser from './ProblemBrowser';

export default function Home() {
  const allProblems = getAllProblems();
  const totalProblems = allProblems.length;
  const totalCategories = CATEGORIES.length;
  const totalVisualizations = allProblems.filter((p) => p.hasVisualization).length;

  return (
    <div className="bg-mesh min-h-screen">
      <Header />

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background:
                'radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute -top-20 -right-32 w-[400px] h-[400px] rounded-full animate-pulse-glow"
            style={{
              background:
                'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
              animationDelay: '1s',
            }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-[600px] h-[300px] rounded-full animate-pulse-glow"
            style={{
              background:
                'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
              animationDelay: '2s',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Title */}
          <div className="animate-slide-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4">
              <span className="gradient-text">Algomations</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-slide-up delay-100">
            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] font-medium mb-4">
              Visualize algorithms step by step
            </p>
          </div>

          {/* Description */}
          <div className="animate-slide-up delay-200">
            <p className="max-w-2xl mx-auto text-base text-[var(--text-muted)] leading-relaxed mb-10">
              Interactive visualizations for coding interview algorithms.
              Watch data structures transform in real time, step through code
              line by line, and build deep intuition for every pattern.
            </p>
          </div>

          {/* Stats bar */}
          <div className="animate-slide-up delay-300">
            <div className="inline-flex items-center gap-6 sm:gap-10 glass rounded-2xl px-8 py-4">
              <StatItem label="Categories" value={totalCategories} />
              <div className="w-px h-8 bg-[var(--border-subtle)]" />
              <StatItem label="Problems" value={totalProblems} />
              <div className="w-px h-8 bg-[var(--border-subtle)]" />
              <StatItem label="Visualizations" value={totalVisualizations} />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="mt-12 animate-float">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Problem Browser (Client Component) ──────────────── */}
      <section id="problems" className="scroll-mt-20">
        <ProblemBrowser categories={CATEGORIES} />
      </section>

      {/* ─── Category Cards ────────────────────────────────────── */}
      <section id="categories" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Explore by Category
            </h2>
            <p className="text-[var(--text-muted)]">
              {totalCategories} categories covering all major algorithm patterns
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, index) => (
              <CategoryCard key={cat.id} category={cat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="gradient-text text-xl font-bold">Algomations</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm text-center">
              Built for developers who learn by seeing.
            </p>
            <div className="flex items-center gap-4 text-[var(--text-muted)] text-sm">
              <span>Made with</span>
              <span className="text-red-500">&#9829;</span>
              <span>using Next.js</span>
            </div>
          </div>

          <DonationAddresses />

          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] text-center text-[var(--text-muted)] text-xs">
            &copy; {new Date().getFullYear()} Algomations. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Helper components (server) ──────────────────────────────── */

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
        {value}
      </span>
      <span className="text-xs sm:text-sm text-[var(--text-muted)]">{label}</span>
    </div>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: CategoryInfo;
  index: number;
}) {
  const problemCount = category.problems.length;
  const vizCount = category.problems.filter((p) => p.hasVisualization).length;

  return (
    <a
      href={`/#problems`}
      className={`card-hover glass rounded-xl p-5 block group`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{category.icon}</span>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full border ${category.borderColor} bg-gradient-to-r ${category.gradient}`}
        >
          {problemCount} problems
        </span>
      </div>

      <h3
        className={`text-lg font-semibold mb-1 ${category.color} group-hover:brightness-125 transition-all duration-200`}
      >
        {category.name}
      </h3>

      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
        {category.problems[0]?.description || ''}
      </p>

      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        {vizCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {vizCount} interactive
          </span>
        )}
      </div>
    </a>
  );
}
