import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNumberOfBadPairs: AlgorithmDefinition = {
  id: 'count-number-of-bad-pairs',
  title: 'Count Number of Bad Pairs',
  leetcodeNumber: 2364,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'A bad pair (i, j) where i < j satisfies j - i != nums[j] - nums[i]. Count all bad pairs. Key insight: rearrange to nums[j] - j != nums[i] - i. Use a hash map to count how many previous indices share the same (nums[i] - i) value. Good pairs minus total gives bad pairs.',
  tags: ['hash map', 'array', 'math', 'counting'],

  code: {
    pseudocode: `function countBadPairs(nums):
  n = len(nums)
  total = n * (n - 1) / 2
  freq = {}
  goodPairs = 0
  for i in range(n):
    diff = nums[i] - i
    goodPairs += freq.get(diff, 0)
    freq[diff] = freq.get(diff, 0) + 1
  return total - goodPairs`,

    python: `def countBadPairs(nums: list[int]) -> int:
    n = len(nums)
    total = n * (n - 1) // 2
    freq = {}
    good = 0
    for i, v in enumerate(nums):
        d = v - i
        good += freq.get(d, 0)
        freq[d] = freq.get(d, 0) + 1
    return total - good`,

    javascript: `function countBadPairs(nums) {
  const n = nums.length;
  const total = n * (n - 1) / 2;
  const freq = new Map();
  let good = 0;
  for (let i = 0; i < n; i++) {
    const d = nums[i] - i;
    good += freq.get(d) || 0;
    freq.set(d, (freq.get(d) || 0) + 1);
  }
  return total - good;
}`,

    java: `public long countBadPairs(int[] nums) {
    long n = nums.length, total = n * (n - 1) / 2;
    Map<Integer, Long> freq = new HashMap<>();
    long good = 0;
    for (int i = 0; i < n; i++) {
        int d = nums[i] - i;
        good += freq.getOrDefault(d, 0L);
        freq.merge(d, 1L, Long::sum);
    }
    return total - good;
}`,
  },

  defaultInput: {
    nums: [4, 1, 3, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 1, 3, 3],
      placeholder: '4,1,3,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = (n * (n - 1)) / 2;
    const freq: Record<number, number> = {};
    let goodPairs = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `n = ${n}. Total pairs = n*(n-1)/2 = ${total}. We will count good pairs (j-i == nums[j]-nums[i]) using a hash map on (nums[i]-i) values. Bad pairs = total - good.`,
      variables: { n, total, goodPairs: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      const diff = nums[i] - i;

      steps.push({
        line: 6,
        explanation: `i=${i}: nums[${i}]=${nums[i]}. diff = nums[${i}] - ${i} = ${diff}. freq[${diff}] = ${freq[diff] || 0} previous indices share this diff value (good pairs with current).`,
        variables: { i, num: nums[i], diff, freq: JSON.stringify(freq), goodPairs },
        visualization: makeViz({ [i]: 'active' }, { [i]: `d=${diff}` }),
      });

      const matches = freq[diff] || 0;
      if (matches > 0) {
        goodPairs += matches;
        steps.push({
          line: 7,
          explanation: `Found ${matches} previous index/indices with diff=${diff}. goodPairs += ${matches} -> goodPairs = ${goodPairs}.`,
          variables: { i, diff, matches, goodPairs },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${matches} good` }),
        });
      }

      freq[diff] = (freq[diff] || 0) + 1;
      steps.push({
        line: 8,
        explanation: `Store diff=${diff} for index ${i} in freq map. freq[${diff}] = ${freq[diff]}.`,
        variables: { i, diff, freq: JSON.stringify(freq), goodPairs },
        visualization: makeViz({ [i]: 'visited' }, { [i]: 'stored' }),
      });
    }

    const badPairs = total - goodPairs;

    steps.push({
      line: 9,
      explanation: `Done. Total pairs = ${total}, good pairs = ${goodPairs}. Bad pairs = ${total} - ${goodPairs} = ${badPairs}.`,
      variables: { total, goodPairs, badPairs },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default countNumberOfBadPairs;
