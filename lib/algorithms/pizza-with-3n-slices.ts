import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const pizzaWith3NSlices: AlgorithmDefinition = {
  id: 'pizza-with-3n-slices',
  title: 'Pizza With 3n Slices',
  leetcodeNumber: 1388,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given 3n pizza slices in a circle, Alice picks first, then Bob picks adjacent, then Charlie picks adjacent. You (Alice) want to maximize your total. Equivalent to: pick n non-adjacent elements from a circular array to maximize sum. DP on two linear subarrays (house robber on circle).',
  tags: ['Dynamic Programming', 'Greedy', 'House Robber'],
  code: {
    pseudocode: `function maxSizeSlices(slices):
  n = length(slices) / 3
  // Pick n non-adjacent from circular array
  // Try [0..3n-2] and [1..3n-1], take max
  return max(
    rob(slices[0..3n-2], n),
    rob(slices[1..3n-1], n)
  )

function rob(arr, n):
  m = length(arr)
  dp[i][j] = max sum picking j from first i
  dp[i][j] = max(dp[i-1][j], dp[i-2][j-1] + arr[i])
  return dp[m][n]`,
    python: `def maxSizeSlices(slices):
    def pick(arr, k):
        m = len(arr)
        dp = [[0]*(k+1) for _ in range(m+1)]
        for i in range(1, m+1):
            for j in range(1, k+1):
                dp[i][j] = dp[i-1][j]
                if i >= 2:
                    dp[i][j] = max(dp[i][j], dp[i-2][j-1] + arr[i-1])
                elif i == 1:
                    dp[i][j] = max(dp[i][j], arr[0])
        return dp[m][k]
    n = len(slices) // 3
    return max(pick(slices[:-1], n), pick(slices[1:], n))`,
    javascript: `function maxSizeSlices(slices) {
  const n = slices.length / 3;
  function pick(arr, k) {
    const m = arr.length;
    const dp = Array.from({length:m+1}, ()=>new Array(k+1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= k; j++) {
        dp[i][j] = dp[i-1][j];
        if (i >= 2) dp[i][j] = Math.max(dp[i][j], dp[i-2][j-1] + arr[i-1]);
        else dp[i][j] = Math.max(dp[i][j], arr[0]);
      }
    return dp[m][k];
  }
  return Math.max(pick(slices.slice(0,-1), n), pick(slices.slice(1), n));
}`,
    java: `public int maxSizeSlices(int[] slices) {
    int n = slices.length / 3;
    return Math.max(pick(slices, 0, slices.length-2, n),
                    pick(slices, 1, slices.length-1, n));
}
int pick(int[] a, int s, int e, int k) {
    int m = e - s + 1;
    int[][] dp = new int[m+1][k+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= k; j++) {
            dp[i][j] = dp[i-1][j];
            if (i>=2) dp[i][j]=Math.max(dp[i][j], dp[i-2][j-1]+a[s+i-1]);
            else dp[i][j]=Math.max(dp[i][j], a[s]);
        }
    return dp[m][k];
}`,
  },
  defaultInput: { slices: [1, 2, 3, 4, 5, 6] },
  inputFields: [
    {
      name: 'slices',
      label: 'Pizza Slices (3n elements)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Array of 3n pizza slice sizes in circular order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const slices = input.slices as number[];
    const total = slices.length;
    const n = Math.floor(total / 3);
    const steps: AlgorithmStep[] = [];

    function pick(arr: number[], k: number): { result: number; dpFlat: number[]; labels: string[] } {
      const m = arr.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(k + 1).fill(0));
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= k; j++) {
          dp[i][j] = dp[i - 1][j];
          if (i >= 2) dp[i][j] = Math.max(dp[i][j], dp[i - 2][j - 1] + arr[i - 1]);
          else dp[i][j] = Math.max(dp[i][j], arr[0]);
        }
      }
      const flat = dp.flat();
      const lbls: string[] = [];
      for (let i = 0; i <= m; i++) for (let j = 0; j <= k; j++) lbls.push(`i${i}k${j}`);
      return { result: dp[m][k], dpFlat: flat, labels: lbls };
    }

    steps.push({
      line: 1,
      explanation: `3n=${total} slices. Pick n=${n} non-adjacent from circular array. Split into two linear problems: slices[0..${total - 2}] and slices[1..${total - 1}].`,
      variables: { total, n, slices },
      visualization: {
        type: 'dp-table',
        values: slices.map(v => v),
        highlights: Object.fromEntries(slices.map((_, i) => [i, 'default'])),
        labels: slices.map((_, i) => `s${i}`),
      },
    });

    const r1 = pick(slices.slice(0, -1), n);
    steps.push({
      line: 3,
      explanation: `Case 1 (slices[0..${total - 2}]): max sum picking ${n} non-adjacent = ${r1.result}.`,
      variables: { case: 1, result: r1.result },
      visualization: {
        type: 'dp-table',
        values: r1.dpFlat.slice(0, Math.min(r1.dpFlat.length, 20)),
        highlights: { 0: 'found' },
        labels: r1.labels.slice(0, Math.min(r1.labels.length, 20)),
      },
    });

    const r2 = pick(slices.slice(1), n);
    steps.push({
      line: 4,
      explanation: `Case 2 (slices[1..${total - 1}]): max sum picking ${n} non-adjacent = ${r2.result}.`,
      variables: { case: 2, result: r2.result },
      visualization: {
        type: 'dp-table',
        values: r2.dpFlat.slice(0, Math.min(r2.dpFlat.length, 20)),
        highlights: { 0: 'found' },
        labels: r2.labels.slice(0, Math.min(r2.labels.length, 20)),
      },
    });

    const result = Math.max(r1.result, r2.result);
    steps.push({
      line: 5,
      explanation: `Answer = max(${r1.result}, ${r2.result}) = ${result}. Maximum pizza slices Alice can get.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: [r1.result, r2.result, result],
        highlights: { 0: 'comparing', 1: 'comparing', 2: 'active' },
        labels: ['case1', 'case2', 'answer'],
      },
    });

    return steps;
  },
};

export default pizzaWith3NSlices;
