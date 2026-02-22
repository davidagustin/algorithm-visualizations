import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToMergeStones: AlgorithmDefinition = {
  id: 'minimum-cost-to-merge-stones',
  title: 'Minimum Cost to Merge Stones',
  leetcodeNumber: 1000,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given n piles of stones and an integer k, merge k consecutive piles at a time. The cost is the sum of those k piles. Find the minimum cost to merge all piles into one. If impossible, return -1. Uses interval DP with prefix sums.',
  tags: ['dynamic programming', 'interval dp', 'prefix sum', 'divide and conquer'],

  code: {
    pseudocode: `function mergeStones(stones, k):
  n = len(stones)
  if (n-1) % (k-1) != 0: return -1
  prefix = prefix sum array
  dp[i][j] = min cost to merge stones[i..j] into as few piles as possible
  for len from k to n:
    for i from 0 to n-len:
      j = i+len-1
      for mid from i to j-1 step k-1:
        dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid+1][j])
      if (j-i) % (k-1) == 0:
        dp[i][j] += prefix[j+1] - prefix[i]
  return dp[0][n-1]`,
    python: `def mergeStones(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    dp = [[0] * n for _ in range(n)]
    for length in range(k, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for mid in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid+1][j])
            if (j - i) % (k - 1) == 0:
                dp[i][j] += prefix[j+1] - prefix[i]
    return dp[0][n-1]`,
    javascript: `function mergeStones(stones, k) {
  const n = stones.length;
  if ((n - 1) % (k - 1) !== 0) return -1;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i+1] = prefix[i] + stones[i];
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = k; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let mid = i; mid < j; mid += k - 1) {
        dp[i][j] = Math.min(dp[i][j], dp[i][mid] + dp[mid+1][j]);
      }
      if ((j - i) % (k - 1) === 0) dp[i][j] += prefix[j+1] - prefix[i];
    }
  }
  return dp[0][n-1];
}`,
    java: `public int mergeStones(int[] stones, int k) {
    int n = stones.length;
    if ((n - 1) % (k - 1) != 0) return -1;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + stones[i];
    int[][] dp = new int[n][n];
    for (int len = k; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE / 2;
            for (int mid = i; mid < j; mid += k - 1)
                dp[i][j] = Math.min(dp[i][j], dp[i][mid] + dp[mid+1][j]);
            if ((j - i) % (k - 1) == 0)
                dp[i][j] += prefix[j+1] - prefix[i];
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    stones: [3, 2, 4, 1],
    k: 2,
  },

  inputFields: [
    {
      name: 'stones',
      label: 'Stones',
      type: 'array',
      defaultValue: [3, 2, 4, 1],
      placeholder: '3,2,4,1',
      helperText: 'Comma-separated pile sizes',
    },
    {
      name: 'k',
      label: 'K (piles per merge)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of consecutive piles to merge at once',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = stones.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...stones],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Merge Stones: stones=[${stones.join(', ')}], k=${k}. Must merge exactly k consecutive piles at a time.`,
      variables: { n, k },
      visualization: makeViz({}, {}),
    });

    if ((n - 1) % (k - 1) !== 0) {
      steps.push({
        line: 3,
        explanation: `(n-1) % (k-1) = ${(n - 1) % (k - 1)} != 0. Impossible to merge into one pile. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];

    steps.push({
      line: 4,
      explanation: `Build prefix sums: [${prefix.join(', ')}]. prefix[j+1]-prefix[i] gives sum of stones[i..j].`,
      variables: { prefix: prefix.join(',') },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let len = k; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        for (let mid = i; mid < j; mid += k - 1) {
          const candidate = dp[i][mid] + dp[mid + 1][j];
          if (candidate < dp[i][j]) dp[i][j] = candidate;
        }
        if ((j - i) % (k - 1) === 0) dp[i][j] += prefix[j + 1] - prefix[i];

        if (len === k || (i === 0 && j === n - 1)) {
          const highlights: Record<number, string> = {};
          const labels: Record<number, string> = {};
          for (let idx = i; idx <= j; idx++) {
            highlights[idx] = 'comparing';
          }
          highlights[i] = 'active';
          highlights[j] = 'active';
          labels[i] = 'i';
          labels[j] = 'j';

          steps.push({
            line: 9,
            explanation: `dp[${i}][${j}]=${dp[i][j] === Infinity ? 'inf' : dp[i][j]}. Merging stones[${i}..${j}] costs ${dp[i][j] === Infinity ? 'inf' : dp[i][j]}.`,
            variables: { i, j, len, 'dp[i][j]': dp[i][j] === Infinity ? 'inf' : dp[i][j] },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Final answer: dp[0][${n - 1}]=${dp[0][n - 1]}. Minimum cost to merge all stones into one pile.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz(
        Object.fromEntries(stones.map((_, i) => [i, 'found'])),
        { 0: `cost:${dp[0][n - 1]}` }
      ),
    });

    return steps;
  },
};

export default minimumCostToMergeStones;
