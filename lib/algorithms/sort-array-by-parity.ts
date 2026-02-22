import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const sortArrayByParity: AlgorithmDefinition = {
  id: 'sort-array-by-parity',
  title: 'Sort Array By Parity',
  leetcodeNumber: 905,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Move all even integers to the beginning and all odd integers to the end of the array. Use two pointers starting from each end: when left points to odd and right points to even, swap them and advance both pointers.',
  tags: ['two pointers', 'array', 'sorting', 'in-place'],

  code: {
    pseudocode: `function sortArrayByParity(nums):
  left = 0; right = length(nums) - 1
  while left < right:
    while left < right and nums[left] % 2 == 0:
      left++
    while left < right and nums[right] % 2 == 1:
      right--
    if left < right:
      swap(nums[left], nums[right])
      left++; right--
  return nums`,

    python: `def sortArrayByParity(nums: list[int]) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        while left < right and nums[left] % 2 == 0:
            left += 1
        while left < right and nums[right] % 2 == 1:
            right -= 1
        if left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    return nums`,

    javascript: `function sortArrayByParity(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    while (left < right && nums[left] % 2 === 0) left++;
    while (left < right && nums[right] % 2 === 1) right--;
    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++; right--;
    }
  }
  return nums;
}`,

    java: `public int[] sortArrayByParity(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        while (left < right && nums[left] % 2 == 0) left++;
        while (left < right && nums[right] % 2 == 1) right--;
        if (left < right) {
            int tmp = nums[left]; nums[left] = nums[right]; nums[right] = tmp;
            left++; right--;
        }
    }
    return nums;
}`,
  },

  defaultInput: {
    nums: [3, 1, 2, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 2, 4],
      placeholder: '3,1,2,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    let left = 0;
    let right = nums.length - 1;

    steps.push({
      line: 1,
      explanation: `Initialize left=${left}, right=${right}. Move evens to front, odds to back using two pointers.`,
      variables: { left, right },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { [left]: 'pointer', [right]: 'pointer' },
        labels: { [left]: 'L', [right]: 'R' },
      },
    });

    while (left < right) {
      while (left < right && nums[left] % 2 === 0) {
        steps.push({
          line: 4,
          explanation: `nums[${left}]=${nums[left]} is even. Advance left pointer.`,
          variables: { left, right },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'sorted', [right]: 'pointer' },
            labels: { [left]: 'even', [right]: 'R' },
          },
        });
        left++;
      }

      while (left < right && nums[right] % 2 === 1) {
        steps.push({
          line: 6,
          explanation: `nums[${right}]=${nums[right]} is odd. Move right pointer left.`,
          variables: { left, right },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'pointer', [right]: 'sorted' },
            labels: { [left]: 'L', [right]: 'odd' },
          },
        });
        right--;
      }

      if (left < right) {
        steps.push({
          line: 8,
          explanation: `Swap nums[${left}]=${nums[left]} (odd) with nums[${right}]=${nums[right]} (even).`,
          variables: { left, right, swapping: `${nums[left]} <-> ${nums[right]}` },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'swapping', [right]: 'swapping' },
            labels: { [left]: 'odd', [right]: 'even' },
          },
        });

        [nums[left], nums[right]] = [nums[right], nums[left]];
        left++;
        right--;

        steps.push({
          line: 9,
          explanation: `After swap. Advance left and retreat right. left=${left}, right=${right}.`,
          variables: { left, right },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'pointer', [right]: 'pointer' },
            labels: { [left]: 'L', [right]: 'R' },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Sorted by parity: ${JSON.stringify(nums)}. All evens precede all odds.`,
      variables: { result: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((v, i) => [i, v % 2 === 0 ? 'found' : 'comparing'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default sortArrayByParity;
