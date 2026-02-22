import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryTreeColoringGame: AlgorithmDefinition = {
  id: 'binary-tree-coloring-game',
  title: 'Binary Tree Coloring Game',
  leetcodeNumber: 1145,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'In a binary tree with n nodes, player 1 picks node x. Player 2 then picks any other node. They alternate coloring adjacent uncolored nodes. Player 2 wins if they can guarantee coloring more nodes. Player 2 wins by picking a node adjacent to x (left child, right child, or parent of x) that has the majority of nodes. Count left subtree size, right subtree size, and parent region size (n - leftSize - rightSize - 1).',
  tags: ['tree', 'dfs', 'greedy', 'math'],

  code: {
    pseudocode: `function btreeGameWinningMove(root, n, x):
  leftSize = 0
  rightSize = 0

  function countNodes(node):
    if node is null: return 0
    left = countNodes(node.left)
    right = countNodes(node.right)
    if node.val == x:
      leftSize = left
      rightSize = right
    return left + right + 1

  countNodes(root)
  parentSize = n - leftSize - rightSize - 1
  half = n / 2
  return max(leftSize, rightSize, parentSize) > half`,
    python: `def btreeGameWinningMove(root, n, x):
    ls = rs = 0
    def count(node):
        nonlocal ls, rs
        if not node: return 0
        l, r = count(node.left), count(node.right)
        if node.val == x:
            ls, rs = l, r
        return l + r + 1
    count(root)
    ps = n - ls - rs - 1
    return max(ls, rs, ps) > n // 2`,
    javascript: `function btreeGameWinningMove(root, n, x) {
  let ls = 0, rs = 0;
  function count(node) {
    if (!node) return 0;
    const l = count(node.left), r = count(node.right);
    if (node.val === x) { ls = l; rs = r; }
    return l + r + 1;
  }
  count(root);
  const ps = n - ls - rs - 1;
  return Math.max(ls, rs, ps) > Math.floor(n / 2);
}`,
    java: `int ls, rs;
public boolean btreeGameWinningMove(TreeNode root, int n, int x) {
    count(root, x);
    int ps = n - ls - rs - 1;
    return Math.max(Math.max(ls, rs), ps) > n / 2;
}
private int count(TreeNode node, int x) {
    if (node == null) return 0;
    int l = count(node.left, x), r = count(node.right, x);
    if (node.val == x) { ls = l; rs = r; }
    return l + r + 1;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    x: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      placeholder: '1,2,3,4,5,6,7,8,9,10,11',
      helperText: 'Level-order binary tree (all values unique)',
    },
    {
      name: 'x',
      label: 'Player 1 Node (x)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Node value chosen by player 1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const x = input.x as number;
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Player 1 chose node with value ${x}. Player 2 must pick adjacent node (left child, right child, or parent) that controls majority.`,
      variables: { x, n, half: Math.floor(n / 2) },
      visualization: makeViz({}, {}),
    });

    let leftSize = 0;
    let rightSize = 0;
    let xIdx = -1;

    function countNodes(idx: number): number {
      if (idx >= nums.length) return 0;
      const l = countNodes(2 * idx + 1);
      const r = countNodes(2 * idx + 2);
      if (nums[idx] === x) {
        leftSize = l;
        rightSize = r;
        xIdx = idx;
      }
      return l + r + 1;
    }

    countNodes(0);
    const parentSize = n - leftSize - rightSize - 1;
    const half = Math.floor(n / 2);
    const canWin = Math.max(leftSize, rightSize, parentSize) > half;

    const h: Record<number, string> = {};
    const l: Record<number, string> = {};

    if (xIdx >= 0) {
      h[xIdx] = 'active';
      l[xIdx] = `P1(x=${x})`;
    }

    steps.push({
      line: 10,
      explanation: `Found node x=${x} at index ${xIdx}. Left subtree size = ${leftSize}, Right subtree size = ${rightSize}, Parent region = ${parentSize}.`,
      variables: { xIdx, leftSize, rightSize, parentSize, n },
      visualization: makeViz(h, l),
    });

    // Highlight left subtree
    function markSubtree(idx: number, color: string, lbl: string) {
      if (idx >= nums.length) return;
      h[idx] = color;
      l[idx] = lbl;
      markSubtree(2 * idx + 1, color, lbl);
      markSubtree(2 * idx + 2, color, lbl);
    }

    if (xIdx >= 0) {
      markSubtree(2 * xIdx + 1, 'visiting', `L(${leftSize})`);
      markSubtree(2 * xIdx + 2, 'comparing', `R(${rightSize})`);
    }

    steps.push({
      line: 11,
      explanation: `Left region: ${leftSize} nodes. Right region: ${rightSize} nodes. Parent region: n - leftSize - rightSize - 1 = ${n} - ${leftSize} - ${rightSize} - 1 = ${parentSize} nodes.`,
      variables: { leftSize, rightSize, parentSize },
      visualization: makeViz({ ...h }, { ...l }),
    });

    const bestRegion = leftSize > rightSize && leftSize > parentSize ? 'left child' :
      rightSize > parentSize ? 'right child' : 'parent';
    const bestSize = Math.max(leftSize, rightSize, parentSize);

    steps.push({
      line: 12,
      explanation: `Best move for player 2: pick the ${bestRegion} of node ${x} (controls ${bestSize} nodes). half = ${half}. ${bestSize} > ${half} = ${canWin}. Player 2 ${canWin ? 'WINS' : 'CANNOT WIN'}.`,
      variables: { bestMove: bestRegion, bestSize, half, canWin },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, canWin ? 'found' : 'mismatch'])),
        {}
      ),
    });

    return steps;
  },
};

export default binaryTreeColoringGame;
