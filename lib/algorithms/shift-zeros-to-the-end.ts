import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shiftZerosToTheEnd: AlgorithmDefinition = {
  id: 'shift-zeros-to-the-end',
  title: 'Move Zeroes',
  leetcodeNumber: 283,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an integer array nums, move all 0s to the end while maintaining the relative order of the non-zero elements. Uses two pointers: one scans through the array, the other tracks the position for the next non-zero element.',
  tags: ['two pointers', 'array', 'in-place'],

  code: {
    pseudocode: `function moveZeroes(nums):
  insertPos = 0
  for i = 0 to length(nums) - 1:
    if nums[i] != 0:
      swap(nums[insertPos], nums[i])
      insertPos++
  return nums`,

    python: `def moveZeroes(nums: list[int]) -> None:
    insert_pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1`,

    javascript: `function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
      insertPos++;
    }
  }
}`,

    java: `public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            int temp = nums[insertPos];
            nums[insertPos] = nums[i];
            nums[i] = temp;
            insertPos++;
        }
    }
}`,
  },

  defaultInput: {
    nums: [0, 1, 0, 3, 12],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 1, 0, 3, 12],
      placeholder: '0,1,0,3,12',
      helperText: 'Comma-separated integers',
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

    let insertPos = 0;

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize insertPos = 0. This marks where the next non-zero element should go.`,
      variables: { insertPos, nums: [...nums] },
      visualization: makeViz(nums, { [0]: 'pointer' }, { [0]: 'ins' }),
    });

    for (let i = 0; i < nums.length; i++) {
      // Step: Check current element
      const checkHighlights: Record<number, string> = {};
      for (let k = 0; k < insertPos; k++) checkHighlights[k] = 'sorted';
      checkHighlights[insertPos] = 'pointer';
      checkHighlights[i] = 'active';

      steps.push({
        line: 3,
        explanation: `i = ${i}, nums[${i}] = ${nums[i]}. ${nums[i] !== 0 ? 'Non-zero, will swap with insertPos.' : 'Zero, skip it.'}`,
        variables: { i, 'nums[i]': nums[i], insertPos },
        visualization: makeViz(
          nums,
          checkHighlights,
          { [insertPos]: 'ins', [i]: 'i' }
        ),
      });

      if (nums[i] !== 0) {
        // Swap
        if (insertPos !== i) {
          steps.push({
            line: 5,
            explanation: `Swap nums[${insertPos}] = ${nums[insertPos]} with nums[${i}] = ${nums[i]}.`,
            variables: { insertPos, i, before: [...nums] },
            visualization: makeViz(
              nums,
              { [insertPos]: 'swapping', [i]: 'swapping' },
              { [insertPos]: 'ins', [i]: 'i' }
            ),
          });
        }

        const temp = nums[insertPos];
        nums[insertPos] = nums[i];
        nums[i] = temp;

        const afterHighlights: Record<number, string> = {};
        for (let k = 0; k <= insertPos; k++) afterHighlights[k] = 'sorted';

        steps.push({
          line: 6,
          explanation: `After swap: [${nums.join(', ')}]. Increment insertPos to ${insertPos + 1}.`,
          variables: { insertPos: insertPos + 1, nums: [...nums] },
          visualization: makeViz(
            nums,
            afterHighlights,
            { [insertPos]: 'done', [insertPos + 1]: 'ins' }
          ),
        });

        insertPos++;
      }
    }

    // Final result
    steps.push({
      line: 7,
      explanation: `Done! All zeros moved to the end: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        nums,
        Object.fromEntries(nums.map((v, i) => [i, v !== 0 ? 'found' : 'visited'])),
        {}
      ),
    });

    return steps;
  },
};

export default shiftZerosToTheEnd;
