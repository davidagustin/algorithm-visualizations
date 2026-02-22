import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const countingStairsKSteps: AlgorithmDefinition = {
  id: 'counting-stairs-k-steps',
  title: 'Climbing Stairs with Up to K Steps',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of distinct ways to climb n stairs when you can take between 1 and k steps at a time. This generalizes the classic climbing stairs problem. dp[i] = sum of dp[i-1] through dp[i-k] representing all possible last-step sizes.',
  tags: ['dynamic programming', 'climbing stairs', 'combinatorics', 'generalization'],

  code: {
    pseudocode: `function climbStairs(n, k):
  dp = array of n+1, dp[0] = 1
  for i from 1 to n:
    for step from 1 to min(i, k):
      dp[i] += dp[i - step]
  return dp[n]`,

    python: `def climbStairs(n: int, k: int) -> int:
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for step in range(1, min(i, k) + 1):
            dp[i] += dp[i - step]
    return dp[n]`,

    javascript: `function climbStairs(n, k) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let step = 1; step <= Math.min(i, k); step++) {
      dp[i] += dp[i - step];
    }
  }
  return dp[n];
}`,

    java: `public int climbStairs(int n, int k) {
    int[] dp = new int[n + 1];
    dp[0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int step = 1; step <= Math.min(i, k); step++) {
            dp[i] += dp[i - step];
        }
    }
    return dp[n];
}`,
  },

  defaultInput: { n: 6, k: 3 },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Stairs (n)',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Total number of stairs to climb',
    },
    {
      name: 'k',
      label: 'Max Steps per Jump (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum steps allowed in one jump',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n + 1).fill(0);
    dp[0] = 1;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] > 0 ? 'found' : 'default'])),
      labels: Array.from({ length: n + 1 }, (_, i) => `s${i}`),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0]=1 (one way to stand at ground), all others 0. n=${n}, k=${k}.`,
      variables: { n, k, 'dp[0]': 1 },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= n; i++) {
      const maxStep = Math.min(i, k);
      for (let step = 1; step <= maxStep; step++) {
        dp[i] += dp[i - step];

        steps.push({
          line: 5,
          explanation: `Stair ${i}: adding dp[${i - step}]=${dp[i - step]} (step size ${step}). dp[${i}] is now ${dp[i]}.`,
          variables: { i, step, [`dp[${i - step}]`]: dp[i - step], [`dp[${i}]`]: dp[i] },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Total distinct ways to climb ${n} stairs with up to ${k} steps each = dp[${n}] = ${dp[n]}.`,
      variables: { n, k, result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((_, i) => [i, i === n ? 'found' : 'sorted'])),
        labels: Array.from({ length: n + 1 }, (_, i) => `s${i}`),
      },
    });

    return steps;
  },
};

export default countingStairsKSteps;
