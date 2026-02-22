import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const bestTimeBuySellStockIv: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock-iv',
  title: 'Best Time to Buy and Sell Stock IV',
  leetcodeNumber: 188,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given prices array and integer k, find the maximum profit with at most k transactions. If k >= n/2 (unlimited transactions), use greedy. Otherwise use DP with buy[j] and sell[j] arrays representing optimal states for each of the k transactions.',
  tags: ['dynamic programming', 'array', 'stock', 'state machine'],

  code: {
    pseudocode: `function maxProfit(k, prices):
  if k >= n/2:
    return sum of all positive diffs
  buy = [-INF]*k, sell = [0]*k
  for price in prices:
    for j from 0 to k-1:
      buy[j] = max(buy[j], (sell[j-1] if j>0 else 0) - price)
      sell[j] = max(sell[j], buy[j] + price)
  return sell[k-1]`,

    python: `def maxProfit(k: int, prices: list[int]) -> int:
    n = len(prices)
    if k >= n // 2:
        return sum(max(0, prices[i]-prices[i-1]) for i in range(1, n))
    buy = [float('-inf')] * k
    sell = [0] * k
    for price in prices:
        for j in range(k):
            buy[j] = max(buy[j], (sell[j-1] if j > 0 else 0) - price)
            sell[j] = max(sell[j], buy[j] + price)
    return sell[k-1]`,

    javascript: `function maxProfit(k, prices) {
  const n = prices.length;
  if (k >= Math.floor(n / 2)) {
    let profit = 0;
    for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i-1]);
    return profit;
  }
  const buy = new Array(k).fill(-Infinity);
  const sell = new Array(k).fill(0);
  for (const price of prices) {
    for (let j = 0; j < k; j++) {
      buy[j] = Math.max(buy[j], (j > 0 ? sell[j-1] : 0) - price);
      sell[j] = Math.max(sell[j], buy[j] + price);
    }
  }
  return sell[k-1];
}`,

    java: `public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i-1]);
        return profit;
    }
    int[] buy = new int[k], sell = new int[k];
    Arrays.fill(buy, Integer.MIN_VALUE);
    for (int price : prices) {
        for (int j = 0; j < k; j++) {
            buy[j] = Math.max(buy[j], (j > 0 ? sell[j-1] : 0) - price);
            sell[j] = Math.max(sell[j], buy[j] + price);
        }
    }
    return sell[k-1];
}`,
  },

  defaultInput: { k: 2, prices: [2, 4, 1, 7, 3, 8] },

  inputFields: [
    {
      name: 'k',
      label: 'Max Transactions (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of buy-sell transactions',
    },
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [2, 4, 1, 7, 3, 8],
      placeholder: '2,4,1,7,3,8',
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const prices = input.prices as number[];
    const n = prices.length;
    const steps: AlgorithmStep[] = [];

    if (k >= Math.floor(n / 2)) {
      let profit = 0;
      for (let i = 1; i < n; i++) profit += Math.max(0, prices[i] - prices[i - 1]);
      steps.push({
        line: 3,
        explanation: `k=${k} >= n/2=${Math.floor(n / 2)}: unlimited transactions allowed. Sum all positive diffs = ${profit}.`,
        variables: { k, n, result: profit },
        visualization: {
          type: 'dp-table',
          values: [...prices],
          highlights: Object.fromEntries(prices.map((_, i) => [i, 'found'])),
          labels: prices.map((v, i) => `$${v}`),
        },
      });
      return steps;
    }

    const buy: number[] = Array(k).fill(-Infinity);
    const sell: number[] = Array(k).fill(0);

    steps.push({
      line: 4,
      explanation: `Initialize buy=[${buy.map(v => (v === -Infinity ? '-INF' : v)).join(',')}], sell=[${sell.join(',')}]. k=${k} transactions.`,
      variables: { k },
      visualization: {
        type: 'dp-table',
        values: [...sell],
        highlights: Object.fromEntries(sell.map((_, i) => [i, 'default'])),
        labels: Array.from({ length: k }, (_, i) => `sell[${i}]`),
      },
    });

    for (let p = 0; p < n; p++) {
      const price = prices[p];
      for (let j = 0; j < k; j++) {
        const prevSell = j > 0 ? sell[j - 1] : 0;
        buy[j] = Math.max(buy[j], prevSell - price);
        sell[j] = Math.max(sell[j], buy[j] + price);
      }

      steps.push({
        line: 7,
        explanation: `Day ${p + 1}, price=${price}: sell=[${sell.join(',')}], buy=[${buy.map(v => (v === -Infinity ? '-INF' : v)).join(',')}].`,
        variables: {
          day: p + 1,
          price,
          sell: sell.join(','),
          buy: buy.map(v => (v === -Infinity ? '-INF' : v)).join(','),
        },
        visualization: {
          type: 'dp-table',
          values: [...sell],
          highlights: Object.fromEntries(sell.map((_, i) => [i, 'active'])),
          labels: Array.from({ length: k }, (_, i) => `sell[${i}]`),
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Maximum profit with at most ${k} transactions = sell[${k - 1}] = ${sell[k - 1]}.`,
      variables: { result: sell[k - 1] },
      visualization: {
        type: 'dp-table',
        values: [...sell],
        highlights: { [k - 1]: 'found' },
        labels: Array.from({ length: k }, (_, i) => `sell[${i}]`),
      },
    });

    return steps;
  },
};

export default bestTimeBuySellStockIv;
