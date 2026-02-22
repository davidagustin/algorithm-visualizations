import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimizeMaximumOfArray: AlgorithmDefinition = {
  id: 'minimize-maximum-of-array',
  title: 'Minimize Maximum of Array',
  leetcodeNumber: 2439,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array of non-negative integers, you can perform operations: choose index i > 0 and decrease nums[i] by 1, increase nums[i-1] by 1. Find the minimum possible maximum value after any number of operations. The greedy insight is that the optimal answer for prefix [0..i] is ceil(prefixSum[i] / (i+1)), and we take the max over all prefixes.',
  tags: ['greedy', 'prefix sum', 'math', 'array'],

  code: {
    pseudocode: `function minimizeArrayValue(nums):
  result = nums[0]
  prefixSum = nums[0]
  for i from 1 to n-1:
    prefixSum += nums[i]
    // ceil(prefixSum / (i+1))
    avg = (prefixSum + i) / (i + 1)
    result = max(result, avg)
  return result`,

    python: `def minimizeArrayValue(nums: list[int]) -> int:
    result = nums[0]
    prefix = nums[0]
    for i in range(1, len(nums)):
        prefix += nums[i]
        result = max(result, (prefix + i) // (i + 1))
    return result`,

    javascript: `function minimizeArrayValue(nums) {
  let result = nums[0];
  let prefix = nums[0];
  for (let i = 1; i < nums.length; i++) {
    prefix += nums[i];
    result = Math.max(result, Math.ceil(prefix / (i + 1)));
  }
  return result;
}`,

    java: `public int minimizeArrayValue(int[] nums) {
    long result = nums[0];
    long prefix = nums[0];
    for (int i = 1; i < nums.length; i++) {
        prefix += nums[i];
        result = Math.max(result, (prefix + i) / (i + 1));
    }
    return (int) result;
}`,
  },

  defaultInput: {
    nums: [3, 7, 1, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 7, 1, 6],
      placeholder: '3,7,1,6',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start with result = nums[0] = ${nums[0]}. The minimum max of just the first element is itself.`,
      variables: { result: nums[0], prefixSum: nums[0] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'active' } as Record<number, string>,
        labels: { 0: 'start' } as Record<number, string>,
      },
    });

    let result = nums[0];
    let prefixSum = nums[0];

    for (let i = 1; i < nums.length; i++) {
      prefixSum += nums[i];
      const avg = Math.ceil(prefixSum / (i + 1));
      const prevResult = result;
      result = Math.max(result, avg);

      steps.push({
        line: 4,
        explanation: `Index ${i}: prefixSum = ${prefixSum}, ceil(${prefixSum} / ${i + 1}) = ${avg}. Result = max(${prevResult}, ${avg}) = ${result}.`,
        variables: { i, 'nums[i]': nums[i], prefixSum, avg, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {
            ...Object.fromEntries(Array.from({ length: i + 1 }, (_, j) => [j, j < i ? 'visited' : 'active'])),
          } as Record<number, string>,
          labels: { [i]: `avg=${avg}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Minimum possible maximum of the array is ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default minimizeMaximumOfArray;
