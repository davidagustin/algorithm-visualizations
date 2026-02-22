import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeBuySellStockII: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock-ii',
  title: 'Best Time to Buy and Sell Stock II',
  leetcodeNumber: 122,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Maximize profit from multiple buy-sell transactions (can hold at most one share). Greedy insight: capture every upward price movement. If tomorrow\'s price is higher than today\'s, buy today and sell tomorrow (equivalently, add the positive difference to profit). O(n) time.',
  tags: ['Array', 'Greedy', 'Dynamic Programming'],
  code: {
    pseudocode: `function maxProfit(prices):
  profit = 0
  for i from 1 to len(prices)-1:
    if prices[i] > prices[i-1]:
      profit += prices[i] - prices[i-1]
  return profit`,
    python: `def maxProfit(prices):
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            profit += prices[i] - prices[i-1]
    return profit`,
    javascript: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i-1])
      profit += prices[i] - prices[i-1];
  }
  return profit;
}`,
    java: `public int maxProfit(int[] prices) {
    int profit = 0;
    for (int i = 1; i < prices.length; i++)
        if (prices[i] > prices[i-1])
            profit += prices[i] - prices[i-1];
    return profit;
}`,
  },
  defaultInput: { prices: [7, 1, 5, 3, 6, 4] },
  inputFields: [
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [7, 1, 5, 3, 6, 4],
      placeholder: '7,1,5,3,6,4',
      helperText: 'Daily stock prices (multiple transactions allowed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    let profit = 0;

    const makeViz = (
      idx: number,
      gain: number,
      cumProfit: number,
      bought: Set<number>,
      sold: Set<number>,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < n; k++) {
        if (bought.has(k)) { highlights[k] = 'found'; labels[k] = 'buy'; }
        else if (sold.has(k)) { highlights[k] = 'active'; labels[k] = 'sell'; }
        else if (k < idx) { highlights[k] = 'visited'; }
        else if (k === idx) { highlights[k] = 'current'; }
        else { highlights[k] = 'default'; }
      }

      return {
        type: 'array',
        array: [...prices],
        highlights,
        labels,
        auxData: {
          label: 'Multiple Transactions',
          entries: [
            { key: 'Day', value: String(idx) },
            { key: 'Gain today', value: gain > 0 ? `+$${gain}` : '$0' },
            { key: 'Total Profit', value: `$${cumProfit}` },
          ],
        },
      };
    };

    const boughtDays = new Set<number>();
    const soldDays = new Set<number>();

    steps.push({
      line: 1,
      explanation: `Maximize profit with unlimited buy-sell transactions. Greedy: add every upward price difference.`,
      variables: { profit },
      visualization: makeViz(0, 0, 0, boughtDays, soldDays),
    });

    steps.push({
      line: 2,
      explanation: `Initialize profit=0.`,
      variables: { profit },
      visualization: makeViz(0, 0, 0, boughtDays, soldDays),
    });

    for (let i = 1; i < n; i++) {
      const diff = prices[i] - prices[i - 1];

      if (diff > 0) {
        profit += diff;
        boughtDays.add(i - 1);
        soldDays.add(i);

        steps.push({
          line: 4,
          explanation: `Day ${i}: prices[${i}]=$${prices[i]} > prices[${i - 1}]=$${prices[i - 1]}. Gain = $${diff}. profit = $${profit}.`,
          variables: { i, 'prices[i]': prices[i], 'prices[i-1]': prices[i - 1], gain: diff, profit },
          visualization: makeViz(i, diff, profit, new Set(boughtDays), new Set(soldDays)),
        });
      } else {
        steps.push({
          line: 3,
          explanation: `Day ${i}: prices[${i}]=$${prices[i]} <= prices[${i - 1}]=$${prices[i - 1]}. No gain (diff=$${diff}). Skip.`,
          variables: { i, 'prices[i]': prices[i], 'prices[i-1]': prices[i - 1], diff, profit },
          visualization: makeViz(i, 0, profit, new Set(boughtDays), new Set(soldDays)),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `All days scanned. Maximum profit from multiple transactions = $${profit}.`,
      variables: { result: profit },
      visualization: makeViz(n - 1, 0, profit, new Set(boughtDays), new Set(soldDays)),
    });

    return steps;
  },
};

export default bestTimeBuySellStockII;
