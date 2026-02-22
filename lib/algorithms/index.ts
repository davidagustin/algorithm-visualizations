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
