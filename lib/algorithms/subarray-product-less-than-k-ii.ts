import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarrayProductLessThanKIi: AlgorithmDefinition = {
  id: 'subarray-product-less-than-k-ii',
  title: 'Subarray Product Less Than K II',
  leetcodeNumber: 713,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers nums and a positive integer k, return the number of contiguous subarrays where the product of all elements is strictly less than k. Uses a sliding window: expand right, shrink left when product >= k. Each valid right pointer adds (right - left + 1) new subarrays.',
  tags: ['Sliding Window', 'Two Pointers', 'Array'],
  code: {
    pseudocode: `function numSubarrayProductLessThanK(nums, k):
  if k <= 1: return 0
  count = 0, product = 1, left = 0
  for right in 0..n-1:
    product *= nums[right]
    while product >= k:
      product /= nums[left]
      left++
    count += right - left + 1
  return count`,
    python: `def numSubarrayProductLessThanK(nums, k):
    if k <= 1: return 0
    count = product = 1
    left = 0
    for right, num in enumerate(nums):
        product *= num
        while product >= k:
            product //= nums[left]
            left += 1
        count += right - left + 1
    return count`,
    javascript: `function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let count = 0, product = 1, left = 0;
  for (let right = 0; right < nums.length; right++) {
    product *= nums[right];
    while (product >= k) { product /= nums[left++]; }
    count += right - left + 1;
  }
  return count;
}`,
    java: `public int numSubarrayProductLessThanK(int[] nums, int k) {
    if (k <= 1) return 0;
    int count=0, left=0; long product=1;
    for (int right=0;right<nums.length;right++) {
        product*=nums[right];
        while (product>=k) product/=nums[left++];
        count+=right-left+1;
    }
    return count;
}`,
  },
  defaultInput: { nums: [10, 5, 2, 6], k: 100 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 5, 2, 6],
      placeholder: '10,5,2,6',
      helperText: 'Array of positive integers',
    },
    {
      name: 'k',
      label: 'k (product limit)',
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

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, count: number, product: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Product < ${k} Subarrays`,
          entries: [
            { key: 'Count', value: String(count) },
            { key: 'Window Product', value: String(product) },
            { key: 'k', value: String(k) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count subarrays with product < ${k}. Sliding window: expand right, shrink left when product >= ${k}.`,
      variables: { n, k },
      visualization: makeViz({}, {}, 0, 1),
    });

    let count = 0, product = 1, left = 0;
    for (let right = 0; right < n; right++) {
      product *= nums[right];

      while (product >= k && left <= right) {
        product = Math.floor(product / nums[left]);
        left++;
      }

      const added = right - left + 1;
      count += added;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        h[i] = i === right ? 'active' : 'pointer';
      }
      l[left] = 'L';
      l[right] = 'R';

      steps.push({
        line: 7,
        explanation: `right=${right}, left=${left}. Window product=${product} < ${k}. Added ${added} new subarrays. Total count=${count}.`,
        variables: { right, left, product, added, count },
        visualization: makeViz(h, l, count, product),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 8,
      explanation: `Done. Total subarrays with product < ${k} = ${count}.`,
      variables: { result: count },
      visualization: makeViz(finalH, {}, count, product),
    });

    return steps;
  },
};

export default subarrayProductLessThanKIi;
