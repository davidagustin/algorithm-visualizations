import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designCircularDequeIi: AlgorithmDefinition = {
  id: 'design-circular-deque-ii',
  title: 'Design Circular Deque',
  leetcodeNumber: 641,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a circular double-ended queue (deque). Implement insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, and isFull operations, all in O(1) time.',
  tags: ['Queue', 'Design', 'Array', 'Deque'],
  code: {
    pseudocode: `class MyCircularDeque:
  function init(k):
    this.deque = array of size k
    this.front = 0; this.rear = k-1; this.size = 0; this.cap = k
  function insertFront(value):
    if isFull(): return false
    front = (front - 1 + cap) mod cap
    deque[front] = value; size++; return true
  function insertLast(value):
    if isFull(): return false
    rear = (rear + 1) mod cap
    deque[rear] = value; size++; return true
  function deleteFront():
    if isEmpty(): return false
    front = (front + 1) mod cap; size--; return true
  function deleteLast():
    if isEmpty(): return false
    rear = (rear - 1 + cap) mod cap; size--; return true`,
    python: `class MyCircularDeque:
    def __init__(self, k: int):
        self.deque = [0] * k
        self.front = 0
        self.rear = k - 1
        self.size = 0
        self.cap = k

    def insertFront(self, value: int) -> bool:
        if self.isFull(): return False
        self.front = (self.front - 1 + self.cap) % self.cap
        self.deque[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value: int) -> bool:
        if self.isFull(): return False
        self.rear = (self.rear + 1) % self.cap
        self.deque[self.rear] = value
        self.size += 1
        return True

    def deleteFront(self) -> bool:
        if self.isEmpty(): return False
        self.front = (self.front + 1) % self.cap
        self.size -= 1
        return True

    def deleteLast(self) -> bool:
        if self.isEmpty(): return False
        self.rear = (self.rear - 1 + self.cap) % self.cap
        self.size -= 1
        return True

    def getFront(self) -> int:
        return -1 if self.isEmpty() else self.deque[self.front]

    def getRear(self) -> int:
        return -1 if self.isEmpty() else self.deque[self.rear]

    def isEmpty(self) -> bool: return self.size == 0
    def isFull(self) -> bool: return self.size == self.cap`,
    javascript: `class MyCircularDeque {
  constructor(k) {
    this.deque = new Array(k).fill(0);
    this.front = 0; this.rear = k - 1;
    this.size = 0; this.cap = k;
  }
  insertFront(value) {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.cap) % this.cap;
    this.deque[this.front] = value; this.size++; return true;
  }
  insertLast(value) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.cap;
    this.deque[this.rear] = value; this.size++; return true;
  }
  deleteFront() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.cap; this.size--; return true;
  }
  deleteLast() {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.cap) % this.cap; this.size--; return true;
  }
  getFront() { return this.isEmpty() ? -1 : this.deque[this.front]; }
  getRear() { return this.isEmpty() ? -1 : this.deque[this.rear]; }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.cap; }
}`,
    java: `class MyCircularDeque {
    private int[] deque;
    private int front, rear, size, cap;
    public MyCircularDeque(int k) {
        deque = new int[k]; front = 0; rear = k - 1; size = 0; cap = k;
    }
    public boolean insertFront(int value) {
        if (isFull()) return false;
        front = (front - 1 + cap) % cap; deque[front] = value; size++; return true;
    }
    public boolean insertLast(int value) {
        if (isFull()) return false;
        rear = (rear + 1) % cap; deque[rear] = value; size++; return true;
    }
    public boolean deleteFront() {
        if (isEmpty()) return false; front = (front + 1) % cap; size--; return true;
    }
    public boolean deleteLast() {
        if (isEmpty()) return false; rear = (rear - 1 + cap) % cap; size--; return true;
    }
    public int getFront() { return isEmpty() ? -1 : deque[front]; }
    public int getRear() { return isEmpty() ? -1 : deque[rear]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == cap; }
}`,
  },
  defaultInput: {
    capacity: 3,
    operations: [['insertLast', 1], ['insertLast', 2], ['insertFront', 3], ['insertFront', 4], ['getRear'], ['isFull'], ['deleteLast'], ['insertFront', 4], ['getFront']],
  },
  inputFields: [
    {
      name: 'capacity',
      label: 'Deque Capacity',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'insertLast 1, insertLast 2, insertFront 3, insertFront 4, getRear, isFull, deleteLast, insertFront 4, getFront',
      placeholder: 'insertFront 1, insertLast 2, getFront',
      helperText: 'Comma-separated operations',
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
    const deque = new Array(cap).fill(0);
    let front = 0, rear = cap - 1, size = 0;

    const isEmpty = () => size === 0;
    const isFull = () => size === cap;

    function makeViz(label: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < cap; i++) {
        const isFront = !isEmpty() && i === front;
        const isRear = !isEmpty() && i === rear;
        highlights[i] = isFront && isRear ? 'active' : isFront ? 'found' : isRear ? 'pointer' : size > 0 ? 'current' : 'default';
        labels[i] = isFront && isRear ? 'F/R' : isFront ? 'Front' : isRear ? 'Rear' : '';
      }
      return {
        type: 'array',
        array: [...deque],
        highlights,
        labels,
        auxData: {
          label: 'Circular Deque',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${size}/${cap}` },
            { key: 'Front idx', value: `${front}` },
            { key: 'Rear idx', value: `${rear}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize Circular Deque with capacity ${cap}.`,
      variables: { cap, front, rear, size },
      visualization: makeViz('Init'),
    });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'insertFront') {
        const value = Number(op[1]);
        if (isFull()) {
          steps.push({ line: 7, explanation: `insertFront(${value}): Deque is full. Return false.`, variables: { result: false }, visualization: makeViz(`insertFront(${value}) -> false`) });
        } else {
          front = (front - 1 + cap) % cap;
          deque[front] = value; size++;
          steps.push({ line: 9, explanation: `insertFront(${value}): Insert ${value} at front index ${front}. Size: ${size}/${cap}.`, variables: { front, size }, visualization: makeViz(`insertFront(${value}) -> true`) });
        }
      } else if (opType === 'insertLast') {
        const value = Number(op[1]);
        if (isFull()) {
          steps.push({ line: 12, explanation: `insertLast(${value}): Deque is full. Return false.`, variables: { result: false }, visualization: makeViz(`insertLast(${value}) -> false`) });
        } else {
          rear = (rear + 1) % cap;
          deque[rear] = value; size++;
          steps.push({ line: 14, explanation: `insertLast(${value}): Insert ${value} at rear index ${rear}. Size: ${size}/${cap}.`, variables: { rear, size }, visualization: makeViz(`insertLast(${value}) -> true`) });
        }
      } else if (opType === 'deleteFront') {
        if (isEmpty()) {
          steps.push({ line: 16, explanation: 'deleteFront(): Deque is empty. Return false.', variables: { result: false }, visualization: makeViz('deleteFront() -> false') });
        } else {
          front = (front + 1) % cap; size--;
          steps.push({ line: 18, explanation: `deleteFront(): Remove front. Front moves to ${front}. Size: ${size}/${cap}.`, variables: { front, size }, visualization: makeViz('deleteFront() -> true') });
        }
      } else if (opType === 'deleteLast') {
        if (isEmpty()) {
          steps.push({ line: 20, explanation: 'deleteLast(): Deque is empty. Return false.', variables: { result: false }, visualization: makeViz('deleteLast() -> false') });
        } else {
          rear = (rear - 1 + cap) % cap; size--;
          steps.push({ line: 22, explanation: `deleteLast(): Remove rear. Rear moves to ${rear}. Size: ${size}/${cap}.`, variables: { rear, size }, visualization: makeViz('deleteLast() -> true') });
        }
      } else if (opType === 'getFront') {
        const result = isEmpty() ? -1 : deque[front];
        steps.push({ line: 24, explanation: `getFront(): Return ${result}.`, variables: { result }, visualization: makeViz(`getFront() -> ${result}`) });
      } else if (opType === 'getRear') {
        const result = isEmpty() ? -1 : deque[rear];
        steps.push({ line: 25, explanation: `getRear(): Return ${result}.`, variables: { result }, visualization: makeViz(`getRear() -> ${result}`) });
      } else if (opType === 'isEmpty') {
        steps.push({ line: 26, explanation: `isEmpty(): Return ${isEmpty()}.`, variables: { result: isEmpty() }, visualization: makeViz(`isEmpty() -> ${isEmpty()}`) });
      } else if (opType === 'isFull') {
        steps.push({ line: 27, explanation: `isFull(): Return ${isFull()}.`, variables: { result: isFull() }, visualization: makeViz(`isFull() -> ${isFull()}`) });
      }
    }

    steps.push({ line: 28, explanation: `All operations complete. Deque size: ${size}/${cap}.`, variables: { size, cap }, visualization: makeViz('Complete') });

    return steps;
  },
};

export default designCircularDequeIi;
