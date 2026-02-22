import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minStack: AlgorithmDefinition = {
  id: 'min-stack',
  title: 'Min Stack',
  leetcodeNumber: 155,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1). The key insight is to maintain a parallel "min stack" that tracks the current minimum at each level of the main stack.',
  tags: ['Stack', 'Design'],
  code: {
    pseudocode: `class MinStack:
  stack = []
  minStack = []
  function push(val):
    stack.push(val)
    minVal = min(val, minStack.top if minStack else val)
    minStack.push(minVal)
  function pop():
    stack.pop()
    minStack.pop()
  function top():
    return stack.top
  function getMin():
    return minStack.top`,
    python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        min_val = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(min_val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
    javascript: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    const minVal = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(minVal);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
    java: `class MinStack {
    Deque<Integer> stack = new ArrayDeque<>();
    Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        int minVal = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(minVal);
    }
    public void pop() {
        stack.pop();
        minStack.pop();
    }
    public int top() {
        return stack.peek();
    }
    public int getMin() {
        return minStack.peek();
    }
}`,
  },
  defaultInput: {
    operations: 'push -2, push 0, push -3, getMin, pop, top, getMin',
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'push -2, push 0, push -3, getMin, pop, top, getMin',
      placeholder: 'push -2, push 0, push -3, getMin, pop, top, getMin',
      helperText: 'Comma-separated: push X, pop, top, getMin',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(op => op.trim());
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const minStack: number[] = [];

    function makeViz(action: string, result?: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < stack.length; i++) {
        highlights[i] = 'active';
        if (i === stack.length - 1) labels[i] = 'top';
      }
      return {
        type: 'array',
        array: [...stack],
        highlights,
        labels,
        auxData: {
          label: 'Min Stack State',
          entries: [
            { key: 'Operation', value: action },
            { key: 'Main Stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : '[]' },
            { key: 'Min Stack', value: minStack.length > 0 ? `[${minStack.join(', ')}]` : '[]' },
            { key: 'Current Min', value: minStack.length > 0 ? String(minStack[minStack.length - 1]) : 'N/A' },
            ...(result !== undefined ? [{ key: 'Result', value: result }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty main stack and min stack. The min stack tracks the running minimum at each push level.',
      variables: { stack: [], minStack: [] },
      visualization: makeViz('init'),
    });

    for (const op of operations) {
      const parts = op.split(/\s+/);
      const cmd = parts[0].toLowerCase();

      if (cmd === 'push') {
        const val = Number(parts[1]);
        const minVal = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);
        stack.push(val);
        minStack.push(minVal);
        steps.push({
          line: 4,
          explanation: `push(${val}): Push ${val} onto main stack. Current min is ${minVal}, push that onto min stack.`,
          variables: { val, minVal, stack: [...stack], minStack: [...minStack] },
          visualization: makeViz(`push(${val})`),
        });
      } else if (cmd === 'pop') {
        const popped = stack.pop();
        minStack.pop();
        steps.push({
          line: 8,
          explanation: `pop(): Remove ${popped} from main stack and corresponding min from min stack.`,
          variables: { popped, stack: [...stack], minStack: [...minStack] },
          visualization: makeViz('pop()'),
        });
      } else if (cmd === 'top') {
        const topVal = stack[stack.length - 1];
        steps.push({
          line: 10,
          explanation: `top(): Return top of main stack = ${topVal}.`,
          variables: { result: topVal, stack: [...stack] },
          visualization: makeViz('top()', String(topVal)),
        });
      } else if (cmd === 'getmin') {
        const minVal = minStack[minStack.length - 1];
        steps.push({
          line: 12,
          explanation: `getMin(): Return top of min stack = ${minVal}. This is the current minimum in O(1).`,
          variables: { result: minVal, minStack: [...minStack] },
          visualization: makeViz('getMin()', String(minVal)),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: 'All operations complete. Both stacks stay synchronized — every push adds to both, every pop removes from both.',
      variables: { stack: [...stack], minStack: [...minStack] },
      visualization: makeViz('done'),
    });

    return steps;
  },
};

export default minStack;
