import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nRepeatedElement: AlgorithmDefinition = {
  id: 'n-repeated-element',
  title: 'N-Repeated Element in Size 2N Array',
  leetcodeNumber: 961,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'In a size 2N array, exactly one element is repeated N times and all other elements are distinct. Use a hash set to detect the first duplicate element seen during iteration, which must be the N-repeated element.',
  tags: ['hash map', 'hash set', 'array', 'frequency'],

  code: {
    pseudocode: `function repeatedNTimes(nums):
  seen = set()
  for n in nums:
    if n in seen:
      return n
    seen.add(n)
  return -1`,
    python: `def repeatedNTimes(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return n
        seen.add(n)
    return -1`,
    javascript: `function repeatedNTimes(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return -1;
}`,
    java: `public int repeatedNTimes(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        if (!seen.add(n)) return n;
    }
    return -1;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 3],
      placeholder: '1,2,3,3',
      helperText: 'Array of size 2N with one element repeated N times',
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

    const seen = new Set<number>();

    steps.push({
      line: 1,
      explanation: `Initialize empty set. Array size = ${nums.length}, so N = ${nums.length / 2}. Looking for element repeated ${nums.length / 2} times.`,
      variables: { n: nums.length / 2, seen: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];

      if (seen.has(val)) {
        steps.push({
          line: 4,
          explanation: `Index ${i}: value ${val} is already in the set. This is the N-repeated element!`,
          variables: { i, value: val, seen: `{${Array.from(seen).join(', ')}}`, result: val },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'dup!' }),
        });
        return steps;
      }

      steps.push({
        line: 5,
        explanation: `Index ${i}: value ${val} not in set. Add it. seen = {${Array.from(seen).join(', ')}, ${val}}`,
        variables: { i, value: val, seen: `{${Array.from(seen).join(', ')}}` },
        visualization: makeViz({ [i]: 'active' }, { [i]: `+${val}` }),
      });
      seen.add(val);
    }

    steps.push({
      line: 6,
      explanation: 'No duplicate found (should not happen for valid input).',
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default nRepeatedElement;
