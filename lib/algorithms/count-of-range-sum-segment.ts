import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfRangeSumSegment: AlgorithmDefinition = {
  id: 'count-of-range-sum-segment',
  title: 'Count of Range Sum (Segment Tree)',
  leetcodeNumber: 327,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Count the number of range sums that lie in [lower, upper]. Compute prefix sums, then for each prefix[i] count how many previous prefix[j] satisfy lower <= prefix[i] - prefix[j] <= upper. Use a segment tree on coordinate-compressed prefix sums.',
  tags: ['Segment Tree', 'Divide and Conquer', 'Prefix Sum', 'Merge Sort'],
  code: {
    pseudocode: `function countRangeSum(nums, lower, upper):
  prefix = [0] + cumulative sums of nums
  sorted_unique = sorted unique values of prefix
  coordinate compress prefix values

  count = 0
  for i from 0 to n:
    # query: how many j < i have lower <= prefix[i] - prefix[j] <= upper
    # i.e., prefix[i] - upper <= prefix[j] <= prefix[i] - lower
    count += segTree.query(prefix[i]-upper, prefix[i]-lower)
    segTree.update(prefix[i], +1)
  return count`,
    python: `class Solution:
    def countRangeSum(self, nums, lower, upper):
        from sortedcontainers import SortedList
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)
        # coordinate compression
        coords = sorted(set(prefix))
        rank = {v: i+1 for i, v in enumerate(coords)}
        n = len(coords)
        tree = [0] * (n + 1)

        def update(i):
            while i <= n:
                tree[i] += 1
                i += i & (-i)

        def query(i):
            s = 0
            while i > 0:
                s += tree[i]
                i -= i & (-i)
            return s

        def range_query(l, r):
            lo = bisect_left(coords, l)
            hi = bisect_right(coords, r) - 1
            if lo > hi: return 0
            return query(hi+1) - query(lo)

        count = 0
        for p in prefix:
            lo = bisect_left(coords, p - upper)
            hi = bisect_right(coords, p - lower) - 1
            if lo <= hi:
                count += query(hi+1) - query(lo)
            update(rank[p])
        return count`,
    javascript: `var countRangeSum = function(nums, lower, upper) {
  const prefix = [0];
  for (const x of nums) prefix.push(prefix[prefix.length-1] + x);
  const coords = [...new Set(prefix)].sort((a,b) => a-b);
  const rank = new Map(coords.map((v,i) => [v, i+1]));
  const n = coords.length;
  const tree = new Array(n+1).fill(0);
  const update = i => { for (; i <= n; i += i & -i) tree[i]++; };
  const query = i => { let s = 0; for (; i > 0; i -= i & -i) s += tree[i]; return s; };
  const bs = (arr, val, left) => {
    let lo = 0, hi = arr.length;
    while (lo < hi) {
      const mid = (lo+hi)>>1;
      if (arr[mid] < val || (!left && arr[mid] <= val)) lo = mid+1; else hi = mid;
    }
    return lo;
  };
  let count = 0;
  for (const p of prefix) {
    const lo = bs(coords, p - upper, true);
    const hi = bs(coords, p - lower, false) - 1;
    if (lo <= hi) count += query(hi+1) - query(lo);
    update(rank.get(p));
  }
  return count;
};`,
    java: `class Solution {
    public int countRangeSum(int[] nums, int lower, int upper) {
        long[] prefix = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) prefix[i+1] = prefix[i] + nums[i];
        long[] sorted = Arrays.stream(prefix).distinct().sorted().toArray();
        int n = sorted.length;
        int[] tree = new int[n + 1];
        int count = 0;
        for (long p : prefix) {
            int lo = lowerBound(sorted, p - upper);
            int hi = upperBound(sorted, p - lower);
            count += query(tree, hi) - query(tree, lo - 1);
            update(tree, n, lowerBound(sorted, p) + 1);
        }
        return count;
    }
    // BIT helpers omitted for brevity
}`,
  },
  defaultInput: { nums: [-2, 5, -1], lower: -2, upper: 2 },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [-2, 5, -1], placeholder: '-2,5,-1', helperText: 'Integer array' },
    { name: 'lower', label: 'Lower Bound', type: 'number', defaultValue: -2 },
    { name: 'upper', label: 'Upper Bound', type: 'number', defaultValue: 2 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const lower = input.lower as number;
    const upper = input.upper as number;
    const steps: AlgorithmStep[] = [];

    const prefix: number[] = [0];
    for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);

    steps.push({
      line: 1,
      explanation: `Compute prefix sums: [${prefix.join(', ')}]. Range target: [${lower}, ${upper}]`,
      variables: { prefix: [...prefix], lower, upper },
      visualization: { type: 'array', array: prefix, highlights: { 0: 'active' }, labels: { 0: 'p[0]=0' } },
    });

    let count = 0;
    const seen: number[] = [];

    for (let i = 0; i < prefix.length; i++) {
      const p = prefix[i];
      const lo = p - upper;
      const hi = p - lower;
      const inRange = seen.filter(v => v >= lo && v <= hi);
      count += inRange.length;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      prefix.forEach((_, idx) => {
        highlights[idx] = 'visited';
      });
      highlights[i] = 'active';
      labels[i] = `p=${p}`;

      steps.push({
        line: 8,
        explanation: `prefix[${i}]=${p}: count prev prefix j where ${lo} <= prefix[j] <= ${hi}. Found ${inRange.length}. Total count=${count}`,
        variables: { i, p, lo, hi, found: inRange.length, totalCount: count },
        visualization: { type: 'array', array: prefix, highlights, labels },
      });

      seen.push(p);
    }

    steps.push({
      line: 10,
      explanation: `Total range sums in [${lower}, ${upper}]: ${count}`,
      variables: { count },
      visualization: {
        type: 'array',
        array: prefix,
        highlights: Object.fromEntries(prefix.map((_, i) => [i, 'found'])),
        labels: { 0: `ans=${count}` },
      },
    });

    return steps;
  },
};

export default countOfRangeSumSegment;
