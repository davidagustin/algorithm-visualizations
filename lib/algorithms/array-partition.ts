import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const arrayPartition: AlgorithmDefinition = {
  id: 'array-partition',
  title: 'Array Partition',
  leetcodeNumber: 561,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given 2n integers, group them into n pairs and return the maximum possible sum of the minimums of each pair. The optimal strategy is to sort the array and sum every other element starting from index 0, since pairing adjacent sorted elements maximizes the smaller values.',
  tags: ['array', 'sorting', 'greedy', 'math'],

  code: {
    pseudocode: `function arrayPairSum(nums):
  sort(nums)
  sum = 0
  for i from 0 to length(nums)-1 step 2:
    sum = sum + nums[i]
  return sum`,

    python: `def arrayPairSum(nums: list[int]) -> int:
    nums.sort()
    return sum(nums[i] for i in range(0, len(nums), 2))`,

    javascript: `function arrayPairSum(nums) {
  nums.sort((a, b) => a - b);
  let sum = 0;
  for (let i = 0; i < nums.length; i += 2) {
    sum += nums[i];
  }
  return sum;
}`,

    java: `public int arrayPairSum(int[] nums) {
    Arrays.sort(nums);
    int sum = 0;
    for (int i = 0; i < nums.length; i += 2) {
        sum += nums[i];
    }
    return sum;
}`,
  },

  defaultInput: {
    nums: [1, 4, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array (2n integers)',
      type: 'array',
      defaultValue: [1, 4, 3, 2],
      placeholder: '1,4,3,2',
      helperText: 'Even number of integers to be paired',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input array: ${JSON.stringify(nums)}. Sort it to enable optimal pairing of adjacent elements.`,
      variables: { nums: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    nums.sort((a, b) => a - b);

    steps.push({
      line: 2,
      explanation: `Sorted array: ${JSON.stringify(nums)}. Now pair adjacent elements: (${nums[0]},${nums[1]}), (${nums[2]},${nums[3]}), etc.`,
      variables: { sortedNums: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    let sum = 0;

    for (let i = 0; i < nums.length; i += 2) {
      const pairMin = nums[i];
      const pairMax = nums[i + 1];
      sum += pairMin;

      steps.push({
        line: 4,
        explanation: `Pair (${pairMin}, ${pairMax}): min is ${pairMin}. Add ${pairMin} to sum. Running sum = ${sum}.`,
        variables: { i, pairMin, pairMax, sum },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'found', [i + 1]: 'active' },
          labels: { [i]: `+${pairMin}`, [i + 1]: 'ignored' },
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `All pairs processed. Maximum sum of minimums = ${sum}.`,
      variables: { result: sum },
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

export default arrayPartition;
