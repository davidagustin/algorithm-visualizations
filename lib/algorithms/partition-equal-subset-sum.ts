import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const partitionEqualSubsetSum: AlgorithmDefinition = {
  id: 'partition-equal-subset-sum',
  title: 'Partition Equal Subset Sum',
  leetcodeNumber: 416,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a non-empty array of positive integers, determine if the array can be partitioned into two subsets such that the sums are equal. This reduces to: can we find a subset summing to total/2? dp[j] = true if subset sum j is achievable.',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function canPartition(nums):
  total = sum(nums)
  if total % 2 != 0: return false
  target = total / 2
  dp = array of size target+1, all false
  dp[0] = true
  for each num in nums:
    for j from target down to num:
      dp[j] = dp[j] OR dp[j - num]
  return dp[target]`,
    python: `def canPartition(nums):
    total = sum(nums)
    if total % 2: return False
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
    int total = Arrays.stream(nums).sum();
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
  defaultInput: { nums: [1, 5, 11, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 5, 11, 5],
      placeholder: '1,5,11,5',
      helperText: 'Positive integers to partition into two equal-sum subsets',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const total = nums.reduce((a, b) => a + b, 0);
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Partition Equal Subset Sum: nums=[${nums.join(', ')}], total=${total}. Can we split into two equal-sum subsets?`,
      variables: { nums, total },
      visualization: {
        type: 'dp-table',
        values: [total],
        highlights: { 0: 'active' },
        labels: ['total'],
      },
    });

    if (total % 2 !== 0) {
      steps.push({
        line: 2,
        explanation: `Total ${total} is odd. Cannot split into two equal integer halves. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'dp-table',
          values: [total],
          highlights: { 0: 'mismatch' },
          labels: ['total'],
        },
      });
      return steps;
    }

    const target = total / 2;
    const dp: (boolean | null)[] = new Array(target + 1).fill(null);
    const dpVals: (number | null)[] = new Array(target + 1).fill(null);
    const labels: string[] = Array.from({ length: target + 1 }, (_, i) => String(i));

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= target; i++) {
        if (dp[i] !== null) highlights[i] = dp[i] ? 'found' : 'visited';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= target) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dpVals.slice(), highlights, labels };
    }

    steps.push({
      line: 3,
      explanation: `Target = total/2 = ${target}. Find if any subset sums to ${target}. dp[j] = 1 if subset summing to j is possible.`,
      variables: { target },
      visualization: makeViz(null, []),
    });

    dp[0] = true;
    dpVals[0] = 1;
    for (let i = 1; i <= target; i++) { dp[i] = false; dpVals[i] = 0; }

    steps.push({
      line: 5,
      explanation: 'dp[0] = true. Sum of 0 is always achievable (empty subset). All others start false.',
      variables: { 'dp[0]': true },
      visualization: makeViz(0, []),
    });

    for (const num of nums) {
      steps.push({
        line: 6,
        explanation: `Processing num=${num}. Update dp from right to left to avoid using this num twice.`,
        variables: { num },
        visualization: makeViz(null, []),
      });

      for (let j = target; j >= num; j--) {
        const before = dp[j];
        const fromPrev = dp[j - num];
        if (!dp[j] && dp[j - num]) {
          dp[j] = true;
          dpVals[j] = 1;
          steps.push({
            line: 7,
            explanation: `dp[${j}]: was false, dp[${j}-${num}]=dp[${j - num}]=true. Adding num=${num} reaches sum ${j}! dp[${j}]=true.`,
            variables: { j, num, 'dp[j-num]': fromPrev, 'dp[j]': dp[j] },
            visualization: makeViz(j, [j - num]),
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `dp[${target}] = ${dp[target]}. ${dp[target] ? `YES — a subset summing to ${target} exists, array CAN be partitioned equally.` : `NO — no subset summing to ${target}, cannot partition equally.`}`,
      variables: { result: dp[target] },
      visualization: {
        type: 'dp-table',
        values: dpVals.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: target + 1 }, (_, i) => [
            i,
            i === target ? 'active' : dp[i] ? 'found' : 'visited',
          ])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default partitionEqualSubsetSum;
