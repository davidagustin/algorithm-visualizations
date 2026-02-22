import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarrayProductLessThanK: AlgorithmDefinition = {
  id: 'subarray-product-less-than-k',
  title: 'Subarray Product Less Than K',
  leetcodeNumber: 713,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of integers nums and an integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k. Use a sliding window where you expand right and shrink left when product >= k.',
  tags: ['sliding window', 'array', 'two pointers'],

  code: {
    pseudocode: `function numSubarrayProductLessThanK(nums, k):
  if k <= 1: return 0
  product = 1
  result = 0
  left = 0
  for right in range(len(nums)):
    product *= nums[right]
    while product >= k:
      product //= nums[left]
      left++
    result += right - left + 1
  return result`,

    python: `def numSubarrayProductLessThanK(nums: list[int], k: int) -> int:
    if k <= 1:
        return 0
    product = 1
    result = 0
    left = 0
    for right in range(len(nums)):
        product *= nums[right]
        while product >= k:
            product //= nums[left]
            left += 1
        result += right - left + 1
    return result`,

    javascript: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let product = 1, result = 0, left = 0;
  for (let right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= k) {
      product /= nums[left++];
    }
    result += right - left + 1;
  }
  return result;
}`,

    java: `public int numSubarrayProductLessThanK(int[] nums, int k) {
    if (k <= 1) return 0;
    int product = 1, result = 0, left = 0;
    for (int right = 0; right < nums.length; right++) {
        product *= nums[right];
        while (product >= k) product /= nums[left++];
        result += right - left + 1;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [10, 5, 2, 6],
    k: 100,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 5, 2, 6],
      placeholder: '10,5,2,6',
      helperText: 'Comma-separated positive integers',
    },
    {
      name: 'k',
      label: 'Product Limit k',
      type: 'number',
      defaultValue: 100,
      placeholder: '100',
      helperText: 'Product must be strictly less than k',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    if (k <= 1) {
      steps.push({
        line: 2,
        explanation: `k = ${k} <= 1. All products of positive integers are >= 1, so no valid subarrays. Return 0.`,
        variables: { result: 0 },
        visualization: { type: 'array', array: [...nums], highlights: {}, labels: {} } as ArrayVisualization,
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Count subarrays with product < ${k}. Expand right, shrink left when product >= ${k}. Each window position adds (right - left + 1) subarrays.`,
      variables: { k, result: 0, product: 1 },
      visualization: { type: 'array', array: [...nums], highlights: {}, labels: {} } as ArrayVisualization,
    });

    let product = 1;
    let result = 0;
    let left = 0;

    for (let right = 0; right < n; right++) {
      product *= nums[right];

      steps.push({
        line: 6,
        explanation: `Expand right to ${right} (value ${nums[right]}). Product = ${product}.`,
        variables: { right, value: nums[right], product, left },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'active'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });

      while (product >= k) {
        steps.push({
          line: 8,
          explanation: `Product ${product} >= ${k}. Shrink: divide by nums[${left}]=${nums[left]}. New product = ${product / nums[left]}.`,
          variables: { left, right, product, removing: nums[left] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [left]: 'mismatch', [right]: 'active' },
            labels: { [left]: 'L--', [right]: 'R' },
          } as ArrayVisualization,
        });
        product = Math.round(product / nums[left]);
        left++;
      }

      const added = right - left + 1;
      result += added;

      steps.push({
        line: 10,
        explanation: `Window [${left}..${right}]: product=${product} < ${k}. Add ${added} subarrays (all ending at right). Total = ${result}.`,
        variables: { left, right, product, addedSubarrays: added, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'found'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 11,
      explanation: `Total subarrays with product < ${k} = ${result}.`,
      variables: { result },
      visualization: { type: 'array', array: [...nums], highlights: {}, labels: {} } as ArrayVisualization,
    });

    return steps;
  },
};

export default subarrayProductLessThanK;
