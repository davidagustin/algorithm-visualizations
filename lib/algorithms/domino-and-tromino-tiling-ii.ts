import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const dominoAndTrominoTilingII: AlgorithmDefinition = {
  id: 'domino-and-tromino-tiling-ii',
  title: 'Domino and Tromino Tiling',
  leetcodeNumber: 790,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count ways to tile a 2×n board using dominoes (1×2) and trominoes (L-shaped 2×2 minus one corner). DP recurrence: dp[n] = 2*dp[n-1] + dp[n-3]. Answer modulo 10^9+7.',
  tags: ['Dynamic Programming', 'State Machine', 'Tiling'],
  code: {
    pseudocode: `function numTilings(n):
  MOD = 1e9+7
  if n == 1: return 1
  if n == 2: return 2
  dp = [0, 1, 2, 5, ...]
  for i from 4 to n:
    dp[i] = (2*dp[i-1] + dp[i-3]) % MOD
  return dp[n]`,
    python: `def numTilings(n):
    MOD = 10**9 + 7
    if n == 1: return 1
    if n == 2: return 2
    if n == 3: return 5
    dp = [0] * (n + 1)
    dp[1], dp[2], dp[3] = 1, 2, 5
    for i in range(4, n + 1):
        dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD
    return dp[n]`,
    javascript: `function numTilings(n) {
  const MOD = 1000000007;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 5;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1; dp[2] = 2; dp[3] = 5;
  for (let i = 4; i <= n; i++) {
    dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD;
  }
  return dp[n];
}`,
    java: `public int numTilings(int n) {
    int MOD = 1_000_000_007;
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (n == 3) return 5;
    long[] dp = new long[n + 1];
    dp[1] = 1; dp[2] = 2; dp[3] = 5;
    for (int i = 4; i <= n; i++)
        dp[i] = (2 * dp[i-1] + dp[i-3]) % MOD;
    return (int) dp[n];
}`,
  },
  defaultInput: { n: 5 },
  inputFields: [
    {
      name: 'n',
      label: 'Board Width (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Width of the 2×n board',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];
    const size = Math.max(n + 1, 4);
    const dp: (number | null)[] = new Array(size).fill(null);
    const labels: string[] = Array.from({ length: size }, (_, i) => `dp[${i}]`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < size; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] !== null) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 2;
    dp[3] = 5;

    steps.push({
      line: 1,
      explanation: 'Base cases: dp[1]=1 (one vertical domino), dp[2]=2, dp[3]=5. Recurrence: dp[i] = 2*dp[i-1] + dp[i-3].',
      variables: { n, 'dp[1]': 1, 'dp[2]': 2, 'dp[3]': 5 },
      visualization: makeViz(3),
    });

    if (n <= 3) {
      steps.push({
        line: 8,
        explanation: `n=${n}. Answer = dp[${n}] = ${dp[n]}.`,
        variables: { result: dp[n] },
        visualization: makeViz(n),
      });
      return steps;
    }

    for (let i = 4; i <= n; i++) {
      const val = (2 * (dp[i - 1] as number) + (dp[i - 3] as number)) % MOD;
      dp[i] = val;

      steps.push({
        line: 6,
        explanation: `dp[${i}] = 2*dp[${i - 1}]+dp[${i - 3}] = 2*${dp[i - 1]}+${dp[i - 3]} = ${val}.`,
        variables: { i, 'dp[i]': val },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 7,
      explanation: `Return dp[${n}] = ${dp[n]}. Total ways to tile 2×${n} board.`,
      variables: { result: dp[n] },
      visualization: makeViz(n),
    });

    return steps;
  },
};

export default dominoAndTrominoTilingII;
