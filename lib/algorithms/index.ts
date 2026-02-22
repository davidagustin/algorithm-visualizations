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
  'first-and-last-occurrences': () => import('./first-and-last-occurrences'),
  'cutting-wood': () => import('./cutting-wood'),
  'find-target-in-rotated-sorted-array': () => import('./find-target-in-rotated-sorted-array'),
  'find-median-from-two-sorted-arrays': () => import('./find-median-from-two-sorted-arrays'),
  'matrix-search': () => import('./matrix-search'),
  'local-maxima-in-array': () => import('./local-maxima-in-array'),
  'weighted-random-selection': () => import('./weighted-random-selection'),
  'merge-overlapping-intervals': () => import('./merge-overlapping-intervals'),
  'identify-all-interval-overlaps': () => import('./identify-all-interval-overlaps'),
  'largest-overlap-of-intervals': () => import('./largest-overlap-of-intervals'),
  'sum-between-range': () => import('./sum-between-range'),
  'k-sum-subarrays': () => import('./k-sum-subarrays'),
  'product-array-without-current-element': () => import('./product-array-without-current-element'),
  'jump-to-the-end': () => import('./jump-to-the-end'),
  'gas-stations': () => import('./gas-stations'),
  'candies': () => import('./candies'),
  'sort-linked-list': () => import('./sort-linked-list'),
  'sort-array': () => import('./sort-array'),
  'kth-largest-integer': () => import('./kth-largest-integer'),
  'remove-kth-last-node': () => import('./remove-kth-last-node'),
  'linked-list-intersection': () => import('./linked-list-intersection'),
  'lru-cache': () => import('./lru-cache'),
  'palindromic-linked-list': () => import('./palindromic-linked-list'),
  'flatten-multi-level-linked-list': () => import('./flatten-multi-level-linked-list'),
  'next-largest-number-to-the-right': () => import('./next-largest-number-to-the-right'),
  'evaluate-expression': () => import('./evaluate-expression'),
  'repeated-removal-of-adjacent-duplicates': () => import('./repeated-removal-of-adjacent-duplicates'),
  'implement-queue-using-stacks': () => import('./implement-queue-using-stacks'),
  'maximums-of-sliding-window': () => import('./maximums-of-sliding-window'),
  'k-most-frequent-strings': () => import('./k-most-frequent-strings'),
  'combine-sorted-linked-lists': () => import('./combine-sorted-linked-lists'),
  'median-of-integer-stream': () => import('./median-of-integer-stream'),
  'sort-k-sorted-array': () => import('./sort-k-sorted-array'),
  'spiral-traversal': () => import('./spiral-traversal'),
  'reverse-32-bit-integer': () => import('./reverse-32-bit-integer'),
  'maximum-collinear-points': () => import('./maximum-collinear-points'),
  'the-josephus-problem': () => import('./the-josephus-problem'),
  'triangle-numbers': () => import('./triangle-numbers'),
  // Trees
  'balanced-binary-tree-validation': () => import('./balanced-binary-tree-validation'),
  'rightmost-nodes-of-binary-tree': () => import('./rightmost-nodes-of-binary-tree'),
  'widest-binary-tree-level': () => import('./widest-binary-tree-level'),
  'bst-validation': () => import('./bst-validation'),
  'lowest-common-ancestor': () => import('./lowest-common-ancestor'),
  'build-binary-tree-from-preorder-inorder': () => import('./build-binary-tree-from-preorder-inorder'),
  'max-sum-continuous-path': () => import('./max-sum-continuous-path'),
  'binary-tree-symmetry': () => import('./binary-tree-symmetry'),
  'binary-tree-columns': () => import('./binary-tree-columns'),
  'kth-smallest-in-bst': () => import('./kth-smallest-in-bst'),
  'serialize-deserialize-binary-tree': () => import('./serialize-deserialize-binary-tree'),
  // Tries
  'design-a-trie': () => import('./design-a-trie'),
  'insert-and-search-words-with-wildcards': () => import('./insert-and-search-words-with-wildcards'),
  'find-all-words-on-a-board': () => import('./find-all-words-on-a-board'),
  // Backtracking
  'find-all-permutations': () => import('./find-all-permutations'),
  'find-all-subsets': () => import('./find-all-subsets'),
  'combinations-of-a-sum': () => import('./combinations-of-a-sum'),
  'phone-keypad-combinations': () => import('./phone-keypad-combinations'),
  // Graphs
  'graph-deep-copy': () => import('./graph-deep-copy'),
  'count-islands': () => import('./count-islands'),
  'matrix-infection': () => import('./matrix-infection'),
  'bipartite-graph-validation': () => import('./bipartite-graph-validation'),
  'longest-increasing-path': () => import('./longest-increasing-path'),
  'shortest-transformation-sequence': () => import('./shortest-transformation-sequence'),
  'merging-communities': () => import('./merging-communities'),
  'prerequisites': () => import('./prerequisites'),
  'shortest-path': () => import('./shortest-path'),
  'connect-the-dots': () => import('./connect-the-dots'),
  // Dynamic Programming
  'minimum-coin-combination': () => import('./minimum-coin-combination'),
  'matrix-pathways': () => import('./matrix-pathways'),
  'neighborhood-burglary': () => import('./neighborhood-burglary'),
  'longest-common-subsequence': () => import('./longest-common-subsequence'),
  'longest-palindrome-in-string': () => import('./longest-palindrome-in-string'),
  'maximum-subarray-sum': () => import('./maximum-subarray-sum'),
  '0-1-knapsack': () => import('./0-1-knapsack'),
  'largest-square-in-matrix': () => import('./largest-square-in-matrix'),
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
