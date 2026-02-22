import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestUnivaluePath: AlgorithmDefinition = {
  id: 'longest-univalue-path',
  title: 'Longest Univalue Path',
  leetcodeNumber: 687,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the length of the longest path where each pair of adjacent nodes has the same value. The path length is measured in edges. Use post-order DFS: for each node, compute the longest arm going left (if left child has same value) and right (if right child has same value). Update global max with left + right arm lengths. Return the longer arm to parent.',
  tags: ['tree', 'dfs', 'post-order', 'path'],

  code: {
    pseudocode: `function longestUnivaluePath(root):
  maxLen = 0

  function dfs(node):
    nonlocal maxLen
    if node is null: return 0
    leftLen = dfs(node.left)
    rightLen = dfs(node.right)
    leftArm = leftLen + 1 if node.left and node.left.val == node.val else 0
    rightArm = rightLen + 1 if node.right and node.right.val == node.val else 0
    maxLen = max(maxLen, leftArm + rightArm)
    return max(leftArm, rightArm)

  dfs(root)
  return maxLen`,
    python: `def longestUnivaluePath(root):
    res = 0
    def dfs(node):
        nonlocal res
        if not node: return 0
        l, r = dfs(node.left), dfs(node.right)
        la = (l + 1) if node.left and node.left.val == node.val else 0
        ra = (r + 1) if node.right and node.right.val == node.val else 0
        res = max(res, la + ra)
        return max(la, ra)
    dfs(root)
    return res`,
    javascript: `function longestUnivaluePath(root) {
  let res = 0;
  function dfs(node) {
    if (!node) return 0;
    const l = dfs(node.left), r = dfs(node.right);
    const la = (node.left?.val === node.val) ? l + 1 : 0;
    const ra = (node.right?.val === node.val) ? r + 1 : 0;
    res = Math.max(res, la + ra);
    return Math.max(la, ra);
  }
  dfs(root);
  return res;
}`,
    java: `int res = 0;
public int longestUnivaluePath(TreeNode root) {
    dfs(root);
    return res;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int l = dfs(node.left), r = dfs(node.right);
    int la = (node.left != null && node.left.val == node.val) ? l + 1 : 0;
    int ra = (node.right != null && node.right.val == node.val) ? r + 1 : 0;
    res = Math.max(res, la + ra);
    return Math.max(la, ra);
}`,
  },

  defaultInput: {
    nums: [5, 4, 5, 1, 1, 0, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [5, 4, 5, 1, 1, 0, 5],
      placeholder: '5,4,5,1,1,0,5',
      helperText: 'Level-order binary tree (0 = null node)',
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
      explanation: 'Find longest path where all nodes have same value. Post-order DFS: compute left and right arms of same-value nodes, update global max.',
      variables: { maxLen: 0 },
      visualization: makeViz({}, {}),
    });

    let maxLen = 0;
    const nodeArms: Map<number, { leftArm: number; rightArm: number; maxPath: number }> = new Map();

    function dfs(idx: number): number {
      if (idx >= nums.length || nums[idx] === 0) return 0;

      const l = dfs(2 * idx + 1);
      const r = dfs(2 * idx + 2);

      const li = 2 * idx + 1;
      const ri = 2 * idx + 2;
      const leftArm = (li < nums.length && nums[li] === nums[idx] && nums[li] !== 0) ? l + 1 : 0;
      const rightArm = (ri < nums.length && nums[ri] === nums[idx] && nums[ri] !== 0) ? r + 1 : 0;
      const pathThrough = leftArm + rightArm;
      maxLen = Math.max(maxLen, pathThrough);

      nodeArms.set(idx, { leftArm, rightArm, maxPath: pathThrough });

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      nodeArms.forEach((info, i) => {
        highlights[i] = info.maxPath > 0 ? 'visiting' : 'visited';
        labels[i] = `(${info.leftArm}+${info.rightArm})`;
      });
      highlights[idx] = pathThrough === maxLen && maxLen > 0 ? 'found' : 'active';
      labels[idx] = `L=${leftArm},R=${rightArm}`;

      steps.push({
        line: 9,
        explanation: `Node[${idx}]=${nums[idx]}: leftArm=${leftArm} (${leftArm > 0 ? 'same value continues' : 'different value or null'}), rightArm=${rightArm}. Path through = ${pathThrough}. maxLen = ${maxLen}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], leftArm, rightArm, pathThrough, maxLen },
        visualization: makeViz(highlights, labels),
      });

      return Math.max(leftArm, rightArm);
    }

    dfs(0);

    steps.push({
      line: 12,
      explanation: `Longest univalue path = ${maxLen} edges.`,
      variables: { result: maxLen },
      visualization: makeViz(
        Object.fromEntries([...nodeArms.entries()].map(([i, info]) => [i, info.maxPath === maxLen && maxLen > 0 ? 'found' : 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default longestUnivaluePath;
