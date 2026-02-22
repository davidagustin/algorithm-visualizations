import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeDuplicatesFromSortedArrayIi: AlgorithmDefinition = {
  id: 'remove-duplicates-from-sorted-array-ii',
  title: 'Remove Duplicates from Sorted Array II',
  leetcodeNumber: 80,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given a sorted array, remove duplicates in-place such that each unique element appears at most twice. Return the new length. Uses a slow pointer k that tracks the write position and a fast pointer i that scans the array.',
  tags: ['two pointers', 'array', 'sorted', 'in-place'],

  code: {
    pseudocode: `function removeDuplicates(nums):
  k = 0
  for i = 0 to length(nums)-1:
    if k < 2 or nums[i] != nums[k-2]:
      nums[k] = nums[i]
      k++
  return k`,

    python: `def removeDuplicates(nums: list[int]) -> int:
    k = 0
    for num in nums:
        if k < 2 or num != nums[k - 2]:
            nums[k] = num
            k += 1
    return k`,

    javascript: `function removeDuplicates(nums) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (k < 2 || nums[i] !== nums[k - 2]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,

    java: `public int removeDuplicates(int[] nums) {
    int k = 0;
    for (int num : nums) {
        if (k < 2 || num != nums[k - 2]) {
            nums[k++] = num;
        }
    }
    return k;
}`,
  },

  defaultInput: {
    nums: [1, 1, 1, 2, 2, 3, 3, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 1, 1, 2, 2, 3, 3, 3],
      placeholder: '1,1,1,2,2,3,3,3',
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
    const arr = [...nums];

    steps.push({
      line: 1,
      explanation: 'Initialize write pointer k = 0. We will allow at most 2 occurrences of each element.',
      variables: { k, i: 0 },
      visualization: makeViz(arr, {}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const canWrite = k < 2 || nums[i] !== arr[k - 2];

      steps.push({
        line: 3,
        explanation: `Scanning index ${i}, value ${nums[i]}. k=${k}. ${canWrite ? `nums[${i}] != nums[k-2] (${k >= 2 ? arr[k - 2] : 'N/A'}), so we can write.` : `nums[${i}] == nums[k-2]=${arr[k - 2]}, skip (already have 2 copies).`}`,
        variables: { i, k, value: nums[i], canWrite },
        visualization: makeViz(arr, { [i]: canWrite ? 'active' : 'mismatch', [k]: 'pointer' }, { [i]: 'i', [k]: 'k' }),
      });

      if (canWrite) {
        arr[k] = nums[i];
        steps.push({
          line: 5,
          explanation: `Write nums[${i}]=${nums[i]} to position k=${k}. Increment k to ${k + 1}.`,
          variables: { i, k, writtenValue: nums[i] },
          visualization: makeViz(arr, { [k]: 'found', [i]: 'active' }, { [i]: 'i', [k]: 'k' }),
        });
        k++;
      }
    }

    steps.push({
      line: 6,
      explanation: `Done. New length k=${k}. First ${k} elements are the valid result.`,
      variables: { k, result: arr.slice(0, k) },
      visualization: makeViz(arr, Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'found'])), { [k - 1]: 'end' }),
    });

    return steps;
  },
};

export default removeDuplicatesFromSortedArrayIi;
