import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const waysToSplitArrayIntoGoodSubarrays: AlgorithmDefinition = {
  id: 'ways-to-split-array-into-good-subarrays',
  title: 'Ways to Split Array Into Good Subarrays',
  leetcodeNumber: 2750,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of ways to split a binary array into subarrays each containing exactly one 1. Between every two consecutive 1s there are some 0s; the number of split positions between them equals (gap between 1s). Multiply all such gaps. Return answer mod 10^9+7.',
  tags: ['Prefix Sum', 'Array', 'Math'],
  code: {
    pseudocode: `function numberOfGoodSubarraySplits(nums):
  MOD = 1e9 + 7
  positions of 1s: ones[]
  if no 1s: return 0  # can't split
  ans = 1
  for i from 1 to len(ones)-1:
    gap = ones[i] - ones[i-1]   # number of positions between consecutive 1s
    ans = ans * gap % MOD
  return ans`,
    python: `def numberOfGoodSubarraySplits(nums: list[int]) -> int:
    MOD = 10**9 + 7
    ones = [i for i, x in enumerate(nums) if x == 1]
    if not ones:
        return 0
    ans = 1
    for i in range(1, len(ones)):
        ans = ans * (ones[i] - ones[i - 1]) % MOD
    return ans`,
    javascript: `function numberOfGoodSubarraySplits(nums) {
  const MOD = 1_000_000_007n;
  const ones = nums.reduce((a, x, i) => x ? [...a, i] : a, []);
  if (!ones.length) return 0;
  let ans = 1n;
  for (let i = 1; i < ones.length; i++)
    ans = ans * BigInt(ones[i] - ones[i - 1]) % MOD;
  return Number(ans);
}`,
    java: `public int numberOfGoodSubarraySplits(int[] nums) {
    final int MOD = 1_000_000_007;
    List<Integer> ones = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) if (nums[i] == 1) ones.add(i);
    if (ones.isEmpty()) return 0;
    long ans = 1;
    for (int i = 1; i < ones.size(); i++)
        ans = ans * (ones.get(i) - ones.get(i-1)) % MOD;
    return (int) ans;
}`,
  },
  defaultInput: { nums: [0, 1, 0, 0, 1, 0, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [0, 1, 0, 0, 1, 0, 1],
      placeholder: '0,1,0,0,1,0,1',
      helperText: 'Array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;
    const ones: number[] = [];
    for (let i = 0; i < nums.length; i++) if (nums[i] === 1) ones.push(i);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count ways to split [${nums.join(', ')}] into subarrays each with exactly one 1. Positions of 1s: [${ones.join(', ')}].`,
      variables: { nums, ones },
      visualization: makeViz(
        Object.fromEntries(ones.map(idx => [idx, 'found'])),
        Object.fromEntries(ones.map(idx => [idx, '1'])),
      ),
    });

    if (ones.length === 0) {
      steps.push({
        line: 4,
        explanation: `No 1s in array. Cannot split into good subarrays. Return 0.`,
        variables: { result: 0 },
        visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])), {}),
      });
      return steps;
    }

    let ans = 1;
    for (let i = 1; i < ones.length; i++) {
      const gap = ones[i] - ones[i - 1];
      ans = Math.floor((ans * gap) % MOD);

      steps.push({
        line: 6,
        explanation: `Between 1 at index ${ones[i - 1]} and 1 at index ${ones[i]}: gap = ${gap} positions. ans = ${ans}.`,
        variables: { gap, ans, 'ones[i]': ones[i], 'ones[i-1]': ones[i - 1] },
        visualization: makeViz(
          {
            ...Object.fromEntries(
              Array.from({ length: gap - 1 }, (_, k) => [ones[i - 1] + 1 + k, 'active']),
            ),
            [ones[i - 1]]: 'comparing',
            [ones[i]]: 'comparing',
          },
          { [ones[i - 1]]: '1', [ones[i]]: `1 gap=${gap}` },
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `Total ways to split: ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${ans}` },
      ),
    });

    return steps;
  },
};

export default waysToSplitArrayIntoGoodSubarrays;
