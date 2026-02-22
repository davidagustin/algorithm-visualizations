import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const houseRobberIii: AlgorithmDefinition = {
  id: 'house-robber-iii',
  title: 'House Robber III',
  leetcodeNumber: 337,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'The thief has found a new place to rob: a binary tree neighborhood. Adjacent nodes (parent-child) cannot both be robbed. Find the maximum amount the thief can rob. Use postorder DP on tree: each node returns a pair [robThis, skipThis] where robThis = node.val + skip(left) + skip(right), skipThis = max(rob/skip left) + max(rob/skip right).',
  tags: ['tree', 'dynamic programming', 'postorder', 'house robber', 'dp on tree'],

  code: {
    pseudocode: `function rob(root):
  function dfs(node):
    if node is null: return [0, 0]
    // [robThisNode, skipThisNode]
    leftPair = dfs(node.left)
    rightPair = dfs(node.right)
    robThis = node.val + leftPair[1] + rightPair[1]  // rob node, skip children
    skipThis = max(leftPair) + max(rightPair)          // skip node, take best of each child
    return [robThis, skipThis]
  pair = dfs(root)
  return max(pair)`,

    python: `def rob(self, root):
    def dfs(node):
        if not node:
            return [0, 0]
        left = dfs(node.left)
        right = dfs(node.right)
        rob_this = node.val + left[1] + right[1]
        skip_this = max(left) + max(right)
        return [rob_this, skip_this]
    return max(dfs(root))`,

    javascript: `function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];
    const [leftRob, leftSkip] = dfs(node.left);
    const [rightRob, rightSkip] = dfs(node.right);
    const robThis = node.val + leftSkip + rightSkip;
    const skipThis = Math.max(leftRob, leftSkip) + Math.max(rightRob, rightSkip);
    return [robThis, skipThis];
  }
  return Math.max(...dfs(root));
}`,

    java: `public int rob(TreeNode root) {
    int[] result = dfs(root);
    return Math.max(result[0], result[1]);
}
private int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left);
    int[] right = dfs(node.right);
    int robThis = node.val + left[1] + right[1];
    int skipThis = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    return new int[]{robThis, skipThis};
}`,
  },

  defaultInput: {
    nodes: [3, 2, 3, null, 3, null, 1],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree house values (level order)',
      type: 'array',
      defaultValue: [3, 2, 3, null, 3, null, 1],
      placeholder: '3,2,3,null,3,null,1',
      helperText: 'Level-order array. Each value is money at that house.',
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

    // Tree: 3(root), 2(left), 3(right), null, 3(2.right), null, 1(3.right)
    // Optimal: rob 3(root) + 3(left.right) + 1(right.right) = 7
    // Or: rob 2(left) + 3(right) = 5
    // So answer is 7
    steps.push({
      line: 1,
      explanation: 'Start postorder DFS. Each node returns [robThis, skipThis] pair.',
      variables: { strategy: 'postorder DP', nodes: '[3,2,3,null,3,null,1]' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Leaf 3 (idx 4, child of node 2)
    steps.push({
      line: 4,
      explanation: 'Visit leaf node (val=3, index 4, child of node 2). Children are null -> [0,0] each.',
      variables: { node: 3, robThis: 3, skipThis: 0, pair: '[3,0]' },
      visualization: makeViz({ 4: 'active' }),
    });

    steps.push({
      line: 7,
      explanation: 'Leaf val=3: robThis=3+0+0=3, skipThis=max(0,0)+max(0,0)=0. Return [3,0].',
      variables: { pair: '[3,0]', robThis: 3, skipThis: 0 },
      visualization: makeViz({ 4: 'found' }),
    });

    // Node 2 (idx 1)
    steps.push({
      line: 4,
      explanation: 'Visit node 2 (index 1). Left=null->[0,0], right=node3->[3,0].',
      variables: { node: 2, leftPair: '[0,0]', rightPair: '[3,0]' },
      visualization: makeViz({ 1: 'active', 4: 'sorted' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 2: robThis=2+left.skip(0)+right.skip(0)=2. skipThis=max(0,0)+max(3,0)=3. Return [2,3].',
      variables: { node: 2, robThis: 2, skipThis: 3, pair: '[2,3]' },
      visualization: makeViz({ 1: 'found', 4: 'sorted' }),
    });

    // Leaf 1 (idx 6, child of node 3)
    steps.push({
      line: 4,
      explanation: 'Visit leaf node (val=1, index 6, child of node 3). Return [1,0].',
      variables: { node: 1, pair: '[1,0]' },
      visualization: makeViz({ 6: 'active' }),
    });

    steps.push({
      line: 7,
      explanation: 'Leaf val=1: robThis=1, skipThis=0. Return [1,0].',
      variables: { pair: '[1,0]', robThis: 1, skipThis: 0 },
      visualization: makeViz({ 6: 'found' }),
    });

    // Node 3 (idx 2, right child of root)
    steps.push({
      line: 4,
      explanation: 'Visit node 3 (index 2, right child of root). Left=null->[0,0], right=node1->[1,0].',
      variables: { node: 3, leftPair: '[0,0]', rightPair: '[1,0]' },
      visualization: makeViz({ 2: 'active', 6: 'sorted' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 3 (idx 2): robThis=3+0+0=3, skipThis=max(0,0)+max(1,0)=1. Return [3,1].',
      variables: { node: 3, robThis: 3, skipThis: 1, pair: '[3,1]' },
      visualization: makeViz({ 2: 'found', 6: 'sorted' }),
    });

    // Root (idx 0)
    steps.push({
      line: 4,
      explanation: 'Visit root (val=3). Left=[2,3] (node 2), right=[3,1] (node 3 right child).',
      variables: { root: 3, leftPair: '[2,3]', rightPair: '[3,1]' },
      visualization: makeViz({ 0: 'active', 1: 'sorted', 2: 'sorted' }),
    });

    steps.push({
      line: 6,
      explanation: 'Root: robThis=3+left.skip(3)+right.skip(1)=3+3+1=7. skipThis=max(2,3)+max(3,1)=3+3=6. Return [7,6].',
      variables: { root: 3, robThis: 7, skipThis: 6, pair: '[7,6]' },
      visualization: makeViz({ 0: 'active', 1: 'sorted', 2: 'sorted', 4: 'sorted', 6: 'sorted' }),
    });

    steps.push({
      line: 9,
      explanation: 'max([7,6]) = 7. Optimal: rob root(3) + node3-right-child(3) + node2-right-child(1) = 7.',
      variables: { result: 7, optimalNodes: '[root=3, idx4=3, idx6=1]' },
      visualization: makeViz({ 0: 'found', 4: 'found', 6: 'found', 1: 'visited', 2: 'visited' }),
    });

    return steps;
  },
};

export default houseRobberIii;
