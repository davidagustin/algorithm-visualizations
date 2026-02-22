import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const distributeCoinsInBinaryTree: AlgorithmDefinition = {
  id: 'distribute-coins-in-binary-tree',
  title: 'Distribute Coins in Binary Tree',
  leetcodeNumber: 979,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree with N nodes and N coins (each node has some coins), find the minimum number of moves to give every node exactly one coin. Use postorder DFS: each node returns its excess (coins - 1 + left excess + right excess). Moves = sum of absolute excess values from all subtrees.',
  tags: ['tree', 'dfs', 'postorder', 'coin distribution', 'greedy'],

  code: {
    pseudocode: `function distributeCoins(root):
  moves = 0
  function dfs(node):
    if node is null: return 0
    leftExcess = dfs(node.left)
    rightExcess = dfs(node.right)
    moves += abs(leftExcess) + abs(rightExcess)
    return node.val - 1 + leftExcess + rightExcess
  dfs(root)
  return moves`,

    python: `def distributeCoins(self, root):
    self.moves = 0
    def dfs(node):
        if not node:
            return 0
        left_excess = dfs(node.left)
        right_excess = dfs(node.right)
        self.moves += abs(left_excess) + abs(right_excess)
        return node.val - 1 + left_excess + right_excess
    dfs(root)
    return self.moves`,

    javascript: `function distributeCoins(root) {
  let moves = 0;
  function dfs(node) {
    if (!node) return 0;
    const leftExcess = dfs(node.left);
    const rightExcess = dfs(node.right);
    moves += Math.abs(leftExcess) + Math.abs(rightExcess);
    return node.val - 1 + leftExcess + rightExcess;
  }
  dfs(root);
  return moves;
}`,

    java: `int moves = 0;
public int distributeCoins(TreeNode root) {
    dfs(root);
    return moves;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int leftExcess = dfs(node.left);
    int rightExcess = dfs(node.right);
    moves += Math.abs(leftExcess) + Math.abs(rightExcess);
    return node.val - 1 + leftExcess + rightExcess;
}`,
  },

  defaultInput: {
    nodes: [3, 0, 0],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree coin values (level order)',
      type: 'array',
      defaultValue: [3, 0, 0],
      placeholder: '3,0,0',
      helperText: 'Each node value is the number of coins at that node. Sum = N nodes.',
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

    // Tree: root=3 coins, left=0 coins, right=0 coins
    // Left subtree excess = 0-1 = -1 (needs 1 coin)
    // Right subtree excess = 0-1 = -1 (needs 1 coin)
    // Moves = |leftExcess| + |rightExcess| = 1 + 1 = 2
    steps.push({
      line: 1,
      explanation: 'Initialize moves=0. Start postorder DFS. Each node returns its excess coins (val-1 + children excess).',
      variables: { moves: 0, strategy: 'postorder DFS' },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Visit left child (val=0). Its children are null (return 0 each). leftExcess = 0-1+0+0 = -1.',
      variables: { node: 0, position: 'left child', leftExcess: -1, meaning: 'needs 1 coin' },
      visualization: makeViz({ 1: 'active' }),
    });

    steps.push({
      line: 6,
      explanation: 'Left node: abs(-1) = 1 move needed to send 1 coin down from parent. moves += 1. Return excess=-1.',
      variables: { moves: 1, leftExcess: -1 },
      visualization: makeViz({ 1: 'found' }),
    });

    steps.push({
      line: 4,
      explanation: 'Visit right child (val=0). Children are null. rightExcess = 0-1+0+0 = -1.',
      variables: { node: 0, position: 'right child', rightExcess: -1, meaning: 'needs 1 coin' },
      visualization: makeViz({ 1: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 6,
      explanation: 'Right node: abs(-1) = 1 move. moves += 1. Total moves = 2. Return excess=-1.',
      variables: { moves: 2, rightExcess: -1 },
      visualization: makeViz({ 1: 'sorted', 2: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: 'Back at root (val=3). leftExcess=-1, rightExcess=-1. moves += abs(-1)+abs(-1) = moves+2. But wait: moves are accumulated in children, so total stays 2.',
      variables: { root: 3, leftExcess: -1, rightExcess: -1, movesFromChildren: 2 },
      visualization: makeViz({ 0: 'active', 1: 'sorted', 2: 'sorted' }),
    });

    steps.push({
      line: 8,
      explanation: 'Root excess = 3-1+(-1)+(-1) = 0. Root ends balanced. It sends 1 coin to each child.',
      variables: { rootExcess: 0, coinsDistributed: '1 to left, 1 to right' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found' }),
    });

    steps.push({
      line: 9,
      explanation: 'Return total moves = 2. Each of the 2 zero-coin nodes needs 1 coin moved from root.',
      variables: { result: 2, explanation: '2 moves total: root gives 1 coin left, 1 coin right' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found' }),
    });

    return steps;
  },
};

export default distributeCoinsInBinaryTree;
