import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const hammingWeightsOfIntegers: AlgorithmDefinition = {
  id: 'hamming-weights-of-integers',
  title: 'Counting Bits',
  leetcodeNumber: 338,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given an integer n, return an array ans of length n + 1 such that ans[i] is the number of 1s in the binary representation of i. Uses the DP relation: dp[i] = dp[i >> 1] + (i & 1).',
  tags: ['bit manipulation', 'dynamic programming'],

  code: {
    pseudocode: `function countBits(n):
  dp = array of size n + 1
  dp[0] = 0
  for i = 1 to n:
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

  defaultInput: {
    n: 8,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Count bits for all integers from 0 to n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: (number | null)[] = new Array(n + 1).fill(null);
    dp[0] = 0;

    const labels = Array.from({ length: n + 1 }, (_, i) => String(i));

    const makeViz = (
      highlights: Record<number, string>
    ): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights,
      labels,
    });

    // Step: Initialize
    steps.push({
      line: 3,
      explanation: `Initialize dp[0] = 0. The number 0 has zero 1-bits. Binary: 0 = "0".`,
      variables: { 'dp[0]': 0, binary: '0' },
      visualization: makeViz({ 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      const halfIdx = i >> 1;
      const lastBit = i & 1;
      dp[i] = (dp[halfIdx] as number) + lastBit;
      const binary = i.toString(2);

      steps.push({
        line: 5,
        explanation: `i = ${i} (binary: "${binary}"). dp[${i}] = dp[${i} >> 1] + (${i} & 1) = dp[${halfIdx}] + ${lastBit} = ${dp[halfIdx]} + ${lastBit} = ${dp[i]}.`,
        variables: { i, binary, 'i>>1': halfIdx, 'i&1': lastBit, 'dp[i>>1]': dp[halfIdx], 'dp[i]': dp[i] },
        visualization: makeViz({ [halfIdx]: 'pointer', [i]: 'active' }),
      });
    }

    // Final
    steps.push({
      line: 6,
      explanation: `Done! Bit counts for 0 to ${n}: [${dp.join(', ')}].`,
      variables: { result: [...dp] },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n + 1 }, (_, i) => [i, 'found']))
      ),
    });

    return steps;
  },
};

export default hammingWeightsOfIntegers;
