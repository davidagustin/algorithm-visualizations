import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const medianOfDataStream: AlgorithmDefinition = {
  id: 'median-of-data-stream',
  title: 'Median of Data Stream',
  leetcodeNumber: 295,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Design a data structure that supports adding integers and finding the median at any time. Use two heaps: a max-heap for the lower half and a min-heap for the upper half. Keep them balanced so the median can be computed in O(1).',
  tags: ['Heap', 'Two Pointers', 'Data Stream', 'Design'],
  code: {
    pseudocode: `class MedianFinder:
  lo = max-heap (lower half)
  hi = min-heap (upper half)

  addNum(num):
    push num to lo
    push lo.max to hi
    if hi.size > lo.size:
      push hi.min to lo

  findMedian():
    if lo.size > hi.size: return lo.max
    else: return (lo.max + hi.min) / 2`,
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
  constructor() { this.lo = []; this.hi = []; }
  addNum(num) {
    this.lo.push(num); this.lo.sort((a,b)=>b-a);
    this.hi.push(this.lo.shift()); this.hi.sort((a,b)=>a-b);
    if (this.hi.length > this.lo.length) this.lo.unshift(this.hi.shift());
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
  defaultInput: { nums: [5, 10, 3, 8, 1, 7, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Stream of Numbers',
      type: 'array',
      defaultValue: [5, 10, 3, 8, 1, 7, 2],
      placeholder: '5,10,3,8,1,7,2',
      helperText: 'Numbers to add to the data stream',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const lo: number[] = [];
    const hi: number[] = [];

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, median: number | string): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Median Finder (Two Heaps)',
          entries: [
            { key: 'Lo (max-heap)', value: `[${lo.slice().sort((a, b) => b - a).join(', ')}]` },
            { key: 'Hi (min-heap)', value: `[${hi.slice().sort((a, b) => a - b).join(', ')}]` },
            { key: 'Median', value: String(median) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize MedianFinder with two heaps. lo = max-heap for lower half, hi = min-heap for upper half.',
      variables: { loSize: 0, hiSize: 0 },
      visualization: makeViz({}, {}, 'N/A'),
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      lo.push(num);
      lo.sort((a, b) => b - a);
      hi.push(lo.shift()!);
      hi.sort((a, b) => a - b);
      if (hi.length > lo.length) lo.unshift(hi.shift()!);
      lo.sort((a, b) => b - a);

      let median: number;
      if (lo.length > hi.length) {
        median = lo[0];
      } else {
        median = (lo[0] + hi[0]) / 2;
      }

      steps.push({
        line: 6,
        explanation: `Add ${num}. Lo=${JSON.stringify(lo)}, Hi=${JSON.stringify(hi)}. Median = ${median}.`,
        variables: { num, loSize: lo.length, hiSize: hi.length, median },
        visualization: makeViz({ [i]: 'active' }, { [i]: String(num) }, median),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < nums.length; i++) finalH[i] = 'sorted';
    const finalMedian = lo.length > hi.length ? lo[0] : (lo[0] + hi[0]) / 2;
    steps.push({
      line: 12,
      explanation: `Stream complete. Final median = ${finalMedian}. Lo has ${lo.length} elements, Hi has ${hi.length}.`,
      variables: { finalMedian, loSize: lo.length, hiSize: hi.length },
      visualization: makeViz(finalH, {}, finalMedian),
    });

    return steps;
  },
};

export default medianOfDataStream;
