import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNicePairs: AlgorithmDefinition = {
  id: 'count-nice-pairs',
  title: 'Count Nice Pairs in an Array',
  leetcodeNumber: 1814,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count pairs (i,j) where i < j and nums[i]+rev(nums[j]) == nums[j]+rev(nums[i]), equivalently nums[i]-rev(nums[i]) == nums[j]-rev(nums[j]). Compute diff[i]=nums[i]-rev(nums[i]) for each element, then count pairs with equal diff values using a frequency map. O(n*D) where D is digits.',
  tags: ['Prefix Sum', 'Hash Map', 'Array', 'Math'],
  code: {
    pseudocode: `function countNicePairs(nums):
  MOD = 1e9+7
  rev(n) = reverse digits of n
  diff = [num - rev(num) for num in nums]
  freq = {}
  ans = 0
  for d in diff:
    ans = (ans + freq.get(d, 0)) % MOD
    freq[d] = freq.get(d, 0) + 1
  return ans`,
    python: `def countNicePairs(nums: list[int]) -> int:
    MOD = 10**9 + 7
    def rev(n): return int(str(n)[::-1])
    freq = {}
    ans = 0
    for num in nums:
        d = num - rev(num)
        ans = (ans + freq.get(d, 0)) % MOD
        freq[d] = freq.get(d, 0) + 1
    return ans`,
    javascript: `function countNicePairs(nums) {
  const MOD = 1_000_000_007;
  const rev = n => parseInt(String(n).split('').reverse().join(''));
  const freq = new Map();
  let ans = 0;
  for (const num of nums) {
    const d = num - rev(num);
    ans = (ans + (freq.get(d) ?? 0)) % MOD;
    freq.set(d, (freq.get(d) ?? 0) + 1);
  }
  return ans;
}`,
    java: `public int countNicePairs(int[] nums) {
    final int MOD = 1_000_000_007;
    Map<Integer,Integer> freq = new HashMap<>();
    long ans = 0;
    for (int num : nums) {
        int rev = Integer.parseInt(new StringBuilder(String.valueOf(num)).reverse().toString());
        int d = num - rev;
        ans = (ans + freq.getOrDefault(d, 0)) % MOD;
        freq.put(d, freq.getOrDefault(d, 0) + 1);
    }
    return (int) ans;
}`,
  },
  defaultInput: { nums: [13, 10, 35, 24, 76] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [13, 10, 35, 24, 76],
      placeholder: '13,10,35,24,76',
      helperText: 'Non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const rev = (x: number) => parseInt(String(x).split('').reverse().join(''));
    const diffs = nums.map(x => x - rev(x));

    const freq = new Map<number, number>();
    let ans = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Diff Freq',
        entries: Array.from(freq.entries()).map(([d, c]) => ({ key: `d=${d}`, value: `cnt=${c}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Count nice pairs. nums=[${nums.join(', ')}]. Compute diff[i]=nums[i]-rev(nums[i]): [${diffs.join(', ')}].`,
      variables: { nums, diffs },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      const d = diffs[i];
      const existing = freq.get(d) ?? 0;

      steps.push({
        line: 6,
        explanation: `Index ${i}: nums[${i}]=${nums[i]}, rev=${rev(nums[i])}, diff=${d}. Found ${existing} prior with same diff.`,
        variables: { i, num: nums[i], rev: rev(nums[i]), diff: d, existing },
        visualization: makeViz(
          { [i]: existing > 0 ? 'found' : 'active' },
          { [i]: `d=${d}` },
        ),
      });

      ans = (ans + existing) % 1_000_000_007;
      freq.set(d, existing + 1);

      steps.push({
        line: 8,
        explanation: `ans += ${existing} → ans = ${ans}. freq[${d}] = ${freq.get(d)}.`,
        variables: { ans },
        visualization: makeViz({ [i]: 'visited' }, { [i]: `ans=${ans}` }),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. Total nice pairs: ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${ans}` },
      ),
    });

    return steps;
  },
};

export default countNicePairs;
