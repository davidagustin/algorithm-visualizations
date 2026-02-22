import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const minimumDepthOfBinaryTreeII: AlgorithmDefinition = {
  id: 'minimum-depth-of-binary-tree-ii',
  title: 'Minimum Depth of Binary Tree',
  leetcodeNumber: 111,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return its minimum depth — the number of nodes along the shortest path from the root to the nearest leaf node. A leaf is a node with no children. Handle the case where one child is null (not a leaf path).',
  tags: ['Tree', 'DFS', 'BFS'],
  code: {
    pseudocode: `function minDepth(root):
  if root is null: return 0
  if no left child: return 1 + minDepth(root.right)
  if no right child: return 1 + minDepth(root.left)
  return 1 + min(minDepth(root.left), minDepth(root.right))`,
    python: `def minDepth(root):
    if not root:
        return 0
    if not root.left:
        return 1 + minDepth(root.right)
    if not root.right:
        return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))`,
    javascript: `function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}`,
    java: `public int minDepth(TreeNode root) {
    if (root == null) return 0;
    if (root.left == null) return 1 + minDepth(root.right);
    if (root.right == null) return 1 + minDepth(root.left);
    return 1 + Math.min(minDepth(root.left), minDepth(root.right));
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
      steps.push({ line: 2, explanation: 'Tree is empty. Min depth = 0.', variables: { depth: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Find minimum depth. Must reach a leaf node (both children null).',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      visited.add(idx);
      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const hasLeft = l < tree.length && tree[l] != null;
      const hasRight = r < tree.length && tree[r] != null;

      steps.push({
        line: 2,
        explanation: `Node ${tree[idx]}: hasLeft=${hasLeft}, hasRight=${hasRight}.`,
        variables: { node: tree[idx], hasLeft, hasRight },
        visualization: makeViz(highlights),
      });

      if (!hasLeft && !hasRight) {
        steps.push({
          line: 5,
          explanation: `Node ${tree[idx]} is a leaf! Return depth 1.`,
          variables: { node: tree[idx], returning: 1 },
          visualization: makeViz({ ...highlights, [idx]: 'found' }),
        });
        return 1;
      }

      if (!hasLeft) return 1 + dfs(r);
      if (!hasRight) return 1 + dfs(l);

      const leftMin = dfs(l);
      const rightMin = dfs(r);
      const minD = 1 + Math.min(leftMin, rightMin);

      steps.push({
        line: 5,
        explanation: `Node ${tree[idx]}: leftMin=${leftMin}, rightMin=${rightMin}. Return ${minD}.`,
        variables: { node: tree[idx], leftMin, rightMin, returning: minD },
        visualization: makeViz(highlights),
      });

      return minD;
    }

    const minDepth = dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Minimum depth = ${minDepth}.`,
      variables: { minDepth },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default minimumDepthOfBinaryTreeII;
