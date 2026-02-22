import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const tribonacciNumber: AlgorithmDefinition = {
  id: 'tribonacci-number',
  title: 'N-th Tribonacci Number',
  leetcodeNumber: 1137,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given n, return the nth Tribonacci number. T(0) = 0, T(1) = 1, T(2) = 1, and T(n) = T(n-1) + T(n-2) + T(n-3) for n >= 3. Bottom-up DP fills the table from left to right, each value depending on the three preceding values.',
  tags: ['dynamic programming', 'math', 'bottom-up'],

  code: {
    pseudocode: `function tribonacci(n):
  if n == 0: return 0
  if n <= 2: return 1
  dp = array of size n+1
  dp[0]=0, dp[1]=1, dp[2]=1
  for i from 3 to n:
    dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
  return dp[n]`,

    python: `def tribonacci(n: int) -> int:
    if n == 0: return 0
    if n <= 2: return 1
    dp = [0] * (n + 1)
    dp[1] = dp[2] = 1
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
    return dp[n]`,

    javascript: `function tribonacci(n) {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  const dp = new Array(n + 1).fill(0);
  dp[1] = dp[2] = 1;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
  }
  return dp[n];
}`,

    java: `public int tribonacci(int n) {
    if (n == 0) return 0;
    if (n <= 2) return 1;
    int[] dp = new int[n + 1];
    dp[1] = dp[2] = 1;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2] + dp[i-3];
    }
    return dp[n];
}`,
  },

  defaultInput: { n: 7 },

  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Index of the Tribonacci number to compute (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const size = Math.max(n + 1, 3);

    const makeViz = (dp: (number | null)[], activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(
        dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] !== null ? 'found' : 'default'])
      ),
      labels: Array.from({ length: size }, (_, i) => `T(${i})`),
    });

    const dp: (number | null)[] = Array(size).fill(null);

    steps.push({
      line: 4,
      explanation: `Initialize DP table with ${size} slots for T(0) through T(${size - 1}).`,
      variables: { n },
      visualization: makeViz(dp, -1),
    });

    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 1;

    steps.push({
      line: 5,
      explanation: 'Set base cases: T(0) = 0, T(1) = 1, T(2) = 1.',
      variables: { 'T(0)': 0, 'T(1)': 1, 'T(2)': 1 },
      visualization: makeViz(dp, 2),
    });

    if (n <= 2) {
      steps.push({
        line: 8,
        explanation: `n = ${n} is a base case. Result is ${dp[n]}.`,
        variables: { n, result: dp[n] },
        visualization: {
          type: 'dp-table',
          values: dp as number[],
          highlights: { [n]: 'found' },
          labels: Array.from({ length: size }, (_, i) => `T(${i})`),
        },
      });
      return steps;
    }

    for (let i = 3; i <= n; i++) {
      const a = dp[i - 1] as number;
      const b = dp[i - 2] as number;
      const c = dp[i - 3] as number;
      dp[i] = a + b + c;

      steps.push({
        line: 7,
        explanation: `T(${i}) = T(${i - 1}) + T(${i - 2}) + T(${i - 3}) = ${a} + ${b} + ${c} = ${dp[i]}.`,
        variables: { i, [`T(${i})`]: dp[i], [`T(${i - 1})`]: a, [`T(${i - 2})`]: b, [`T(${i - 3})`]: c },
        visualization: makeViz(dp, i),
      });
    }

    steps.push({
      line: 8,
      explanation: `Finished! The ${n}th Tribonacci number is ${dp[n]}.`,
      variables: { n, result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp as number[],
        highlights: Object.fromEntries((dp as number[]).map((_, i) => [i, i === n ? 'found' : 'sorted'])),
        labels: Array.from({ length: size }, (_, i) => `T(${i})`),
      },
    });

    return steps;
  },
};

export default tribonacciNumber;
