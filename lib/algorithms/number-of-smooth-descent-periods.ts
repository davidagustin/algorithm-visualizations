import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSmoothDescentPeriods: AlgorithmDefinition = {
  id: 'number-of-smooth-descent-periods',
  title: 'Number of Smooth Descent Periods of a Stock',
  leetcodeNumber: 2110,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array prices, a smooth descent period is a contiguous subarray where each element is exactly 1 less than the previous. Count the total number of smooth descent periods (including single-element subarrays). Use sliding window tracking current run length.',
  tags: ['sliding window', 'math', 'array'],

  code: {
    pseudocode: `function getDescentPeriods(prices):
  result = 0
  run = 1
  for i in range(1, len(prices)):
    if prices[i] == prices[i-1] - 1:
      run++
    else:
      run = 1
    result += run
  return result + 1  // +1 for first element`,

    python: `def getDescentPeriods(prices: list[int]) -> int:
    result = 1
    run = 1
    for i in range(1, len(prices)):
        if prices[i] == prices[i-1] - 1:
            run += 1
        else:
            run = 1
        result += run
    return result`,

    javascript: `function getDescentPeriods(prices) {
  let result = 1, run = 1;
  for (let i = 1; i < prices.length; i++) {
    run = prices[i] === prices[i-1] - 1 ? run + 1 : 1;
    result += run;
  }
  return result;
}`,

    java: `public long getDescentPeriods(int[] prices) {
    long result = 1, run = 1;
    for (int i = 1; i < prices.length; i++) {
        run = prices[i] == prices[i-1] - 1 ? run + 1 : 1;
        result += run;
    }
    return result;
}`,
  },

  defaultInput: {
    prices: [3, 2, 1, 4],
  },

  inputFields: [
    {
      name: 'prices',
      label: 'Stock Prices',
      type: 'array',
      defaultValue: [3, 2, 1, 4],
      placeholder: '3,2,1,4',
      helperText: 'Comma-separated stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const n = prices.length;

    steps.push({
      line: 1,
      explanation: `Count all smooth descent periods. A single element always counts. Starting with result=1 (for prices[0]=${prices[0]}) and run=1.`,
      variables: { result: 1, run: 1 },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      } as ArrayVisualization,
    });

    let result = 1;
    let run = 1;

    for (let i = 1; i < n; i++) {
      const descending = prices[i] === prices[i - 1] - 1;
      if (descending) {
        run++;
      } else {
        run = 1;
      }
      result += run;

      steps.push({
        line: 4,
        explanation: `Index ${i}: prices[${i}]=${prices[i]}, prices[${i - 1}]=${prices[i - 1]}. ${descending ? `Descent! Run extends to ${run}.` : `Break! Run resets to 1.`} Add ${run} to result. Total = ${result}.`,
        variables: { i, current: prices[i], previous: prices[i - 1], run, result, descending },
        visualization: {
          type: 'array',
          array: [...prices],
          highlights: {
            [i]: descending ? 'found' : 'mismatch',
            [i - 1]: descending ? 'active' : 'sorted',
          },
          labels: { [i]: `run=${run}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 9,
      explanation: `Total smooth descent periods = ${result}. Each run of length L contributes L*(L+1)/2 periods.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...prices],
        highlights: Object.fromEntries(prices.map((_, i) => [i, 'found'])),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfSmoothDescentPeriods;
