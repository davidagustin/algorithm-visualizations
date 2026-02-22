import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const integerBreak: AlgorithmDefinition = {
  id: 'integer-break',
  title: 'Integer Break',
  leetcodeNumber: 343,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer n, break it into the sum of at least two positive integers and maximize the product of those integers. For each value i, try splitting off each j from 1 to i-1 and take the best product between j*(i-j) and j*dp[i-j].',
  tags: ['dynamic programming', 'math', 'optimization'],

  code: {
    pseudocode: `function integerBreak(n):
  dp = array of size n+1, dp[1] = 1
  for i from 2 to n:
    for j from 1 to i-1:
      dp[i] = max(dp[i], j*(i-j), j*dp[i-j])
  return dp[n]`,

    python: `def integerBreak(n: int) -> int:
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        for j in range(1, i):
            dp[i] = max(dp[i], j * (i - j), j * dp[i - j])
    return dp[n]`,

    javascript: `function integerBreak(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    for (let j = 1; j < i; j++) {
      dp[i] = Math.max(dp[i], j * (i - j), j * dp[i - j]);
    }
  }
  return dp[n];
}`,

    java: `public int integerBreak(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            dp[i] = Math.max(dp[i], Math.max(j * (i - j), j * dp[i - j]));
        }
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
      helperText: 'Integer to break (2 to 58)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n + 1).fill(0);
    dp[1] = 1;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : dp[i] > 0 ? 'found' : 'default'])),
      labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
    });

    steps.push({
      line: 2,
      explanation: 'Initialize dp array. dp[1] = 1 as the base case.',
      variables: { n, 'dp[1]': 1 },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      let bestJ = 1;
      let bestProduct = 0;
      for (let j = 1; j < i; j++) {
        const direct = j * (i - j);
        const withDp = j * dp[i - j];
        const candidate = Math.max(direct, withDp);
        if (candidate > dp[i]) {
          dp[i] = candidate;
          bestJ = j;
          bestProduct = candidate;
        }

        steps.push({
          line: 5,
          explanation: `i=${i}, j=${j}: direct product = ${j}*(${i - j}) = ${direct}, using dp: ${j}*dp[${i - j}] = ${j}*${dp[i - j]} = ${withDp}. Best so far: dp[${i}] = ${dp[i]}.`,
          variables: { i, j, direct, withDp, [`dp[${i}]`]: dp[i] },
          visualization: makeViz(i),
        });
      }

      steps.push({
        line: 5,
        explanation: `Finalized dp[${i}] = ${dp[i]} (best split was j=${bestJ}: ${bestJ} and ${i - bestJ}).`,
        variables: { i, bestJ, [`dp[${i}]`]: dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 6,
      explanation: `Maximum product of breaking ${n} is dp[${n}] = ${dp[n]}.`,
      variables: { n, result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((_, i) => [i, i === n ? 'found' : 'sorted'])),
        labels: Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`),
      },
    });

    return steps;
  },
};

export default integerBreak;
