import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const implementQueueUsingStacks: AlgorithmDefinition = {
  id: 'implement-queue-using-stacks',
  title: 'Implement Queue using Stacks',
  leetcodeNumber: 232,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Implement a FIFO queue using only two LIFO stacks. The push stack receives new elements, and when we need to pop/peek, we transfer elements to the pop stack (reversing order), giving us FIFO behavior.',
  tags: ['Stack', 'Queue', 'Design'],
  code: {
    pseudocode: `class MyQueue:
  pushStack = []
  popStack = []
  function push(x):
    pushStack.push(x)
  function pop():
    if popStack is empty:
      while pushStack not empty:
        popStack.push(pushStack.pop())
    return popStack.pop()
  function peek():
    if popStack is empty:
      while pushStack not empty:
        popStack.push(pushStack.pop())
    return popStack.top
  function empty():
    return pushStack and popStack both empty`,
    python: `class MyQueue:
    def __init__(self):
        self.push_stack = []
        self.pop_stack = []

    def push(self, x):
        self.push_stack.append(x)

    def pop(self):
        if not self.pop_stack:
            while self.push_stack:
                self.pop_stack.append(self.push_stack.pop())
        return self.pop_stack.pop()

    def peek(self):
        if not self.pop_stack:
            while self.push_stack:
                self.pop_stack.append(self.push_stack.pop())
        return self.pop_stack[-1]

    def empty(self):
        return not self.push_stack and not self.pop_stack`,
    javascript: `class MyQueue {
  constructor() {
    this.pushStack = [];
    this.popStack = [];
  }
  push(x) {
    this.pushStack.push(x);
  }
  pop() {
    if (!this.popStack.length) {
      while (this.pushStack.length) {
        this.popStack.push(this.pushStack.pop());
      }
    }
    return this.popStack.pop();
  }
  peek() {
    if (!this.popStack.length) {
      while (this.pushStack.length) {
        this.popStack.push(this.pushStack.pop());
      }
    }
    return this.popStack[this.popStack.length - 1];
  }
  empty() {
    return !this.pushStack.length && !this.popStack.length;
  }
}`,
    java: `class MyQueue {
    Deque<Integer> pushStack = new ArrayDeque<>();
    Deque<Integer> popStack = new ArrayDeque<>();

    public void push(int x) {
        pushStack.push(x);
    }
    public int pop() {
        if (popStack.isEmpty()) {
            while (!pushStack.isEmpty())
                popStack.push(pushStack.pop());
        }
        return popStack.pop();
    }
    public int peek() {
        if (popStack.isEmpty()) {
            while (!pushStack.isEmpty())
                popStack.push(pushStack.pop());
        }
        return popStack.peek();
    }
    public boolean empty() {
        return pushStack.isEmpty() && popStack.isEmpty();
    }
}`,
  },
  defaultInput: {
    operations: 'push 1, push 2, peek, pop, empty',
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'push 1, push 2, peek, pop, empty',
      placeholder: 'push 1, push 2, peek, pop, empty',
      helperText: 'Comma-separated: push X, pop, peek, empty',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(op => op.trim());
    const steps: AlgorithmStep[] = [];
    const pushStack: number[] = [];
    const popStack: number[] = [];

    function makeViz(action: string, result?: string): ArrayVisualization {
      // Show both stacks: pushStack (bottom to top) | popStack (bottom to top)
      const combined = [...pushStack, ...popStack.slice().reverse()];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < pushStack.length; i++) {
        highlights[i] = 'active';
        if (i === 0) labels[i] = 'push-bottom';
        if (i === pushStack.length - 1) labels[i] = 'push-top';
      }

      for (let i = 0; i < popStack.length; i++) {
        const idx = pushStack.length + (popStack.length - 1 - i);
        highlights[idx] = 'pointer';
        if (i === popStack.length - 1) labels[idx] = 'pop-top';
        if (i === 0) labels[idx] = 'pop-bottom';
      }

      return {
        type: 'array',
        array: combined,
        highlights,
        labels,
        auxData: {
          label: 'Queue State',
          entries: [
            { key: 'Operation', value: action },
            { key: 'Push Stack', value: pushStack.length > 0 ? `[${pushStack.join(', ')}]` : '[]' },
            { key: 'Pop Stack', value: popStack.length > 0 ? `[${popStack.join(', ')}]` : '[]' },
            ...(result !== undefined ? [{ key: 'Result', value: result }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize two empty stacks: pushStack for enqueue, popStack for dequeue.',
      variables: { pushStack: [], popStack: [] },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
        auxData: {
          label: 'Queue State',
          entries: [
            { key: 'Push Stack', value: '[]' },
            { key: 'Pop Stack', value: '[]' },
          ],
        },
      },
    });

    for (const op of operations) {
      const parts = op.split(/\s+/);
      const cmd = parts[0].toLowerCase();

      if (cmd === 'push') {
        const val = Number(parts[1]);
        pushStack.push(val);
        steps.push({
          line: 5,
          explanation: `push(${val}): Push ${val} onto pushStack.`,
          variables: { operation: `push(${val})`, pushStack: [...pushStack], popStack: [...popStack] },
          visualization: makeViz(`push(${val})`),
        });
      } else if (cmd === 'pop') {
        if (popStack.length === 0) {
          steps.push({
            line: 8,
            explanation: 'pop(): popStack is empty. Transfer all elements from pushStack to popStack.',
            variables: { pushStack: [...pushStack], popStack: [...popStack] },
            visualization: makeViz('pop - transferring'),
          });

          while (pushStack.length > 0) {
            const val = pushStack.pop()!;
            popStack.push(val);
          }

          steps.push({
            line: 9,
            explanation: `Transfer complete. popStack is now [${popStack.join(', ')}] (top = ${popStack[popStack.length - 1]}).`,
            variables: { pushStack: [...pushStack], popStack: [...popStack] },
            visualization: makeViz('pop - transferred'),
          });
        }

        const val = popStack.pop()!;
        steps.push({
          line: 10,
          explanation: `pop(): Pop ${val} from popStack. This was the front of the queue.`,
          variables: { result: val, pushStack: [...pushStack], popStack: [...popStack] },
          visualization: makeViz(`pop() -> ${val}`, String(val)),
        });
      } else if (cmd === 'peek') {
        if (popStack.length === 0) {
          steps.push({
            line: 12,
            explanation: 'peek(): popStack is empty. Transfer all from pushStack.',
            variables: { pushStack: [...pushStack], popStack: [...popStack] },
            visualization: makeViz('peek - transferring'),
          });

          while (pushStack.length > 0) {
            const val = pushStack.pop()!;
            popStack.push(val);
          }
        }

        const val = popStack[popStack.length - 1];
        steps.push({
          line: 15,
          explanation: `peek(): Front of queue is ${val} (top of popStack).`,
          variables: { result: val, pushStack: [...pushStack], popStack: [...popStack] },
          visualization: makeViz(`peek() -> ${val}`, String(val)),
        });
      } else if (cmd === 'empty') {
        const isEmpty = pushStack.length === 0 && popStack.length === 0;
        steps.push({
          line: 16,
          explanation: `empty(): ${isEmpty ? 'Both stacks empty. Queue is empty.' : 'At least one stack has elements. Queue is not empty.'}`,
          variables: { result: isEmpty, pushStack: [...pushStack], popStack: [...popStack] },
          visualization: makeViz(`empty() -> ${isEmpty}`, String(isEmpty)),
        });
      }
    }

    steps.push({
      line: 17,
      explanation: 'All operations complete.',
      variables: { pushStack: [...pushStack], popStack: [...popStack] },
      visualization: makeViz('Complete'),
    });

    return steps;
  },
};

export default implementQueueUsingStacks;
