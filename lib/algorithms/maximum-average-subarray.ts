import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumAverageSubarray: AlgorithmDefinition = {
  id: 'maximum-average-subarray',
  title: 'Maximum Average Subarray I',
  leetcodeNumber: 643,
  difficulty: 'Easy',
  category: 'Sliding Window',
  description:
    'Given an integer array and integer k, find the contiguous subarray of length k that has the maximum average and return that average. Use a sliding window: compute the first window sum, then slide by adding the next element and removing the leftmost.',
  tags: ['sliding window', 'array', 'subarray', 'average'],

  code: {
    pseudocode: `function findMaxAverage(nums, k):
  windowSum = sum(nums[0..k-1])
  maxSum = windowSum
  for i from k to length(nums)-1:
    windowSum = windowSum + nums[i] - nums[i-k]
    maxSum = max(maxSum, windowSum)
  return maxSum / k`,

    python: `def findMaxAverage(nums: list[int], k: int) -> float:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum / k`,

    javascript: `function findMaxAverage(nums, k) {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,

    java: `public double findMaxAverage(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return (double) maxSum / k;
}`,
  },

  defaultInput: {
    nums: [1, 12, -5, -6, 50, 3],
    k: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 12, -5, -6, 50, 3],
      placeholder: '1,12,-5,-6,50,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Window Size k',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Length of subarray',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += nums[i];
    let maxSum = windowSum;

    const initialHighlights: Record<number, string> = {};
    for (let i = 0; i < k; i++) initialHighlights[i] = 'active';

    steps.push({
      line: 1,
      explanation: `Compute first window [0..${k - 1}]: sum = ${windowSum}.`,
      variables: { windowSum, maxSum, k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: initialHighlights,
        labels: { 0: 'L', [k - 1]: 'R' },
      },
    });

    for (let i = k; i < nums.length; i++) {
      const added = nums[i];
      const removed = nums[i - k];
      windowSum += added - removed;

      const highlights: Record<number, string> = {};
      for (let j = i - k + 1; j <= i; j++) highlights[j] = 'active';
      highlights[i] = 'found';
      highlights[i - k] = 'mismatch';

      const updated = windowSum > maxSum;
      if (updated) maxSum = windowSum;

      steps.push({
        line: 4,
        explanation: `Slide window: add nums[${i}]=${added}, remove nums[${i - k}]=${removed}. New windowSum=${windowSum}. ${updated ? `New maxSum=${maxSum}!` : `maxSum stays ${maxSum}.`}`,
        variables: { i, windowSum, maxSum, added, removed },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights,
          labels: { [i - k + 1]: 'L', [i]: 'R' },
        },
      });
    }

    const result = maxSum / k;

    steps.push({
      line: 6,
      explanation: `Maximum sum window has sum=${maxSum}. Max average = ${maxSum}/${k} = ${result.toFixed(5)}.`,
      variables: { maxSum, k, result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumAverageSubarray;
