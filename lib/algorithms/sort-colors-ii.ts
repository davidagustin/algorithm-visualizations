import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortColorsIi: AlgorithmDefinition = {
  id: 'sort-colors-ii',
  title: 'Sort Colors II',
  leetcodeNumber: 75,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an array with n objects colored with k colors labeled 0 to k-1, sort them in-place so that objects of the same color are adjacent. This is a Dutch national flag variant extended to k colors. Uses a counting sort approach for O(n) time.',
  tags: ['two pointers', 'sorting', 'dutch national flag', 'array'],

  code: {
    pseudocode: `function sortColors(nums, k):
  count = array of k zeros
  for each num in nums:
    count[num]++
  idx = 0
  for color = 0 to k-1:
    for i = 0 to count[color]-1:
      nums[idx++] = color
  return nums`,

    python: `def sortColors(nums: list[int], k: int) -> None:
    count = [0] * k
    for num in nums:
        count[num] += 1
    idx = 0
    for color in range(k):
        for _ in range(count[color]):
            nums[idx] = color
            idx += 1`,

    javascript: `function sortColors(nums, k) {
  const count = new Array(k).fill(0);
  for (const num of nums) count[num]++;
  let idx = 0;
  for (let color = 0; color < k; color++) {
    for (let i = 0; i < count[color]; i++) {
      nums[idx++] = color;
    }
  }
}`,

    java: `public void sortColors(int[] nums, int k) {
    int[] count = new int[k];
    for (int num : nums) count[num]++;
    int idx = 0;
    for (int color = 0; color < k; color++) {
        for (int i = 0; i < count[color]; i++) {
            nums[idx++] = color;
        }
    }
}`,
  },

  defaultInput: {
    nums: [2, 0, 1, 2, 1, 0, 2, 1],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array of Colors',
      type: 'array',
      defaultValue: [2, 0, 1, 2, 1, 0, 2, 1],
      placeholder: '2,0,1,2,1,0,2,1',
      helperText: 'Comma-separated integers representing colors (0 to k-1)',
    },
    {
      name: 'k',
      label: 'Number of Colors',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of distinct colors',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const k = input.k as number;
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
      explanation: `Count occurrences of each color (0 to ${k - 1}) in the array.`,
      variables: { k, nums: [...nums] },
      visualization: makeViz(nums, {}, {}),
    });

    const count = new Array(k).fill(0);
    for (let i = 0; i < nums.length; i++) {
      count[nums[i]]++;
      steps.push({
        line: 3,
        explanation: `Element at index ${i} is color ${nums[i]}. Count[${nums[i]}] is now ${count[nums[i]]}.`,
        variables: { index: i, color: nums[i], count: [...count] },
        visualization: makeViz(nums, { [i]: 'active' }, { [i]: `c${nums[i]}` }),
      });
    }

    steps.push({
      line: 5,
      explanation: `Counted all colors. Now write back colors in order from 0 to ${k - 1}.`,
      variables: { count: [...count] },
      visualization: makeViz(nums, {}, {}),
    });

    const result = [...nums];
    let idx = 0;
    for (let color = 0; color < k; color++) {
      for (let i = 0; i < count[color]; i++) {
        result[idx] = color;
        steps.push({
          line: 7,
          explanation: `Writing color ${color} at index ${idx}. Remaining count for color ${color}: ${count[color] - i - 1}.`,
          variables: { writingColor: color, atIndex: idx, count: [...count] },
          visualization: makeViz(result, { [idx]: 'sorted' }, { [idx]: `${color}` }),
        });
        idx++;
      }
    }

    steps.push({
      line: 8,
      explanation: 'Array is fully sorted by color.',
      variables: { sortedNums: [...result] },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default sortColorsIi;
