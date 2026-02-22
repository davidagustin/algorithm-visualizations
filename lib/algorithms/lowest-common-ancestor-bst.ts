import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const lowestCommonAncestorBst: AlgorithmDefinition = {
  id: 'lowest-common-ancestor-bst',
  title: 'Lowest Common Ancestor of a Binary Search Tree',
  leetcodeNumber: 235,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST and two nodes p and q, find their lowest common ancestor. The LCA is the deepest node that has both p and q as descendants. Use BST property: if both values are less than the current node go left, if both are greater go right, otherwise the current node is the LCA.',
  tags: ['tree', 'BST', 'LCA', 'recursion', 'iterative'],

  code: {
    pseudocode: `function lowestCommonAncestor(root, p, q):
  node = root
  while node is not null:
    if p < node.val and q < node.val:
      node = node.left
    else if p > node.val and q > node.val:
      node = node.right
    else:
      return node.val
  return null`,

    python: `def lowestCommonAncestor(root, p, q):
    node = root
    while node:
        if p.val < node.val and q.val < node.val:
            node = node.left
        elif p.val > node.val and q.val > node.val:
            node = node.right
        else:
            return node
    return None`,

    javascript: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) {
      node = node.left;
    } else if (p.val > node.val && q.val > node.val) {
      node = node.right;
    } else {
      return node;
    }
  }
  return null;
}`,

    java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode node = root;
    while (node != null) {
        if (p.val < node.val && q.val < node.val) {
            node = node.left;
        } else if (p.val > node.val && q.val > node.val) {
            node = node.right;
        } else {
            return node;
        }
    }
    return null;
}`,
  },

  defaultInput: {
    tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
    p: 2,
    q: 8,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5],
      placeholder: '6,2,8,0,4,7,9',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'p',
      label: 'Node p value',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Value of first node',
    },
    {
      name: 'q',
      label: 'Node q value',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Value of second node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const p = input.p as number;
    const q = input.q as number;
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find LCA of p=${p} and q=${q} in BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Start at root.`,
      variables: { p, q, currentNode: tree[0] },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    let pos = 0;

    while (pos < tree.length && tree[pos] !== null && tree[pos] !== undefined) {
      const val = tree[pos] as number;

      if (p < val && q < val) {
        steps.push({
          line: 3,
          explanation: `Both p=${p} and q=${q} are less than ${val}. LCA must be in left subtree. Go left.`,
          variables: { currentNode: val, p, q, direction: 'left' },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visited.map(v => [v, 'visited'])),
              [pos]: 'comparing',
            },
          },
        });
        visited.push(pos);
        pos = 2 * pos + 1;
      } else if (p > val && q > val) {
        steps.push({
          line: 5,
          explanation: `Both p=${p} and q=${q} are greater than ${val}. LCA must be in right subtree. Go right.`,
          variables: { currentNode: val, p, q, direction: 'right' },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visited.map(v => [v, 'visited'])),
              [pos]: 'comparing',
            },
          },
        });
        visited.push(pos);
        pos = 2 * pos + 2;
      } else {
        steps.push({
          line: 7,
          explanation: `Node ${val} is the LCA of p=${p} and q=${q}. One value is on each side (or equals current). Return ${val}.`,
          variables: { currentNode: val, p, q, result: val },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visited.map(v => [v, 'visited'])),
              [pos]: 'found',
            },
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 8,
      explanation: `LCA search complete.`,
      variables: { result: null },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(visited.map(v => [v, 'visited'])),
      },
    });

    return steps;
  },
};

export default lowestCommonAncestorBst;
