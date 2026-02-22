import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNumberOfDistinctIntegersAfterReverse: AlgorithmDefinition = {
  id: 'count-number-of-distinct-integers-after-reverse',
  title: 'Count Distinct Integers After Reversing and Adding',
  leetcodeNumber: 2442,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array nums, add the reverse of each integer to the array, then count the distinct integers. Use a hash set to collect both originals and their reversed versions, then return the set size.',
  tags: ['hash map', 'hash set', 'array', 'math'],

  code: {
    pseudocode: `function countDistinctIntegers(nums):
  seen = set(nums)
  for n in nums:
    reversed_n = int(str(n)[::-1])
    seen.add(reversed_n)
  return len(seen)`,
    python: `def countDistinctIntegers(nums):
    seen = set(nums)
    for n in nums:
        seen.add(int(str(n)[::-1]))
    return len(seen)`,
    javascript: `function countDistinctIntegers(nums) {
  const seen = new Set(nums);
  for (const n of nums) {
    seen.add(parseInt(String(n).split('').reverse().join('')));
  }
  return seen.size;
}`,
    java: `public int countDistinctIntegers(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) {
        seen.add(n);
        int rev = Integer.parseInt(new StringBuilder(String.valueOf(n)).reverse().toString());
        seen.add(rev);
    }
    return seen.size();
}`,
  },

  defaultInput: {
    nums: [1, 13, 10, 12, 31],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 13, 10, 12, 31],
      placeholder: '1,13,10,12,31',
      helperText: 'Comma-separated positive integers',
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

    const reverseNum = (n: number): number => parseInt(String(n).split('').reverse().join(''));

    const seen = new Set<number>(nums);

    steps.push({
      line: 1,
      explanation: `Initialize seen set with original values: {${Array.from(seen).join(', ')}}`,
      variables: { seen: `{${Array.from(seen).join(', ')}}`, size: seen.size },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const rev = reverseNum(n);
      const isNew = !seen.has(rev);
      seen.add(rev);

      steps.push({
        line: 3,
        explanation: `nums[${i}]=${n}: reversed = ${rev}. ${isNew ? 'New distinct integer! Added to set.' : 'Already in set.'}`,
        variables: { i, original: n, reversed: rev, isNew, setSize: seen.size },
        visualization: makeViz(
          { [i]: isNew ? 'found' : 'comparing' },
          { [i]: `rev=${rev}` }
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `All originals and reverses added. Distinct count = ${seen.size}. Set = {${Array.from(seen).sort((a, b) => a - b).join(', ')}}`,
      variables: { result: seen.size },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default countNumberOfDistinctIntegersAfterReverse;
