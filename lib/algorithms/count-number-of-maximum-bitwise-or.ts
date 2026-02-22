import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const countNumberOfMaximumBitwiseOr: AlgorithmDefinition = {
  id: 'count-number-of-maximum-bitwise-or',
  title: 'Count Number of Maximum Bitwise-OR Subsets',
  leetcodeNumber: 2044,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array, find the maximum possible bitwise OR of a subset, then count how many subsets achieve that maximum. The maximum OR is the OR of all elements. Uses bitmask DP or enumeration over all 2^n subsets.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array', 'Backtracking'],
  code: {
    pseudocode: `function countMaxOrSubsets(nums):
  n = length(nums)
  maxOr = OR of all nums
  count = 0
  for mask from 1 to 2^n - 1:
    subsetOr = 0
    for i from 0 to n-1:
      if mask has bit i: subsetOr |= nums[i]
    if subsetOr == maxOr: count++
  return count`,
    python: `def countMaxOrSubsets(nums):
    n = len(nums)
    max_or = 0
    for x in nums: max_or |= x
    count = 0
    for mask in range(1, 1 << n):
        subset_or = 0
        for i in range(n):
            if mask >> i & 1:
                subset_or |= nums[i]
        if subset_or == max_or:
            count += 1
    return count`,
    javascript: `function countMaxOrSubsets(nums) {
  const n = nums.length;
  const maxOr = nums.reduce((acc, x) => acc | x, 0);
  let count = 0;
  for (let mask = 1; mask < (1 << n); mask++) {
    let subsetOr = 0;
    for (let i = 0; i < n; i++) {
      if (mask >> i & 1) subsetOr |= nums[i];
    }
    if (subsetOr === maxOr) count++;
  }
  return count;
}`,
    java: `public int countMaxOrSubsets(int[] nums) {
    int n = nums.length;
    int maxOr = 0;
    for (int x : nums) maxOr |= x;
    int count = 0;
    for (int mask = 1; mask < (1 << n); mask++) {
        int subOr = 0;
        for (int i = 0; i < n; i++)
            if ((mask >> i & 1) != 0) subOr |= nums[i];
        if (subOr == maxOr) count++;
    }
    return count;
}`,
  },
  defaultInput: { nums: [3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [3, 1],
      placeholder: '3,1',
      helperText: 'Array of integers (max 5 elements)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice(0, 5);
    const n = nums.length;
    const size = 1 << n;
    const maxOr = nums.reduce((acc, x) => acc | x, 0);

    const dp: (number | null)[] = new Array(size).fill(null);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if (dp[mask] !== null) {
          highlights[mask] = (dp[mask] as number) === maxOr ? 'active' : 'found';
        }
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `nums=${JSON.stringify(nums)}. Maximum possible OR=${maxOr}. Enumerate all ${size-1} non-empty subsets.`,
      variables: { nums, maxOr, n },
      visualization: makeViz(null),
    });

    let count = 0;
    for (let mask = 1; mask < size; mask++) {
      let subsetOr = 0;
      for (let i = 0; i < n; i++) {
        if (mask >> i & 1) subsetOr |= nums[i];
      }
      dp[mask] = subsetOr;
      if (subsetOr === maxOr) {
        count++;
        steps.push({
          line: 7,
          explanation: `mask=${mask.toString(2).padStart(n,'0')}: OR=${subsetOr}=maxOr! count=${count}.`,
          variables: { mask, subsetOr, maxOr, count },
          visualization: makeViz(mask),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Total subsets achieving maximum OR ${maxOr}: ${count}.`,
      variables: { result: count, maxOr },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default countNumberOfMaximumBitwiseOr;
