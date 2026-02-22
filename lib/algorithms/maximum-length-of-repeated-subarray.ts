import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximumLengthOfRepeatedSubarray: AlgorithmDefinition = {
  id: 'maximum-length-of-repeated-subarray',
  title: 'Maximum Length of Repeated Subarray',
  leetcodeNumber: 718,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two integer arrays nums1 and nums2, return the maximum length of a subarray that appears in both arrays. Uses a 2D DP table where dp[i][j] is the length of the longest common subarray ending at nums1[i-1] and nums2[j-1]. If elements match, extend from dp[i-1][j-1].',
  tags: ['dynamic programming', 'array', '2D DP', 'subarray'],

  code: {
    pseudocode: `function findLength(nums1, nums2):
  m, n = len(nums1), len(nums2)
  dp = (m+1) x (n+1) matrix of zeros
  result = 0
  for i from 1 to m:
    for j from 1 to n:
      if nums1[i-1] == nums2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
        result = max(result, dp[i][j])
  return result`,

    python: `def findLength(nums1: list[int], nums2: list[int]) -> int:
    m, n = len(nums1), len(nums2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    result = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if nums1[i-1] == nums2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                result = max(result, dp[i][j])
    return result`,

    javascript: `function findLength(nums1, nums2) {
  const m = nums1.length, n = nums2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  let result = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (nums1[i-1] === nums2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        result = Math.max(result, dp[i][j]);
      }
    }
  }
  return result;
}`,

    java: `public int findLength(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[][] dp = new int[m+1][n+1];
    int result = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (nums1[i-1] == nums2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
                result = Math.max(result, dp[i][j]);
            }
        }
    }
    return result;
}`,
  },

  defaultInput: { nums1: [1, 2, 3, 2, 1], nums2: [3, 2, 1, 4, 7] },

  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [1, 2, 3, 2, 1],
      placeholder: '1,2,3,2,1',
      helperText: 'First integer array',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [3, 2, 1, 4, 7],
      placeholder: '3,2,1,4,7',
      helperText: 'Second integer array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const m = nums1.length;
    const n = nums2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let result = 0;

    steps.push({
      line: 3,
      explanation: `Initialize (${m + 1}) x (${n + 1}) DP table with zeros. Row i = nums1 position, col j = nums2 position.`,
      variables: { m, n },
      visualization: {
        type: 'dp-table',
        values: dp[0].slice(1),
        highlights: {},
        labels: nums2.map((v, i) => `n2[${i}]=${v}`),
      },
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (nums1[i - 1] === nums2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > result) result = dp[i][j];

          steps.push({
            line: 8,
            explanation: `nums1[${i - 1}]=${nums1[i - 1]} == nums2[${j - 1}]=${nums2[j - 1]}: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}. Best = ${result}.`,
            variables: { i, j, 'nums1[i-1]': nums1[i - 1], 'nums2[j-1]': nums2[j - 1], match: dp[i][j], result },
            visualization: {
              type: 'dp-table',
              values: dp[i].slice(1),
              highlights: Object.fromEntries(dp[i].slice(1).map((_, k) => [k, k + 1 === j ? 'active' : dp[i][k + 1] > 0 ? 'found' : 'default'])),
              labels: nums2.map((v, k) => `n2[${k}]=${v}`),
            },
          });
        } else {
          steps.push({
            line: 7,
            explanation: `nums1[${i - 1}]=${nums1[i - 1]} != nums2[${j - 1}]=${nums2[j - 1]}: no match, dp[${i}][${j}] = 0.`,
            variables: { i, j, 'nums1[i-1]': nums1[i - 1], 'nums2[j-1]': nums2[j - 1] },
            visualization: {
              type: 'dp-table',
              values: dp[i].slice(1),
              highlights: { [j - 1]: 'mismatch' },
              labels: nums2.map((v, k) => `n2[${k}]=${v}`),
            },
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Done! Maximum length of repeated subarray is ${result}.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: dp[m].slice(1),
        highlights: Object.fromEntries(dp[m].slice(1).map((v, i) => [i, v === result && v > 0 ? 'found' : v > 0 ? 'sorted' : 'default'])),
        labels: nums2.map((v, i) => `n2[${i}]=${v}`),
      },
    });

    return steps;
  },
};

export default maximumLengthOfRepeatedSubarray;
