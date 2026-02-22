import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const searchInBst: AlgorithmDefinition = {
  id: 'search-in-bst',
  title: 'Search in a Binary Search Tree',
  leetcodeNumber: 700,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST and a target value, find the node with that value and return the subtree rooted at it. Use the BST property: go left if target is less than current node, go right if greater. Return null if not found.',
  tags: ['tree', 'BST', 'search', 'recursion'],

  code: {
    pseudocode: `function searchBST(root, val):
  if root is null or root.val == val:
    return root
  if val < root.val:
    return searchBST(root.left, val)
  else:
    return searchBST(root.right, val)`,

    python: `def searchBST(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return searchBST(root.left, val)
    return searchBST(root.right, val)`,

    javascript: `function searchBST(root, val) {
  if (!root || root.val === val) return root;
  if (val < root.val) return searchBST(root.left, val);
  return searchBST(root.right, val);
}`,

    java: `public TreeNode searchBST(TreeNode root, int val) {
    if (root == null || root.val == val) return root;
    if (val < root.val) return searchBST(root.left, val);
    return searchBST(root.right, val);
}`,
  },

  defaultInput: {
    tree: [4, 2, 7, 1, 3],
    val: 2,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [4, 2, 7, 1, 3],
      placeholder: '4,2,7,1,3',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'val',
      label: 'Search Value',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Value to search for in the BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = input.tree as number[];
    const val = input.val as number;
    const steps: AlgorithmStep[] = [];
    const visited: number[] = [];

    steps.push({
      line: 1,
      explanation: `Search for value ${val} in BST: [${tree}]. Start at root (value ${tree[0]}).`,
      variables: { val, root: tree[0] },
      visualization: {
        type: 'tree',
        nodes: [...tree],
        highlights: { 0: 'active' },
      },
    });

    let pos = 0;
    let found = false;

    while (pos < tree.length) {
      const current = tree[pos];

      if (current === null || current === undefined) {
        steps.push({
          line: 2,
          explanation: `Reached null node. Value ${val} is not in the BST.`,
          variables: { val, result: 'null' },
          visualization: {
            type: 'tree',
            nodes: [...tree],
            highlights: Object.fromEntries(visited.map(v => [v, 'visited'])),
          },
        });
        break;
      }

      const highlights: Record<number, string> = {
        ...Object.fromEntries(visited.map(v => [v, 'visited'])),
        [pos]: 'comparing',
      };

      if (current === val) {
        steps.push({
          line: 2,
          explanation: `Found ${val} at position ${pos} in the tree! Return this subtree.`,
          variables: { val, foundAt: pos, nodeValue: current },
          visualization: {
            type: 'tree',
            nodes: [...tree],
            highlights: { ...Object.fromEntries(visited.map(v => [v, 'visited'])), [pos]: 'found' },
          },
        });
        found = true;
        break;
      }

      steps.push({
        line: 3,
        explanation: `Current node is ${current}. ${val} ${val < current ? '<' : '>'} ${current}, go ${val < current ? 'left' : 'right'}.`,
        variables: { current, val, direction: val < current ? 'left' : 'right' },
        visualization: {
          type: 'tree',
          nodes: [...tree],
          highlights,
        },
      });

      visited.push(pos);
      pos = val < current ? 2 * pos + 1 : 2 * pos + 2;
    }

    if (!found && pos >= tree.length) {
      steps.push({
        line: 2,
        explanation: `Value ${val} not found in the BST.`,
        variables: { val, result: 'null' },
        visualization: {
          type: 'tree',
          nodes: [...tree],
          highlights: Object.fromEntries(visited.map(v => [v, 'visited'])),
        },
      });
    }

    return steps;
  },
};

export default searchInBst;
