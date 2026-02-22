import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfCoinsForFruits: AlgorithmDefinition = {
  id: 'minimum-number-of-coins-for-fruits',
  title: 'Minimum Number of Coins for Fruits',
  leetcodeNumber: 2944,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given fruit prices, when you buy fruit at index i (1-indexed) you get the next i fruits for free. Find minimum coins to acquire all fruits. dp[i] = minimum cost to acquire fruits 1..i. For each i, try every j where you bought at j and the free window covers i.',
  tags: ['dynamic programming', 'greedy', 'array'],

  code: {
    pseudocode: `function minimumCoins(prices):
  n = len(prices)
  dp = array of size n+1, dp[0] = 0, rest = Infinity
  for i from 1 to n:
    dp[i] = dp[i-1] + prices[i-1]  // buy fruit i
    for j from 1 to i-1:
      if j + j >= i:  // free window from j covers i
        dp[i] = min(dp[i], dp[j])
  return dp[n]`,
    python: `def minimumCoins(prices: list[int]) -> int:
    n = len(prices)
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        dp[i] = dp[i-1] + prices[i-1]
        for j in range(1, i):
            if j + j >= i:
                dp[i] = min(dp[i], dp[j])
    return dp[n]`,
    javascript: `function minimumCoins(prices) {
  const n = prices.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i-1] + prices[i-1];
    for (let j = 1; j < i; j++) {
      if (j + j >= i) {
        dp[i] = Math.min(dp[i], dp[j]);
      }
    }
  }
  return dp[n];
}`,
    java: `public int minimumCoins(int[] prices) {
    int n = prices.length;
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i-1] + prices[i-1];
        for (int j = 1; j < i; j++) {
            if (j + j >= i) {
                dp[i] = Math.min(dp[i], dp[j]);
            }
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    prices: [3, 1, 2],
  },

  inputFields: [
    {
      name: 'prices',
      label: 'Fruit Prices',
      type: 'array',
      defaultValue: [3, 1, 2],
      placeholder: '3,1,2',
      helperText: 'Comma-separated prices for each fruit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v === Infinity ? -1 : v)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, `dp[${i}]`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp array for ${n} fruits. dp[0] = 0.`,
      variables: { n },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      dp[i] = dp[i - 1] + prices[i - 1];
      steps.push({
        line: 5,
        explanation: `Fruit ${i}: buy it, dp[${i}] = dp[${i - 1}] + ${prices[i - 1]} = ${dp[i]}.`,
        variables: { i, price: prices[i - 1], 'dp[i]': dp[i] },
        visualization: makeViz([...dp], { [i]: 'active', [i - 1]: 'comparing' }),
      });
      for (let j = 1; j < i; j++) {
        if (j + j >= i) {
          if (dp[j] < dp[i]) {
            dp[i] = dp[j];
            steps.push({
              line: 7,
              explanation: `Buying at j=${j} gives free fruits up to ${j + j}, covering fruit ${i}. dp[${i}] = dp[${j}] = ${dp[i]}.`,
              variables: { i, j, freeUpTo: j + j, 'dp[i]': dp[i] },
              visualization: makeViz([...dp], { [i]: 'found', [j]: 'comparing' }),
            });
          }
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum coins to acquire all ${n} fruits = dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: 'found' }),
    });

    return steps;
  },
};

export default minimumNumberOfCoinsForFruits;
