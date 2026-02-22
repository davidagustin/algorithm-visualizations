import type { AlgorithmDefinition } from '../types';

// Dynamic imports for code-splitting
const visualizations: Record<string, () => Promise<{ default: AlgorithmDefinition }>> = {
  'pair-sum-sorted': () => import('./pair-sum-sorted'),
  'pair-sum-unsorted': () => import('./pair-sum-unsorted'),
  'valid-parentheses': () => import('./valid-parentheses'),
  'binary-search-insertion': () => import('./binary-search-insertion'),
  'sliding-window-unique-chars': () => import('./sliding-window-unique-chars'),
  'linked-list-reversal': () => import('./linked-list-reversal'),
  'invert-binary-tree': () => import('./invert-binary-tree'),
  'climbing-stairs': () => import('./climbing-stairs'),
  'n-queens': () => import('./n-queens'),
  'dutch-national-flag': () => import('./dutch-national-flag'),
  'triplet-sum': () => import('./triplet-sum'),
  'is-palindrome-valid': () => import('./is-palindrome-valid'),
  'largest-container': () => import('./largest-container'),
  'shift-zeros-to-the-end': () => import('./shift-zeros-to-the-end'),
  'next-lexicographical-sequence': () => import('./next-lexicographical-sequence'),
  'verify-sudoku-board': () => import('./verify-sudoku-board'),
  'zero-striping': () => import('./zero-striping'),
  'longest-chain-of-consecutive-numbers': () => import('./longest-chain-of-consecutive-numbers'),
  'geometric-sequence-triplets': () => import('./geometric-sequence-triplets'),
  'substring-anagrams': () => import('./substring-anagrams'),
  'longest-uniform-substring-after-replacements': () => import('./longest-uniform-substring-after-replacements'),
  'linked-list-loop': () => import('./linked-list-loop'),
  'linked-list-midpoint': () => import('./linked-list-midpoint'),
  'happy-number': () => import('./happy-number'),
  'hamming-weights-of-integers': () => import('./hamming-weights-of-integers'),
  'lonely-integer': () => import('./lonely-integer'),
  'swap-odd-and-even-bits': () => import('./swap-odd-and-even-bits'),
};

/**
 * Loads and returns the full algorithm definition for a visualization.
 * Returns null if no visualization exists for the given id.
 */
export async function getVisualization(id: string): Promise<AlgorithmDefinition | null> {
  const loader = visualizations[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

/**
 * Checks whether a visualization module exists for the given problem id.
 */
export function hasVisualization(id: string): boolean {
  return id in visualizations;
}
