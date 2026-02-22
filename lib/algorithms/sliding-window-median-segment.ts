import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const slidingWindowMedianSegment: AlgorithmDefinition = {
  id: 'sliding-window-median-segment',
  title: 'Sliding Window Median',
  leetcodeNumber: 480,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Find the median of each sliding window of size k. Use a segment tree or two heaps. As the window slides, add the new element and remove the outgoing element, then query the median in O(log n) per step.',
  tags: ['Segment Tree', 'Sliding Window', 'Heap', 'Two Pointers'],
  code: {
    pseudocode: `function medianSlidingWindow(nums, k):
  window = sorted structure of size k
  results = []

  for i from 0 to n-1:
    insert nums[i] into window
    if window.size > k:
      remove nums[i-k] from window
    if window.size == k:
      if k is odd: median = window[k/2]
      else: median = (window[k/2-1] + window[k/2]) / 2
      results.append(median)

  return results`,
    python: `import sortedcontainers

class Solution:
    def medianSlidingWindow(self, nums, k):
        window = sortedcontainers.SortedList()
        results = []
        for i, x in enumerate(nums):
            window.add(x)
            if len(window) > k:
                window.remove(nums[i-k])
            if len(window) == k:
                if k % 2 == 1:
                    results.append(float(window[k//2]))
                else:
                    results.append((window[k//2-1]+window[k//2])/2)
        return results`,
    javascript: `var medianSlidingWindow = function(nums, k) {
  // Simple O(nk) for visualization clarity
  const results = [];
  for (let i=0; i<=nums.length-k; i++) {
    const w = nums.slice(i, i+k).sort((a,b)=>a-b);
    results.push(k%2===1 ? w[k>>1] : (w[k/2-1]+w[k/2])/2);
  }
  return results;
};`,
    java: `class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        TreeMap<Integer,Integer> window = new TreeMap<>();
        double[] res = new double[nums.length-k+1];
        // add first k elements
        for(int i=0;i<k;i++) window.merge(nums[i],1,Integer::sum);
        // helper to find median via ordered map
        // ... (full implementation uses two TreeMaps for lower/upper halves)
        return res;
    }
}`,
  },
  defaultInput: { nums: [1,3,-1,-3,5,3,6,7], k: 3 },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [1,3,-1,-3,5,3,6,7], placeholder: '1,3,-1,-3,5,3,6,7' },
    { name: 'k', label: 'Window Size k', type: 'number', defaultValue: 3 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Sliding window median: nums=[${nums.join(',')}], k=${k}. Slide window and compute median at each position.`,
      variables: { nums: [...nums], k },
      visualization: { type: 'array', array: nums, highlights: {}, labels: {} },
    });

    const results: number[] = [];

    for (let i = 0; i <= n - k; i++) {
      const window = nums.slice(i, i + k).sort((a, b) => a - b);
      const median = k % 2 === 1 ? window[k >> 1] : (window[k / 2 - 1] + window[k / 2]) / 2;
      results.push(median);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j < n; j++) {
        if (j >= i && j < i + k) {
          highlights[j] = 'active';
          const rank = window.indexOf(nums[j]);
          if (k % 2 === 1 && rank === k >> 1) labels[j] = 'med';
          else if (k % 2 === 0 && (rank === k / 2 - 1 || rank === k / 2)) labels[j] = 'med';
        } else {
          highlights[j] = 'visited';
        }
      }

      steps.push({
        line: 8,
        explanation: `Window [${i},${i+k-1}]=[${nums.slice(i,i+k).join(',')}] → sorted=[${window.join(',')}] → median=${median}`,
        variables: { i, window, median, results: [...results] },
        visualization: { type: 'array', array: nums, highlights, labels },
      });
    }

    steps.push({
      line: 12,
      explanation: `Medians: [${results.join(', ')}]`,
      variables: { results },
      visualization: {
        type: 'array',
        array: results,
        highlights: Object.fromEntries(results.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(results.map((v, i) => [i, `${v}`])),
      },
    });

    return steps;
  },
};

export default slidingWindowMedianSegment;
