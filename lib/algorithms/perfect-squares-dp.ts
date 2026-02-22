import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const perfectSquaresDp: AlgorithmDefinition = {
  id: 'perfect-squares-dp',
  title: 'Perfect Squares - DP',
  leetcodeNumber: 279,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a positive integer n, return the minimum number of perfect squares that sum to n. Similar to coin change: dp[i] = min perfect squares summing to i. For each i, try subtracting each perfect square j*j and take the minimum.',
  tags: ['dynamic programming', 'math', 'BFS', 'breadth-first search'],

  code: {
    pseudocode: `function numSquares(n):
  dp = array of size n+1, dp[0] = 0, rest = Infinity
  for i from 1 to n:
    j = 1
    while j*j <= i:
      dp[i] = min(dp[i], dp[i - j*j] + 1)
      j += 1
  return dp[n]`,
    python: `def numSquares(n: int) -> int:
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            dp[i] = min(dp[i], dp[i - j*j] + 1)
            j += 1
    return dp[n]`,
    javascript: `function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j*j] + 1);
    }
  }
  return dp[n];
}`,
    java: `public int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j*j] + 1);
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    n: 12,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Target sum using perfect squares',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v === Infinity ? -1 : v)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0..${n}]. dp[0]=0 (zero squares for sum 0). Rest = Infinity.`,
      variables: { n },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      let j = 1;
      while (j * j <= i) {
        const sq = j * j;
        if (dp[i - sq] + 1 < dp[i]) {
          dp[i] = dp[i - sq] + 1;
          steps.push({
            line: 5,
            explanation: `dp[${i}]: use square ${sq} (${j}^2). dp[${i}] = dp[${i - sq}] + 1 = ${dp[i]}.`,
            variables: { i, square: sq, j, 'dp[i]': dp[i] },
            visualization: makeViz([...dp], { [i]: 'active', [i - sq]: 'comparing' }),
          });
        }
        j++;
      }
    }

    steps.push({
      line: 6,
      explanation: `Minimum perfect squares summing to ${n} = dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: 'found' }),
    });

    return steps;
  },
};

export default perfectSquaresDp;
