import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryTreeLongestConsecutiveSequence: AlgorithmDefinition = {
  id: 'binary-tree-longest-consecutive-sequence',
  title: 'Binary Tree Longest Consecutive Sequence',
  leetcodeNumber: 298,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the length of the longest consecutive sequence path (parent to child, going downward only). A consecutive sequence means each next node value is exactly 1 greater than the previous. Use DFS passing the expected next value and current streak length. Update global max at each node.',
  tags: ['tree', 'dfs', 'consecutive', 'path'],

  code: {
    pseudocode: `function longestConsecutive(root):
  maxLen = 0

  function dfs(node, parent, length):
    nonlocal maxLen
    if node is null: return
    if parent is not null and node.val == parent.val + 1:
      length += 1
    else:
      length = 1
    maxLen = max(maxLen, length)
    dfs(node.left, node, length)
    dfs(node.right, node, length)

  dfs(root, null, 0)
  return maxLen`,
    python: `def longestConsecutive(root):
    res = [0]
    def dfs(node, parent, length):
        if not node: return
        if parent and node.val == parent.val + 1:
            length += 1
        else:
            length = 1
        res[0] = max(res[0], length)
        dfs(node.left, node, length)
        dfs(node.right, node, length)
    dfs(root, None, 0)
    return res[0]`,
    javascript: `function longestConsecutive(root) {
  let res = 0;
  function dfs(node, parent, length) {
    if (!node) return;
    if (parent && node.val === parent.val + 1) length++;
    else length = 1;
    res = Math.max(res, length);
    dfs(node.left, node, length);
    dfs(node.right, node, length);
  }
  dfs(root, null, 0);
  return res;
}`,
    java: `int res = 0;
public int longestConsecutive(TreeNode root) {
    dfs(root, null, 0);
    return res;
}
private void dfs(TreeNode node, TreeNode parent, int len) {
    if (node == null) return;
    if (parent != null && node.val == parent.val + 1) len++;
    else len = 1;
    res = Math.max(res, len);
    dfs(node.left, node, len);
    dfs(node.right, node, len);
}`,
  },

  defaultInput: {
    nums: [1, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 4],
      placeholder: '1,0,3,0,0,2,0',
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
      explanation: 'Find longest consecutive downward path. DFS passes current streak length; reset to 1 if node value is not parent.val + 1.',
      variables: { maxLen: 0 },
      visualization: makeViz({}, {}),
    });

    let maxLen = 0;
    const visited: Map<number, number> = new Map();

    function dfs(idx: number, parentIdx: number | null, length: number) {
      if (idx >= nums.length || nums[idx] === 0) return;

      let curLen: number;
      if (parentIdx !== null && nums[idx] === nums[parentIdx] + 1) {
        curLen = length + 1;
      } else {
        curLen = 1;
      }
      maxLen = Math.max(maxLen, curLen);
      visited.set(idx, curLen);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      visited.forEach((len, i) => {
        highlights[i] = len === maxLen && maxLen > 1 ? 'found' : 'visited';
        labels[i] = `len=${len}`;
      });
      highlights[idx] = curLen === maxLen && maxLen > 1 ? 'found' : 'active';

      const consecutive = parentIdx !== null && nums[idx] === nums[parentIdx] + 1;

      steps.push({
        line: consecutive ? 7 : 9,
        explanation: `Node[${idx}]=${nums[idx]}: ${consecutive ? `consecutive (parent=${nums[parentIdx!]}, +1), streak=${curLen}` : `not consecutive, reset streak to 1`}. maxLen = ${maxLen}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], parentVal: parentIdx !== null ? nums[parentIdx] : null, curLen, maxLen, isConsecutive: consecutive },
        visualization: makeViz(highlights, labels),
      });

      dfs(2 * idx + 1, idx, curLen);
      dfs(2 * idx + 2, idx, curLen);
    }

    dfs(0, null, 0);

    const finalH: Record<number, string> = {};
    visited.forEach((len, i) => {
      finalH[i] = len === maxLen && maxLen > 1 ? 'found' : 'sorted';
    });

    steps.push({
      line: 13,
      explanation: `Longest consecutive sequence length = ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default binaryTreeLongestConsecutiveSequence;
