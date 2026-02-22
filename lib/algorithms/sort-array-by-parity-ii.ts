import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortArrayByParityIi: AlgorithmDefinition = {
  id: 'sort-array-by-parity-ii',
  title: 'Sort Array By Parity II',
  leetcodeNumber: 922,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an array with half even and half odd integers, rearrange so that every even-indexed position contains an even number and every odd-indexed position contains an odd number. Use two pointers: one scanning even indices, another scanning odd indices.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function sortArrayByParityII(nums):
  j = 1  // odd index pointer
  for i = 0 to n-1 step 2:  // even index pointer
    if nums[i] is odd:
      while nums[j] is odd: j += 2
      swap(nums[i], nums[j])
  return nums`,

    python: `def sortArrayByParityII(nums: list[int]) -> list[int]:
    j = 1
    for i in range(0, len(nums), 2):
        if nums[i] % 2 == 1:
            while nums[j] % 2 == 1:
                j += 2
            nums[i], nums[j] = nums[j], nums[i]
    return nums`,

    javascript: `function sortArrayByParityII(nums) {
  let j = 1;
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] % 2 === 1) {
      while (nums[j] % 2 === 1) j += 2;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  return nums;
}`,

    java: `public int[] sortArrayByParityII(int[] nums) {
    int j = 1;
    for (int i = 0; i < nums.length; i += 2) {
        if (nums[i] % 2 == 1) {
            while (nums[j] % 2 == 1) j += 2;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }
    }
    return nums;
}`,
  },

  defaultInput: {
    nums: [4, 2, 5, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 5, 7],
      placeholder: '4,2,5,7',
      helperText: 'Comma-separated integers with equal count of even and odd numbers',
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
      explanation: `Start: j=1 (odd index pointer). Scan even indices for misplaced odd values.`,
      variables: { j: 1 },
      visualization: makeViz(nums, {}, Object.fromEntries(nums.map((_, i) => [i, i % 2 === 0 ? 'even' : 'odd']))),
    });

    let j = 1;
    for (let i = 0; i < nums.length; i += 2) {
      if (nums[i] % 2 === 1) {
        steps.push({
          line: 3,
          explanation: `Even index ${i} has odd value ${nums[i]}. Find an odd index with an even value to swap.`,
          variables: { i, j, 'nums[i]': nums[i] },
          visualization: makeViz(nums, { [i]: 'mismatch', [j]: 'pointer' }, { [i]: 'odd!', [j]: 'j' }),
        });

        while (nums[j] % 2 === 1) {
          steps.push({
            line: 4,
            explanation: `Odd index j=${j} has odd value ${nums[j]}, skip.`,
            variables: { j, 'nums[j]': nums[j] },
            visualization: makeViz(nums, { [i]: 'mismatch', [j]: 'comparing' }, { [i]: 'i', [j]: 'skip' }),
          });
          j += 2;
        }

        steps.push({
          line: 5,
          explanation: `Odd index j=${j} has even value ${nums[j]}. Swap nums[${i}]=${nums[i]} with nums[${j}]=${nums[j]}.`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j] },
          visualization: makeViz(nums, { [i]: 'swapping', [j]: 'swapping' }, { [i]: 'swap', [j]: 'swap' }),
        });

        [nums[i], nums[j]] = [nums[j], nums[i]];

        steps.push({
          line: 5,
          explanation: `After swap: nums[${i}]=${nums[i]} (even at even index), nums[${j}]=${nums[j]} (odd at odd index).`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j] },
          visualization: makeViz(nums, { [i]: 'found', [j]: 'found' }, { [i]: 'E', [j]: 'O' }),
        });
      } else {
        steps.push({
          line: 2,
          explanation: `Even index ${i} has even value ${nums[i]}. No swap needed.`,
          variables: { i, 'nums[i]': nums[i] },
          visualization: makeViz(nums, { [i]: 'sorted' }, { [i]: 'ok' }),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Array sorted by parity: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        nums,
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        Object.fromEntries(nums.map((v, i) => [i, v % 2 === 0 ? 'E' : 'O']))
      ),
    });

    return steps;
  },
};

export default sortArrayByParityIi;
