import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reversePairsIi: AlgorithmDefinition = {
  id: 'reverse-pairs-ii',
  title: 'Reverse Pairs II',
  leetcodeNumber: 493,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums, return the number of reverse pairs. A reverse pair is (i, j) where i < j and nums[i] > 2 * nums[j]. Uses modified merge sort to count pairs during the merge step in O(n log n) time.',
  tags: ['Merge Sort', 'Binary Indexed Tree', 'Divide and Conquer'],
  code: {
    pseudocode: `function reversePairs(nums):
  count = 0
  mergeSort(nums):
    if len <= 1: return
    mid = len // 2
    mergeSort(left half)
    mergeSort(right half)
    j = mid
    for i in left half:
      while j < len and nums[i] > 2*nums[j]:
        j++
      count += j - mid
    merge left and right halves
  return count`,
    python: `def reversePairs(nums):
    count = 0
    def merge(arr):
        nonlocal count
        if len(arr) <= 1: return arr
        mid = len(arr)//2
        left = merge(arr[:mid])
        right = merge(arr[mid:])
        j = 0
        for i in range(len(left)):
            while j < len(right) and left[i] > 2*right[j]:
                j += 1
            count += j
        return sorted(left + right)
    merge(nums)
    return count`,
    javascript: `function reversePairs(nums) {
  let count = 0;
  function merge(arr) {
    if (arr.length <= 1) return arr;
    const mid = arr.length>>1;
    const left = merge(arr.slice(0, mid));
    const right = merge(arr.slice(mid));
    let j = 0;
    for (let i=0; i<left.length; i++) {
      while (j<right.length && left[i]>2*right[j]) j++;
      count += j;
    }
    return [...left,...right].sort((a,b)=>a-b);
  }
  merge(nums);
  return count;
}`,
    java: `public int reversePairs(int[] nums) {
    return mergeCount(nums, 0, nums.length-1);
}
int mergeCount(int[] a, int lo, int hi) {
    if (lo>=hi) return 0;
    int mid=(lo+hi)/2, cnt=mergeCount(a,lo,mid)+mergeCount(a,mid+1,hi);
    int j=mid+1;
    for (int i=lo;i<=mid;i++) {
        while (j<=hi && (long)a[i]>2L*a[j]) j++;
        cnt+=j-(mid+1);
    }
    Arrays.sort(a,lo,hi+1);
    return cnt;
}`,
  },
  defaultInput: { nums: [1, 3, 2, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 2, 3, 1],
      placeholder: '1,3,2,3,1',
      helperText: 'Input array for counting reverse pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, count: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Reverse Pairs (nums[i] > 2*nums[j], i<j)',
          entries: [{ key: 'Pairs Found', value: String(count) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count reverse pairs (i<j, nums[i] > 2*nums[j]). Array: [${nums.join(', ')}]. Use merge sort.`,
      variables: { n },
      visualization: makeViz({}, {}, 0),
    });

    let count = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const isReverse = nums[i] > 2 * nums[j];
        const h: Record<number, string> = { [i]: isReverse ? 'found' : 'comparing', [j]: isReverse ? 'match' : 'active' };
        const l: Record<number, string> = { [i]: 'i', [j]: 'j' };
        if (isReverse) {
          count++;
          steps.push({
            line: 8,
            explanation: `Pair (${i},${j}): nums[${i}]=${nums[i]} > 2*nums[${j}]=${2 * nums[j]}. Reverse pair! Count = ${count}.`,
            variables: { i, j, numsI: nums[i], numsJ: nums[j], twoNumsJ: 2 * nums[j], count },
            visualization: makeViz(h, l, count),
          });
        } else if (steps.length < 20) {
          steps.push({
            line: 8,
            explanation: `Pair (${i},${j}): nums[${i}]=${nums[i]} <= 2*nums[${j}]=${2 * nums[j]}. Not a reverse pair.`,
            variables: { i, j, numsI: nums[i], numsJ: nums[j], twoNumsJ: 2 * nums[j], count },
            visualization: makeViz(h, l, count),
          });
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 12,
      explanation: `Done. Total reverse pairs = ${count}. In production, merge sort gives O(n log n).`,
      variables: { result: count },
      visualization: makeViz(finalH, {}, count),
    });

    return steps;
  },
};

export default reversePairsIi;
