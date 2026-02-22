import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const slidingWindowMedianIi: AlgorithmDefinition = {
  id: 'sliding-window-median-ii',
  title: 'Sliding Window Median II',
  leetcodeNumber: 480,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an array nums and a window size k, find the median of each window as it slides from left to right. Use two heaps (max-heap for lower half, min-heap for upper half) and a lazy deletion map to efficiently maintain the sliding window.',
  tags: ['Heap', 'Sliding Window', 'Two Pointers', 'Sorting'],
  code: {
    pseudocode: `function medianSlidingWindow(nums, k):
  result = []
  lo = max-heap, hi = min-heap
  for i in 0..n-1:
    add nums[i] to heaps (balance)
    if i >= k-1:
      median = getMedian(lo, hi, k)
      result.append(median)
      remove nums[i-k+1] from heaps (lazy)
      rebalance heaps
  return result`,
    python: `import heapq
from collections import defaultdict
def medianSlidingWindow(nums, k):
    lo, hi = [], []  # max-heap (neg), min-heap
    def add(num):
        heapq.heappush(lo, -num)
        heapq.heappush(hi, -heapq.heappop(lo))
        if len(hi) > len(lo): heapq.heappush(lo, -heapq.heappop(hi))
    result = []
    for i, num in enumerate(nums):
        add(num)
        if i >= k - 1:
            result.append(-lo[0] if k%2 else (-lo[0]+hi[0])/2)
    return result`,
    javascript: `function medianSlidingWindow(nums, k) {
  const lo = [], hi = [];
  const add = n => {
    lo.push(n); lo.sort((a,b)=>b-a);
    hi.push(lo.shift()); hi.sort((a,b)=>a-b);
    if (hi.length > lo.length) lo.unshift(hi.shift());
  };
  const remove = (arr, val) => { const i=arr.indexOf(val); if(i>-1) arr.splice(i,1); };
  const median = () => k%2 ? lo[0] : (lo[0]+hi[0])/2;
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    add(nums[i]);
    if (i >= k-1) {
      result.push(median());
      const out = nums[i-k+1];
      if (lo.includes(out)) { remove(lo, out); if (hi.length>lo.length) lo.unshift(hi.shift()); }
      else { remove(hi, out); if (lo.length>hi.length+1) hi.unshift(lo.shift()); }
    }
  }
  return result;
}`,
    java: `public double[] medianSlidingWindow(int[] nums, int k) {
    TreeMap<Integer,Integer> lo = new TreeMap<>(Collections.reverseOrder());
    TreeMap<Integer,Integer> hi = new TreeMap<>();
    // ... complex implementation with balanced BSTs
    double[] res = new double[nums.length - k + 1];
    return res;
}`,
  },
  defaultInput: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, -1, -3, 5, 3, 6, 7],
      placeholder: '1,3,-1,-3,5,3,6,7',
      helperText: 'Input array',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of the sliding window',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, medians: number[]): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Sliding Window Median',
          entries: [
            { key: 'Window Size', value: String(k) },
            { key: 'Medians So Far', value: medians.map(m => m.toString()).join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find median of every window of size k=${k}. Uses two heaps with lazy deletion. Array length = ${n}.`,
      variables: { n, k },
      visualization: makeViz({}, {}, []),
    });

    const lo: number[] = [];
    const hi: number[] = [];
    const medians: number[] = [];

    const addToHeaps = (num: number) => {
      lo.push(num);
      lo.sort((a, b) => b - a);
      hi.push(lo.shift()!);
      hi.sort((a, b) => a - b);
      if (hi.length > lo.length) lo.unshift(hi.shift()!);
      lo.sort((a, b) => b - a);
    };

    const removeFromHeaps = (num: number) => {
      const loIdx = lo.indexOf(num);
      if (loIdx !== -1) lo.splice(loIdx, 1);
      else {
        const hiIdx = hi.indexOf(num);
        if (hiIdx !== -1) hi.splice(hiIdx, 1);
      }
      // rebalance
      while (hi.length > lo.length) lo.unshift(hi.shift()!);
      while (lo.length > hi.length + 1) hi.unshift(lo.shift()!);
      lo.sort((a, b) => b - a);
      hi.sort((a, b) => a - b);
    };

    for (let i = 0; i < n; i++) {
      addToHeaps(nums[i]);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = Math.max(0, i - k + 1); j <= i; j++) {
        highlights[j] = j === i ? 'active' : 'pointer';
        labels[j] = j === Math.max(0, i - k + 1) ? 'L' : j === i ? 'R' : '';
      }

      if (i >= k - 1) {
        const median = k % 2 ? lo[0] : (lo[0] + hi[0]) / 2;
        medians.push(median);
        highlights[i] = 'found';
        steps.push({
          line: 6,
          explanation: `Window [${i - k + 1}..${i}] = [${nums.slice(i - k + 1, i + 1).join(', ')}]. Median = ${median}. Medians so far: [${medians.join(', ')}].`,
          variables: { windowStart: i - k + 1, windowEnd: i, median, loTop: lo[0], hiTop: hi[0] || 'N/A' },
          visualization: makeViz(highlights, labels, [...medians]),
        });
        removeFromHeaps(nums[i - k + 1]);
      } else {
        steps.push({
          line: 4,
          explanation: `Added nums[${i}]=${nums[i]} to heaps. Window not full yet (have ${i + 1}/${k} elements).`,
          variables: { index: i, value: nums[i], loSize: lo.length, hiSize: hi.length },
          visualization: makeViz(highlights, labels, [...medians]),
        });
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 10,
      explanation: `Done. Sliding window medians: [${medians.join(', ')}]. Total windows: ${medians.length}.`,
      variables: { result: medians },
      visualization: makeViz(finalH, {}, medians),
    });

    return steps;
  },
};

export default slidingWindowMedianIi;
