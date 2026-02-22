import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const intersectionOfTwoArrays: AlgorithmDefinition = {
  id: 'intersection-of-two-arrays',
  title: 'Intersection of Two Arrays',
  leetcodeNumber: 349,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given two integer arrays nums1 and nums2, return an array of their intersection — elements that appear in both arrays, with each element appearing only once. Use a hash set for O(n+m) time complexity.',
  tags: ['hash map', 'hash set', 'array', 'binary search', 'sorting'],

  code: {
    pseudocode: `function intersection(nums1, nums2):
  set1 = set(nums1)
  result = {}
  for num in nums2:
    if num in set1:
      result.add(num)
  return list(result)`,

    python: `def intersection(nums1: list[int], nums2: list[int]) -> list[int]:
    set1 = set(nums1)
    result = set()
    for num in nums2:
        if num in set1:
            result.add(num)
    return list(result)`,

    javascript: `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();
  for (const num of nums2) {
    if (set1.has(num)) result.add(num);
  }
  return [...result];
}`,

    java: `public int[] intersection(int[] nums1, int[] nums2) {
    Set<Integer> set1 = new HashSet<>();
    for (int n : nums1) set1.add(n);
    Set<Integer> result = new HashSet<>();
    for (int n : nums2) if (set1.contains(n)) result.add(n);
    return result.stream().mapToInt(Integer::intValue).toArray();
}`,
  },

  defaultInput: {
    nums1: [4, 9, 5],
    nums2: [9, 4, 9, 8, 4],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [4, 9, 5],
      placeholder: '4,9,5',
      helperText: 'First array of integers',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [9, 4, 9, 8, 4],
      placeholder: '9,4,9,8,4',
      helperText: 'Second array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];
    const set1 = new Set<number>();
    const result = new Set<number>();

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxLabel: string,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: { label: auxLabel, entries },
    });

    steps.push({
      line: 1,
      explanation: `Find intersection of nums1=[${nums1.join(', ')}] and nums2=[${nums2.join(', ')}]. Build a set from nums1 first.`,
      variables: { nums1: [...nums1], nums2: [...nums2] },
      visualization: makeViz(nums1, {}, {}, 'Set 1', []),
    });

    // Build set1
    for (let i = 0; i < nums1.length; i++) {
      set1.add(nums1[i]);
      steps.push({
        line: 2,
        explanation: `Add nums1[${i}] = ${nums1[i]} to set1. Set1 = {${Array.from(set1).join(', ')}}.`,
        variables: { i, num: nums1[i], set1: Array.from(set1) },
        visualization: makeViz(
          nums1,
          { [i]: 'active' },
          { [i]: String(nums1[i]) },
          'Set 1',
          Array.from(set1).map((v) => ({ key: String(v), value: 'in set' }))
        ),
      });
    }

    steps.push({
      line: 3,
      explanation: `Set1 complete: {${Array.from(set1).join(', ')}}. Now scan nums2 for elements in set1.`,
      variables: { set1: Array.from(set1) },
      visualization: makeViz(
        nums2,
        {},
        {},
        'Set 1',
        Array.from(set1).map((v) => ({ key: String(v), value: 'in set' }))
      ),
    });

    // Check nums2
    for (let i = 0; i < nums2.length; i++) {
      const num = nums2[i];
      const found = set1.has(num);

      steps.push({
        line: 4,
        explanation: `nums2[${i}] = ${num}. Is ${num} in set1? ${found ? 'YES — add to result.' : 'NO — skip.'}`,
        variables: { i, num, inSet1: found, result: Array.from(result) },
        visualization: makeViz(
          nums2,
          { [i]: found ? 'found' : 'mismatch' },
          { [i]: found ? 'match' : 'skip' },
          'Result Set',
          Array.from(result).map((v, j) => ({ key: `[${j}]`, value: String(v) }))
        ),
      });

      if (found) {
        result.add(num);
        steps.push({
          line: 5,
          explanation: `Added ${num} to result set. Result = {${Array.from(result).join(', ')}}.`,
          variables: { num, result: Array.from(result) },
          visualization: makeViz(
            nums2,
            { [i]: 'found' },
            { [i]: String(num) },
            'Result Set',
            Array.from(result).map((v, j) => ({ key: `[${j}]`, value: String(v) }))
          ),
        });
      }
    }

    const resultArr = Array.from(result);
    steps.push({
      line: 6,
      explanation: `Done! Intersection = [${resultArr.join(', ')}]. Each element appears only once.`,
      variables: { result: resultArr },
      visualization: makeViz(
        nums2,
        Object.fromEntries(nums2.map((n, i) => [i, result.has(n) ? 'sorted' : 'visited'])),
        {},
        'Final Intersection',
        resultArr.map((v, i) => ({ key: `[${i}]`, value: String(v) }))
      ),
    });

    return steps;
  },
};

export default intersectionOfTwoArrays;
