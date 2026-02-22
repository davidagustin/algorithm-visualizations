import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfRangeSumBIT: AlgorithmDefinition = {
  id: 'count-of-range-sum-bit',
  title: 'Count of Range Sum (BIT / Fenwick Tree)',
  leetcodeNumber: 327,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Count range sums in [lower, upper] using a Binary Indexed Tree (BIT). Compute prefix sums, coordinate compress them, then for each prefix[i] query the BIT for count of previous prefix[j] in [prefix[i]-upper, prefix[i]-lower].',
  tags: ['Binary Indexed Tree', 'Prefix Sum', 'Coordinate Compression'],
  code: {
    pseudocode: `function countRangeSum(nums, lower, upper):
  prefix = [0] + cumulative sums
  // coordinate compress all prefix values
  sorted_vals = sorted unique prefix values
  rank[v] = 1-indexed position in sorted_vals

  bit = BIT of size |sorted_vals|
  count = 0

  for p in prefix:
    lo = lower bound of p - upper in sorted_vals
    hi = upper bound of p - lower in sorted_vals
    count += bit.query(hi) - bit.query(lo - 1)
    bit.update(rank[p])

  return count`,
    python: `class Solution:
    def countRangeSum(self, nums, lower, upper):
        from bisect import bisect_left, bisect_right
        prefix = [0]
        for x in nums: prefix.append(prefix[-1]+x)
        vals = sorted(set(prefix))
        n = len(vals)
        bit = [0]*(n+1)
        def update(i):
            while i<=n: bit[i]+=1; i+=i&-i
        def query(i):
            s=0
            while i>0: s+=bit[i]; i-=i&-i
            return s
        count=0
        for p in prefix:
            lo=bisect_left(vals, p-upper)+1
            hi=bisect_right(vals, p-lower)
            if lo<=hi: count+=query(hi)-query(lo-1)
            update(bisect_left(vals,p)+1)
        return count`,
    javascript: `var countRangeSum = function(nums, lower, upper) {
  const prefix=[0];
  for(const x of nums) prefix.push(prefix[prefix.length-1]+x);
  const vals=[...new Set(prefix)].sort((a,b)=>a-b);
  const n=vals.length;
  const bit=new Array(n+1).fill(0);
  const update=i=>{for(;i<=n;i+=i&-i)bit[i]++;};
  const query=i=>{let s=0;for(;i>0;i-=i&-i)s+=bit[i];return s;};
  const lb=(v)=>{let lo=0,hi=vals.length;while(lo<hi){const m=(lo+hi)>>1;vals[m]<v?lo=m+1:hi=m;}return lo;};
  let count=0;
  for(const p of prefix){
    const lo=lb(p-upper)+1, hi=lb(p-lower+1);
    if(lo<=hi) count+=query(hi)-query(lo-1);
    update(lb(p)+1);
  }
  return count;
};`,
    java: `class Solution {
    int[] bit; int n;
    public int countRangeSum(int[] nums, int lower, int upper) {
        long[] p=new long[nums.length+1];
        for(int i=0;i<nums.length;i++) p[i+1]=p[i]+nums[i];
        long[] vals=LongStream.of(p).distinct().sorted().toArray();
        n=vals.length; bit=new int[n+1];
        int count=0;
        for(long x:p){
            int lo=(int)(Arrays.binarySearch(vals,x-upper));
            int hi=(int)(Arrays.binarySearch(vals,x-lower));
            // adjust for BIT 1-indexing
            count+=query(hi)-query(lo-1);
            update(Arrays.binarySearch(vals,x)+1);
        }
        return count;
    }
    void update(int i){for(;i<=n;i+=i&-i)bit[i]++;}
    int query(int i){int s=0;for(;i>0;i-=i&-i)s+=bit[i];return s;}
}`,
  },
  defaultInput: { nums: [-2, 5, -1], lower: -2, upper: 2 },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [-2, 5, -1], placeholder: '-2,5,-1' },
    { name: 'lower', label: 'Lower', type: 'number', defaultValue: -2 },
    { name: 'upper', label: 'Upper', type: 'number', defaultValue: 2 },
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
      explanation: `prefix=[${prefix.join(',')}]. For each prefix[i] count prev prefix[j] where ${lower} <= prefix[i]-prefix[j] <= ${upper}`,
      variables: { prefix: [...prefix], lower, upper },
      visualization: { type: 'array', array: prefix, highlights: { 0: 'active' }, labels: { 0: 'p[0]' } },
    });

    const vals = [...new Set(prefix)].sort((a, b) => a - b);
    const rank = new Map(vals.map((v, i) => [v, i + 1]));
    const n = vals.length;
    const bit = new Array(n + 1).fill(0);
    const updateBIT = (i: number) => { for (; i <= n; i += i & -i) bit[i]++; };
    const queryBIT = (i: number) => { let s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };
    const lowerBound = (v: number) => { let lo = 0, hi = vals.length; while (lo < hi) { const m = (lo + hi) >> 1; vals[m] < v ? lo = m + 1 : hi = m; } return lo; };

    let count = 0;

    for (let i = 0; i < prefix.length; i++) {
      const p = prefix[i];
      const loIdx = lowerBound(p - upper) + 1;
      const hiIdx = lowerBound(p - lower + 1);
      const found = loIdx <= hiIdx ? queryBIT(hiIdx) - queryBIT(loIdx - 1) : 0;
      count += found;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      prefix.forEach((_, j) => { highlights[j] = j < i ? 'visited' : j === i ? 'active' : 'default'; });
      labels[i] = `p=${p}`;

      steps.push({
        line: 12,
        explanation: `prefix[${i}]=${p}: query BIT for [${p-upper},${p-lower}] → found=${found}. Total count=${count}`,
        variables: { i, p, 'p-upper': p-upper, 'p-lower': p-lower, found, count },
        visualization: { type: 'array', array: prefix, highlights, labels },
      });

      updateBIT(rank.get(p)!);
    }

    steps.push({
      line: 14,
      explanation: `Count of range sums in [${lower},${upper}]: ${count}`,
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

export default countOfRangeSumBIT;
