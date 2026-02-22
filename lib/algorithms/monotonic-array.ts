import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const monotonicArray: AlgorithmDefinition = {
  id: 'monotonic-array',
  title: 'Monotonic Array',
  leetcodeNumber: 896,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'An array is monotonic if it is entirely non-increasing or non-decreasing. Check both conditions simultaneously in a single pass using two boolean flags. If either condition is still satisfied at the end, the array is monotonic.',
  tags: ['array', 'monotonic'],

  code: {
    pseudocode: `function isMonotonic(nums):
  increasing = true
  decreasing = true
  for i from 1 to length(nums)-1:
    if nums[i] > nums[i-1]:
      decreasing = false
    if nums[i] < nums[i-1]:
      increasing = false
  return increasing or decreasing`,

    python: `def isMonotonic(nums: list[int]) -> bool:
    increasing = decreasing = True
    for i in range(1, len(nums)):
        if nums[i] > nums[i - 1]:
            decreasing = False
        if nums[i] < nums[i - 1]:
            increasing = False
    return increasing or decreasing`,

    javascript: `function isMonotonic(nums) {
  let increasing = true, decreasing = true;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) decreasing = false;
    if (nums[i] < nums[i - 1]) increasing = false;
  }
  return increasing || decreasing;
}`,

    java: `public boolean isMonotonic(int[] nums) {
    boolean increasing = true, decreasing = true;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) decreasing = false;
        if (nums[i] < nums[i - 1]) increasing = false;
    }
    return increasing || decreasing;
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 2, 3],
      placeholder: '1,2,2,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    let increasing = true;
    let decreasing = true;

    steps.push({
      line: 1,
      explanation: `Initialize: increasing=true, decreasing=true. Check array of length ${nums.length} for monotonicity.`,
      variables: { increasing, decreasing },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 1; i < nums.length; i++) {
      const prev = nums[i - 1];
      const curr = nums[i];
      const incChanged = curr < prev;
      const decChanged = curr > prev;

      if (incChanged) increasing = false;
      if (decChanged) decreasing = false;

      let highlight = 'sorted';
      let label = 'ok';

      if (incChanged) {
        highlight = 'mismatch';
        label = 'breaks inc';
      } else if (decChanged) {
        highlight = 'comparing';
        label = 'breaks dec';
      }

      steps.push({
        line: 4,
        explanation: `Compare nums[${i - 1}]=${prev} and nums[${i}]=${curr}. ${incChanged ? 'Breaks increasing. ' : ''}${decChanged ? 'Breaks decreasing. ' : ''}increasing=${increasing}, decreasing=${decreasing}.`,
        variables: { i, prev, curr, increasing, decreasing },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i - 1]: 'active', [i]: highlight },
          labels: { [i]: label },
        },
      });

      if (!increasing && !decreasing) {
        steps.push({
          line: 8,
          explanation: 'Both monotonic properties broken. Array is not monotonic. Return false.',
          variables: { increasing, decreasing, result: false },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i - 1]: 'mismatch', [i]: 'mismatch' },
            labels: {},
          },
        });
        return steps;
      }
    }

    const result = increasing || decreasing;
    const which = increasing ? 'non-decreasing' : 'non-increasing';

    steps.push({
      line: 8,
      explanation: `Scan complete. Array is ${which} (monotonic). Return true.`,
      variables: { increasing, decreasing, result },
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

export default monotonicArray;
