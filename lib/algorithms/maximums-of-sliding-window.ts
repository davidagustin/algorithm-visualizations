import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumsOfSlidingWindow: AlgorithmDefinition = {
  id: 'maximums-of-sliding-window',
  title: 'Maximums of Sliding Window',
  leetcodeNumber: 239,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Find the maximum value in each sliding window of size k. We use a monotonic deque that stores indices in decreasing order of their values. The front of the deque always holds the index of the current window maximum.',
  tags: ['Stack', 'Deque', 'Sliding Window'],
  code: {
    pseudocode: `function maxSlidingWindow(nums, k):
  deque = []  // stores indices
  result = []
  for i from 0 to n-1:
    while deque not empty and deque.front <= i - k:
      remove front of deque
    while deque not empty and nums[deque.back] <= nums[i]:
      remove back of deque
    add i to back of deque
    if i >= k - 1:
      result.append(nums[deque.front])
  return result`,
    python: `from collections import deque
def maxSlidingWindow(nums, k):
    dq = deque()
    result = []
    for i in range(len(nums)):
        while dq and dq[0] <= i - k:
            dq.popleft()
        while dq and nums[dq[-1]] <= nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
    javascript: `function maxSlidingWindow(nums, k) {
  const deque = []; // stores indices
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
    java: `public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    int idx = 0;
    for (int i = 0; i < nums.length; i++) {
        while (!deque.isEmpty() && deque.peekFirst() <= i - k)
            deque.pollFirst();
        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i])
            deque.pollLast();
        deque.offerLast(i);
        if (i >= k - 1)
            result[idx++] = nums[deque.peekFirst()];
    }
    return result;
}`,
  },
  defaultInput: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, -1, -3, 5, 3, 6, 7],
      placeholder: 'e.g. 1,3,-1,-3,5,3,6,7',
      helperText: 'Comma-separated numbers',
    },
    {
      name: 'k',
      label: 'Window Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Size of the sliding window',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const deque: number[] = []; // indices
    const result: number[] = [];

    function makeViz(i: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      // Window boundaries
      const winStart = Math.max(0, i - k + 1);
      for (let j = 0; j < n; j++) {
        if (j >= winStart && j <= i) {
          highlights[j] = 'comparing';
        } else {
          highlights[j] = j < winStart ? 'visited' : 'default';
        }
      }

      // Current element
      highlights[i] = 'active';
      labels[i] = 'i';

      // Deque front = max
      if (deque.length > 0) {
        highlights[deque[0]] = 'found';
        labels[deque[0]] = 'max';
      }

      return {
        type: 'array',
        array: nums,
        highlights,
        labels,
        auxData: {
          label: 'Deque & Result',
          entries: [
            { key: 'Deque (indices)', value: deque.length > 0 ? deque.map(d => `${d}(${nums[d]})`).join(', ') : 'empty' },
            { key: 'Window', value: `[${winStart}..${i}]` },
            { key: 'Result', value: result.length > 0 ? `[${result.join(', ')}]` : '[]' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize empty deque and result. Window size k=${k}.`,
      variables: { k, n },
      visualization: {
        type: 'array',
        array: nums,
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'default'])),
        labels: {},
        auxData: {
          label: 'Deque & Result',
          entries: [
            { key: 'Deque', value: 'empty' },
            { key: 'Result', value: '[]' },
          ],
        },
      },
    });

    for (let i = 0; i < n; i++) {
      // Remove front if out of window
      if (deque.length > 0 && deque[0] <= i - k) {
        const removed = deque.shift()!;
        steps.push({
          line: 5,
          explanation: `Index ${removed} is out of window [${i - k + 1}..${i}]. Remove from front of deque.`,
          variables: { i, removed, deque: [...deque] },
          visualization: makeViz(i),
        });
      }

      // Remove smaller elements from back
      while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
        const removed = deque.pop()!;
        steps.push({
          line: 7,
          explanation: `nums[${removed}]=${nums[removed]} <= nums[${i}]=${nums[i]}. Remove ${removed} from back of deque.`,
          variables: { i, removed, deque: [...deque] },
          visualization: makeViz(i),
        });
      }

      deque.push(i);
      steps.push({
        line: 8,
        explanation: `Add index ${i} (value ${nums[i]}) to back of deque.`,
        variables: { i, deque: [...deque] },
        visualization: makeViz(i),
      });

      if (i >= k - 1) {
        result.push(nums[deque[0]]);
        steps.push({
          line: 10,
          explanation: `Window [${i - k + 1}..${i}] is complete. Max = nums[${deque[0]}] = ${nums[deque[0]]}. Add to result.`,
          variables: { windowMax: nums[deque[0]], result: [...result] },
          visualization: makeViz(i),
        });
      }
    }

    // Final result
    steps.push({
      line: 11,
      explanation: `Done! Sliding window maximums: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: {
        type: 'array',
        array: nums,
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: {},
        auxData: {
          label: 'Final Result',
          entries: [{ key: 'Maximums', value: `[${result.join(', ')}]` }],
        },
      },
    });

    return steps;
  },
};

export default maximumsOfSlidingWindow;
