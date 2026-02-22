import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxNumberOfKSumPairsSliding: AlgorithmDefinition = {
  id: 'max-number-of-k-sum-pairs-sliding',
  title: 'Max Number of K-Sum Pairs (Sliding Window Approach)',
  leetcodeNumber: 1679,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array nums and integer k, in one operation pick two numbers that sum to k and remove them. Return max operations. Sort the array then use two pointers (sliding window) converging from both ends: if sum equals k remove both and count, if sum < k advance left, else advance right.',
  tags: ['sliding window', 'two pointers', 'sorting', 'array'],

  code: {
    pseudocode: `function maxOperations(nums, k):
  sort(nums)
  left = 0
  right = len(nums) - 1
  ops = 0
  while left < right:
    s = nums[left] + nums[right]
    if s == k:
      ops++
      left++
      right--
    elif s < k:
      left++
    else:
      right--
  return ops`,

    python: `def maxOperations(nums: list[int], k: int) -> int:
    nums.sort()
    left, right = 0, len(nums) - 1
    ops = 0
    while left < right:
        s = nums[left] + nums[right]
        if s == k:
            ops += 1
            left += 1
            right -= 1
        elif s < k:
            left += 1
        else:
            right -= 1
    return ops`,

    javascript: `function maxOperations(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1, ops = 0;
  while (left < right) {
    const s = nums[left] + nums[right];
    if (s === k) { ops++; left++; right--; }
    else if (s < k) left++;
    else right--;
  }
  return ops;
}`,

    java: `public int maxOperations(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, ops = 0;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == k) { ops++; left++; right--; }
        else if (s < k) left++;
        else right--;
    }
    return ops;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target Sum k',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Pairs must sum to k',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsRaw = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const nums = [...numsRaw].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sort array: [${nums.join(', ')}]. Use two pointers from both ends. Pairs summing to ${k} get removed.`,
      variables: { sorted: nums.join(','), k, ops: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let left = 0;
    let right = nums.length - 1;
    let ops = 0;

    while (left < right) {
      const s = nums[left] + nums[right];

      steps.push({
        line: 6,
        explanation: `Pointers: L=${left}(${nums[left]}), R=${right}(${nums[right]}). Sum = ${s}. Target = ${k}.`,
        variables: { left, right, sum: s, k, ops },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [left]: 'active', [right]: 'active' },
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });

      if (s === k) {
        ops++;
        steps.push({
          line: 8,
          explanation: `Sum ${s} = k = ${k}! Pair (${nums[left]}, ${nums[right]}) removed. Ops = ${ops}. Move both pointers inward.`,
          variables: { left, right, ops, pair: [nums[left], nums[right]] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'found', [right]: 'found' },
            labels: { [left]: 'L++', [right]: 'R--' },
          } as ArrayVisualization,
        });
        left++;
        right--;
      } else if (s < k) {
        steps.push({
          line: 11,
          explanation: `Sum ${s} < ${k}. Need larger sum, advance left pointer.`,
          variables: { left, right, sum: s },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'mismatch', [right]: 'pointer' },
            labels: { [left]: 'L++', [right]: 'R' },
          } as ArrayVisualization,
        });
        left++;
      } else {
        steps.push({
          line: 13,
          explanation: `Sum ${s} > ${k}. Need smaller sum, advance right pointer left.`,
          variables: { left, right, sum: s },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'pointer', [right]: 'mismatch' },
            labels: { [left]: 'L', [right]: 'R--' },
          } as ArrayVisualization,
        });
        right--;
      }
    }

    steps.push({
      line: 15,
      explanation: `Maximum k-sum pair operations = ${ops}.`,
      variables: { result: ops },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maxNumberOfKSumPairsSliding;
