import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const fibonacciNumber: AlgorithmDefinition = {
  id: 'fibonacci-number',
  title: 'Fibonacci Number',
  leetcodeNumber: 509,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given n, return the nth Fibonacci number. F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Bottom-up DP fills a table iteratively, avoiding repeated subproblem computation.',
  tags: ['dynamic programming', 'math', 'memoization', 'bottom-up'],

  code: {
    pseudocode: `function fib(n):
  if n <= 1: return n
  dp = array of size n+1
  dp[0] = 0, dp[1] = 1
  for i from 2 to n:
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`,

    python: `def fib(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,

    javascript: `function fib(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,

    java: `public int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
  },

  defaultInput: { n: 8 },

  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Index of the Fibonacci number to compute (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (dp: (number | null)[], activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(
        dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] !== null ? 'found' : 'default'])
      ),
      labels: Array.from({ length: n + 1 }, (_, i) => `F(${i})`),
    });

    if (n <= 1) {
      const dp: (number | null)[] = Array(Math.max(n + 1, 2)).fill(null);
      dp[0] = 0;
      if (n >= 1) dp[1] = 1;
      steps.push({
        line: 2,
        explanation: `Base case: n = ${n}, so return ${n} directly.`,
        variables: { n, result: n },
        visualization: makeViz(dp, n),
      });
      return steps;
    }

    const dp: (number | null)[] = Array(n + 1).fill(null);

    steps.push({
      line: 3,
      explanation: `Initialize DP table with ${n + 1} slots, all null.`,
      variables: { n },
      visualization: makeViz(dp, -1),
    });

    dp[0] = 0;
    dp[1] = 1;

    steps.push({
      line: 4,
      explanation: 'Set base cases: dp[0] = 0, dp[1] = 1.',
      variables: { 'dp[0]': 0, 'dp[1]': 1 },
      visualization: makeViz(dp, 1),
    });

    for (let i = 2; i <= n; i++) {
      const prev1 = dp[i - 1] as number;
      const prev2 = dp[i - 2] as number;
      dp[i] = prev1 + prev2;

      steps.push({
        line: 6,
        explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${prev1} + ${prev2} = ${dp[i]}.`,
        variables: { i, [`dp[${i}]`]: dp[i], [`dp[${i - 1}]`]: prev1, [`dp[${i - 2}]`]: prev2 },
        visualization: makeViz(dp, i),
      });
    }

    steps.push({
      line: 7,
      explanation: `Done! The ${n}th Fibonacci number is ${dp[n]}.`,
      variables: { n, result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp as number[],
        highlights: Object.fromEntries((dp as number[]).map((_, i) => [i, i === n ? 'found' : 'sorted'])),
        labels: Array.from({ length: n + 1 }, (_, i) => `F(${i})`),
      },
    });

    return steps;
  },
};

export default fibonacciNumber;
