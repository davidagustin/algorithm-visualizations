import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designFrontMiddleBackQueue: AlgorithmDefinition = {
  id: 'design-front-middle-back-queue',
  title: 'Design Front Middle Back Queue',
  leetcodeNumber: 1670,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a queue that supports pushFront, pushMiddle, pushBack, popFront, popMiddle, and popBack in O(1) time. Use two deques: a left half and a right half, keeping them balanced so that the right deque has at most one extra element. Rebalance after each operation.',
  tags: ['design', 'deque', 'queue', 'simulation'],

  code: {
    pseudocode: `class FrontMiddleBackQueue:
  left = deque()
  right = deque()
  // invariant: len(right) == len(left) or len(right) == len(left)+1

  balance():
    while len(left) > len(right): right.appendleft(left.pop())
    while len(right) > len(left)+1: left.append(right.popleft())

  pushFront(val):  left.appendleft(val); balance()
  pushMiddle(val): left.append(val); balance()
  pushBack(val):   right.append(val); balance()

  popFront():
    if empty: return -1
    val = left.popleft() if left else right.popleft()
    balance(); return val

  popMiddle():
    if empty: return -1
    val = right.popleft() if len(right) > len(left) else left.pop()
    balance(); return val

  popBack():
    if empty: return -1
    val = right.pop(); balance(); return val`,

    python: `from collections import deque

class FrontMiddleBackQueue:
    def __init__(self):
        self.left = deque()
        self.right = deque()

    def _balance(self):
        while len(self.left) > len(self.right):
            self.right.appendleft(self.left.pop())
        while len(self.right) > len(self.left) + 1:
            self.left.append(self.right.popleft())

    def pushFront(self, val: int) -> None:
        self.left.appendleft(val)
        self._balance()

    def pushMiddle(self, val: int) -> None:
        self.left.append(val)
        self._balance()

    def pushBack(self, val: int) -> None:
        self.right.append(val)
        self._balance()

    def popFront(self) -> int:
        if not self.left and not self.right: return -1
        val = self.left.popleft() if self.left else self.right.popleft()
        self._balance()
        return val

    def popMiddle(self) -> int:
        if not self.left and not self.right: return -1
        val = self.right.popleft() if len(self.right) > len(self.left) else self.left.pop()
        self._balance()
        return val

    def popBack(self) -> int:
        if not self.right: return -1
        val = self.right.pop()
        self._balance()
        return val`,

    javascript: `class FrontMiddleBackQueue {
  constructor() {
    this.left = [];
    this.right = [];
  }

  _balance() {
    while (this.left.length > this.right.length)
      this.right.unshift(this.left.pop());
    while (this.right.length > this.left.length + 1)
      this.left.push(this.right.shift());
  }

  pushFront(val) { this.left.unshift(val); this._balance(); }
  pushMiddle(val) { this.left.push(val); this._balance(); }
  pushBack(val) { this.right.push(val); this._balance(); }

  popFront() {
    if (!this.left.length && !this.right.length) return -1;
    const val = this.left.length ? this.left.shift() : this.right.shift();
    this._balance();
    return val;
  }

  popMiddle() {
    if (!this.left.length && !this.right.length) return -1;
    const val = this.right.length > this.left.length
      ? this.right.shift() : this.left.pop();
    this._balance();
    return val;
  }

  popBack() {
    if (!this.right.length) return -1;
    const val = this.right.pop();
    this._balance();
    return val;
  }
}`,

    java: `class FrontMiddleBackQueue {
    Deque<Integer> left = new ArrayDeque<>(), right = new ArrayDeque<>();

    void balance() {
        while (left.size() > right.size()) right.addFirst(left.pollLast());
        while (right.size() > left.size() + 1) left.addLast(right.pollFirst());
    }

    public void pushFront(int val) { left.addFirst(val); balance(); }
    public void pushMiddle(int val) { left.addLast(val); balance(); }
    public void pushBack(int val) { right.addLast(val); balance(); }

    public int popFront() {
        if (left.isEmpty() && right.isEmpty()) return -1;
        int val = left.isEmpty() ? right.pollFirst() : left.pollFirst();
        balance(); return val;
    }
    public int popMiddle() {
        if (left.isEmpty() && right.isEmpty()) return -1;
        int val = right.size() > left.size() ? right.pollFirst() : left.pollLast();
        balance(); return val;
    }
    public int popBack() {
        if (right.isEmpty()) return -1;
        int val = right.pollLast(); balance(); return val;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Values to Push',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Values to demonstrate pushFront, pushMiddle, pushBack operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    let left: number[] = [];
    let right: number[] = [];

    const balance = () => {
      while (left.length > right.length) right.unshift(left.pop()!);
      while (right.length > left.length + 1) left.push(right.shift()!);
    };

    const getFullQueue = () => [...left, ...right];

    steps.push({
      line: 1,
      explanation: 'Initialize FrontMiddleBackQueue with two empty deques: left and right. Invariant: right.length == left.length or right.length == left.length + 1.',
      variables: { left: '[]', right: '[]', total: 0 },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    // pushBack
    for (let i = 0; i < Math.min(3, nums.length); i++) {
      right.push(nums[i]);
      balance();
      const full = getFullQueue();
      steps.push({
        line: 10,
        explanation: `pushBack(${nums[i]}): Append to right deque and rebalance. Left: [${left.join(',')}], Right: [${right.join(',')}]. Full queue: [${full.join(', ')}].`,
        variables: { pushed: nums[i], leftSize: left.length, rightSize: right.length },
        visualization: {
          type: 'array',
          array: full,
          highlights: { [full.length - 1]: 'active' },
          labels: { 0: 'front', [full.length - 1]: 'back' },
        },
      });
    }

    // pushFront
    if (nums.length > 3) {
      left.unshift(nums[3]);
      balance();
      const full = getFullQueue();
      steps.push({
        line: 8,
        explanation: `pushFront(${nums[3]}): Prepend to left deque and rebalance. Left: [${left.join(',')}], Right: [${right.join(',')}]. Full queue: [${full.join(', ')}].`,
        variables: { pushed: nums[3], leftSize: left.length, rightSize: right.length },
        visualization: {
          type: 'array',
          array: full,
          highlights: { 0: 'active' },
          labels: { 0: `front:${nums[3]}`, [full.length - 1]: 'back' },
        },
      });
    }

    // pushMiddle
    if (nums.length > 4) {
      left.push(nums[4]);
      balance();
      const full = getFullQueue();
      const midIdx = Math.floor(full.length / 2);
      steps.push({
        line: 9,
        explanation: `pushMiddle(${nums[4]}): Append to left end and rebalance. Middle is at index ${midIdx}. Full queue: [${full.join(', ')}].`,
        variables: { pushed: nums[4], middleIndex: midIdx, leftSize: left.length, rightSize: right.length },
        visualization: {
          type: 'array',
          array: full,
          highlights: { [midIdx]: 'active' },
          labels: { 0: 'front', [midIdx]: 'middle', [full.length - 1]: 'back' },
        },
      });
    }

    // popMiddle
    let full = getFullQueue();
    if (full.length > 0) {
      const midVal = right.length > left.length ? right.shift()! : left.pop()!;
      balance();
      const after = getFullQueue();
      steps.push({
        line: 17,
        explanation: `popMiddle(): Remove middle element ${midVal}. Queue after: [${after.join(', ')}].`,
        variables: { popped: midVal, queueSize: after.length },
        visualization: {
          type: 'array',
          array: after,
          highlights: after.length > 0 ? { [Math.floor(after.length / 2)]: 'found' } : {},
          labels: { 0: 'front', [Math.max(0, after.length - 1)]: 'back' },
        },
      });
    }

    return steps;
  },
};

export default designFrontMiddleBackQueue;
