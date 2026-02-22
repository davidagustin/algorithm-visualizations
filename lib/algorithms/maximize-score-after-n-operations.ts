import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximizeScoreAfterNOperations: AlgorithmDefinition = {
  id: 'maximize-score-after-n-operations',
  title: 'Maximize Score After N Operations',
  leetcodeNumber: 1799,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given 2n integers, perform n operations. In operation k, choose 2 elements, score += k * gcd(a, b), remove them. Maximize total score. Uses bitmask DP: dp[mask] = max score using elements in mask (popcount must be even).',
  tags: ['Dynamic Programming', 'Bitmask', 'Math', 'Bit Manipulation'],
  code: {
    pseudocode: `function maxScore(nums):
  n = length(nums) / 2
  precompute gcd[i][j] for all pairs
  dp = array of size 2^(2n), fill 0
  for mask from 1 to 2^(2n) - 1:
    k = popcount(mask) / 2  // operation number
    if popcount(mask) % 2 != 0: continue
    for i from 0 to 2n-2:
      for j from i+1 to 2n-1:
        if not (mask has both i and j): continue
        prev = mask ^ (1<<i) ^ (1<<j)
        dp[mask] = max(dp[mask], dp[prev] + k * gcd[i][j])
  return dp[(1<<(2n))-1]`,
    python: `from math import gcd
def maxScore(nums):
    m = len(nums)
    dp = [0] * (1 << m)
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        if bits % 2 != 0: continue
        k = bits // 2
        for i in range(m):
            if not (mask >> i & 1): continue
            for j in range(i+1, m):
                if not (mask >> j & 1): continue
                prev = mask ^ (1<<i) ^ (1<<j)
                dp[mask] = max(dp[mask], dp[prev] + k * gcd(nums[i], nums[j]))
    return dp[(1 << m) - 1]`,
    javascript: `function maxScore(nums) {
  const m = nums.length;
  const gcd = (a,b) => b?gcd(b,a%b):a;
  const dp = new Array(1<<m).fill(0);
  for (let mask=1;mask<(1<<m);mask++) {
    const bits = Integer.bitCount(mask);
    if (bits%2!==0) continue;
    const k = bits/2;
    for (let i=0;i<m;i++) {
      if (!(mask>>i&1)) continue;
      for (let j=i+1;j<m;j++) {
        if (!(mask>>j&1)) continue;
        const prev = mask^(1<<i)^(1<<j);
        dp[mask] = Math.max(dp[mask], dp[prev]+k*gcd(nums[i],nums[j]));
      }
    }
  }
  return dp[(1<<m)-1];
}`,
    java: `public int maxScore(int[] nums) {
    int m = nums.length;
    int[] dp = new int[1<<m];
    for (int mask=1;mask<(1<<m);mask++) {
        int bits = Integer.bitCount(mask);
        if (bits%2!=0) continue;
        int k = bits/2;
        for (int i=0;i<m;i++) {
            if ((mask>>i&1)==0) continue;
            for (int j=i+1;j<m;j++) {
                if ((mask>>j&1)==0) continue;
                int prev = mask^(1<<i)^(1<<j);
                dp[mask] = Math.max(dp[mask], dp[prev]+k*gcd(nums[i],nums[j]));
            }
        }
    }
    return dp[(1<<m)-1];
}
int gcd(int a,int b){return b==0?a:gcd(b,a%b);}`,
  },
  defaultInput: { nums: [3, 4, 6, 8] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers (even count)',
      type: 'array',
      defaultValue: [3, 4, 6, 8],
      placeholder: '3,4,6,8',
      helperText: 'Even number of integers (max 6)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let nums = (input.nums as number[]);
    if (nums.length % 2 !== 0) nums = nums.slice(0, nums.length - 1);
    nums = nums.slice(0, 6);
    const m = nums.length;
    const size = 1 << m;

    function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
    function popcount(x: number): number { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

    const dp: (number | null)[] = new Array(size).fill(0);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(m, '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) > 0) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `nums=${JSON.stringify(nums)}, m=${m}. dp[mask]=max score using elements in mask (even popcount). dp[0]=0.`,
      variables: { nums, m },
      visualization: makeViz(0, null),
    });

    for (let mask = 1; mask < size; mask++) {
      const bits = popcount(mask);
      if (bits % 2 !== 0) continue;
      const k = bits / 2;

      for (let i = 0; i < m; i++) {
        if (!(mask >> i & 1)) continue;
        for (let j = i + 1; j < m; j++) {
          if (!(mask >> j & 1)) continue;
          const prev = mask ^ (1 << i) ^ (1 << j);
          const g = gcd(nums[i], nums[j]);
          const val = (dp[prev] as number) + k * g;
          if (val > (dp[mask] as number)) {
            dp[mask] = val;
            steps.push({
              line: 10,
              explanation: `mask=${mask.toString(2).padStart(m,'0')}, op=${k}: pair (${nums[i]},${nums[j]}), gcd=${g}, score+=${k*g}. dp[mask]=${dp[mask]}.`,
              variables: { mask, k, i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], g, score: dp[mask] },
              visualization: makeViz(mask, prev),
            });
          }
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 12,
      explanation: `dp[${fullMask.toString(2).padStart(m,'0')}]=${dp[fullMask]}. Maximum score: ${dp[fullMask]}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default maximizeScoreAfterNOperations;
