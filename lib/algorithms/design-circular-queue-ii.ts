import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designCircularQueueIi: AlgorithmDefinition = {
  id: 'design-circular-queue-ii',
  title: 'Design Circular Queue',
  leetcodeNumber: 622,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a circular queue data structure. A circular queue is a linear data structure where the operations are performed based on FIFO principle and the last position is connected back to the first position. Implement enQueue, deQueue, Front, Rear, isEmpty, and isFull.',
  tags: ['Queue', 'Design', 'Array'],
  code: {
    pseudocode: `class MyCircularQueue:
  function init(k):
    this.queue = array of size k
    this.head = 0; this.tail = -1; this.size = 0; this.cap = k
  function enQueue(value):
    if isFull(): return false
    tail = (tail + 1) mod cap
    queue[tail] = value; size++; return true
  function deQueue():
    if isEmpty(): return false
    head = (head + 1) mod cap; size--; return true
  function Front():
    if isEmpty(): return -1
    return queue[head]
  function Rear():
    if isEmpty(): return -1
    return queue[tail]`,
    python: `class MyCircularQueue:
    def __init__(self, k: int):
        self.queue = [0] * k
        self.head = 0
        self.tail = -1
        self.size = 0
        self.cap = k

    def enQueue(self, value: int) -> bool:
        if self.isFull(): return False
        self.tail = (self.tail + 1) % self.cap
        self.queue[self.tail] = value
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty(): return False
        self.head = (self.head + 1) % self.cap
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.queue[self.head]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.queue[self.tail]

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.cap`,
    javascript: `class MyCircularQueue {
  constructor(k) {
    this.queue = new Array(k).fill(0);
    this.head = 0; this.tail = -1;
    this.size = 0; this.cap = k;
  }
  enQueue(value) {
    if (this.isFull()) return false;
    this.tail = (this.tail + 1) % this.cap;
    this.queue[this.tail] = value;
    this.size++; return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.cap;
    this.size--; return true;
  }
  Front() { return this.isEmpty() ? -1 : this.queue[this.head]; }
  Rear() { return this.isEmpty() ? -1 : this.queue[this.tail]; }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.cap; }
}`,
    java: `class MyCircularQueue {
    private int[] queue;
    private int head, tail, size, cap;
    public MyCircularQueue(int k) {
        queue = new int[k]; head = 0; tail = -1; size = 0; cap = k;
    }
    public boolean enQueue(int value) {
        if (isFull()) return false;
        tail = (tail + 1) % cap; queue[tail] = value; size++; return true;
    }
    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % cap; size--; return true;
    }
    public int Front() { return isEmpty() ? -1 : queue[head]; }
    public int Rear() { return isEmpty() ? -1 : queue[tail]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == cap; }
}`,
  },
  defaultInput: {
    capacity: 3,
    operations: [['enQueue', 1], ['enQueue', 2], ['enQueue', 3], ['enQueue', 4], ['Rear'], ['isFull'], ['deQueue'], ['enQueue', 4], ['Rear']],
  },
  inputFields: [
    {
      name: 'capacity',
      label: 'Queue Capacity',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'enQueue 1, enQueue 2, enQueue 3, enQueue 4, Rear, isFull, deQueue, enQueue 4, Rear',
      placeholder: 'enQueue 1, deQueue, Front',
      helperText: 'Comma-separated: enQueue v, deQueue, Front, Rear, isEmpty, isFull',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cap = (input.capacity as number) || 3;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return parts.length > 1 ? [parts[0], Number(parts[1])] : [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const queue = new Array(cap).fill(0);
    let head = 0, tail = -1, size = 0;

    const isEmpty = () => size === 0;
    const isFull = () => size === cap;

    function makeViz(label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < cap; i++) {
        const isHead = !isEmpty() && i === head;
        const isTail = !isEmpty() && i === tail;
        highlights[i] = isHead && isTail ? 'active' : isHead ? 'found' : isTail ? 'pointer' : size > 0 ? 'current' : 'default';
        labels[i] = isHead && isTail ? 'H/T' : isHead ? 'Head' : isTail ? 'Tail' : '';
      }
      return {
        type: 'array',
        array: [...queue],
        highlights,
        labels,
        auxData: {
          label: 'Circular Queue',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${size}/${cap}` },
            { key: 'Head', value: `${head}` },
            { key: 'Tail', value: `${tail}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize Circular Queue with capacity ${cap}.`,
      variables: { cap, head, tail, size },
      visualization: makeViz('Init'),
    });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'enQueue') {
        const value = Number(op[1]);
        if (isFull()) {
          steps.push({
            line: 6,
            explanation: `enQueue(${value}): Queue is full (${size}/${cap}). Return false.`,
            variables: { op: `enQueue(${value})`, result: false },
            visualization: makeViz(`enQueue(${value}) -> false`),
          });
        } else {
          tail = (tail + 1) % cap;
          queue[tail] = value;
          size++;
          steps.push({
            line: 8,
            explanation: `enQueue(${value}): Insert ${value} at tail index ${tail}. Size: ${size}/${cap}.`,
            variables: { op: `enQueue(${value})`, tail, size },
            visualization: makeViz(`enQueue(${value}) -> true`),
          });
        }
      } else if (opType === 'deQueue') {
        if (isEmpty()) {
          steps.push({
            line: 11,
            explanation: 'deQueue(): Queue is empty. Return false.',
            variables: { op: 'deQueue()', result: false },
            visualization: makeViz('deQueue() -> false'),
          });
        } else {
          head = (head + 1) % cap;
          size--;
          steps.push({
            line: 13,
            explanation: `deQueue(): Remove front element. Head moves to ${head}. Size: ${size}/${cap}.`,
            variables: { op: 'deQueue()', head, size },
            visualization: makeViz('deQueue() -> true'),
          });
        }
      } else if (opType === 'Front') {
        const result = isEmpty() ? -1 : queue[head];
        steps.push({
          line: 15,
          explanation: isEmpty() ? 'Front(): Queue empty, return -1.' : `Front(): Return front element ${result} at index ${head}.`,
          variables: { op: 'Front()', result },
          visualization: makeViz(`Front() -> ${result}`),
        });
      } else if (opType === 'Rear') {
        const result = isEmpty() ? -1 : queue[tail];
        steps.push({
          line: 16,
          explanation: isEmpty() ? 'Rear(): Queue empty, return -1.' : `Rear(): Return rear element ${result} at index ${tail}.`,
          variables: { op: 'Rear()', result },
          visualization: makeViz(`Rear() -> ${result}`),
        });
      } else if (opType === 'isEmpty') {
        steps.push({
          line: 17,
          explanation: `isEmpty(): Queue is ${isEmpty() ? 'empty' : 'not empty'}. Return ${isEmpty()}.`,
          variables: { op: 'isEmpty()', result: isEmpty() },
          visualization: makeViz(`isEmpty() -> ${isEmpty()}`),
        });
      } else if (opType === 'isFull') {
        steps.push({
          line: 18,
          explanation: `isFull(): Queue is ${isFull() ? 'full' : 'not full'}. Return ${isFull()}.`,
          variables: { op: 'isFull()', result: isFull() },
          visualization: makeViz(`isFull() -> ${isFull()}`),
        });
      }
    }

    steps.push({
      line: 19,
      explanation: `All operations complete. Queue state: size=${size}/${cap}.`,
      variables: { size, cap, head, tail },
      visualization: makeViz('Complete'),
    });

    return steps;
  },
};

export default designCircularQueueIi;
