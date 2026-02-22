import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countCompleteSubarrays: AlgorithmDefinition = {
  id: 'count-complete-subarrays',
  title: 'Count Complete Subarrays in an Array',
  leetcodeNumber: 2799,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array nums, a subarray is complete if the number of distinct elements in the subarray equals the number of distinct elements in the whole array. Return the number of complete subarrays. Use sliding window to find the smallest window with all distinct elements, then count subarrays.',
  tags: ['sliding window', 'hash map', 'array'],

  code: {
    pseudocode: `function countCompleteSubarrays(nums):
  total = len(set(nums))
  count = {}
  result = 0
  left = 0
  for right in range(len(nums)):
    count[nums[right]] = count.get(nums[right], 0) + 1
    while len(count) == total:
      result += len(nums) - right
      count[nums[left]] -= 1
      if count[nums[left]] == 0:
        del count[nums[left]]
      left++
  return result`,

    python: `def countCompleteSubarrays(nums: list[int]) -> int:
    total = len(set(nums))
    count = {}
    result = 0
    left = 0
    for right in range(len(nums)):
        count[nums[right]] = count.get(nums[right], 0) + 1
        while len(count) == total:
            result += len(nums) - right
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                del count[nums[left]]
            left += 1
    return result`,

    javascript: `function countCompleteSubarrays(nums) {
  const total = new Set(nums).size;
  const count = new Map();
  let result = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    count.set(nums[right], (count.get(nums[right]) || 0) + 1);
    while (count.size === total) {
      result += nums.length - right;
      count.set(nums[left], count.get(nums[left]) - 1);
      if (count.get(nums[left]) === 0) count.delete(nums[left]);
      left++;
    }
  }
  return result;
}`,

    java: `public int countCompleteSubarrays(int[] nums) {
    int total = (int) Arrays.stream(nums).distinct().count();
    Map<Integer, Integer> count = new HashMap<>();
    int result = 0, left = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() == total) {
            result += nums.length - right;
            count.merge(nums[left], -1, Integer::sum);
            if (count.get(nums[left]) == 0) count.remove(nums[left]);
            left++;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, 1, 2, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 1, 2, 2],
      placeholder: '1,3,1,2,2',
      helperText: 'Comma-separated positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = new Set(nums).size;

    steps.push({
      line: 1,
      explanation: `Array has ${total} distinct elements: {${[...new Set(nums)].join(', ')}}. We need subarrays with all ${total} distinct values.`,
      variables: { total, distinctElements: [...new Set(nums)].join(',') },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const count = new Map<number, number>();
    let result = 0;
    let left = 0;

    for (let right = 0; right < n; right++) {
      count.set(nums[right], (count.get(nums[right]) || 0) + 1);

      steps.push({
        line: 6,
        explanation: `Expand right to index ${right} (value ${nums[right]}). Window [${left}..${right}] has ${count.size} distinct values.`,
        variables: { left, right, distinctInWindow: count.size, total },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'active'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });

      while (count.size === total) {
        const added = n - right;
        result += added;

        steps.push({
          line: 8,
          explanation: `Window [${left}..${right}] has all ${total} distinct values! All ${added} subarrays starting at left=${left} and ending at ${right}..${n - 1} are complete. Total now ${result}.`,
          variables: { left, right, addedSubarrays: added, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'found'])) },
            labels: { [left]: 'L', [right]: 'R' },
          } as ArrayVisualization,
        });

        count.set(nums[left], count.get(nums[left])! - 1);
        if (count.get(nums[left]) === 0) count.delete(nums[left]);
        left++;
      }
    }

    steps.push({
      line: 13,
      explanation: `Done. Total complete subarrays = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default countCompleteSubarrays;
