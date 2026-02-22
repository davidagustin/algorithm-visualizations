import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeElementInPlace: AlgorithmDefinition = {
  id: 'remove-element-in-place',
  title: 'Remove Element',
  leetcodeNumber: 27,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an integer array nums and an integer val, remove all occurrences of val in-place. Return the number of elements not equal to val. The relative order of elements may be changed.',
  tags: ['two pointers', 'array', 'in-place'],

  code: {
    pseudocode: `function removeElement(nums, val):
  slow = 0
  for fast = 0 to length(nums) - 1:
    if nums[fast] != val:
      nums[slow] = nums[fast]
      slow = slow + 1
  return slow`,

    python: `def removeElement(nums: list[int], val: int) -> int:
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != val:
            nums[slow] = nums[fast]
            slow += 1
    return slow`,

    javascript: `function removeElement(nums, val) {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}`,

    java: `public int removeElement(int[] nums, int val) {
    int slow = 0;
    for (int fast = 0; fast < nums.length; fast++) {
        if (nums[fast] != val) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    return slow;
}`,
  },

  defaultInput: {
    nums: [3, 2, 2, 3, 4, 3, 5],
    val: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 2, 3, 4, 3, 5],
      placeholder: '3,2,2,3,4,3,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'val',
      label: 'Value to Remove',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Integer value to remove from array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const val = input.val as number;
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
      explanation: `Remove all occurrences of val = ${val} from [${nums.join(', ')}]. Slow pointer tracks where to write next valid element.`,
      variables: { nums: [...nums], val },
      visualization: makeViz(nums, {}, {}),
    });

    let slow = 0;
    steps.push({
      line: 2,
      explanation: `Initialize slow = 0. Slow pointer marks the write position for non-val elements.`,
      variables: { slow, val },
      visualization: makeViz(nums, { [slow]: 'pointer' }, { [slow]: 'slow' }),
    });

    for (let fast = 0; fast < nums.length; fast++) {
      steps.push({
        line: 3,
        explanation: `Fast = ${fast}, checking nums[${fast}] = ${nums[fast]}. Is it equal to val = ${val}?`,
        variables: { slow, fast, 'nums[fast]': nums[fast], val },
        visualization: makeViz(
          nums,
          { [slow]: 'pointer', [fast]: 'active' },
          { [slow]: 'slow', [fast]: 'fast' }
        ),
      });

      if (nums[fast] !== val) {
        nums[slow] = nums[fast];
        steps.push({
          line: 5,
          explanation: `nums[${fast}] = ${nums[fast]} != ${val}. Copy to position ${slow}, then advance slow to ${slow + 1}.`,
          variables: { slow, fast, 'nums[slow]': nums[slow], 'nums[fast]': nums[fast] },
          visualization: makeViz(
            nums,
            { [slow]: 'found', [fast]: 'comparing' },
            { [slow]: 'write', [fast]: 'fast' }
          ),
        });
        slow++;
      } else {
        steps.push({
          line: 4,
          explanation: `nums[${fast}] = ${nums[fast]} equals val = ${val}. Skip this element, don't advance slow.`,
          variables: { slow, fast, 'nums[fast]': nums[fast], val },
          visualization: makeViz(
            nums,
            { [slow]: 'pointer', [fast]: 'mismatch' },
            { [slow]: 'slow', [fast]: 'skip' }
          ),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Done! ${slow} elements remain (not equal to ${val}): [${nums.slice(0, slow).join(', ')}].`,
      variables: { result: slow, remaining: nums.slice(0, slow) },
      visualization: makeViz(
        nums,
        Object.fromEntries(Array.from({ length: slow }, (_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default removeElementInPlace;
