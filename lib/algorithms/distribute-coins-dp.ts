import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const distributeCoins: AlgorithmDefinition = {
  id: 'distribute-coins-dp',
  title: 'Distribute Coins in Binary Tree',
  leetcodeNumber: 979,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Each node in a binary tree has some coins; total coins equals total nodes. In each move, you can move one coin between adjacent nodes. Return the minimum number of moves. Post-order DFS: for each node, compute the excess coins (node.val + leftFlow + rightFlow - 1). Each unit of excess/deficit requires one move to flow through the edge to parent.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function distributeCoins(root):
  moves = 0
  function dfs(node):
    if null: return 0
    leftFlow = dfs(node.left)
    rightFlow = dfs(node.right)
    moves += abs(leftFlow) + abs(rightFlow)
    return node.val + leftFlow + rightFlow - 1
  dfs(root)
  return moves`,
    python: `def distributeCoins(root):
    self.moves = 0
    def dfs(node):
        if not node: return 0
        left = dfs(node.left)
        right = dfs(node.right)
        self.moves += abs(left) + abs(right)
        return node.val + left + right - 1
    dfs(root)
    return self.moves`,
    javascript: `function distributeCoins(root) {
  let moves = 0;
  function dfs(node) {
    if (!node) return 0;
    const left = dfs(node.left), right = dfs(node.right);
    moves += Math.abs(left) + Math.abs(right);
    return node.val + left + right - 1;
  }
  dfs(root);
  return moves;
}`,
    java: `public int distributeCoins(TreeNode root) {
    int[] moves = {0};
    dfs(root, moves);
    return moves[0];
}
private int dfs(TreeNode node, int[] moves) {
    if (node == null) return 0;
    int left = dfs(node.left, moves), right = dfs(node.right, moves);
    moves[0] += Math.abs(left) + Math.abs(right);
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
      helperText: 'Node values are coin counts. Total coins = total nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let moves = 0;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Distribute Coins: post-order DFS computes flow through each edge. moves += |leftFlow| + |rightFlow| at each node. Flow = node.val + leftFlow + rightFlow - 1.',
      variables: { moves: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx] as number;
      steps.push({
        line: 4,
        explanation: `Visit node with ${val} coins at index ${idx}.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const leftFlow = dfs(leftIdx);
      const rightFlow = dfs(rightIdx);

      const edgeMoves = Math.abs(leftFlow) + Math.abs(rightFlow);
      moves += edgeMoves;
      const flow = val + leftFlow + rightFlow - 1;

      steps.push({
        line: 7,
        explanation: `Node ${val}: leftFlow=${leftFlow}, rightFlow=${rightFlow}. Edge moves=${edgeMoves} (total moves=${moves}). Returns flow=${flow} (excess coins flowing to parent).`,
        variables: { node: val, leftFlow, rightFlow, edgeMoves, totalMoves: moves, flow },
        visualization: makeViz(idx, { [idx]: flow === 0 ? 'found' : flow > 0 ? 'comparing' : 'swapping' }),
      });

      return flow;
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Done! Minimum moves to distribute all coins = ${moves}.`,
      variables: { answer: moves },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default distributeCoins;
