import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const countingBits: AlgorithmDefinition = {
  id: 'counting-bits',
  title: 'Counting Bits',
  leetcodeNumber: 338,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given an integer n, return an array ans of length n+1 such that ans[i] is the number of 1 bits in the binary representation of i. Uses DP: ans[i] = ans[i >> 1] + (i & 1). Each number has one fewer bit than half its value, plus a possible extra bit from the lowest position.',
  tags: ['dynamic programming', 'bit manipulation', 'bottom-up'],

  code: {
    pseudocode: `function countBits(n):
  dp = array of n+1 zeros
  for i from 1 to n:
    dp[i] = dp[i >> 1] + (i & 1)
  return dp`,

    python: `def countBits(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,

    javascript: `function countBits(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,

    java: `public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
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
      helperText: 'Upper bound (inclusive) for counting bits',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n + 1).fill(0);

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : i < activeIdx ? 'found' : 'default'])),
      labels: Array.from({ length: n + 1 }, (_, i) => `${i}`),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp array of size ${n + 1}. dp[0] = 0 because 0 has no set bits.`,
      variables: { n, 'dp[0]': 0 },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= n; i++) {
      const half = i >> 1;
      const lsb = i & 1;
      dp[i] = dp[half] + lsb;
      const binary = i.toString(2);

      steps.push({
        line: 4,
        explanation: `i=${i} (binary: ${binary}): dp[${i}] = dp[${half}] + (${i} & 1) = ${dp[half]} + ${lsb} = ${dp[i]}. Shifting right by 1 gives ${half}, plus the lowest bit ${lsb}.`,
        variables: { i, binary, half, lsb, [`dp[${i}]`]: dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 5,
      explanation: `Complete! dp[0..${n}] = [${dp.join(', ')}]. Each value is the popcount of its index.`,
      variables: { result: dp.join(',') },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((_, i) => [i, 'found'])),
        labels: Array.from({ length: n + 1 }, (_, i) => `${i}`),
      },
    });

    return steps;
  },
};

export default countingBits;
