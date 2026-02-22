import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumXorSumOfTwoArrays: AlgorithmDefinition = {
  id: 'minimum-xor-sum-of-two-arrays',
  title: 'Minimum XOR Sum of Two Arrays',
  leetcodeNumber: 1879,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given two arrays nums1 and nums2, rearrange nums2 to minimize sum of XOR of corresponding elements. Uses bitmask DP: dp[mask] = minimum XOR sum when pairing first popcount(mask) elements of nums1 with elements of nums2 indicated by mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'Array'],
  code: {
    pseudocode: `function minimumXORSum(nums1, nums2):
  n = length(nums1)
  dp = array of size 2^n, fill INF
  dp[0] = 0
  for mask from 0 to 2^n - 1:
    if dp[mask] == INF: continue
    i = popcount(mask)  // index in nums1
    if i >= n: continue
    for j from 0 to n-1:
      if mask has bit j: continue
      dp[mask | (1<<j)] = min(dp[mask|(1<<j)], dp[mask] + (nums1[i] XOR nums2[j]))
  return dp[(1<<n)-1]`,
    python: `def minimumXORSum(nums1, nums2):
    n = len(nums1)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] == float('inf'): continue
        i = bin(mask).count('1')
        if i >= n: continue
        for j in range(n):
            if mask >> j & 1: continue
            dp[mask|(1<<j)] = min(dp[mask|(1<<j)],
                                   dp[mask] + (nums1[i] ^ nums2[j]))
    return dp[(1 << n) - 1]`,
    javascript: `function minimumXORSum(nums1, nums2) {
  const n = nums1.length;
  const dp = new Array(1<<n).fill(Infinity);
  dp[0] = 0;
  for (let mask=0;mask<(1<<n);mask++) {
    if (dp[mask]===Infinity) continue;
    const i = Integer.bitCount(mask);
    if (i>=n) continue;
    for (let j=0;j<n;j++) {
      if (mask>>j&1) continue;
      dp[mask|(1<<j)] = Math.min(dp[mask|(1<<j)], dp[mask]+(nums1[i]^nums2[j]));
    }
  }
  return dp[(1<<n)-1];
}`,
    java: `public int minimumXORSum(int[] nums1, int[] nums2) {
    int n = nums1.length;
    int[] dp = new int[1<<n];
    Arrays.fill(dp, Integer.MAX_VALUE/2);
    dp[0]=0;
    for (int mask=0;mask<(1<<n);mask++) {
        if (dp[mask]==Integer.MAX_VALUE/2) continue;
        int i = Integer.bitCount(mask);
        if (i>=n) continue;
        for (int j=0;j<n;j++) {
            if ((mask>>j&1)!=0) continue;
            dp[mask|(1<<j)]=Math.min(dp[mask|(1<<j)],dp[mask]+(nums1[i]^nums2[j]));
        }
    }
    return dp[(1<<n)-1];
}`,
  },
  defaultInput: { nums1: [1, 2], nums2: [2, 3] },
  inputFields: [
    {
      name: 'nums1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [1, 2],
      placeholder: '1,2',
      helperText: 'First array (max 5 elements)',
    },
    {
      name: 'nums2',
      label: 'Array 2',
      type: 'array',
      defaultValue: [2, 3],
      placeholder: '2,3',
      helperText: 'Second array (can be rearranged)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = (input.nums1 as number[]).slice(0, 5);
    const nums2 = (input.nums2 as number[]).slice(0, nums1.length);
    const n = Math.min(nums1.length, nums2.length);
    const nums1s = nums1.slice(0, n);
    const nums2s = nums2.slice(0, n);
    const size = 1 << n;
    const INF = 99999;

    const dp: (number | null)[] = new Array(size).fill(INF);
    dp[0] = 0;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );
    const steps: AlgorithmStep[] = [];

    function popcount(x: number): number { let c = 0; while (x) { c += x & 1; x >>= 1; } return c; }

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if ((dp[mask] as number) < INF) highlights[mask] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `nums1=${JSON.stringify(nums1s)}, nums2=${JSON.stringify(nums2s)}. dp[mask]=min XOR sum pairing first popcount(mask) elements of nums1 with nums2 positions in mask.`,
      variables: { nums1: nums1s, nums2: nums2s, n },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) >= INF) continue;
      const i = popcount(mask);
      if (i >= n) continue;
      for (let j = 0; j < n; j++) {
        if (mask >> j & 1) continue;
        const newMask = mask | (1 << j);
        const val = (dp[mask] as number) + (nums1s[i] ^ nums2s[j]);
        if (val < (dp[newMask] as number)) {
          dp[newMask] = val;
          steps.push({
            line: 8,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, nums1[${i}]=${nums1s[i]} XOR nums2[${j}]=${nums2s[j]}=${nums1s[i]^nums2s[j]}. dp[${newMask.toString(2).padStart(n,'0')}]=${dp[newMask]}.`,
            variables: { mask, i, j, 'nums1[i]': nums1s[i], 'nums2[j]': nums2s[j], xor: nums1s[i]^nums2s[j], 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 10,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. Minimum XOR sum: ${dp[fullMask]}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default minimumXorSumOfTwoArrays;
