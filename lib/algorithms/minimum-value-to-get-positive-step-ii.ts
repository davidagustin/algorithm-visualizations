import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumValueToGetPositiveStepII: AlgorithmDefinition = {
  id: 'minimum-value-to-get-positive-step-ii',
  title: 'Minimum Value to Get Positive Step by Step Sum II',
  leetcodeNumber: 1413,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Find the minimum positive integer startValue such that the running sum (startValue + nums[0] + ... + nums[i]) is always >= 1. Compute the minimum prefix sum; startValue = max(1, 1 - minPrefixSum). O(n) time.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function minStartValue(nums):
  minPrefix = 0, runningSum = 0
  for num in nums:
    runningSum += num
    minPrefix = min(minPrefix, runningSum)
  return max(1, 1 - minPrefix)`,
    python: `def minStartValue(nums: list[int]) -> int:
    min_prefix = running_sum = 0
    for num in nums:
        running_sum += num
        min_prefix = min(min_prefix, running_sum)
    return max(1, 1 - min_prefix)`,
    javascript: `function minStartValue(nums) {
  let minPrefix = 0, runningSum = 0;
  for (const num of nums) {
    runningSum += num;
    minPrefix = Math.min(minPrefix, runningSum);
  }
  return Math.max(1, 1 - minPrefix);
}`,
    java: `public int minStartValue(int[] nums) {
    int minPrefix = 0, runningSum = 0;
    for (int num : nums) {
        runningSum += num;
        minPrefix = Math.min(minPrefix, runningSum);
    }
    return Math.max(1, 1 - minPrefix);
}`,
  },
  defaultInput: { nums: [-3, 2, -3, 4, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-3, 2, -3, 4, 2],
      placeholder: '-3,2,-3,4,2',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    let minPrefix = 0;
    let runningSum = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find min startValue so running sum is always >= 1. nums = [${nums.join(', ')}].`,
      variables: { minPrefix, runningSum },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      runningSum += nums[i];
      const prevMin = minPrefix;
      if (runningSum < minPrefix) minPrefix = runningSum;

      steps.push({
        line: 3,
        explanation: `Index ${i}: num=${nums[i]}, runningSum=${runningSum}, minPrefix=${minPrefix}${runningSum < prevMin ? ' (new min!)' : ''}.`,
        variables: { i, num: nums[i], runningSum, minPrefix },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])),
            [i]: runningSum === minPrefix && runningSum < prevMin ? 'comparing' : 'active',
          },
          { [i]: `rs=${runningSum}` },
        ),
      });
    }

    const result = Math.max(1, 1 - minPrefix);
    steps.push({
      line: 5,
      explanation: `minPrefix = ${minPrefix}. startValue = max(1, 1 - ${minPrefix}) = ${result}.`,
      variables: { minPrefix, result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${result}` },
      ),
    });

    return steps;
  },
};

export default minimumValueToGetPositiveStepII;
