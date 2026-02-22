import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const partitionEqualSubsetSumDp: AlgorithmDefinition = {
  id: 'partition-equal-subset-sum-dp',
  title: 'Partition Equal Subset Sum - DP',
  leetcodeNumber: 416,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array, determine if it can be partitioned into two subsets with equal sum. If the total sum is odd, return false immediately. Otherwise find if a subset summing to total/2 exists using a boolean DP array where dp[j] is true if sum j is achievable.',
  tags: ['dynamic programming', 'knapsack', '0/1 knapsack', 'subset sum'],

  code: {
    pseudocode: `function canPartition(nums):
  total = sum(nums)
  if total % 2 != 0: return false
  target = total / 2
  dp = boolean array of size target+1, all false
  dp[0] = true
  for num in nums:
    for j from target down to num:
      dp[j] = dp[j] OR dp[j - num]
  return dp[target]`,
    python: `def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]`,
    javascript: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[target];
}`,
    java: `public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}`,
  },

  defaultInput: {
    nums: [1, 5, 11, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 5, 11, 5],
      placeholder: '1,5,11,5',
      helperText: 'Comma-separated positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const total = nums.reduce((a, b) => a + b, 0);

    steps.push({
      line: 2,
      explanation: `Compute total sum = ${total}.`,
      variables: { total },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((_, i) => [i, String(i)])),
      },
    });

    if (total % 2 !== 0) {
      steps.push({
        line: 3,
        explanation: `Total ${total} is odd, cannot partition into equal subsets. Return false.`,
        variables: { total, result: false },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])),
          labels: {},
        },
      });
      return steps;
    }

    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;

    const makeViz = (dpArr: boolean[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v ? 1 : 0)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 4,
      explanation: `Target = ${target}. Initialize dp[0] = true. dp[j] means sum j is achievable.`,
      variables: { target },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];
      steps.push({
        line: 7,
        explanation: `Processing num = ${num} (index ${ni}). Scanning dp from target down to ${num}.`,
        variables: { num, numIndex: ni },
        visualization: makeViz([...dp], { [ni]: 'active' }),
      });
      for (let j = target; j >= num; j--) {
        if (!dp[j] && dp[j - num]) {
          dp[j] = true;
          steps.push({
            line: 9,
            explanation: `dp[${j}] = true because dp[${j - num}] is true and we add num ${num}.`,
            variables: { j, num, 'dp[j]': true, 'dp[j-num]': true },
            visualization: makeViz([...dp], { [j]: 'found', [j - num]: 'comparing' }),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `dp[${target}] = ${dp[target]}. Can${dp[target] ? '' : 'not'} partition into equal subsets.`,
      variables: { target, result: dp[target] },
      visualization: makeViz([...dp], { [target]: dp[target] ? 'found' : 'mismatch' }),
    });

    return steps;
  },
};

export default partitionEqualSubsetSumDp;
