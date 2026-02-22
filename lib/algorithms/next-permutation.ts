import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextPermutation: AlgorithmDefinition = {
  id: 'next-permutation',
  title: 'Next Permutation',
  leetcodeNumber: 31,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Rearrange nums into the next lexicographically greater permutation in-place. Step 1: Find the rightmost element smaller than its right neighbor (pivot). Step 2: Swap pivot with the rightmost element larger than it. Step 3: Reverse the suffix after the pivot position.',
  tags: ['two pointers', 'array', 'permutation'],

  code: {
    pseudocode: `function nextPermutation(nums):
  n = length(nums)
  i = n - 2
  while i >= 0 and nums[i] >= nums[i+1]: i--
  if i >= 0:
    j = n - 1
    while nums[j] <= nums[i]: j--
    swap(nums[i], nums[j])
  reverse(nums, i+1, n-1)`,

    python: `def nextPermutation(nums: list[int]) -> None:
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i+1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1; right -= 1`,

    javascript: `function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i+1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let left = i + 1, right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++; right--;
  }
}`,

    java: `public void nextPermutation(int[] nums) {
    int n = nums.length, i = n - 2;
    while (i >= 0 && nums[i] >= nums[i+1]) i--;
    if (i >= 0) {
        int j = n - 1;
        while (nums[j] <= nums[i]) j--;
        int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
    }
    int left = i + 1, right = n - 1;
    while (left < right) {
        int tmp = nums[left]; nums[left] = nums[right]; nums[right] = tmp;
        left++; right--;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Comma-separated integers representing a permutation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const n = nums.length;
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
      explanation: `Find the next permutation of [${nums.join(', ')}]. Step 1: find rightmost pivot where nums[i] < nums[i+1].`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    let i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
      steps.push({
        line: 3,
        explanation: `nums[${i}]=${nums[i]} >= nums[${i + 1}]=${nums[i + 1]}. Decreasing, move left.`,
        variables: { i, 'nums[i]': nums[i], 'nums[i+1]': nums[i + 1] },
        visualization: makeViz(nums, { [i]: 'comparing', [i + 1]: 'comparing' }, { [i]: 'i' }),
      });
      i--;
    }

    if (i >= 0) {
      steps.push({
        line: 4,
        explanation: `Pivot found at index ${i}: nums[${i}]=${nums[i]} < nums[${i + 1}]=${nums[i + 1]}.`,
        variables: { i, pivot: nums[i] },
        visualization: makeViz(nums, { [i]: 'active', [i + 1]: 'found' }, { [i]: 'pivot' }),
      });

      let j = n - 1;
      while (nums[j] <= nums[i]) {
        steps.push({
          line: 6,
          explanation: `nums[${j}]=${nums[j]} <= pivot=${nums[i]}. Move j left.`,
          variables: { j, 'nums[j]': nums[j] },
          visualization: makeViz(nums, { [i]: 'active', [j]: 'comparing' }, { [i]: 'pivot', [j]: 'j' }),
        });
        j--;
      }

      steps.push({
        line: 7,
        explanation: `Swap pivot nums[${i}]=${nums[i]} with nums[${j}]=${nums[j]}.`,
        variables: { i, j, before: [nums[i], nums[j]] },
        visualization: makeViz(nums, { [i]: 'swapping', [j]: 'swapping' }, { [i]: 'pivot', [j]: 'j' }),
      });

      [nums[i], nums[j]] = [nums[j], nums[i]];

      steps.push({
        line: 7,
        explanation: `After swap: [${nums.join(', ')}].`,
        variables: { nums: [...nums] },
        visualization: makeViz(nums, { [i]: 'found', [j]: 'found' }, { [i]: 'was-j', [j]: 'was-pivot' }),
      });
    } else {
      steps.push({
        line: 4,
        explanation: `No pivot found. Array is in descending order. Next permutation is the smallest (reverse entire array).`,
        variables: { i },
        visualization: makeViz(nums, Object.fromEntries(nums.map((_, k) => [k, 'mismatch'])), {}),
      });
    }

    let left = i + 1;
    let right = n - 1;

    steps.push({
      line: 8,
      explanation: `Reverse suffix from index ${left} to ${right} to get the smallest possible tail.`,
      variables: { left, right },
      visualization: makeViz(nums, Object.fromEntries(Array.from({ length: right - left + 1 }, (_, k) => [k + left, 'active'])), { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      steps.push({
        line: 8,
        explanation: `Swap nums[${left}]=${nums[left]} and nums[${right}]=${nums[right]}.`,
        variables: { left, right },
        visualization: makeViz(nums, { [left]: 'swapping', [right]: 'swapping' }, { [left]: 'L', [right]: 'R' }),
      });
      left++;
      right--;
    }

    steps.push({
      line: 9,
      explanation: `Next permutation: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, k) => [k, 'found'])), {}),
    });

    return steps;
  },
};

export default nextPermutation;
