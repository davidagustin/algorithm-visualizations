import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const convertBstToGreaterTree: AlgorithmDefinition = {
  id: 'convert-bst-to-greater-tree',
  title: 'Convert BST to Greater Tree',
  leetcodeNumber: 538,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST, convert it to a Greater Sum Tree where each node value becomes the sum of all values greater than or equal to the original node value. Use reverse inorder traversal (right, root, left) while accumulating a running sum.',
  tags: ['tree', 'BST', 'inorder', 'reverse traversal', 'prefix sum'],

  code: {
    pseudocode: `function convertBST(root):
  runningSum = 0
  function reverseInorder(node):
    if node is null: return
    reverseInorder(node.right)
    runningSum += node.val
    node.val = runningSum
    reverseInorder(node.left)
  reverseInorder(root)
  return root`,

    python: `def convertBST(root):
    running_sum = 0
    def reverse_inorder(node):
        nonlocal running_sum
        if not node:
            return
        reverse_inorder(node.right)
        running_sum += node.val
        node.val = running_sum
        reverse_inorder(node.left)
    reverse_inorder(root)
    return root`,

    javascript: `function convertBST(root) {
  let runningSum = 0;
  function reverseInorder(node) {
    if (!node) return;
    reverseInorder(node.right);
    runningSum += node.val;
    node.val = runningSum;
    reverseInorder(node.left);
  }
  reverseInorder(root);
  return root;
}`,

    java: `public TreeNode convertBST(TreeNode root) {
    int[] sum = {0};
    reverseInorder(root, sum);
    return root;
}
private void reverseInorder(TreeNode node, int[] sum) {
    if (node == null) return;
    reverseInorder(node.right, sum);
    sum[0] += node.val;
    node.val = sum[0];
    reverseInorder(node.left, sum);
}`,
  },

  defaultInput: {
    tree: [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8],
      placeholder: '4,1,6,0,2,5,7',
      helperText: 'Level-order representation of the BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawTree = input.tree as (number | null)[];
    const steps: AlgorithmStep[] = [];

    // Build a mutable copy
    const treeVals = rawTree.map(v => (v === null || v === undefined ? null : Number(v)));

    steps.push({
      line: 1,
      explanation: `Convert BST to Greater Tree. Tree: [${treeVals.map(v => v === null ? 'null' : v).join(', ')}]. Reverse inorder accumulates running sum.`,
      variables: { runningSum: 0 },
      visualization: {
        type: 'tree',
        nodes: [...treeVals] as number[],
        highlights: {},
      },
    });

    let runningSum = 0;
    const visitOrder: number[] = [];

    // Collect reverse inorder positions (right, root, left) iteratively for visualization
    function collectReverseInorder(pos: number): number[] {
      if (pos >= treeVals.length || treeVals[pos] === null) return [];
      return [
        ...collectReverseInorder(2 * pos + 2),
        pos,
        ...collectReverseInorder(2 * pos + 1),
      ];
    }

    const order = collectReverseInorder(0);

    for (const pos of order) {
      const oldVal = treeVals[pos] as number;
      runningSum += oldVal;
      treeVals[pos] = runningSum;
      visitOrder.push(pos);

      steps.push({
        line: 5,
        explanation: `Visit node at position ${pos} (original value ${oldVal}). runningSum = ${runningSum - oldVal} + ${oldVal} = ${runningSum}. Node value updated to ${runningSum}.`,
        variables: { position: pos, oldVal, runningSum },
        visualization: {
          type: 'tree',
          nodes: [...treeVals] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(v => [v, 'visited'])),
            [pos]: 'active',
          },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Conversion complete. Greater Tree: [${treeVals.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(treeVals) },
      visualization: {
        type: 'tree',
        nodes: [...treeVals] as number[],
        highlights: Object.fromEntries(visitOrder.map(v => [v, 'found'])),
      },
    });

    return steps;
  },
};

export default convertBstToGreaterTree;
