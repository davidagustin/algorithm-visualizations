import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wiggleSort: AlgorithmDefinition = {
  id: 'wiggle-sort',
  title: 'Wiggle Sort',
  leetcodeNumber: 280,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Reorder an array in-place so that nums[0] <= nums[1] >= nums[2] <= nums[3]... One-pass approach: for each even index i, if nums[i] > nums[i+1] swap them; for each odd index i, if nums[i] < nums[i+1] swap them.',
  tags: ['two pointers', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function wiggleSort(nums):
  for i = 0 to length(nums)-2:
    if i is even and nums[i] > nums[i+1]:
      swap(nums[i], nums[i+1])
    if i is odd and nums[i] < nums[i+1]:
      swap(nums[i], nums[i+1])`,

    python: `def wiggleSort(nums: list[int]) -> None:
    for i in range(len(nums) - 1):
        if (i % 2 == 0 and nums[i] > nums[i+1]) or \
           (i % 2 == 1 and nums[i] < nums[i+1]):
            nums[i], nums[i+1] = nums[i+1], nums[i]`,

    javascript: `function wiggleSort(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if ((i % 2 === 0 && nums[i] > nums[i+1]) ||
        (i % 2 === 1 && nums[i] < nums[i+1])) {
      [nums[i], nums[i+1]] = [nums[i+1], nums[i]];
    }
  }
}`,

    java: `public void wiggleSort(int[] nums) {
    for (int i = 0; i < nums.length - 1; i++) {
        if ((i % 2 == 0 && nums[i] > nums[i+1]) ||
            (i % 2 == 1 && nums[i] < nums[i+1])) {
            int tmp = nums[i]; nums[i] = nums[i+1]; nums[i+1] = tmp;
        }
    }
}`,
  },

  defaultInput: {
    nums: [3, 5, 2, 1, 6, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 5, 2, 1, 6, 4],
      placeholder: '3,5,2,1,6,4',
      helperText: 'Comma-separated integers to wiggle sort',
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
      explanation: `Start wiggle sort: even indices should have local minima (<= neighbors), odd indices should have local maxima (>= neighbors).`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? 'even' : 'odd']))),
    });

    for (let i = 0; i < nums.length - 1; i++) {
      const isEven = i % 2 === 0;
      const needsSwap = isEven ? nums[i] > nums[i + 1] : nums[i] < nums[i + 1];
      const condition = isEven ? `even index ${i}: need nums[${i}]<=nums[${i + 1}]` : `odd index ${i}: need nums[${i}]>=nums[${i + 1}]`;

      steps.push({
        line: isEven ? 3 : 5,
        explanation: `Check ${condition}. nums[${i}]=${nums[i]}, nums[${i + 1}]=${nums[i + 1]}. ${needsSwap ? 'Swap needed.' : 'Already correct.'}`,
        variables: { i, isEven, 'nums[i]': nums[i], 'nums[i+1]': nums[i + 1], needsSwap },
        visualization: makeViz(nums, { [i]: needsSwap ? 'mismatch' : 'sorted', [i + 1]: needsSwap ? 'mismatch' : 'sorted' }, { [i]: `${i}`, [i + 1]: `${i + 1}` }),
      });

      if (needsSwap) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
        steps.push({
          line: isEven ? 4 : 6,
          explanation: `Swapped. Now nums[${i}]=${nums[i]}, nums[${i + 1}]=${nums[i + 1]}.`,
          variables: { i, 'nums[i]': nums[i], 'nums[i+1]': nums[i + 1] },
          visualization: makeViz(nums, { [i]: 'found', [i + 1]: 'found' }, { [i]: `${i}`, [i + 1]: `${i + 1}` }),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Wiggle sort complete: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'found'])), Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? 'v' : '^']))),
    });

    return steps;
  },
};

export default wiggleSort;
