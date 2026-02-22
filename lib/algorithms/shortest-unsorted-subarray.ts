import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const shortestUnsortedSubarray: AlgorithmDefinition = {
  id: 'shortest-unsorted-subarray',
  title: 'Shortest Unsorted Continuous Subarray',
  leetcodeNumber: 581,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an integer array, find the shortest subarray that if sorted makes the entire array sorted. Find the leftmost and rightmost elements that are out of place by tracking max from left and min from right.',
  tags: ['array', 'sorting', 'two pointers', 'monotonic stack'],

  code: {
    pseudocode: `function findUnsortedSubarray(nums):
  n = length(nums)
  maxSeen = -Inf; right = -1
  minSeen = +Inf; left = -1
  for i from 0 to n-1:
    if nums[i] < maxSeen: right = i
    else: maxSeen = nums[i]
  for i from n-1 down to 0:
    if nums[i] > minSeen: left = i
    else: minSeen = nums[i]
  return right == -1 ? 0 : right - left + 1`,

    python: `def findUnsortedSubarray(nums: list[int]) -> int:
    n = len(nums)
    max_seen, right = float('-inf'), -1
    min_seen, left = float('inf'), -1
    for i in range(n):
        if nums[i] < max_seen:
            right = i
        else:
            max_seen = nums[i]
    for i in range(n - 1, -1, -1):
        if nums[i] > min_seen:
            left = i
        else:
            min_seen = nums[i]
    return 0 if right == -1 else right - left + 1`,

    javascript: `function findUnsortedSubarray(nums) {
  let maxSeen = -Infinity, right = -1;
  let minSeen = Infinity, left = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < maxSeen) right = i;
    else maxSeen = nums[i];
  }
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] > minSeen) left = i;
    else minSeen = nums[i];
  }
  return right === -1 ? 0 : right - left + 1;
}`,

    java: `public int findUnsortedSubarray(int[] nums) {
    int maxSeen = Integer.MIN_VALUE, right = -1;
    int minSeen = Integer.MAX_VALUE, left = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] < maxSeen) right = i;
        else maxSeen = nums[i];
    }
    for (int i = nums.length - 1; i >= 0; i--) {
        if (nums[i] > minSeen) left = i;
        else minSeen = nums[i];
    }
    return right == -1 ? 0 : right - left + 1;
}`,
  },

  defaultInput: {
    nums: [2, 6, 4, 8, 10, 9, 15],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 6, 4, 8, 10, 9, 15],
      placeholder: '2,6,4,8,10,9,15',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    let maxSeen = -Infinity;
    let right = -1;

    steps.push({
      line: 1,
      explanation: 'Left-to-right pass: track running max. If nums[i] < maxSeen, element is out of place, update right boundary.',
      variables: { maxSeen: '-Inf', right: -1 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < n; i++) {
      if (nums[i] < maxSeen) {
        right = i;
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} < maxSeen=${maxSeen}. Out of place! Update right=${right}.`,
          variables: { i, value: nums[i], maxSeen, right },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' },
            labels: { [i]: `right=${i}` },
          },
        });
      } else {
        maxSeen = nums[i];
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${nums[i]} >= maxSeen. In sorted position. Update maxSeen=${maxSeen}.`,
          variables: { i, value: nums[i], maxSeen, right },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'sorted' },
            labels: { [i]: 'ok' },
          },
        });
      }
    }

    let minSeen = Infinity;
    let left = -1;

    steps.push({
      line: 7,
      explanation: 'Right-to-left pass: track running min. If nums[i] > minSeen, update left boundary.',
      variables: { minSeen: '+Inf', left: -1, right },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: right !== -1 ? { [right]: 'active' } : {},
        labels: right !== -1 ? { [right]: 'right' } : {},
      },
    });

    for (let i = n - 1; i >= 0; i--) {
      if (nums[i] > minSeen) {
        left = i;
        steps.push({
          line: 8,
          explanation: `nums[${i}]=${nums[i]} > minSeen=${minSeen}. Out of place! Update left=${left}.`,
          variables: { i, value: nums[i], minSeen, left },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' },
            labels: { [i]: `left=${i}` },
          },
        });
      } else {
        minSeen = nums[i];
        steps.push({
          line: 9,
          explanation: `nums[${i}]=${nums[i]} <= minSeen. In sorted position. Update minSeen=${minSeen}.`,
          variables: { i, value: nums[i], minSeen, left },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'sorted' },
            labels: { [i]: 'ok' },
          },
        });
      }
    }

    const result = right === -1 ? 0 : right - left + 1;

    steps.push({
      line: 10,
      explanation: `Result: left=${left}, right=${right}. Shortest unsorted subarray length = ${result}.`,
      variables: { left, right, result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: right !== -1
          ? Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'comparing']))
          : {},
        labels: right !== -1 ? { [left]: 'left', [right]: 'right' } : {},
      },
    });

    return steps;
  },
};

export default shortestUnsortedSubarray;
