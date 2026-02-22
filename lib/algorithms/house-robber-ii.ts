import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const houseRobberII: AlgorithmDefinition = {
  id: 'house-robber-ii',
  title: 'House Robber II',
  leetcodeNumber: 213,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Houses are arranged in a circle — the first and last house are adjacent. You cannot rob adjacent houses. Find the maximum amount you can rob. Key insight: solve House Robber on two sub-arrays: nums[0..n-2] and nums[1..n-1], then take the max.',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function rob(nums):
  n = length(nums)
  if n == 1: return nums[0]
  function robLinear(arr):
    prev2, prev1 = 0, 0
    for x in arr:
      prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
  return max(robLinear(nums[0..n-2]), robLinear(nums[1..n-1]))`,
    python: `def rob(nums):
    n = len(nums)
    if n == 1: return nums[0]
    def robLinear(arr):
        prev2 = prev1 = 0
        for x in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1
    return max(robLinear(nums[:-1]), robLinear(nums[1:]))`,
    javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function robLinear(arr) {
    let prev2 = 0, prev1 = 0;
    for (const x of arr) {
      [prev2, prev1] = [prev1, Math.max(prev1, prev2 + x)];
    }
    return prev1;
  }
  return Math.max(robLinear(nums.slice(0, n-1)), robLinear(nums.slice(1)));
}`,
    java: `public int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    return Math.max(robLinear(nums, 0, n-2), robLinear(nums, 1, n-1));
}
private int robLinear(int[] nums, int start, int end) {
    int prev2 = 0, prev1 = 0;
    for (int i = start; i <= end; i++) {
        int cur = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}`,
  },
  defaultInput: { nums: [2, 3, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'House Values (circular)',
      type: 'array',
      defaultValue: [2, 3, 2],
      placeholder: '2,3,2',
      helperText: 'Houses arranged in a circle. First and last are adjacent.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    function robLinear(arr: number[]): { dp: number[], result: number } {
      const dp: number[] = new Array(arr.length).fill(0);
      if (arr.length === 0) return { dp: [], result: 0 };
      dp[0] = arr[0];
      if (arr.length > 1) dp[1] = Math.max(arr[0], arr[1]);
      for (let i = 2; i < arr.length; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + arr[i]);
      }
      return { dp, result: dp[dp.length - 1] };
    }

    steps.push({
      line: 1,
      explanation: `House Robber II: nums=[${nums.join(', ')}], circular street. Cannot rob adjacent. Split into two linear problems: exclude last house OR exclude first house.`,
      variables: { nums, n },
      visualization: {
        type: 'dp-table',
        values: nums.slice(),
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'visited'])),
        labels: nums.map((v, i) => `h${i}:$${v}`),
      },
    });

    if (n === 1) {
      steps.push({
        line: 2,
        explanation: `Only one house. Rob it for ${nums[0]}.`,
        variables: { result: nums[0] },
        visualization: {
          type: 'dp-table',
          values: [nums[0]],
          highlights: { 0: 'active' },
          labels: [`h0:$${nums[0]}`],
        },
      });
      return steps;
    }

    // Case 1: skip last house (nums[0..n-2])
    const arr1 = nums.slice(0, n - 1);
    const { dp: dp1, result: res1 } = robLinear(arr1);

    steps.push({
      line: 4,
      explanation: `Case 1: Exclude last house. Rob from houses 0 to ${n - 2}: [${arr1.join(', ')}].`,
      variables: { arr1 },
      visualization: {
        type: 'dp-table',
        values: dp1.slice(),
        highlights: Object.fromEntries(dp1.map((_, i) => [i, i === dp1.length - 1 ? 'active' : 'found'])),
        labels: arr1.map((v, i) => `h${i}:$${v}`),
      },
    });

    // Case 2: skip first house (nums[1..n-1])
    const arr2 = nums.slice(1);
    const { dp: dp2, result: res2 } = robLinear(arr2);

    steps.push({
      line: 5,
      explanation: `Case 2: Exclude first house. Rob from houses 1 to ${n - 1}: [${arr2.join(', ')}].`,
      variables: { arr2 },
      visualization: {
        type: 'dp-table',
        values: dp2.slice(),
        highlights: Object.fromEntries(dp2.map((_, i) => [i, i === dp2.length - 1 ? 'active' : 'found'])),
        labels: arr2.map((v, i) => `h${i + 1}:$${v}`),
      },
    });

    const result = Math.max(res1, res2);
    const winner = res1 >= res2 ? 1 : 2;

    steps.push({
      line: 6,
      explanation: `Result = max(Case1=${res1}, Case2=${res2}) = ${result}. Case ${winner} wins. Maximum rob amount on circular street: $${result}.`,
      variables: { res1, res2, result },
      visualization: {
        type: 'dp-table',
        values: [res1, res2, result],
        highlights: { 0: res1 >= res2 ? 'found' : 'visited', 1: res2 > res1 ? 'found' : 'visited', 2: 'active' },
        labels: ['Case1 (skip last)', 'Case2 (skip first)', 'max result'],
      },
    });

    return steps;
  },
};

export default houseRobberII;
