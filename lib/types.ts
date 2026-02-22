export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category =
  | 'Arrays'
  | 'Stack'
  | 'Linked List'
  | 'Tree'
  | 'Dynamic Programming'
  | 'Sorting'
  | 'Two Pointers'
  | 'Binary Search'
  | 'Hash Map'
  | 'Fast And Slow Pointers'
  | 'Sliding Window'
  | 'Heap'
  | 'Interval'
  | 'Prefix Sum'
  | 'Trie'
  | 'Graph'
  | 'Backtracking'
  | 'Greedy'
  | 'Bit Manipulation'
  | 'Math';

export type Language = 'python' | 'javascript' | 'java' | 'pseudocode';

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'pseudocode', label: 'Pseudocode' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
];

// --- Visualization state types ---

export interface ArrayVisualization {
  type: 'array';
  array: number[];
  highlights: Record<number, string>; // index → color name
  labels?: Record<number, string>;    // index → label text (e.g. "L", "R", "mid")
  auxData?: {
    label: string;
    entries: { key: string; value: string }[];
  };
}

export interface StackVisualization {
  type: 'stack';
  items: string[];
  inputChars: string[];
  currentIndex: number;
  action?: 'push' | 'pop' | 'match' | 'mismatch' | 'idle';
}

export interface TreeVisualization {
  type: 'tree';
  nodes: (number | null)[];
  highlights: Record<number, string>;
  depthValues?: Record<number, number>;
}

export interface DPVisualization {
  type: 'dp-table';
  values: (number | null)[];
  highlights: Record<number, string>;
  labels: string[];
}

export type VisualizationState =
  | ArrayVisualization
  | StackVisualization
  | TreeVisualization
  | DPVisualization;

// --- Algorithm step ---

export interface AlgorithmStep {
  line: number;
  explanation: string;
  variables: Record<string, unknown>;
  visualization: VisualizationState;
}

// --- Input field definition ---

export interface InputField {
  name: string;
  label: string;
  type: 'array' | 'number' | 'string' | 'tree';
  defaultValue: unknown;
  placeholder?: string;
  helperText?: string;
}

// --- Full algorithm definition ---

export interface AlgorithmDefinition {
  id: string;
  title: string;
  leetcodeNumber?: number;
  difficulty: Difficulty;
  category: Category;
  description: string;
  tags: string[];
  code: Record<Language, string>;
  defaultInput: Record<string, unknown>;
  inputFields: InputField[];
  generateSteps: (input: Record<string, unknown>) => AlgorithmStep[];
}

// --- Highlight color names used in visualization components ---

export const HIGHLIGHT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  default:   { bg: 'bg-slate-700',         border: 'border-slate-600',        text: 'text-slate-200' },
  active:    { bg: 'bg-blue-500/30',       border: 'border-blue-400',         text: 'text-blue-200' },
  found:     { bg: 'bg-emerald-500/30',    border: 'border-emerald-400',      text: 'text-emerald-200' },
  comparing: { bg: 'bg-amber-500/30',      border: 'border-amber-400',        text: 'text-amber-200' },
  swapping:  { bg: 'bg-rose-500/30',       border: 'border-rose-400',         text: 'text-rose-200' },
  sorted:    { bg: 'bg-violet-500/30',     border: 'border-violet-400',       text: 'text-violet-200' },
  visited:   { bg: 'bg-slate-600/50',      border: 'border-slate-500',        text: 'text-slate-300' },
  pointer:   { bg: 'bg-cyan-500/30',       border: 'border-cyan-400',         text: 'text-cyan-200' },
  match:     { bg: 'bg-emerald-500/30',    border: 'border-emerald-400',      text: 'text-emerald-200' },
  mismatch:  { bg: 'bg-rose-500/30',       border: 'border-rose-400',         text: 'text-rose-200' },
  current:   { bg: 'bg-indigo-500/30',     border: 'border-indigo-400',       text: 'text-indigo-200' },
};
