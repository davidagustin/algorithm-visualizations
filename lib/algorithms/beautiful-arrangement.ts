import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const beautifulArrangement: AlgorithmDefinition = {
  id: 'beautiful-arrangement',
  title: 'Beautiful Arrangement',
  leetcodeNumber: 526,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count beautiful arrangements of integers 1 to n. Position i is beautiful if value[i] % i == 0 or i % value[i] == 0. Uses bitmask DP where dp[mask] = number of ways to fill positions 1..popcount(mask) using the numbers indicated by mask.',
  tags: ['Dynamic Programming', 'Bitmask', 'Backtracking', 'Bit Manipulation'],
  code: {
    pseudocode: `function countArrangement(n):
  dp = array of size 2^n, fill 0
  dp[0] = 1
  for mask from 0 to 2^n - 1:
    pos = popcount(mask) + 1  // next position to fill
    for i from 1 to n:
      if mask has bit (i-1) set: continue
      if i % pos == 0 or pos % i == 0:
        dp[mask | (1<<(i-1))] += dp[mask]
  return dp[(1<<n)-1]`,
    python: `def countArrangement(n):
    dp = [0] * (1 << n)
    dp[0] = 1
    for mask in range(1 << n):
        pos = bin(mask).count('1') + 1
        for i in range(1, n + 1):
            if mask & (1 << (i - 1)):
                continue
            if i % pos == 0 or pos % i == 0:
                dp[mask | (1 << (i - 1))] += dp[mask]
    return dp[(1 << n) - 1]`,
    javascript: `function countArrangement(n) {
  const dp = new Array(1 << n).fill(0);
  dp[0] = 1;
  for (let mask = 0; mask < (1 << n); mask++) {
    const pos = Integer.bitCount(mask) + 1;
    for (let i = 1; i <= n; i++) {
      if (mask & (1 << (i - 1))) continue;
      if (i % pos === 0 || pos % i === 0) {
        dp[mask | (1 << (i - 1))] += dp[mask];
      }
    }
  }
  return dp[(1 << n) - 1];
}`,
    java: `public int countArrangement(int n) {
    int[] dp = new int[1 << n];
    dp[0] = 1;
    for (int mask = 0; mask < (1 << n); mask++) {
        int pos = Integer.bitCount(mask) + 1;
        for (int i = 1; i <= n; i++) {
            if ((mask & (1 << (i - 1))) != 0) continue;
            if (i % pos == 0 || pos % i == 0)
                dp[mask | (1 << (i - 1))] += dp[mask];
        }
    }
    return dp[(1 << n) - 1];
}`,
  },
  defaultInput: { n: 4 },
  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Count beautiful arrangements of 1 to N (max 5)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 5);
    const steps: AlgorithmStep[] = [];
    const size = 1 << n;
    const dp: (number | null)[] = new Array(size).fill(0);
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(n, '0')
    );

    function popcount(x: number): number {
      let c = 0;
      while (x) { c += x & 1; x >>= 1; }
      return c;
    }

    function makeViz(activeIdx: number | null, prevIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let m = 0; m < size; m++) {
        if ((dp[m] as number) > 0) highlights[m] = 'found';
      }
      if (prevIdx !== null) highlights[prevIdx] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    dp[0] = 1;
    steps.push({
      line: 2,
      explanation: `n=${n}. dp[mask]=ways to arrange numbers in mask at first popcount(mask) positions. dp[0]=1.`,
      variables: { n, 'dp[0]': 1 },
      visualization: makeViz(0, null),
    });

    for (let mask = 0; mask < size; mask++) {
      if ((dp[mask] as number) === 0) continue;
      const pos = popcount(mask) + 1;
      for (let i = 1; i <= n; i++) {
        if (mask & (1 << (i - 1))) continue;
        if (i % pos === 0 || pos % i === 0) {
          const newMask = mask | (1 << (i - 1));
          (dp[newMask] as number);
          dp[newMask] = (dp[newMask] as number) + (dp[mask] as number);
          steps.push({
            line: 7,
            explanation: `mask=${mask.toString(2).padStart(n,'0')}, pos=${pos}: place ${i} (${i}%${pos}=${i%pos} or ${pos}%${i}=${pos%i}). dp[${newMask.toString(2).padStart(n,'0')}]+=${dp[mask]}=${dp[newMask]}.`,
            variables: { mask, pos, i, 'dp[mask]': dp[mask], newMask, 'dp[newMask]': dp[newMask] },
            visualization: makeViz(newMask, mask),
          });
        }
      }
    }

    const fullMask = size - 1;
    steps.push({
      line: 9,
      explanation: `dp[${fullMask.toString(2).padStart(n,'0')}]=${dp[fullMask]}. There are ${dp[fullMask]} beautiful arrangements for n=${n}.`,
      variables: { result: dp[fullMask] },
      visualization: makeViz(fullMask, null),
    });

    return steps;
  },
};

export default beautifulArrangement;
