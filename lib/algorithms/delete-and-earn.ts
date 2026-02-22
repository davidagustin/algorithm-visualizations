import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const deleteAndEarn: AlgorithmDefinition = {
  id: 'delete-and-earn',
  title: 'Delete and Earn',
  leetcodeNumber: 740,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array nums, you can delete any number and earn nums[i] points. After deleting nums[i], all occurrences of nums[i]-1 and nums[i]+1 are also deleted. Return the maximum points you can earn. This reduces to a House Robber problem on a points-per-value array.',
  tags: ['dynamic programming', 'array', 'house robber variant'],

  code: {
    pseudocode: `function deleteAndEarn(nums):
  maxVal = max(nums)
  points = array of maxVal+1 zeros
  for num in nums:
    points[num] += num
  dp[0] = points[0]
  dp[1] = max(points[0], points[1])
  for i from 2 to maxVal:
    dp[i] = max(dp[i-1], dp[i-2] + points[i])
  return dp[maxVal]`,

    python: `def deleteAndEarn(nums: list[int]) -> int:
    max_val = max(nums)
    points = [0] * (max_val + 1)
    for num in nums:
        points[num] += num
    dp = [0] * (max_val + 1)
    dp[0] = points[0]
    if max_val >= 1:
        dp[1] = max(points[0], points[1])
    for i in range(2, max_val + 1):
        dp[i] = max(dp[i-1], dp[i-2] + points[i])
    return dp[max_val]`,

    javascript: `function deleteAndEarn(nums) {
  const maxVal = Math.max(...nums);
  const points = new Array(maxVal + 1).fill(0);
  for (const num of nums) points[num] += num;
  const dp = new Array(maxVal + 1).fill(0);
  dp[0] = points[0];
  if (maxVal >= 1) dp[1] = Math.max(points[0], points[1]);
  for (let i = 2; i <= maxVal; i++) {
    dp[i] = Math.max(dp[i-1], dp[i-2] + points[i]);
  }
  return dp[maxVal];
}`,

    java: `public int deleteAndEarn(int[] nums) {
    int maxVal = Arrays.stream(nums).max().getAsInt();
    int[] points = new int[maxVal + 1];
    for (int num : nums) points[num] += num;
    int[] dp = new int[maxVal + 1];
    dp[0] = points[0];
    if (maxVal >= 1) dp[1] = Math.max(points[0], points[1]);
    for (int i = 2; i <= maxVal; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + points[i]);
    }
    return dp[maxVal];
}`,
  },

  defaultInput: { nums: [3, 4, 2, 4, 3, 1] },

  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [3, 4, 2, 4, 3, 1],
      placeholder: '3,4,2,4,3,1',
      helperText: 'Array of integers to earn points from',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const maxVal = Math.max(...nums);
    const points = Array(maxVal + 1).fill(0);
    for (const num of nums) points[num] += num;

    steps.push({
      line: 2,
      explanation: `Build points array of size ${maxVal + 1}. points[v] = v * (count of v in nums).`,
      variables: { maxVal, points: points.join(',') },
      visualization: {
        type: 'dp-table',
        values: [...points],
        highlights: Object.fromEntries(points.map((_, i) => [i, 'pointer'])),
        labels: Array.from({ length: maxVal + 1 }, (_, i) => `pts[${i}]`),
      },
    });

    const dp: (number | null)[] = Array(maxVal + 1).fill(null);

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp] as number[],
      highlights: Object.fromEntries(
        dp.map((v, i) => [i, i === activeIdx ? 'active' : v !== null ? 'found' : 'default'])
      ),
      labels: Array.from({ length: maxVal + 1 }, (_, i) => `dp[${i}]`),
    });

    dp[0] = points[0];
    steps.push({
      line: 6,
      explanation: `Base case: dp[0] = points[0] = ${points[0]}.`,
      variables: { 'dp[0]': dp[0] },
      visualization: makeViz(0),
    });

    if (maxVal >= 1) {
      dp[1] = Math.max(points[0], points[1]);
      steps.push({
        line: 7,
        explanation: `Base case: dp[1] = max(points[0], points[1]) = max(${points[0]}, ${points[1]}) = ${dp[1]}.`,
        variables: { 'dp[1]': dp[1] },
        visualization: makeViz(1),
      });
    }

    for (let i = 2; i <= maxVal; i++) {
      const skip = dp[i - 1] as number;
      const take = (dp[i - 2] as number) + points[i];
      dp[i] = Math.max(skip, take);

      steps.push({
        line: 9,
        explanation: `dp[${i}]: skip = dp[${i - 1}] = ${skip}, take = dp[${i - 2}] + points[${i}] = ${dp[i - 2]} + ${points[i]} = ${take}. dp[${i}] = max(${skip}, ${take}) = ${dp[i]}.`,
        variables: { i, skip, take, [`dp[${i}]`]: dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 10,
      explanation: `Maximum points earned = dp[${maxVal}] = ${dp[maxVal]}.`,
      variables: { result: dp[maxVal] },
      visualization: {
        type: 'dp-table',
        values: dp as number[],
        highlights: Object.fromEntries((dp as number[]).map((_, i) => [i, i === maxVal ? 'found' : 'sorted'])),
        labels: Array.from({ length: maxVal + 1 }, (_, i) => `dp[${i}]`),
      },
    });

    return steps;
  },
};

export default deleteAndEarn;
