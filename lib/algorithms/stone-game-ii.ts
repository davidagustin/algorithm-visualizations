import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stoneGameIi: AlgorithmDefinition = {
  id: 'stone-game-ii',
  title: 'Stone Game II',
  leetcodeNumber: 1140,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Alice and Bob take turns picking stones from piles. On each turn the player can take all piles from piles[i] to piles[i+2M-1], then M updates to max(M, X) where X is the number of piles taken. Alice goes first. Both play optimally. Return the max stones Alice can get. Uses suffix sums and DP with minimax.',
  tags: ['dynamic programming', 'game theory', 'minimax', 'suffix sum'],

  code: {
    pseudocode: `function stoneGameII(piles):
  n = len(piles)
  suffix = suffix sums of piles
  dp[i][m] = max stones current player can get from index i with M=m
  for i from n-1 downto 0:
    for m from 1 to n:
      for x from 1 to 2*m:
        if i+x >= n: dp[i][m] = max(dp[i][m], suffix[i])
        else: dp[i][m] = max(dp[i][m], suffix[i] - dp[i+x][max(m,x)])
  return dp[0][1]`,
    python: `def stoneGameII(piles):
    n = len(piles)
    suffix = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        suffix[i] = suffix[i + 1] + piles[i]
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        for m in range(1, n + 1):
            for x in range(1, 2 * m + 1):
                if i + x >= n:
                    dp[i][m] = max(dp[i][m], suffix[i])
                else:
                    dp[i][m] = max(dp[i][m], suffix[i] - dp[i + x][max(m, x)])
    return dp[0][1]`,
    javascript: `function stoneGameII(piles) {
  const n = piles.length;
  const suffix = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + piles[i];
  const dp = Array.from({length: n + 1}, () => new Array(n + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let m = 1; m <= n; m++) {
      for (let x = 1; x <= 2 * m; x++) {
        if (i + x >= n) dp[i][m] = Math.max(dp[i][m], suffix[i]);
        else dp[i][m] = Math.max(dp[i][m], suffix[i] - dp[i + x][Math.max(m, x)]);
      }
    }
  }
  return dp[0][1];
}`,
    java: `public int stoneGameII(int[] piles) {
    int n = piles.length;
    int[] suffix = new int[n + 1];
    for (int i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + piles[i];
    int[][] dp = new int[n + 1][n + 1];
    for (int i = n - 1; i >= 0; i--) {
        for (int m = 1; m <= n; m++) {
            for (int x = 1; x <= 2 * m; x++) {
                if (i + x >= n) dp[i][m] = Math.max(dp[i][m], suffix[i]);
                else dp[i][m] = Math.max(dp[i][m], suffix[i] - dp[i + x][Math.max(m, x)]);
            }
        }
    }
    return dp[0][1];
}`,
  },

  defaultInput: {
    piles: [2, 7, 9, 4, 4],
  },

  inputFields: [
    {
      name: 'piles',
      label: 'Piles',
      type: 'array',
      defaultValue: [2, 7, 9, 4, 4],
      placeholder: '2,7,9,4,4',
      helperText: 'Comma-separated pile sizes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const piles = input.piles as number[];
    const steps: AlgorithmStep[] = [];
    const n = piles.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...piles],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start Stone Game II with piles: [${piles.join(', ')}]. Alice goes first with M=1.`,
      variables: { n, M: 1 },
      visualization: makeViz({}, {}),
    });

    // Build suffix sums
    const suffix = new Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + piles[i];

    steps.push({
      line: 3,
      explanation: `Build suffix sums. suffix[0]=${suffix[0]} is total stones. suffix[i] = sum from index i to end.`,
      variables: { suffix: suffix.slice(0, n).join(',') },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

    // Fill DP - show a few key transitions
    for (let i = n - 1; i >= 0; i--) {
      for (let m = 1; m <= n; m++) {
        for (let x = 1; x <= 2 * m; x++) {
          if (i + x >= n) {
            dp[i][m] = Math.max(dp[i][m], suffix[i]);
          } else {
            dp[i][m] = Math.max(dp[i][m], suffix[i] - dp[i + x][Math.max(m, x)]);
          }
        }
      }
      if (i <= 2) {
        const highlights: Record<number, string> = {};
        for (let j = i; j < Math.min(i + 2, n); j++) highlights[j] = 'active';
        steps.push({
          line: 6,
          explanation: `Computed dp[${i}][1]=${dp[i][1]}. From index ${i} with M=1, current player can secure ${dp[i][1]} stones optimally.`,
          variables: { i, 'm=1': dp[i][1], suffix_i: suffix[i] },
          visualization: makeViz(highlights, { [i]: `dp=${dp[i][1]}` }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Alice starts at index 0 with M=1. dp[0][1]=${dp[0][1]} is the maximum stones Alice can collect.`,
      variables: { result: dp[0][1], totalStones: suffix[0] },
      visualization: makeViz({ 0: 'found' }, { 0: `Alice:${dp[0][1]}` }),
    });

    return steps;
  },
};

export default stoneGameIi;
