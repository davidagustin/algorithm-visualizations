import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfUniqueElementsIi: AlgorithmDefinition = {
  id: 'sum-of-unique-elements-ii',
  title: 'Sum of Unique Elements',
  leetcodeNumber: 1748,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array nums, return the sum of all the unique elements of nums (elements that appear exactly once). Build a frequency map, then sum only the elements with a count of 1.',
  tags: ['hash map', 'array', 'frequency', 'sum'],

  code: {
    pseudocode: `function sumOfUnique(nums):
  freq = {}
  for n in nums:
    freq[n] = freq.get(n, 0) + 1
  return sum(n for n, cnt in freq.items() if cnt == 1)`,
    python: `def sumOfUnique(nums):
    from collections import Counter
    freq = Counter(nums)
    return sum(n for n, c in freq.items() if c == 1)`,
    javascript: `function sumOfUnique(nums) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n)||0)+1);
  let sum = 0;
  for (const [n, c] of freq) if (c === 1) sum += n;
  return sum;
}`,
    java: `public int sumOfUnique(int[] nums) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    return freq.entrySet().stream().filter(e -> e.getValue()==1).mapToInt(Map.Entry::getKey).sum();
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 2],
      placeholder: '1,2,3,2',
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

    const freq: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: 'Build frequency map for all elements.',
      variables: { freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      freq[n] = (freq[n] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `nums[${i}]=${n}: freq[${n}]=${freq[n]}`,
        variables: { index: i, value: n, [`freq[${n}]`]: freq[n] },
        visualization: makeViz(
          { [i]: freq[n] === 1 ? 'active' : 'comparing' },
          { [i]: `${freq[n]}x` }
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Frequency map complete: ${Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(', ')}. Now sum unique elements (count=1).`,
      variables: { freq: JSON.stringify(freq) },
      visualization: makeViz({}, {}),
    });

    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const cnt = freq[n];
      if (cnt === 1) {
        sum += n;
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${n} is unique (count=1). sum += ${n} = ${sum}`,
          variables: { index: i, value: n, count: cnt, sum },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${n}` }),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${n} appears ${cnt} times. Skip (not unique).`,
          variables: { index: i, value: n, count: cnt },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: `${cnt}x` }),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Sum of all unique elements = ${sum}.`,
      variables: { result: sum },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, freq[nums[i]] === 1 ? 'found' : 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default sumOfUniqueElementsIi;
