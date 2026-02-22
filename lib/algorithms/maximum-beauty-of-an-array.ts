import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumBeautyOfAnArray: AlgorithmDefinition = {
  id: 'maximum-beauty-of-an-array',
  title: 'Maximum Beauty of an Array After Applying Operation',
  leetcodeNumber: 2779,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a 0-indexed array nums and a non-negative integer k, perform operations to make elements equal within range [nums[i]-k, nums[i]+k]. The beauty is the length of the longest subsequence of equal values. Sort and use sliding window where the window is valid if max - min <= 2*k.',
  tags: ['sliding window', 'sorting', 'array'],

  code: {
    pseudocode: `function maximumBeauty(nums, k):
  sort(nums)
  left = 0
  result = 0
  for right in range(len(nums)):
    while nums[right] - nums[left] > 2 * k:
      left++
    result = max(result, right - left + 1)
  return result`,

    python: `def maximumBeauty(nums: list[int], k: int) -> int:
    nums.sort()
    left = 0
    result = 0
    for right in range(len(nums)):
        while nums[right] - nums[left] > 2 * k:
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function maximumBeauty(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (nums[right] - nums[left] > 2 * k) left++;
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int maximumBeauty(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        while (nums[right] - nums[left] > 2 * k) left++;
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [4, 6, 1, 2],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 6, 1, 2],
      placeholder: '4,6,1,2',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Range k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Each element can be replaced by any value in [nums[i]-k, nums[i]+k]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numsRaw = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const nums = [...numsRaw].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sort array: [${nums.join(', ')}]. With range k=${k}, two elements can match if their difference <= 2*k = ${2 * k}.`,
      variables: { sorted: nums.join(','), k, maxDiff: 2 * k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let left = 0;
    let result = 0;

    for (let right = 0; right < nums.length; right++) {
      while (nums[right] - nums[left] > 2 * k) {
        steps.push({
          line: 5,
          explanation: `nums[${right}] - nums[${left}] = ${nums[right]} - ${nums[left]} = ${nums[right] - nums[left]} > ${2 * k}. Shrink window from left.`,
          variables: { left, right, diff: nums[right] - nums[left], maxDiff: 2 * k },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'sorted', [right]: 'active' },
            labels: { [left]: 'L--', [right]: 'R' },
          } as ArrayVisualization,
        });
        left++;
      }

      const windowSize = right - left + 1;
      if (windowSize > result) result = windowSize;

      steps.push({
        line: 7,
        explanation: `Window [${left}..${right}]: nums[${left}]=${nums[left]}, nums[${right}]=${nums[right]}, diff=${nums[right] - nums[left]} <= ${2 * k}. Size=${windowSize}. Best=${result}.`,
        variables: { left, right, windowSize, result, diff: nums[right] - nums[left] },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: windowSize }, (_, i) => [left + i, 'active'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Maximum beauty = ${result}. A subsequence of ${result} elements can all be made equal.`,
      variables: { result },
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

export default maximumBeautyOfAnArray;
