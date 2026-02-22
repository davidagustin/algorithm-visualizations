import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const neighborhoodBurglary: AlgorithmDefinition = {
  id: 'neighborhood-burglary',
  title: 'Neighborhood Burglary',
  leetcodeNumber: 198,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'You are a robber planning to rob houses along a street. Adjacent houses have security systems that will alert police if both are robbed. Given an array of money in each house, find the maximum amount you can rob without alerting police. dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function rob(nums):
  n = length(nums)
  if n == 0: return 0
  if n == 1: return nums[0]
  dp = array of size n
  dp[0] = nums[0]
  dp[1] = max(nums[0], nums[1])
  for i from 2 to n-1:
    dp[i] = max(dp[i-1], dp[i-2] + nums[i])
  return dp[n-1]`,
    python: `def rob(nums):
    n = len(nums)
    if n == 0: return 0
    if n == 1: return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    return dp[n-1]`,
    javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];
  const dp = new Array(n);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
  }
  return dp[n-1];
}`,
    java: `public int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    return dp[n-1];
}`,
  },
  defaultInput: { nums: [2, 7, 9, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'House Values',
      type: 'array',
      defaultValue: [2, 7, 9, 3, 1],
      placeholder: '2,7,9,3,1',
      helperText: 'Comma-separated money values in each house',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(n).fill(null);
    const labels: string[] = nums.map((v, i) => `h${i}:$${v}`);

    function makeViz(
      activeIdx: number | null,
      comparingIndices: number[],
      computedUpTo: number
    ): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= computedUpTo && i < n; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx < n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null && activeIdx < n) highlights[activeIdx] = 'active';
      return {
        type: 'dp-table',
        values: dp.slice(),
        highlights,
        labels,
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} houses with values [${nums.join(', ')}]. dp[i] = max money robbing houses 0..i without robbing adjacent houses.`,
      variables: { n, nums: [...nums] },
      visualization: makeViz(null, [], -1),
    });

    if (n === 0) {
      steps.push({
        line: 3,
        explanation: 'No houses to rob. Return 0.',
        variables: { result: 0 },
        visualization: makeViz(null, [], -1),
      });
      return steps;
    }

    // dp[0]
    dp[0] = nums[0];
    steps.push({
      line: 5,
      explanation: `dp[0] = nums[0] = ${nums[0]}. If there's only one house, rob it.`,
      variables: { 'dp[0]': dp[0] },
      visualization: makeViz(0, [], 0),
    });

    if (n === 1) {
      steps.push({
        line: 9,
        explanation: `Only one house. Return dp[0] = ${dp[0]}.`,
        variables: { result: dp[0] },
        visualization: makeViz(0, [], 0),
      });
      return steps;
    }

    // dp[1]
    dp[1] = Math.max(nums[0], nums[1]);
    steps.push({
      line: 6,
      explanation: `dp[1] = max(nums[0], nums[1]) = max(${nums[0]}, ${nums[1]}) = ${dp[1]}. Best of robbing house 0 or house 1.`,
      variables: { 'dp[1]': dp[1], 'nums[0]': nums[0], 'nums[1]': nums[1] },
      visualization: makeViz(1, [0], 1),
    });

    // Fill rest
    for (let i = 2; i < n; i++) {
      const skip = dp[i - 1] as number;
      const rob = (dp[i - 2] as number) + nums[i];

      steps.push({
        line: 8,
        explanation: `dp[${i}]: skip house ${i} -> dp[${i - 1}] = ${skip}. Rob house ${i} -> dp[${i - 2}] + nums[${i}] = ${dp[i - 2]} + ${nums[i]} = ${rob}.`,
        variables: { i, skip, rob, 'nums[i]': nums[i] },
        visualization: makeViz(i, [i - 1, i - 2], i - 1),
      });

      dp[i] = Math.max(skip, rob);

      steps.push({
        line: 8,
        explanation: `dp[${i}] = max(${skip}, ${rob}) = ${dp[i]}. ${dp[i] === rob ? `Rob house ${i}.` : `Skip house ${i}.`}`,
        variables: { i, 'dp[i]': dp[i] },
        visualization: makeViz(i, [], i),
      });
    }

    // Final
    steps.push({
      line: 9,
      explanation: `dp[${n - 1}] = ${dp[n - 1]}. Maximum amount that can be robbed: $${dp[n - 1]}.`,
      variables: { result: dp[n - 1] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n }, (_, i) => [i, i === n - 1 ? 'active' : 'found'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default neighborhoodBurglary;
