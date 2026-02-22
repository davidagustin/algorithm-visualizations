import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const minDepthBinaryTree: AlgorithmDefinition = {
  id: 'min-depth-binary-tree',
  title: 'Minimum Depth of Binary Tree',
  leetcodeNumber: 111,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given a binary tree, find its minimum depth. The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node. Note: a leaf is a node with no children. We use recursive DFS, being careful not to count a null child as a leaf.',
  tags: ['Tree', 'DFS', 'BFS', 'Recursion'],
  code: {
    pseudocode: `function minDepth(root):
  if root is null: return 0
  if root.left is null and root.right is null: return 1
  if root.left is null: return 1 + minDepth(root.right)
  if root.right is null: return 1 + minDepth(root.left)
  return 1 + min(minDepth(root.left), minDepth(root.right))`,
    python: `def minDepth(root):
    if not root:
        return 0
    if not root.left and not root.right:
        return 1
    if not root.left:
        return 1 + minDepth(root.right)
    if not root.right:
        return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))`,
    javascript: `function minDepth(root) {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}`,
    java: `public int minDepth(TreeNode root) {
    if (root == null) return 0;
    if (root.left == null && root.right == null) return 1;
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
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const depthMap: Record<number, number> = {};

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights, depthValues: { ...depthMap } };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Minimum depth is 0.',
        variables: { root: null, result: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find minimum depth starting at root (${tree[0]}). Minimum depth is the shortest root-to-leaf path.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    let minLeafDepth = Infinity;
    let minLeafIdx = -1;

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        return 0;
      }

      const val = tree[idx] as number;
      visited.add(idx);

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
      const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Left child: ${hasLeft ? tree[leftIdx] : 'null'}, Right child: ${hasRight ? tree[rightIdx] : 'null'}.`,
        variables: { node: val, hasLeft, hasRight },
        visualization: makeViz(idx),
      });

      if (!hasLeft && !hasRight) {
        depthMap[idx] = 1;
        steps.push({
          line: 3,
          explanation: `Node ${val} is a leaf node! Minimum depth through this path contributes 1.`,
          variables: { node: val, isLeaf: true, depth: 1 },
          visualization: makeViz(null, { [idx]: 'found' }),
        });
        return 1;
      }

      let myDepth: number;
      if (!hasLeft) {
        steps.push({
          line: 4,
          explanation: `Node ${val} has no left child. Only recurse right.`,
          variables: { node: val },
          visualization: makeViz(idx),
        });
        const rightDepth = dfs(rightIdx);
        myDepth = 1 + rightDepth;
      } else if (!hasRight) {
        steps.push({
          line: 5,
          explanation: `Node ${val} has no right child. Only recurse left.`,
          variables: { node: val },
          visualization: makeViz(idx),
        });
        const leftDepth = dfs(leftIdx);
        myDepth = 1 + leftDepth;
      } else {
        const leftDepth = dfs(leftIdx);
        const rightDepth = dfs(rightIdx);
        myDepth = 1 + Math.min(leftDepth, rightDepth);
        steps.push({
          line: 6,
          explanation: `Node ${val}: leftDepth=${leftDepth}, rightDepth=${rightDepth}. minDepth = 1 + min(${leftDepth}, ${rightDepth}) = ${myDepth}.`,
          variables: { node: val, leftDepth, rightDepth, myDepth },
          visualization: makeViz(idx),
        });
      }

      depthMap[idx] = myDepth;
      if (myDepth < minLeafDepth) {
        minLeafDepth = myDepth;
        minLeafIdx = idx;
      }

      return myDepth;
    }

    const result = dfs(0);

    steps.push({
      line: 6,
      explanation: `Minimum depth of the binary tree is ${result}.`,
      variables: { minDepth: result },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: {
          ...Object.fromEntries(
            tree.map((_, i) => [i, 'visited']).filter(([i]) => tree[i as number] != null)
          ),
          ...(minLeafIdx >= 0 ? { [minLeafIdx]: 'found' } : {}),
        },
        depthValues: { ...depthMap },
      },
    });

    return steps;
  },
};

export default minDepthBinaryTree;
