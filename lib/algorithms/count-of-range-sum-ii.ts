import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfRangeSumIi: AlgorithmDefinition = {
  id: 'count-of-range-sum-ii',
  title: 'Count of Range Sum II',
  leetcodeNumber: 327,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and a range [lower, upper], return the number of range sums that lie in [lower, upper] inclusive. A range sum S(i, j) is defined as the sum of elements in nums between indices i and j. Uses merge sort on prefix sums for O(n log n) time.',
  tags: ['Binary Indexed Tree', 'Merge Sort', 'Prefix Sum', 'Divide and Conquer'],
  code: {
    pseudocode: `function countRangeSum(nums, lower, upper):
  prefix = [0] + cumulative sums
  result = 0
  mergeSort(prefix, 0, len-1):
    for each left half element sums[i]:
      find count of right half sums[j] where:
        lower <= sums[j] - sums[i] <= upper
    merge and sort
  return result`,
    python: `def countRangeSum(nums, lower, upper):
    prefix = [0]
    for n in nums:
        prefix.append(prefix[-1] + n)
    count = 0
    def merge(lo, hi):
        nonlocal count
        if hi - lo <= 0: return
        mid = (lo + hi) // 2
        merge(lo, mid); merge(mid+1, hi)
        j = k = mid + 1
        for i in range(lo, mid+1):
            while j <= hi and prefix[j] - prefix[i] < lower: j += 1
            while k <= hi and prefix[k] - prefix[i] <= upper: k += 1
            count += k - j
        prefix[lo:hi+1] = sorted(prefix[lo:hi+1])
    merge(0, len(prefix)-1)
    return count`,
    javascript: `function countRangeSum(nums, lower, upper) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length-1] + n);
  let count = 0;
  function merge(lo, hi) {
    if (hi - lo <= 0) return;
    const mid = (lo+hi)>>1;
    merge(lo, mid); merge(mid+1, hi);
    let j=mid+1, k=mid+1;
    for (let i=lo; i<=mid; i++) {
      while (j<=hi && prefix[j]-prefix[i]<lower) j++;
      while (k<=hi && prefix[k]-prefix[i]<=upper) k++;
      count += k-j;
    }
    prefix.splice(lo, hi-lo+1, ...prefix.slice(lo,hi+1).sort((a,b)=>a-b));
  }
  merge(0, prefix.length-1);
  return count;
}`,
    java: `public int countRangeSum(int[] nums, int lower, int upper) {
    long[] prefix = new long[nums.length+1];
    for (int i=0;i<nums.length;i++) prefix[i+1]=prefix[i]+nums[i];
    return mergeCount(prefix, 0, prefix.length, lower, upper);
}
int mergeCount(long[] a, int lo, int hi, int lower, int upper) {
    if (hi-lo<=1) return 0;
    int mid=(lo+hi)/2, cnt=mergeCount(a,lo,mid,lower,upper)+mergeCount(a,mid,hi,lower,upper);
    int j=mid,k=mid;
    for (int i=lo;i<mid;i++) {
        while (j<hi && a[j]-a[i]<lower) j++;
        while (k<hi && a[k]-a[i]<=upper) k++;
        cnt+=k-j;
    }
    Arrays.sort(a, lo, hi);
    return cnt;
}`,
  },
  defaultInput: { nums: [-2, 5, -1], lower: -2, upper: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-2, 5, -1],
      placeholder: '-2,5,-1',
      helperText: 'Input array',
    },
    {
      name: 'lower',
      label: 'Lower Bound',
      type: 'number',
      defaultValue: -2,
      placeholder: '-2',
      helperText: 'Lower bound of range sum',
    },
    {
      name: 'upper',
      label: 'Upper Bound',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Upper bound of range sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const lower = input.lower as number;
    const upper = input.upper as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const prefix = [0];
    for (const num of nums) prefix.push(prefix[prefix.length - 1] + num);

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, count: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Count of Range Sum',
          entries: [
            { key: 'Range', value: `[${lower}, ${upper}]` },
            { key: 'Prefix Sums', value: prefix.join(', ') },
            { key: 'Valid Count', value: String(count) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count subarrays with sum in [${lower}, ${upper}]. Build prefix sums, then use merge sort to count valid pairs.`,
      variables: { n, lower, upper },
      visualization: makeViz({}, {}, 0),
    });

    const pfHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) pfHighlights[i] = 'visited';
    steps.push({
      line: 2,
      explanation: `Prefix sums: [${prefix.join(', ')}]. Range sum S(i,j) = prefix[j+1] - prefix[i].`,
      variables: { prefix: [...prefix] },
      visualization: makeViz(pfHighlights, {}, 0),
    });

    let count = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const rangeSum = prefix[j + 1] - prefix[i];
        if (rangeSum >= lower && rangeSum <= upper) {
          count++;
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          for (let k = i; k <= j; k++) { h[k] = 'found'; l[k] = k === i ? 'S' : k === j ? 'E' : ''; }
          steps.push({
            line: 7,
            explanation: `Subarray [${i}..${j}] sum = ${rangeSum} ∈ [${lower}, ${upper}]. Count = ${count}.`,
            variables: { i, j, rangeSum, count },
            visualization: makeViz(h, l, count),
          });
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 9,
      explanation: `Done. Total subarrays with sum in [${lower}, ${upper}] = ${count}.`,
      variables: { result: count },
      visualization: makeViz(finalH, {}, count),
    });

    return steps;
  },
};

export default countOfRangeSumIi;
