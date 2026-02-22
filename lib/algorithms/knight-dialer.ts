import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const knightDialer: AlgorithmDefinition = {
  id: 'knight-dialer',
  title: 'Knight Dialer',
  leetcodeNumber: 935,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A chess knight starts on any digit of a phone keypad (0-9) and makes exactly n-1 knight moves. Count the distinct phone numbers that can be dialed. The keypad is 3x4 with digits 0-9 and * and # (knight cannot land on * or #). DP tracks counts per digit at each step.',
  tags: ['dynamic programming', 'chess', 'combinatorics', 'modular arithmetic'],

  code: {
    pseudocode: `function knightDialer(n):
  MOD = 1e9+7
  moves = {0:[4,6], 1:[6,8], 2:[7,9], 3:[4,8],
           4:[0,3,9], 5:[], 6:[0,1,7], 7:[2,6],
           8:[1,3], 9:[2,4]}
  dp = [1]*10
  for step from 2 to n:
    new_dp = [0]*10
    for digit 0-9:
      for next in moves[digit]:
        new_dp[next] += dp[digit]
    dp = new_dp
  return sum(dp) % MOD`,

    python: `def knightDialer(n: int) -> int:
    MOD = 10**9 + 7
    moves = {
        0:[4,6], 1:[6,8], 2:[7,9], 3:[4,8],
        4:[0,3,9], 5:[], 6:[0,1,7], 7:[2,6],
        8:[1,3], 9:[2,4]
    }
    dp = [1] * 10
    for _ in range(n - 1):
        new_dp = [0] * 10
        for d in range(10):
            for nxt in moves[d]:
                new_dp[nxt] = (new_dp[nxt] + dp[d]) % MOD
        dp = new_dp
    return sum(dp) % MOD`,

    javascript: `function knightDialer(n) {
  const MOD = 1e9 + 7;
  const moves = {
    0:[4,6], 1:[6,8], 2:[7,9], 3:[4,8],
    4:[0,3,9], 5:[], 6:[0,1,7], 7:[2,6],
    8:[1,3], 9:[2,4]
  };
  let dp = new Array(10).fill(1);
  for (let step = 1; step < n; step++) {
    const newDp = new Array(10).fill(0);
    for (let d = 0; d < 10; d++) {
      for (const nxt of moves[d]) {
        newDp[nxt] = (newDp[nxt] + dp[d]) % MOD;
      }
    }
    dp = newDp;
  }
  return dp.reduce((a, b) => (a + b) % MOD, 0);
}`,

    java: `public int knightDialer(int n) {
    int MOD = 1_000_000_007;
    int[][] moves = {{4,6},{6,8},{7,9},{4,8},{0,3,9},{},{0,1,7},{2,6},{1,3},{2,4}};
    long[] dp = new long[10];
    Arrays.fill(dp, 1);
    for (int step = 1; step < n; step++) {
        long[] newDp = new long[10];
        for (int d = 0; d < 10; d++)
            for (int nxt : moves[d])
                newDp[nxt] = (newDp[nxt] + dp[d]) % MOD;
        dp = newDp;
    }
    long res = 0;
    for (long v : dp) res = (res + v) % MOD;
    return (int) res;
}`,
  },

  defaultInput: { n: 3 },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Digits (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Length of phone number to dial',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    const moves: Record<number, number[]> = {
      0: [4, 6], 1: [6, 8], 2: [7, 9], 3: [4, 8],
      4: [0, 3, 9], 5: [], 6: [0, 1, 7], 7: [2, 6],
      8: [1, 3], 9: [2, 4],
    };

    let dp: number[] = Array(10).fill(1);

    const makeViz = (vals: number[], activeSet: Set<number>): DPVisualization => ({
      type: 'dp-table',
      values: [...vals],
      highlights: Object.fromEntries(vals.map((_, i) => [i, activeSet.has(i) ? 'active' : vals[i] > 0 ? 'found' : 'default'])),
      labels: Array.from({ length: 10 }, (_, i) => `d${i}`),
    });

    steps.push({
      line: 7,
      explanation: `Step 1: dp=[${dp.join(',')}]. Each digit starts with count 1 (can start anywhere).`,
      variables: { step: 1, dp: dp.join(','), total: 10 },
      visualization: makeViz(dp, new Set()),
    });

    for (let step = 1; step < n; step++) {
      const newDp: number[] = Array(10).fill(0);
      const updated = new Set<number>();
      for (let d = 0; d < 10; d++) {
        for (const nxt of moves[d]) {
          newDp[nxt] = (newDp[nxt] + dp[d]) % MOD;
          updated.add(nxt);
        }
      }
      dp = newDp;

      const total = dp.reduce((a, b) => (a + b) % MOD, 0);
      steps.push({
        line: 11,
        explanation: `Step ${step + 1}: dp=[${dp.join(',')}]. Total sequences of length ${step + 1} = ${total}.`,
        variables: { step: step + 1, dp: dp.join(','), total },
        visualization: makeViz(dp, updated),
      });
    }

    const result = dp.reduce((a, b) => (a + b) % MOD, 0);
    steps.push({
      line: 13,
      explanation: `Total distinct phone numbers of length ${n} = sum(dp) = ${result}.`,
      variables: { n, result },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((v, i) => [i, v > 0 ? 'found' : 'default'])),
        labels: Array.from({ length: 10 }, (_, i) => `d${i}`),
      },
    });

    return steps;
  },
};

export default knightDialer;
