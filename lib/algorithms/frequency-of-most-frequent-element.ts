import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const frequencyOfMostFrequentElement: AlgorithmDefinition = {
  id: 'frequency-of-most-frequent-element',
  title: 'Frequency of the Most Frequent Element',
  leetcodeNumber: 1838,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and an integer k, in one operation you may choose an index and increment nums[index] by 1. Return the maximum possible frequency of an element after performing at most k operations. Sort the array, then use a sliding window where the cost to make all elements equal to the rightmost is tracked. Shrink if cost exceeds k.',
  tags: ['sliding window', 'sorting', 'greedy', 'prefix sum'],

  code: {
    pseudocode: `function maxFrequency(nums, k):
  nums.sort()
  left = 0
  total = 0
  result = 0
  for right in range(len(nums)):
    total += nums[right]
    while nums[right] * (right - left + 1) - total > k:
      total -= nums[left]
      left += 1
    result = max(result, right - left + 1)
  return result`,

    python: `def maxFrequency(nums: list[int], k: int) -> int:
    nums.sort()
    left = 0
    total = 0
    result = 0
    for right in range(len(nums)):
        total += nums[right]
        while nums[right] * (right - left + 1) - total > k:
            total -= nums[left]
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function maxFrequency(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, total = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    total += nums[right];
    while (nums[right] * (right - left + 1) - total > k) {
      total -= nums[left];
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int maxFrequency(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, result = 0;
    long total = 0;
    for (int right = 0; right < nums.length; right++) {
        total += nums[right];
        while ((long)nums[right] * (right - left + 1) - total > k) {
            total -= nums[left++];
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 4],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 4],
      placeholder: '1,2,4',
      helperText: 'Array of positive integers',
    },
    {
      name: 'k',
      label: 'Operations (k)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum number of increment operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsRaw = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const nums = [...numsRaw].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sort array: [${nums.join(', ')}]. Key insight: to make a window all equal to nums[right], cost = nums[right] * windowSize - windowSum.`,
      variables: { sorted: nums.join(', '), k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    let left = 0;
    let total = 0;
    let result = 0;

    for (let right = 0; right < nums.length; right++) {
      total += nums[right];
      const windowSize = right - left + 1;
      const cost = nums[right] * windowSize - total;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = 'active';
      }
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 6,
        explanation: `Expand to index ${right} (value ${nums[right]}). Window sum=${total}. Cost to make all equal to ${nums[right]}: ${nums[right]}*${windowSize}-${total}=${cost}. k=${k}.`,
        variables: { left, right, target: nums[right], total, windowSize, cost, k },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights,
          labels,
        },
      });

      while (nums[right] * (right - left + 1) - total > k) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) {
          shrinkHighlights[i] = 'active';
        }
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Cost ${nums[right] * (right - left + 1) - total} > k=${k}. Shrink from left, removing value ${nums[left]}.`,
          variables: { left, right, removedValue: nums[left], total },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: shrinkHighlights,
            labels: shrinkLabels,
          },
        });

        total -= nums[left];
        left++;
      }

      result = Math.max(result, right - left + 1);

      const finalHighlights: Record<number, string> = {};
      const finalLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        finalHighlights[i] = result === right - left + 1 ? 'found' : 'active';
      }
      finalLabels[left] = 'L';
      finalLabels[right] = 'R';

      steps.push({
        line: 9,
        explanation: `Valid window [${left}, ${right}] with ${right - left + 1} elements. Max frequency so far=${result}.`,
        variables: { left, right, frequency: right - left + 1, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: finalHighlights,
          labels: finalLabels,
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum frequency achievable with at most ${k} increments = ${result}.`,
      variables: { result, k },
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

export default frequencyOfMostFrequentElement;
