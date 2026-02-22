import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const uglyNumberIiDp: AlgorithmDefinition = {
  id: 'ugly-number-ii-dp',
  title: 'Ugly Number II (DP)',
  leetcodeNumber: 264,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given n, return the nth ugly number. Use three pointers p2, p3, p5 advancing through the DP array. At each step the next ugly number is the minimum of dp[p2]*2, dp[p3]*3, dp[p5]*5.',
  tags: ['dynamic programming', 'math', 'heap alternative', 'three pointers'],

  code: {
    pseudocode: `function nthUglyNumber(n):
  dp = [1]*n
  p2 = p3 = p5 = 0
  for i from 1 to n-1:
    next2 = dp[p2] * 2
    next3 = dp[p3] * 3
    next5 = dp[p5] * 5
    dp[i] = min(next2, next3, next5)
    if dp[i] == next2: p2++
    if dp[i] == next3: p3++
    if dp[i] == next5: p5++
  return dp[n-1]`,

    python: `def nthUglyNumber(n: int) -> int:
    dp = [1] * n
    p2 = p3 = p5 = 0
    for i in range(1, n):
        next2 = dp[p2] * 2
        next3 = dp[p3] * 3
        next5 = dp[p5] * 5
        dp[i] = min(next2, next3, next5)
        if dp[i] == next2: p2 += 1
        if dp[i] == next3: p3 += 1
        if dp[i] == next5: p5 += 1
    return dp[n - 1]`,

    javascript: `function nthUglyNumber(n) {
  const dp = new Array(n).fill(1);
  let p2 = 0, p3 = 0, p5 = 0;
  for (let i = 1; i < n; i++) {
    const next2 = dp[p2] * 2;
    const next3 = dp[p3] * 3;
    const next5 = dp[p5] * 5;
    dp[i] = Math.min(next2, next3, next5);
    if (dp[i] === next2) p2++;
    if (dp[i] === next3) p3++;
    if (dp[i] === next5) p5++;
  }
  return dp[n - 1];
}`,

    java: `public int nthUglyNumber(int n) {
    int[] dp = new int[n];
    dp[0] = 1;
    int p2 = 0, p3 = 0, p5 = 0;
    for (int i = 1; i < n; i++) {
        int next2 = dp[p2] * 2, next3 = dp[p3] * 3, next5 = dp[p5] * 5;
        dp[i] = Math.min(next2, Math.min(next3, next5));
        if (dp[i] == next2) p2++;
        if (dp[i] == next3) p3++;
        if (dp[i] == next5) p5++;
    }
    return dp[n - 1];
}`,
  },

  defaultInput: { n: 10 },

  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Find the nth ugly number (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n).fill(1);
    let p2 = 0;
    let p3 = 0;
    let p5 = 0;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : i < activeIdx ? 'found' : 'default'])),
      labels: Array.from({ length: n }, (_, i) => `U${i + 1}`),
    });

    steps.push({
      line: 2,
      explanation: 'Initialize dp[0] = 1 (first ugly number). All three pointers start at 0.',
      variables: { p2, p3, p5, 'dp[0]': 1 },
      visualization: makeViz(0),
    });

    for (let i = 1; i < n; i++) {
      const next2 = dp[p2] * 2;
      const next3 = dp[p3] * 3;
      const next5 = dp[p5] * 5;
      dp[i] = Math.min(next2, next3, next5);

      const chosenFactor = dp[i] === next2 ? 2 : dp[i] === next3 ? 3 : 5;
      if (dp[i] === next2) p2++;
      if (dp[i] === next3) p3++;
      if (dp[i] === next5) p5++;

      steps.push({
        line: 8,
        explanation: `dp[${i}]: candidates: 2x=${next2}, 3x=${next3}, 5x=${next5}. Chose ${dp[i]} (factor ${chosenFactor}). Pointers: p2=${p2}, p3=${p3}, p5=${p5}.`,
        variables: { i, next2, next3, next5, [`dp[${i}]`]: dp[i], p2, p3, p5 },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 12,
      explanation: `The ${n}th ugly number is dp[${n - 1}] = ${dp[n - 1]}.`,
      variables: { n, result: dp[n - 1] },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: { [n - 1]: 'found' },
        labels: Array.from({ length: n }, (_, i) => `U${i + 1}`),
      },
    });

    return steps;
  },
};

export default uglyNumberIiDp;
