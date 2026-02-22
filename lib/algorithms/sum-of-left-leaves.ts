import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const sumOfLeftLeaves: AlgorithmDefinition = {
  id: 'sum-of-left-leaves',
  title: 'Sum of Left Leaves',
  leetcodeNumber: 404,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the sum of all left leaves. A left leaf is a leaf node that is the left child of its parent. Use DFS and pass a flag indicating whether the current node is a left child.',
  tags: ['tree', 'dfs', 'left leaves', 'recursion'],

  code: {
    pseudocode: `function sumOfLeftLeaves(root):
  function dfs(node, isLeft):
    if node is null: return 0
    if isLeaf(node):
      return node.val if isLeft else 0
    return dfs(node.left, true) + dfs(node.right, false)
  return dfs(root, false)`,

    python: `def sumOfLeftLeaves(self, root):
    def dfs(node, is_left):
        if not node:
            return 0
        if not node.left and not node.right:
            return node.val if is_left else 0
        return dfs(node.left, True) + dfs(node.right, False)
    return dfs(root, False)`,

    javascript: `function sumOfLeftLeaves(root) {
  function dfs(node, isLeft) {
    if (!node) return 0;
    if (!node.left && !node.right) {
      return isLeft ? node.val : 0;
    }
    return dfs(node.left, true) + dfs(node.right, false);
  }
  return dfs(root, false);
}`,

    java: `public int sumOfLeftLeaves(TreeNode root) {
    return dfs(root, false);
}
private int dfs(TreeNode node, boolean isLeft) {
    if (node == null) return 0;
    if (node.left == null && node.right == null) {
        return isLeft ? node.val : 0;
    }
    return dfs(node.left, true) + dfs(node.right, false);
}`,
  },

  defaultInput: {
    nodes: [3, 9, 20, null, null, 15, 7],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: '3,9,20,null,null,15,7',
      helperText: 'Level-order array with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    // Tree: 3(root), 9(left), 20(right), 15(left of 20), 7(right of 20)
    // Left leaves: 9 and 15 -> sum = 24
    steps.push({
      line: 1,
      explanation: 'Call dfs(root=3, isLeft=false). Root is never a left child.',
      variables: { node: 3, isLeft: false, sum: 0 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Node 3 is not a leaf. Recurse to left child: dfs(9, isLeft=true).',
      variables: { node: 9, isLeft: true },
      visualization: makeViz({ 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Node 9 is a leaf AND isLeft=true. Contribute 9 to sum.',
      variables: { node: 9, isLeft: true, contribution: 9 },
      visualization: makeViz({ 0: 'visited', 1: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Recurse to right child of 3: dfs(20, isLeft=false).',
      variables: { node: 20, isLeft: false, runningSum: 9 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Node 20 is not a leaf. Recurse to left child: dfs(15, isLeft=true).',
      variables: { node: 15, isLeft: true },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 5: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Node 15 is a leaf AND isLeft=true. Contribute 15 to sum.',
      variables: { node: 15, isLeft: true, contribution: 15 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 5: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Recurse to right child of 20: dfs(7, isLeft=false).',
      variables: { node: 7, isLeft: false },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 5: 'sorted', 6: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Node 7 is a leaf BUT isLeft=false (it is the right child). Contributes 0.',
      variables: { node: 7, isLeft: false, contribution: 0 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 5: 'sorted', 6: 'comparing' }),
    });

    steps.push({
      line: 6,
      explanation: 'All nodes processed. Sum of left leaves = 9 (node 9) + 15 (node 15) + 0 = 24.',
      variables: { leftLeaves: '[9, 15]', sum: 24 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'visited', 5: 'found', 6: 'visited' }),
    });

    steps.push({
      line: 7,
      explanation: 'Return 24. The sum of all left leaves in this tree is 24.',
      variables: { result: 24 },
      visualization: makeViz({ 1: 'found', 5: 'found', 0: 'sorted', 2: 'sorted', 6: 'sorted' }),
    });

    return steps;
  },
};

export default sumOfLeftLeaves;
