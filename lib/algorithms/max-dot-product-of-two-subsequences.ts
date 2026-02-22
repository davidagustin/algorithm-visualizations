import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxDotProductOfTwoSubsequences: AlgorithmDefinition = {
  id: 'max-dot-product-of-two-subsequences',
  title: 'Max Dot Product of Two Subsequences',
  leetcodeNumber: 1458,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given two arrays nums1 and nums2, find the maximum dot product between non-empty subsequences of equal length. dp[i][j] = max dot product using subsequences ending at nums1[i-1] and nums2[j-1]. At each cell, either include both elements or skip one.',
  tags: ['dynamic programming', 'array', 'subsequence', 'dot product'],

  code: {
    pseudocode: `function maxDotProduct(nums1, nums2):
  m = len(nums1), n = len(nums2)
  dp[i][j] = max dot product of subs of nums1[0..i-1], nums2[0..j-1]
  for i in 1..m:
    for j in 1..n:
      dp[i][j] = nums1[i-1]*nums2[j-1]
      if dp[i-1][j-1] > 0:
        dp[i][j] += dp[i-1][j-1]
      dp[i][j] = max(dp[i][j], dp[i-1][j], dp[i][j-1])
  return dp[m][n]`,
    python: `def maxDotProduct(nums1: list[int], nums2: list[int]) -> int:
    m, n = len(nums1), len(nums2)
    dp = [[-inf]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            dp[i][j] = nums1[i-1]*nums2[j-1]
            if dp[i-1][j-1] > 0:
                dp[i][j] += dp[i-1][j-1]
            dp[i][j] = max(dp[i][j], dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    javascript: `function maxDotProduct(nums1, nums2) {
  const m = nums1.length, n = nums2.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(-Infinity));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = nums1[i-1]*nums2[j-1];
      if (dp[i-1][j-1] > 0) dp[i][j] += dp[i-1][j-1];
      dp[i][j] = Math.max(dp[i][j], dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}`,
    java: `public int maxDotProduct(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[][] dp = new int[m+1][n+1];
    for (int[] row : dp) Arrays.fill(row, Integer.MIN_VALUE/2);
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            dp[i][j] = nums1[i-1]*nums2[j-1];
            if (dp[i-1][j-1] > 0) dp[i][j] += dp[i-1][j-1];
            dp[i][j] = Math.max(dp[i][j], Math.max(dp[i-1][j], dp[i][j-1]));
        }
    return dp[m][n];
}`,
  },

  defaultInput: {
    nums1: [2, 1, -2, 5],
    nums2: [3, 0, -6],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'nums1',
      type: 'array',
      defaultValue: [2, 1, -2, 5],
      placeholder: '2,1,-2,5',
      helperText: 'First array',
    },
    {
      name: 'nums2',
      label: 'nums2',
      type: 'array',
      defaultValue: [3, 0, -6],
      placeholder: '3,0,-6',
      helperText: 'Second array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const m = nums1.length, n = nums2.length;
    const NEG_INF = -1e9;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(NEG_INF));

    steps.push({
      line: 1,
      explanation: `nums1=[${nums1}], nums2=[${nums2}]. Initialize dp table with -Infinity.`,
      variables: { m, n },
      visualization: {
        type: 'array',
        array: [...nums1],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        let val = nums1[i - 1] * nums2[j - 1];
        const prev = dp[i - 1][j - 1];
        if (prev > 0) val += prev;
        val = Math.max(val, dp[i - 1][j] === NEG_INF ? NEG_INF : dp[i - 1][j], dp[i][j - 1] === NEG_INF ? NEG_INF : dp[i][j - 1]);
        dp[i][j] = val;

        steps.push({
          line: 6,
          explanation: `dp[${i}][${j}]: ${nums1[i - 1]}*${nums2[j - 1]}=${nums1[i - 1] * nums2[j - 1]}${prev > 0 ? ` + prev=${prev}` : ''}. dp[${i}][${j}]=${val}.`,
          variables: { i, j, 'nums1[i-1]': nums1[i - 1], 'nums2[j-1]': nums2[j - 1], 'dp[i][j]': val },
          visualization: {
            type: 'array',
            array: dp[i].slice(1, n + 1),
            highlights: { [j - 1]: 'active' },
            labels: { [j - 1]: `${val}` },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Result = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].slice(1, n + 1),
        highlights: { [n - 1]: 'found' },
        labels: { [n - 1]: `ans=${dp[m][n]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maxDotProductOfTwoSubsequences;
