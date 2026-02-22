import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const onlineStockSpan: AlgorithmDefinition = {
  id: 'online-stock-span',
  title: 'Online Stock Span',
  leetcodeNumber: 901,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Design a class that collects daily stock prices and returns the span — the number of consecutive days (including today) where the price was less than or equal to today\'s price. Use a monotonic stack storing (price, span) pairs.',
  tags: ['Stack', 'Design', 'Monotonic Stack'],
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
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {
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
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`,
  },
  defaultInput: { prices: [100, 80, 60, 70, 60, 75, 85] },
  inputFields: [
    {
      name: 'prices',
      label: 'Stock Prices',
      type: 'array',
      defaultValue: [100, 80, 60, 70, 60, 75, 85],
      placeholder: 'e.g. 100,80,60,70,60,75,85',
      helperText: 'Comma-separated daily stock prices',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prices = (input.prices as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: [number, number][] = []; // [price, span]
    const spans: number[] = [];

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < prices.length; i++) {
        if (i < spans.length) {
          highlights[i] = 'found';
          labels[i] = `span=${spans[i]}`;
        } else if (i === activeIdx) {
          highlights[i] = 'current';
          labels[i] = 'curr';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: prices,
        highlights,
        labels,
        auxData: {
          label: 'Stack (price, span)',
          entries: [
            {
              key: 'Stack',
              value: stack.length > 0 ? stack.map(([p, s]) => `(${p},${s})`).join(' ') : 'empty',
            },
            { key: 'Spans so far', value: spans.length > 0 ? `[${spans.join(', ')}]` : '[]' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty stack storing (price, span) pairs. The span accumulates consecutive non-increasing days.',
      variables: { prices, stack: [] },
      visualization: makeViz(null),
    });

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      let span = 1;

      steps.push({
        line: 3,
        explanation: `Day ${i}: price=${price}. Start span=1. Check stack for consecutive days with price <= ${price}.`,
        variables: { i, price, span, stack: stack.map(([p, s]) => [p, s]) },
        visualization: makeViz(i),
      });

      while (stack.length > 0 && stack[stack.length - 1][0] <= price) {
        const [poppedPrice, poppedSpan] = stack.pop()!;
        span += poppedSpan;
        steps.push({
          line: 5,
          explanation: `Pop (${poppedPrice}, ${poppedSpan}) — price ${poppedPrice} <= ${price}. Add span ${poppedSpan} to current. New span = ${span}.`,
          variables: { poppedPrice, poppedSpan, span, stack: stack.map(([p, s]) => [p, s]) },
          visualization: makeViz(i),
        });
      }

      stack.push([price, span]);
      spans.push(span);
      steps.push({
        line: 6,
        explanation: `Push (${price}, ${span}) onto stack. Span for day ${i} = ${span}.`,
        variables: { pushed: [price, span], spans: [...spans] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 7,
      explanation: `All prices processed. Spans: [${spans.join(', ')}].`,
      variables: { spans: [...spans] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < prices.length; i++) {
          h[i] = 'found';
          l[i] = `s=${spans[i]}`;
        }
        return {
          type: 'array' as const,
          array: prices,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Spans',
            entries: [{ key: 'Spans', value: `[${spans.join(', ')}]` }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default onlineStockSpan;
