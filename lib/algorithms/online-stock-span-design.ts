import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const onlineStockSpanDesign: AlgorithmDefinition = {
  id: 'online-stock-span-design',
  title: 'Online Stock Span',
  leetcodeNumber: 901,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design an algorithm to collect daily price quotes and return the span (number of consecutive days the price was <= today, including today). Use a monotonic decreasing stack of (price, span) pairs for O(1) amortized time.',
  tags: ['Hash Map', 'Design', 'Stack', 'Monotonic Stack'],
  code: {
    pseudocode: `class StockSpanner:
  function init():
    stack = []  // (price, span) pairs
  function next(price):
    span = 1
    while stack not empty and stack.top.price <= price:
      span += stack.pop().span
    stack.push((price, span))
    return span`,
    python: `class StockSpanner:
    def __init__(self):
        self.stack = []  # (price, span)

    def next(self, price: int) -> int:
        span = 1
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        self.stack.append((price, span))
        return span`,
    javascript: `class StockSpanner {
  constructor() { this.stack = []; }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length-1][0] <= price)
      span += this.stack.pop()[1];
    this.stack.push([price, span]);
    return span;
  }
}`,
    java: `class StockSpanner {
    private Deque<int[]> stack = new ArrayDeque<>();
    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price)
            span += stack.pop()[1];
        stack.push(new int[]{price, span});
        return span;
    }
}`,
  },
  defaultInput: {
    prices: [100, 80, 60, 70, 60, 75, 85],
  },
  inputFields: [
    {
      name: 'prices',
      label: 'Daily Prices',
      type: 'array',
      defaultValue: [100, 80, 60, 70, 60, 75, 85],
      placeholder: '100, 80, 60, 70',
      helperText: 'Sequence of daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = input.prices as number[];
    const steps: AlgorithmStep[] = [];
    const stack: [number, number][] = [];
    const spans: number[] = [];

    function makeViz(dayIdx: number, label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      prices.forEach((_, i) => {
        highlights[i] = i === dayIdx ? 'active' : i < dayIdx ? (spans[i] !== undefined ? 'found' : 'visited') : 'default';
        lbls[i] = spans[i] !== undefined ? `span=${spans[i]}` : '';
      });
      return {
        type: 'array',
        array: prices.map((p, i) => i <= dayIdx ? p : 0),
        highlights,
        labels: lbls,
        auxData: {
          label: 'Stock Span',
          entries: [
            { key: 'Action', value: label },
            { key: 'Day', value: `${dayIdx + 1}` },
            { key: 'Stack', value: stack.map(([p, s]) => `(${p},${s})`).join(', ') || 'empty' },
            { key: 'Spans', value: spans.join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize StockSpanner with empty stack.', variables: {}, visualization: makeViz(-1, 'Init') });

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      let span = 1;

      while (stack.length > 0 && stack[stack.length - 1][0] <= price) {
        span += stack.pop()![1];
      }

      stack.push([price, span]);
      spans.push(span);

      steps.push({
        line: 5,
        explanation: `next(${price}): Price ${price} on day ${i + 1}. Pop smaller/equal prices from stack. Span = ${span}.`,
        variables: { price, span, day: i + 1, stackSize: stack.length },
        visualization: makeViz(i, `next(${price}) -> span=${span}`),
      });
    }

    steps.push({ line: 8, explanation: `All prices processed. Final spans: [${spans.join(', ')}].`, variables: { spans: [...spans] }, visualization: makeViz(prices.length - 1, 'Complete') });

    return steps;
  },
};

export default onlineStockSpanDesign;
