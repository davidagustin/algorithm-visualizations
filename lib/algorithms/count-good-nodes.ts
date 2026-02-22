import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countGoodNodes: AlgorithmDefinition = {
  id: 'count-good-nodes',
  title: 'Count Good Nodes in Binary Tree',
  leetcodeNumber: 1448,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree, count the number of "good" nodes. A node X is good if on the path from root to X there are no nodes with a value greater than X. Use DFS tracking the maximum value seen so far on the path from root to the current node.',
  tags: ['tree', 'DFS', 'path', 'preorder', 'maximum tracking'],

  code: {
    pseudocode: `function goodNodes(root):
  count = 0
  function dfs(node, maxSoFar):
    if node is null: return
    if node.val >= maxSoFar:
      count++
    maxSoFar = max(maxSoFar, node.val)
    dfs(node.left, maxSoFar)
    dfs(node.right, maxSoFar)
  dfs(root, -infinity)
  return count`,

    python: `def goodNodes(root):
    count = 0
    def dfs(node, max_so_far):
        nonlocal count
        if not node: return
        if node.val >= max_so_far:
            count += 1
        max_so_far = max(max_so_far, node.val)
        dfs(node.left, max_so_far)
        dfs(node.right, max_so_far)
    dfs(root, float('-inf'))
    return count`,

    javascript: `function goodNodes(root) {
  let count = 0;
  function dfs(node, maxSoFar) {
    if (!node) return;
    if (node.val >= maxSoFar) count++;
    maxSoFar = Math.max(maxSoFar, node.val);
    dfs(node.left, maxSoFar);
    dfs(node.right, maxSoFar);
  }
  dfs(root, -Infinity);
  return count;
}`,

    java: `public int goodNodes(TreeNode root) {
    return dfs(root, Integer.MIN_VALUE);
}
private int dfs(TreeNode node, int maxSoFar) {
    if (node == null) return 0;
    int count = node.val >= maxSoFar ? 1 : 0;
    maxSoFar = Math.max(maxSoFar, node.val);
    return count + dfs(node.left, maxSoFar) + dfs(node.right, maxSoFar);
}`,
  },

  defaultInput: {
    tree: [3, 1, 4, 3, null, 1, 5],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [3, 1, 4, 3, null, 1, 5],
      placeholder: '3,1,4,3,null,1,5',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Count good nodes in tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. A node is good if no ancestor has a greater value.`,
      variables: { count: 0, maxSoFar: '-Infinity' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    let count = 0;
    const goodPositions: number[] = [];
    const badPositions: number[] = [];

    function dfs(pos: number, maxSoFar: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;

      const val = tree[pos] as number;
      const isGood = val >= maxSoFar;

      if (isGood) {
        count++;
        goodPositions.push(pos);
      } else {
        badPositions.push(pos);
      }

      steps.push({
        line: 4,
        explanation: `Node ${val}, maxSoFar = ${maxSoFar === -Infinity ? '-Inf' : maxSoFar}. ${isGood ? `${val} >= ${maxSoFar === -Infinity ? '-Inf' : maxSoFar}: GOOD node! count = ${count}.` : `${val} < ${maxSoFar}: NOT a good node.`}`,
        variables: { val, maxSoFar: maxSoFar === -Infinity ? '-Infinity' : maxSoFar, isGood, count },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(goodPositions.slice(0, -1 * (isGood ? 0 : 0)).map(p => [p, 'found'])),
            ...Object.fromEntries(badPositions.map(p => [p, 'mismatch'])),
            [pos]: isGood ? 'found' : 'mismatch',
          },
        },
      });

      const newMax = Math.max(maxSoFar, val);
      dfs(2 * pos + 1, newMax);
      dfs(2 * pos + 2, newMax);
    }

    dfs(0, -Infinity);

    steps.push({
      line: 9,
      explanation: `DFS complete. Good nodes: ${count}. Good positions: [${goodPositions.join(', ')}].`,
      variables: { result: count, goodPositions: JSON.stringify(goodPositions) },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: {
          ...Object.fromEntries(goodPositions.map(p => [p, 'found'])),
          ...Object.fromEntries(badPositions.map(p => [p, 'mismatch'])),
        },
      },
    });

    return steps;
  },
};

export default countGoodNodes;
