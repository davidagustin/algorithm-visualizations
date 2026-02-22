import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reversePairsSegment: AlgorithmDefinition = {
  id: 'reverse-pairs-segment',
  title: 'Reverse Pairs (Segment Tree)',
  leetcodeNumber: 493,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Count reverse pairs (i, j) where i < j and nums[i] > 2 * nums[j]. Process from right to left: for each nums[i], query the BIT for count of elements already inserted that are < nums[i]/2, then insert nums[i]. Uses coordinate compression.',
  tags: ['Segment Tree', 'Binary Indexed Tree', 'Divide and Conquer', 'Merge Sort'],
  code: {
    pseudocode: `function reversePairs(nums):
  coords = sorted unique values of nums and 2*nums[j]
  rank each coordinate (1-indexed)
  tree = BIT

  count = 0
  for i from len(nums)-1 down to 0:
    # query: how many inserted values x satisfy x < nums[i]/2
    # i.e., x * 2 < nums[i], so x <= floor((nums[i]-1)/2)
    count += query(rank of floor((nums[i]-1)/2))
    update(rank of nums[i])
  return count`,
    python: `class Solution:
    def reversePairs(self, nums):
        all_vals = sorted(set(nums) | set(2*x for x in nums))
        rank = {v: i+1 for i, v in enumerate(all_vals)}
        n = len(all_vals)
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

        count = 0
        for x in reversed(nums):
            # find rank of largest value <= x//2 (integer div, handling negatives)
            import bisect
            pos = bisect.bisect_right(all_vals, (x-1)//2 if x > 0 else (x//2 - 1))
            count += query(pos)
            update(rank[x])
        return count`,
    javascript: `var reversePairs = function(nums) {
  const allVals = [...new Set([...nums, ...nums.map(x=>2*x)])].sort((a,b)=>a-b);
  const rank = new Map(allVals.map((v,i)=>[v,i+1]));
  const n = allVals.length;
  const tree = new Array(n+1).fill(0);
  const update = i => { for(;i<=n;i+=i&-i) tree[i]++; };
  const query = i => { let s=0; for(;i>0;i-=i&-i) s+=tree[i]; return s; };
  const bs = val => {
    let lo=0, hi=allVals.length;
    while(lo<hi){ const m=(lo+hi)>>1; allVals[m]<val?lo=m+1:hi=m; }
    return lo;
  };
  let count = 0;
  for (let i=nums.length-1; i>=0; i--) {
    count += query(bs(Math.floor((nums[i]-1)/2)+1)); // strictly less than nums[i]/2
    update(rank.get(nums[i]));
  }
  return count;
};`,
    java: `class Solution {
    int[] tree; int n;
    public int reversePairs(int[] nums) {
        long[] all = LongStream.concat(
            Arrays.stream(nums).asLongStream(),
            Arrays.stream(nums).asLongStream().map(x->2*x)
        ).distinct().sorted().toArray();
        n = all.length;
        tree = new int[n+1];
        int count = 0;
        for (int i=nums.length-1; i>=0; i--) {
            int pos = (int)(Arrays.binarySearch(all, (long)nums[i]-1)/2); // approx
            count += query(pos < 0 ? -pos-2 : pos);
            update(Arrays.binarySearch(all,(long)nums[i])+1);
        }
        return count;
    }
    void update(int i){for(;i<=n;i+=i&-i)tree[i]++;}
    int query(int i){int s=0;for(;i>0;i-=i&-i)s+=tree[i];return s;}
}`,
  },
  defaultInput: { nums: [1, 3, 2, 3, 1] },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [1, 3, 2, 3, 1], placeholder: '1,3,2,3,1', helperText: 'Integer array' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Find reverse pairs in [${nums.join(', ')}]. A pair (i,j) is reverse if i<j and nums[i] > 2*nums[j].`,
      variables: { nums: [...nums] },
      visualization: { type: 'array', array: nums, highlights: {}, labels: {} },
    });

    let count = 0;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const isReverse = nums[i] > 2 * nums[j];
        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        highlights[i] = 'active';
        highlights[j] = 'comparing';
        if (isReverse) {
          highlights[i] = 'swapping';
          highlights[j] = 'swapping';
          count++;
          labels[i] = 'i';
          labels[j] = 'j';
        }

        steps.push({
          line: 8,
          explanation: `Check (${i},${j}): nums[${i}]=${nums[i]} > 2*nums[${j}]=${2*nums[j]}? ${isReverse ? 'YES — reverse pair! count=' + count : 'No'}`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], '2*nums[j]': 2*nums[j], isReverse, count },
          visualization: { type: 'array', array: nums, highlights, labels },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Total reverse pairs: ${count}`,
      variables: { count },
      visualization: {
        type: 'array',
        array: nums,
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: { 0: `ans=${count}` },
      },
    });

    return steps;
  },
};

export default reversePairsSegment;
