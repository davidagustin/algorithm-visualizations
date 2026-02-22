import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortArrayByIncreasingFrequencyII: AlgorithmDefinition = {
  id: 'sort-array-by-increasing-frequency-ii',
  title: 'Sort Array by Increasing Frequency II',
  leetcodeNumber: 1636,
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'LC 1636: Sort the array such that elements with lower frequency come first. Break ties by sorting elements with higher value first.',
  tags: ['Sorting', 'Array', 'Hash Map', 'Custom Sort'],
  code: {
    pseudocode: `function frequencySort(nums):
  freq = frequency map of nums
  sort nums by:
    primary: freq[a] ascending
    secondary: a descending (larger value first)
  return nums`,
    python: `def frequencySort(nums):
    from collections import Counter
    freq = Counter(nums)
    return sorted(nums, key=lambda x: (freq[x], -x))`,
    javascript: `function frequencySort(nums) {
  const freq = {};
  for (const x of nums) freq[x] = (freq[x] || 0) + 1;
  return nums.sort((a, b) => freq[a] !== freq[b] ? freq[a] - freq[b] : b - a);
}`,
    java: `public int[] frequencySort(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);
    Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);
    Arrays.sort(arr, (a, b) -> freq.get(a).equals(freq.get(b)) ? b - a : freq.get(a) - freq.get(b));
    return Arrays.stream(arr).mapToInt(Integer::intValue).toArray();
}`,
  },
  defaultInput: { nums: [1, 1, 2, 2, 2, 3] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 2, 3],
      placeholder: '1,1,2,2,2,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Freq Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Sort [${nums.join(', ')}] by increasing frequency, ties broken by decreasing value.`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'comparing'])), {}),
    });

    const freq: Record<number, number> = {};
    for (const x of nums) freq[x] = (freq[x] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Frequency map: ${Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(', ')}.`,
      variables: { freq: { ...freq } },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        Object.fromEntries(nums.map((v, i) => [i, `f${freq[v]}`])),
        [{ key: 'Freq', value: Object.entries(freq).map(([k, v]) => `${k}→${v}`).join(', ') }],
      ),
    });

    nums.sort((a, b) => freq[a] !== freq[b] ? freq[a] - freq[b] : b - a);

    steps.push({
      line: 3,
      explanation: `Sort by (freq asc, value desc). Result: [${nums.join(', ')}].`,
      variables: { sorted: [...nums] },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        Object.fromEntries(nums.map((v, i) => [i, `f${freq[v]}`])),
        [{ key: 'Sorted', value: nums.join(', ') }],
      ),
    });

    steps.push({
      line: 1,
      explanation: `Frequency sort complete! [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Result', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default sortArrayByIncreasingFrequencyII;
