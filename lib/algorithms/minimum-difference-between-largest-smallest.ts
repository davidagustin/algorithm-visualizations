import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumDifferenceBetweenLargestSmallest: AlgorithmDefinition = {
  id: 'minimum-difference-between-largest-smallest',
  title: 'Minimum Difference Between Largest and Smallest Value in Three Moves',
  leetcodeNumber: 1509,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums, in one move you may choose one element and change it to any value. Return the minimum difference between the largest and smallest value in nums after performing at most three moves. Sort the array, then consider 4 scenarios: remove 3 from left, 2 from left and 1 from right, 1 from left and 2 from right, 3 from right.',
  tags: ['sliding window', 'sorting', 'greedy', 'array'],

  code: {
    pseudocode: `function minDifference(nums):
  if len(nums) <= 4: return 0
  nums.sort()
  n = len(nums)
  result = INF
  for left in range(4):
    right = n - 1 - (3 - left)
    result = min(result, nums[right] - nums[left])
  return result`,

    python: `def minDifference(nums: list[int]) -> int:
    if len(nums) <= 4:
        return 0
    nums.sort()
    n = len(nums)
    result = float('inf')
    for left in range(4):
        right = n - 1 - (3 - left)
        result = min(result, nums[right] - nums[left])
    return result`,

    javascript: `function minDifference(nums) {
  if (nums.length <= 4) return 0;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let result = Infinity;
  for (let left = 0; left < 4; left++) {
    const right = n - 1 - (3 - left);
    result = Math.min(result, nums[right] - nums[left]);
  }
  return result;
}`,

    java: `public int minDifference(int[] nums) {
    if (nums.length <= 4) return 0;
    Arrays.sort(nums);
    int n = nums.length, result = Integer.MAX_VALUE;
    for (int left = 0; left < 4; left++) {
        int right = n - 1 - (3 - left);
        result = Math.min(result, nums[right] - nums[left]);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [5, 3, 2, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 3, 2, 4],
      placeholder: '5,3,2,4',
      helperText: 'Array of integers (at least 1 element)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsRaw = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start with array of length ${numsRaw.length}. If length <= 4, we can make all elements equal in 3 moves, so answer is 0.`,
      variables: { length: numsRaw.length },
      visualization: {
        type: 'array',
        array: [...numsRaw],
        highlights: {},
        labels: {},
      },
    });

    if (numsRaw.length <= 4) {
      steps.push({
        line: 2,
        explanation: `Array length ${numsRaw.length} <= 4, so we can change all but one element. Minimum difference = 0.`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [...numsRaw],
          highlights: Object.fromEntries(numsRaw.map((_, i) => [i, 'found'])),
          labels: {},
        },
      });
      return steps;
    }

    const nums = [...numsRaw].sort((a, b) => a - b);
    const n = nums.length;

    steps.push({
      line: 3,
      explanation: `Sort the array. Sorted: [${nums.join(', ')}].`,
      variables: { sorted: nums.join(', ') },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'pointer', [n - 1]: 'pointer' },
        labels: { 0: 'min', [n - 1]: 'max' },
      },
    });

    let result = Infinity;

    const scenarios = [
      { left: 0, desc: 'Remove 3 from right: window [0, n-4]' },
      { left: 1, desc: 'Remove 1 from left, 2 from right: window [1, n-3]' },
      { left: 2, desc: 'Remove 2 from left, 1 from right: window [2, n-2]' },
      { left: 3, desc: 'Remove 3 from left: window [3, n-1]' },
    ];

    for (let leftIdx = 0; leftIdx < 4; leftIdx++) {
      const right = n - 1 - (3 - leftIdx);
      const diff = nums[right] - nums[leftIdx];
      const prevResult = result;
      result = Math.min(result, diff);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = leftIdx; i <= right; i++) {
        highlights[i] = 'active';
      }
      highlights[leftIdx] = 'pointer';
      highlights[right] = 'pointer';
      labels[leftIdx] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 6,
        explanation: `${scenarios[leftIdx].desc}. nums[${leftIdx}]=${nums[leftIdx]}, nums[${right}]=${nums[right]}, diff=${diff}. Best so far=${result}.`,
        variables: { leftIdx, right, leftVal: nums[leftIdx], rightVal: nums[right], diff, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights,
          labels,
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. Minimum difference between largest and smallest after at most 3 moves = ${result}.`,
      variables: { result },
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

export default minimumDifferenceBetweenLargestSmallest;
