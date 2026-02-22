import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const thirdMaximumNumber: AlgorithmDefinition = {
  id: 'third-maximum-number',
  title: 'Third Maximum Number',
  leetcodeNumber: 414,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an integer array, return the third distinct maximum. If it does not exist, return the maximum instead. Track the top three distinct maximums using three variables, updating them as you scan the array.',
  tags: ['array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function thirdMax(nums):
  first = second = third = -Infinity
  for num in nums:
    if num == first or num == second or num == third:
      continue
    if num > first:
      third = second; second = first; first = num
    elif num > second:
      third = second; second = num
    elif num > third:
      third = num
  return third if third != -Infinity else first`,

    python: `def thirdMax(nums: list[int]) -> int:
    first = second = third = float('-inf')
    for num in nums:
        if num in (first, second, third):
            continue
        if num > first:
            third, second, first = second, first, num
        elif num > second:
            third, second = second, num
        elif num > third:
            third = num
    return third if third != float('-inf') else first`,

    javascript: `function thirdMax(nums) {
  let first = -Infinity, second = -Infinity, third = -Infinity;
  for (const num of nums) {
    if (num === first || num === second || num === third) continue;
    if (num > first) { third = second; second = first; first = num; }
    else if (num > second) { third = second; second = num; }
    else if (num > third) { third = num; }
  }
  return third !== -Infinity ? third : first;
}`,

    java: `public int thirdMax(int[] nums) {
    long first = Long.MIN_VALUE, second = Long.MIN_VALUE, third = Long.MIN_VALUE;
    for (int num : nums) {
        if (num == first || num == second || num == third) continue;
        if (num > first) { third = second; second = first; first = num; }
        else if (num > second) { third = second; second = num; }
        else if (num > third) { third = num; }
    }
    return third != Long.MIN_VALUE ? (int)third : (int)first;
}`,
  },

  defaultInput: {
    nums: [3, 2, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 1],
      placeholder: '3,2,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const NEG_INF = -Infinity;
    let first = NEG_INF;
    let second = NEG_INF;
    let third = NEG_INF;

    steps.push({
      line: 1,
      explanation: 'Initialize first, second, third to -Infinity. We will track top 3 distinct values.',
      variables: { first: '-Inf', second: '-Inf', third: '-Inf' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];

      if (num === first || num === second || num === third) {
        steps.push({
          line: 3,
          explanation: `nums[${i}]=${num} is a duplicate of an existing top-3 value. Skip.`,
          variables: { i, num, first, second, third },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'dup' },
          },
        });
        continue;
      }

      if (num > first) {
        third = second;
        second = first;
        first = num;
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${num} > first=${first === num ? 'prev' : first}. Shift down: third=${isFinite(third) ? third : '-Inf'}, second=${isFinite(second) ? second : '-Inf'}, first=${first}.`,
          variables: { i, num, first, second, third: isFinite(third) ? third : '-Inf' },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'found' },
            labels: { [i]: `1st=${first}` },
          },
        });
      } else if (num > second) {
        third = second;
        second = num;
        steps.push({
          line: 8,
          explanation: `nums[${i}]=${num} is new second max. third=${isFinite(third) ? third : '-Inf'}, second=${second}.`,
          variables: { i, num, first, second, third: isFinite(third) ? third : '-Inf' },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active' },
            labels: { [i]: `2nd=${second}` },
          },
        });
      } else if (num > third) {
        third = num;
        steps.push({
          line: 10,
          explanation: `nums[${i}]=${num} is new third max. third=${third}.`,
          variables: { i, num, first, second, third },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'comparing' },
            labels: { [i]: `3rd=${third}` },
          },
        });
      }
    }

    const result = isFinite(third) ? third : first;

    steps.push({
      line: 11,
      explanation: `Result: third max is ${isFinite(third) ? third : 'not found, so return first=' + first}. Answer = ${result}.`,
      variables: { first, second, third: isFinite(third) ? third : '-Inf', result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default thirdMaximumNumber;
