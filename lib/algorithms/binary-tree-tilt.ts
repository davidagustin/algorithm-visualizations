import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const binaryTreeTilt: AlgorithmDefinition = {
  id: 'binary-tree-tilt',
  title: 'Binary Tree Tilt',
  leetcodeNumber: 563,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the sum of every node\'s tilt. The tilt of a node is the absolute difference between the sum of all left subtree node values and the sum of all right subtree node values. Use postorder traversal to compute subtree sums bottom-up.',
  tags: ['tree', 'postorder', 'tilt', 'recursion', 'subtree sum'],

  code: {
    pseudocode: `function findTilt(root):
  totalTilt = 0
  function postorder(node) -> subtreeSum:
    if node is null: return 0
    leftSum = postorder(node.left)
    rightSum = postorder(node.right)
    totalTilt += |leftSum - rightSum|
    return leftSum + rightSum + node.val
  postorder(root)
  return totalTilt`,

    python: `def findTilt(root):
    total_tilt = 0
    def postorder(node):
        nonlocal total_tilt
        if not node:
            return 0
        left_sum = postorder(node.left)
        right_sum = postorder(node.right)
        total_tilt += abs(left_sum - right_sum)
        return left_sum + right_sum + node.val
    postorder(root)
    return total_tilt`,

    javascript: `function findTilt(root) {
  let totalTilt = 0;
  function postorder(node) {
    if (!node) return 0;
    const leftSum = postorder(node.left);
    const rightSum = postorder(node.right);
    totalTilt += Math.abs(leftSum - rightSum);
    return leftSum + rightSum + node.val;
  }
  postorder(root);
  return totalTilt;
}`,

    java: `public int findTilt(TreeNode root) {
    int[] totalTilt = {0};
    postorder(root, totalTilt);
    return totalTilt[0];
}
private int postorder(TreeNode node, int[] totalTilt) {
    if (node == null) return 0;
    int left = postorder(node.left, totalTilt);
    int right = postorder(node.right, totalTilt);
    totalTilt[0] += Math.abs(left - right);
    return left + right + node.val;
}`,
  },

  defaultInput: {
    tree: [4, 2, 9, 3, 5, null, 7],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [4, 2, 9, 3, 5, null, 7],
      placeholder: '4,2,9,3,5,null,7',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Compute tilt sum for tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Tilt = sum of |leftSubtreeSum - rightSubtreeSum| for each node.`,
      variables: { totalTilt: 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: {},
      },
    });

    let totalTilt = 0;
    const tiltValues: Record<number, number> = {};
    const visitOrder: number[] = [];

    function postorder(pos: number): number {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return 0;

      const leftSum = postorder(2 * pos + 1);
      const rightSum = postorder(2 * pos + 2);
      const val = tree[pos] as number;
      const tilt = Math.abs(leftSum - rightSum);
      totalTilt += tilt;
      tiltValues[pos] = tilt;
      visitOrder.push(pos);

      steps.push({
        line: 6,
        explanation: `Node ${val} (pos ${pos}): leftSum=${leftSum}, rightSum=${rightSum}, tilt=|${leftSum}-${rightSum}|=${tilt}. totalTilt now ${totalTilt}.`,
        variables: { val, leftSum, rightSum, tilt, totalTilt },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, 'visited'])),
            [pos]: tilt > 0 ? 'active' : 'found',
          },
        },
      });

      return leftSum + rightSum + val;
    }

    postorder(0);

    steps.push({
      line: 8,
      explanation: `All nodes processed. Total tilt = ${totalTilt}.`,
      variables: { result: totalTilt, tiltPerNode: JSON.stringify(tiltValues) },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(visitOrder.map(p => [p, 'found'])),
      },
    });

    return steps;
  },
};

export default binaryTreeTilt;
