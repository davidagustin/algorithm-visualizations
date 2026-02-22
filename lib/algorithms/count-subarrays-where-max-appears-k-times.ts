import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubarraysWhereMaxAppearsKTimes: AlgorithmDefinition = {
  id: 'count-subarrays-where-max-appears-k-times',
  title: 'Count Subarrays Where Max Element Appears at Least K Times',
  leetcodeNumber: 2962,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and a positive integer k, return the number of subarrays where the maximum element of nums appears at least k times in that subarray. Use a sliding window tracking occurrences of the global maximum.',
  tags: ['sliding window', 'array'],

  code: {
    pseudocode: `function countSubarrays(nums, k):
  maxVal = max(nums)
  result = 0
  count = 0
  left = 0
  for right in range(len(nums)):
    if nums[right] == maxVal:
      count++
    while count >= k:
      result += len(nums) - right
      if nums[left] == maxVal:
        count--
      left++
  return result`,

    python: `def countSubarrays(nums: list[int], k: int) -> int:
    maxVal = max(nums)
    result = 0
    count = 0
    left = 0
    for right in range(len(nums)):
        if nums[right] == maxVal:
            count += 1
        while count >= k:
            result += len(nums) - right
            if nums[left] == maxVal:
                count -= 1
            left += 1
    return result`,

    javascript: `function countSubarrays(nums, k) {
  const maxVal = Math.max(...nums);
  let result = 0, count = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === maxVal) count++;
    while (count >= k) {
      result += nums.length - right;
      if (nums[left] === maxVal) count--;
      left++;
    }
  }
  return result;
}`,

    java: `public long countSubarrays(int[] nums, int k) {
    int maxVal = Arrays.stream(nums).max().getAsInt();
    long result = 0;
    int count = 0, left = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == maxVal) count++;
        while (count >= k) {
            result += nums.length - right;
            if (nums[left] == maxVal) count--;
            left++;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, 2, 3, 3],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 2, 3, 3],
      placeholder: '1,3,2,3,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Min Occurrences k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Max element must appear at least k times',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const maxVal = Math.max(...nums);

    steps.push({
      line: 1,
      explanation: `Global maximum = ${maxVal}. Count subarrays where ${maxVal} appears at least ${k} times. Use shrinkable sliding window.`,
      variables: { maxVal, k, result: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((v, i) => [i, v === maxVal ? 'found' : 'default'])),
        labels: Object.fromEntries(nums.map((v, i) => [i, v === maxVal ? 'MAX' : ''])),
      } as ArrayVisualization,
    });

    let result = 0;
    let count = 0;
    let left = 0;

    for (let right = 0; right < n; right++) {
      if (nums[right] === maxVal) count++;

      steps.push({
        line: 6,
        explanation: `Expand right to ${right} (value ${nums[right]}). ${nums[right] === maxVal ? `Max found! Count = ${count}.` : `Not max. Count stays ${count}.`}`,
        variables: { right, value: nums[right], count, left },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {
            ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'active'])),
            [right]: nums[right] === maxVal ? 'found' : 'active',
          },
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });

      while (count >= k) {
        const added = n - right;
        result += added;

        steps.push({
          line: 9,
          explanation: `Window [${left}..${right}] has ${count} >= ${k} occurrences of ${maxVal}. All ${added} extensions ending at right..n-1 are valid. result += ${added} = ${result}.`,
          variables: { left, right, count, addedSubarrays: added, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'found'])),
            labels: { [left]: 'L--', [right]: 'R' },
          } as ArrayVisualization,
        });

        if (nums[left] === maxVal) count--;
        left++;
      }
    }

    steps.push({
      line: 13,
      explanation: `Total subarrays where max appears >= ${k} times = ${result}.`,
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

export default countSubarraysWhereMaxAppearsKTimes;
