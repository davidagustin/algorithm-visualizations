import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const closestBinarySearchTreeValue: AlgorithmDefinition = {
  id: 'closest-binary-search-tree-value',
  title: 'Closest Binary Search Tree Value',
  leetcodeNumber: 270,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST and a target floating-point number, find the value in the BST that is closest to the target. Use BST properties to traverse toward the target, updating the closest value at each node.',
  tags: ['tree', 'BST', 'binary search', 'iterative'],

  code: {
    pseudocode: `function closestValue(root, target):
  closest = root.val
  node = root
  while node is not null:
    if |node.val - target| < |closest - target|:
      closest = node.val
    if target < node.val:
      node = node.left
    else:
      node = node.right
  return closest`,

    python: `def closestValue(root, target):
    closest = root.val
    node = root
    while node:
        if abs(node.val - target) < abs(closest - target):
            closest = node.val
        if target < node.val:
            node = node.left
        else:
            node = node.right
    return closest`,

    javascript: `function closestValue(root, target) {
  let closest = root.val;
  let node = root;
  while (node) {
    if (Math.abs(node.val - target) < Math.abs(closest - target)) {
      closest = node.val;
    }
    node = target < node.val ? node.left : node.right;
  }
  return closest;
}`,

    java: `public int closestValue(TreeNode root, double target) {
    int closest = root.val;
    TreeNode node = root;
    while (node != null) {
        if (Math.abs(node.val - target) < Math.abs(closest - target)) {
            closest = node.val;
        }
        node = target < node.val ? node.left : node.right;
    }
    return closest;
}`,
  },

  defaultInput: {
    tree: [4, 2, 5, 1, 3],
    target: 3.714286,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [4, 2, 5, 1, 3],
      placeholder: '4,2,5,1,3',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'target',
      label: 'Target Value',
      type: 'number',
      defaultValue: 3.714286,
      placeholder: '3.714286',
      helperText: 'Target floating-point value to find closest node to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = input.tree as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];

    let closest = tree[0];

    steps.push({
      line: 1,
      explanation: `Find closest value to target ${target.toFixed(4)} in BST: [${tree}]. Initialize closest = ${closest}.`,
      variables: { target: target.toFixed(4), closest },
      visualization: {
        type: 'tree',
        nodes: [...tree],
        highlights: { 0: 'active' },
      },
    });

    let pos = 0;

    while (pos < tree.length && tree[pos] !== null && tree[pos] !== undefined) {
      const val = tree[pos];
      const diff = Math.abs(val - target);
      const closestDiff = Math.abs(closest - target);

      if (diff < closestDiff) {
        steps.push({
          line: 3,
          explanation: `Node ${val}: |${val} - ${target.toFixed(4)}| = ${diff.toFixed(4)} < |${closest} - ${target.toFixed(4)}| = ${closestDiff.toFixed(4)}. Update closest to ${val}.`,
          variables: { val, diff: diff.toFixed(4), oldClosest: closest, newClosest: val },
          visualization: {
            type: 'tree',
            nodes: [...tree],
            highlights: {
              ...Object.fromEntries(visited.map(v => [v, 'visited'])),
              [pos]: 'found',
            },
          },
        });
        closest = val;
      } else {
        steps.push({
          line: 3,
          explanation: `Node ${val}: |${val} - ${target.toFixed(4)}| = ${diff.toFixed(4)} >= current best ${closestDiff.toFixed(4)}. Keep closest = ${closest}.`,
          variables: { val, diff: diff.toFixed(4), closest },
          visualization: {
            type: 'tree',
            nodes: [...tree],
            highlights: {
              ...Object.fromEntries(visited.map(v => [v, 'visited'])),
              [pos]: 'comparing',
            },
          },
        });
      }

      const direction = target < val ? 'left' : 'right';
      steps.push({
        line: 6,
        explanation: `target ${target.toFixed(4)} ${target < val ? '<' : '>='} ${val}, move ${direction}.`,
        variables: { val, direction, target: target.toFixed(4) },
        visualization: {
          type: 'tree',
          nodes: [...tree],
          highlights: {
            ...Object.fromEntries(visited.map(v => [v, 'visited'])),
            [pos]: 'visited',
          },
        },
      });

      visited.push(pos);
      pos = target < val ? 2 * pos + 1 : 2 * pos + 2;
    }

    steps.push({
      line: 9,
      explanation: `Search complete. Closest value to ${target.toFixed(4)} in BST is ${closest}.`,
      variables: { result: closest, target: target.toFixed(4) },
      visualization: {
        type: 'tree',
        nodes: [...tree],
        highlights: Object.fromEntries(visited.map(v => [v, 'visited'])),
      },
    });

    return steps;
  },
};

export default closestBinarySearchTreeValue;
