import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countOfRangeSum: AlgorithmDefinition = {
  id: 'count-of-range-sum',
  title: 'Count of Range Sum',
  leetcodeNumber: 327,
  difficulty: 'Hard',
  category: 'Prefix Sum',
  description:
    'Count the number of range sums that lie in [lower, upper]. Build prefix sums, then use merge sort to count pairs (i, j) where lower <= prefix[j] - prefix[i] <= upper. During the merge step, for each left half element, use two pointers to find how many right half elements satisfy the condition.',
  tags: ['prefix sum', 'merge sort', 'divide and conquer', 'counting'],

  code: {
    pseudocode: `function countRangeSum(nums, lower, upper):
  prefix = build prefix sums (length n+1)
  return mergeCount(prefix, 0, n, lower, upper)

function mergeCount(arr, left, right, lo, hi):
  if right - left <= 1: return 0
  mid = (left + right) / 2
  count = mergeCount(arr, left, mid, lo, hi)
           + mergeCount(arr, mid, right, lo, hi)
  j = k = mid
  for each i in [left, mid):
    while j < right and arr[j] - arr[i] < lo: j++
    while k < right and arr[k] - arr[i] <= hi: k++
    count += k - j
  merge arr[left..right]
  return count`,

    python: `def countRangeSum(nums, lower, upper):
    prefix = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        prefix[i+1] = prefix[i] + n

    def merge_count(lo, hi):
        if hi - lo <= 1:
            return 0
        mid = (lo + hi) // 2
        count = merge_count(lo, mid) + merge_count(mid, hi)
        j = k = mid
        for left in prefix[lo:mid]:
            while j < hi and prefix[j] - left < lower: j += 1
            while k < hi and prefix[k] - left <= upper: k += 1
            count += k - j
        prefix[lo:hi] = sorted(prefix[lo:hi])
        return count

    return merge_count(0, len(prefix))`,

    javascript: `function countRangeSum(nums, lower, upper) {
  const prefix = [0];
  for (const n of nums) prefix.push(prefix[prefix.length-1] + n);
  function mergeCount(lo, hi) {
    if (hi - lo <= 1) return 0;
    const mid = (lo + hi) >> 1;
    let count = mergeCount(lo, mid) + mergeCount(mid, hi);
    let j = mid, k = mid;
    for (let i = lo; i < mid; i++) {
      while (j < hi && prefix[j] - prefix[i] < lower) j++;
      while (k < hi && prefix[k] - prefix[i] <= upper) k++;
      count += k - j;
    }
    prefix.splice(lo, hi-lo, ...prefix.slice(lo, hi).sort((a,b) => a-b));
    return count;
  }
  return mergeCount(0, prefix.length);
}`,

    java: `public int countRangeSum(int[] nums, int lower, int upper) {
    long[] prefix = new long[nums.length + 1];
    for (int i = 0; i < nums.length; i++) prefix[i+1] = prefix[i] + nums[i];
    return mergeCount(prefix, 0, prefix.length, lower, upper);
}
int mergeCount(long[] arr, int lo, int hi, int lower, int upper) {
    if (hi - lo <= 1) return 0;
    int mid = (lo + hi) / 2;
    int count = mergeCount(arr, lo, mid, lower, upper)
              + mergeCount(arr, mid, hi, lower, upper);
    int j = mid, k = mid;
    for (int i = lo; i < mid; i++) {
        while (j < hi && arr[j] - arr[i] < lower) j++;
        while (k < hi && arr[k] - arr[i] <= upper) k++;
        count += k - j;
    }
    Arrays.sort(arr, lo, hi);
    return count;
}`,
  },

  defaultInput: {
    nums: [-2, 5, -1],
    lower: -2,
    upper: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-2, 5, -1],
      placeholder: '-2,5,-1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'lower',
      label: 'Lower Bound',
      type: 'number',
      defaultValue: -2,
      placeholder: '-2',
      helperText: 'Lower bound of valid range sum',
    },
    {
      name: 'upper',
      label: 'Upper Bound',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Upper bound of valid range sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const lower = input.lower as number;
    const upper = input.upper as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Build prefix sums for nums=[${nums.join(', ')}]. Count range sums in [${lower}, ${upper}].`,
      variables: { nums: `[${nums.join(', ')}]`, lower, upper },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    const prefix: number[] = [0];
    for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);

    steps.push({
      line: 2,
      explanation: `Prefix array: [${prefix.join(', ')}]. A range sum prefix[j]-prefix[i] is valid if in [${lower},${upper}].`,
      variables: { prefix: `[${prefix.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: {},
        labels: Object.fromEntries(prefix.map((v, i) => [i, `p[${i}]=${v}`])),
      },
    });

    // Brute force visualization for clarity
    let count = 0;
    for (let i = 0; i < prefix.length; i++) {
      for (let j = i + 1; j < prefix.length; j++) {
        const rangeSum = prefix[j] - prefix[i];
        const valid = rangeSum >= lower && rangeSum <= upper;
        if (valid) count++;

        steps.push({
          line: 9,
          explanation: `Check range [${i},${j - 1}]: prefix[${j}]-prefix[${i}]=${prefix[j]}-${prefix[i]}=${rangeSum}. In [${lower},${upper}]? ${valid}. Count=${count}.`,
          variables: { i, j, rangeSum, valid, count },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(nums.map((_, k) => [k, k >= i && k < j ? (valid ? 'found' : 'comparing') : 'default'])),
            labels: Object.fromEntries(nums.map((_, k) => [k, k >= i && k < j ? `sum=${rangeSum}` : `${nums[k]}`])),
          },
        });

        if (steps.length > 30) {
          steps.push({
            line: 10,
            explanation: `Showing ${count} valid range sums found so far (truncated for display).`,
            variables: { count },
            visualization: {
              type: 'array',
              array: [...prefix],
              highlights: {},
              labels: { 0: `Result: ${count}` },
            },
          });
          return steps;
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Total range sums in [${lower}, ${upper}]: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...prefix],
        highlights: {},
        labels: { 0: `Result: ${count}` },
      },
    });

    return steps;
  },
};

export default countOfRangeSum;
