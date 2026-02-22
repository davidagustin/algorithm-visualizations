import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const finalPricesWithSpecialDiscountII: AlgorithmDefinition = {
  id: 'final-prices-with-special-discount-ii',
  title: 'Final Prices With Special Discount II',
  leetcodeNumber: 1475,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given prices[], for each item find the final price after applying the discount: the first item to the right with price <= current price. This is the classic "next smaller or equal element" problem solved with a monotonic non-decreasing stack.',
  tags: ['Stack', 'Monotonic Stack', 'Array'],
  code: {
    pseudocode: `function finalPrices(prices):
  stack = []  // indices, monotonic non-decreasing
  result = prices.copy()
  for i from 0 to n-1:
    while stack and prices[stack.top] >= prices[i]:
      idx = stack.pop()
      result[idx] = prices[idx] - prices[i]
    stack.push(i)
  return result`,
    python: `def finalPrices(prices):
    stack = []
    result = prices[:]
    for i, price in enumerate(prices):
        while stack and prices[stack[-1]] >= price:
            idx = stack.pop()
            result[idx] = prices[idx] - price
        stack.append(i)
    return result`,
    javascript: `function finalPrices(prices) {
  const result = [...prices];
  const stack = [];
  for (let i = 0; i < prices.length; i++) {
    while (stack.length && prices[stack[stack.length-1]] >= prices[i]) {
      const idx = stack.pop();
      result[idx] = prices[idx] - prices[i];
    }
    stack.push(i);
  }
  return result;
}`,
    java: `public int[] finalPrices(int[] prices) {
    int[] result = prices.clone();
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < prices.length; i++) {
        while (!stack.isEmpty() && prices[stack.peek()] >= prices[i]) {
            int idx = stack.pop();
            result[idx] = prices[idx] - prices[i];
        }
        stack.push(i);
    }
    return result;
}`,
  },
  defaultInput: { prices: [8, 4, 6, 2, 3] },
  inputFields: [
    {
      name: 'prices',
      label: 'Prices',
      type: 'array',
      defaultValue: [8, 4, 6, 2, 3],
      placeholder: 'e.g. 8,4,6,2,3',
      helperText: 'Comma-separated item prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = (input.prices as number[]).slice();
    const n = prices.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const result = [...prices];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(${prices[idx]})`),
      inputChars: prices.map(p => String(p)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `prices=[${prices.join(', ')}]. Use monotonic stack to find next smaller-or-equal for each element.`,
      variables: { prices: [...prices], result: [...result] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 4,
        explanation: `i=${i}, price=${prices[i]}. Check stack for items that can get discount.`,
        variables: { i, price: prices[i], stack: [...stack] },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && prices[stack[stack.length - 1]] >= prices[i]) {
        const idx = stack.pop()!;
        const discount = prices[i];
        result[idx] = prices[idx] - discount;

        steps.push({
          line: 5,
          explanation: `prices[${idx}]=${prices[idx]} >= prices[${i}]=${prices[i]}. Apply discount: result[${idx}]=${prices[idx]}-${discount}=${result[idx]}.`,
          variables: { idx, originalPrice: prices[idx], discount, finalPrice: result[idx], result: [...result] },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(i);
      steps.push({
        line: 7,
        explanation: `Push index ${i} onto stack.`,
        variables: { stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. Final prices: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default finalPricesWithSpecialDiscountII;
