import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const movingAverageFromDataStreamII: AlgorithmDefinition = {
  id: 'moving-average-from-data-stream-ii',
  title: 'Moving Average from Data Stream II',
  leetcodeNumber: 346,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a MovingAverage class to compute the moving average of a stream of integers in a sliding window of size k. Use a fixed-size circular buffer (queue). When buffer is full, remove the oldest value before adding the new one. O(1) per insertion.',
  tags: ['Design', 'Queue', 'Sliding Window', 'Array'],
  code: {
    pseudocode: `class MovingAverage:
  def __init__(size):
    self.size = size
    self.queue = []
    self.windowSum = 0
  def next(val):
    if len(queue) == size:
      windowSum -= queue.dequeue()
    queue.enqueue(val)
    windowSum += val
    return windowSum / len(queue)`,
    python: `from collections import deque
class MovingAverage:
    def __init__(self, size: int):
        self.size = size
        self.queue = deque()
        self.window_sum = 0
    def next(self, val: int) -> float:
        if len(self.queue) == self.size:
            self.window_sum -= self.queue.popleft()
        self.queue.append(val)
        self.window_sum += val
        return self.window_sum / len(self.queue)`,
    javascript: `class MovingAverage {
  constructor(size) {
    this.size = size;
    this.queue = [];
    this.windowSum = 0;
  }
  next(val) {
    if (this.queue.length === this.size) {
      this.windowSum -= this.queue.shift();
    }
    this.queue.push(val);
    this.windowSum += val;
    return this.windowSum / this.queue.length;
  }
}`,
    java: `class MovingAverage {
    private int size; private Deque<Integer> queue; private double windowSum;
    public MovingAverage(int size) { this.size=size; queue=new ArrayDeque<>(); windowSum=0; }
    public double next(int val) {
        if (queue.size()==size) windowSum-=queue.pollFirst();
        queue.addLast(val); windowSum+=val;
        return windowSum/queue.size();
    }
}`,
  },
  defaultInput: { size: 3, stream: [1, 10, 3, 5] },
  inputFields: [
    {
      name: 'size',
      label: 'Window Size',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of sliding window',
    },
    {
      name: 'stream',
      label: 'Data Stream',
      type: 'array',
      defaultValue: [1, 10, 3, 5],
      placeholder: '1,10,3,5',
      helperText: 'Values arriving in stream',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const size = input.size as number;
    const stream = input.stream as number[];
    const steps: AlgorithmStep[] = [];

    const queue: number[] = [];
    let windowSum = 0;
    const allVals = [...stream];
    const vizArr = new Array(size).fill(0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...vizArr],
      highlights,
      labels,
      auxData: { label: 'Moving Average', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `MovingAverage(${size}). Window size=${size}. Will show rolling average. Buffer initialized to zeros.`,
      variables: { size, stream },
      visualization: makeViz(
        {},
        Object.fromEntries(vizArr.map((_, i) => [i, 'empty'])),
        [{ key: 'Window Size', value: String(size) }, { key: 'Sum', value: '0' }],
      ),
    });

    for (let i = 0; i < stream.length; i++) {
      const val = stream[i];
      let removed: number | null = null;

      if (queue.length === size) {
        removed = queue.shift()!;
        windowSum -= removed;
      }
      queue.push(val);
      windowSum += val;

      for (let j = 0; j < size; j++) {
        vizArr[j] = queue[j] ?? 0;
      }

      const avg = windowSum / queue.length;
      const hl: Record<number, string> = {};
      hl[queue.length - 1] = 'active';
      if (removed !== null) hl[0] = 'visited';

      steps.push({
        line: 8,
        explanation: `next(${val}): ${removed !== null ? `Evict ${removed}. ` : ''}Add ${val}. Window=[${queue.join(',')}], sum=${windowSum}, avg=${avg.toFixed(2)}.`,
        variables: { val, removed, queue: [...queue], windowSum, avg },
        visualization: makeViz(
          hl,
          Object.fromEntries(queue.map((v, j) => [j, String(v)])),
          [{ key: `next(${val})`, value: avg.toFixed(5) }, { key: 'Window', value: queue.join(',') }, { key: 'Sum', value: String(windowSum) }],
        ),
      });
    }

    return steps;
  },
};

export default movingAverageFromDataStreamII;
