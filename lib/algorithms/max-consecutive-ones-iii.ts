import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxConsecutiveOnesIII: AlgorithmDefinition = {
  id: 'max-consecutive-ones-iii',
  title: 'Max Consecutive Ones III',
  leetcodeNumber: 1004,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary array and an integer k, return the maximum number of consecutive 1s in the array if you can flip at most k 0s. Uses a sliding window tracking the count of zeros in the current window.',
  tags: ['sliding window', 'binary array', 'greedy'],

  code: {
    pseudocode: `function longestOnes(nums, k):
  left = 0, zeros = 0, maxLen = 0
  for right = 0 to len(nums)-1:
    if nums[right] == 0:
      zeros += 1
    while zeros > k:
      if nums[left] == 0:
        zeros -= 1
      left += 1
    maxLen = max(maxLen, right - left + 1)
  return maxLen`,

    python: `def longestOnes(nums: list[int], k: int) -> int:
    left = 0
    zeros = 0
    max_len = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,

    javascript: `function longestOnes(nums, k) {
  let left = 0, zeros = 0, maxLen = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,

    java: `public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },

  defaultInput: { nums: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k: 2 },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
      placeholder: '1,1,1,0,0,0,1,1,1,1,0',
      helperText: 'Binary array of 0s and 1s',
    },
    {
      name: 'k',
      label: 'Max Flips (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of 0s you can flip to 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]) || [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
    const k = (input.k as number) ?? 2;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    let left = 0;
    let zeros = 0;
    let maxLen = 0;
    let bestLeft = 0;
    let bestRight = -1;

    const makeViz = (
      l: number,
      r: number,
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: nums,
      highlights,
      labels,
      auxData: {
        label: 'Window Stats',
        entries: [
          { key: 'zeros in window', value: `${zeros}` },
          { key: 'k (max flips)', value: `${k}` },
          { key: 'window length', value: `${r >= l ? r - l + 1 : 0}` },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Initialize: left=0, zeros=0, maxLen=0. We flip at most k=${k} zeros, so window can have at most ${k} zeros.`,
      variables: { left: 0, zeros: 0, maxLen: 0, k },
      visualization: makeViz(0, -1, {}, {}),
    });

    for (let right = 0; right < n; right++) {
      if (nums[right] === 0) zeros++;

      const expandH: Record<number, string> = {};
      const expandL: Record<number, string> = {};
      if (bestRight >= bestLeft) for (let i = bestLeft; i <= bestRight; i++) expandH[i] = 'found';
      for (let i = left; i < right; i++) expandH[i] = nums[i] === 0 ? 'swapping' : 'active';
      expandH[right] = nums[right] === 0 ? 'mismatch' : 'comparing';
      if (left <= right) expandL[left] = 'L';
      expandL[right] = 'R';

      steps.push({
        line: 4,
        explanation: `Expand: nums[${right}]=${nums[right]}. ${nums[right] === 0 ? `zeros becomes ${zeros} (exceeds k=${k}? ${zeros > k ? 'Yes, shrink!' : 'No, valid.'})` : `No new zero. zeros=${zeros} <= k=${k}.`}`,
        variables: { left, right, zeros, k, maxLen },
        visualization: makeViz(left, right, expandH, expandL),
      });

      while (zeros > k) {
        const removedIsZero = nums[left] === 0;
        if (removedIsZero) zeros--;

        const shrinkH: Record<number, string> = {};
        const shrinkL: Record<number, string> = {};
        if (bestRight >= bestLeft) for (let i = bestLeft; i <= bestRight; i++) shrinkH[i] = 'found';
        shrinkH[left] = 'visited';
        for (let i = left + 1; i < right; i++) shrinkH[i] = nums[i] === 0 ? 'swapping' : 'active';
        shrinkH[right] = nums[right] === 0 ? 'mismatch' : 'comparing';
        shrinkL[left] = 'L';
        shrinkL[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Shrink: remove nums[${left}]=${nums[left]}. ${removedIsZero ? `zeros decreases to ${zeros}.` : 'Was 1, zeros unchanged.'} Move left to ${left + 1}.`,
          variables: { left: left + 1, right, zeros, k, maxLen },
          visualization: makeViz(left, right, shrinkH, shrinkL),
        });

        left++;
      }

      const windowLen = right - left + 1;
      if (windowLen > maxLen) {
        maxLen = windowLen;
        bestLeft = left;
        bestRight = right;

        const bestH: Record<number, string> = {};
        const bestL: Record<number, string> = {};
        for (let i = bestLeft; i <= bestRight; i++) bestH[i] = 'found';
        bestL[bestLeft] = 'L';
        bestL[bestRight] = 'R';

        steps.push({
          line: 9,
          explanation: `New max! Window [${left}..${right}] has ${windowLen} elements with ${zeros} zeros flipped. maxLen=${maxLen}.`,
          variables: { left, right, windowLen, maxLen, zeros, k },
          visualization: makeViz(left, right, bestH, bestL),
        });
      }
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = bestLeft; i <= bestRight; i++) finalH[i] = 'found';
    if (bestRight >= 0) {
      finalL[bestLeft] = 'start';
      finalL[bestRight] = 'end';
    }

    steps.push({
      line: 10,
      explanation: `Done! Longest subarray of 1s after flipping at most ${k} zeros = ${maxLen}.`,
      variables: { maxLen, bestWindow: nums.slice(bestLeft, bestRight + 1) },
      visualization: makeViz(bestLeft, bestRight, finalH, finalL),
    });

    return steps;
  },
};

export default maxConsecutiveOnesIII;
