import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumDepthOfNAryTree: AlgorithmDefinition = {
  id: 'maximum-depth-of-n-ary-tree',
  title: 'Maximum Depth of N-ary Tree',
  leetcodeNumber: 559,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of an N-ary tree, return its maximum depth — the number of nodes along the longest path from root to the farthest leaf. Represented as a binary tree for visualization (children stored left-to-right using left/right pointers).',
  tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
  code: {
    pseudocode: `function maxDepth(root):
  if root is null: return 0
  if root has no children: return 1
  maxChildDepth = 0
  for child in root.children:
    maxChildDepth = max(maxChildDepth, maxDepth(child))
  return 1 + maxChildDepth`,
    python: `def maxDepth(root):
    if not root:
        return 0
    if not root.children:
        return 1
    return 1 + max(maxDepth(child) for child in root.children)`,
    javascript: `function maxDepth(root) {
  if (!root) return 0;
  if (!root.children.length) return 1;
  return 1 + Math.max(...root.children.map(maxDepth));
}`,
    java: `public int maxDepth(Node root) {
    if (root == null) return 0;
    int max = 0;
    for (Node child : root.children)
        max = Math.max(max, maxDepth(child));
    return max + 1;
}`,
  },
  defaultInput: { tree: [1, null, 3, 2, 4, null, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'N-ary Tree (level-order, null as separator)',
      type: 'tree',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: 'e.g. 1,null,3,2,4,null,5,6',
      helperText: 'Level-order with null separating children groups.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    // Treat as binary tree for visualization purposes
    const rawTree = (input.tree as (number | null)[]).filter(v => v !== null) as number[];
    const tree: (number | null)[] = rawTree.length > 0 ? rawTree : [];
    const steps: AlgorithmStep[] = [];

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0) {
      steps.push({ line: 2, explanation: 'Tree is empty. Max depth = 0.', variables: { depth: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Find maximum depth using DFS recursion.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const visited = new Set<number>();

    function dfs(idx: number, depth: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 4,
        explanation: `Visit node ${tree[idx]} at depth ${depth}. Exploring children.`,
        variables: { node: tree[idx], currentDepth: depth },
        visualization: makeViz(highlights),
      });

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const leftDepth = dfs(l, depth + 1);
      const rightDepth = dfs(r, depth + 1);
      const maxChild = Math.max(leftDepth, rightDepth);

      steps.push({
        line: 6,
        explanation: `Node ${tree[idx]}: left child depth=${leftDepth}, right child depth=${rightDepth}. Return ${1 + maxChild}.`,
        variables: { node: tree[idx], leftDepth, rightDepth, returning: 1 + maxChild },
        visualization: makeViz(highlights),
      });

      return 1 + maxChild;
    }

    const maxDepth = dfs(0, 1);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 7,
      explanation: `Maximum depth = ${maxDepth}.`,
      variables: { maxDepth },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default maximumDepthOfNAryTree;
