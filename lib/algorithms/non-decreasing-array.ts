import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const nonDecreasingArray: AlgorithmDefinition = {
  id: 'non-decreasing-array',
  title: 'Non-decreasing Array',
  leetcodeNumber: 665,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an array of n integers, check if it can become non-decreasing by modifying at most one element. When a violation is found at index i (nums[i-1] > nums[i]), decide whether to lower nums[i-1] or raise nums[i] based on the previous context.',
  tags: ['array', 'greedy'],

  code: {
    pseudocode: `function checkPossibility(nums):
  count = 0
  for i from 1 to length(nums)-1:
    if nums[i-1] > nums[i]:
      count += 1
      if count > 1: return false
      if i >= 2 and nums[i-2] > nums[i]:
        nums[i] = nums[i-1]
      else:
        nums[i-1] = nums[i]
  return true`,

    python: `def checkPossibility(nums: list[int]) -> bool:
    count = 0
    for i in range(1, len(nums)):
        if nums[i - 1] > nums[i]:
            count += 1
            if count > 1:
                return False
            if i >= 2 and nums[i - 2] > nums[i]:
                nums[i] = nums[i - 1]
            else:
                nums[i - 1] = nums[i]
    return True`,

    javascript: `function checkPossibility(nums) {
  let count = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] > nums[i]) {
      count++;
      if (count > 1) return false;
      if (i >= 2 && nums[i - 2] > nums[i]) {
        nums[i] = nums[i - 1];
      } else {
        nums[i - 1] = nums[i];
      }
    }
  }
  return true;
}`,

    java: `public boolean checkPossibility(int[] nums) {
    int count = 0;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i - 1] > nums[i]) {
            count++;
            if (count > 1) return false;
            if (i >= 2 && nums[i - 2] > nums[i]) {
                nums[i] = nums[i - 1];
            } else {
                nums[i - 1] = nums[i];
            }
        }
    }
    return true;
}`,
  },

  defaultInput: {
    nums: [4, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 3],
      placeholder: '4,2,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    let count = 0;

    steps.push({
      line: 1,
      explanation: `Check if array can become non-decreasing with at most 1 modification. Array: ${JSON.stringify(nums)}.`,
      variables: { count: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 1; i < nums.length; i++) {
      if (nums[i - 1] > nums[i]) {
        count++;

        steps.push({
          line: 4,
          explanation: `Violation at i=${i}: nums[${i - 1}]=${nums[i - 1]} > nums[${i}]=${nums[i]}. Violations so far: ${count}.`,
          variables: { i, count, 'nums[i-1]': nums[i - 1], 'nums[i]': nums[i] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i - 1]: 'mismatch', [i]: 'mismatch' },
            labels: { [i - 1]: 'big', [i]: 'small' },
          },
        });

        if (count > 1) {
          steps.push({
            line: 5,
            explanation: `More than 1 violation. Cannot fix with one modification. Return false.`,
            variables: { count, result: false },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [i - 1]: 'mismatch', [i]: 'mismatch' },
              labels: {},
            },
          });
          return steps;
        }

        if (i >= 2 && nums[i - 2] > nums[i]) {
          const oldVal = nums[i];
          nums[i] = nums[i - 1];
          steps.push({
            line: 7,
            explanation: `nums[${i - 2}]=${nums[i - 2]} > nums[${i}]=${oldVal}, so raise nums[${i}] to ${nums[i]} to preserve nums[${i - 2}] constraint.`,
            variables: { i, 'modified index': i, 'new value': nums[i] },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [i]: 'found' },
              labels: { [i]: `was ${oldVal}` },
            },
          });
        } else {
          const oldVal = nums[i - 1];
          nums[i - 1] = nums[i];
          steps.push({
            line: 9,
            explanation: `Lower nums[${i - 1}] from ${oldVal} to ${nums[i - 1]} to fix violation without breaking prior order.`,
            variables: { i, 'modified index': i - 1, 'new value': nums[i - 1] },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: { [i - 1]: 'found' },
              labels: { [i - 1]: `was ${oldVal}` },
            },
          });
        }
      } else {
        steps.push({
          line: 3,
          explanation: `nums[${i - 1}]=${nums[i - 1]} <= nums[${i}]=${nums[i]}. No violation. Continue.`,
          variables: { i, count },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i - 1]: 'sorted', [i]: 'sorted' },
            labels: {},
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Scan complete with ${count} violation(s) fixed. Array can be made non-decreasing. Return true.`,
      variables: { count, result: true },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default nonDecreasingArray;
