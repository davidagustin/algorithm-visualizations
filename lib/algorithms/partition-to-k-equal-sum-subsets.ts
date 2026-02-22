import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const partitionToKEqualSumSubsets: AlgorithmDefinition = {
  id: 'partition-to-k-equal-sum-subsets',
  title: 'Partition to K Equal Sum Subsets',
  leetcodeNumber: 698,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of integers nums and a positive integer k, check if it is possible to divide the array into k non-empty subsets whose sums are all equal. Uses bitmask DP where dp[mask] = remaining sum in current bucket when elements in mask are used.',
  tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
  code: {
    pseudocode: `function canPartitionKSubsets(nums, k):
  total = sum(nums)
  if total % k != 0: return false
  target = total / k
  n = length(nums)
  dp = array of size 2^n, fill -1
  dp[0] = 0
  for mask from 0 to 2^n - 1:
    if dp[mask] == -1: continue
    for i from 0 to n-1:
      if mask has bit i set: continue
      next = dp[mask] + nums[i]
      if next <= target:
        dp[mask | (1 << i)] = next % target
  return dp[(1<<n)-1] == 0`,
    python: `def canPartitionKSubsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False
    target = total // k
    n = len(nums)
    dp = [-1] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] == -1:
            continue
        for i in range(n):
            if mask & (1 << i):
                continue
            next_val = dp[mask] + nums[i]
            if next_val <= target:
                dp[mask | (1 << i)] = next_val % target
    return dp[(1 << n) - 1] == 0`,
    javascript: `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  const n = nums.length;
  const dp = new Array(1 << n).fill(-1);
  dp[0] = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    if (dp[mask] === -1) continue;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      const next = dp[mask] + nums[i];
      if (next <= target) {
        dp[mask | (1 << i)] = next % target;
      }
    }
  }
  return dp[(1 << n) - 1] === 0;
}`,
    java: `public boolean canPartitionKSubsets(int[] nums, int k) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % k != 0) return false;
    int target = total / k;
    int n = nums.length;
    int[] dp = new int[1 << n];
    Arrays.fill(dp, -1);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] == -1) continue;
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) continue;
            int next = dp[mask] + nums[i];
            if (next <= target)
                dp[mask | (1 << i)] = next % target;
        }
    }
    return dp[(1 << n) - 1] == 0;
}`,
  },
  defaultInput: { nums: [4, 3, 2, 3, 5, 2, 1], k: 4 },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [4, 3, 2, 3, 5, 2, 1],
      placeholder: '4,3,2,3,5,2,1',
      helperText: 'Array of integers to partition',
    },
    {
      name: 'k',
      label: 'K (number of subsets)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of equal-sum subsets',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice(0, 5);
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    const size = 1 << n;
    const dp: (number | null)[] = new Array(size).fill(null);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );

    function makeViz(activeIdx: number | null, comparingIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let m = 0; m < size; m++) {
        if (dp[m] !== null) highlights[m] = 'found';
      }
      if (comparingIdx !== null) highlights[comparingIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    if (total % k !== 0) {
      steps.push({
        line: 2,
        explanation: `Sum=${total} not divisible by k=${k}. Return false.`,
        variables: { total, k },
        visualization: makeViz(null, null),
      });
      return steps;
    }

    const target = total / k;
    steps.push({
      line: 1,
      explanation: `nums=${JSON.stringify(nums)}, k=${k}. total=${total}, target per subset=${target}. dp[mask]=remaining sum in current bucket.`,
      variables: { nums, k, total, target },
      visualization: makeViz(null, null),
    });

    dp[0] = 0;
    steps.push({
      line: 7,
      explanation: 'dp[0]=0: empty mask, current bucket sum is 0.',
      variables: { 'dp[0]': 0 },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if (dp[mask] === null) continue;
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) continue;
        const next = (dp[mask] as number) + nums[i];
        if (next <= target) {
          const newMask = mask | (1 << i);
          dp[newMask] = next % target;
          steps.push({
            line: 11,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}: add nums[${i}]=${nums[i]}, sum=${next}<=target=${target}. dp[${newMask.toString(2).padStart(n,'0')}]=${next % target}.`,
            variables: { mask, i, next, newMask, 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    const result = dp[fullMask] === 0;
    steps.push({
      line: 13,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. ${result ? 'Can partition into k equal subsets!' : 'Cannot partition.'}`,
      variables: { result, 'dp[fullMask]': dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default partitionToKEqualSumSubsets;
