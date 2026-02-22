import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const specialPermutations: AlgorithmDefinition = {
  id: 'special-permutations',
  title: 'Special Permutations',
  leetcodeNumber: 2741,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count permutations of nums where every adjacent pair (nums[i], nums[i+1]) satisfies: nums[i] % nums[i+1] == 0 or nums[i+1] % nums[i] == 0. Uses bitmask DP: dp[mask][i] = number of ways to arrange elements in mask ending with nums[i].',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function specialPerm(nums):
  n = length(nums)
  MOD = 10^9 + 7
  dp[mask][i] = ways to form perm of mask ending at nums[i]
  for i from 0 to n-1:
    dp[1<<i][i] = 1
  for mask from 1 to 2^n-1:
    for i from 0 to n-1:
      if not (mask & (1<<i)): continue
      if dp[mask][i] == 0: continue
      for j from 0 to n-1:
        if mask & (1<<j): continue
        if nums[i] % nums[j] == 0 or nums[j] % nums[i] == 0:
          dp[mask|(1<<j)][j] += dp[mask][i]
  return sum of dp[(1<<n)-1][i] for all i`,
    python: `def specialPerm(nums):
    MOD = 10**9 + 7
    n = len(nums)
    dp = [[0]*n for _ in range(1<<n)]
    for i in range(n):
        dp[1<<i][i] = 1
    for mask in range(1, 1<<n):
        for i in range(n):
            if not (mask>>i&1) or dp[mask][i]==0: continue
            for j in range(n):
                if mask>>j&1: continue
                if nums[i]%nums[j]==0 or nums[j]%nums[i]==0:
                    dp[mask|(1<<j)][j] = (dp[mask|(1<<j)][j]+dp[mask][i])%MOD
    return sum(dp[(1<<n)-1])%MOD`,
    javascript: `function specialPerm(nums) {
  const MOD = 1e9+7, n = nums.length;
  const dp = Array.from({length:1<<n},()=>new Array(n).fill(0));
  for (let i=0;i<n;i++) dp[1<<i][i]=1;
  for (let mask=1;mask<(1<<n);mask++)
    for (let i=0;i<n;i++) {
      if (!(mask>>i&1)||!dp[mask][i]) continue;
      for (let j=0;j<n;j++) {
        if (mask>>j&1) continue;
        if (nums[i]%nums[j]===0||nums[j]%nums[i]===0)
          dp[mask|(1<<j)][j]=(dp[mask|(1<<j)][j]+dp[mask][i])%MOD;
      }
    }
  return dp[(1<<n)-1].reduce((s,x)=>(s+x)%MOD,0);
}`,
    java: `public int specialPerm(int[] nums) {
    int MOD=1_000_000_007, n=nums.length;
    long[][] dp = new long[1<<n][n];
    for (int i=0;i<n;i++) dp[1<<i][i]=1;
    for (int mask=1;mask<(1<<n);mask++)
        for (int i=0;i<n;i++) {
            if ((mask>>i&1)==0||dp[mask][i]==0) continue;
            for (int j=0;j<n;j++) {
                if ((mask>>j&1)!=0) continue;
                if (nums[i]%nums[j]==0||nums[j]%nums[i]==0)
                    dp[mask|(1<<j)][j]=(dp[mask|(1<<j)][j]+dp[mask][i])%MOD;
            }
        }
    long ans=0;
    for (long x:dp[(1<<n)-1]) ans=(ans+x)%MOD;
    return (int)ans;
}`,
  },
  defaultInput: { nums: [2, 3, 6] },
  inputFields: [
    {
      name: 'nums',
      label: 'Numbers',
      type: 'array',
      defaultValue: [2, 3, 6],
      placeholder: '2,3,6',
      helperText: 'Array of distinct integers (max 5)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice(0, 5);
    const n = nums.length;
    const MOD = 1000000007;
    const size = 1 << n;

    const dpFlat: (number | null)[] = new Array(size * n).fill(0);
    const labels: string[] = [];
    for (let mask = 0; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        labels.push(`${mask.toString(2).padStart(n,'0')}@${i}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function idxF(mask: number, i: number): number { return mask * n + i; }
    function getV(mask: number, i: number): number { return dpFlat[idxF(mask, i)] as number; }
    function setV(mask: number, i: number, v: number): void { dpFlat[idxF(mask, i)] = v; }

    function makeViz(activeIdxF: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let idx = 0; idx < size * n; idx++) {
        if ((dpFlat[idx] as number) > 0) highlights[idx] = 'found';
      }
      if (activeIdxF !== null) highlights[activeIdxF] = 'active';
      return { type: 'dp-table', values: dpFlat.slice(), highlights, labels };
    }

    for (let i = 0; i < n; i++) {
      setV(1 << i, i, 1);
    }
    steps.push({
      line: 1,
      explanation: `nums=${JSON.stringify(nums)}. dp[mask][i]=ways to form perm of mask ending at nums[i]. Base: dp[{i}][i]=1 for each i.`,
      variables: { nums, n },
      visualization: makeViz(idxF(1, 0)),
    });

    for (let mask = 1; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask >> i & 1) || getV(mask, i) === 0) continue;
        for (let j = 0; j < n; j++) {
          if (mask >> j & 1) continue;
          if (nums[i] % nums[j] === 0 || nums[j] % nums[i] === 0) {
            const newMask = mask | (1 << j);
            const newVal = (getV(newMask, j) + getV(mask, i)) % MOD;
            setV(newMask, j, newVal);
            steps.push({
              line: 11,
              explanation: `mask=${mask.toString(2).padStart(n,'0')}, i=${i}->${j}: ${nums[i]}%${nums[j]}=0 or vice versa. dp[${newMask.toString(2).padStart(n,'0')}][${j}]=${newVal}.`,
              variables: { mask, i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], val: newVal },
              visualization: makeViz(idxF(newMask, j)),
            });
          }
        }
      }
    }

    let result = 0;
    for (let i = 0; i < n; i++) result = (result + getV(size - 1, i)) % MOD;
    steps.push({
      line: 13,
      explanation: `Sum of dp[(1<<${n})-1][i] for all i = ${result}. Number of special permutations: ${result}.`,
      variables: { result },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default specialPermutations;
