import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfUniqueElements: AlgorithmDefinition = {
  id: 'sum-of-unique-elements',
  title: 'Sum of Unique Elements',
  leetcodeNumber: 1748,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Sum all elements that appear exactly once in the array. Build a frequency map of all elements, then iterate and sum only those with frequency equal to 1. Uses a hash map to count occurrences in O(n) time.',
  tags: ['hash map', 'array', 'counting'],

  code: {
    pseudocode: `function sumOfUnique(nums):
  freq = {}
  for num in nums:
    freq[num] = freq.get(num, 0) + 1
  total = 0
  for num, count in freq.items():
    if count == 1:
      total += num
  return total`,

    python: `from collections import Counter
def sumOfUnique(nums: list[int]) -> int:
    freq = Counter(nums)
    return sum(n for n, c in freq.items() if c == 1)`,

    javascript: `function sumOfUnique(nums) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  let total = 0;
  for (const [n, c] of freq) if (c === 1) total += n;
  return total;
}`,

    java: `public int sumOfUnique(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    return freq.entrySet().stream()
        .filter(e -> e.getValue() == 1)
        .mapToInt(Map.Entry::getKey).sum();
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 2, 5, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 2, 5, 1],
      placeholder: '1,2,3,2,5,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const freq: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Build a frequency map counting how many times each element appears.',
      variables: { freq: '{}', total: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      freq[nums[i]] = (freq[nums[i]] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `nums[${i}]=${nums[i]}: freq[${nums[i]}] = ${freq[nums[i]]}.`,
        variables: { i, num: nums[i], freq: JSON.stringify(freq) },
        visualization: makeViz(
          { [i]: freq[nums[i]] === 1 ? 'active' : 'mismatch' },
          { [i]: `f=${freq[nums[i]]}` }
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Frequency map complete: ${JSON.stringify(freq)}. Now sum all elements with count = 1.`,
      variables: { freq: JSON.stringify(freq), total: 0 },
      visualization: makeViz({}, {}),
    });

    let total = 0;

    for (let i = 0; i < nums.length; i++) {
      if (freq[nums[i]] === 1) {
        total += nums[i];
        steps.push({
          line: 7,
          explanation: `nums[${i}]=${nums[i]} appears exactly once. Add to total. total = ${total}.`,
          variables: { num: nums[i], count: 1, total },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${nums[i]}` }),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${nums[i]} appears ${freq[nums[i]]} times (not unique). Skip.`,
          variables: { num: nums[i], count: freq[nums[i]], total },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `x${freq[nums[i]]}` }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Sum of unique elements = ${total}.`,
      variables: { result: total },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default sumOfUniqueElements;
