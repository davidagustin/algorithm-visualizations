import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSubarrayDivideConquer: AlgorithmDefinition = {
  id: 'maximum-subarray-divide-conquer',
  title: 'Maximum Subarray (Divide and Conquer)',
  leetcodeNumber: 53,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Find the maximum sum subarray using divide and conquer. Split the array in half, recursively find the max subarray in each half, and find the max crossing subarray (spans both halves). The maximum of these three is the answer. Time complexity: O(n log n).',
  tags: ['Divide and Conquer', 'Array', 'Dynamic Programming'],
  code: {
    pseudocode: `function maxSubArray(nums, lo, hi):
  if lo == hi: return nums[lo]
  mid = (lo + hi) // 2
  leftMax = maxSubArray(nums, lo, mid)
  rightMax = maxSubArray(nums, mid+1, hi)
  crossMax = maxCrossing(nums, lo, mid, hi)
  return max(leftMax, rightMax, crossMax)

maxCrossing(nums, lo, mid, hi):
  leftSum = -inf, sum = 0
  for i from mid down to lo:
    sum += nums[i]; leftSum = max(leftSum, sum)
  rightSum = -inf, sum = 0
  for i from mid+1 to hi:
    sum += nums[i]; rightSum = max(rightSum, sum)
  return leftSum + rightSum`,
    python: `def maxSubArray(nums):
    def divide(lo, hi):
        if lo == hi: return nums[lo]
        mid = (lo+hi)//2
        leftMax = divide(lo, mid)
        rightMax = divide(mid+1, hi)
        # crossing
        s = leftSum = 0; leftSum = -float('inf')
        for i in range(mid,-1,-1): s+=nums[i]; leftSum=max(leftSum,s)
        s = rightSum = 0; rightSum = -float('inf')
        for i in range(mid+1,hi+1): s+=nums[i]; rightSum=max(rightSum,s)
        return max(leftMax, rightMax, leftSum+rightSum)
    return divide(0, len(nums)-1)`,
    javascript: `function maxSubArray(nums) {
  function divide(lo, hi) {
    if (lo===hi) return nums[lo];
    const mid=(lo+hi)>>1;
    const lm=divide(lo,mid), rm=divide(mid+1,hi);
    let s=0, ls=-Infinity;
    for(let i=mid;i>=lo;i--){s+=nums[i];ls=Math.max(ls,s);}
    s=0; let rs=-Infinity;
    for(let i=mid+1;i<=hi;i++){s+=nums[i];rs=Math.max(rs,s);}
    return Math.max(lm,rm,ls+rs);
  }
  return divide(0,nums.length-1);
}`,
    java: `public int maxSubArray(int[] nums) {
    return divide(nums, 0, nums.length-1);
}
int divide(int[] a, int lo, int hi) {
    if(lo==hi) return a[lo];
    int mid=(lo+hi)/2;
    int lm=divide(a,lo,mid),rm=divide(a,mid+1,hi);
    int s=0,ls=Integer.MIN_VALUE;
    for(int i=mid;i>=lo;i--){s+=a[i];ls=Math.max(ls,s);}
    s=0;int rs=Integer.MIN_VALUE;
    for(int i=mid+1;i<=hi;i++){s+=a[i];rs=Math.max(rs,s);}
    return Math.max(Math.max(lm,rm),ls+rs);
}`,
  },
  defaultInput: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      placeholder: '-2,1,-3,4,-1,2,1,-5,4',
      helperText: 'Input array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, maxSum: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Max Subarray (Divide & Conquer)',
          entries: [{ key: 'Max Sum Found', value: String(maxSum) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Divide and conquer approach. Split [0..${n - 1}] at mid, solve each half, find crossing max.`,
      variables: { n },
      visualization: makeViz({}, {}, -Infinity),
    });

    let globalMax = -Infinity;
    let bestStart = 0, bestEnd = 0;

    function divide(lo: number, hi: number): number {
      if (lo === hi) {
        if (nums[lo] > globalMax) { globalMax = nums[lo]; bestStart = lo; bestEnd = lo; }
        const h: Record<number, string> = { [lo]: 'active' };
        steps.push({
          line: 2,
          explanation: `Base case: single element nums[${lo}]=${nums[lo]}. Return ${nums[lo]}.`,
          variables: { lo, hi, value: nums[lo] },
          visualization: makeViz(h, { [lo]: String(nums[lo]) }, globalMax),
        });
        return nums[lo];
      }

      const mid = (lo + hi) >> 1;
      const h: Record<number, string> = {};
      for (let i = lo; i <= mid; i++) h[i] = 'pointer';
      for (let i = mid + 1; i <= hi; i++) h[i] = 'active';
      steps.push({
        line: 3,
        explanation: `Split [${lo}..${hi}] at mid=${mid}. Left: [${lo}..${mid}], Right: [${mid + 1}..${hi}].`,
        variables: { lo, hi, mid },
        visualization: makeViz(h, { [mid]: 'mid', [lo]: 'L', [hi]: 'R' }, globalMax),
      });

      const leftMax = divide(lo, mid);
      const rightMax = divide(mid + 1, hi);

      // Crossing sum
      let s = 0, ls = -Infinity, lIdx = mid;
      for (let i = mid; i >= lo; i--) {
        s += nums[i];
        if (s > ls) { ls = s; lIdx = i; }
      }
      s = 0;
      let rs = -Infinity, rIdx = mid + 1;
      for (let i = mid + 1; i <= hi; i++) {
        s += nums[i];
        if (s > rs) { rs = s; rIdx = i; }
      }
      const crossMax = ls + rs;

      const best = Math.max(leftMax, rightMax, crossMax);
      if (best === crossMax && crossMax > globalMax) {
        globalMax = crossMax;
        bestStart = lIdx;
        bestEnd = rIdx;
      }

      const ch: Record<number, string> = {};
      for (let i = lIdx; i <= rIdx; i++) ch[i] = 'found';
      steps.push({
        line: 6,
        explanation: `[${lo}..${hi}]: leftMax=${leftMax}, rightMax=${rightMax}, crossMax=${crossMax}. Best=${best}.`,
        variables: { lo, hi, mid, leftMax, rightMax, crossMax, result: best },
        visualization: makeViz(ch, { [lIdx]: 'L', [rIdx]: 'R' }, globalMax),
      });

      return best;
    }

    const result = divide(0, n - 1);

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = i >= bestStart && i <= bestEnd ? 'match' : 'visited';
    steps.push({
      line: 8,
      explanation: `Divide & Conquer complete. Maximum subarray sum = ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, { [bestStart]: 'S', [bestEnd]: 'E' }, result),
    });

    return steps;
  },
};

export default maximumSubarrayDivideConquer;
