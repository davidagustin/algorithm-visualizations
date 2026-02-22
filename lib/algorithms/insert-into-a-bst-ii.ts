import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const insertIntoABSTII: AlgorithmDefinition = {
  id: 'insert-into-a-bst-ii',
  title: 'Insert into a Binary Search Tree II',
  leetcodeNumber: 701,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Insert a value into a BST. Traverse the tree: if val < current node go left, else go right. When reaching a null position, insert the new node there. The BST property is maintained.',
  tags: ['Tree', 'BST', 'DFS', 'Recursion', 'Insertion'],
  code: {
    pseudocode: `function insertIntoBST(root, val):
  if root is null:
    return new Node(val)
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
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else root.right = insertIntoBST(root.right, val);
  return root;
}`,
    java: `public TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insertIntoBST(root.left, val);
    else root.right = insertIntoBST(root.right, val);
    return root;
}`,
  },
  defaultInput: { tree: [4, 2, 7, 1, 3], val: 5 },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [4, 2, 7, 1, 3],
      placeholder: 'e.g. 4,2,7,1,3',
    },
    {
      name: 'val',
      label: 'Value to Insert',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const val = input.val as number;
    const steps: AlgorithmStep[] = [];
    const path: number[] = [];

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const i of path) if (tree[i] != null) highlights[i] = 'visited';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Insert ${val} into BST. Root = ${tree[0]}.`,
      variables: { val, root: tree[0] },
      visualization: makeViz(0),
    });

    let idx = 0;
    while (idx < tree.length && tree[idx] != null) {
      const cur = tree[idx] as number;
      path.push(idx);
      if (val < cur) {
        steps.push({
          line: 4,
          explanation: `${val} < ${cur}. Go left.`,
          variables: { val, node: cur },
          visualization: makeViz(idx),
        });
        idx = 2 * idx + 1;
      } else {
        steps.push({
          line: 6,
          explanation: `${val} >= ${cur}. Go right.`,
          variables: { val, node: cur },
          visualization: makeViz(idx),
        });
        idx = 2 * idx + 2;
      }
    }

    // Insert at idx
    while (tree.length <= idx) tree.push(null);
    tree[idx] = val;

    steps.push({
      line: 2,
      explanation: `Reached null at position ${idx}. Insert ${val} here.`,
      variables: { val, insertedAt: idx },
      visualization: makeViz(idx),
    });

    steps.push({
      line: 8,
      explanation: `Insertion of ${val} complete!`,
      variables: { val, result: tree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: { ...Object.fromEntries(path.map(i => [i, 'visited'])), [idx]: 'found' },
      },
    });

    return steps;
  },
};

export default insertIntoABSTII;
