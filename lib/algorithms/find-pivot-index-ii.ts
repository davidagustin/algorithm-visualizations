import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPivotIndexIi: AlgorithmDefinition = {
  id: 'find-pivot-index-ii',
  title: 'Find Pivot Index',
  leetcodeNumber: 724,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Find the leftmost pivot index in an array where the sum of all elements to the left equals the sum of all elements to the right. Compute total sum first, then traverse left to right maintaining a running left sum. At each index, right sum = total - leftSum - nums[i]. If leftSum equals rightSum, return the index.',
  tags: ['array', 'prefix sum'],

  code: {
    pseudocode: `function pivotIndex(nums):
  total = sum(nums)
  leftSum = 0
  for i in range(len(nums)):
    rightSum = total - leftSum - nums[i]
    if leftSum == rightSum:
      return i
    leftSum += nums[i]
  return -1`,
    python: `def pivotIndex(nums):
    total = sum(nums)
    left_sum = 0
    for i, x in enumerate(nums):
        if left_sum == total - left_sum - x:
            return i
        left_sum += x
    return -1`,
    javascript: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
    java: `public int pivotIndex(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    int leftSum = 0;
    for (int i = 0; i < nums.length; i++) {
        if (leftSum == total - leftSum - nums[i]) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
  },

  defaultInput: {
    nums: [1, 7, 3, 6, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 7, 3, 6, 5, 6],
      placeholder: '1,7,3,6,5,6',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const total = nums.reduce((a, b) => a + b, 0);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute total sum = ${total}. Will use total to derive right sum at each index.`,
      variables: { total },
      visualization: makeViz({}, {}),
    });

    let leftSum = 0;
    for (let i = 0; i < nums.length; i++) {
      const rightSum = total - leftSum - nums[i];
      steps.push({
        line: 4,
        explanation: `Index ${i}: leftSum=${leftSum}, nums[${i}]=${nums[i]}, rightSum=${total}-${leftSum}-${nums[i]}=${rightSum}.`,
        variables: { i, value: nums[i], leftSum, rightSum, total },
        visualization: makeViz(
          {
            ...Object.fromEntries(nums.slice(0, i).map((_, j) => [j, 'comparing'])),
            [i]: 'active',
            ...Object.fromEntries(nums.slice(i + 1).map((_, j) => [i + 1 + j, 'pointer'])),
          },
          { [i]: 'pivot?' }
        ),
      });

      if (leftSum === rightSum) {
        steps.push({
          line: 6,
          explanation: `leftSum (${leftSum}) == rightSum (${rightSum}). Pivot found at index ${i}!`,
          variables: { pivotIndex: i, leftSum, rightSum },
          visualization: makeViz(
            {
              ...Object.fromEntries(nums.slice(0, i).map((_, j) => [j, 'sorted'])),
              [i]: 'found',
              ...Object.fromEntries(nums.slice(i + 1).map((_, j) => [i + 1 + j, 'sorted'])),
            },
            { [i]: 'PIVOT' }
          ),
        });
        return steps;
      }

      leftSum += nums[i];
    }

    steps.push({
      line: 8,
      explanation: 'No pivot index found. Return -1.',
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default findPivotIndexIi;
