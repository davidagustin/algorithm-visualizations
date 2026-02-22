import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const containsDuplicate: AlgorithmDefinition = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  leetcodeNumber: 217,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array, return true if any value appears at least twice in the array, and return false if every element is distinct. Use a hash set to track seen elements and detect duplicates in O(n) time.',
  tags: ['hash map', 'hash set', 'array', 'sorting'],

  code: {
    pseudocode: `function containsDuplicate(nums):
  seen = {}
  for num in nums:
    if num in seen:
      return true
    seen.add(num)
  return false`,

    python: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,

    javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,

    java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int num : nums) {
        if (!seen.add(num)) return true;
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1],
      placeholder: '1,2,3,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const seen = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Seen Set', entries },
    });

    const setToEntries = () =>
      Array.from(seen).map((v, i) => ({ key: `[${i}]`, value: String(v) }));

    steps.push({
      line: 1,
      explanation: `Check if [${nums.join(', ')}] contains any duplicates. Use a hash set to track seen numbers.`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}, []),
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];

      steps.push({
        line: 3,
        explanation: `Check nums[${i}] = ${num}. Is ${num} already in the seen set? Set = {${Array.from(seen).join(', ')}}.`,
        variables: { i, num, seen: Array.from(seen) },
        visualization: makeViz({ [i]: 'active' }, { [i]: String(num) }, setToEntries()),
      });

      if (seen.has(num)) {
        steps.push({
          line: 4,
          explanation: `${num} IS in the seen set! Duplicate found at index ${i}. Return true.`,
          variables: { i, num, duplicate: true },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'dup!' }, setToEntries()),
        });
        return steps;
      }

      seen.add(num);
      steps.push({
        line: 5,
        explanation: `${num} is NOT in seen. Add it. Seen set now = {${Array.from(seen).join(', ')}}.`,
        variables: { i, num, seen: Array.from(seen) },
        visualization: makeViz({ [i]: 'sorted' }, { [i]: String(num) }, setToEntries()),
      });
    }

    steps.push({
      line: 6,
      explanation: `Traversed all ${nums.length} elements. No duplicates found. Return false.`,
      variables: { result: false, seen: Array.from(seen) },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'visited'])),
        {},
        setToEntries()
      ),
    });

    return steps;
  },
};

export default containsDuplicate;
