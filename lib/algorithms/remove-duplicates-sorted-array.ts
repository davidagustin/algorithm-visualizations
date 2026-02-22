import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeDuplicatesSortedArray: AlgorithmDefinition = {
  id: 'remove-duplicates-sorted-array',
  title: 'Remove Duplicates from Sorted Array',
  leetcodeNumber: 26,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given a sorted array, remove duplicates in-place so each element appears only once. Return the new length k. The first k elements of the array should contain the unique elements in sorted order.',
  tags: ['two pointers', 'array', 'in-place', 'sorted'],

  code: {
    pseudocode: `function removeDuplicates(nums):
  if length(nums) == 0: return 0
  slow = 0
  for fast = 1 to length(nums) - 1:
    if nums[fast] != nums[slow]:
      slow = slow + 1
      nums[slow] = nums[fast]
  return slow + 1`,

    python: `def removeDuplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1`,

    javascript: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}`,

    java: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 2, 3, 4, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 3, 4, 4, 5],
      placeholder: '1,1,2,2,3,4,4,5',
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

    steps.push({
      line: 1,
      explanation: `Start with sorted array [${nums.join(', ')}]. We'll use slow and fast pointers to remove duplicates in-place.`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    if (nums.length === 0) {
      steps.push({
        line: 2,
        explanation: 'Array is empty, return 0.',
        variables: { result: 0 },
        visualization: makeViz(nums, {}, {}),
      });
      return steps;
    }

    let slow = 0;
    steps.push({
      line: 3,
      explanation: `Initialize slow pointer at index 0 (value ${nums[slow]}). This marks the boundary of unique elements.`,
      variables: { slow, 'nums[slow]': nums[slow] },
      visualization: makeViz(nums, { [slow]: 'pointer' }, { [slow]: 'slow' }),
    });

    for (let fast = 1; fast < nums.length; fast++) {
      steps.push({
        line: 4,
        explanation: `Fast pointer at index ${fast} (value ${nums[fast]}). Comparing with slow at index ${slow} (value ${nums[slow]}).`,
        variables: { slow, fast, 'nums[slow]': nums[slow], 'nums[fast]': nums[fast] },
        visualization: makeViz(
          nums,
          { [slow]: 'pointer', [fast]: 'active' },
          { [slow]: 'slow', [fast]: 'fast' }
        ),
      });

      if (nums[fast] !== nums[slow]) {
        slow++;
        nums[slow] = nums[fast];
        steps.push({
          line: 6,
          explanation: `nums[${fast}] = ${nums[fast]} is different from nums[${slow - 1}] = ${nums[slow - 1]}. Advance slow to ${slow} and copy value ${nums[fast]}.`,
          variables: { slow, fast, 'nums[slow]': nums[slow], 'nums[fast]': nums[fast] },
          visualization: makeViz(
            nums,
            { [slow]: 'found', [fast]: 'comparing' },
            { [slow]: 'slow', [fast]: 'fast' }
          ),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `nums[${fast}] = ${nums[fast]} equals nums[${slow}] = ${nums[slow]}. Duplicate! Skip fast forward.`,
          variables: { slow, fast, 'nums[slow]': nums[slow], 'nums[fast]': nums[fast] },
          visualization: makeViz(
            nums,
            { [slow]: 'pointer', [fast]: 'mismatch' },
            { [slow]: 'slow', [fast]: 'dup' }
          ),
        });
      }
    }

    const k = slow + 1;
    steps.push({
      line: 8,
      explanation: `Done! Unique elements: [${nums.slice(0, k).join(', ')}]. Return k = ${k}. The first ${k} positions contain unique values.`,
      variables: { k, uniqueElements: nums.slice(0, k) },
      visualization: makeViz(
        nums,
        Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default removeDuplicatesSortedArray;
