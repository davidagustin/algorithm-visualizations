import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNodesEqualToAverageSubtree: AlgorithmDefinition = {
  id: 'count-nodes-equal-to-average-subtree',
  title: 'Count Nodes Equal to Average of Subtree',
  leetcodeNumber: 2265,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the number of nodes where the value equals the average (integer division) of all values in its subtree. For each node, compute the sum and count of its subtree using post-order DFS, then check if node.val equals floor(sum / count). The subtree of a node includes the node itself.',
  tags: ['tree', 'dfs', 'post-order', 'average'],

  code: {
    pseudocode: `function averageOfSubtree(root):
  result = 0

  function dfs(node):
    nonlocal result
    if node is null: return (0, 0)  # (sum, count)
    leftSum, leftCount = dfs(node.left)
    rightSum, rightCount = dfs(node.right)
    totalSum = leftSum + rightSum + node.val
    totalCount = leftCount + rightCount + 1
    average = totalSum // totalCount
    if average == node.val:
      result += 1
    return (totalSum, totalCount)

  dfs(root)
  return result`,
    python: `def averageOfSubtree(root):
    res = 0
    def dfs(node):
        nonlocal res
        if not node: return 0, 0
        ls, lc = dfs(node.left)
        rs, rc = dfs(node.right)
        s, c = ls + rs + node.val, lc + rc + 1
        if s // c == node.val:
            res += 1
        return s, c
    dfs(root)
    return res`,
    javascript: `function averageOfSubtree(root) {
  let res = 0;
  function dfs(node) {
    if (!node) return [0, 0];
    const [ls, lc] = dfs(node.left);
    const [rs, rc] = dfs(node.right);
    const s = ls + rs + node.val, c = lc + rc + 1;
    if (Math.floor(s / c) === node.val) res++;
    return [s, c];
  }
  dfs(root);
  return res;
}`,
    java: `int res = 0;
public int averageOfSubtree(TreeNode root) {
    dfs(root);
    return res;
}
private int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] l = dfs(node.left), r = dfs(node.right);
    int s = l[0] + r[0] + node.val, c = l[1] + r[1] + 1;
    if (s / c == node.val) res++;
    return new int[]{s, c};
}`,
  },

  defaultInput: {
    nums: [4, 8, 5, 0, 1, 0, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [4, 8, 5, 0, 1, 0, 6],
      placeholder: '4,8,5,0,1,0,6',
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
      explanation: 'Post-order DFS: for each node compute subtree sum and count, check if floor(sum/count) equals node value.',
      variables: { result: 0 },
      visualization: makeViz({}, {}),
    });

    let result = 0;
    const nodeResults: Map<number, { sum: number; count: number; avg: number; matches: boolean }> = new Map();

    function dfs(idx: number): [number, number] {
      if (idx >= nums.length || nums[idx] === 0) return [0, 0];

      const [ls, lc] = dfs(2 * idx + 1);
      const [rs, rc] = dfs(2 * idx + 2);

      const totalSum = ls + rs + nums[idx];
      const totalCount = lc + rc + 1;
      const avg = Math.floor(totalSum / totalCount);
      const matches = avg === nums[idx];

      if (matches) result++;

      nodeResults.set(idx, { sum: totalSum, count: totalCount, avg, matches });

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      nodeResults.forEach((info, i) => {
        highlights[i] = info.matches ? 'found' : 'visited';
        labels[i] = `avg=${info.avg}`;
      });
      highlights[idx] = matches ? 'found' : 'active';
      labels[idx] = `val=${nums[idx]},avg=${avg}`;

      steps.push({
        line: matches ? 11 : 10,
        explanation: `Node[${idx}]=${nums[idx]}: subtree sum=${totalSum}, count=${totalCount}, avg=floor(${totalSum}/${totalCount})=${avg}. ${matches ? 'MATCH! result=' + result : 'No match.'}`,
        variables: { nodeVal: nums[idx], subtreeSum: totalSum, count: totalCount, avg, matches, result },
        visualization: makeViz(highlights, labels),
      });

      return [totalSum, totalCount];
    }

    dfs(0);

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    nodeResults.forEach((info, i) => {
      finalH[i] = info.matches ? 'found' : 'sorted';
      finalL[i] = info.matches ? 'match' : '';
    });

    steps.push({
      line: 14,
      explanation: `Complete. ${result} node(s) have values equal to their subtree average.`,
      variables: { result },
      visualization: makeViz(finalH, finalL),
    });

    return steps;
  },
};

export default countNodesEqualToAverageSubtree;
