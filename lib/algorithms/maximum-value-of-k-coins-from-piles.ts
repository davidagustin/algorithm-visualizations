import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumValueOfKCoinsFromPiles: AlgorithmDefinition = {
  id: 'maximum-value-of-k-coins-from-piles',
  title: 'Maximum Value of K Coins from Piles',
  leetcodeNumber: 2218,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given piles of coins, pick at most k coins total always from the top of any pile, maximizing total value. dp[i][j] = max value using first i piles and picking j coins total. For each pile, try taking 0 to min(pile size, j) coins from top.',
  tags: ['dynamic programming', 'knapsack', 'prefix sum', 'array'],

  code: {
    pseudocode: `function maxValueOfCoins(piles, k):
  n = len(piles)
  dp = 2D array (n+1) x (k+1), all 0
  for i from 1 to n:
    pile = piles[i-1]
    prefix = prefix sums of pile
    for j from 0 to k:
      dp[i][j] = dp[i-1][j]  // take 0 from pile i
      for coins from 1 to min(len(pile), j):
        dp[i][j] = max(dp[i][j], dp[i-1][j-coins] + prefix[coins])
  return dp[n][k]`,
    python: `def maxValueOfCoins(piles: list[list[int]], k: int) -> int:
    n = len(piles)
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        pile = piles[i-1]
        prefix = [0]
        for v in pile:
            prefix.append(prefix[-1] + v)
        for j in range(k + 1):
            dp[i][j] = dp[i-1][j]
            for coins in range(1, min(len(pile), j) + 1):
                dp[i][j] = max(dp[i][j], dp[i-1][j-coins] + prefix[coins])
    return dp[n][k]`,
    javascript: `function maxValueOfCoins(piles, k) {
  const n = piles.length;
  const dp = Array.from({length: n+1}, () => new Array(k+1).fill(0));
  for (let i = 1; i <= n; i++) {
    const pile = piles[i-1];
    const prefix = [0];
    for (const v of pile) prefix.push(prefix[prefix.length-1] + v);
    for (let j = 0; j <= k; j++) {
      dp[i][j] = dp[i-1][j];
      for (let c = 1; c <= Math.min(pile.length, j); c++) {
        dp[i][j] = Math.max(dp[i][j], dp[i-1][j-c] + prefix[c]);
      }
    }
  }
  return dp[n][k];
}`,
    java: `public int maxValueOfCoins(List<List<Integer>> piles, int k) {
    int n = piles.size();
    int[][] dp = new int[n+1][k+1];
    for (int i = 1; i <= n; i++) {
        List<Integer> pile = piles.get(i-1);
        int[] prefix = new int[pile.size()+1];
        for (int t = 0; t < pile.size(); t++) prefix[t+1] = prefix[t] + pile.get(t);
        for (int j = 0; j <= k; j++) {
            dp[i][j] = dp[i-1][j];
            for (int c = 1; c <= Math.min(pile.size(), j); c++) {
                dp[i][j] = Math.max(dp[i][j], dp[i-1][j-c] + prefix[c]);
            }
        }
    }
    return dp[n][k];
}`,
  },

  defaultInput: {
    piles: [1, 100, 3, 2, 2, 4, 5],
    k: 5,
  },

  inputFields: [
    {
      name: 'piles',
      label: 'Pile (flat, first value = pile size per group)',
      type: 'array',
      defaultValue: [1, 100, 3, 2, 2, 4, 5],
      placeholder: '1,100,3,2,2,4,5',
      helperText: 'Flat coin values for demonstration (treated as one pile)',
    },
    {
      name: 'k',
      label: 'K (max coins to pick)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum total coins to pick',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatPile = input.piles as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    // Treat input as a single pile and a second pile of 3 items for demo
    const piles: number[][] = [flatPile.slice(0, Math.ceil(flatPile.length / 2)), flatPile.slice(Math.ceil(flatPile.length / 2))];
    const n = piles.length;

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));

    const makeViz = (row: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...row],
      highlights,
      labels: Object.fromEntries(row.map((_, i) => [i, `k=${i}`])),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp table (${n + 1} x ${k + 1}). dp[i][j] = max coins from first i piles picking j total.`,
      variables: { n, k },
      visualization: makeViz([...dp[0]], { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      const pile = piles[i - 1];
      const prefix = [0];
      for (const v of pile) prefix.push(prefix[prefix.length - 1] + v);
      steps.push({
        line: 5,
        explanation: `Pile ${i}: [${pile.join(',')}]. Prefix sums: [${prefix.join(',')}].`,
        variables: { pile: pile.join(','), prefix: prefix.join(',') },
        visualization: makeViz([...dp[i - 1]], {}),
      });
      for (let j = 0; j <= k; j++) {
        dp[i][j] = dp[i - 1][j];
        for (let c = 1; c <= Math.min(pile.length, j); c++) {
          const candidate = dp[i - 1][j - c] + prefix[c];
          if (candidate > dp[i][j]) {
            dp[i][j] = candidate;
          }
        }
      }
      steps.push({
        line: 10,
        explanation: `After pile ${i}: dp row = [${dp[i].join(', ')}].`,
        variables: { pileIndex: i, dpRow: dp[i].join(',') },
        visualization: makeViz([...dp[i]], { [k]: 'found' }),
      });
    }

    steps.push({
      line: 11,
      explanation: `Maximum value with k=${k} coins = dp[${n}][${k}] = ${dp[n][k]}.`,
      variables: { result: dp[n][k] },
      visualization: makeViz([...dp[n]], { [k]: 'found' }),
    });

    return steps;
  },
};

export default maximumValueOfKCoinsFromPiles;
