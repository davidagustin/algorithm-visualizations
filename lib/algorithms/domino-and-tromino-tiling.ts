import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const dominoAndTrominoTiling: AlgorithmDefinition = {
  id: 'domino-and-tromino-tiling',
  title: 'Domino and Tromino Tiling',
  leetcodeNumber: 790,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of ways to tile a 2 x n board using dominoes (2x1) and trominoes (L-shaped). The recurrence is dp[n] = 2*dp[n-1] + dp[n-3] for n >= 3. This accounts for placing a vertical domino, two horizontal dominoes, or two tromino configurations. Return result modulo 10^9+7.',
  tags: ['dynamic programming', 'tiling', 'combinatorics', 'modular arithmetic'],

  code: {
    pseudocode: `function numTilings(n):
  MOD = 1e9+7
  if n <= 2: return n
  dp = [0, 1, 2, 5]
  for i from 4 to n:
    dp[i] = (2*dp[i-1] + dp[i-3]) % MOD
  return dp[n]`,

    python: `def numTilings(n: int) -> int:
    MOD = 10**9 + 7
    if n <= 2: return n
    dp = [0, 1, 2, 5] + [0] * (n - 3)
    for i in range(4, n + 1):
        dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD
    return dp[n]`,

    javascript: `function numTilings(n) {
  const MOD = 1e9 + 7;
  if (n <= 2) return n;
  const dp = [0, 1, 2, 5];
  for (let i = 4; i <= n; i++) {
    dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD;
  }
  return dp[n];
}`,

    java: `public int numTilings(int n) {
    int MOD = 1_000_000_007;
    if (n <= 2) return n;
    long[] dp = {0, 1, 2, 5};
    dp = Arrays.copyOf(dp, n + 1);
    for (int i = 4; i <= n; i++) {
        dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD;
    }
    return (int) dp[n];
}`,
  },

  defaultInput: { n: 6 },

  inputFields: [
    {
      name: 'n',
      label: 'Board Width (n)',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Width of the 2 x n board to tile',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    if (n <= 2) {
      steps.push({
        line: 3,
        explanation: `n=${n} <= 2: return ${n} directly (base case).`,
        variables: { n, result: n },
        visualization: {
          type: 'dp-table',
          values: [n],
          highlights: { 0: 'found' },
          labels: [`dp[${n}]`],
        },
      });
      return steps;
    }

    const dp: number[] = [0, 1, 2, 5, ...Array(Math.max(0, n - 3)).fill(0)];

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: dp.slice(0, n + 1),
      highlights: Object.fromEntries(
        Array.from({ length: n + 1 }, (_, i) => [i, i === activeIdx ? 'active' : dp[i] > 0 ? 'found' : 'default'])
      ),
      labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
    });

    steps.push({
      line: 4,
      explanation: 'Base cases: dp[0]=0 (empty), dp[1]=1 (one vertical domino), dp[2]=2 (two vertical or two horizontal), dp[3]=5 (five configurations).',
      variables: { 'dp[1]': 1, 'dp[2]': 2, 'dp[3]': 5 },
      visualization: makeViz(3),
    });

    for (let i = 4; i <= n; i++) {
      dp[i] = (2 * dp[i - 1] + dp[i - 3]) % MOD;

      steps.push({
        line: 6,
        explanation: `dp[${i}] = (2 * dp[${i - 1}] + dp[${i - 3}]) % MOD = (2 * ${dp[i - 1]} + ${dp[i - 3]}) % MOD = ${dp[i]}.`,
        variables: { i, [`dp[${i}]`]: dp[i], [`2*dp[${i - 1}]`]: 2 * dp[i - 1], [`dp[${i - 3}]`]: dp[i - 3] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 7,
      explanation: `Number of ways to tile a 2 x ${n} board = dp[${n}] = ${dp[n]}.`,
      variables: { n, result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
      },
    });

    return steps;
  },
};

export default dominoAndTrominoTiling;
