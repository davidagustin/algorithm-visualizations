import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pathSumIii: AlgorithmDefinition = {
  id: 'path-sum-iii',
  title: 'Path Sum III',
  leetcodeNumber: 437,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree and an integer targetSum, return the number of paths where the sum of the values along the path equals targetSum. The path does not need to start or end at the root or a leaf, but it must go downwards. Uses prefix sum with DFS to count paths efficiently in O(n) time.',
  tags: ['tree', 'dfs', 'prefix sum', 'hash map'],

  code: {
    pseudocode: `function pathSum(root, target):
  prefixSums = {0: 1}
  result = 0

  function dfs(node, currentSum):
    if node is null: return
    currentSum += node.val
    result += prefixSums.get(currentSum - target, 0)
    prefixSums[currentSum] += 1
    dfs(node.left, currentSum)
    dfs(node.right, currentSum)
    prefixSums[currentSum] -= 1

  dfs(root, 0)
  return result`,
    python: `def pathSum(root, targetSum):
    prefix = {0: 1}
    res = 0
    def dfs(node, cur):
        nonlocal res
        if not node:
            return
        cur += node.val
        res += prefix.get(cur - targetSum, 0)
        prefix[cur] = prefix.get(cur, 0) + 1
        dfs(node.left, cur)
        dfs(node.right, cur)
        prefix[cur] -= 1
    dfs(root, 0)
    return res`,
    javascript: `function pathSum(root, targetSum) {
  const prefix = new Map([[0, 1]]);
  let res = 0;
  function dfs(node, cur) {
    if (!node) return;
    cur += node.val;
    res += prefix.get(cur - targetSum) || 0;
    prefix.set(cur, (prefix.get(cur) || 0) + 1);
    dfs(node.left, cur);
    dfs(node.right, cur);
    prefix.set(cur, prefix.get(cur) - 1);
  }
  dfs(root, 0);
  return res;
}`,
    java: `public int pathSum(TreeNode root, int targetSum) {
    Map<Long, Integer> prefix = new HashMap<>();
    prefix.put(0L, 1);
    return dfs(root, 0L, targetSum, prefix);
}
private int dfs(TreeNode node, long cur, int target, Map<Long, Integer> prefix) {
    if (node == null) return 0;
    cur += node.val;
    int res = prefix.getOrDefault(cur - target, 0);
    prefix.put(cur, prefix.getOrDefault(cur, 0) + 1);
    res += dfs(node.left, cur, target, prefix);
    res += dfs(node.right, cur, target, prefix);
    prefix.put(cur, prefix.get(cur) - 1);
    return res;
}`,
  },

  defaultInput: {
    nums: [10, 5, -3, 3, 2, 0, 11, 3, -2, 0, 1, 0, 0, 0, -1],
    target: 8,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [10, 5, -3, 3, 2, 0, 11, 3, -2, 0, 1, 0, 0, 0, -1],
      placeholder: '10,5,-3,3,2,0,11',
      helperText: 'Level-order array representation of binary tree',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Target path sum to count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize prefix sum map with {0: 1}. This accounts for paths starting from root. Target = ${target}.`,
      variables: { prefixSums: '{0: 1}', result: 0, target },
      visualization: makeViz({}, {}),
    });

    const prefixSums: Map<number, number> = new Map([[0, 1]]);
    let result = 0;
    const visited: number[] = [];

    function getChildren(i: number): [number | null, number | null] {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      return [l < nums.length && nums[l] !== 0 ? l : null, r < nums.length && nums[r] !== 0 ? r : null];
    }

    function dfs(idx: number, currentSum: number) {
      if (idx >= nums.length || nums[idx] === 0) return;
      visited.push(idx);
      currentSum += nums[idx];
      const complement = currentSum - target;
      const pathsFound = prefixSums.get(complement) || 0;
      result += pathsFound;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      visited.forEach(v => { highlights[v] = 'visited'; labels[v] = 'path'; });
      highlights[idx] = 'active';
      labels[idx] = 'cur';

      steps.push({
        line: 7,
        explanation: `Visit node[${idx}]=${nums[idx]}. currentSum=${currentSum}. Looking for prefix ${complement} in map. Found ${pathsFound} path(s). Total paths = ${result}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], currentSum, complement, pathsFound, result },
        visualization: makeViz(highlights, labels),
      });

      prefixSums.set(currentSum, (prefixSums.get(currentSum) || 0) + 1);

      const [l, r] = getChildren(idx);
      if (l !== null) dfs(l, currentSum);
      if (r !== null) dfs(r, currentSum);

      prefixSums.set(currentSum, (prefixSums.get(currentSum) || 0) - 1);
      visited.pop();

      steps.push({
        line: 11,
        explanation: `Backtrack from node[${idx}]=${nums[idx]}. Remove currentSum=${currentSum} from prefix map.`,
        variables: { nodeIdx: idx, currentSum, result },
        visualization: makeViz(highlights, labels),
      });
    }

    dfs(0, 0);

    const finalHighlights: Record<number, string> = {};
    nums.forEach((_, i) => { if (nums[i] !== 0) finalHighlights[i] = 'sorted'; });

    steps.push({
      line: 13,
      explanation: `DFS complete. Total paths summing to ${target} = ${result}.`,
      variables: { result },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default pathSumIii;
