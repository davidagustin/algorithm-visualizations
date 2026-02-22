import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const arithmeticSlices: AlgorithmDefinition = {
  id: 'arithmetic-slices',
  title: 'Arithmetic Slices',
  leetcodeNumber: 413,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A sequence is arithmetic if it has at least 3 elements and consecutive differences are all equal. Given nums, return the count of arithmetic subarrays. DP: dp[i] is the number of new arithmetic subarrays ending at index i. If nums[i]-nums[i-1]==nums[i-1]-nums[i-2], then dp[i]=dp[i-1]+1.',
  tags: ['dynamic programming', 'array', 'math', 'sliding window'],

  code: {
    pseudocode: `function numberOfArithmeticSlices(nums):
  n = len(nums)
  dp = [0]*n, result = 0
  for i from 2 to n-1:
    if nums[i]-nums[i-1] == nums[i-1]-nums[i-2]:
      dp[i] = dp[i-1] + 1
      result += dp[i]
  return result`,

    python: `def numberOfArithmeticSlices(nums: list[int]) -> int:
    n = len(nums)
    dp = [0] * n
    result = 0
    for i in range(2, n):
        if nums[i] - nums[i-1] == nums[i-1] - nums[i-2]:
            dp[i] = dp[i-1] + 1
            result += dp[i]
    return result`,

    javascript: `function numberOfArithmeticSlices(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(0);
  let result = 0;
  for (let i = 2; i < n; i++) {
    if (nums[i] - nums[i-1] === nums[i-1] - nums[i-2]) {
      dp[i] = dp[i-1] + 1;
      result += dp[i];
    }
  }
  return result;
}`,

    java: `public int numberOfArithmeticSlices(int[] nums) {
    int n = nums.length, result = 0;
    int[] dp = new int[n];
    for (int i = 2; i < n; i++) {
        if (nums[i] - nums[i-1] == nums[i-1] - nums[i-2]) {
            dp[i] = dp[i-1] + 1;
            result += dp[i];
        }
    }
    return result;
}`,
  },

  defaultInput: { nums: [1, 2, 3, 4, 5, 7, 9] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 7, 9],
      placeholder: '1,2,3,4,5,7,9',
      helperText: 'Integer array to count arithmetic subarrays',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n).fill(0);
    let result = 0;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] > 0 ? 'found' : 'default'])),
      labels: nums.map((v, i) => `[${i}]=${v}`),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp array of ${n} zeros. dp[i] = count of new arithmetic subarrays ending at i.`,
      variables: { n },
      visualization: makeViz(-1),
    });

    for (let i = 2; i < n; i++) {
      const d1 = nums[i] - nums[i - 1];
      const d2 = nums[i - 1] - nums[i - 2];

      if (d1 === d2) {
        dp[i] = dp[i - 1] + 1;
        result += dp[i];

        steps.push({
          line: 6,
          explanation: `i=${i}: diff(${nums[i]}-${nums[i - 1]})=${d1} == diff(${nums[i - 1]}-${nums[i - 2]})=${d2}. Arithmetic! dp[${i}]=dp[${i - 1}]+1=${dp[i]}. result+=${dp[i]} => result=${result}.`,
          variables: { i, d1, d2, [`dp[${i}]`]: dp[i], result },
          visualization: makeViz(i),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `i=${i}: diff(${nums[i]}-${nums[i - 1]})=${d1} != diff(${nums[i - 1]}-${nums[i - 2]})=${d2}. Not arithmetic. dp[${i}]=0. result=${result}.`,
          variables: { i, d1, d2, [`dp[${i}]`]: 0, result },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Total arithmetic subarrays = ${result}.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((v, i) => [i, v > 0 ? 'found' : 'sorted'])),
        labels: nums.map((v, i) => `[${i}]=${v}`),
      },
    });

    return steps;
  },
};

export default arithmeticSlices;
