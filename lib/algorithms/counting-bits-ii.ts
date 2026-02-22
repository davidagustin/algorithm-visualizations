import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countingBitsIi: AlgorithmDefinition = {
  id: 'counting-bits-ii',
  title: 'Counting Bits',
  leetcodeNumber: 338,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given an integer n, return an array ans of length n+1 where ans[i] is the number of 1 bits in the binary representation of i. Uses the recurrence: dp[i] = dp[i >> 1] + (i & 1), which shifts right and checks the last bit.',
  tags: ['bit manipulation', 'dynamic programming', 'array'],

  code: {
    pseudocode: `function countBits(n):
  dp = array of zeros, length n+1
  for i from 1 to n:
    dp[i] = dp[i >> 1] + (i & 1)
  return dp`,

    python: `def countBits(n):
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
      label: 'n',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Count bits for numbers 0 through n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp = new Array(n + 1).fill(0);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dp],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize dp array of length ${n + 1} with zeros. dp[i] will store the count of 1-bits in i.`,
      variables: { n, dp: [...dp] },
      visualization: makeViz({}, {}),
    });

    for (let i = 1; i <= n; i++) {
      const shift = i >> 1;
      const lastBit = i & 1;
      dp[i] = dp[shift] + lastBit;

      steps.push({
        line: 3,
        explanation: `i = ${i} (binary: ${i.toString(2)}). dp[${i}] = dp[${i} >> 1] + (${i} & 1) = dp[${shift}] + ${lastBit} = ${dp[shift]} + ${lastBit} = ${dp[i]}.`,
        variables: { i, shift, lastBit, 'dp[i]': dp[i] },
        visualization: makeViz(
          { [i]: 'active', [shift]: 'comparing' },
          { [i]: `dp[${i}]=${dp[i]}`, [shift]: `ref` }
        ),
      });
    }

    steps.push({
      line: 4,
      explanation: `Done. Result: [${dp.join(', ')}]. Each value is the number of 1-bits in the index.`,
      variables: { result: [...dp] },
      visualization: makeViz(
        Object.fromEntries(dp.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(dp.map((v, i) => [i, String(v)]))
      ),
    });

    return steps;
  },
};

export default countingBitsIi;
