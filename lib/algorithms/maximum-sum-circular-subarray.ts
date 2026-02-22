import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSumCircularSubarray: AlgorithmDefinition = {
  id: 'maximum-sum-circular-subarray',
  title: 'Maximum Sum Circular Subarray',
  leetcodeNumber: 918,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a circular integer array nums, return the maximum possible sum of a non-empty subarray. Key insight: the maximum circular subarray sum equals either the maximum subarray sum (Kadane) OR the total sum minus the minimum subarray sum (wrapping around). Handle the all-negative case specially.',
  tags: ['dynamic programming', 'Kadane', 'circular array', 'divide and conquer'],

  code: {
    pseudocode: `function maxSubarraySumCircular(nums):
  totalSum = sum(nums)
  maxSum = curMax = nums[0]
  minSum = curMin = nums[0]
  for i from 1 to n-1:
    curMax = max(nums[i], curMax + nums[i])
    maxSum = max(maxSum, curMax)
    curMin = min(nums[i], curMin + nums[i])
    minSum = min(minSum, curMin)
  if maxSum < 0: return maxSum
  return max(maxSum, totalSum - minSum)`,

    python: `def maxSubarraySumCircular(nums: list[int]) -> int:
    total = sum(nums)
    max_sum = cur_max = nums[0]
    min_sum = cur_min = nums[0]
    for i in range(1, len(nums)):
        cur_max = max(nums[i], cur_max + nums[i])
        max_sum = max(max_sum, cur_max)
        cur_min = min(nums[i], cur_min + nums[i])
        min_sum = min(min_sum, cur_min)
    return max_sum if max_sum < 0 else max(max_sum, total - min_sum)`,

    javascript: `function maxSubarraySumCircular(nums) {
  let total = nums.reduce((a, b) => a + b, 0);
  let maxSum = nums[0], curMax = nums[0];
  let minSum = nums[0], curMin = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curMax = Math.max(nums[i], curMax + nums[i]);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(nums[i], curMin + nums[i]);
    minSum = Math.min(minSum, curMin);
  }
  return maxSum < 0 ? maxSum : Math.max(maxSum, total - minSum);
}`,

    java: `public int maxSubarraySumCircular(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    int maxSum = nums[0], curMax = nums[0];
    int minSum = nums[0], curMin = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curMax = Math.max(nums[i], curMax + nums[i]);
        maxSum = Math.max(maxSum, curMax);
        curMin = Math.min(nums[i], curMin + nums[i]);
        minSum = Math.min(minSum, curMin);
    }
    return maxSum < 0 ? maxSum : Math.max(maxSum, total - minSum);
}`,
  },

  defaultInput: { nums: [5, -3, 5, -2, 3] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, -3, 5, -2, 3],
      placeholder: '5,-3,5,-2,3',
      helperText: 'Circular array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);

    const makeViz = (idx: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels: { [idx]: 'i' },
    });

    let maxSum = nums[0];
    let curMax = nums[0];
    let minSum = nums[0];
    let curMin = nums[0];

    steps.push({
      line: 2,
      explanation: `totalSum = ${total}. Initialize maxSum=curMax=${nums[0]}, minSum=curMin=${nums[0]} from first element.`,
      variables: { total, maxSum, curMax, minSum, curMin },
      visualization: makeViz(0, { 0: 'active' }),
    });

    for (let i = 1; i < n; i++) {
      curMax = Math.max(nums[i], curMax + nums[i]);
      maxSum = Math.max(maxSum, curMax);
      curMin = Math.min(nums[i], curMin + nums[i]);
      minSum = Math.min(minSum, curMin);

      steps.push({
        line: 6,
        explanation: `i=${i}, nums[i]=${nums[i]}: curMax=max(${nums[i]}, prev+${nums[i]})=${curMax}, maxSum=${maxSum}; curMin=min(${nums[i]}, prev+${nums[i]})=${curMin}, minSum=${minSum}.`,
        variables: { i, curMax, maxSum, curMin, minSum },
        visualization: makeViz(i, { [i]: 'active' }),
      });
    }

    let result: number;
    if (maxSum < 0) {
      result = maxSum;
      steps.push({
        line: 10,
        explanation: `All elements are negative. maxSum=${maxSum} < 0, so return maxSum = ${result}.`,
        variables: { result },
        visualization: makeViz(n - 1, Object.fromEntries(nums.map((_, i) => [i, 'mismatch']))),
      });
    } else {
      result = Math.max(maxSum, total - minSum);
      steps.push({
        line: 11,
        explanation: `Result = max(maxSum, total - minSum) = max(${maxSum}, ${total} - ${minSum}) = max(${maxSum}, ${total - minSum}) = ${result}.`,
        variables: { maxSum, total, minSum, circularMax: total - minSum, result },
        visualization: makeViz(n - 1, Object.fromEntries(nums.map((_, i) => [i, 'found']))),
      });
    }

    return steps;
  },
};

export default maximumSumCircularSubarray;
