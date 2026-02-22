import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const houseRobberIII: AlgorithmDefinition = {
  id: 'house-robber-iii-dp',
  title: 'House Robber III',
  leetcodeNumber: 337,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'The thief has found a new place to rob: a binary tree neighborhood. Each node stores money. The constraint is that adjacent nodes (parent-child) cannot both be robbed. Use tree DP: for each node, compute two values — max money if this node is robbed, and max money if it is not robbed. The answer is the max of these two at the root.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function rob(root):
  function dfs(node):
    if node is null: return (0, 0)
    leftRob, leftSkip = dfs(node.left)
    rightRob, rightSkip = dfs(node.right)
    robThis = node.val + leftSkip + rightSkip
    skipThis = max(leftRob, leftSkip) + max(rightRob, rightSkip)
    return (robThis, skipThis)
  robRoot, skipRoot = dfs(root)
  return max(robRoot, skipRoot)`,
    python: `def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)
        left_rob, left_skip = dfs(node.left)
        right_rob, right_skip = dfs(node.right)
        rob_this = node.val + left_skip + right_skip
        skip_this = max(left_rob, left_skip) + max(right_rob, right_skip)
        return (rob_this, skip_this)
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
    int[] res = dfs(root);
    return Math.max(res[0], res[1]);
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
  defaultInput: { tree: [3, 2, 3, null, 3, null, 1] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 2, 3, null, 3, null, 1],
      placeholder: 'e.g. 3,2,3,null,3,null,1',
      helperText: 'Level-order traversal with null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const dpRob: Record<number, number> = {};
    const dpSkip: Record<number, number> = {};

    function makeViz(activeIdx: number | null, highlights: Record<number, string> = {}): TreeVisualization {
      const h: Record<number, string> = {};
      for (const [k, v] of Object.entries(highlights)) h[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        h[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights: h };
    }

    steps.push({
      line: 1,
      explanation: 'House Robber III: use tree DP. For each node, compute (rob_this, skip_this). rob_this = val + skip_left + skip_right. skip_this = max(left) + max(right).',
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): [number, number] {
      if (idx >= tree.length || tree[idx] == null) {
        return [0, 0];
      }
      const val = tree[idx] as number;

      steps.push({
        line: 3,
        explanation: `Visit node ${val} at index ${idx}. Will compute (robThis, skipThis).`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const [leftRob, leftSkip] = dfs(leftIdx);
      const [rightRob, rightSkip] = dfs(rightIdx);

      const robThis = val + leftSkip + rightSkip;
      const skipThis = Math.max(leftRob, leftSkip) + Math.max(rightRob, rightSkip);

      dpRob[idx] = robThis;
      dpSkip[idx] = skipThis;

      steps.push({
        line: 6,
        explanation: `Node ${val}: robThis = ${val} + ${leftSkip} + ${rightSkip} = ${robThis}. skipThis = max(${leftRob},${leftSkip}) + max(${rightRob},${rightSkip}) = ${skipThis}.`,
        variables: { node: val, robThis, skipThis, leftRob, leftSkip, rightRob, rightSkip },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });

      return [robThis, skipThis];
    }

    const [robRoot, skipRoot] = dfs(0);
    const answer = Math.max(robRoot, skipRoot);

    steps.push({
      line: 9,
      explanation: `Result: max(robRoot=${robRoot}, skipRoot=${skipRoot}) = ${answer}. This is the maximum money the robber can steal.`,
      variables: { robRoot, skipRoot, answer },
      visualization: makeViz(0, { 0: 'found' }),
    });

    return steps;
  },
};

export default houseRobberIII;
