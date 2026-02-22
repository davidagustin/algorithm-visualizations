import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const bestTimeToBuySellStockIV: AlgorithmDefinition = {
  id: 'best-time-to-buy-sell-stock-iv',
  title: 'Best Time to Buy and Sell Stock IV',
  leetcodeNumber: 188,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given an array of stock prices and at most k transactions, find the maximum profit. State machine DP: for each transaction, track the max profit when holding or not holding stock. dp[t][0] = max profit with t transactions not holding, dp[t][1] = max profit holding.',
  tags: ['Dynamic Programming', 'State Machine', 'Greedy'],
  code: {
    pseudocode: `function maxProfit(k, prices):
  n = length(prices)
  if n == 0 or k == 0: return 0
  hold = array of size k+1, filled with -Infinity
  cash = array of size k+1, filled with 0
  for price in prices:
    for t from 1 to k:
      hold[t] = max(hold[t], cash[t-1] - price)
      cash[t] = max(cash[t], hold[t] + price)
  return cash[k]`,
    python: `def maxProfit(k, prices):
    n = len(prices)
    if not n or not k:
        return 0
    hold = [-float('inf')] * (k + 1)
    cash = [0] * (k + 1)
    for price in prices:
        for t in range(1, k + 1):
            hold[t] = max(hold[t], cash[t-1] - price)
            cash[t] = max(cash[t], hold[t] + price)
    return cash[k]`,
    javascript: `function maxProfit(k, prices) {
  const n = prices.length;
  if (!n || !k) return 0;
  const hold = new Array(k + 1).fill(-Infinity);
  const cash = new Array(k + 1).fill(0);
  for (const price of prices) {
    for (let t = 1; t <= k; t++) {
      hold[t] = Math.max(hold[t], cash[t-1] - price);
      cash[t] = Math.max(cash[t], hold[t] + price);
    }
  }
  return cash[k];
}`,
    java: `public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (n == 0 || k == 0) return 0;
    int[] hold = new int[k + 1];
    int[] cash = new int[k + 1];
    Arrays.fill(hold, Integer.MIN_VALUE);
    for (int price : prices) {
        for (int t = 1; t <= k; t++) {
            hold[t] = Math.max(hold[t], cash[t-1] - price);
            cash[t] = Math.max(cash[t], hold[t] + price);
        }
    }
    return cash[k];
}`,
  },
  defaultInput: { k: 2, prices: [3, 2, 6, 5, 0, 3] },
  inputFields: [
    {
      name: 'k',
      label: 'Max Transactions (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Maximum number of buy-sell transactions allowed',
    },
    {
      name: 'prices',
      label: 'Stock Prices',
      type: 'array',
      defaultValue: [3, 2, 6, 5, 0, 3],
      placeholder: '3,2,6,5,0,3',
      helperText: 'Daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const prices = input.prices as number[];
    const n = prices.length;
    const steps: AlgorithmStep[] = [];

    if (!n || !k) {
      steps.push({
        line: 3,
        explanation: 'No prices or no transactions allowed. Return 0.',
        variables: { k, n, result: 0 },
        visualization: { type: 'dp-table', values: [0], highlights: { 0: 'active' }, labels: ['result'] },
      });
      return steps;
    }

    const hold: number[] = new Array(k + 1).fill(-999999);
    const cash: number[] = new Array(k + 1).fill(0);
    const labels: string[] = Array.from({ length: k + 1 }, (_, i) => `t=${i}`);

    function makeViz(activeIdx: number, arr: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= k; i++) {
        highlights[i] = i === activeIdx ? 'active' : arr[i] > 0 ? 'found' : 'default';
      }
      return { type: 'dp-table', values: arr.map(v => v === -999999 ? null : v), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Initialize: hold[t] = -Infinity (not holding stock), cash[t] = 0 (no profit yet) for all t=0..${k}.`,
      variables: { k, n, hold: hold.slice(), cash: cash.slice() },
      visualization: makeViz(-1, cash.slice()),
    });

    for (let d = 0; d < n; d++) {
      const price = prices[d];
      steps.push({
        line: 6,
        explanation: `Day ${d}: price = ${price}. Update hold and cash arrays for each transaction count.`,
        variables: { day: d, price },
        visualization: makeViz(-1, cash.slice()),
      });

      for (let t = 1; t <= k; t++) {
        const newHold = Math.max(hold[t], cash[t - 1] - price);
        const prevCashT = cash[t];
        hold[t] = newHold;
        const newCash = Math.max(cash[t], hold[t] + price);
        cash[t] = newCash;

        steps.push({
          line: 8,
          explanation: `t=${t}: hold[${t}] = max(${hold[t]}, cash[${t - 1}]-${price}) = ${newHold}. cash[${t}] = max(${prevCashT}, ${newHold}+${price}) = ${newCash}.`,
          variables: { t, price, 'hold[t]': newHold, 'cash[t]': newCash },
          visualization: makeViz(t, cash.slice()),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Final answer: cash[${k}] = ${cash[k]}. Maximum profit with at most ${k} transactions.`,
      variables: { result: cash[k] },
      visualization: makeViz(k, cash.slice()),
    });

    return steps;
  },
};

export default bestTimeToBuySellStockIV;
