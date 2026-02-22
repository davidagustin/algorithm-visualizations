import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeBuySellStockIii: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock-iii',
  title: 'Best Time to Buy and Sell Stock III',
  leetcodeNumber: 123,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given an array prices, find the maximum profit from at most 2 transactions (each buy must occur before a sell). Track four states: buy1 (min cost after first buy), sell1 (max profit after first sell), buy2 (min cost of second buy accounting for profit), sell2 (max profit after second sell).',
  tags: ['dynamic programming', 'array', 'state machine', 'stock'],

  code: {
    pseudocode: `function maxProfit(prices):
  buy1 = -INF, sell1 = 0
  buy2 = -INF, sell2 = 0
  for price in prices:
    buy1 = max(buy1, -price)
    sell1 = max(sell1, buy1 + price)
    buy2 = max(buy2, sell1 - price)
    sell2 = max(sell2, buy2 + price)
  return sell2`,

    python: `def maxProfit(prices: list[int]) -> int:
    buy1 = buy2 = float('-inf')
    sell1 = sell2 = 0
    for price in prices:
        buy1 = max(buy1, -price)
        sell1 = max(sell1, buy1 + price)
        buy2 = max(buy2, sell1 - price)
        sell2 = max(sell2, buy2 + price)
    return sell2`,

    javascript: `function maxProfit(prices) {
  let buy1 = -Infinity, sell1 = 0;
  let buy2 = -Infinity, sell2 = 0;
  for (const price of prices) {
    buy1 = Math.max(buy1, -price);
    sell1 = Math.max(sell1, buy1 + price);
    buy2 = Math.max(buy2, sell1 - price);
    sell2 = Math.max(sell2, buy2 + price);
  }
  return sell2;
}`,

    java: `public int maxProfit(int[] prices) {
    int buy1 = Integer.MIN_VALUE, sell1 = 0;
    int buy2 = Integer.MIN_VALUE, sell2 = 0;
    for (int price : prices) {
        buy1 = Math.max(buy1, -price);
        sell1 = Math.max(sell1, buy1 + price);
        buy2 = Math.max(buy2, sell1 - price);
        sell2 = Math.max(sell2, buy2 + price);
    }
    return sell2;
}`,
  },

  defaultInput: { prices: [3, 3, 5, 0, 0, 3, 1, 4] },

  inputFields: [
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [3, 3, 5, 0, 0, 3, 1, 4],
      placeholder: '3,3,5,0,0,3,1,4',
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];

    let buy1 = -Infinity;
    let sell1 = 0;
    let buy2 = -Infinity;
    let sell2 = 0;

    steps.push({
      line: 2,
      explanation: 'Initialize: buy1=-INF, sell1=0, buy2=-INF, sell2=0. No transactions yet.',
      variables: { buy1: '-INF', sell1, buy2: '-INF', sell2 },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      buy1 = Math.max(buy1, -price);
      sell1 = Math.max(sell1, buy1 + price);
      buy2 = Math.max(buy2, sell1 - price);
      sell2 = Math.max(sell2, buy2 + price);

      const makeViz = (): ArrayVisualization => ({
        type: 'array',
        array: [...prices],
        highlights: { [i]: 'active' },
        labels: { [i]: `$${price}` },
      });

      steps.push({
        line: 5,
        explanation: `Day ${i + 1}, price=${price}: buy1=${buy1 === -Infinity ? '-INF' : buy1}, sell1=${sell1}, buy2=${buy2 === -Infinity ? '-INF' : buy2}, sell2=${sell2}.`,
        variables: {
          day: i + 1,
          price,
          buy1: buy1 === -Infinity ? '-INF' : buy1,
          sell1,
          buy2: buy2 === -Infinity ? '-INF' : buy2,
          sell2,
        },
        visualization: makeViz(),
      });
    }

    steps.push({
      line: 9,
      explanation: `Maximum profit with at most 2 transactions = sell2 = ${sell2}.`,
      variables: { result: sell2 },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: Object.fromEntries(prices.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default bestTimeBuySellStockIii;
