import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const trimBst: AlgorithmDefinition = {
  id: 'trim-bst',
  title: 'Trim a Binary Search Tree',
  leetcodeNumber: 669,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST and a range [lo, hi], trim the tree so all values are within [lo, hi]. If the root value is less than lo, the trimmed tree is the trimmed right subtree. If greater than hi, it is the trimmed left subtree. Otherwise trim both children.',
  tags: ['tree', 'BST', 'recursion', 'trimming'],

  code: {
    pseudocode: `function trimBST(root, lo, hi):
  if root is null: return null
  if root.val < lo:
    return trimBST(root.right, lo, hi)
  if root.val > hi:
    return trimBST(root.left, lo, hi)
  root.left = trimBST(root.left, lo, hi)
  root.right = trimBST(root.right, lo, hi)
  return root`,

    python: `def trimBST(root, lo, hi):
    if not root:
        return None
    if root.val < lo:
        return trimBST(root.right, lo, hi)
    if root.val > hi:
        return trimBST(root.left, lo, hi)
    root.left = trimBST(root.left, lo, hi)
    root.right = trimBST(root.right, lo, hi)
    return root`,

    javascript: `function trimBST(root, lo, hi) {
  if (!root) return null;
  if (root.val < lo) return trimBST(root.right, lo, hi);
  if (root.val > hi) return trimBST(root.left, lo, hi);
  root.left = trimBST(root.left, lo, hi);
  root.right = trimBST(root.right, lo, hi);
  return root;
}`,

    java: `public TreeNode trimBST(TreeNode root, int lo, int hi) {
    if (root == null) return null;
    if (root.val < lo) return trimBST(root.right, lo, hi);
    if (root.val > hi) return trimBST(root.left, lo, hi);
    root.left = trimBST(root.left, lo, hi);
    root.right = trimBST(root.right, lo, hi);
    return root;
}`,
  },

  defaultInput: {
    tree: [3, 0, 4, null, 2, null, null, null, null, 1],
    lo: 1,
    hi: 3,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [3, 0, 4, null, 2, null, null, null, null, 1],
      placeholder: '3,0,4,null,2',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'lo',
      label: 'Low Bound',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Minimum allowed value (inclusive)',
    },
    {
      name: 'hi',
      label: 'High Bound',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum allowed value (inclusive)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => v === null ? null : Number(v));
    const lo = input.lo as number;
    const hi = input.hi as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Trim BST to range [${lo}, ${hi}]. Tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { lo, hi },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    const trimmed: (number | null)[] = [];
    const removed: number[] = [];

    function trim(pos: number, resultPos: number): boolean {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return false;

      const val = tree[pos] as number;

      if (val < lo) {
        steps.push({
          line: 3,
          explanation: `Node ${val} < lo (${lo}). Remove this node and replace with its right subtree.`,
          variables: { val, lo, hi, action: 'remove - too small' },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: { [pos]: 'mismatch' },
          },
        });
        removed.push(pos);
        return false;
      }

      if (val > hi) {
        steps.push({
          line: 5,
          explanation: `Node ${val} > hi (${hi}). Remove this node and replace with its left subtree.`,
          variables: { val, lo, hi, action: 'remove - too large' },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: { [pos]: 'mismatch' },
          },
        });
        removed.push(pos);
        return false;
      }

      steps.push({
        line: 7,
        explanation: `Node ${val} is within [${lo}, ${hi}]. Keep it and trim its children.`,
        variables: { val, lo, hi, action: 'keep' },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: { [pos]: 'found', ...Object.fromEntries(removed.map(r => [r, 'mismatch'])) },
        },
      });

      while (trimmed.length <= resultPos) trimmed.push(null);
      trimmed[resultPos] = val;

      trim(2 * pos + 1, 2 * resultPos + 1);
      trim(2 * pos + 2, 2 * resultPos + 2);
      return true;
    }

    trim(0, 0);

    steps.push({
      line: 8,
      explanation: `Trimming complete. Result tree: [${trimmed.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(trimmed) },
      visualization: {
        type: 'tree',
        nodes: [...trimmed] as number[],
        highlights: Object.fromEntries(
          trimmed.map((v, i) => [i, v !== null ? 'found' : 'default'])
        ),
      },
    });

    return steps;
  },
};

export default trimBst;
