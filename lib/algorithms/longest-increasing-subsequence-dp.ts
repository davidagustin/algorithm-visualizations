import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingSubsequenceDp: AlgorithmDefinition = {
  id: 'longest-increasing-subsequence-dp',
  title: 'Longest Increasing Subsequence (DP O(n^2))',
  leetcodeNumber: 300,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the length of the longest strictly increasing subsequence. O(n^2) DP approach: dp[i] = length of LIS ending at index i. For each i, check all j < i: if nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1). Answer is max(dp).',
  tags: ['dynamic programming', 'array', 'lis', 'subsequence'],

  code: {
    pseudocode: `function lengthOfLIS(nums):
  n = len(nums)
  dp[i] = 1 for all i (each element alone is LIS of 1)
  for i in 1..n-1:
    for j in 0..i-1:
      if nums[j] < nums[i]:
        dp[i] = max(dp[i], dp[j] + 1)
  return max(dp)`,
    python: `def lengthOfLIS(nums: list[int]) -> int:
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j]+1)
    return max(dp)`,
    javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++)
    for (let j = 0; j < i; j++)
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j]+1);
  return Math.max(...dp);
}`,
    java: `public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int max = 1;
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+1);
    for (int x : dp) max = Math.max(max, x);
    return max;
}`,
  },

  defaultInput: {
    nums: [10, 9, 2, 5, 3, 7, 101, 18],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 9, 2, 5, 3, 7, 101, 18],
      placeholder: '10,9,2,5,3,7,101,18',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n).fill(1);

    steps.push({
      line: 2,
      explanation: `nums=[${nums}]. Initialize dp[i]=1 for all i (each element forms LIS of length 1).`,
      variables: { nums: JSON.stringify(nums), dp: JSON.stringify(dp) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 1; i < n; i++) {
      steps.push({
        line: 4,
        explanation: `Outer loop i=${i}: nums[${i}]=${nums[i]}. Check all j < ${i}.`,
        variables: { i, 'nums[i]': nums[i] },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active' },
          labels: { [i]: `i=${i}` },
        } as ArrayVisualization,
      });

      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          const prev = dp[i];
          dp[i] = Math.max(dp[i], dp[j] + 1);
          if (dp[i] > prev) {
            steps.push({
              line: 6,
              explanation: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}. dp[${i}] = max(${prev}, dp[${j}]+1=${dp[j] + 1}) = ${dp[i]}.`,
              variables: { i, j, 'dp[i]': dp[i], 'dp[j]': dp[j] },
              visualization: {
                type: 'array',
                array: [...dp],
                highlights: { [i]: 'active', [j]: 'found' },
                labels: { [i]: `dp=${dp[i]}`, [j]: `dp=${dp[j]}` },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    const result = Math.max(...dp);
    steps.push({
      line: 8,
      explanation: `dp=[${dp}]. LIS length = max(dp) = ${result}.`,
      variables: { dp: JSON.stringify(dp), result },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { [dp.indexOf(result)]: 'found' },
        labels: { [dp.indexOf(result)]: `LIS=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestIncreasingSubsequenceDp;
