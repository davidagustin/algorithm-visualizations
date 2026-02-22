import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lengthOfLongestSubarrayWithAtMostKFrequency: AlgorithmDefinition = {
  id: 'length-of-longest-subarray-with-at-most-k-frequency',
  title: 'Length of Longest Subarray With at Most K Frequency',
  leetcodeNumber: 2958,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and an integer k, return the length of the longest subarray of nums where the frequency of each element is at most k. Use a sliding window with a frequency map, shrinking from the left when any element exceeds frequency k.',
  tags: ['sliding window', 'hash map', 'array'],

  code: {
    pseudocode: `function maxSubarrayLength(nums, k):
  freq = {}
  left = 0
  result = 0
  for right in range(len(nums)):
    freq[nums[right]] = freq.get(nums[right], 0) + 1
    while freq[nums[right]] > k:
      freq[nums[left]] -= 1
      left++
    result = max(result, right - left + 1)
  return result`,

    python: `def maxSubarrayLength(nums: list[int], k: int) -> int:
    from collections import defaultdict
    freq = defaultdict(int)
    left = 0
    result = 0
    for right, n in enumerate(nums):
        freq[n] += 1
        while freq[n] > k:
            freq[nums[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function maxSubarrayLength(nums, k) {
  const freq = new Map();
  let left = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);
    while (freq.get(nums[right]) > k) {
      freq.set(nums[left], freq.get(nums[left]) - 1);
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int maxSubarrayLength(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        freq.merge(nums[right], 1, Integer::sum);
        while (freq.get(nums[right]) > k) {
            freq.merge(nums[left], -1, Integer::sum);
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 1, 2, 3, 1, 2],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1, 2, 3, 1, 2],
      placeholder: '1,2,3,1,2,3,1,2',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Max Frequency k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Each element can appear at most k times',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find longest subarray where each element appears at most ${k} times. Expand right, shrink left when any element exceeds frequency ${k}.`,
      variables: { k, result: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const freq = new Map<number, number>();
    let left = 0;
    let result = 0;

    for (let right = 0; right < n; right++) {
      freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);

      steps.push({
        line: 5,
        explanation: `Expand right to ${right} (value ${nums[right]}). Frequency of ${nums[right]} = ${freq.get(nums[right])}.`,
        variables: { right, value: nums[right], frequency: freq.get(nums[right]), k },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {
            ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'active'])),
            [right]: freq.get(nums[right])! > k ? 'mismatch' : 'found',
          },
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });

      while (freq.get(nums[right])! > k) {
        steps.push({
          line: 7,
          explanation: `Frequency of ${nums[right]} = ${freq.get(nums[right])} > ${k}. Remove nums[${left}]=${nums[left]} from window.`,
          variables: { left, right, violatingValue: nums[right], count: freq.get(nums[right]) },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'mismatch', [right]: 'active' },
            labels: { [left]: 'L++', [right]: `${nums[right]}(${freq.get(nums[right])})` },
          } as ArrayVisualization,
        });
        freq.set(nums[left], freq.get(nums[left])! - 1);
        left++;
      }

      const winSize = right - left + 1;
      if (winSize > result) result = winSize;

      steps.push({
        line: 9,
        explanation: `Window [${left}..${right}]: all elements have frequency <= ${k}. Size = ${winSize}. Best = ${result}.`,
        variables: { left, right, windowSize: winSize, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: winSize }, (_, i) => [left + i, 'found'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 10,
      explanation: `Longest subarray with each element frequency <= ${k} has length ${result}.`,
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

export default lengthOfLongestSubarrayWithAtMostKFrequency;
