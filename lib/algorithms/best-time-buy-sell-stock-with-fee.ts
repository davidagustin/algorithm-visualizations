import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeBuySellStockWithFee: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock-with-fee',
  title: 'Best Time to Buy and Sell Stock with Transaction Fee',
  leetcodeNumber: 714,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given prices array and a transaction fee, find the maximum profit with unlimited transactions. Each transaction incurs a fee subtracted when selling. Use two DP states: cash (max profit when not holding stock) and hold (max profit when holding stock). No cooldown period.',
  tags: ['dynamic programming', 'greedy', 'stock', 'fee'],

  code: {
    pseudocode: `function maxProfit(prices, fee):
  cash = 0, hold = -prices[0]
  for i from 1 to n-1:
    cash = max(cash, hold + prices[i] - fee)
    hold = max(hold, cash - prices[i])
  return cash`,

    python: `def maxProfit(prices: list[int], fee: int) -> int:
    cash = 0
    hold = -prices[0]
    for i in range(1, len(prices)):
        cash = max(cash, hold + prices[i] - fee)
        hold = max(hold, cash - prices[i])
    return cash`,

    javascript: `function maxProfit(prices, fee) {
  let cash = 0, hold = -prices[0];
  for (let i = 1; i < prices.length; i++) {
    cash = Math.max(cash, hold + prices[i] - fee);
    hold = Math.max(hold, cash - prices[i]);
  }
  return cash;
}`,

    java: `public int maxProfit(int[] prices, int fee) {
    int cash = 0, hold = -prices[0];
    for (int i = 1; i < prices.length; i++) {
        cash = Math.max(cash, hold + prices[i] - fee);
        hold = Math.max(hold, cash - prices[i]);
    }
    return cash;
}`,
  },

  defaultInput: { prices: [1, 3, 2, 8, 4, 9], fee: 2 },

  inputFields: [
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [1, 3, 2, 8, 4, 9],
      placeholder: '1,3,2,8,4,9',
      helperText: 'Daily stock prices',
    },
    {
      name: 'fee',
      label: 'Transaction Fee',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Fee paid on each sell transaction',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const fee = input.fee as number;
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    let cash = 0;
    let hold = -prices[0];

    steps.push({
      line: 2,
      explanation: `Day 0, price=${prices[0]}: Initialize cash=0 (no position), hold=${hold} (bought day 0). Fee=${fee}.`,
      variables: { cash, hold, fee, day: 0, price: prices[0] },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: { 0: 'active' },
        labels: { 0: 'buy?' },
      },
    });

    for (let i = 1; i < n; i++) {
      const prevCash = cash;
      const prevHold = hold;
      cash = Math.max(cash, hold + prices[i] - fee);
      hold = Math.max(hold, prevCash - prices[i]);

      steps.push({
        line: 4,
        explanation: `Day ${i}, price=${prices[i]}: cash=max(${prevCash}, ${prevHold}+${prices[i]}-${fee}=${prevHold + prices[i] - fee})=${cash}; hold=max(${prevHold}, ${prevCash}-${prices[i]}=${prevCash - prices[i]})=${hold}.`,
        variables: { day: i, price: prices[i], cash, hold, fee },
        visualization: {
          type: 'array',
          array: [...prices],
          highlights: { [i]: 'active' },
          labels: { [i]: `$${prices[i]}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 6,
      explanation: `Maximum profit = cash = ${cash}. (Hold state ${hold} is always less since fee was paid.)`,
      variables: { result: cash },
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

export default bestTimeBuySellStockWithFee;
