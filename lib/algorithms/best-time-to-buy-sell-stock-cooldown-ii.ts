import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const bestTimeToBuySellStockCooldown: AlgorithmDefinition = {
  id: 'best-time-to-buy-sell-stock-cooldown-ii',
  title: 'Best Time to Buy and Sell Stock with Cooldown',
  leetcodeNumber: 309,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'After selling stock, you must wait one cooldown day before buying again. State machine DP: held = max profit holding stock, sold = max profit just sold (in cooldown), rest = max profit in rest state. Transitions: held = max(held, rest - price), sold = held + price, rest = max(rest, sold).',
  tags: ['Dynamic Programming', 'State Machine'],
  code: {
    pseudocode: `function maxProfit(prices):
  held = -Infinity
  sold = 0
  rest = 0
  for price in prices:
    prevSold = sold
    sold = held + price
    held = max(held, rest - price)
    rest = max(rest, prevSold)
  return max(sold, rest)`,
    python: `def maxProfit(prices):
    held, sold, rest = -float('inf'), 0, 0
    for price in prices:
        prev_sold = sold
        sold = held + price
        held = max(held, rest - price)
        rest = max(rest, prev_sold)
    return max(sold, rest)`,
    javascript: `function maxProfit(prices) {
  let held = -Infinity, sold = 0, rest = 0;
  for (const price of prices) {
    const prevSold = sold;
    sold = held + price;
    held = Math.max(held, rest - price);
    rest = Math.max(rest, prevSold);
  }
  return Math.max(sold, rest);
}`,
    java: `public int maxProfit(int[] prices) {
    int held = Integer.MIN_VALUE, sold = 0, rest = 0;
    for (int price : prices) {
        int prevSold = sold;
        sold = held + price;
        held = Math.max(held, rest - price);
        rest = Math.max(rest, prevSold);
    }
    return Math.max(sold, rest);
}`,
  },
  defaultInput: { prices: [1, 2, 3, 0, 2] },
  inputFields: [
    {
      name: 'prices',
      label: 'Stock Prices',
      type: 'array',
      defaultValue: [1, 2, 3, 0, 2],
      placeholder: '1,2,3,0,2',
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];

    let held = -999999;
    let sold = 0;
    let rest = 0;

    const labels: string[] = ['held', 'sold', 'rest'];

    function makeViz(activeIdx: number): DPVisualization {
      const vals: (number | null)[] = [held === -999999 ? null : held, sold, rest];
      const highlights: Record<number, string> = {};
      for (let i = 0; i < 3; i++) {
        highlights[i] = i === activeIdx ? 'active' : vals[i] !== null && (vals[i] as number) >= 0 ? 'found' : 'default';
      }
      return { type: 'dp-table', values: vals, highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize states: held = -Infinity (not holding), sold = 0 (just sold, in cooldown), rest = 0 (resting/available to buy).',
      variables: { held: 'none', sold: 0, rest: 0 },
      visualization: makeViz(-1),
    });

    for (let d = 0; d < prices.length; d++) {
      const price = prices[d];
      const prevSold = sold;
      const newSold = held === -999999 ? -999999 : held + price;
      const newHeld = Math.max(held, rest - price);
      const newRest = Math.max(rest, prevSold);

      steps.push({
        line: 5,
        explanation: `Day ${d}: price=${price}. sold = held+price = ${held === -999999 ? '-Inf' : held+price}. held = max(held, rest-price) = ${newHeld}. rest = max(rest, prevSold) = ${newRest}.`,
        variables: { day: d, price, prevSold, newHeld, newSold: newSold === -999999 ? 'none' : newSold, newRest },
        visualization: makeViz(-1),
      });

      sold = newSold === -999999 ? 0 : newSold;
      held = newHeld;
      rest = newRest;

      steps.push({
        line: 8,
        explanation: `After day ${d}: held=${held === -999999 ? '-Inf' : held}, sold=${sold}, rest=${rest}.`,
        variables: { held: held === -999999 ? 'none' : held, sold, rest },
        visualization: makeViz(Math.max(sold, rest) === rest ? 2 : 1),
      });
    }

    const result = Math.max(sold, rest);
    steps.push({
      line: 9,
      explanation: `Result: max(sold=${sold}, rest=${rest}) = ${result}. Maximum profit with cooldown.`,
      variables: { result },
      visualization: makeViz(Math.max(sold, rest) === rest ? 2 : 1),
    });

    return steps;
  },
};

export default bestTimeToBuySellStockCooldown;
