import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeDuplicatesSortedListIii: AlgorithmDefinition = {
  id: 'remove-duplicates-sorted-list-iii',
  title: 'Remove Duplicates from Sorted List (All Occurrences)',
  leetcodeNumber: 83,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Remove all duplicate numbers from a sorted array, keeping only elements that appear exactly once. Use a two-pointer approach: pointer i scans the array while pointer k tracks write position, skipping any value that appears more than once.',
  tags: ['two pointers', 'array', 'sorted'],

  code: {
    pseudocode: `function removeDuplicatesAll(nums):
  k = 0
  i = 0
  while i < length(nums):
    j = i
    while j < length(nums) and nums[j] == nums[i]: j++
    if j - i == 1:
      nums[k++] = nums[i]
    i = j
  return k`,

    python: `def removeDuplicatesAll(nums: list[int]) -> int:
    k = 0
    i = 0
    while i < len(nums):
        j = i
        while j < len(nums) and nums[j] == nums[i]:
            j += 1
        if j - i == 1:
            nums[k] = nums[i]
            k += 1
        i = j
    return k`,

    javascript: `function removeDuplicatesAll(nums) {
  let k = 0, i = 0;
  while (i < nums.length) {
    let j = i;
    while (j < nums.length && nums[j] === nums[i]) j++;
    if (j - i === 1) nums[k++] = nums[i];
    i = j;
  }
  return k;
}`,

    java: `public int removeDuplicatesAll(int[] nums) {
    int k = 0, i = 0;
    while (i < nums.length) {
        int j = i;
        while (j < nums.length && nums[j] == nums[i]) j++;
        if (j - i == 1) nums[k++] = nums[i];
        i = j;
    }
    return k;
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 3, 3, 3, 4, 5, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 3, 3, 4, 5, 5],
      placeholder: '1,2,2,3,3,3,4,5,5',
      helperText: 'Comma-separated sorted integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    let k = 0;
    let i = 0;
    const result = [...nums];

    steps.push({
      line: 1,
      explanation: `Remove all elements that appear more than once. k=0 (write pointer), i=0 (scan pointer).`,
      variables: { k, i },
      visualization: makeViz(nums, { [i]: 'active', [k]: 'pointer' }, { [i]: 'i', [k]: 'k' }),
    });

    while (i < nums.length) {
      let j = i;
      while (j < nums.length && nums[j] === nums[i]) j++;
      const count = j - i;

      steps.push({
        line: 4,
        explanation: `Value ${nums[i]} appears ${count} time(s) from index ${i} to ${j - 1}.`,
        variables: { value: nums[i], count, i, j },
        visualization: makeViz(
          result,
          Object.fromEntries(Array.from({ length: count }, (_, t) => [t + i, count === 1 ? 'found' : 'mismatch'])),
          { [i]: `val=${nums[i]}`, [j - 1]: `cnt=${count}` }
        ),
      });

      if (count === 1) {
        result[k] = nums[i];
        steps.push({
          line: 6,
          explanation: `${nums[i]} appears exactly once. Write to result[${k}]. k=${k + 1}.`,
          variables: { i, k, value: nums[i] },
          visualization: makeViz(result, { [k]: 'found', [i]: 'active' }, { [k]: 'k', [i]: 'i' }),
        });
        k++;
      } else {
        steps.push({
          line: 7,
          explanation: `${nums[i]} appears ${count} times. Skip all occurrences.`,
          variables: { i, k, value: nums[i], count },
          visualization: makeViz(
            result,
            Object.fromEntries(Array.from({ length: count }, (_, t) => [t + i, 'mismatch'])),
            {}
          ),
        });
      }

      i = j;
    }

    steps.push({
      line: 8,
      explanation: `Done. ${k} unique elements remain: [${result.slice(0, k).join(', ')}].`,
      variables: { k, result: result.slice(0, k) },
      visualization: makeViz(result, Object.fromEntries(Array.from({ length: k }, (_, t) => [t, 'found'])), { [k - 1]: 'end' }),
    });

    return steps;
  },
};

export default removeDuplicatesSortedListIii;
