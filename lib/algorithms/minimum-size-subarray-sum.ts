import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSizeSubarraySum: AlgorithmDefinition = {
  id: 'minimum-size-subarray-sum',
  title: 'Minimum Size Subarray Sum',
  leetcodeNumber: 209,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers and a target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. Uses a sliding window that expands right and shrinks left whenever the sum condition is met.',
  tags: ['sliding window', 'two pointers', 'prefix sum'],

  code: {
    pseudocode: `function minSubArrayLen(target, nums):
  left = 0, windowSum = 0, minLen = infinity
  for right = 0 to len(nums)-1:
    windowSum += nums[right]
    while windowSum >= target:
      minLen = min(minLen, right - left + 1)
      windowSum -= nums[left]
      left += 1
  return 0 if minLen == infinity else minLen`,

    python: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    left = 0
    window_sum = 0
    min_len = float('inf')
    for right in range(len(nums)):
        window_sum += nums[right]
        while window_sum >= target:
            min_len = min(min_len, right - left + 1)
            window_sum -= nums[left]
            left += 1
    return 0 if min_len == float('inf') else min_len`,

    javascript: `function minSubArrayLen(target, nums) {
  let left = 0, windowSum = 0, minLen = Infinity;
  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    while (windowSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return minLen === Infinity ? 0 : minLen;
}`,

    java: `public int minSubArrayLen(int target, int[] nums) {
    int left = 0, windowSum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right];
        while (windowSum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            windowSum -= nums[left];
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}`,
  },

  defaultInput: { target: 7, nums: [2, 3, 1, 2, 4, 3] },

  inputFields: [
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Find subarray with sum >= target',
    },
    {
      name: 'nums',
      label: 'Array of Positive Integers',
      type: 'array',
      defaultValue: [2, 3, 1, 2, 4, 3],
      placeholder: '2,3,1,2,4,3',
      helperText: 'Array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = (input.target as number) ?? 7;
    const nums = (input.nums as number[]) || [2, 3, 1, 2, 4, 3];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    let left = 0;
    let windowSum = 0;
    let minLen = Infinity;
    let bestLeft = -1;
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
          { key: 'windowSum', value: `${windowSum}` },
          { key: 'target', value: `${target}` },
          { key: 'minLen', value: `${minLen === Infinity ? '∞' : minLen}` },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Initialize: left=0, windowSum=0, minLen=∞. Find shortest subarray with sum >= ${target}.`,
      variables: { left: 0, windowSum: 0, minLen: 'Infinity', target },
      visualization: makeViz(0, -1, {}, {}),
    });

    for (let right = 0; right < n; right++) {
      windowSum += nums[right];

      const expandH: Record<number, string> = {};
      const expandL: Record<number, string> = {};
      if (bestRight >= 0) for (let i = bestLeft; i <= bestRight; i++) expandH[i] = 'found';
      for (let i = left; i < right; i++) expandH[i] = 'active';
      expandH[right] = 'comparing';
      if (left <= right) expandL[left] = 'L';
      expandL[right] = 'R';

      steps.push({
        line: 3,
        explanation: `Add nums[${right}]=${nums[right]} to window. windowSum=${windowSum}. ${windowSum >= target ? `>= target=${target}! Start shrinking.` : `< target=${target}. Keep expanding.`}`,
        variables: { left, right, windowSum, target, minLen: minLen === Infinity ? 'Infinity' : minLen },
        visualization: makeViz(left, right, expandH, expandL),
      });

      while (windowSum >= target) {
        const windowLen = right - left + 1;
        if (windowLen < minLen) {
          minLen = windowLen;
          bestLeft = left;
          bestRight = right;

          const bestH: Record<number, string> = {};
          const bestL: Record<number, string> = {};
          for (let i = bestLeft; i <= bestRight; i++) bestH[i] = 'found';
          bestL[bestLeft] = 'L';
          bestL[bestRight] = 'R';

          steps.push({
            line: 5,
            explanation: `New minimum! Subarray [${left}..${right}] sums to ${windowSum} >= ${target}. Length=${windowLen} < previous minLen. Update minLen=${windowLen}.`,
            variables: { left, right, windowSum, windowLen, minLen, target },
            visualization: makeViz(left, right, bestH, bestL),
          });
        }

        windowSum -= nums[left];
        const shrinkH: Record<number, string> = {};
        const shrinkL: Record<number, string> = {};
        if (bestRight >= 0) for (let i = bestLeft; i <= bestRight; i++) shrinkH[i] = 'found';
        shrinkH[left] = 'visited';
        for (let i = left + 1; i <= right; i++) shrinkH[i] = 'active';
        shrinkL[left] = 'L';
        shrinkL[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Shrink: remove nums[${left}]=${nums[left]}. windowSum=${windowSum}. Move left to ${left + 1}.`,
          variables: { left: left + 1, right, windowSum, target, minLen },
          visualization: makeViz(left, right, shrinkH, shrinkL),
        });

        left++;
      }
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    if (bestRight >= 0) {
      for (let i = bestLeft; i <= bestRight; i++) finalH[i] = 'found';
      finalL[bestLeft] = 'start';
      finalL[bestRight] = 'end';
    }

    steps.push({
      line: 8,
      explanation: `Done! Minimum subarray length with sum >= ${target} is ${minLen === Infinity ? 0 : minLen}.`,
      variables: { result: minLen === Infinity ? 0 : minLen, target },
      visualization: makeViz(bestLeft, bestRight, finalH, finalL),
    });

    return steps;
  },
};

export default minimumSizeSubarraySum;
