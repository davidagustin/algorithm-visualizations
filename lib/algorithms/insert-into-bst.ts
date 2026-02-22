import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const insertIntoBst: AlgorithmDefinition = {
  id: 'insert-into-bst',
  title: 'Insert into a Binary Search Tree',
  leetcodeNumber: 701,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST and a value to insert, insert the value into the BST and return the updated root. Traverse left if the value is less than the current node, right if greater. Insert as a new leaf at the correct position.',
  tags: ['tree', 'BST', 'recursion', 'insertion'],

  code: {
    pseudocode: `function insertIntoBST(root, val):
  if root is null: return new Node(val)
  if val < root.val:
    root.left = insertIntoBST(root.left, val)
  else:
    root.right = insertIntoBST(root.right, val)
  return root`,

    python: `def insertIntoBST(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insertIntoBST(root.left, val)
    else:
        root.right = insertIntoBST(root.right, val)
    return root`,

    javascript: `function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  return root;
}`,

    java: `public TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    return root;
}`,
  },

  defaultInput: {
    tree: [4, 2, 7, 1, 3],
    val: 5,
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
      label: 'Value to Insert',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to insert into the BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = input.tree as number[];
    const val = input.val as number;
    const steps: AlgorithmStep[] = [];

    const nodes = [...tree];

    steps.push({
      line: 1,
      explanation: `Insert value ${val} into BST: [${tree}]. Start at root (index 0, value ${tree[0]}).`,
      variables: { val, root: tree[0] },
      visualization: {
        type: 'tree',
        nodes: [...nodes],
        highlights: { 0: 'active' },
      },
    });

    let pos = 0;
    let depth = 0;

    while (pos < nodes.length && nodes[pos] !== null && nodes[pos] !== undefined) {
      const current = nodes[pos];
      steps.push({
        line: 3,
        explanation: `Compare ${val} with current node ${current}. ${val < current ? `${val} < ${current}, go left.` : `${val} > ${current}, go right.`}`,
        variables: { current, val, direction: val < current ? 'left' : 'right' },
        visualization: {
          type: 'tree',
          nodes: [...nodes],
          highlights: { [pos]: 'comparing' },
        },
      });

      if (val < current) {
        pos = 2 * pos + 1;
      } else {
        pos = 2 * pos + 2;
      }
      depth++;
    }

    // Insert at pos
    while (nodes.length <= pos) nodes.push(null as unknown as number);
    nodes[pos] = val;

    steps.push({
      line: 2,
      explanation: `Reached null position at index ${pos}. Insert ${val} as new leaf node here.`,
      variables: { insertedAt: pos, val, depth },
      visualization: {
        type: 'tree',
        nodes: [...nodes],
        highlights: { [pos]: 'found' },
      },
    });

    steps.push({
      line: 7,
      explanation: `Insertion complete. Updated BST: [${nodes.map(v => v === null || v === undefined ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(nodes) },
      visualization: {
        type: 'tree',
        nodes: [...nodes],
        highlights: { [pos]: 'found' },
      },
    });

    return steps;
  },
};

export default insertIntoBst;
