import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const implementStackUsingQueues: AlgorithmDefinition = {
  id: 'implement-stack-using-queues',
  title: 'Implement Stack using Queues',
  leetcodeNumber: 225,
  difficulty: 'Easy',
  category: 'Queue',
  description:
    'Implement a last-in-first-out stack using only two queues. The push operation enqueues the new element then rotates all previous elements behind it, so the front of the queue is always the top of the stack. Pop and top simply dequeue from the front.',
  tags: ['queue', 'stack', 'design', 'simulation'],

  code: {
    pseudocode: `class MyStack:
  queue = []

  push(x):
    queue.enqueue(x)
    // rotate all elements before x to the back
    for i in range(size - 1):
      queue.enqueue(queue.dequeue())

  pop():
    return queue.dequeue()

  top():
    return queue.front()

  empty():
    return queue.isEmpty()`,

    python: `from collections import deque

class MyStack:
    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return not self.q`,

    javascript: `class MyStack {
  constructor() {
    this.queue = [];
  }

  push(x) {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++) {
      this.queue.push(this.queue.shift());
    }
  }

  pop() {
    return this.queue.shift();
  }

  top() {
    return this.queue[0];
  }

  empty() {
    return this.queue.length === 0;
  }
}`,

    java: `class MyStack {
    private Queue<Integer> queue = new LinkedList<>();

    public void push(int x) {
        queue.offer(x);
        for (int i = 0; i < queue.size() - 1; i++) {
            queue.offer(queue.poll());
        }
    }

    public int pop() {
        return queue.poll();
    }

    public int top() {
        return queue.peek();
    }

    public boolean empty() {
        return queue.isEmpty();
    }
}`,
  },

  defaultInput: {
    operations: [1, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Push Values (in order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Values to push onto the stack one by one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as number[];
    const steps: AlgorithmStep[] = [];
    const queue: number[] = [];

    steps.push({
      line: 1,
      explanation: 'Initialize an empty queue that will simulate the stack.',
      variables: { queue: '[]', stackTop: 'none' },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    for (let opIdx = 0; opIdx < operations.length; opIdx++) {
      const x = operations[opIdx];

      // Enqueue the new element
      queue.push(x);
      steps.push({
        line: 3,
        explanation: `Push ${x}: enqueue ${x} to the back of the queue. Queue front will become the stack top after rotation.`,
        variables: { pushed: x, queueSize: queue.length },
        visualization: {
          type: 'array',
          array: [...queue],
          highlights: { [queue.length - 1]: 'active' },
          labels: { [queue.length - 1]: 'new', 0: 'top?' },
        },
      });

      // Rotate all previous elements to the back
      const rotations = queue.length - 1;
      for (let r = 0; r < rotations; r++) {
        const moved = queue.shift()!;
        queue.push(moved);
        steps.push({
          line: 6,
          explanation: `Rotate: move ${moved} from front to back so ${x} ends up at front (stack top). Rotation ${r + 1} of ${rotations}.`,
          variables: { rotated: moved, remaining: rotations - r - 1, queueFront: queue[0] },
          visualization: {
            type: 'array',
            array: [...queue],
            highlights: { [queue.length - 1]: 'comparing', 0: 'active' },
            labels: { 0: 'top', [queue.length - 1]: 'just moved' },
          },
        });
      }

      steps.push({
        line: 8,
        explanation: `Push ${x} complete. The queue front is now ${queue[0]} (the stack top). Queue represents stack top-to-bottom.`,
        variables: { stackTop: queue[0], queueState: [...queue].join(', ') },
        visualization: {
          type: 'array',
          array: [...queue],
          highlights: { 0: 'found' },
          labels: { 0: 'TOP', [queue.length - 1]: 'bottom' },
        },
      });
    }

    // Demonstrate pop
    if (queue.length > 0) {
      const popped = queue.shift()!;
      steps.push({
        line: 10,
        explanation: `Pop operation: dequeue from front gives ${popped} (the stack top). This is O(1).`,
        variables: { popped, newTop: queue.length > 0 ? queue[0] : 'empty' },
        visualization: {
          type: 'array',
          array: [...queue],
          highlights: queue.length > 0 ? { 0: 'found' } : {},
          labels: queue.length > 0 ? { 0: 'new TOP' } : {},
        },
      });
    }

    return steps;
  },
};

export default implementStackUsingQueues;
