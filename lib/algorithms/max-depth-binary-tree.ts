import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maxDepthBinaryTree: AlgorithmDefinition = {
  id: 'max-depth-binary-tree',
  title: 'Maximum Depth of Binary Tree',
  leetcodeNumber: 104,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. We use recursive DFS: the depth of each node is 1 + max(depth(left), depth(right)).',
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
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const depthMap: Record<number, number> = {};

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights, depthValues: { ...depthMap } };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Maximum depth is 0.',
        variables: { root: null, result: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find maximum depth starting at root (${tree[0]}). We recursively compute depth of left and right subtrees.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Node at index ${idx} is null. Return depth 0 (base case).`,
          variables: { node: null, return: 0 },
          visualization: makeViz(null),
        });
        return 0;
      }

      const val = tree[idx] as number;
      visited.add(idx);

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Compute depth of left subtree.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const leftDepth = dfs(leftIdx);

      steps.push({
        line: 4,
        explanation: `Back at node ${val}. Left depth = ${leftDepth}. Now compute depth of right subtree.`,
        variables: { node: val, leftDepth },
        visualization: makeViz(idx),
      });

      const rightDepth = dfs(rightIdx);
      const myDepth = 1 + Math.max(leftDepth, rightDepth);
      depthMap[idx] = myDepth;

      steps.push({
        line: 5,
        explanation: `Node ${val}: leftDepth=${leftDepth}, rightDepth=${rightDepth}. Depth = 1 + max(${leftDepth}, ${rightDepth}) = ${myDepth}.`,
        variables: { node: val, leftDepth, rightDepth, depth: myDepth },
        visualization: makeViz(idx),
      });

      return myDepth;
    }

    const maxDepth = dfs(0);

    steps.push({
      line: 5,
      explanation: `Maximum depth of the binary tree is ${maxDepth}.`,
      variables: { maxDepth },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)
        ),
        depthValues: { ...depthMap },
      },
    });

    return steps;
  },
};

export default maxDepthBinaryTree;
