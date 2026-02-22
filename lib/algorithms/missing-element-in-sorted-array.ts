import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const missingElementInSortedArray: AlgorithmDefinition = {
  id: 'missing-element-in-sorted-array',
  title: 'Missing Element in Sorted Array',
  leetcodeNumber: 1060,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given a sorted array with no duplicates, find the k-th missing number. The number of missing integers before index i is nums[i] - nums[0] - i. Binary search for the leftmost position where missing count >= k.',
  tags: ['binary search', 'array', 'sorted'],

  code: {
    pseudocode: `function missingElement(nums, k):
  n = len(nums)
  missing(i) = nums[i] - nums[0] - i
  lo = 0, hi = n - 1
  if k > missing(n-1):
    return nums[n-1] + k - missing(n-1)
  while lo < hi - 1:
    mid = (lo + hi) / 2
    if missing(mid) >= k: hi = mid
    else: lo = mid
  return nums[lo] + k - missing(lo)`,
    python: `def missingElement(nums: list[int], k: int) -> int:
    n = len(nums)
    missing = lambda i: nums[i] - nums[0] - i
    if k > missing(n - 1):
        return nums[-1] + k - missing(n - 1)
    lo, hi = 0, n - 1
    while lo < hi - 1:
        mid = (lo + hi) // 2
        if missing(mid) >= k:
            hi = mid
        else:
            lo = mid
    return nums[lo] + k - missing(lo)`,
    javascript: `function missingElement(nums, k) {
  const n = nums.length;
  const missing = (i) => nums[i] - nums[0] - i;
  if (k > missing(n - 1)) return nums[n - 1] + k - missing(n - 1);
  let lo = 0, hi = n - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (missing(mid) >= k) hi = mid;
    else lo = mid;
  }
  return nums[lo] + k - missing(lo);
}`,
    java: `public int missingElement(int[] nums, int k) {
    int n = nums.length;
    if (k > nums[n-1] - nums[0] - (n-1)) return nums[n-1] + k - (nums[n-1] - nums[0] - (n-1));
    int lo = 0, hi = n - 1;
    while (lo < hi - 1) {
        int mid = (lo + hi) / 2;
        if (nums[mid] - nums[0] - mid >= k) hi = mid;
        else lo = mid;
    }
    return nums[lo] + k - (nums[lo] - nums[0] - lo);
}`,
  },

  defaultInput: {
    nums: [4, 7, 9, 10],
    k: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array (no duplicates)',
      type: 'array',
      defaultValue: [4, 7, 9, 10],
      placeholder: '4,7,9,10',
      helperText: 'Sorted integers with no duplicates',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Find the k-th missing positive number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const missing = (i: number) => nums[i] - nums[0] - i;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], k=${k}. missing(i) = nums[i] - nums[0] - i counts missing numbers before index i.`,
      variables: { n, k, 'missing(0)': missing(0), 'missing(n-1)': missing(n - 1) },
      visualization: makeViz(
        {},
        nums.reduce((acc, _, i) => ({ ...acc, [i]: `m=${missing(i)}` }), {})
      ),
    });

    if (k > missing(n - 1)) {
      const result = nums[n - 1] + k - missing(n - 1);
      steps.push({
        line: 5,
        explanation: `k=${k} > total missing ${missing(n - 1)}. Answer is beyond array end: ${nums[n - 1]} + ${k} - ${missing(n - 1)} = ${result}.`,
        variables: { result },
        visualization: makeViz({ [n - 1]: 'found' }, { [n - 1]: 'last' }),
      });
      return steps;
    }

    let lo = 0;
    let hi = n - 1;

    steps.push({
      line: 6,
      explanation: `Binary search: find leftmost index where missing count >= k=${k}. lo=${lo}, hi=${hi}.`,
      variables: { lo, hi, k },
      visualization: makeViz({ [lo]: 'active', [hi]: 'active' }, { [lo]: 'lo', [hi]: 'hi' }),
    });

    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      const m = missing(mid);

      steps.push({
        line: 8,
        explanation: `mid=${mid}, nums[mid]=${nums[mid]}, missing(${mid})=${m}. k=${k}.`,
        variables: { lo, mid, hi, 'missing(mid)': m, k },
        visualization: makeViz(
          { [lo]: 'active', [mid]: 'comparing', [hi]: 'active' },
          { [lo]: 'lo', [mid]: `m=${m}`, [hi]: 'hi' }
        ),
      });

      if (m >= k) {
        hi = mid;
        steps.push({
          line: 9,
          explanation: `missing(${mid})=${m} >= k=${k}. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz({ [lo]: 'active', [mid]: 'pointer' }, { [lo]: 'lo', [mid]: 'hi' }),
        });
      } else {
        lo = mid;
        steps.push({
          line: 10,
          explanation: `missing(${mid})=${m} < k=${k}. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: makeViz({ [mid]: 'pointer', [hi]: 'active' }, { [mid]: 'lo', [hi]: 'hi' }),
        });
      }
    }

    const result = nums[lo] + k - missing(lo);
    steps.push({
      line: 11,
      explanation: `Answer = nums[${lo}] + k - missing(${lo}) = ${nums[lo]} + ${k} - ${missing(lo)} = ${result}.`,
      variables: { lo, 'nums[lo]': nums[lo], 'missing(lo)': missing(lo), k, result },
      visualization: makeViz({ [lo]: 'found' }, { [lo]: `ans=${result}` }),
    });

    return steps;
  },
};

export default missingElementInSortedArray;
