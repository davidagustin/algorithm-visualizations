import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const uncrossedLines: AlgorithmDefinition = {
  id: 'uncrossed-lines',
  title: 'Uncrossed Lines',
  leetcodeNumber: 1035,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Connect equal numbers in two arrays with lines that do not cross. The maximum number of non-crossing connections is exactly the Longest Common Subsequence (LCS) of the two arrays. Uses standard 2D DP: dp[i][j] = LCS of nums1[0..i] and nums2[0..j].',
  tags: ['dynamic programming', 'LCS', 'array'],

  code: {
    pseudocode: `function maxUncrossedLines(nums1, nums2):
  m, n = len(nums1), len(nums2)
  dp = 2D array (m+1) x (n+1), all 0
  for i from 1 to m:
    for j from 1 to n:
      if nums1[i-1] == nums2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]`,

    python: `def maxUncrossedLines(nums1, nums2):
    m, n = len(nums1), len(nums2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if nums1[i-1] == nums2[j-1]:
                dp[i][j] = dp[i-1][j-1]+1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,

    javascript: `function maxUncrossedLines(nums1, nums2) {
  const m=nums1.length, n=nums2.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) {
    if (nums1[i-1]===nums2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
    else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
  }
  return dp[m][n];
}`,

    java: `public int maxUncrossedLines(int[] nums1, int[] nums2) {
    int m=nums1.length, n=nums2.length;
    int[][] dp=new int[m+1][n+1];
    for (int i=1;i<=m;i++) for (int j=1;j<=n;j++) {
        if (nums1[i-1]==nums2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    }
    return dp[m][n];
}`,
  },

  defaultInput: {
    nums1: [1, 4, 2],
    nums2: [1, 2, 4],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'First Array',
      type: 'array',
      defaultValue: [1, 4, 2],
      placeholder: '1,4,2',
      helperText: 'First array of integers',
    },
    {
      name: 'nums2',
      label: 'Second Array',
      type: 'array',
      defaultValue: [1, 2, 4],
      placeholder: '1,2,4',
      helperText: 'Second array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];
    const m = nums1.length;
    const n = nums2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      line: 1,
      explanation: `Uncrossed Lines = LCS of [${nums1.join(', ')}] and [${nums2.join(', ')}]. dp[i][j] = LCS length for nums1[0..i-1] and nums2[0..j-1].`,
      variables: { nums1, nums2, m, n },
      visualization: {
        type: 'array',
        array: nums1,
        highlights: {},
        labels: Object.fromEntries(nums1.map((v, i) => [i, `${v}`])),
      },
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (nums1[i - 1] === nums2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }

      steps.push({
        line: 5,
        explanation: `Row ${i} (nums1[${i - 1}]=${nums1[i - 1]}): dp[${i}] = [${dp[i].join(', ')}]. Matches with nums2 extend LCS.`,
        variables: { i, nums1Char: nums1[i - 1], dpRow: dp[i] },
        visualization: {
          type: 'dp' as const,
          table: {
            headers: ['', ...['', ...nums2].map((v, j) => j === 0 ? '0' : `${v}`)],
            rows: dp.slice(0, i + 1).map((row, ri) => ({
              label: ri === 0 ? '0' : `${nums1[ri - 1]}`,
              cells: [
                { value: ri === 0 ? '' : `${nums1[ri - 1]}`, highlight: 'default' as string },
                ...row.map((v, ci) => ({
                  value: v,
                  highlight: ri === i && ci === n ? 'found' : ri === i ? 'active' : 'default',
                })),
              ],
            })),
          },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Maximum uncrossed lines (LCS): dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { answer: dp[m][n] },
      visualization: {
        type: 'array',
        array: nums1,
        highlights: {},
        labels: Object.fromEntries(nums1.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default uncrossedLines;
