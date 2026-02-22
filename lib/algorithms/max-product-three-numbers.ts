import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maxProductThreeNumbers: AlgorithmDefinition = {
  id: 'max-product-three-numbers',
  title: 'Maximum Product of Three Numbers',
  leetcodeNumber: 628,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an integer array, find the maximum product of three numbers. After sorting, the answer is either the product of the three largest numbers or the product of the two smallest (most negative) and the largest number.',
  tags: ['array', 'sorting', 'math', 'greedy'],

  code: {
    pseudocode: `function maximumProduct(nums):
  sort(nums)
  n = length(nums)
  option1 = nums[n-1] * nums[n-2] * nums[n-3]
  option2 = nums[0] * nums[1] * nums[n-1]
  return max(option1, option2)`,

    python: `def maximumProduct(nums: list[int]) -> int:
    nums.sort()
    n = len(nums)
    return max(nums[n-1] * nums[n-2] * nums[n-3],
               nums[0] * nums[1] * nums[n-1])`,

    javascript: `function maximumProduct(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  return Math.max(
    nums[n-1] * nums[n-2] * nums[n-3],
    nums[0] * nums[1] * nums[n-1]
  );
}`,

    java: `public int maximumProduct(int[] nums) {
    Arrays.sort(nums);
    int n = nums.length;
    return Math.max(
        nums[n-1] * nums[n-2] * nums[n-3],
        nums[0] * nums[1] * nums[n-1]
    );
}`,
  },

  defaultInput: {
    nums: [-4, -3, -2, -1, 60],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-4, -3, -2, -1, 60],
      placeholder: '-4,-3,-2,-1,60',
      helperText: 'Comma-separated integers (at least 3)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: ${JSON.stringify(nums)}. Sort the array to identify the three largest and two smallest values.`,
      variables: { nums: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    nums.sort((a, b) => a - b);
    const n = nums.length;

    steps.push({
      line: 2,
      explanation: `Sorted: ${JSON.stringify(nums)}. Smallest are at [0] and [1], largest at [n-3], [n-2], [n-1].`,
      variables: { sortedNums: JSON.stringify(nums), n },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: { 0: 'min1', 1: 'min2', [n - 3]: 'max3', [n - 2]: 'max2', [n - 1]: 'max1' },
      },
    });

    const option1 = nums[n - 1] * nums[n - 2] * nums[n - 3];
    const option2 = nums[0] * nums[1] * nums[n - 1];

    steps.push({
      line: 3,
      explanation: `Option 1: top 3 = ${nums[n - 1]} * ${nums[n - 2]} * ${nums[n - 3]} = ${option1}.`,
      variables: { option1, 'top3': [nums[n - 3], nums[n - 2], nums[n - 1]] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { [n - 3]: 'found', [n - 2]: 'found', [n - 1]: 'found' },
        labels: { [n - 3]: 'p1', [n - 2]: 'p2', [n - 1]: 'p3' },
      },
    });

    steps.push({
      line: 4,
      explanation: `Option 2: two smallest + largest = ${nums[0]} * ${nums[1]} * ${nums[n - 1]} = ${option2}. (Two negatives * positive can be large.)`,
      variables: { option2, 'combo': [nums[0], nums[1], nums[n - 1]] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'active', 1: 'active', [n - 1]: 'active' },
        labels: { 0: 'p1', 1: 'p2', [n - 1]: 'p3' },
      },
    });

    const result = Math.max(option1, option2);

    steps.push({
      line: 5,
      explanation: `max(${option1}, ${option2}) = ${result}. Maximum product of three numbers is ${result}.`,
      variables: { option1, option2, result },
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

export default maxProductThreeNumbers;
