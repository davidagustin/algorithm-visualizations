import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeToBuySellGreedy: AlgorithmDefinition = {
  id: 'best-time-to-buy-sell-greedy',
  title: 'Best Time to Buy and Sell Stock II (Unlimited Transactions)',
  leetcodeNumber: 122,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given daily stock prices, you can buy and sell on any day but can hold at most one stock at a time. Maximize total profit with any number of transactions. Greedy insight: collect profit from every upward price movement. If prices[i] > prices[i-1], add that difference to profit.',
  tags: ['greedy', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function maxProfit(prices):
  profit = 0
  for i from 1 to n-1:
    if prices[i] > prices[i-1]:
      profit += prices[i] - prices[i-1]
  return profit`,

    python: `def maxProfit(prices: list[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit`,

    javascript: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}`,

    java: `public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
}`,
  },

  defaultInput: {
    prices: [7, 1, 5, 3, 6, 4],
  },

  inputFields: [
    {
      name: 'prices',
      label: 'Stock Prices',
      type: 'array',
      defaultValue: [7, 1, 5, 3, 6, 4],
      placeholder: '7,1,5,3,6,4',
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Prices: [${prices.join(', ')}]. Collect every positive price difference (buy and immediately sell on any upswing).`,
      variables: { profit: 0 },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: {},
        labels: {},
      },
    });

    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) {
        profit += diff;
        steps.push({
          line: 4,
          explanation: `Day ${i}: price rose from ${prices[i - 1]} to ${prices[i]} (gain +${diff}). Buy yesterday, sell today. Profit = ${profit}.`,
          variables: { i, 'prices[i]': prices[i], 'prices[i-1]': prices[i - 1], gain: diff, profit },
          visualization: {
            type: 'array',
            array: [...prices],
            highlights: { [i - 1]: 'active', [i]: 'found' } as Record<number, string>,
            labels: { [i - 1]: 'buy', [i]: `+${diff}` } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 3,
          explanation: `Day ${i}: price went from ${prices[i - 1]} to ${prices[i]} (diff=${diff} <= 0). Skip, no profit here.`,
          variables: { i, 'prices[i]': prices[i], 'prices[i-1]': prices[i - 1], diff, profit },
          visualization: {
            type: 'array',
            array: [...prices],
            highlights: { [i - 1]: 'comparing', [i]: 'mismatch' } as Record<number, string>,
            labels: { [i]: 'skip' } as Record<number, string>,
          },
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Total maximum profit: ${profit}.`,
      variables: { result: profit },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: Object.fromEntries(prices.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default bestTimeToBuySellGreedy;
