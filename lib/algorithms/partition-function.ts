import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const partitionFunction: AlgorithmDefinition = {
  id: 'partition-function',
  title: 'Integer Partition Function',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count the number of ways to write n as an unordered sum of positive integers (integer partitions) using DP. p(n) = number of partitions of n.',
  tags: ['Math', 'Combinatorics', 'DP', 'Integer Partitions'],
  code: {
    pseudocode: `function partition(n):
  dp[0] = 1
  for part from 1 to n:
    for i from part to n:
      dp[i] += dp[i - part]
  return dp[n]`,
    python: `def partition(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    for part in range(1, n + 1):
        for i in range(part, n + 1):
            dp[i] += dp[i - part]
    return dp[n]`,
    javascript: `function partition(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  for (let part = 1; part <= n; part++)
    for (let i = part; i <= n; i++)
      dp[i] += dp[i - part];
  return dp[n];
}`,
    java: `public long partition(int n) {
    long[] dp = new long[n + 1];
    dp[0] = 1;
    for (int part = 1; part <= n; part++)
        for (int i = part; i <= n; i++)
            dp[i] += dp[i - part];
    return dp[n];
}`,
  },
  defaultInput: { n: 8 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 8,
      placeholder: 'e.g. 8',
      helperText: 'Count integer partitions of n (1-15)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(1, input.n as number), 15);
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1;

    const makeViz = (active: number, part: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        labels[i] = `p(${i})`;
        if (i === active) highlights[i] = 'active';
        else if (i > 0 && dp[i] > 0) highlights[i] = 'found';
        else if (i === 0) highlights[i] = 'sorted';
        else highlights[i] = 'visited';
      }
      return { type: 'array', array: dp.slice(), highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Count partitions of ${n}. dp[0]=1 (empty partition). Iterate each part 1..${n}.`,
      variables: { n },
      visualization: makeViz(-1, -1),
    });

    for (let part = 1; part <= n; part++) {
      steps.push({
        line: 3,
        explanation: `Consider part=${part}. Update dp[${part}..${n}].`,
        variables: { part, dpBefore: dp.slice() },
        visualization: makeViz(-1, part),
      });
      for (let i = part; i <= n; i++) {
        const before = dp[i];
        dp[i] += dp[i - part];
        steps.push({
          line: 4,
          explanation: `dp[${i}] += dp[${i}-${part}]=dp[${i-part}]=${dp[i-part]}. ${before} + ${dp[i]-before} = ${dp[i]}.`,
          variables: { part, i, before, added: dp[i] - before, after: dp[i] },
          visualization: makeViz(i, part),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `p(${n}) = ${dp[n]}. The number ${n} has ${dp[n]} distinct integer partitions.`,
      variables: { n, result: dp[n], dp: dp.slice() },
      visualization: makeViz(n, -1),
    });

    return steps;
  },
};

export default partitionFunction;
