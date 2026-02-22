import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfAbsoluteDifferences: AlgorithmDefinition = {
  id: 'sum-of-absolute-differences',
  title: 'Sum of Absolute Differences in a Sorted Array',
  leetcodeNumber: 1685,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given a sorted array, compute result[i] = sum of |nums[i] - nums[j]| for all j. For a sorted array at index i: left elements contribute i*nums[i] - leftSum, right elements contribute rightSum - (n-1-i)*nums[i]. Use prefix sums for O(n) computation.',
  tags: ['Prefix Sum', 'Array', 'Math'],
  code: {
    pseudocode: `function getSumAbsoluteDifferences(nums):
  n = len(nums)
  prefix = prefix sum array
  result = []
  for i from 0 to n-1:
    leftDiff = i * nums[i] - prefix[i]
    rightDiff = (prefix[n] - prefix[i+1]) - (n-1-i) * nums[i]
    result.append(leftDiff + rightDiff)
  return result`,
    python: `def getSumAbsoluteDifferences(nums: list[int]) -> list[int]:
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    result = []
    for i in range(n):
        left = i * nums[i] - prefix[i]
        right = (prefix[n] - prefix[i + 1]) - (n - 1 - i) * nums[i]
        result.append(left + right)
    return result`,
    javascript: `function getSumAbsoluteDifferences(nums) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  return nums.map((num, i) => {
    const left = i * num - prefix[i];
    const right = (prefix[n] - prefix[i + 1]) - (n - 1 - i) * num;
    return left + right;
  });
}`,
    java: `public int[] getSumAbsoluteDifferences(int[] nums) {
    int n = nums.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
    int[] result = new int[n];
    for (int i = 0; i < n; i++) {
        int left = i * nums[i] - prefix[i];
        int right = (prefix[n] - prefix[i+1]) - (n-1-i) * nums[i];
        result[i] = left + right;
    }
    return result;
}`,
  },
  defaultInput: { nums: [2, 3, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [2, 3, 5],
      placeholder: '2,3,5',
      helperText: 'Non-decreasing sorted integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr?: number[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr ?? [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute sum of absolute differences for sorted nums = [${nums.join(', ')}]. prefix = [${prefix.join(', ')}].`,
      variables: { nums, prefix },
      visualization: makeViz({}, {}),
    });

    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      const left = i * nums[i] - prefix[i];
      const right = (prefix[n] - prefix[i + 1]) - (n - 1 - i) * nums[i];
      const total = left + right;
      result.push(total);

      steps.push({
        line: 6,
        explanation: `Index ${i}: nums[${i}]=${nums[i]}. leftDiff=${left} (${i}*${nums[i]}-${prefix[i]}), rightDiff=${right}. result[${i}]=${total}.`,
        variables: { i, left, right, total },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'comparing'])),
            [i]: 'found',
            ...Object.fromEntries(Array.from({ length: n - i - 1 }, (_, k) => [i + 1 + k, 'active'])),
          },
          { [i]: `=${total}` },
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. result = [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)])),
        [...result],
      ),
    });

    return steps;
  },
};

export default sumOfAbsoluteDifferences;
