import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumProductSubarrayIi: AlgorithmDefinition = {
  id: 'maximum-product-subarray-ii',
  title: 'Maximum Product Subarray II',
  leetcodeNumber: 152,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums, find a contiguous subarray that has the largest product and return its product. Track both the maximum and minimum product ending at each position because a negative number can flip min to max. Uses dynamic programming with O(n) time and O(1) space.',
  tags: ['Dynamic Programming', 'Array', 'Greedy'],
  code: {
    pseudocode: `function maxProduct(nums):
  maxProd = minProd = result = nums[0]
  for each num in nums[1:]:
    if num < 0: swap(maxProd, minProd)
    maxProd = max(num, maxProd * num)
    minProd = min(num, minProd * num)
    result = max(result, maxProd)
  return result`,
    python: `def maxProduct(nums):
    maxP = minP = res = nums[0]
    for n in nums[1:]:
        if n < 0:
            maxP, minP = minP, maxP
        maxP = max(n, maxP * n)
        minP = min(n, minP * n)
        res = max(res, maxP)
    return res`,
    javascript: `function maxProduct(nums) {
  let maxP = nums[0], minP = nums[0], res = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    if (n < 0) [maxP, minP] = [minP, maxP];
    maxP = Math.max(n, maxP * n);
    minP = Math.min(n, minP * n);
    res = Math.max(res, maxP);
  }
  return res;
}`,
    java: `public int maxProduct(int[] nums) {
    int maxP=nums[0], minP=nums[0], res=nums[0];
    for (int i=1;i<nums.length;i++) {
        int n=nums[i];
        if (n<0){int t=maxP;maxP=minP;minP=t;}
        maxP=Math.max(n,maxP*n);
        minP=Math.min(n,minP*n);
        res=Math.max(res,maxP);
    }
    return res;
}`,
  },
  defaultInput: { nums: [2, 3, -2, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 3, -2, 4],
      placeholder: '2,3,-2,4',
      helperText: 'Input array (can contain negatives and zeros)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, maxP: number, minP: number, res: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Max Product Subarray',
          entries: [
            { key: 'Max Product', value: String(maxP) },
            { key: 'Min Product', value: String(minP) },
            { key: 'Result', value: String(res) },
          ],
        },
      };
    }

    let maxP = nums[0], minP = nums[0], res = nums[0];
    steps.push({
      line: 1,
      explanation: `Init: maxProd=${maxP}, minProd=${minP}, result=${res}. Track both max and min because negatives flip sign.`,
      variables: { maxP, minP, res },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }, maxP, minP, res),
    });

    for (let i = 1; i < n; i++) {
      const num = nums[i];
      let swapped = false;
      if (num < 0) {
        [maxP, minP] = [minP, maxP];
        swapped = true;
      }
      maxP = Math.max(num, maxP * num);
      minP = Math.min(num, minP * num);
      res = Math.max(res, maxP);

      const h: Record<number, string> = { [i]: maxP === res ? 'found' : 'active' };
      for (let k = 0; k < i; k++) h[k] = 'visited';
      steps.push({
        line: 5,
        explanation: `i=${i}, num=${num}${swapped ? ' (negative, swap max/min)' : ''}. maxP=max(${num}, prev*${num})=${maxP}, minP=${minP}, result=${res}.`,
        variables: { i, num, maxP, minP, res, swapped },
        visualization: makeViz(h, { [i]: `mx${maxP}` }, maxP, minP, res),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 8,
      explanation: `Done. Maximum product subarray = ${res}.`,
      variables: { result: res },
      visualization: makeViz(finalH, {}, maxP, minP, res),
    });

    return steps;
  },
};

export default maximumProductSubarrayIi;
