import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const rangeSumOfBst: AlgorithmDefinition = {
  id: 'range-sum-of-bst',
  title: 'Range Sum of BST',
  leetcodeNumber: 938,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST and two integers lo and hi, return the sum of all node values in the inclusive range [lo, hi]. Use BST property to prune: skip left subtree if current value is at or below lo, skip right subtree if at or above hi.',
  tags: ['tree', 'BST', 'range query', 'DFS', 'pruning'],

  code: {
    pseudocode: `function rangeSumBST(root, lo, hi):
  if root is null: return 0
  sum = 0
  if root.val >= lo and root.val <= hi:
    sum += root.val
  if root.val > lo:
    sum += rangeSumBST(root.left, lo, hi)
  if root.val < hi:
    sum += rangeSumBST(root.right, lo, hi)
  return sum`,

    python: `def rangeSumBST(root, lo, hi):
    if not root:
        return 0
    total = 0
    if lo <= root.val <= hi:
        total += root.val
    if root.val > lo:
        total += rangeSumBST(root.left, lo, hi)
    if root.val < hi:
        total += rangeSumBST(root.right, lo, hi)
    return total`,

    javascript: `function rangeSumBST(root, lo, hi) {
  if (!root) return 0;
  let sum = 0;
  if (root.val >= lo && root.val <= hi) sum += root.val;
  if (root.val > lo) sum += rangeSumBST(root.left, lo, hi);
  if (root.val < hi) sum += rangeSumBST(root.right, lo, hi);
  return sum;
}`,

    java: `public int rangeSumBST(TreeNode root, int lo, int hi) {
    if (root == null) return 0;
    int sum = 0;
    if (root.val >= lo && root.val <= hi) sum += root.val;
    if (root.val > lo) sum += rangeSumBST(root.left, lo, hi);
    if (root.val < hi) sum += rangeSumBST(root.right, lo, hi);
    return sum;
}`,
  },

  defaultInput: {
    tree: [10, 5, 15, 3, 7, null, 18],
    lo: 7,
    hi: 15,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [10, 5, 15, 3, 7, null, 18],
      placeholder: '10,5,15,3,7,null,18',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'lo',
      label: 'Low Bound',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Lower bound of the range (inclusive)',
    },
    {
      name: 'hi',
      label: 'High Bound',
      type: 'number',
      defaultValue: 15,
      placeholder: '15',
      helperText: 'Upper bound of the range (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const lo = input.lo as number;
    const hi = input.hi as number;
    const steps: AlgorithmStep[] = [];

    let totalSum = 0;
    const included: number[] = [];
    const skipped: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find sum of nodes in range [${lo}, ${hi}]. BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { lo, hi, runningSum: 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    function dfs(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      const val = tree[pos] as number;

      if (val >= lo && val <= hi) {
        totalSum += val;
        included.push(pos);
        steps.push({
          line: 4,
          explanation: `Node ${val} is in [${lo}, ${hi}]. Add to sum. Running sum = ${totalSum}.`,
          variables: { val, lo, hi, runningSum: totalSum },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(included.slice(0, -1).map(p => [p, 'found'])),
              ...Object.fromEntries(skipped.map(p => [p, 'mismatch'])),
              [pos]: 'found',
            },
          },
        });
      } else {
        skipped.push(pos);
        steps.push({
          line: 3,
          explanation: `Node ${val} is ${val < lo ? 'below lo' : 'above hi'} (range [${lo}, ${hi}]). Skip, but ${val > lo ? 'explore left (may have valid nodes)' : 'explore right (may have valid nodes)'}.`,
          variables: { val, lo, hi, runningSum: totalSum },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(included.map(p => [p, 'found'])),
              ...Object.fromEntries(skipped.slice(0, -1).map(p => [p, 'mismatch'])),
              [pos]: 'mismatch',
            },
          },
        });
      }

      if (val > lo) dfs(2 * pos + 1);
      if (val < hi) dfs(2 * pos + 2);
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Range sum complete. Sum of nodes in [${lo}, ${hi}] = ${totalSum}.`,
      variables: { result: totalSum, lo, hi },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: {
          ...Object.fromEntries(included.map(p => [p, 'found'])),
          ...Object.fromEntries(skipped.map(p => [p, 'mismatch'])),
        },
      },
    });

    return steps;
  },
};

export default rangeSumOfBst;
