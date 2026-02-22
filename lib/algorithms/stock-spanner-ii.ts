import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const stockSpannerII: AlgorithmDefinition = {
  id: 'stock-spanner-ii',
  title: 'Stock Spanner II',
  leetcodeNumber: 901,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Design a StockSpanner class that collects daily price quotes and returns the span of the stock price for the current day. The span is the maximum number of consecutive days (starting from today and going backwards) for which the price was <= today\'s price. Uses a monotonic decreasing stack of (price, span) pairs.',
  tags: ['Stack', 'Monotonic Stack', 'Design', 'Online Algorithm'],
  code: {
    pseudocode: `class StockSpanner:
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
  constructor() {
    this.stack = []; // [price, span]
  }
  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length-1][0] <= price) {
      span += this.stack.pop()[1];
    }
    this.stack.push([price, span]);
    return span;
  }
}`,
    java: `class StockSpanner {
    Deque<int[]> stack = new ArrayDeque<>();
    public int next(int price) {
        int span = 1;
        while (!stack.isEmpty() && stack.peek()[0] <= price)
            span += stack.pop()[1];
        stack.push(new int[]{price, span});
        return span;
    }
}`,
  },
  defaultInput: { prices: [100, 80, 60, 70, 60, 75, 85] },
  inputFields: [
    {
      name: 'prices',
      label: 'Daily Prices',
      type: 'array',
      defaultValue: [100, 80, 60, 70, 60, 75, 85],
      placeholder: 'e.g. 100,80,60,70,60,75,85',
      helperText: 'Comma-separated stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = (input.prices as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: [number, number][] = []; // [price, span]
    const spans: number[] = [];

    const makeViz = (day: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(([p, s]) => `(${p},sp=${s})`),
      inputChars: prices.map(p => String(p)),
      currentIndex: day,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize StockSpanner with empty stack. Process ${prices.length} prices.`,
      variables: { stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let day = 0; day < prices.length; day++) {
      const price = prices[day];
      let span = 1;

      steps.push({
        line: 4,
        explanation: `Day ${day + 1}: price=${price}. Start with span=1.`,
        variables: { day: day + 1, price, span },
        visualization: makeViz(day, 'idle'),
      });

      while (stack.length > 0 && stack[stack.length - 1][0] <= price) {
        const [p, s] = stack.pop()!;
        span += s;
        steps.push({
          line: 6,
          explanation: `Stack top price=${p} <= ${price}. Pop and add its span ${s}. Total span now ${span}.`,
          variables: { poppedPrice: p, poppedSpan: s, span },
          visualization: makeViz(day, 'pop'),
        });
      }

      stack.push([price, span]);
      spans.push(span);

      steps.push({
        line: 7,
        explanation: `Push (${price}, span=${span}). Return span=${span}. Spans so far: [${spans.join(', ')}].`,
        variables: { price, span, spans: [...spans] },
        visualization: makeViz(day, 'push'),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. All spans: [${spans.join(', ')}].`,
      variables: { spans: [...spans] },
      visualization: makeViz(prices.length - 1, 'match'),
    });

    return steps;
  },
};

export default stockSpannerII;
