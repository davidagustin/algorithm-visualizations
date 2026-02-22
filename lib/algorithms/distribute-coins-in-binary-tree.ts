import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const distributeCoinsInBinaryTree: AlgorithmDefinition = {
  id: 'distribute-coins-in-binary-tree',
  title: 'Distribute Coins in Binary Tree',
  leetcodeNumber: 979,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'You have a binary tree where each node has some coins, and total coins equals the number of nodes. In one move, a coin can be moved along an edge. Return the minimum moves to give every node exactly one coin. For each node, the excess = node.val + left_excess + right_excess - 1. Moves = sum of |excess| for all nodes.',
  tags: ['Tree', 'DFS', 'Post-order'],
  code: {
    pseudocode: `moves = 0
function distributeCoins(root):
  dfs(root)
  return moves

function dfs(node):
  if null: return 0
  leftExcess = dfs(node.left)
  rightExcess = dfs(node.right)
  excess = node.val + leftExcess + rightExcess - 1
  moves += abs(leftExcess) + abs(rightExcess)
  return excess`,
    python: `def distributeCoins(root):
    moves = 0
    def dfs(node):
        nonlocal moves
        if not node: return 0
        left = dfs(node.left)
        right = dfs(node.right)
        moves += abs(left) + abs(right)
        return node.val + left + right - 1
    dfs(root)
    return moves`,
    javascript: `function distributeCoins(root) {
  let moves = 0;
  function dfs(node) {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    moves += Math.abs(left) + Math.abs(right);
    return node.val + left + right - 1;
  }
  dfs(root);
  return moves;
}`,
    java: `int moves = 0;
public int distributeCoins(TreeNode root) {
    dfs(root);
    return moves;
}
int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = dfs(node.left), right = dfs(node.right);
    moves += Math.abs(left) + Math.abs(right);
    return node.val + left + right - 1;
}`,
  },
  defaultInput: { tree: [3, 0, 0] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 0, 0],
      placeholder: 'e.g. 3,0,0',
      helperText: 'Level-order. Total coins = number of nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let moves = 0;
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Moves = 0.', variables: { moves: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Distribute coins so each node has exactly 1. Count moves = sum of |excess| at each edge.',
      variables: { root: tree[0], moves: 0 },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const leftExcess = dfs(l);
      const rightExcess = dfs(r);

      const movesHere = Math.abs(leftExcess) + Math.abs(rightExcess);
      moves += movesHere;
      const excess = (tree[idx] as number) + leftExcess + rightExcess - 1;

      steps.push({
        line: 9,
        explanation: `Node ${tree[idx]}: leftExcess=${leftExcess}, rightExcess=${rightExcess}. movesHere=|${leftExcess}|+|${rightExcess}|=${movesHere}. excess=${excess}. Total moves=${moves}.`,
        variables: { node: tree[idx], leftExcess, rightExcess, movesHere, excess, totalMoves: moves },
        visualization: makeViz(highlights),
      });

      return excess;
    }

    dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Minimum moves to distribute all coins = ${moves}.`,
      variables: { moves },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default distributeCoinsInBinaryTree;
