import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const increasingOrderSearchTree: AlgorithmDefinition = {
  id: 'increasing-order-search-tree',
  title: 'Increasing Order Search Tree',
  leetcodeNumber: 897,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST, rearrange the tree so that it forms an increasing-order chain with no left children. Perform inorder traversal to collect values in sorted order, then build a right-skewed tree from those values.',
  tags: ['tree', 'BST', 'inorder', 'linked list style'],

  code: {
    pseudocode: `function increasingBST(root):
  values = inorderTraversal(root)
  dummy = new Node(0)
  current = dummy
  for val in values:
    current.right = new Node(val)
    current.left = null
    current = current.right
  return dummy.right`,

    python: `def increasingBST(root):
    def inorder(node):
        if not node: return []
        return inorder(node.left) + [node.val] + inorder(node.right)

    values = inorder(root)
    dummy = TreeNode(0)
    cur = dummy
    for v in values:
        cur.right = TreeNode(v)
        cur = cur.right
    return dummy.right`,

    javascript: `function increasingBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  const dummy = new TreeNode(0);
  let cur = dummy;
  for (const v of vals) {
    cur.right = new TreeNode(v);
    cur = cur.right;
  }
  return dummy.right;
}`,

    java: `public TreeNode increasingBST(TreeNode root) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    TreeNode dummy = new TreeNode(0);
    TreeNode cur = dummy;
    for (int v : vals) {
        cur.right = new TreeNode(v);
        cur = cur.right;
    }
    return dummy.right;
}`,
  },

  defaultInput: {
    tree: [5, 3, 6, 2, 4, null, 8, 1, null, null, null, null, null, 7, 9],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [5, 3, 6, 2, 4, null, 8, 1, null, null, null, null, null, 7, 9],
      placeholder: '5,3,6,2,4,null,8,1,null,null,null,null,null,7,9',
      helperText: 'Level-order representation of the BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Flatten BST to increasing right-skewed tree. BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: {},
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    // Inorder traversal to collect sorted values
    const values: number[] = [];
    const visitOrder: number[] = [];

    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);
      values.push(tree[pos] as number);
      visitOrder.push(pos);
      inorder(2 * pos + 2);
    }
    inorder(0);

    steps.push({
      line: 2,
      explanation: `Inorder traversal complete. Sorted values: [${values.join(', ')}].`,
      variables: { sortedValues: JSON.stringify(values) },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(visitOrder.map(p => [p, 'visited'])),
      },
    });

    // Build right-skewed tree as array
    const result: (number | null)[] = [];
    for (let i = 0; i < values.length; i++) {
      result.push(values[i]);

      steps.push({
        line: 5,
        explanation: `Attach ${values[i]} as the next node in the right-skewed chain (position ${i + 1} in new tree).`,
        variables: { val: values[i], chainLength: i + 1 },
        visualization: {
          type: 'array',
          array: [...values],
          highlights: Object.fromEntries(
            values.map((_, idx) => [idx, idx <= i ? 'found' : 'default'])
          ),
          labels: { [i]: 'current' },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Right-skewed tree built. Values in order: [${values.join(', ')}]. Each node has only a right child.`,
      variables: { result: JSON.stringify(values) },
      visualization: {
        type: 'array',
        array: [...values],
        highlights: Object.fromEntries(values.map((_, i) => [i, 'found'])),
        labels: { 0: 'head' },
      },
    });

    return steps;
  },
};

export default increasingOrderSearchTree;
