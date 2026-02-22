import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const leftAndRightSumDifferences: AlgorithmDefinition = {
  id: 'left-and-right-sum-differences',
  title: 'Left and Right Sum Differences',
  leetcodeNumber: 2574,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Return answer[i] = |leftSum[i] - rightSum[i]| where leftSum[i] is sum of nums[0..i-1] and rightSum[i] is sum of nums[i+1..n-1]. Build prefix sums from both directions, then compute differences. O(n) time.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function leftRightDifference(nums):
  n = len(nums)
  leftSum = prefix from left (excluding self)
  rightSum = prefix from right (excluding self)
  return [abs(leftSum[i] - rightSum[i]) for i in range(n)]`,
    python: `def leftRightDifference(nums: list[int]) -> list[int]:
    n = len(nums)
    left = [0] * n
    right = [0] * n
    for i in range(1, n):
        left[i] = left[i-1] + nums[i-1]
    for i in range(n-2, -1, -1):
        right[i] = right[i+1] + nums[i+1]
    return [abs(left[i] - right[i]) for i in range(n)]`,
    javascript: `function leftRightDifference(nums) {
  const n = nums.length;
  const left = new Array(n).fill(0);
  const right = new Array(n).fill(0);
  for (let i = 1; i < n; i++) left[i] = left[i-1] + nums[i-1];
  for (let i = n-2; i >= 0; i--) right[i] = right[i+1] + nums[i+1];
  return nums.map((_, i) => Math.abs(left[i] - right[i]));
}`,
    java: `public int[] leftRightDifference(int[] nums) {
    int n = nums.length;
    int[] left = new int[n], right = new int[n], ans = new int[n];
    for (int i = 1; i < n; i++) left[i] = left[i-1] + nums[i-1];
    for (int i = n-2; i >= 0; i--) right[i] = right[i+1] + nums[i+1];
    for (int i = 0; i < n; i++) ans[i] = Math.abs(left[i] - right[i]);
    return ans;
}`,
  },
  defaultInput: { nums: [10, 4, 8, 3] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 4, 8, 3],
      placeholder: '10,4,8,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const left: number[] = new Array(n).fill(0);
    const right: number[] = new Array(n).fill(0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr?: number[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr ?? [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute |leftSum - rightSum| for each index. nums = [${nums.join(', ')}].`,
      variables: { nums },
      visualization: makeViz({}, {}),
    });

    // Left pass
    for (let i = 1; i < n; i++) {
      left[i] = left[i - 1] + nums[i - 1];
      steps.push({
        line: 4,
        explanation: `leftSum[${i}] = leftSum[${i - 1}](${left[i - 1]}) + nums[${i - 1}](${nums[i - 1]}) = ${left[i]}.`,
        variables: { i, 'left[i]': left[i] },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `L=${left[i]}` },
        ),
      });
    }

    // Right pass
    for (let i = n - 2; i >= 0; i--) {
      right[i] = right[i + 1] + nums[i + 1];
      steps.push({
        line: 6,
        explanation: `rightSum[${i}] = rightSum[${i + 1}](${right[i + 1]}) + nums[${i + 1}](${nums[i + 1]}) = ${right[i]}.`,
        variables: { i, 'right[i]': right[i] },
        visualization: makeViz(
          { [i]: 'comparing' },
          { [i]: `R=${right[i]}` },
        ),
      });
    }

    const ans = nums.map((_, i) => Math.abs(left[i] - right[i]));
    steps.push({
      line: 8,
      explanation: `Compute differences: [${ans.join(', ')}]. left=[${left.join(', ')}], right=[${right.join(', ')}].`,
      variables: { left, right, result: ans },
      visualization: makeViz(
        Object.fromEntries(ans.map((_, i) => [i, 'found'])),
        Object.fromEntries(ans.map((v, i) => [i, `|${left[i]}-${right[i]}|=${v}`])),
        [...ans],
      ),
    });

    return steps;
  },
};

export default leftAndRightSumDifferences;
