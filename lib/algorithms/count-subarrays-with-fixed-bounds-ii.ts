import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubarraysWithFixedBoundsIi: AlgorithmDefinition = {
  id: 'count-subarrays-with-fixed-bounds-ii',
  title: 'Count Subarrays with Fixed Bounds II',
  leetcodeNumber: 2444,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and two integers minK and maxK, return the number of fixed-bound subarrays. A fixed-bound subarray must contain both minK and maxK as its minimum and maximum. Track the last position of minK, maxK, and any out-of-range element to compute the count efficiently.',
  tags: ['Sliding Window', 'Array', 'Queue'],
  code: {
    pseudocode: `function countSubarrays(nums, minK, maxK):
  result = 0
  minPos = maxPos = -1
  leftBound = -1
  for i in 0..n-1:
    if nums[i] < minK or nums[i] > maxK:
      leftBound = i
    if nums[i] == minK: minPos = i
    if nums[i] == maxK: maxPos = i
    result += max(0, min(minPos, maxPos) - leftBound)
  return result`,
    python: `def countSubarrays(nums, minK, maxK):
    result = 0
    min_pos = max_pos = left_bound = -1
    for i, num in enumerate(nums):
        if num < minK or num > maxK:
            left_bound = i
        if num == minK:
            min_pos = i
        if num == maxK:
            max_pos = i
        result += max(0, min(min_pos, max_pos) - left_bound)
    return result`,
    javascript: `function countSubarrays(nums, minK, maxK) {
  let result=0, minPos=-1, maxPos=-1, leftBound=-1;
  for (let i=0;i<nums.length;i++) {
    if (nums[i]<minK||nums[i]>maxK) leftBound=i;
    if (nums[i]===minK) minPos=i;
    if (nums[i]===maxK) maxPos=i;
    result+=Math.max(0,Math.min(minPos,maxPos)-leftBound);
  }
  return result;
}`,
    java: `public long countSubarrays(int[] nums, int minK, int maxK) {
    long result=0; int minPos=-1,maxPos=-1,leftBound=-1;
    for (int i=0;i<nums.length;i++) {
        if (nums[i]<minK||nums[i]>maxK) leftBound=i;
        if (nums[i]==minK) minPos=i;
        if (nums[i]==maxK) maxPos=i;
        result+=Math.max(0,Math.min(minPos,maxPos)-leftBound);
    }
    return result;
}`,
  },
  defaultInput: { nums: [1, 3, 5, 2, 7, 5], minK: 1, maxK: 5 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5, 2, 7, 5],
      placeholder: '1,3,5,2,7,5',
      helperText: 'Input array',
    },
    {
      name: 'minK',
      label: 'minK',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Required minimum value',
    },
    {
      name: 'maxK',
      label: 'maxK',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Required maximum value',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const minK = input.minK as number;
    const maxK = input.maxK as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, result: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Fixed Bound Subarrays [${minK}, ${maxK}]`,
          entries: [{ key: 'Count', value: String(result) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count subarrays where min=${minK} and max=${maxK}. Track lastMinPos, lastMaxPos, leftBound.`,
      variables: { n, minK, maxK },
      visualization: makeViz({}, {}, 0),
    });

    let result = 0, minPos = -1, maxPos = -1, leftBound = -1;
    for (let i = 0; i < n; i++) {
      const num = nums[i];
      const outOfRange = num < minK || num > maxK;

      if (outOfRange) leftBound = i;
      if (num === minK) minPos = i;
      if (num === maxK) maxPos = i;

      const added = Math.max(0, Math.min(minPos, maxPos) - leftBound);
      result += added;

      const h: Record<number, string> = { [i]: outOfRange ? 'mismatch' : num === minK || num === maxK ? 'found' : 'active' };
      const l: Record<number, string> = { [i]: outOfRange ? 'OOB' : num === minK ? 'mn' : num === maxK ? 'mx' : '' };

      steps.push({
        line: 8,
        explanation: `i=${i}: num=${num}${outOfRange ? ' (out of range, reset leftBound)' : ''}. minPos=${minPos}, maxPos=${maxPos}, leftBound=${leftBound}. Added ${added} subarrays. Total=${result}.`,
        variables: { i, num, minPos, maxPos, leftBound, added, result },
        visualization: makeViz(h, l, result),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 10,
      explanation: `Done. Total fixed-bound subarrays with min=${minK} and max=${maxK}: ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, {}, result),
    });

    return steps;
  },
};

export default countSubarraysWithFixedBoundsIi;
