import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryTreeMaximumPathSum: AlgorithmDefinition = {
  id: 'binary-tree-maximum-path-sum',
  title: 'Binary Tree Maximum Path Sum',
  leetcodeNumber: 124,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the maximum path sum. A path is any sequence of nodes where each pair of adjacent nodes has an edge. The path does not need to pass through the root. Use post-order DFS: for each node, compute the maximum gain from going into the left and right subtrees (clamped at 0 if negative). Update the global max with left gain + node.val + right gain. Return node.val + max(leftGain, rightGain) to parent.',
  tags: ['tree', 'dfs', 'dynamic programming', 'post-order'],

  code: {
    pseudocode: `function maxPathSum(root):
  maxSum = -infinity

  function dfs(node):
    nonlocal maxSum
    if node is null: return 0
    leftGain = max(0, dfs(node.left))   # ignore negative subtrees
    rightGain = max(0, dfs(node.right))
    # Path through this node
    currentPath = node.val + leftGain + rightGain
    maxSum = max(maxSum, currentPath)
    # Return best single arm to parent
    return node.val + max(leftGain, rightGain)

  dfs(root)
  return maxSum`,
    python: `def maxPathSum(root):
    res = [float('-inf')]
    def dfs(node):
        if not node: return 0
        l = max(0, dfs(node.left))
        r = max(0, dfs(node.right))
        res[0] = max(res[0], l + r + node.val)
        return node.val + max(l, r)
    dfs(root)
    return res[0]`,
    javascript: `function maxPathSum(root) {
  let res = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const l = Math.max(0, dfs(node.left));
    const r = Math.max(0, dfs(node.right));
    res = Math.max(res, l + r + node.val);
    return node.val + Math.max(l, r);
  }
  dfs(root);
  return res;
}`,
    java: `int res = Integer.MIN_VALUE;
public int maxPathSum(TreeNode root) {
    dfs(root);
    return res;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int l = Math.max(0, dfs(node.left));
    int r = Math.max(0, dfs(node.right));
    res = Math.max(res, l + r + node.val);
    return node.val + Math.max(l, r);
}`,
  },

  defaultInput: {
    nums: [-10, 9, 20, 0, 0, 15, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [-10, 9, 20, 0, 0, 15, 7],
      placeholder: '-10,9,20,0,0,15,7',
      helperText: 'Level-order binary tree (0 = null node, negatives allowed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Maximum path sum through any sequence of nodes. Post-order DFS: compute best gain from each subtree (clamped at 0). Update global max with left + node + right.',
      variables: { maxSum: '-Infinity' },
      visualization: makeViz({}, {}),
    });

    let maxSum = -Infinity;
    const nodeGains: Map<number, number> = new Map();
    const pathSums: Map<number, number> = new Map();

    function dfs(idx: number): number {
      if (idx >= nums.length || nums[idx] === 0) return 0;

      const leftGain = Math.max(0, dfs(2 * idx + 1));
      const rightGain = Math.max(0, dfs(2 * idx + 2));
      const currentPath = nums[idx] + leftGain + rightGain;
      const prevMax = maxSum;
      maxSum = Math.max(maxSum, currentPath);

      nodeGains.set(idx, nums[idx] + Math.max(leftGain, rightGain));
      pathSums.set(idx, currentPath);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      nodeGains.forEach((gain, i) => {
        highlights[i] = pathSums.get(i) === maxSum ? 'found' : 'visited';
        labels[i] = `g=${gain}`;
      });
      highlights[idx] = currentPath === maxSum ? 'found' : 'active';
      labels[idx] = `path=${currentPath}`;

      steps.push({
        line: currentPath > prevMax ? 8 : 7,
        explanation: `Node[${idx}]=${nums[idx]}: leftGain=${leftGain}, rightGain=${rightGain}. Path through = ${nums[idx]} + ${leftGain} + ${rightGain} = ${currentPath}. maxSum = ${maxSum}${currentPath > prevMax ? ' (NEW MAX!)' : ''}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], leftGain, rightGain, currentPath, maxSum },
        visualization: makeViz(highlights, labels),
      });

      return nums[idx] + Math.max(leftGain, rightGain);
    }

    dfs(0);

    const finalH: Record<number, string> = {};
    pathSums.forEach((psum, i) => {
      finalH[i] = psum === maxSum ? 'found' : 'sorted';
    });

    steps.push({
      line: 11,
      explanation: `Maximum path sum = ${maxSum}. Path passes through node(s) highlighted in green.`,
      variables: { result: maxSum },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default binaryTreeMaximumPathSum;
