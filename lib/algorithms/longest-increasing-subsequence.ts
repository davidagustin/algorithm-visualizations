import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestIncreasingSubsequence: AlgorithmDefinition = {
  id: 'longest-increasing-subsequence',
  title: 'Longest Increasing Subsequence',
  leetcodeNumber: 300,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array, return the length of the longest strictly increasing subsequence. dp[i] = length of longest increasing subsequence ending at index i. For each i, check all j < i where nums[j] < nums[i], and take the best.',
  tags: ['Dynamic Programming', 'Array', 'Binary Search'],
  code: {
    pseudocode: `function lengthOfLIS(nums):
  n = length(nums)
  dp = array of 1s of size n
  for i from 1 to n-1:
    for j from 0 to i-1:
      if nums[j] < nums[i]:
        dp[i] = max(dp[i], dp[j] + 1)
  return max(dp)`,
    python: `def lengthOfLIS(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
    javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`,
    java: `public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int res = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        res = Math.max(res, dp[i]);
    }
    return res;
}`,
  },
  defaultInput: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 9, 2, 5, 3, 7, 101, 18],
      placeholder: '10,9,2,5,3,7,101,18',
      helperText: 'Integer array to find longest increasing subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(n).fill(null);
    const labels: string[] = nums.map((v, i) => `[${i}]\n${v}`);

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx < n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `LIS: nums=[${nums.join(', ')}]. dp[i] = length of longest increasing subsequence ending at index i. Start all as 1 (each element alone).`,
      variables: { nums, n },
      visualization: makeViz(null, []),
    });

    for (let i = 0; i < n; i++) dp[i] = 1;
    steps.push({
      line: 2,
      explanation: 'Initialize dp[i] = 1 for all i. Every element can form an LIS of length 1 by itself.',
      variables: { dp: dp.slice() },
      visualization: makeViz(null, []),
    });

    let globalMax = 1;
    let globalMaxIdx = 0;

    for (let i = 1; i < n; i++) {
      steps.push({
        line: 3,
        explanation: `i=${i}: Considering nums[${i}]=${nums[i]}. Check all j < ${i} where nums[j] < nums[${i}].`,
        variables: { i, 'nums[i]': nums[i] },
        visualization: makeViz(i, []),
      });

      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          const candidate = (dp[j] as number) + 1;
          if (candidate > (dp[i] as number)) {
            steps.push({
              line: 5,
              explanation: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}. Extending LIS ending at ${j}: dp[${j}]+1=${candidate} > dp[${i}]=${dp[i]}. Update dp[${i}]=${candidate}.`,
              variables: { j, 'nums[j]': nums[j], 'dp[j]+1': candidate },
              visualization: makeViz(i, [j]),
            });
            dp[i] = candidate;
          }
        }
      }

      if ((dp[i] as number) > globalMax) {
        globalMax = dp[i] as number;
        globalMaxIdx = i;
      }

      steps.push({
        line: 6,
        explanation: `dp[${i}] = ${dp[i]}. Longest increasing subsequence ending at nums[${i}]=${nums[i]} has length ${dp[i]}.`,
        variables: { i, 'dp[i]': dp[i], currentMax: globalMax },
        visualization: makeViz(i, []),
      });
    }

    steps.push({
      line: 7,
      explanation: `max(dp) = ${globalMax} at index ${globalMaxIdx}. The length of the longest strictly increasing subsequence is ${globalMax}.`,
      variables: { result: globalMax },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n }, (_, i) => [i, i === globalMaxIdx ? 'active' : 'found'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default longestIncreasingSubsequence;
