# Algomations - Algorithm Visualization

Visualize coding interview algorithms step by step with interactive animations, line-by-line code execution, and custom inputs across multiple languages.

## Features

- **85+ Problems** across 19 coding interview pattern categories
- **10 Interactive Visualizations** with step-by-step animation (Two Sum, Binary Search, Valid Parentheses, Sliding Window, Linked List Reversal, Invert Binary Tree, Climbing Stairs, N-Queens, Dutch National Flag, and more)
- **Multi-Language Code** - Python, JavaScript, Java, and Pseudocode for every visualization
- **Playback Controls** - Play, pause, step forward/backward, adjustable speed (0.5x-2x)
- **Custom Inputs** - Modify algorithm inputs and see how behavior changes
- **Variable Watch** - Track variable state changes at each step
- **Card & Table Views** - Browse problems in card grid or dense table layout
- **Filtering** - Filter by category, difficulty, search by name, toggle visualized-only
- **Dark Theme** - Premium dark UI with glassmorphism, gradient accents, and smooth animations

## Categories

Two Pointers, Hash Maps & Sets, Linked Lists, Fast & Slow Pointers, Sliding Windows, Binary Search, Stacks, Heaps, Intervals, Prefix Sums, Trees, Tries, Graphs, Backtracking, Dynamic Programming, Greedy, Sort & Search, Bit Manipulation, Math & Geometry

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **TypeScript** (strict mode)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  page.tsx                    # Homepage with problem browser
  ProblemBrowser.tsx          # Client-side filtering/search/views
  algorithm/[slug]/page.tsx   # Algorithm detail + visualization page
  layout.tsx                  # Root layout with metadata
  globals.css                 # Design system (dark theme, animations)

components/
  Header.tsx                  # Navigation header
  Visualizer.tsx              # Main visualization orchestrator
  CodePanel.tsx               # Code display with line highlighting
  Controls.tsx                # Playback controls
  InputPanel.tsx              # Custom input form
  StepExplanation.tsx         # Current step text
  VariableWatch.tsx           # Variable state display
  visualizations/
    ArrayBars.tsx             # Array element visualization
    StackView.tsx             # Stack push/pop visualization
    TreeView.tsx              # Binary tree SVG visualization
    DPTable.tsx               # DP table cell visualization

lib/
  types.ts                    # Core TypeScript types
  syntax.tsx                  # Simple syntax highlighter
  algorithms/
    registry.ts               # All 85+ problems by category
    index.ts                  # Visualization loader
    pair-sum-sorted.ts        # Two pointer visualization
    pair-sum-unsorted.ts      # Hash map visualization
    valid-parentheses.ts      # Stack visualization
    binary-search-insertion.ts # Binary search visualization
    sliding-window-unique-chars.ts # Sliding window visualization
    linked-list-reversal.ts   # Linked list visualization
    invert-binary-tree.ts     # Tree visualization
    climbing-stairs.ts        # DP visualization
    n-queens.ts               # Backtracking visualization
    dutch-national-flag.ts    # Three-pointer sorting visualization
```

## Adding New Visualizations

1. Create a new file in `lib/algorithms/` exporting an `AlgorithmDefinition`
2. Add the import to `lib/algorithms/index.ts`
3. Set `hasVisualization: true` for the problem in `registry.ts`

Each visualization needs: multi-language code strings, input schema, and a `generateSteps()` function that returns step-by-step execution trace with visualization state.

## Deploy

```bash
npm run build
```

Deploy to Vercel, Netlify, or any Node.js hosting platform.
