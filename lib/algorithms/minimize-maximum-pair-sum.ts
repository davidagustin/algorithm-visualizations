import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimizeMaximumPairSum: AlgorithmDefinition = {
  id: 'minimize-maximum-pair-sum',
  title: 'Minimize Maximum Pair Sum in Array',
  leetcodeNumber: 1877,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an even-length array, pair up all elements to minimize the maximum pair sum. Sort the array, then pair the smallest with the largest using two pointers. This greedy approach ensures the maximum pair sum is minimized.',
  tags: ['two pointers', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function minPairSum(nums):
  sort(nums)
  left = 0, right = n-1
  maxPairSum = 0
  while left < right:
    pairSum = nums[left] + nums[right]
    maxPairSum = max(maxPairSum, pairSum)
    left++
    right--
  return maxPairSum`,

    python: `def minPairSum(nums: list[int]) -> int:
    nums.sort()
    left, right = 0, len(nums) - 1
    max_pair = 0
    while left < right:
        max_pair = max(max_pair, nums[left] + nums[right])
        left += 1
        right -= 1
    return max_pair`,

    javascript: `function minPairSum(nums) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1, maxPair = 0;
  while (left < right) {
    maxPair = Math.max(maxPair, nums[left] + nums[right]);
    left++;
    right--;
  }
  return maxPair;
}`,

    java: `public int minPairSum(int[] nums) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, maxPair = 0;
    while (left < right) {
        maxPair = Math.max(maxPair, nums[left] + nums[right]);
        left++;
        right--;
    }
    return maxPair;
}`,
  },

  defaultInput: {
    nums: [3, 5, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array (even length)',
      type: 'array',
      defaultValue: [3, 5, 2, 3],
      placeholder: '3,5,2,3',
      helperText: 'Comma-separated integers (must have even length)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const sorted = [...rawNums].sort((a, b) => a - b);
    const n = sorted.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sorted],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort array: [${sorted.join(', ')}]. Pair smallest with largest to minimize the maximum pair sum.`,
      variables: { sorted: [...sorted] },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = n - 1;
    let maxPairSum = 0;
    const pairs: [number, number][] = [];

    steps.push({
      line: 2,
      explanation: `Initialize left=${left}, right=${right}. Will pair indices (0,n-1), (1,n-2), etc.`,
      variables: { left, right, maxPairSum },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      const pairSum = sorted[left] + sorted[right];
      if (pairSum > maxPairSum) maxPairSum = pairSum;
      pairs.push([left, right]);

      steps.push({
        line: 5,
        explanation: `Pair (${sorted[left]}, ${sorted[right]}): sum=${pairSum}. maxPairSum=${maxPairSum}.`,
        variables: { left, right, 'nums[left]': sorted[left], 'nums[right]': sorted[right], pairSum, maxPairSum },
        visualization: makeViz(
          { [left]: 'found', [right]: 'found' },
          { [left]: `${sorted[left]}`, [right]: `${sorted[right]}` }
        ),
      });

      left++;
      right--;
    }

    steps.push({
      line: 8,
      explanation: `All pairs formed. Minimized maximum pair sum is ${maxPairSum}.`,
      variables: { maxPairSum, pairs },
      visualization: makeViz(
        Object.fromEntries(sorted.map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default minimizeMaximumPairSum;
