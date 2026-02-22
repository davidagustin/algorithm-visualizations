import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const numberOfDiceRollsWithTargetSum: AlgorithmDefinition = {
  id: 'number-of-dice-rolls-with-target-sum',
  title: 'Number of Dice Rolls With Target Sum',
  leetcodeNumber: 1155,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'You have n dice each with k faces (numbered 1 to k). Return the number of possible ways to roll the dice so the sum of the face-up numbers equals target. Result is modulo 10^9 + 7. The DP state dp[i][s] represents the number of ways to get sum s using i dice. For each die and each face value, we accumulate the previous counts: dp[i][s] = sum of dp[i-1][s-f] for f from 1 to k.',
  tags: ['dp', 'counting', 'dice', 'modular arithmetic'],

  code: {
    pseudocode: `function numRollsToTarget(n, k, target):
  MOD = 10^9 + 7
  dp = 2D array (n+1) x (target+1), all 0
  dp[0][0] = 1  // base: 0 dice, sum 0
  for i from 1 to n:
    for s from 1 to target:
      for f from 1 to k:
        if s - f >= 0:
          dp[i][s] = (dp[i][s] + dp[i-1][s-f]) % MOD
  return dp[n][target]`,
    python: `def numRollsToTarget(n: int, k: int, target: int) -> int:
    MOD = 10**9 + 7
    dp = [[0]*(target+1) for _ in range(n+1)]
    dp[0][0] = 1
    for i in range(1, n+1):
        for s in range(1, target+1):
            for f in range(1, k+1):
                if s - f >= 0:
                    dp[i][s] = (dp[i][s] + dp[i-1][s-f]) % MOD
    return dp[n][target]`,
    javascript: `function numRollsToTarget(n, k, target) {
  const MOD = 1e9 + 7;
  const dp = Array.from({length: n+1}, () => new Array(target+1).fill(0));
  dp[0][0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= target; s++) {
      for (let f = 1; f <= k; f++) {
        if (s - f >= 0) dp[i][s] = (dp[i][s] + dp[i-1][s-f]) % MOD;
      }
    }
  }
  return dp[n][target];
}`,
    java: `public int numRollsToTarget(int n, int k, int target) {
    int MOD = 1_000_000_007;
    long[][] dp = new long[n+1][target+1];
    dp[0][0] = 1;
    for (int i = 1; i <= n; i++)
        for (int s = 1; s <= target; s++)
            for (int f = 1; f <= k; f++)
                if (s-f >= 0) dp[i][s] = (dp[i][s]+dp[i-1][s-f])%MOD;
    return (int)dp[n][target];
}`,
  },

  defaultInput: {
    n: 2,
    k: 6,
    target: 7,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Dice',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of dice to roll',
    },
    {
      name: 'k',
      label: 'Faces per Die',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Number of faces on each die (1 to k)',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Desired sum of all dice',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(0));
    dp[0][0] = 1;

    const makeViz = (dieRow: number, highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dp[dieRow].slice(0, target + 1),
      highlights,
      labels: Array.from({ length: target + 1 }, (_, s) => `sum=${s}`),
    });

    steps.push({
      line: 1,
      explanation: `n=${n} dice, k=${k} faces, target=${target}. dp[i][s] = ways to get sum s with i dice. dp[0][0]=1.`,
      variables: { n, k, target, MOD },
      visualization: makeViz(0, { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      steps.push({
        line: 5,
        explanation: `Processing die #${i}. Filling dp[${i}][s] for all sums.`,
        variables: { die: i },
        visualization: makeViz(i - 1, {}),
      });

      for (let s = 1; s <= target; s++) {
        for (let f = 1; f <= k; f++) {
          if (s - f >= 0 && dp[i - 1][s - f] > 0) {
            dp[i][s] = (dp[i][s] + dp[i - 1][s - f]) % MOD;
          }
        }
        if (dp[i][s] > 0) {
          steps.push({
            line: 8,
            explanation: `dp[${i}][${s}] = ${dp[i][s]}: ${dp[i][s]} way(s) to get sum ${s} with ${i} dice.`,
            variables: { die: i, sum: s, 'dp[i][s]': dp[i][s] },
            visualization: makeViz(i, { [s]: s === target && i === n ? 'found' : 'active' }),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Answer: dp[${n}][${target}] = ${dp[n][target]} ways to roll ${n} dice summing to ${target}.`,
      variables: { result: dp[n][target] },
      visualization: makeViz(n, { [target]: 'found' }),
    });

    return steps;
  },
};

export default numberOfDiceRollsWithTargetSum;
