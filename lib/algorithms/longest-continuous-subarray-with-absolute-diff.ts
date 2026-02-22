import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestContinuousSubarrayWithAbsoluteDiff: AlgorithmDefinition = {
  id: 'longest-continuous-subarray-with-absolute-diff',
  title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
  leetcodeNumber: 1438,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of integers nums and an integer limit, return the size of the longest non-empty subarray such that the absolute difference between any two elements is at most limit. Use a sliding window with two monotonic deques to track the maximum and minimum values in the current window.',
  tags: ['sliding window', 'monotonic deque', 'array'],

  code: {
    pseudocode: `function longestSubarray(nums, limit):
  maxDeque = []  // decreasing, front = max
  minDeque = []  // increasing, front = min
  left = 0
  result = 0
  for right in range(len(nums)):
    while maxDeque and nums[maxDeque[-1]] <= nums[right]:
      maxDeque.pop()
    maxDeque.append(right)
    while minDeque and nums[minDeque[-1]] >= nums[right]:
      minDeque.pop()
    minDeque.append(right)
    while nums[maxDeque[0]] - nums[minDeque[0]] > limit:
      left++
      if maxDeque[0] < left: maxDeque.popleft()
      if minDeque[0] < left: minDeque.popleft()
    result = max(result, right - left + 1)
  return result`,

    python: `from collections import deque
def longestSubarray(nums: list[int], limit: int) -> int:
    max_dq, min_dq = deque(), deque()
    left = 0
    result = 0
    for right, n in enumerate(nums):
        while max_dq and nums[max_dq[-1]] <= n:
            max_dq.pop()
        max_dq.append(right)
        while min_dq and nums[min_dq[-1]] >= n:
            min_dq.pop()
        min_dq.append(right)
        while nums[max_dq[0]] - nums[min_dq[0]] > limit:
            left += 1
            if max_dq[0] < left: max_dq.popleft()
            if min_dq[0] < left: min_dq.popleft()
        result = max(result, right - left + 1)
    return result`,

    javascript: `function longestSubarray(nums, limit) {
  const maxDq = [], minDq = [];
  let left = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (maxDq.length && nums[maxDq[maxDq.length-1]] <= nums[right]) maxDq.pop();
    maxDq.push(right);
    while (minDq.length && nums[minDq[minDq.length-1]] >= nums[right]) minDq.pop();
    minDq.push(right);
    while (nums[maxDq[0]] - nums[minDq[0]] > limit) {
      left++;
      if (maxDq[0] < left) maxDq.shift();
      if (minDq[0] < left) minDq.shift();
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int longestSubarray(int[] nums, int limit) {
    Deque<Integer> maxDq = new ArrayDeque<>(), minDq = new ArrayDeque<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        while (!maxDq.isEmpty() && nums[maxDq.peekLast()] <= nums[right]) maxDq.pollLast();
        maxDq.offerLast(right);
        while (!minDq.isEmpty() && nums[minDq.peekLast()] >= nums[right]) minDq.pollLast();
        minDq.offerLast(right);
        while (nums[maxDq.peekFirst()] - nums[minDq.peekFirst()] > limit) {
            left++;
            if (maxDq.peekFirst() < left) maxDq.pollFirst();
            if (minDq.peekFirst() < left) minDq.pollFirst();
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [8, 2, 4, 7],
    limit: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [8, 2, 4, 7],
      placeholder: '8,2,4,7',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'limit',
      label: 'Absolute Diff Limit',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Maximum allowed absolute difference',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const limit = input.limit as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find longest subarray where max - min <= ${limit}. Use two monotonic deques: one tracking max indices (decreasing), one tracking min indices (increasing).`,
      variables: { limit, result: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const maxDq: number[] = [];
    const minDq: number[] = [];
    let left = 0;
    let result = 0;

    for (let right = 0; right < n; right++) {
      while (maxDq.length && nums[maxDq[maxDq.length - 1]] <= nums[right]) maxDq.pop();
      maxDq.push(right);
      while (minDq.length && nums[minDq[minDq.length - 1]] >= nums[right]) minDq.pop();
      minDq.push(right);

      steps.push({
        line: 6,
        explanation: `Expand right to ${right} (value ${nums[right]}). Window max = ${nums[maxDq[0]]}, min = ${nums[minDq[0]]}, diff = ${nums[maxDq[0]] - nums[minDq[0]]}.`,
        variables: { right, value: nums[right], windowMax: nums[maxDq[0]], windowMin: nums[minDq[0]], diff: nums[maxDq[0]] - nums[minDq[0]], limit },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {
            ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'active'])),
            [maxDq[0]]: 'found',
            [minDq[0]]: 'comparing',
          },
          labels: { [left]: 'L', [right]: 'R', [maxDq[0]]: 'MAX', [minDq[0]]: 'MIN' },
        } as ArrayVisualization,
      });

      while (nums[maxDq[0]] - nums[minDq[0]] > limit) {
        steps.push({
          line: 13,
          explanation: `Diff ${nums[maxDq[0]]} - ${nums[minDq[0]]} = ${nums[maxDq[0]] - nums[minDq[0]]} > ${limit}. Shrink: advance left from ${left}.`,
          variables: { left, diff: nums[maxDq[0]] - nums[minDq[0]], limit },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'mismatch', [right]: 'active' },
            labels: { [left]: 'L++', [right]: 'R' },
          } as ArrayVisualization,
        });
        left++;
        if (maxDq[0] < left) maxDq.shift();
        if (minDq[0] < left) minDq.shift();
      }

      const winSize = right - left + 1;
      if (winSize > result) result = winSize;

      steps.push({
        line: 17,
        explanation: `Window [${left}..${right}]: diff = ${nums[maxDq[0]] - nums[minDq[0]]} <= ${limit}. Size = ${winSize}. Best = ${result}.`,
        variables: { left, right, windowSize: winSize, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: winSize }, (_, i) => [left + i, 'found'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 18,
      explanation: `Longest subarray with absolute diff <= ${limit} has length ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestContinuousSubarrayWithAbsoluteDiff;
