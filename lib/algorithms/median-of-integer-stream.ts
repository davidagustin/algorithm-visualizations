import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const medianOfIntegerStream: AlgorithmDefinition = {
  id: 'median-of-integer-stream',
  title: 'Median of Integer Stream',
  leetcodeNumber: 295,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Find the median from a continuous data stream. Use two heaps: a max-heap for the lower half and a min-heap for the upper half. The median is the top of the max-heap or the average of both tops.',
  tags: ['Heap', 'Design', 'Stream'],
  code: {
    pseudocode: `class MedianFinder:
  maxHeap = []  // lower half (max on top)
  minHeap = []  // upper half (min on top)
  function addNum(num):
    push num onto maxHeap
    move maxHeap top to minHeap
    if minHeap.size > maxHeap.size:
      move minHeap top to maxHeap
  function findMedian():
    if maxHeap.size > minHeap.size:
      return maxHeap.top
    return (maxHeap.top + minHeap.top) / 2`,
    python: `import heapq
class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negated)
        self.hi = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2`,
    javascript: `class MedianFinder {
  constructor() {
    this.lo = []; // max-heap (sorted desc)
    this.hi = []; // min-heap (sorted asc)
  }
  addNum(num) {
    this.lo.push(num);
    this.lo.sort((a, b) => b - a);
    this.hi.push(this.lo.shift());
    this.hi.sort((a, b) => a - b);
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
        if (lo.size() > hi.size()) return lo.peek();
        return (lo.peek() + hi.peek()) / 2.0;
    }
}`,
  },
  defaultInput: { stream: [5, 2, 8, 1, 9, 3] },
  inputFields: [
    {
      name: 'stream',
      label: 'Number Stream',
      type: 'array',
      defaultValue: [5, 2, 8, 1, 9, 3],
      placeholder: 'e.g. 5,2,8,1,9,3',
      helperText: 'Numbers arriving in stream order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stream = (input.stream as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const lo: number[] = []; // max-heap (sorted desc)
    const hi: number[] = []; // min-heap (sorted asc)

    function getMedian(): number {
      if (lo.length > hi.length) return lo[0];
      return (lo[0] + hi[0]) / 2;
    }

    function makeViz(num: number | null, median: number | null): ArrayVisualization {
      // Show both heaps: lo (desc) then hi (asc)
      const combined = [...lo, ...hi];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < lo.length; i++) {
        highlights[i] = 'pointer';
        if (i === 0) labels[i] = 'lo-top';
      }
      for (let i = 0; i < hi.length; i++) {
        const idx = lo.length + i;
        highlights[idx] = 'active';
        if (i === 0) labels[idx] = 'hi-top';
      }

      return {
        type: 'array',
        array: combined.length > 0 ? combined : [0],
        highlights: combined.length > 0 ? highlights : { 0: 'default' },
        labels: combined.length > 0 ? labels : {},
        auxData: {
          label: 'Heaps & Median',
          entries: [
            { key: 'Max-Heap (lower)', value: lo.length > 0 ? lo.join(', ') : 'empty' },
            { key: 'Min-Heap (upper)', value: hi.length > 0 ? hi.join(', ') : 'empty' },
            ...(num !== null ? [{ key: 'Added', value: String(num) }] : []),
            ...(median !== null ? [{ key: 'Median', value: String(median) }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize two heaps: max-heap (lower half) and min-heap (upper half).',
      variables: { lo: [], hi: [] },
      visualization: makeViz(null, null),
    });

    for (let i = 0; i < stream.length; i++) {
      const num = stream[i];

      // Add to max-heap
      lo.push(num);
      lo.sort((a, b) => b - a);

      steps.push({
        line: 5,
        explanation: `Add ${num} to max-heap. Max-heap: [${lo.join(', ')}].`,
        variables: { num, lo: [...lo], hi: [...hi] },
        visualization: makeViz(num, null),
      });

      // Move max-heap top to min-heap
      const moved = lo.shift()!;
      hi.push(moved);
      hi.sort((a, b) => a - b);

      steps.push({
        line: 6,
        explanation: `Move max-heap top (${moved}) to min-heap to maintain order.`,
        variables: { moved, lo: [...lo], hi: [...hi] },
        visualization: makeViz(num, null),
      });

      // Balance sizes
      if (hi.length > lo.length) {
        const balanced = hi.shift()!;
        lo.push(balanced);
        lo.sort((a, b) => b - a);

        steps.push({
          line: 7,
          explanation: `Min-heap larger than max-heap. Move min-heap top (${balanced}) back to max-heap.`,
          variables: { balanced, lo: [...lo], hi: [...hi] },
          visualization: makeViz(num, null),
        });
      }

      // Find median
      const median = getMedian();
      steps.push({
        line: 10,
        explanation: lo.length > hi.length
          ? `Odd count. Median = max-heap top = ${median}.`
          : `Even count. Median = (${lo[0]} + ${hi[0]}) / 2 = ${median}.`,
        variables: { median, lo: [...lo], hi: [...hi], count: lo.length + hi.length },
        visualization: makeViz(num, median),
      });
    }

    // Final
    const finalMedian = getMedian();
    steps.push({
      line: 12,
      explanation: `Stream complete. Final median: ${finalMedian}. Lower half: [${lo.join(', ')}], Upper half: [${hi.join(', ')}].`,
      variables: { median: finalMedian, lo: [...lo], hi: [...hi] },
      visualization: (() => {
        const combined = [...lo, ...hi];
        const h: Record<number, string> = {};
        for (let i = 0; i < combined.length; i++) h[i] = 'found';
        return {
          type: 'array' as const,
          array: combined,
          highlights: h,
          labels: {},
          auxData: {
            label: 'Final',
            entries: [
              { key: 'Median', value: String(finalMedian) },
              { key: 'All numbers sorted', value: [...lo, ...hi].sort((a, b) => a - b).join(', ') },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default medianOfIntegerStream;
