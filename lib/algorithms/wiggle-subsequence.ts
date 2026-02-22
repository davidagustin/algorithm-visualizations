import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wiggleSubsequence: AlgorithmDefinition = {
  id: 'wiggle-subsequence',
  title: 'Wiggle Subsequence',
  leetcodeNumber: 376,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A wiggle sequence is one where differences between successive numbers strictly alternate between positive and negative. Given nums, return the length of the longest wiggle subsequence. Track two DP values: up (ends with upward wiggle) and down (ends with downward wiggle).',
  tags: ['dynamic programming', 'greedy', 'array'],

  code: {
    pseudocode: `function wiggleMaxLength(nums):
  if len(nums) < 2: return len(nums)
  up = 1, down = 1
  for i from 1 to len(nums)-1:
    if nums[i] > nums[i-1]:
      up = down + 1
    elif nums[i] < nums[i-1]:
      down = up + 1
  return max(up, down)`,

    python: `def wiggleMaxLength(nums: list[int]) -> int:
    if len(nums) < 2:
        return len(nums)
    up = down = 1
    for i in range(1, len(nums)):
        if nums[i] > nums[i-1]:
            up = down + 1
        elif nums[i] < nums[i-1]:
            down = up + 1
    return max(up, down)`,

    javascript: `function wiggleMaxLength(nums) {
  if (nums.length < 2) return nums.length;
  let up = 1, down = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i-1]) {
      up = down + 1;
    } else if (nums[i] < nums[i-1]) {
      down = up + 1;
    }
  }
  return Math.max(up, down);
}`,

    java: `public int wiggleMaxLength(int[] nums) {
    if (nums.length < 2) return nums.length;
    int up = 1, down = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i-1]) {
            up = down + 1;
        } else if (nums[i] < nums[i-1]) {
            down = up + 1;
        }
    }
    return Math.max(up, down);
}`,
  },

  defaultInput: { nums: [1, 7, 4, 9, 2, 5] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 7, 4, 9, 2, 5],
      placeholder: '1,7,4,9,2,5',
      helperText: 'Array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (currentIdx: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels: { [currentIdx]: 'i' },
    });

    if (nums.length < 2) {
      steps.push({
        line: 2,
        explanation: `Array has fewer than 2 elements. Return ${nums.length}.`,
        variables: { result: nums.length },
        visualization: { type: 'array', array: [...nums], highlights: {}, labels: {} },
      });
      return steps;
    }

    let up = 1;
    let down = 1;

    steps.push({
      line: 3,
      explanation: 'Initialize up = 1, down = 1. Every single element is a trivial wiggle sequence.',
      variables: { up, down },
      visualization: makeViz(0, { 0: 'active' }),
    });

    for (let i = 1; i < nums.length; i++) {
      const diff = nums[i] - nums[i - 1];
      const prevUp = up;
      const prevDown = down;

      if (diff > 0) {
        up = down + 1;
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${nums[i]} > nums[${i - 1}]=${nums[i - 1]} (going up). up = down + 1 = ${prevDown} + 1 = ${up}. down stays ${down}.`,
          variables: { i, diff, up, down },
          visualization: makeViz(i, { [i]: 'active', [i - 1]: 'comparing' }),
        });
      } else if (diff < 0) {
        down = up + 1;
        steps.push({
          line: 8,
          explanation: `nums[${i}]=${nums[i]} < nums[${i - 1}]=${nums[i - 1]} (going down). down = up + 1 = ${prevUp} + 1 = ${down}. up stays ${up}.`,
          variables: { i, diff, up, down },
          visualization: makeViz(i, { [i]: 'active', [i - 1]: 'comparing' }),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `nums[${i}]=${nums[i]} == nums[${i - 1}]=${nums[i - 1]} (equal). No change. up=${up}, down=${down}.`,
          variables: { i, diff, up, down },
          visualization: makeViz(i, { [i]: 'visited', [i - 1]: 'visited' }),
        });
      }
    }

    const result = Math.max(up, down);
    steps.push({
      line: 9,
      explanation: `Done! Longest wiggle subsequence length = max(up, down) = max(${up}, ${down}) = ${result}.`,
      variables: { up, down, result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default wiggleSubsequence;
