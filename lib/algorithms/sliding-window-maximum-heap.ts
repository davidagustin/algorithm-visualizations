import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const slidingWindowMaximumHeap: AlgorithmDefinition = {
  id: 'sliding-window-maximum-heap',
  title: 'Sliding Window Maximum (Heap)',
  leetcodeNumber: 239,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given an array nums and a window size k, return the maximum value in each sliding window. This heap approach uses a max heap storing (value, index) pairs and lazily removes stale entries (indices outside the window).',
  tags: ['heap', 'sliding window', 'array', 'monotonic'],

  code: {
    pseudocode: `function maxSlidingWindow(nums, k):
  maxHeap = max heap of (val, index)
  result = []
  for i in 0..n-1:
    push (-nums[i], i) to maxHeap
    while heap top index <= i - k:
      pop from maxHeap (stale)
    if i >= k-1:
      result.append(-heap top value)
  return result`,

    python: `import heapq

def maxSlidingWindow(nums: list[int], k: int) -> list[int]:
    heap = []
    result = []
    for i, num in enumerate(nums):
        heapq.heappush(heap, (-num, i))
        while heap[0][1] <= i - k:
            heapq.heappop(heap)
        if i >= k - 1:
            result.append(-heap[0][0])
    return result`,

    javascript: `function maxSlidingWindow(nums, k) {
  // Simulate max heap with sorted array
  let heap = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    heap.push([-nums[i], i]);
    heap.sort((a, b) => a[0] - b[0]);
    while (heap[0][1] <= i - k) heap.shift();
    if (i >= k - 1) result.push(-heap[0][0]);
  }
  return result;
}`,

    java: `public int[] maxSlidingWindow(int[] nums, int k) {
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b) -> b[0]-a[0]);
    int[] result = new int[nums.length - k + 1];
    int ri = 0;
    for (int i = 0; i < nums.length; i++) {
        heap.offer(new int[]{nums[i], i});
        while (heap.peek()[1] <= i - k) heap.poll();
        if (i >= k - 1) result[ri++] = heap.peek()[0];
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, -1, -3, 5, 3, 6, 7],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, -1, -3, 5, 3, 6, 7],
      placeholder: '1,3,-1,-3,5,3,6,7',
      helperText: 'Input array of integers',
    },
    {
      name: 'k',
      label: 'Window Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Sliding window size',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    let heap: [number, number][] = []; // [-val, index]
    const result: number[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Start sliding window maximum with array of length ${n} and window size ${k}.`,
      variables: { n, k },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 0; i < n; i++) {
      heap.push([-nums[i], i]);
      heap.sort((a, b) => a[0] - b[0]); // min-heap on negated = max-heap

      // Remove stale entries
      const staleCount = heap.filter(([, idx]) => idx <= i - k).length;
      heap = heap.filter(([, idx]) => idx > i - k);

      const windowStart = Math.max(0, i - k + 1);
      const windowHighlights: Record<number, string> = {};
      for (let w = windowStart; w <= i; w++) windowHighlights[w] = 'active';

      if (staleCount > 0) {
        steps.push({
          line: 6,
          explanation: `Removed ${staleCount} stale heap entries (indices outside window [${windowStart},${i}]).`,
          variables: { i, windowStart, staleRemoved: staleCount, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: nums,
            highlights: windowHighlights,
            labels: { [windowStart]: 'start', [i]: 'end' },
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 3,
          explanation: `Added nums[${i}]=${nums[i]} to heap. Window [${windowStart},${i}]. Heap top is ${-heap[0][0]} at index ${heap[0][1]}.`,
          variables: { i, value: nums[i], heapTop: -heap[0][0], heapTopIdx: heap[0][1] },
          visualization: {
            type: 'array',
            array: nums,
            highlights: { ...windowHighlights, [i]: 'current' },
            labels: { [windowStart]: 'start', [i]: 'new' },
          } as ArrayVisualization,
        });
      }

      if (i >= k - 1) {
        const maxVal = -heap[0][0];
        result.push(maxVal);
        const highlights: Record<number, string> = {};
        for (let w = windowStart; w <= i; w++) highlights[w] = 'active';
        highlights[heap[0][1]] = 'found';

        steps.push({
          line: 8,
          explanation: `Window [${windowStart},${i}] maximum is ${maxVal} at index ${heap[0][1]}. Results so far: [${result.join(', ')}]`,
          variables: { windowStart, windowEnd: i, max: maxVal, resultLen: result.length },
          visualization: {
            type: 'array',
            array: nums,
            highlights,
            labels: { [heap[0][1]]: `max=${maxVal}`, [windowStart]: `w${result.length}` },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Sliding window maximums: [${result.join(', ')}]`,
      variables: { result: result.join(',') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `w${i + 1}=${v}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default slidingWindowMaximumHeap;
