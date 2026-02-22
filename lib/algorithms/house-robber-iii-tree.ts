import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const houseRobberIIITree: AlgorithmDefinition = {
  id: 'house-robber-iii-tree',
  title: 'House Robber III (Tree)',
  leetcodeNumber: 337,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'The thief can rob houses arranged in a binary tree. Adjacent houses (directly connected) cannot both be robbed. Return the maximum amount that can be robbed. Use DFS returning a pair: (rob this node, skip this node). rob = node.val + skip(left) + skip(right). skip = max(rob/skip left) + max(rob/skip right).',
  tags: ['Tree', 'DFS', 'Dynamic Programming'],
  code: {
    pseudocode: `function rob(root):
  robThis, skipThis = dfs(root)
  return max(robThis, skipThis)

function dfs(node):
  if null: return (0, 0)
  robLeft, skipLeft = dfs(node.left)
  robRight, skipRight = dfs(node.right)
  robThis = node.val + skipLeft + skipRight
  skipThis = max(robLeft, skipLeft) + max(robRight, skipRight)
  return (robThis, skipThis)`,
    python: `def rob(root):
    def dfs(node):
        if not node:
            return 0, 0
        rob_left, skip_left = dfs(node.left)
        rob_right, skip_right = dfs(node.right)
        rob_this = node.val + skip_left + skip_right
        skip_this = max(rob_left, skip_left) + max(rob_right, skip_right)
        return rob_this, skip_this
    return max(dfs(root))`,
    javascript: `function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];
    const [robLeft, skipLeft] = dfs(node.left);
    const [robRight, skipRight] = dfs(node.right);
    const robThis = node.val + skipLeft + skipRight;
    const skipThis = Math.max(robLeft, skipLeft) + Math.max(robRight, skipRight);
    return [robThis, skipThis];
  }
  return Math.max(...dfs(root));
}`,
    java: `public int rob(TreeNode root) {
    int[] result = dfs(root);
    return Math.max(result[0], result[1]);
}
int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left), right = dfs(node.right);
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
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Max rob = 0.', variables: { result: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Rob houses in a tree. Adjacent houses cannot both be robbed. Use DFS returning (robThis, skipThis) pair.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): [number, number] {
      if (idx >= tree.length || tree[idx] == null) return [0, 0];
      visited.add(idx);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 6,
        explanation: `Visit node ${tree[idx]}. Computing (robThis, skipThis) for subtree.`,
        variables: { node: tree[idx] },
        visualization: makeViz(highlights),
      });

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const [robLeft, skipLeft] = dfs(l);
      const [robRight, skipRight] = dfs(r);

      const robThis = (tree[idx] as number) + skipLeft + skipRight;
      const skipThis = Math.max(robLeft, skipLeft) + Math.max(robRight, skipRight);

      steps.push({
        line: 8,
        explanation: `Node ${tree[idx]}: robThis=${tree[idx]}+${skipLeft}+${skipRight}=${robThis}, skipThis=${Math.max(robLeft, skipLeft)}+${Math.max(robRight, skipRight)}=${skipThis}.`,
        variables: { node: tree[idx], robThis, skipThis, robLeft, skipLeft, robRight, skipRight },
        visualization: makeViz(highlights),
      });

      return [robThis, skipThis];
    }

    const [robRoot, skipRoot] = dfs(0);
    const maxRob = Math.max(robRoot, skipRoot);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 2,
      explanation: `Root: robRoot=${robRoot}, skipRoot=${skipRoot}. Maximum rob = ${maxRob}.`,
      variables: { robRoot, skipRoot, maxRob },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default houseRobberIIITree;
