import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const bestTimeToBuySellStockFee: AlgorithmDefinition = {
  id: 'best-time-to-buy-sell-stock-fee-ii',
  title: 'Best Time to Buy and Sell Stock with Transaction Fee',
  leetcodeNumber: 714,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find max profit buying and selling stocks with a transaction fee paid on each sale. Unlimited transactions allowed. State machine DP: cash = max profit not holding stock, hold = max profit holding stock. cash = max(cash, hold + price - fee), hold = max(hold, cash - price).',
  tags: ['Dynamic Programming', 'State Machine', 'Greedy'],
  code: {
    pseudocode: `function maxProfit(prices, fee):
  cash = 0
  hold = -prices[0]
  for i from 1 to n-1:
    cash = max(cash, hold + prices[i] - fee)
    hold = max(hold, cash - prices[i])
  return cash`,
    python: `def maxProfit(prices, fee):
    cash, hold = 0, -prices[0]
    for price in prices[1:]:
        cash = max(cash, hold + price - fee)
        hold = max(hold, cash - price)
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
      label: 'Stock Prices',
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
      placeholder: 'e.g. 2',
      helperText: 'Fee paid per completed transaction (buy+sell)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const fee = input.fee as number;
    const steps: AlgorithmStep[] = [];

    if (prices.length === 0) {
      steps.push({
        line: 1,
        explanation: 'Empty prices array. Return 0.',
        variables: { result: 0 },
        visualization: { type: 'dp-table', values: [0], highlights: { 0: 'active' }, labels: ['result'] },
      });
      return steps;
    }

    let cash = 0;
    let hold = -prices[0];
    const labels = ['cash', 'hold'];

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      highlights[0] = activeIdx === 0 ? 'active' : cash > 0 ? 'found' : 'default';
      highlights[1] = activeIdx === 1 ? 'active' : 'comparing';
      return { type: 'dp-table', values: [cash, hold], highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Initialize: cash=0 (no stock held, no profit), hold=-prices[0]=-${prices[0]} (bought first stock).`,
      variables: { cash, hold, fee },
      visualization: makeViz(-1),
    });

    for (let i = 1; i < prices.length; i++) {
      const price = prices[i];
      const newCash = Math.max(cash, hold + price - fee);
      const newHold = Math.max(hold, cash - price);

      steps.push({
        line: 4,
        explanation: `Day ${i}: price=${price}. cash=max(${cash}, ${hold}+${price}-${fee})=${newCash}. hold=max(${hold}, ${cash}-${price})=${newHold}.`,
        variables: { i, price, newCash, newHold },
        visualization: makeViz(-1),
      });

      cash = newCash;
      hold = newHold;

      steps.push({
        line: 6,
        explanation: `Updated: cash=${cash}, hold=${hold}.`,
        variables: { cash, hold },
        visualization: makeViz(0),
      });
    }

    steps.push({
      line: 7,
      explanation: `Return cash=${cash}. Maximum profit with unlimited transactions and fee=${fee}.`,
      variables: { result: cash },
      visualization: makeViz(0),
    });

    return steps;
  },
};

export default bestTimeToBuySellStockFee;
