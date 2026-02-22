import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxSumOfAlmostUniqueSubarray: AlgorithmDefinition = {
  id: 'max-sum-of-almost-unique-subarray',
  title: 'Maximum Sum of Almost Unique Subarray',
  leetcodeNumber: 2841,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a 0-indexed integer array nums and integers m and k, find the maximum sum of a subarray of length k that contains at least m distinct elements. Use a sliding window of fixed size k with a frequency map tracking distinct element count.',
  tags: ['sliding window', 'hash map', 'array'],

  code: {
    pseudocode: `function maxSum(nums, m, k):
  freq = {}
  windowSum = 0
  result = 0
  for i in range(len(nums)):
    freq[nums[i]] = freq.get(nums[i], 0) + 1
    windowSum += nums[i]
    if i >= k:
      windowSum -= nums[i-k]
      freq[nums[i-k]] -= 1
      if freq[nums[i-k]] == 0:
        del freq[nums[i-k]]
    if i >= k-1 and len(freq) >= m:
      result = max(result, windowSum)
  return result`,

    python: `def maxSum(nums: list[int], m: int, k: int) -> int:
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
        if i >= k - 1 and len(freq) >= m:
            result = max(result, window_sum)
    return result`,

    javascript: `function maxSum(nums, m, k) {
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
    if (i >= k - 1 && freq.size >= m) result = Math.max(result, windowSum);
  }
  return result;
}`,

    java: `public long maxSum(List<Integer> nums, int m, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    long windowSum = 0, result = 0;
    for (int i = 0; i < nums.size(); i++) {
        freq.merge(nums.get(i), 1, Integer::sum);
        windowSum += nums.get(i);
        if (i >= k) {
            int out = nums.get(i - k);
            windowSum -= out;
            freq.merge(out, -1, Integer::sum);
            if (freq.get(out) == 0) freq.remove(out);
        }
        if (i >= k - 1 && freq.size() >= m) result = Math.max(result, windowSum);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 6, 7, 3, 1, 7],
    m: 3,
    k: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 6, 7, 3, 1, 7],
      placeholder: '2,6,7,3,1,7',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'm',
      label: 'Min Distinct m',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minimum distinct elements required',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Fixed subarray size',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const m = input.m as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find max sum of a subarray of length ${k} with at least ${m} distinct elements. Slide a fixed window of size ${k}.`,
      variables: { m, k, result: 0 },
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
        const valid = freq.size >= m;
        if (valid && windowSum > result) result = windowSum;
        const winStart = i - k + 1;

        steps.push({
          line: 13,
          explanation: `Window [${winStart}..${i}]: sum=${windowSum}, distinct=${freq.size}${valid ? ` >= ${m}. Valid! Best=${result}.` : ` < ${m}. Skip.`}`,
          variables: { windowStart: winStart, windowEnd: i, windowSum, distinct: freq.size, valid, result },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(Array.from({ length: k }, (_, idx) => [winStart + idx, valid ? 'found' : 'active'])),
            labels: { [winStart]: 'L', [i]: 'R' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 15,
      explanation: `Maximum sum of valid subarray = ${result}.`,
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

export default maxSumOfAlmostUniqueSubarray;
