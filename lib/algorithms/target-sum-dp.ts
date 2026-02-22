import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const targetSumDp: AlgorithmDefinition = {
  id: 'target-sum-dp',
  title: 'Target Sum - DP Offset',
  leetcodeNumber: 494,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Assign + or - to each number and count ways to reach the target. The DP offset approach uses a 1D array of size 2*sum+1 where index offset = sum represents 0. For each number, iterate and accumulate counts. Converts from O(n*2^n) brute force to O(n*sum).',
  tags: ['dynamic programming', 'knapsack', 'dfs', 'counting'],

  code: {
    pseudocode: `function findTargetSumWays(nums, target):
  total = sum(nums)
  if abs(target) > total: return 0
  dp = array of size 2*total+1, dp[total] = 1  // offset by total
  for num in nums:
    next = array of size 2*total+1, all 0
    for i from 0 to 2*total:
      if dp[i] != 0:
        next[i + num] += dp[i]
        next[i - num] += dp[i]
    dp = next
  return dp[total + target]`,
    python: `def findTargetSumWays(nums: list[int], target: int) -> int:
    total = sum(nums)
    if abs(target) > total:
        return 0
    dp = [0] * (2 * total + 1)
    dp[total] = 1
    for num in nums:
        nxt = [0] * (2 * total + 1)
        for i in range(2 * total + 1):
            if dp[i]:
                nxt[i + num] += dp[i]
                nxt[i - num] += dp[i]
        dp = nxt
    return dp[total + target]`,
    javascript: `function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total) return 0;
  let dp = new Array(2 * total + 1).fill(0);
  dp[total] = 1;
  for (const num of nums) {
    const nxt = new Array(2 * total + 1).fill(0);
    for (let i = 0; i <= 2 * total; i++) {
      if (dp[i]) {
        nxt[i + num] += dp[i];
        nxt[i - num] += dp[i];
      }
    }
    dp = nxt;
  }
  return dp[total + target];
}`,
    java: `public int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int n : nums) total += n;
    if (Math.abs(target) > total) return 0;
    int[] dp = new int[2 * total + 1];
    dp[total] = 1;
    for (int num : nums) {
        int[] nxt = new int[2 * total + 1];
        for (int i = 0; i <= 2 * total; i++) {
            if (dp[i] != 0) {
                nxt[i + num] += dp[i];
                nxt[i - num] += dp[i];
            }
        }
        dp = nxt;
    }
    return dp[total + target];
}`,
  },

  defaultInput: {
    nums: [1, 1, 1, 1, 1],
    target: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 1],
      placeholder: '1,1,1,1,1',
      helperText: 'Array of non-negative integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target sum to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const total = nums.reduce((a, b) => a + b, 0);

    steps.push({
      line: 2,
      explanation: `total = ${total}. Offset DP: index ${total} represents sum 0. Array size = ${2 * total + 1}.`,
      variables: { total, target, size: 2 * total + 1 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, String(v)])),
      },
    });

    if (Math.abs(target) > total) {
      steps.push({
        line: 3,
        explanation: `|target| = ${Math.abs(target)} > total = ${total}. Impossible, return 0.`,
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])),
          labels: {},
        },
      });
      return steps;
    }

    let dp = new Array(2 * total + 1).fill(0);
    dp[total] = 1;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dpArr],
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i - total)])),
    });

    steps.push({
      line: 5,
      explanation: `dp[${total}] = 1 (offset: index ${total} = sum 0, one way to get sum 0 before processing any numbers).`,
      variables: { offset: total },
      visualization: makeViz([...dp], { [total]: 'found' }),
    });

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];
      const nxt = new Array(2 * total + 1).fill(0);
      for (let i = 0; i <= 2 * total; i++) {
        if (dp[i]) {
          if (i + num <= 2 * total) nxt[i + num] += dp[i];
          if (i - num >= 0) nxt[i - num] += dp[i];
        }
      }
      dp = nxt;
      steps.push({
        line: 9,
        explanation: `After num[${ni}] = ${num}: DP updated. Ways to reach target ${target}: ${dp[total + target]}.`,
        variables: { numIndex: ni, num, waysToTarget: dp[total + target] },
        visualization: makeViz([...dp], { [total + target]: 'found', [total]: 'comparing' }),
      });
    }

    steps.push({
      line: 11,
      explanation: `Number of ways to assign +/- to reach target ${target} = dp[${total + target}] = ${dp[total + target]}.`,
      variables: { result: dp[total + target] },
      visualization: makeViz([...dp], { [total + target]: 'found' }),
    });

    return steps;
  },
};

export default targetSumDp;
