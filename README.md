<div align="center">

# Algomations

### Visualize coding interview algorithms, step by step.

[![Live App](https://img.shields.io/badge/Live_App-algomations.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://algomations.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

**[algomations.vercel.app](https://algomations.vercel.app)**

</div>

---

## What Is Algomations?

Algomations is an interactive algorithm learning platform that animates the execution of classic coding interview problems **line by line**. Watch variables change in real time, supply your own inputs, get instant AI explanations, and build the genuine intuition that carries you through technical interviews — all without leaving your browser.

Browse **1,700+ problems** across **20 pattern categories**, from Two Pointers and Sliding Windows to Dynamic Programming and Backtracking. Every problem comes with a full step-through visualization. 236 problems are curated as interview-recommended, drawn from Blind 75, NeetCode 150, and FAANG favorites.

---

## Features

### Core Visualizer
- **Step-through animations** — watch highlighted code execute line by line across all 1,700+ problems
- **Four visualization types** — Array bars, Stack, Binary Tree SVG, and DP Table, each matched to the problem's data structure
- **Multi-language code** — Python, JavaScript, Java, and Pseudocode for every visualization
- **Playback controls** — play, pause, step forward/backward, adjustable speed (0.5x–2x), and a seekable progress bar
- **Custom inputs** — modify algorithm inputs and observe in real time how behavior changes
- **Variable watch panel** — track every variable's value at each execution step

### AI Tutor (Runs Locally)
- **Powered by WebLLM + Llama 3.1 8B** — a full language model running directly in your browser via WebGPU
- **Context-aware** — the AI understands the current problem, the active step, and your variable state
- **Zero data sent to any server** — all inference happens on your machine, completely private

### Problem Library
- **1,700+ problems** organized across 20 interview pattern categories
- **236 interview-recommended problems** — curated from Blind 75, NeetCode 150, and FAANG favorites, marked with a badge for quick identification
- **Card and table views** — browse in a visual grid or a dense table layout
- **Smart filtering** — filter by category, difficulty, name search, or toggle to show only interview-recommended problems

### UI & Experience
- **Light and dark themes** — toggle between modes; dark is the default, with glassmorphism panels, gradient accents, and smooth transitions powered by Framer Motion 12
- **Editor settings** — per-session code panel configuration: font size, tab size, word wrap, line numbers
- **Keyboard shortcuts** — navigate visualizations without touching the mouse

---

## Screenshots

> Screenshots and GIF demos coming soon. Visit **[algomations.vercel.app](https://algomations.vercel.app)** to see it live.

---

## Interactive Visualizations

All 1,700+ problems have full step-through animations. Every problem renders a live visualization matched to its data structure — Array bars for sorting and pointer problems, Stack for push/pop problems, Binary Tree SVG for tree traversals, and DP Table for dynamic programming. A sample of covered problems:

| Problem | Pattern | LeetCode |
|---------|---------|----------|
| Two Sum (sorted) | Two Pointers | [#167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| Two Sum (unsorted) | Hash Map | [#1](https://leetcode.com/problems/two-sum/) |
| Valid Parentheses | Stack | [#20](https://leetcode.com/problems/valid-parentheses/) |
| Binary Search / Search Insert Position | Binary Search | [#704](https://leetcode.com/problems/binary-search/) / [#35](https://leetcode.com/problems/search-insert-position/) |
| Longest Substring Without Repeating Characters | Sliding Window | [#3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| Reverse Linked List | Linked Lists | [#206](https://leetcode.com/problems/reverse-linked-list/) |
| Invert Binary Tree | Trees | [#226](https://leetcode.com/problems/invert-binary-tree/) |
| Climbing Stairs | Dynamic Programming | [#70](https://leetcode.com/problems/climbing-stairs/) |
| N-Queens | Backtracking | [#51](https://leetcode.com/problems/n-queens/) |
| Sort Colors (Dutch National Flag) | Three Pointers | [#75](https://leetcode.com/problems/sort-colors/) |

---

## All Problems

1,661 problems across 20 interview pattern categories:

| Category | Count |
|----------|-------|
| Two Pointers | 177 |
| Hash Maps & Sets | 119 |
| Linked Lists | 67 |
| Fast & Slow Pointers | 5 |
| Sliding Windows | 85 |
| Binary Search | 68 |
| Stacks | 112 |
| Heaps | 46 |
| Intervals | 8 |
| Prefix Sums | 38 |
| Trees | 173 |
| Tries | 13 |
| Graphs | 199 |
| Backtracking | 64 |
| Dynamic Programming | 251 |
| Greedy | 62 |
| Sort & Search | 35 |
| Bit Manipulation | 38 |
| Math & Geometry | 76 |
| Array Manipulation & Rearrangement | 25 |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16 (App Router) | Framework and routing |
| [React](https://react.dev/) | 19 | UI rendering |
| [TypeScript](https://www.typescriptlang.org/) | 5 (strict) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations and transitions |
| [WebLLM](https://webllm.mlc.ai/) | latest | In-browser LLM inference (Llama 3.1 8B) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
algorithm-visualizations/
├── app/
│   ├── page.tsx                        # Homepage with problem browser
│   ├── layout.tsx                      # Root layout with metadata
│   ├── globals.css                     # Design system (themes, animations)
│   ├── ProblemBrowser.tsx              # Client-side filtering, search, views
│   └── algorithm/[slug]/
│       └── page.tsx                    # Algorithm detail + visualization page
│
├── components/
│   ├── Visualizer.tsx                  # Main visualization orchestrator
│   ├── CodePanel.tsx                   # Code display with line highlighting
│   ├── Controls.tsx                    # Playback controls
│   ├── InputPanel.tsx                  # Custom input form
│   ├── StepExplanation.tsx             # Step description text
│   ├── VariableWatch.tsx               # Variable state display
│   └── visualizations/
│       ├── ArrayBars.tsx               # Array element visualization
│       ├── StackView.tsx               # Stack push/pop visualization
│       ├── TreeView.tsx                # Binary tree SVG visualization
│       └── DPTable.tsx                 # DP table visualization
│
└── lib/
    ├── types.ts                        # Core TypeScript types
    ├── syntax.tsx                      # Syntax highlighter
    └── algorithms/
        ├── registry.ts                 # All 1,700+ problems by category
        ├── index.ts                    # Visualization loader
        └── *.ts                        # 1,700+ individual algorithm step generators
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Arrow Right` | Step forward |
| `Arrow Left` | Step backward |
| `R` | Reset to beginning |
| Click progress bar | Seek to any step |

---

## Editor Settings

The code panel includes a settings panel (gear icon) for per-session customization:

| Setting | Options |
|---------|---------|
| Font size | 12px – 20px |
| Tab size | 2, 4, or 8 spaces |
| Word wrap | On / Off |
| Line numbers | On / Off |

---

## Adding New Visualizations

1. Create a new file in `lib/algorithms/` that exports an `AlgorithmDefinition` — include multi-language code strings, an input schema, and a `generateSteps()` function that returns a step-by-step execution trace with visualization state.
2. Add the import to `lib/algorithms/index.ts`.
3. Set `hasVisualization: true` for the corresponding problem entry in `registry.ts`.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository: [github.com/davidagustin/algorithm-visualizations](https://github.com/davidagustin/algorithm-visualizations)
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes, following the existing code style (TypeScript strict, Tailwind, no external UI libraries)
4. Add or update tests if applicable
5. Open a pull request with a clear description of what changed and why

**Good first contributions:**
- Add a new algorithm visualization following the pattern in `lib/algorithms/`
- Add missing problems to `registry.ts`
- Improve accessibility (ARIA labels, keyboard navigation)
- Fix typos or improve documentation

---

## Deploy

The app is deployed at **[algomations.vercel.app](https://algomations.vercel.app)**.

To build for production:

```bash
npm run build
```

Deploy to [Vercel](https://vercel.com), [Netlify](https://netlify.com), or any Node.js hosting platform. No environment variables required — the AI Tutor runs entirely in the browser.

---

## Support

If Algomations has helped you prepare for interviews, consider supporting continued development:

[![Donate](https://img.shields.io/badge/Donate-Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/fZucN5epreyuchqdtZfnO00)

**BTC**: `bc1qkqrp0v0av6ch6ekm2e2scav93a0d83mawcjcd3`

**ETH**: `0x846a124b1438f5dc657309e686c57b03647888f2`

---

## License

[MIT](https://opensource.org/licenses/MIT) — free to use, modify, and distribute.
