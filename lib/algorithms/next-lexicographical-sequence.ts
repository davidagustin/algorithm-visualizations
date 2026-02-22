import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextLexicographicalSequence: AlgorithmDefinition = {
  id: 'next-lexicographical-sequence',
  title: 'Next Permutation',
  leetcodeNumber: 31,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Rearrange numbers into the lexicographically next greater permutation. Find the rightmost ascending pair, swap with the next larger element from the right, then reverse the suffix.',
  tags: ['two pointers', 'array', 'permutation'],

  code: {
    pseudocode: `function nextPermutation(nums):
  i = length(nums) - 2
  while i >= 0 and nums[i] >= nums[i+1]:
    i--
  if i >= 0:
    j = length(nums) - 1
    while nums[j] <= nums[i]:
      j--
    swap(nums[i], nums[j])
  reverse nums from i+1 to end`,

    python: `def nextPermutation(nums: list[int]) -> None:
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    left, right = i + 1, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1`,

    javascript: `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let left = i + 1, right = nums.length - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}`,

    java: `public void nextPermutation(int[] nums) {
    int i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        int j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    int left = i + 1, right = nums.length - 1;
    while (left < right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        left++;
        right--;
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
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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

    // Step: Start
    steps.push({
      line: 1,
      explanation: `Find the next lexicographical permutation of [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    // Step 1: Find rightmost ascending pair
    let i = n - 2;

    steps.push({
      line: 2,
      explanation: `Start scanning from right. i = ${i}. Find the first index where nums[i] < nums[i+1].`,
      variables: { i },
      visualization: makeViz(nums, { [i]: 'active', [i + 1]: 'comparing' }, { [i]: 'i' }),
    });

    while (i >= 0 && nums[i] >= nums[i + 1]) {
      steps.push({
        line: 3,
        explanation: `nums[${i}] = ${nums[i]} >= nums[${i + 1}] = ${nums[i + 1]}. Descending, move left.`,
        variables: { i, 'nums[i]': nums[i], 'nums[i+1]': nums[i + 1] },
        visualization: makeViz(
          nums,
          { [i]: 'visited', [i + 1]: 'visited' },
          { [i]: 'i' }
        ),
      });
      i--;
    }

    if (i >= 0) {
      steps.push({
        line: 4,
        explanation: `Found ascending pair: nums[${i}] = ${nums[i]} < nums[${i + 1}] = ${nums[i + 1]}. This is our pivot.`,
        variables: { i, 'nums[i]': nums[i] },
        visualization: makeViz(
          nums,
          { [i]: 'found' },
          { [i]: 'pivot' }
        ),
      });

      // Step 2: Find rightmost element larger than nums[i]
      let j = n - 1;
      while (nums[j] <= nums[i]) {
        j--;
      }

      steps.push({
        line: 7,
        explanation: `Find rightmost element > nums[${i}] = ${nums[i]}. Found nums[${j}] = ${nums[j]}.`,
        variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j] },
        visualization: makeViz(
          nums,
          { [i]: 'found', [j]: 'comparing' },
          { [i]: 'pivot', [j]: 'swap' }
        ),
      });

      // Step 3: Swap
      const temp = nums[i];
      nums[i] = nums[j];
      nums[j] = temp;

      steps.push({
        line: 8,
        explanation: `Swap nums[${i}] and nums[${j}]: [${nums.join(', ')}].`,
        variables: { i, j, nums: [...nums] },
        visualization: makeViz(
          nums,
          { [i]: 'swapping', [j]: 'swapping' },
          { [i]: 'swapped', [j]: 'swapped' }
        ),
      });
    } else {
      steps.push({
        line: 4,
        explanation: `No ascending pair found. Array is in descending order (last permutation). Will reverse entire array.`,
        variables: { i },
        visualization: makeViz(
          nums,
          Object.fromEntries(nums.map((_, k) => [k, 'visited'])),
          {}
        ),
      });
    }

    // Step 4: Reverse suffix from i+1 to end
    let left = i + 1;
    let right = n - 1;

    steps.push({
      line: 9,
      explanation: `Reverse the suffix from index ${left} to ${right} to get the smallest next permutation.`,
      variables: { left, right, nums: [...nums] },
      visualization: makeViz(
        nums,
        Object.fromEntries(
          Array.from({ length: right - left + 1 }, (_, k) => [left + k, 'active'])
        ),
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      const t = nums[left];
      nums[left] = nums[right];
      nums[right] = t;
      left++;
      right--;
    }

    // Final result
    steps.push({
      line: 9,
      explanation: `Done! Next permutation: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        nums,
        Object.fromEntries(nums.map((_, k) => [k, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default nextLexicographicalSequence;
