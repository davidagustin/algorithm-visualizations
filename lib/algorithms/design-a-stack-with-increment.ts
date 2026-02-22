import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designAStackWithIncrement: AlgorithmDefinition = {
  id: 'design-a-stack-with-increment',
  title: 'Design a Stack With Increment Operation',
  leetcodeNumber: 1381,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a stack that supports push, pop, and increment operations. The increment(k, val) operation increments the bottom k elements by val. Use a lazy increment array for O(1) increment.',
  tags: ['Hash Map', 'Design', 'Stack', 'Array'],
  code: {
    pseudocode: `class CustomStack:
  function init(maxSize):
    stack = []; lazy = []; cap = maxSize
  function push(x):
    if size < cap: stack.append(x); lazy.append(0)
  function pop():
    if empty: return -1
    lazy[size-2] += lazy[size-1]
    return stack.pop() + lazy.pop()
  function increment(k, val):
    if stack not empty:
      lazy[min(k,size)-1] += val`,
    python: `class CustomStack:
    def __init__(self, maxSize: int):
        self.stack = []
        self.lazy = []
        self.cap = maxSize

    def push(self, x: int) -> None:
        if len(self.stack) < self.cap:
            self.stack.append(x)
            self.lazy.append(0)

    def pop(self) -> int:
        if not self.stack: return -1
        if len(self.lazy) > 1:
            self.lazy[-2] += self.lazy[-1]
        return self.stack.pop() + self.lazy.pop()

    def increment(self, k: int, val: int) -> None:
        if self.stack:
            self.lazy[min(k, len(self.stack)) - 1] += val`,
    javascript: `class CustomStack {
  constructor(maxSize) {
    this.stack = []; this.lazy = []; this.cap = maxSize;
  }
  push(x) {
    if (this.stack.length < this.cap) {
      this.stack.push(x); this.lazy.push(0);
    }
  }
  pop() {
    if (!this.stack.length) return -1;
    if (this.lazy.length > 1) this.lazy[this.lazy.length-2] += this.lazy[this.lazy.length-1];
    return this.stack.pop() + this.lazy.pop();
  }
  increment(k, val) {
    if (this.stack.length) this.lazy[Math.min(k,this.stack.length)-1] += val;
  }
}`,
    java: `class CustomStack {
    private int[] stack, lazy;
    private int size, cap;
    public CustomStack(int maxSize) { cap = maxSize; stack = new int[cap]; lazy = new int[cap]; }
    public void push(int x) { if (size < cap) { stack[size] = x; lazy[size++] = 0; } }
    public int pop() {
        if (size == 0) return -1;
        if (size > 1) lazy[size-2] += lazy[size-1];
        return stack[--size] + lazy[size];
    }
    public void increment(int k, int val) { if (size > 0) lazy[Math.min(k,size)-1] += val; }
}`,
  },
  defaultInput: {
    maxSize: 3,
    operations: [['push', 1], ['push', 2], ['push', 3], ['push', 4], ['increment', 5, 100], ['increment', 2, 100], ['pop'], ['pop'], ['pop'], ['pop']],
  },
  inputFields: [
    { name: 'maxSize', label: 'Max Stack Size', type: 'number', defaultValue: 3 },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'push 1, push 2, push 3, push 4, increment 5 100, increment 2 100, pop, pop, pop, pop',
      placeholder: 'push 1, push 2, increment 2 10, pop',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cap = (input.maxSize as number) || 3;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts.length === 3) return [parts[0], Number(parts[1]), Number(parts[2])];
        if (parts.length === 2) return [parts[0], Number(parts[1])];
        return [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const lazy: number[] = [];

    function makeViz(label: string): ArrayVisualization {
      const effective = stack.map((v, i) => v + (lazy[i] ?? 0));
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      stack.forEach((_, i) => {
        highlights[i] = i === stack.length - 1 ? 'active' : 'default';
        lbls[i] = `lazy+${lazy[i]}`;
      });
      return {
        type: 'array',
        array: effective,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Stack with Increment',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${stack.length}/${cap}` },
            { key: 'Stack', value: stack.join(', ') || 'empty' },
            { key: 'Lazy', value: lazy.join(', ') || 'empty' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize CustomStack with maxSize=${cap}.`, variables: { cap }, visualization: makeViz('Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'push') {
        const x = Number(op[1]);
        if (stack.length < cap) {
          stack.push(x); lazy.push(0);
          steps.push({ line: 4, explanation: `push(${x}): Push ${x} onto stack. Size: ${stack.length}/${cap}.`, variables: { x, size: stack.length }, visualization: makeViz(`push(${x})`) });
        } else {
          steps.push({ line: 4, explanation: `push(${x}): Stack full (${cap}/${cap}). Ignored.`, variables: { x }, visualization: makeViz(`push(${x}) -> full`) });
        }
      } else if (opType === 'pop') {
        if (stack.length === 0) {
          steps.push({ line: 7, explanation: 'pop(): Stack empty. Return -1.', variables: { result: -1 }, visualization: makeViz('pop() -> -1') });
        } else {
          if (lazy.length > 1) lazy[lazy.length - 2] += lazy[lazy.length - 1];
          const result = stack.pop()! + lazy.pop()!;
          steps.push({ line: 9, explanation: `pop(): Remove top element. Return ${result}. Size: ${stack.length}/${cap}.`, variables: { result, size: stack.length }, visualization: makeViz(`pop() -> ${result}`) });
        }
      } else if (opType === 'increment') {
        const k = Number(op[1]);
        const val = Number(op[2]);
        if (stack.length > 0) {
          const idx = Math.min(k, stack.length) - 1;
          lazy[idx] += val;
          steps.push({ line: 12, explanation: `increment(${k}, ${val}): Add ${val} to lazy[${idx}] (affects bottom ${Math.min(k, stack.length)} elements).`, variables: { k, val, lazyIdx: idx }, visualization: makeViz(`increment(${k},${val})`) });
        } else {
          steps.push({ line: 12, explanation: `increment(${k}, ${val}): Stack empty, no-op.`, variables: { k, val }, visualization: makeViz(`increment(${k},${val}) -> skip`) });
        }
      }
    }

    steps.push({ line: 13, explanation: 'All operations complete.', variables: { size: stack.length }, visualization: makeViz('Complete') });

    return steps;
  },
};

export default designAStackWithIncrement;
