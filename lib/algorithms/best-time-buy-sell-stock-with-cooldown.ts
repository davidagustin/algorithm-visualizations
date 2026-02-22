import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeBuySellStockWithCooldown: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock-with-cooldown',
  title: 'Best Time to Buy and Sell Stock with Cooldown',
  leetcodeNumber: 309,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given prices, find the maximum profit with unlimited transactions but a cooldown of 1 day after each sell (cannot buy on the next day). Use three states: held (holding stock), sold (just sold, in cooldown), and rest (not holding, not in cooldown).',
  tags: ['dynamic programming', 'state machine', 'stock', 'cooldown'],

  code: {
    pseudocode: `function maxProfit(prices):
  held = -prices[0], sold = 0, rest = 0
  for i from 1 to n-1:
    prev_held = held
    held = max(held, rest - prices[i])
    sold = prev_held + prices[i]
    rest = max(rest, sold)
  return max(sold, rest)`,

    python: `def maxProfit(prices: list[int]) -> int:
    held = -prices[0]
    sold = rest = 0
    for i in range(1, len(prices)):
        prev_held = held
        held = max(held, rest - prices[i])
        sold = prev_held + prices[i]
        rest = max(rest, sold)
    return max(sold, rest)`,

    javascript: `function maxProfit(prices) {
  let held = -prices[0], sold = 0, rest = 0;
  for (let i = 1; i < prices.length; i++) {
    const prevHeld = held;
    held = Math.max(held, rest - prices[i]);
    sold = prevHeld + prices[i];
    rest = Math.max(rest, sold);
  }
  return Math.max(sold, rest);
}`,

    java: `public int maxProfit(int[] prices) {
    int held = -prices[0], sold = 0, rest = 0;
    for (int i = 1; i < prices.length; i++) {
        int prevHeld = held;
        held = Math.max(held, rest - prices[i]);
        sold = prevHeld + prices[i];
        rest = Math.max(rest, sold);
    }
    return Math.max(sold, rest);
}`,
  },

  defaultInput: { prices: [1, 2, 3, 0, 2] },

  inputFields: [
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [1, 2, 3, 0, 2],
      placeholder: '1,2,3,0,2',
      helperText: 'Daily stock prices (1-day cooldown after selling)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    let held = -prices[0];
    let sold = 0;
    let rest = 0;

    steps.push({
      line: 2,
      explanation: `Day 0, price=${prices[0]}: Initialize held=${held} (bought), sold=0, rest=0.`,
      variables: { held, sold, rest, day: 0, price: prices[0] },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: { 0: 'active' },
        labels: { 0: 'buy?' },
      },
    });

    for (let i = 1; i < n; i++) {
      const prevHeld = held;
      held = Math.max(held, rest - prices[i]);
      sold = prevHeld + prices[i];
      rest = Math.max(rest, sold);

      const makeViz = (): ArrayVisualization => ({
        type: 'array',
        array: [...prices],
        highlights: { [i]: 'active' },
        labels: { [i]: `$${prices[i]}` },
      });

      steps.push({
        line: 5,
        explanation: `Day ${i}, price=${prices[i]}: held=max(prev_held=${prevHeld}, rest-price=${rest - prices[i]})=${held}; sold=prev_held+price=${prevHeld + prices[i]}=${sold}; rest=max(prev_rest,sold)=${rest}.`,
        variables: { day: i, price: prices[i], held, sold, rest },
        visualization: makeViz(),
      });
    }

    const result = Math.max(sold, rest);
    steps.push({
      line: 8,
      explanation: `Maximum profit = max(sold, rest) = max(${sold}, ${rest}) = ${result}.`,
      variables: { result },
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

export default bestTimeBuySellStockWithCooldown;
