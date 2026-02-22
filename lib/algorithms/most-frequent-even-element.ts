import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mostFrequentEvenElement: AlgorithmDefinition = {
  id: 'most-frequent-even-element',
  title: 'Most Frequent Even Element',
  leetcodeNumber: 2404,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array nums, return the most frequent even element. If there is a tie, return the smallest one. If there are no even elements, return -1. Build a frequency map of even numbers only, then find the maximum frequency, choosing the smallest value on ties.',
  tags: ['hash map', 'array', 'frequency', 'sorting'],

  code: {
    pseudocode: `function mostFrequentEven(nums):
  freq = {}
  for n in nums:
    if n % 2 == 0:
      freq[n] = freq.get(n, 0) + 1
  if not freq: return -1
  maxFreq = max(freq.values())
  return min(n for n, c in freq.items() if c == maxFreq)`,
    python: `def mostFrequentEven(nums):
    freq = {}
    for n in nums:
        if n % 2 == 0:
            freq[n] = freq.get(n, 0) + 1
    if not freq: return -1
    maxFreq = max(freq.values())
    return min(n for n, c in freq.items() if c == maxFreq)`,
    javascript: `function mostFrequentEven(nums) {
  const freq = new Map();
  for (const n of nums) {
    if (n % 2 === 0) freq.set(n, (freq.get(n)||0)+1);
  }
  if (!freq.size) return -1;
  const max = Math.max(...freq.values());
  return Math.min(...[...freq.entries()].filter(([,c])=>c===max).map(([n])=>n));
}`,
    java: `public int mostFrequentEven(int[] nums) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int n : nums) if (n%2==0) freq.merge(n, 1, Integer::sum);
    if (freq.isEmpty()) return -1;
    int max = Collections.max(freq.values());
    return freq.entrySet().stream().filter(e->e.getValue()==max).mapToInt(Map.Entry::getKey).min().getAsInt();
}`,
  },

  defaultInput: {
    nums: [0, 1, 2, 2, 4, 4, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 1, 2, 2, 4, 4, 1],
      placeholder: '0,1,2,2,4,4,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const freq = new Map<number, number>();

    steps.push({
      line: 1,
      explanation: 'Build frequency map for even elements only.',
      variables: { freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      if (n % 2 === 0) {
        freq.set(n, (freq.get(n) || 0) + 1);
        steps.push({
          line: 3,
          explanation: `nums[${i}]=${n} is even. freq[${n}]=${freq.get(n)}`,
          variables: { index: i, value: n, [`freq[${n}]`]: freq.get(n) },
          visualization: makeViz({ [i]: 'active' }, { [i]: `${freq.get(n)}x` }),
        });
      } else {
        steps.push({
          line: 3,
          explanation: `nums[${i}]=${n} is odd. Skip.`,
          variables: { index: i, value: n },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'odd' }),
        });
      }
    }

    if (freq.size === 0) {
      steps.push({
        line: 5,
        explanation: 'No even elements found. Return -1.',
        variables: { result: -1 },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'mismatch'])),
          Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
        ),
      });
      return steps;
    }

    const maxFreq = Math.max(...freq.values());
    const candidates = [...freq.entries()].filter(([, c]) => c === maxFreq).map(([n]) => n);
    const result = Math.min(...candidates);

    steps.push({
      line: 6,
      explanation: `Even frequencies: ${[...freq.entries()].map(([k, v]) => `${k}:${v}`).join(', ')}. Max frequency = ${maxFreq}.`,
      variables: { maxFreq, candidates: `[${candidates.join(', ')}]` },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, nums[i] % 2 === 0 ? 'comparing' : 'mismatch'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    steps.push({
      line: 7,
      explanation: `Candidates with max frequency ${maxFreq}: [${candidates.join(', ')}]. Return smallest: ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, nums[i] === result ? 'found' : 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, nums[i] === result ? 'best' : `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default mostFrequentEvenElement;
