import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const countCompleteTreeNodes: AlgorithmDefinition = {
  id: 'count-complete-tree-nodes',
  title: 'Count Complete Tree Nodes',
  leetcodeNumber: 222,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a complete binary tree, return the number of nodes. A complete binary tree has all levels fully filled except possibly the last, which is filled from left to right. The key insight: compute left height and right height. If equal, the left subtree is a perfect tree with 2^h - 1 nodes, so total = 2^h + count(right). Otherwise, the right subtree is perfect, so total = 2^(h-1) + count(left).',
  tags: ['Tree', 'Binary Search', 'DFS'],
  code: {
    pseudocode: `function countNodes(root):
  if root is null: return 0
  lh = leftHeight(root), rh = rightHeight(root)
  if lh == rh:
    return (2^lh - 1) + countNodes(root.right) + 1
  else:
    return (2^(lh-1) - 1) + countNodes(root.left) + 1`,
    python: `def countNodes(root):
    if not root:
        return 0
    lh = rh = 0
    l, r = root, root
    while l: lh += 1; l = l.left
    while r: rh += 1; r = r.right
    if lh == rh:
        return 2**lh - 1
    return 1 + countNodes(root.left) + countNodes(root.right)`,
    javascript: `function countNodes(root) {
  if (!root) return 0;
  let lh = 0, rh = 0;
  let l = root, r = root;
  while (l) { lh++; l = l.left; }
  while (r) { rh++; r = r.right; }
  if (lh === rh) return Math.pow(2, lh) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
    java: `public int countNodes(TreeNode root) {
    if (root == null) return 0;
    int lh = 0, rh = 0;
    TreeNode l = root, r = root;
    while (l != null) { lh++; l = l.left; }
    while (r != null) { rh++; r = r.right; }
    if (lh == rh) return (int)Math.pow(2, lh) - 1;
    return 1 + countNodes(root.left) + countNodes(root.right);
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'Complete Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: 'e.g. 1,2,3,4,5,6',
      helperText: 'Must be a complete binary tree (filled left to right).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(activeIndices: number[], extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      for (const idx of activeIndices) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Node count = 0.',
        variables: { root: null, result: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Count nodes in complete binary tree. Root = ${tree[0]}. Key trick: compare left-most and right-most heights to detect perfect subtrees.`,
      variables: { root: tree[0] },
      visualization: makeViz([0]),
    });

    function leftHeight(idx: number): number {
      let h = 0;
      let cur = idx;
      while (cur < tree.length && tree[cur] != null) {
        h++;
        cur = 2 * cur + 1;
      }
      return h;
    }

    function rightHeight(idx: number): number {
      let h = 0;
      let cur = idx;
      while (cur < tree.length && tree[cur] != null) {
        h++;
        cur = 2 * cur + 2;
      }
      return h;
    }

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Null node. Return 0.`,
          variables: { node: null },
          visualization: makeViz([]),
        });
        return 0;
      }

      const val = tree[idx] as number;
      visited.add(idx);

      const lh = leftHeight(idx);
      const rh = rightHeight(idx);

      steps.push({
        line: 3,
        explanation: `Node ${val}: left height = ${lh}, right height = ${rh}.`,
        variables: { node: val, leftHeight: lh, rightHeight: rh },
        visualization: makeViz([idx]),
      });

      if (lh === rh) {
        const count = Math.pow(2, lh) - 1;
        steps.push({
          line: 4,
          explanation: `lh == rh (${lh}). This subtree rooted at ${val} is a perfect binary tree! Count = 2^${lh} - 1 = ${count}.`,
          variables: { node: val, isPerfect: true, count },
          visualization: makeViz([], { [idx]: 'found' }),
        });
        return count;
      }

      steps.push({
        line: 6,
        explanation: `lh (${lh}) != rh (${rh}). Subtree is not perfect. Recurse into both children.`,
        variables: { node: val, leftHeight: lh, rightHeight: rh },
        visualization: makeViz([idx]),
      });

      const leftCount = dfs(2 * idx + 1);
      const rightCount = dfs(2 * idx + 2);
      const total = 1 + leftCount + rightCount;

      steps.push({
        line: 7,
        explanation: `Node ${val}: leftCount=${leftCount}, rightCount=${rightCount}. Total = 1 + ${leftCount} + ${rightCount} = ${total}.`,
        variables: { node: val, leftCount, rightCount, total },
        visualization: makeViz([idx]),
      });

      return total;
    }

    const result = dfs(0);

    steps.push({
      line: 7,
      explanation: `Total node count = ${result}.`,
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default countCompleteTreeNodes;
