import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designCircularQueue: AlgorithmDefinition = {
  id: 'design-circular-queue',
  title: 'Design Circular Queue',
  leetcodeNumber: 622,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Implement a circular queue with fixed capacity using an array. Track head and tail pointers with modular arithmetic. enQueue adds at tail, deQueue removes from head. The circular design reuses freed space efficiently.',
  tags: ['Stack', 'Queue', 'Design', 'Array'],
  code: {
    pseudocode: `class MyCircularQueue:
  queue = array of size k
  head = 0
  tail = -1
  size = 0
  capacity = k

  function enQueue(val):
    if size == capacity: return false
    tail = (tail + 1) % capacity
    queue[tail] = val
    size += 1
    return true

  function deQueue():
    if size == 0: return false
    head = (head + 1) % capacity
    size -= 1
    return true

  function Front(): return size == 0 ? -1 : queue[head]
  function Rear(): return size == 0 ? -1 : queue[tail]
  function isEmpty(): return size == 0
  function isFull(): return size == capacity`,
    python: `class MyCircularQueue:
    def __init__(self, k: int):
        self.queue = [0] * k
        self.head = 0
        self.tail = -1
        self.size = 0
        self.capacity = k

    def enQueue(self, value: int) -> bool:
        if self.size == self.capacity:
            return False
        self.tail = (self.tail + 1) % self.capacity
        self.queue[self.tail] = value
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.size == 0:
            return False
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.size == 0 else self.queue[self.head]

    def Rear(self) -> int:
        return -1 if self.size == 0 else self.queue[self.tail]`,
    javascript: `class MyCircularQueue {
  constructor(k) {
    this.queue = new Array(k).fill(0);
    this.head = 0;
    this.tail = -1;
    this.size = 0;
    this.capacity = k;
  }
  enQueue(value) {
    if (this.size === this.capacity) return false;
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = value;
    this.size++;
    return true;
  }
  deQueue() {
    if (this.size === 0) return false;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return true;
  }
  Front() { return this.size === 0 ? -1 : this.queue[this.head]; }
  Rear() { return this.size === 0 ? -1 : this.queue[this.tail]; }
}`,
    java: `class MyCircularQueue {
    int[] queue;
    int head = 0, tail = -1, size = 0, capacity;
    public MyCircularQueue(int k) {
        queue = new int[k];
        capacity = k;
    }
    public boolean enQueue(int value) {
        if (size == capacity) return false;
        tail = (tail + 1) % capacity;
        queue[tail] = value;
        size++;
        return true;
    }
    public boolean deQueue() {
        if (size == 0) return false;
        head = (head + 1) % capacity;
        size--;
        return true;
    }
    public int Front() { return size == 0 ? -1 : queue[head]; }
    public int Rear() { return size == 0 ? -1 : queue[tail]; }
}`,
  },
  defaultInput: {
    k: 3,
    operations: 'enQueue 1, enQueue 2, enQueue 3, enQueue 4, deQueue, enQueue 4, Rear, Front',
  },
  inputFields: [
    {
      name: 'k',
      label: 'Capacity',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Fixed capacity of the circular queue',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'enQueue 1, enQueue 2, enQueue 3, enQueue 4, deQueue, enQueue 4, Rear, Front',
      placeholder: 'enQueue 1, deQueue, Front, Rear',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(o => o.trim());
    const steps: AlgorithmStep[] = [];
    const queue: (number | null)[] = new Array(k).fill(null);
    let head = 0;
    let tail = -1;
    let size = 0;

    function makeViz(action: string, result?: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < k; i++) {
        if (queue[i] !== null) {
          highlights[i] = 'active';
        } else {
          highlights[i] = 'default';
        }
        if (i === head && size > 0) labels[i] = (labels[i] ? labels[i] + '/' : '') + 'H';
        if (i === tail && size > 0) labels[i] = (labels[i] ? labels[i] + '/' : '') + 'T';
      }

      return {
        type: 'array',
        array: queue.map(v => v ?? 0),
        highlights,
        labels,
        auxData: {
          label: 'Circular Queue State',
          entries: [
            { key: 'Operation', value: action },
            { key: 'Queue', value: `[${queue.map(v => v ?? '_').join(', ')}]` },
            { key: 'Head', value: String(head) },
            { key: 'Tail', value: String(tail) },
            { key: 'Size', value: `${size}/${k}` },
            ...(result !== undefined ? [{ key: 'Result', value: result }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize circular queue with capacity k=${k}. head=0, tail=-1, size=0.`,
      variables: { k, head, tail, size },
      visualization: makeViz('init'),
    });

    for (const op of operations) {
      const parts = op.split(/\s+/);
      const cmd = parts[0].toLowerCase();

      if (cmd === 'enqueue') {
        const val = Number(parts[1]);
        if (size === k) {
          steps.push({
            line: 8,
            explanation: `enQueue(${val}): Queue is FULL (size=${k}). Return false.`,
            variables: { val, head, tail, size },
            visualization: makeViz(`enQueue(${val})`, 'false'),
          });
        } else {
          tail = (tail + 1) % k;
          queue[tail] = val;
          size++;
          steps.push({
            line: 9,
            explanation: `enQueue(${val}): tail = (tail+1)%${k} = ${tail}. queue[${tail}]=${val}. size=${size}.`,
            variables: { val, tail, size, queue: [...queue] },
            visualization: makeViz(`enQueue(${val})`, 'true'),
          });
        }
      } else if (cmd === 'dequeue') {
        if (size === 0) {
          steps.push({
            line: 13,
            explanation: `deQueue(): Queue is EMPTY. Return false.`,
            variables: { head, tail, size },
            visualization: makeViz('deQueue()', 'false'),
          });
        } else {
          const val = queue[head];
          queue[head] = null;
          head = (head + 1) % k;
          size--;
          steps.push({
            line: 14,
            explanation: `deQueue(): Remove queue[${(head - 1 + k) % k}]=${val}. head = (head+1)%${k} = ${head}. size=${size}.`,
            variables: { removed: val, head, tail, size },
            visualization: makeViz('deQueue()', 'true'),
          });
        }
      } else if (cmd === 'front') {
        const val = size === 0 ? -1 : queue[head];
        steps.push({
          line: 18,
          explanation: `Front(): ${size === 0 ? 'Empty, return -1.' : `Return queue[head=${head}] = ${val}.`}`,
          variables: { result: val },
          visualization: makeViz('Front()', String(val)),
        });
      } else if (cmd === 'rear') {
        const val = size === 0 ? -1 : queue[tail];
        steps.push({
          line: 19,
          explanation: `Rear(): ${size === 0 ? 'Empty, return -1.' : `Return queue[tail=${tail}] = ${val}.`}`,
          variables: { result: val },
          visualization: makeViz('Rear()', String(val)),
        });
      }
    }

    steps.push({
      line: 20,
      explanation: `All operations complete. Final state: head=${head}, tail=${tail}, size=${size}/${k}.`,
      variables: { head, tail, size },
      visualization: makeViz('done'),
    });

    return steps;
  },
};

export default designCircularQueue;
