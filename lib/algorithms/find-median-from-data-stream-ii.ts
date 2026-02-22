import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findMedianFromDataStreamIi: AlgorithmDefinition = {
  id: 'find-median-from-data-stream-ii',
  title: 'Find Median from Data Stream',
  leetcodeNumber: 295,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Maintain a running median as numbers are added to a stream. Use two heaps: a max-heap for the lower half and a min-heap for the upper half. After each insert, balance the heaps so they differ in size by at most 1. The median is the top of the larger heap or the average of both tops.',
  tags: ['heap', 'two heaps', 'design', 'median', 'data stream'],

  code: {
    pseudocode: `class MedianFinder:
  maxHeap = max-heap  // lower half
  minHeap = min-heap  // upper half

  addNum(num):
    maxHeap.push(num)
    minHeap.push(maxHeap.pop())
    if minHeap.size > maxHeap.size:
      maxHeap.push(minHeap.pop())

  findMedian():
    if maxHeap.size > minHeap.size:
      return maxHeap.top()
    return (maxHeap.top() + minHeap.top()) / 2.0`,

    python: `import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negate values)
        self.hi = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2.0`,

    javascript: `class MedianFinder {
  constructor() {
    this.lo = []; // max-heap (simulated)
    this.hi = []; // min-heap (simulated)
  }

  addNum(num) {
    this.lo.push(num);
    this.lo.sort((a, b) => b - a); // max at front
    this.hi.push(this.lo.shift());
    this.hi.sort((a, b) => a - b); // min at front
    if (this.hi.length > this.lo.length) {
      this.lo.push(this.hi.shift());
      this.lo.sort((a, b) => b - a);
    }
  }

  findMedian() {
    if (this.lo.length > this.hi.length) return this.lo[0];
    return (this.lo[0] + this.hi[0]) / 2;
  }
}`,

    java: `class MedianFinder {
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> hi = new PriorityQueue<>();

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
  },

  defaultInput: {
    nums: [5, 3, 8, 1, 9, 4, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Stream of Numbers',
      type: 'array',
      defaultValue: [5, 3, 8, 1, 9, 4, 7],
      placeholder: '5,3,8,1,9,4,7',
      helperText: 'Numbers arriving in the data stream one by one',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    // Simulate with sorted arrays (max-heap lo, min-heap hi)
    let lo: number[] = []; // max-heap: largest at index 0
    let hi: number[] = []; // min-heap: smallest at index 0

    steps.push({
      line: 1,
      explanation: 'Initialize MedianFinder with two heaps: maxHeap (lower half) and minHeap (upper half). Both start empty.',
      variables: { maxHeap: '[]', minHeap: '[]', median: 'undefined' },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    for (const num of nums) {
      // Step 1: push to lo (max-heap)
      lo.push(num);
      lo.sort((a, b) => b - a);

      // Step 2: move lo's max to hi
      const moved = lo.shift()!;
      hi.push(moved);
      hi.sort((a, b) => a - b);

      // Step 3: rebalance if hi is larger
      if (hi.length > lo.length) {
        lo.push(hi.shift()!);
        lo.sort((a, b) => b - a);
      }

      const median = lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2;
      const combined = [...lo].reverse().concat([...hi]);

      steps.push({
        line: 4,
        explanation: `addNum(${num}): After inserting, maxHeap=[${lo.join(',')}] (top=${lo[0]}), minHeap=[${hi.join(',')}] (top=${hi[0] ?? 'N/A'}). Sizes: ${lo.length} vs ${hi.length}. Median = ${median}.`,
        variables: {
          inserted: num,
          maxHeapTop: lo[0],
          minHeapTop: hi[0] ?? 'N/A',
          maxHeapSize: lo.length,
          minHeapSize: hi.length,
          median,
        },
        visualization: {
          type: 'array',
          array: combined,
          highlights: {
            [lo.length - 1]: 'active',
            [lo.length]: hi.length > 0 ? 'active' : 'default',
            0: 'found',
            [combined.length - 1]: hi.length > 0 ? 'found' : 'default',
          },
          labels: {
            0: `max:${lo[lo.length - 1]}`,
            [lo.length - 1]: `maxTop:${lo[0]}`,
            [lo.length]: hi.length > 0 ? `minTop:${hi[0]}` : '',
            [combined.length - 1]: hi.length > 0 ? `min:${hi[hi.length - 1]}` : '',
          },
        },
      });

      steps.push({
        line: 11,
        explanation: `findMedian(): ${lo.length > hi.length ? `maxHeap is larger -> median = ${lo[0]}` : `Heaps equal size -> median = (${lo[0]} + ${hi[0]}) / 2 = ${median}`}`,
        variables: { median, maxHeapSize: lo.length, minHeapSize: hi.length },
        visualization: {
          type: 'array',
          array: combined,
          highlights: lo.length > hi.length
            ? { [lo.length - 1]: 'pointer' }
            : { [lo.length - 1]: 'pointer', [lo.length]: 'pointer' },
          labels: { [lo.length - 1]: `median=${median}` },
        },
      });
    }

    return steps;
  },
};

export default findMedianFromDataStreamIi;
