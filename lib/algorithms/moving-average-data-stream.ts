import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const movingAverageDataStream: AlgorithmDefinition = {
  id: 'moving-average-data-stream',
  title: 'Moving Average from Data Stream',
  leetcodeNumber: 346,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Calculate the moving average of a data stream with a fixed window size. Use a queue to maintain the window: add new values to the back, remove from the front when the window exceeds the size. Track the running sum for O(1) average computation.',
  tags: ['Stack', 'Queue', 'Design', 'Sliding Window'],
  code: {
    pseudocode: `class MovingAverage:
  queue = []
  windowSize = size
  runningSum = 0
  function next(val):
    queue.push_back(val)
    runningSum += val
    if len(queue) > windowSize:
      runningSum -= queue.pop_front()
    return runningSum / len(queue)`,
    python: `from collections import deque

class MovingAverage:
    def __init__(self, size: int):
        self.queue = deque()
        self.window_size = size
        self.running_sum = 0

    def next(self, val: int) -> float:
        self.queue.append(val)
        self.running_sum += val
        if len(self.queue) > self.window_size:
            self.running_sum -= self.queue.popleft()
        return self.running_sum / len(self.queue)`,
    javascript: `class MovingAverage {
  constructor(size) {
    this.queue = [];
    this.windowSize = size;
    this.runningSum = 0;
  }
  next(val) {
    this.queue.push(val);
    this.runningSum += val;
    if (this.queue.length > this.windowSize) {
      this.runningSum -= this.queue.shift();
    }
    return this.runningSum / this.queue.length;
  }
}`,
    java: `class MovingAverage {
    Deque<Integer> queue = new ArrayDeque<>();
    int windowSize;
    double sum = 0;

    public MovingAverage(int size) {
        this.windowSize = size;
    }

    public double next(int val) {
        queue.offer(val);
        sum += val;
        if (queue.size() > windowSize) {
            sum -= queue.poll();
        }
        return sum / queue.size();
    }
}`,
  },
  defaultInput: { size: 3, values: [1, 10, 3, 5] },
  inputFields: [
    {
      name: 'size',
      label: 'Window Size',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Size of the sliding window',
    },
    {
      name: 'values',
      label: 'Stream Values',
      type: 'array',
      defaultValue: [1, 10, 3, 5],
      placeholder: 'e.g. 1,10,3,5',
      helperText: 'Comma-separated stream of values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const size = input.size as number;
    const values = (input.values as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const queue: number[] = [];
    let runningSum = 0;
    const averages: number[] = [];

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < values.length; i++) {
        if (i < (activeIdx ?? 0)) {
          highlights[i] = 'sorted';
          labels[i] = `avg=${averages[i]?.toFixed(2) ?? '?'}`;
        } else if (i === activeIdx) {
          highlights[i] = 'current';
          labels[i] = 'next';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: values,
        highlights,
        labels,
        auxData: {
          label: 'Moving Average Window',
          entries: [
            { key: 'Window size', value: String(size) },
            { key: 'Queue', value: queue.length > 0 ? `[${queue.join(', ')}]` : '[]' },
            { key: 'Running sum', value: String(runningSum) },
            { key: 'Average', value: queue.length > 0 ? (runningSum / queue.length).toFixed(2) : 'N/A' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize MovingAverage with window size=${size}. Queue starts empty, runningSum=0.`,
      variables: { size, queue: [], runningSum },
      visualization: makeViz(null),
    });

    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      queue.push(val);
      runningSum += val;

      steps.push({
        line: 4,
        explanation: `next(${val}): Add ${val} to queue. runningSum = ${runningSum}. Queue size = ${queue.length}.`,
        variables: { val, runningSum, queueSize: queue.length },
        visualization: makeViz(i),
      });

      if (queue.length > size) {
        const removed = queue.shift()!;
        runningSum -= removed;
        steps.push({
          line: 6,
          explanation: `Window exceeds size ${size}. Remove oldest: ${removed}. runningSum = ${runningSum}. Queue = [${queue.join(', ')}].`,
          variables: { removed, runningSum, queue: [...queue] },
          visualization: makeViz(i),
        });
      }

      const avg = runningSum / queue.length;
      averages.push(avg);
      steps.push({
        line: 7,
        explanation: `Average = ${runningSum} / ${queue.length} = ${avg.toFixed(2)}. Window: [${queue.join(', ')}].`,
        variables: { average: avg.toFixed(2), window: [...queue] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 8,
      explanation: `All values processed. Averages: [${averages.map(a => a.toFixed(2)).join(', ')}].`,
      variables: { averages: averages.map(a => +a.toFixed(2)) },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < values.length; i++) {
          h[i] = 'found';
          l[i] = averages[i].toFixed(2);
        }
        return {
          type: 'array' as const,
          array: values,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Averages',
            entries: [{ key: 'Averages', value: `[${averages.map(a => a.toFixed(2)).join(', ')}]` }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default movingAverageDataStream;
