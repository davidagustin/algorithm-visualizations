import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const rodCutting: AlgorithmDefinition = {
  id: 'rod-cutting',
  title: 'Rod Cutting',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a rod of length n and a table of prices for each length from 1 to n, find the maximum revenue obtainable by cutting the rod and selling the pieces. This is a classic unbounded knapsack problem. dp[i] represents the maximum revenue from a rod of length i. For each length i, we try all possible first cuts of length j and keep the one that yields maximum total revenue.',
  tags: ['dp', 'unbounded knapsack', 'greedy comparison', 'optimization'],

  code: {
    pseudocode: `function rodCutting(prices, n):
  dp = array of size n+1, all 0
  for i from 1 to n:
    maxVal = -INFINITY
    for j from 1 to i:
      maxVal = max(maxVal, prices[j] + dp[i-j])
    dp[i] = maxVal
  return dp[n]`,
    python: `def rodCutting(prices: list, n: int) -> int:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        max_val = float('-inf')
        for j in range(1, i + 1):
            max_val = max(max_val, prices[j] + dp[i - j])
        dp[i] = max_val
    return dp[n]`,
    javascript: `function rodCutting(prices, n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    let maxVal = -Infinity;
    for (let j = 1; j <= i; j++) {
      maxVal = Math.max(maxVal, prices[j] + dp[i - j]);
    }
    dp[i] = maxVal;
  }
  return dp[n];
}`,
    java: `public int rodCutting(int[] prices, int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        int maxVal = Integer.MIN_VALUE;
        for (int j = 1; j <= i; j++) {
            maxVal = Math.max(maxVal, prices[j] + dp[i - j]);
        }
        dp[i] = maxVal;
    }
    return dp[n];
}`,
  },

  defaultInput: {
    prices: [0, 1, 5, 8, 9, 10, 17, 17, 20],
    n: 8,
  },

  inputFields: [
    {
      name: 'prices',
      label: 'Prices (index = length)',
      type: 'array',
      defaultValue: [0, 1, 5, 8, 9, 10, 17, 17, 20],
      placeholder: '0,1,5,8,9,10,17,17,20',
      helperText: 'prices[i] = revenue for piece of length i (index 0 unused)',
    },
    {
      name: 'n',
      label: 'Rod Length',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Total length of the rod',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights,
      labels: Array.from({ length: n + 1 }, (_, i) => `len=${i}`),
    });

    steps.push({
      line: 1,
      explanation: `Rod of length ${n}. prices = [${prices.slice(1, n + 1).join(', ')}] for lengths 1..${n}. Find max revenue.`,
      variables: { n, prices: prices.slice(0, n + 1).join(',') },
      visualization: makeViz({}),
    });

    for (let i = 1; i <= n; i++) {
      let maxVal = -Infinity;
      steps.push({
        line: 3,
        explanation: `Computing dp[${i}]: max revenue for rod of length ${i}.`,
        variables: { i, maxVal: 'computing' },
        visualization: makeViz({ [i]: 'active' }),
      });

      for (let j = 1; j <= i; j++) {
        const candidate = prices[j] + dp[i - j];
        steps.push({
          line: 5,
          explanation: `Cut length ${j} (price=${prices[j]}) + dp[${i - j}]=${dp[i - j]} = ${candidate}.`,
          variables: { i, j, cutPrice: prices[j], remainder: dp[i - j], candidate },
          visualization: makeViz({ [i]: 'active', [i - j]: 'comparing' }),
        });
        if (candidate > maxVal) maxVal = candidate;
      }

      dp[i] = maxVal;
      steps.push({
        line: 7,
        explanation: `dp[${i}] = ${dp[i]}: maximum revenue from rod of length ${i}.`,
        variables: { i, 'dp[i]': dp[i] },
        visualization: makeViz({ [i]: 'found' }),
      });
    }

    steps.push({
      line: 8,
      explanation: `Maximum revenue from rod of length ${n} = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: makeViz({ [n]: 'found' }),
    });

    return steps;
  },
};

export default rodCutting;
