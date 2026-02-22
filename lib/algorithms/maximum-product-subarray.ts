import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumProductSubarray: AlgorithmDefinition = {
  id: 'maximum-product-subarray',
  title: 'Maximum Product Subarray',
  leetcodeNumber: 152,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array, find the contiguous subarray that has the largest product and return the product. Track both the maximum and minimum product ending at each position because a negative times a negative can become the maximum.',
  tags: ['dynamic programming', 'array', 'subarray', 'product'],

  code: {
    pseudocode: `function maxProduct(nums):
  maxProd = nums[0]
  minProd = nums[0]
  result = nums[0]
  for i from 1 to length(nums)-1:
    curr = nums[i]
    candidates = (curr, maxProd*curr, minProd*curr)
    maxProd = max(candidates)
    minProd = min(candidates)
    result = max(result, maxProd)
  return result`,

    python: `def maxProduct(nums: list[int]) -> int:
    max_prod = nums[0]
    min_prod = nums[0]
    result = nums[0]
    for i in range(1, len(nums)):
        curr = nums[i]
        candidates = (curr, max_prod * curr, min_prod * curr)
        max_prod = max(candidates)
        min_prod = min(candidates)
        result = max(result, max_prod)
    return result`,

    javascript: `function maxProduct(nums) {
  let maxProd = nums[0];
  let minProd = nums[0];
  let result = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const curr = nums[i];
    const candidates = [curr, maxProd * curr, minProd * curr];
    maxProd = Math.max(...candidates);
    minProd = Math.min(...candidates);
    result = Math.max(result, maxProd);
  }
  return result;
}`,

    java: `public int maxProduct(int[] nums) {
    int maxProd = nums[0];
    int minProd = nums[0];
    int result = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int curr = nums[i];
        int temp = maxProd;
        maxProd = Math.max(curr, Math.max(maxProd * curr, minProd * curr));
        minProd = Math.min(curr, Math.min(temp * curr, minProd * curr));
        result = Math.max(result, maxProd);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 3, -2, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 3, -2, 4],
      placeholder: '2,3,-2,4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    let maxProd = nums[0];
    let minProd = nums[0];
    let result = nums[0];

    steps.push({
      line: 2,
      explanation: `Initialize maxProd = ${maxProd}, minProd = ${minProd}, result = ${result} with first element.`,
      variables: { maxProd, minProd, result, i: 0 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      },
    });

    for (let i = 1; i < nums.length; i++) {
      const curr = nums[i];
      const prevMax = maxProd;
      const prevMin = minProd;

      steps.push({
        line: 5,
        explanation: `Visiting index ${i}, value = ${curr}. Current maxProd = ${prevMax}, minProd = ${prevMin}.`,
        variables: { i, curr, maxProd: prevMax, minProd: prevMin, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'comparing' },
          labels: { [i]: 'curr' },
        },
      });

      const c1 = curr;
      const c2 = prevMax * curr;
      const c3 = prevMin * curr;
      maxProd = Math.max(c1, c2, c3);
      minProd = Math.min(c1, c2, c3);
      result = Math.max(result, maxProd);

      steps.push({
        line: 7,
        explanation: `Candidates: curr=${c1}, maxProd*curr=${c2}, minProd*curr=${c3}. New maxProd=${maxProd}, minProd=${minProd}, result=${result}.`,
        variables: { i, maxProd, minProd, result },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'found' },
          labels: { [i]: `max=${maxProd}` },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Algorithm complete. Maximum product subarray has product = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumProductSubarray;
