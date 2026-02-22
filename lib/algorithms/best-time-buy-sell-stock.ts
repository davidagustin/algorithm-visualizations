import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bestTimeBuySellStock: AlgorithmDefinition = {
  id: 'best-time-buy-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  leetcodeNumber: 121,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given prices on each day, find the maximum profit from one buy followed by one sell. Track the minimum price seen so far. For each day, compute potential profit (current price - min price) and update the maximum profit. O(n) time, O(1) space.',
  tags: ['Array', 'Dynamic Programming', 'Greedy'],
  code: {
    pseudocode: `function maxProfit(prices):
  minPrice = prices[0]
  maxProfit = 0
  for each price in prices:
    minPrice = min(minPrice, price)
    maxProfit = max(maxProfit, price - minPrice)
  return maxProfit`,
    python: `def maxProfit(prices):
    min_price = prices[0]
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
    javascript: `function maxProfit(prices) {
  let minPrice = prices[0], maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
    java: `public int maxProfit(int[] prices) {
    int minPrice = prices[0], maxProfit = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
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
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    let minPrice = prices[0];
    let maxProfit = 0;
    let buyDay = 0;
    let bestBuy = 0;
    let bestSell = 0;

    const makeViz = (
      currIdx: number,
      minIdx: number,
      profit: number,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < n; k++) {
        if (k < currIdx) highlights[k] = 'visited';
        else if (k === currIdx) highlights[k] = 'active';
        else highlights[k] = 'default';
      }

      highlights[minIdx] = 'pointer';
      labels[minIdx] = 'buy';
      labels[currIdx] = 'curr';

      if (bestSell > 0 && bestBuy !== bestSell) {
        highlights[bestBuy] = 'found';
        highlights[bestSell] = 'found';
        labels[bestBuy] = 'best-buy';
        labels[bestSell] = 'best-sell';
      }

      return {
        type: 'array',
        array: [...prices],
        highlights,
        labels,
        auxData: {
          label: 'Stock Prices',
          entries: [
            { key: 'Min Price (buy)', value: `$${minPrice} (day ${minIdx})` },
            { key: 'Current Price', value: `$${prices[currIdx] ?? '-'}` },
            { key: 'Profit here', value: `$${profit}` },
            { key: 'Max Profit', value: `$${maxProfit}` },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Find max profit from one buy-sell. Track minimum price and best profit as we scan prices.`,
      variables: { minPrice, maxProfit },
      visualization: makeViz(0, 0, 0),
    });

    steps.push({
      line: 2,
      explanation: `Initialize minPrice=${prices[0]}, maxProfit=0.`,
      variables: { minPrice, maxProfit },
      visualization: makeViz(0, 0, 0),
    });

    for (let i = 0; i < n; i++) {
      const price = prices[i];
      const prevMin = minPrice;

      if (price < minPrice) {
        minPrice = price;
        buyDay = i;
      }

      const profit = price - minPrice;

      steps.push({
        line: 4,
        explanation: `Day ${i}: price=$${price}. minPrice=${prevMin !== minPrice ? `updated to $${minPrice} (new low!)` : `$${minPrice} (unchanged)`}. Profit if sold today = $${price} - $${minPrice} = $${profit}.`,
        variables: { i, price, minPrice, profit, maxProfit: Math.max(maxProfit, profit) },
        visualization: makeViz(i, buyDay, profit),
      });

      if (profit > maxProfit) {
        maxProfit = profit;
        bestBuy = buyDay;
        bestSell = i;
      }
    }

    steps.push({
      line: 6,
      explanation: `Scan complete. Best buy on day ${bestBuy} ($${prices[bestBuy]}), sell on day ${bestSell} ($${prices[bestSell]}). Max profit = $${maxProfit}.`,
      variables: { result: maxProfit, buyDay: bestBuy, sellDay: bestSell },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: Object.fromEntries(
          prices.map((_, k) => [k, k === bestBuy ? 'found' : k === bestSell ? 'active' : 'visited']),
        ),
        labels: { [bestBuy]: 'BUY', [bestSell]: 'SELL' },
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Buy Day', value: `Day ${bestBuy} @ $${prices[bestBuy]}` },
            { key: 'Sell Day', value: `Day ${bestSell} @ $${prices[bestSell]}` },
            { key: 'Max Profit', value: `$${maxProfit}` },
          ],
        },
      },
    });

    return steps;
  },
};

export default bestTimeBuySellStock;
