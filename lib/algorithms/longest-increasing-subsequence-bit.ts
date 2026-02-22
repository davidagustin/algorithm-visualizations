import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingSubsequenceBIT: AlgorithmDefinition = {
  id: 'longest-increasing-subsequence-bit',
  title: 'Longest Increasing Subsequence (BIT)',
  leetcodeNumber: 300,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Find the length of the longest strictly increasing subsequence. Use a BIT after coordinate compression: for each element x, query BIT for max LIS ending at values < x, set dp[x] = that max + 1, update BIT at rank(x) with dp[x].',
  tags: ['Binary Indexed Tree', 'Dynamic Programming', 'Binary Search'],
  code: {
    pseudocode: `function LIS(nums):
  coords = sorted unique values of nums
  rank[v] = 1-indexed position in coords
  bit = max-BIT of size |coords|

  for x in nums:
    r = rank[x]
    best = bit.queryMax(r - 1)  // best LIS ending with value < x
    dp = best + 1
    bit.updateMax(r, dp)

  return bit.queryMax(|coords|)`,
    python: `class Solution:
    def lengthOfLIS(self, nums):
        coords = sorted(set(nums))
        rank = {v:i+1 for i,v in enumerate(coords)}
        n = len(coords)
        bit = [0] * (n+1)

        def update(i, val):
            while i <= n:
                bit[i] = max(bit[i], val)
                i += i & (-i)

        def query(i):
            res = 0
            while i > 0:
                res = max(res, bit[i])
                i -= i & (-i)
            return res

        for x in nums:
            r = rank[x]
            best = query(r-1) if r > 1 else 0
            update(r, best+1)

        return query(n)`,
    javascript: `var lengthOfLIS = function(nums) {
  const coords=[...new Set(nums)].sort((a,b)=>a-b);
  const rank=new Map(coords.map((v,i)=>[v,i+1]));
  const n=coords.length;
  const bit=new Array(n+1).fill(0);
  const update=(i,v)=>{for(;i<=n;i+=i&-i)bit[i]=Math.max(bit[i],v);};
  const query=i=>{let r=0;for(;i>0;i-=i&-i)r=Math.max(r,bit[i]);return r;};
  for(const x of nums){
    const r=rank.get(x);
    const best=r>1?query(r-1):0;
    update(r,best+1);
  }
  return query(n);
};`,
    java: `class Solution {
    int[] bit; int n;
    public int lengthOfLIS(int[] nums) {
        int[] sorted=Arrays.stream(nums).distinct().sorted().toArray();
        n=sorted.length; bit=new int[n+1];
        for(int x:nums){
            int r=Arrays.binarySearch(sorted,x)+1;
            int best=r>1?query(r-1):0;
            update(r,best+1);
        }
        return query(n);
    }
    void update(int i,int v){for(;i<=n;i+=i&-i)bit[i]=Math.max(bit[i],v);}
    int query(int i){int r=0;for(;i>0;i-=i&-i)r=Math.max(r,bit[i]);return r;}
}`,
  },
  defaultInput: { nums: [10, 9, 2, 5, 3, 7, 101, 18] },
  inputFields: [
    { name: 'nums', label: 'Array', type: 'array', defaultValue: [10,9,2,5,3,7,101,18], placeholder: '10,9,2,5,3,7,101,18' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const coords = [...new Set(nums)].sort((a, b) => a - b);
    const rank = new Map(coords.map((v, i) => [v, i + 1]));
    const n = coords.length;
    const bit = new Array(n + 1).fill(0);

    const updateBIT = (i: number, v: number) => { for (; i <= n; i += i & -i) bit[i] = Math.max(bit[i], v); };
    const queryBIT = (i: number) => { let r = 0; for (; i > 0; i -= i & -i) r = Math.max(r, bit[i]); return r; };

    steps.push({
      line: 1,
      explanation: `Find LIS in [${nums.join(',')}] using max-BIT. Ranks: ${coords.map((v,i)=>`${v}→${i+1}`).join(', ')}`,
      variables: { nums: [...nums], coords },
      visualization: { type: 'array', array: nums, highlights: {}, labels: {} },
    });

    const dp: number[] = [];

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      const r = rank.get(x)!;
      const best = r > 1 ? queryBIT(r - 1) : 0;
      const dpVal = best + 1;
      dp.push(dpVal);
      updateBIT(r, dpVal);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j <= i; j++) {
        highlights[j] = j === i ? 'active' : 'visited';
        labels[j] = `dp=${dp[j]}`;
      }

      steps.push({
        line: 8,
        explanation: `nums[${i}]=${x} (rank=${r}): best LIS ending before ${x} = ${best}, dp[${i}]=${dpVal}`,
        variables: { i, x, rank: r, best, dpVal },
        visualization: { type: 'array', array: nums, highlights, labels },
      });
    }

    const ans = queryBIT(n);

    steps.push({
      line: 11,
      explanation: `LIS length: ${ans}. dp values: [${dp.join(',')}]`,
      variables: { ans, dp },
      visualization: {
        type: 'array',
        array: dp,
        highlights: Object.fromEntries(dp.map((_, i) => [i, dp[i] === ans ? 'found' : 'visited'])),
        labels: { 0: `LIS=${ans}` },
      },
    });

    return steps;
  },
};

export default longestIncreasingSubsequenceBIT;
