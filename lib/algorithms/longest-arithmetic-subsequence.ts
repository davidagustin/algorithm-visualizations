import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestArithmeticSubsequence: AlgorithmDefinition = {
  id: 'longest-arithmetic-subsequence',
  title: 'Longest Arithmetic Subsequence',
  leetcodeNumber: 1027,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array nums, return the length of the longest arithmetic subsequence in nums. An arithmetic sequence has equal differences between consecutive elements. For each pair (i, j) where i < j, compute the difference diff = nums[j] - nums[i]. Use dp[i] as a hash map where dp[i][diff] = length of the longest arithmetic subsequence ending at index i with common difference diff.',
  tags: ['dp', 'hash map', 'arithmetic', 'subsequence'],

  code: {
    pseudocode: `function longestArithSeqLength(nums):
  n = len(nums)
  dp = array of n hash maps
  result = 2
  for j from 1 to n-1:
    for i from 0 to j-1:
      diff = nums[j] - nums[i]
      if diff in dp[i]:
        dp[j][diff] = dp[i][diff] + 1
      else:
        dp[j][diff] = 2
      result = max(result, dp[j][diff])
  return result`,
    python: `def longestArithSeqLength(nums):
    n = len(nums)
    dp = [dict() for _ in range(n)]
    result = 2
    for j in range(1, n):
        for i in range(j):
            diff = nums[j] - nums[i]
            dp[j][diff] = dp[i].get(diff, 1) + 1
            result = max(result, dp[j][diff])
    return result`,
    javascript: `function longestArithSeqLength(nums) {
  const n = nums.length;
  const dp = Array.from({length: n}, () => new Map());
  let result = 2;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      const diff = nums[j] - nums[i];
      const prev = dp[i].get(diff) || 1;
      dp[j].set(diff, prev + 1);
      result = Math.max(result, dp[j].get(diff));
    }
  }
  return result;
}`,
    java: `public int longestArithSeqLength(int[] nums) {
    int n = nums.length, result = 2;
    Map<Integer,Integer>[] dp = new HashMap[n];
    for (int i = 0; i < n; i++) dp[i] = new HashMap<>();
    for (int j = 1; j < n; j++) {
        for (int i = 0; i < j; i++) {
            int diff = nums[j] - nums[i];
            dp[j].put(diff, dp[i].getOrDefault(diff, 1) + 1);
            result = Math.max(result, dp[j].get(diff));
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [3, 6, 9, 12],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 6, 9, 12],
      placeholder: '3,6,9,12',
      helperText: 'Integer array to find longest arithmetic subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const dp: Map<number, number>[] = Array.from({ length: n }, () => new Map());
    let result = 2;

    // Track best lengths per index for visualization
    const bestLen: number[] = new Array(n).fill(1);

    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: bestLen.map(v => v),
      highlights,
      labels: nums.map((v, i) => `nums[${i}]=${v}`),
    });

    steps.push({
      line: 1,
      explanation: `Find longest arithmetic subsequence in [${nums.join(', ')}]. dp[j][diff] = length of LAS ending at j with given diff.`,
      variables: { n, result },
      visualization: makeViz({}),
    });

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < j; i++) {
        const diff = nums[j] - nums[i];
        const prev = dp[i].get(diff) ?? 1;
        const newLen = prev + 1;
        dp[j].set(diff, Math.max(dp[j].get(diff) ?? 0, newLen));

        if (newLen > bestLen[j]) bestLen[j] = newLen;

        steps.push({
          line: 7,
          explanation: `Pair (i=${i}, j=${j}): diff = ${nums[j]} - ${nums[i]} = ${diff}. Chain extends from ${prev} to ${newLen}.`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], diff, newLen },
          visualization: makeViz({ [i]: 'comparing', [j]: 'active' }),
        });

        if (newLen > result) {
          result = newLen;
          steps.push({
            line: 10,
            explanation: `New best! Longest arithmetic subsequence length = ${result} with diff = ${diff}.`,
            variables: { result, diff },
            visualization: makeViz({ [i]: 'found', [j]: 'found' }),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Longest arithmetic subsequence length = ${result}.`,
      variables: { result },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default longestArithmeticSubsequence;
