import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumDepthOfBinaryTreeII: AlgorithmDefinition = {
  id: 'maximum-depth-of-binary-tree-ii',
  title: 'Maximum Depth of Binary Tree',
  leetcodeNumber: 104,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root node down to the farthest leaf node. Use recursive DFS: depth of node = 1 + max(depth(left), depth(right)).',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function maxDepth(root):
  if root is null: return 0
  leftDepth = maxDepth(root.left)
  rightDepth = maxDepth(root.right)
  return 1 + max(leftDepth, rightDepth)`,
    python: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    javascript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
  },
  defaultInput: { tree: [3, 9, 20, null, null, 15, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: 'e.g. 3,9,20,null,null,15,7',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Max depth = 0.', variables: { depth: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Find maximum depth using DFS. depth(node) = 1 + max(depth(left), depth(right)).',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Index ${idx} is null. Return 0.`,
          variables: { idx, returning: 0 },
          visualization: makeViz(Object.fromEntries(Array.from(visited).map(i => [i, 'visited']))),
        });
        return 0;
      }

      visited.add(idx);
      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 3,
        explanation: `Visit node ${tree[idx]}. Recursing left and right to find max depth.`,
        variables: { node: tree[idx] },
        visualization: makeViz(highlights),
      });

      const l = dfs(2 * idx + 1);
      const r = dfs(2 * idx + 2);
      const depth = 1 + Math.max(l, r);

      steps.push({
        line: 4,
        explanation: `Node ${tree[idx]}: leftDepth=${l}, rightDepth=${r}. Return ${depth}.`,
        variables: { node: tree[idx], leftDepth: l, rightDepth: r, returning: depth },
        visualization: makeViz(highlights),
      });

      return depth;
    }

    const maxDepth = dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Maximum depth = ${maxDepth}.`,
      variables: { maxDepth },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default maximumDepthOfBinaryTreeII;
