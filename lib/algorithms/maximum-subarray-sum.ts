import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSubarraySum: AlgorithmDefinition = {
  id: 'maximum-subarray-sum',
  title: 'Maximum Subarray Sum',
  leetcodeNumber: 53,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array nums, find the subarray with the largest sum and return its sum. We use Kadane\'s algorithm: maintain a running currentSum and reset to 0 when it goes negative. Track the maximum sum seen.',
  tags: ['Dynamic Programming', 'Array', 'Greedy'],
  code: {
    pseudocode: `function maxSubArray(nums):
  maxSum = nums[0]
  currentSum = 0
  for each num in nums:
    currentSum += num
    if currentSum > maxSum:
      maxSum = currentSum
    if currentSum < 0:
      currentSum = 0
  return maxSum`,
    python: `def maxSubArray(nums):
    maxSum = nums[0]
    currentSum = 0
    for num in nums:
        currentSum += num
        if currentSum > maxSum:
            maxSum = currentSum
        if currentSum < 0:
            currentSum = 0
    return maxSum`,
    javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = 0;
  for (const num of nums) {
    currentSum += num;
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
    if (currentSum < 0) {
      currentSum = 0;
    }
  }
  return maxSum;
}`,
    java: `public int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = 0;
    for (int num : nums) {
        currentSum += num;
        if (currentSum > maxSum) {
            maxSum = currentSum;
        }
        if (currentSum < 0) {
            currentSum = 0;
        }
    }
    return maxSum;
}`,
  },
  defaultInput: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      placeholder: '-2,1,-3,4,-1,2,1,-5,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    let maxSum = nums[0];
    let currentSum = 0;
    let subarrayStart = 0;
    let bestStart = 0;
    let bestEnd = 0;

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Kadane\'s Algorithm',
          entries: [
            { key: 'Current Sum', value: String(currentSum) },
            { key: 'Max Sum', value: String(maxSum) },
            { key: 'Best Subarray', value: `[${bestStart}..${bestEnd}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Array of ${n} elements. Use Kadane's algorithm: track running sum, reset when negative.`,
      variables: { n, maxSum, currentSum },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      currentSum += nums[i];

      const highlights: Record<number, string> = { [i]: 'active' };
      // Highlight current subarray
      for (let k = subarrayStart; k <= i; k++) {
        if (k !== i) highlights[k] = 'pointer';
      }

      if (currentSum > maxSum) {
        maxSum = currentSum;
        bestEnd = i;
        bestStart = subarrayStart;

        steps.push({
          line: 5,
          explanation: `Add nums[${i}] = ${nums[i]}. currentSum = ${currentSum}. New max found! maxSum = ${maxSum}. Best subarray: [${bestStart}..${bestEnd}].`,
          variables: { i, 'nums[i]': nums[i], currentSum, maxSum },
          visualization: (() => {
            const h: Record<number, string> = {};
            for (let k = bestStart; k <= bestEnd; k++) h[k] = 'found';
            h[i] = 'match';
            return makeViz(h, { [i]: `+${nums[i]}` });
          })(),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Add nums[${i}] = ${nums[i]}. currentSum = ${currentSum}. maxSum still ${maxSum}.`,
          variables: { i, 'nums[i]': nums[i], currentSum, maxSum },
          visualization: makeViz(highlights, { [i]: `+${nums[i]}` }),
        });
      }

      if (currentSum < 0) {
        steps.push({
          line: 7,
          explanation: `currentSum (${currentSum}) < 0. Reset to 0 and start new subarray from index ${i + 1}.`,
          variables: { currentSum: 0, nextStart: i + 1 },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'reset' }),
        });
        currentSum = 0;
        subarrayStart = i + 1;
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = (i >= bestStart && i <= bestEnd) ? 'found' : 'default';
    }

    steps.push({
      line: 8,
      explanation: `Kadane's complete. Maximum subarray sum = ${maxSum}. Subarray: [${nums.slice(bestStart, bestEnd + 1).join(', ')}] at indices ${bestStart}..${bestEnd}.`,
      variables: { result: maxSum, subarray: nums.slice(bestStart, bestEnd + 1) },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default maximumSubarraySum;
