import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfWaysToEarnPoints: AlgorithmDefinition = {
  id: 'number-of-ways-to-earn-points',
  title: 'Number of Ways to Earn Points',
  leetcodeNumber: 2585,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given problem types where each type has a count and mark value, find the number of ways to earn exactly a target score. This is a bounded knapsack: for each type, you can use 0 to count items of that mark value. dp[j] = ways to reach score j.',
  tags: ['dynamic programming', 'knapsack', 'bounded knapsack', 'counting'],

  code: {
    pseudocode: `function waysToReachTarget(target, types):
  MOD = 1e9 + 7
  dp = array of size target+1, dp[0] = 1
  for each [count, mark] in types:
    for j from target down to 0:
      for k from 1 to count:
        if j >= k * mark:
          dp[j] = (dp[j] + dp[j - k*mark]) % MOD
  return dp[target]`,
    python: `def waysToReachTarget(target: int, types: list[list[int]]) -> int:
    MOD = 10**9 + 7
    dp = [0] * (target + 1)
    dp[0] = 1
    for count, mark in types:
        for j in range(target, -1, -1):
            for k in range(1, count + 1):
                if j >= k * mark:
                    dp[j] = (dp[j] + dp[j - k * mark]) % MOD
    return dp[target]`,
    javascript: `function waysToReachTarget(target, types) {
  const MOD = 1e9 + 7;
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (const [count, mark] of types) {
    for (let j = target; j >= 0; j--) {
      for (let k = 1; k <= count; k++) {
        if (j >= k * mark) {
          dp[j] = (dp[j] + dp[j - k * mark]) % MOD;
        }
      }
    }
  }
  return dp[target];
}`,
    java: `public int waysToReachTarget(int target, int[][] types) {
    final int MOD = 1_000_000_007;
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int[] type : types) {
        int count = type[0], mark = type[1];
        for (int j = target; j >= 0; j--) {
            for (int k = 1; k <= count; k++) {
                if (j >= k * mark) {
                    dp[j] = (dp[j] + dp[j - k * mark]) % MOD;
                }
            }
        }
    }
    return dp[target];
}`,
  },

  defaultInput: {
    target: 6,
    types: [1, 3, 2, 2, 3, 1],
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target Score',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Target score to reach',
    },
    {
      name: 'types',
      label: 'Types (count,mark pairs)',
      type: 'array',
      defaultValue: [1, 3, 2, 2, 3, 1],
      placeholder: '1,3,2,2,3,1',
      helperText: 'Alternating count and mark values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number;
    const rawTypes = input.types as number[];
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;
    const types: [number, number][] = [];
    for (let i = 0; i < rawTypes.length - 1; i += 2) {
      types.push([rawTypes[i], rawTypes[i + 1]]);
    }

    const dp = new Array(target + 1).fill(0);
    dp[0] = 1;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dpArr],
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp[0..${target}] = 0, dp[0] = 1 (one way to score 0).`,
      variables: { target, numTypes: types.length },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let ti = 0; ti < types.length; ti++) {
      const [count, mark] = types[ti];
      steps.push({
        line: 5,
        explanation: `Type ${ti + 1}: count=${count}, mark=${mark}. Can use 0 to ${count} problems of this type.`,
        variables: { count, mark },
        visualization: makeViz([...dp], {}),
      });
      for (let j = target; j >= 0; j--) {
        for (let k = 1; k <= count; k++) {
          if (j >= k * mark) {
            const prev = dp[j];
            dp[j] = (dp[j] + dp[j - k * mark]) % MOD;
            if (dp[j] !== prev) {
              steps.push({
                line: 7,
                explanation: `dp[${j}] += dp[${j - k * mark}] using ${k} problems of mark ${mark}. dp[${j}] = ${dp[j]}.`,
                variables: { j, k, mark, 'dp[j]': dp[j] },
                visualization: makeViz([...dp], { [j]: 'active', [j - k * mark]: 'comparing' }),
              });
            }
          }
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Number of ways to earn exactly ${target} points = ${dp[target]}.`,
      variables: { result: dp[target] },
      visualization: makeViz([...dp], { [target]: 'found' }),
    });

    return steps;
  },
};

export default numberOfWaysToEarnPoints;
