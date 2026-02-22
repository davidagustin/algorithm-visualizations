import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const runningSumOf1DArrayII: AlgorithmDefinition = {
  id: 'running-sum-of-1d-array-ii',
  title: 'Running Sum of 1D Array II',
  leetcodeNumber: 1480,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Given an array nums, return a running sum array where runningSum[i] = sum(nums[0..i]). This is a simple in-place prefix sum: for each index from 1 onwards, add the previous element. O(n) time, O(1) extra space.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function runningSum(nums):
  for i from 1 to n-1:
    nums[i] += nums[i-1]
  return nums`,
    python: `def runningSum(nums: list[int]) -> list[int]:
    for i in range(1, len(nums)):
        nums[i] += nums[i - 1]
    return nums`,
    javascript: `function runningSum(nums) {
  for (let i = 1; i < nums.length; i++) {
    nums[i] += nums[i - 1];
  }
  return nums;
}`,
    java: `public int[] runningSum(int[] nums) {
    for (int i = 1; i < nums.length; i++)
        nums[i] += nums[i - 1];
    return nums;
}`,
  },
  defaultInput: { nums: [1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsOrig = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const nums = [...numsOrig];
    const n = nums.length;

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
      explanation: `Compute running sum for [${numsOrig.join(', ')}]. Each element becomes sum of all preceding elements including itself.`,
      variables: { nums: [...numsOrig] },
      visualization: makeViz({}, {}),
    });

    // nums[0] stays the same
    steps.push({
      line: 2,
      explanation: `nums[0] = ${nums[0]} stays unchanged (no prior elements).`,
      variables: { 'nums[0]': nums[0] },
      visualization: makeViz({ 0: 'found' }, { 0: `=${nums[0]}` }),
    });

    for (let i = 1; i < n; i++) {
      const prev = nums[i - 1];
      const orig = nums[i];
      nums[i] += prev;

      steps.push({
        line: 2,
        explanation: `nums[${i}] = nums[${i}](${orig}) + nums[${i - 1}](${prev}) = ${nums[i]}.`,
        variables: { i, 'nums[i]': orig, 'nums[i-1]': prev, result: nums[i] },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])),
            [i]: 'found',
          },
          { [i - 1]: `prev=${prev}`, [i]: `=${nums[i]}` },
        ),
      });
    }

    steps.push({
      line: 3,
      explanation: `Running sum complete: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
      ),
    });

    return steps;
  },
};

export default runningSumOf1DArrayII;
