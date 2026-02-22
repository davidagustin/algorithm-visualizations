import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSumOfDistinctSubarrays: AlgorithmDefinition = {
  id: 'maximum-sum-of-distinct-subarrays',
  title: 'Maximum Sum of Distinct Subarrays With Length K',
  leetcodeNumber: 2461,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and an integer k, find the maximum subarray sum of all subarrays of nums that meet these conditions: the subarray has length k and all elements are distinct. Return 0 if no such subarray exists. Use a fixed sliding window with a frequency map.',
  tags: ['sliding window', 'hash map', 'array'],

  code: {
    pseudocode: `function maximumSubarraySum(nums, k):
  freq = {}
  windowSum = 0
  result = 0
  for i in range(len(nums)):
    freq[nums[i]] = freq.get(nums[i], 0) + 1
    windowSum += nums[i]
    if i >= k:
      out = nums[i-k]
      windowSum -= out
      freq[out] -= 1
      if freq[out] == 0: del freq[out]
    if i >= k-1 and len(freq) == k:
      result = max(result, windowSum)
  return result`,

    python: `def maximumSubarraySum(nums: list[int], k: int) -> int:
    from collections import defaultdict
    freq = defaultdict(int)
    window_sum = 0
    result = 0
    for i, n in enumerate(nums):
        freq[n] += 1
        window_sum += n
        if i >= k:
            out = nums[i - k]
            window_sum -= out
            freq[out] -= 1
            if freq[out] == 0:
                del freq[out]
        if i >= k - 1 and len(freq) == k:
            result = max(result, window_sum)
    return result`,

    javascript: `function maximumSubarraySum(nums, k) {
  const freq = new Map();
  let windowSum = 0, result = 0;
  for (let i = 0; i < nums.length; i++) {
    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    windowSum += nums[i];
    if (i >= k) {
      const out = nums[i - k];
      windowSum -= out;
      freq.set(out, freq.get(out) - 1);
      if (freq.get(out) === 0) freq.delete(out);
    }
    if (i >= k - 1 && freq.size === k) result = Math.max(result, windowSum);
  }
  return result;
}`,

    java: `public long maximumSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    long windowSum = 0, result = 0;
    for (int i = 0; i < nums.length; i++) {
        freq.merge(nums[i], 1, Integer::sum);
        windowSum += nums[i];
        if (i >= k) {
            int out = nums[i - k];
            windowSum -= out;
            freq.merge(out, -1, Integer::sum);
            if (freq.get(out) == 0) freq.remove(out);
        }
        if (i >= k - 1 && freq.size() == k) result = Math.max(result, windowSum);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 5, 4, 2, 9, 9, 9],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 5, 4, 2, 9, 9, 9],
      placeholder: '1,5,4,2,9,9,9',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Fixed subarray size',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find max sum subarray of length ${k} with all distinct elements. Slide fixed window of size ${k}, track distinct count.`,
      variables: { k, result: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const freq = new Map<number, number>();
    let windowSum = 0;
    let result = 0;

    for (let i = 0; i < n; i++) {
      freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
      windowSum += nums[i];

      if (i >= k) {
        const out = nums[i - k];
        windowSum -= out;
        freq.set(out, freq.get(out)! - 1);
        if (freq.get(out) === 0) freq.delete(out);
      }

      if (i >= k - 1) {
        const allDistinct = freq.size === k;
        if (allDistinct && windowSum > result) result = windowSum;
        const winStart = i - k + 1;

        steps.push({
          line: 13,
          explanation: `Window [${winStart}..${i}] = [${nums.slice(winStart, i + 1).join(',')}]: sum=${windowSum}, distinct=${freq.size}/${k}. ${allDistinct ? `All distinct! Best = ${result}.` : `Duplicates present. Skip.`}`,
          variables: { windowStart: winStart, windowEnd: i, windowSum, distinct: freq.size, allDistinct, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(Array.from({ length: k }, (_, idx) => [winStart + idx, allDistinct ? 'found' : 'mismatch'])),
            labels: { [winStart]: 'L', [i]: 'R' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 15,
      explanation: `Maximum sum of distinct subarray of length ${k} = ${result}.`,
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

export default maximumSumOfDistinctSubarrays;
