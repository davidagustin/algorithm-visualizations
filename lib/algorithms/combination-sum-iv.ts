import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const combinationSumIv: AlgorithmDefinition = {
  id: 'combination-sum-iv',
  title: 'Combination Sum IV',
  leetcodeNumber: 377,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of distinct positive integers nums and a target, return the number of ordered combinations (permutations) that sum to target. DP: dp[i] = sum of dp[i - num] for each num in nums where i >= num. Order matters so [1,2] and [2,1] count as different.',
  tags: ['dynamic programming', 'combinatorics', 'permutation', 'unbounded knapsack'],

  code: {
    pseudocode: `function combinationSum4(nums, target):
  dp = array of target+1, dp[0] = 1
  for i from 1 to target:
    for num in nums:
      if i >= num:
        dp[i] += dp[i - num]
  return dp[target]`,

    python: `def combinationSum4(nums: list[int], target: int) -> int:
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(1, target + 1):
        for num in nums:
            if i >= num:
                dp[i] += dp[i - num]
    return dp[target]`,

    javascript: `function combinationSum4(nums, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= target; i++) {
    for (const num of nums) {
      if (i >= num) dp[i] += dp[i - num];
    }
  }
  return dp[target];
}`,

    java: `public int combinationSum4(int[] nums, int target) {
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int i = 1; i <= target; i++) {
        for (int num : nums) {
            if (i >= num) dp[i] += dp[i - num];
        }
    }
    return dp[target];
}`,
  },

  defaultInput: { nums: [1, 2, 3], target: 4 },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Distinct positive integers to combine',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Target sum to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(target + 1).fill(0);
    dp[0] = 1;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] > 0 ? 'found' : 'default'])),
      labels: Array.from({ length: target + 1 }, (_, i) => `dp[${i}]`),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0]=1 (one way to reach 0: use nothing). dp[1..${target}]=0. nums=[${nums.join(',')}].`,
      variables: { target, 'dp[0]': 1 },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= target; i++) {
      for (const num of nums) {
        if (i >= num) {
          dp[i] += dp[i - num];

          steps.push({
            line: 6,
            explanation: `i=${i}, num=${num}: dp[${i}] += dp[${i - num}] = ${dp[i - num]}. dp[${i}] is now ${dp[i]}.`,
            variables: { i, num, [`dp[${i - num}]`]: dp[i - num], [`dp[${i}]`]: dp[i] },
            visualization: makeViz(i),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Number of ordered combinations summing to ${target} = dp[${target}] = ${dp[target]}.`,
      variables: { target, result: dp[target] },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((_, i) => [i, i === target ? 'found' : 'sorted'])),
        labels: Array.from({ length: target + 1 }, (_, i) => `dp[${i}]`),
      },
    });

    return steps;
  },
};

export default combinationSumIv;
