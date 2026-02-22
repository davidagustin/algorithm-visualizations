import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfWaysToSplitArrayII: AlgorithmDefinition = {
  id: 'number-of-ways-to-split-array-ii',
  title: 'Number of Ways to Split Array II',
  leetcodeNumber: 2270,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of valid split positions where leftSum >= rightSum. A valid split at index i means sum(nums[0..i]) >= sum(nums[i+1..n-1]). Build a prefix sum once, then scan for valid splits in O(n) time.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function waysToSplitArray(nums):
  n = len(nums)
  total = sum(nums)
  count = 0, leftSum = 0
  for i from 0 to n-2:
    leftSum += nums[i]
    rightSum = total - leftSum
    if leftSum >= rightSum:
      count++
  return count`,
    python: `def waysToSplitArray(nums: list[int]) -> int:
    total = sum(nums)
    left_sum = 0
    count = 0
    for i in range(len(nums) - 1):
        left_sum += nums[i]
        if left_sum >= total - left_sum:
            count += 1
    return count`,
    javascript: `function waysToSplitArray(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0, count = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    leftSum += nums[i];
    if (leftSum >= total - leftSum) count++;
  }
  return count;
}`,
    java: `public int waysToSplitArray(int[] nums) {
    long total = 0;
    for (int x : nums) total += x;
    long leftSum = 0;
    int count = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        leftSum += nums[i];
        if (leftSum >= total - leftSum) count++;
    }
    return count;
}`,
  },
  defaultInput: { nums: [10, 4, -8, 7] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 4, -8, 7],
      placeholder: '10,4,-8,7',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    let count = 0;

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
      explanation: `Count valid splits (leftSum >= rightSum). nums = [${nums.join(', ')}], total = ${total}.`,
      variables: { total, count },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n - 1; i++) {
      leftSum += nums[i];
      const rightSum = total - leftSum;
      const valid = leftSum >= rightSum;
      if (valid) count++;

      steps.push({
        line: 6,
        explanation: `Split after index ${i}: leftSum=${leftSum}, rightSum=${rightSum}. Valid? ${valid}. count=${count}.`,
        variables: { i, leftSum, rightSum, valid, count },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, valid ? 'found' : 'active'])),
            ...Object.fromEntries(Array.from({ length: n - i - 1 }, (_, k) => [i + 1 + k, valid ? 'comparing' : 'default'])),
          },
          { [i]: `L=${leftSum}`, [i + 1]: `R=${rightSum}` },
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. Valid split positions: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${count}` },
      ),
    });

    return steps;
  },
};

export default numberOfWaysToSplitArrayII;
