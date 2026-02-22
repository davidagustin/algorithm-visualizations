import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designFrontMiddleBackQueueIi: AlgorithmDefinition = {
  id: 'design-front-middle-back-queue-ii',
  title: 'Design Front Middle Back Queue',
  leetcodeNumber: 1670,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a queue that supports push and pop operations from front, middle, and back. The middle is defined as floor(size/2) (0-indexed). Use two deques of roughly equal size to maintain O(1) or O(n/2) complexity.',
  tags: ['Queue', 'Design', 'Deque', 'Two Pointers'],
  code: {
    pseudocode: `class FrontMiddleBackQueue:
  function init():
    left = deque(); right = deque()
  function balance():
    if left.size > right.size: right.prepend(left.pop())
    if right.size > left.size + 1: left.append(right.popleft())
  function pushFront(val): left.prepend(val); balance()
  function pushMiddle(val):
    if left.size == right.size: right.prepend(val)
    else: left.append(val)
    balance()
  function pushBack(val): right.append(val); balance()
  function popFront():
    if right.empty: return -1
    if left.empty: return right.popleft()
    return left.popleft(); balance()
  function popMiddle():
    if right.empty: return -1
    if left.size == right.size: return left.pop()
    return right.popleft(); balance()
  function popBack():
    if right.empty: return -1
    return right.pop(); balance()`,
    python: `from collections import deque

class FrontMiddleBackQueue:
    def __init__(self):
        self.left = deque()
        self.right = deque()

    def _balance(self):
        if len(self.left) > len(self.right):
            self.right.appendleft(self.left.pop())
        if len(self.right) > len(self.left) + 1:
            self.left.append(self.right.popleft())

    def pushFront(self, val): self.left.appendleft(val); self._balance()
    def pushMiddle(self, val):
        if len(self.left) == len(self.right): self.right.appendleft(val)
        else: self.left.append(val)
        self._balance()
    def pushBack(self, val): self.right.append(val); self._balance()
    def popFront(self):
        if not self.right: return -1
        res = self.left.popleft() if self.left else self.right.popleft()
        self._balance(); return res
    def popMiddle(self):
        if not self.right: return -1
        res = self.left.pop() if len(self.left) == len(self.right) else self.right.popleft()
        self._balance(); return res
    def popBack(self):
        if not self.right: return -1
        res = self.right.pop(); self._balance(); return res`,
    javascript: `class FrontMiddleBackQueue {
  constructor() { this.left = []; this.right = []; }
  _balance() {
    if (this.left.length > this.right.length)
      this.right.unshift(this.left.pop());
    if (this.right.length > this.left.length + 1)
      this.left.push(this.right.shift());
  }
  pushFront(v) { this.left.unshift(v); this._balance(); }
  pushMiddle(v) {
    if (this.left.length === this.right.length) this.right.unshift(v);
    else this.left.push(v);
    this._balance();
  }
  pushBack(v) { this.right.push(v); this._balance(); }
  popFront() {
    if (!this.right.length) return -1;
    const r = this.left.length ? this.left.shift() : this.right.shift();
    this._balance(); return r;
  }
  popMiddle() {
    if (!this.right.length) return -1;
    const r = this.left.length === this.right.length ? this.left.pop() : this.right.shift();
    this._balance(); return r;
  }
  popBack() {
    if (!this.right.length) return -1;
    const r = this.right.pop(); this._balance(); return r;
  }
}`,
    java: `class FrontMiddleBackQueue {
    Deque<Integer> left = new ArrayDeque<>(), right = new ArrayDeque<>();
    void balance() {
        if (left.size() > right.size()) right.addFirst(left.pollLast());
        if (right.size() > left.size() + 1) left.addLast(right.pollFirst());
    }
    public void pushFront(int v) { left.addFirst(v); balance(); }
    public void pushMiddle(int v) {
        if (left.size() == right.size()) right.addFirst(v);
        else left.addLast(v);
        balance();
    }
    public void pushBack(int v) { right.addLast(v); balance(); }
    public int popFront() {
        if (right.isEmpty()) return -1;
        int r = left.isEmpty() ? right.pollFirst() : left.pollFirst();
        balance(); return r;
    }
    public int popMiddle() {
        if (right.isEmpty()) return -1;
        int r = left.size() == right.size() ? left.pollLast() : right.pollFirst();
        balance(); return r;
    }
    public int popBack() {
        if (right.isEmpty()) return -1;
        int r = right.pollLast(); balance(); return r;
    }
}`,
  },
  defaultInput: {
    operations: [['pushFront', 1], ['pushBack', 2], ['pushMiddle', 3], ['pushFront', 4], ['popFront'], ['popMiddle'], ['popBack']],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'pushFront 1, pushBack 2, pushMiddle 3, pushFront 4, popFront, popMiddle, popBack',
      placeholder: 'pushFront 1, pushBack 2, popFront',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
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
    let left: number[] = [];
    let right: number[] = [];

    const balance = () => {
      if (left.length > right.length) right.unshift(left.pop()!);
      if (right.length > left.length + 1) left.push(right.shift()!);
    };

    const getQueue = () => [...left, ...right];

    function makeViz(label: string): ArrayVisualization {
      const q = getQueue();
      const midIdx = left.length;
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      q.forEach((_, i) => {
        highlights[i] = i === 0 ? 'active' : i === midIdx ? 'pointer' : i === q.length - 1 ? 'found' : 'default';
        lbls[i] = i === 0 ? 'Front' : i === midIdx ? 'Mid' : i === q.length - 1 ? 'Back' : '';
      });
      return {
        type: 'array',
        array: q,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Front-Middle-Back Queue',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${q.length}` },
            { key: 'Left part', value: left.join(', ') || 'empty' },
            { key: 'Right part', value: right.join(', ') || 'empty' },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize Front-Middle-Back Queue.', variables: {}, visualization: makeViz('Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'pushFront') {
        const val = Number(op[1]);
        left.unshift(val); balance();
        steps.push({ line: 5, explanation: `pushFront(${val}): Insert ${val} at front. Queue: [${getQueue().join(', ')}].`, variables: { val, size: left.length + right.length }, visualization: makeViz(`pushFront(${val})`) });
      } else if (opType === 'pushMiddle') {
        const val = Number(op[1]);
        if (left.length === right.length) right.unshift(val);
        else left.push(val);
        balance();
        steps.push({ line: 6, explanation: `pushMiddle(${val}): Insert ${val} at middle. Queue: [${getQueue().join(', ')}].`, variables: { val, size: left.length + right.length }, visualization: makeViz(`pushMiddle(${val})`) });
      } else if (opType === 'pushBack') {
        const val = Number(op[1]);
        right.push(val); balance();
        steps.push({ line: 9, explanation: `pushBack(${val}): Insert ${val} at back. Queue: [${getQueue().join(', ')}].`, variables: { val, size: left.length + right.length }, visualization: makeViz(`pushBack(${val})`) });
      } else if (opType === 'popFront') {
        if (right.length === 0) {
          steps.push({ line: 10, explanation: 'popFront(): Queue is empty. Return -1.', variables: { result: -1 }, visualization: makeViz('popFront() -> -1') });
        } else {
          const r = left.length ? left.shift()! : right.shift()!;
          balance();
          steps.push({ line: 11, explanation: `popFront(): Remove and return front element ${r}. Queue: [${getQueue().join(', ')}].`, variables: { result: r }, visualization: makeViz(`popFront() -> ${r}`) });
        }
      } else if (opType === 'popMiddle') {
        if (right.length === 0) {
          steps.push({ line: 13, explanation: 'popMiddle(): Queue is empty. Return -1.', variables: { result: -1 }, visualization: makeViz('popMiddle() -> -1') });
        } else {
          const r = left.length === right.length ? left.pop()! : right.shift()!;
          balance();
          steps.push({ line: 14, explanation: `popMiddle(): Remove and return middle element ${r}. Queue: [${getQueue().join(', ')}].`, variables: { result: r }, visualization: makeViz(`popMiddle() -> ${r}`) });
        }
      } else if (opType === 'popBack') {
        if (right.length === 0) {
          steps.push({ line: 16, explanation: 'popBack(): Queue is empty. Return -1.', variables: { result: -1 }, visualization: makeViz('popBack() -> -1') });
        } else {
          const r = right.pop()!;
          balance();
          steps.push({ line: 17, explanation: `popBack(): Remove and return back element ${r}. Queue: [${getQueue().join(', ')}].`, variables: { result: r }, visualization: makeViz(`popBack() -> ${r}`) });
        }
      }
    }

    steps.push({ line: 18, explanation: `All operations complete. Final queue: [${getQueue().join(', ')}].`, variables: { size: left.length + right.length }, visualization: makeViz('Complete') });

    return steps;
  },
};

export default designFrontMiddleBackQueueIi;
