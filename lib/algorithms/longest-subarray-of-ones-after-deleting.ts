import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubarrayOfOnesAfterDeleting: AlgorithmDefinition = {
  id: 'longest-subarray-of-ones-after-deleting',
  title: 'Longest Subarray of 1s After Deleting One Element',
  leetcodeNumber: 1493,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary array nums, delete exactly one element and return the length of the longest non-empty subarray containing only 1s. Use a sliding window allowing at most one zero inside. When the window has more than one zero, shrink from the left. The answer is the window size minus one (for the deleted element).',
  tags: ['sliding window', 'array', 'binary array'],

  code: {
    pseudocode: `function longestSubarray(nums):
  left = 0
  zeros = 0
  result = 0
  for right in range(len(nums)):
    if nums[right] == 0:
      zeros += 1
    while zeros > 1:
      if nums[left] == 0:
        zeros -= 1
      left += 1
    result = max(result, right - left)
  return result`,

    python: `def longestSubarray(nums: list[int]) -> int:
    left = 0
    zeros = 0
    result = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > 1:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        result = max(result, right - left)
    return result`,

    javascript: `function longestSubarray(nums) {
  let left = 0, zeros = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > 1) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    result = Math.max(result, right - left);
  }
  return result;
}`,

    java: `public int longestSubarray(int[] nums) {
    int left = 0, zeros = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > 1) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        result = Math.max(result, right - left);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 1, 0, 1, 1, 1, 0, 1, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 1, 0, 1, 1, 1, 0, 1, 1],
      placeholder: '1,1,0,1,1,1,0,1,1',
      helperText: 'Array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let left = 0;
    let zeros = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `Initialize sliding window. We allow at most 1 zero inside the window (for the deletion).`,
      variables: { left: 0, right: -1, zeros: 0, result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < nums.length; right++) {
      if (nums[right] === 0) {
        zeros++;
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = nums[i] === 0 ? 'comparing' : 'active';
      }
      highlights[right] = nums[right] === 0 ? 'mismatch' : 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Expand right to index ${right} (value ${nums[right]}). Zeros in window: ${zeros}.`,
        variables: { left, right, value: nums[right], zeros },
        visualization: makeViz(highlights, labels),
      });

      while (zeros > 1) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) {
          shrinkHighlights[i] = 'active';
        }
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 8,
          explanation: `Window has ${zeros} zeros (more than 1). Shrink from left, removing value ${nums[left]} at index ${left}.`,
          variables: { left, right, removedValue: nums[left], zeros },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        if (nums[left] === 0) zeros--;
        left++;
      }

      const windowLen = right - left;
      result = Math.max(result, windowLen);

      const finalHighlights: Record<number, string> = {};
      const finalLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        finalHighlights[i] = result === windowLen ? 'found' : 'active';
      }
      finalLabels[left] = 'L';
      finalLabels[right] = 'R';

      steps.push({
        line: 11,
        explanation: `Valid window with at most 1 zero. Window size=${right - left + 1}, length after deletion=${windowLen}. Best=${result}.`,
        variables: { left, right, zeros, windowLen, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Longest subarray of 1s after deleting one element = ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestSubarrayOfOnesAfterDeleting;
