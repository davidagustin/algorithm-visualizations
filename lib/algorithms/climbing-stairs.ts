import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const climbingStairs: AlgorithmDefinition = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  leetcodeNumber: 70,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top? We use dynamic programming where dp[i] = dp[i-1] + dp[i-2].',
  tags: ['Dynamic Programming', 'Fibonacci', 'Memoization'],
  code: {
    pseudocode: `function climbStairs(n):
  dp = array of size n+1
  dp[0] = 1
  dp[1] = 1
  for i from 2 to n:
    dp[i] = dp[i-1] + dp[i-2]
  return dp[n]`,
    python: `def climbStairs(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
    javascript: `function climbStairs(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,
    java: `public int climbStairs(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}`,
  },
  defaultInput: { n: 6 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Steps (n)',
      type: 'number',
      defaultValue: 6,
      placeholder: 'e.g. 6',
      helperText: 'The number of stairs to climb (1 to 20)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: (number | null)[] = new Array(n + 1).fill(null);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => String(i));

    function makeViz(
      activeIdx: number | null,
      comparingIndices: number[],
      computedUpTo: number,
    ): DPVisualization {
      const highlights: Record<number, string> = {};

      // Mark already computed cells
      for (let i = 0; i <= computedUpTo; i++) {
        if (dp[i] !== null) {
          highlights[i] = 'found';
        }
      }

      // Mark cells being summed
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) {
          highlights[idx] = 'comparing';
        }
      }

      // Mark currently active cell
      if (activeIdx !== null) {
        highlights[activeIdx] = 'active';
      }

      return {
        type: 'dp-table',
        values: dp.slice(),
        highlights,
        labels,
      };
    }

    // Step: Initialize dp array
    steps.push({
      line: 2,
      explanation: `Create a dp array of size ${n + 1} (indices 0 to ${n}), initialized to 0. dp[i] will store the number of distinct ways to reach step i.`,
      variables: { n, dp: dp.slice() },
      visualization: makeViz(null, [], -1),
    });

    // Step: dp[0] = 1
    dp[0] = 1;
    steps.push({
      line: 3,
      explanation: 'Set dp[0] = 1. There is exactly 1 way to stand at the ground (do nothing).',
      variables: { n, dp: dp.slice(), 'dp[0]': 1 },
      visualization: makeViz(0, [], 0),
    });

    // Step: dp[1] = 1
    dp[1] = 1;
    steps.push({
      line: 4,
      explanation: 'Set dp[1] = 1. There is exactly 1 way to reach step 1 (take one step).',
      variables: { n, dp: dp.slice(), 'dp[1]': 1 },
      visualization: makeViz(1, [], 1),
    });

    if (n <= 1) {
      steps.push({
        line: 7,
        explanation: `n = ${n}, so no loop iterations needed. Return dp[${n}] = ${dp[n]}.`,
        variables: { n, result: dp[n] },
        visualization: makeViz(n, [], n),
      });
      return steps;
    }

    // Step: Enter the loop
    steps.push({
      line: 5,
      explanation: `Begin filling the dp table from index 2 to ${n}. Each cell dp[i] = dp[i-1] + dp[i-2].`,
      variables: { n, i: 2 },
      visualization: makeViz(null, [], 1),
    });

    // Fill dp[2] through dp[n]
    for (let i = 2; i <= n; i++) {
      // Step: Highlight the two cells being summed
      steps.push({
        line: 6,
        explanation: `Computing dp[${i}]: look at dp[${i - 1}] = ${dp[i - 1]} and dp[${i - 2}] = ${dp[i - 2]}.`,
        variables: {
          i,
          'dp[i-1]': dp[i - 1],
          'dp[i-2]': dp[i - 2],
          sum: (dp[i - 1] as number) + (dp[i - 2] as number),
        },
        visualization: makeViz(i, [i - 1, i - 2], i - 1),
      });

      // Compute the value
      dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);

      // Step: Show the computed value
      steps.push({
        line: 6,
        explanation: `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. There are ${dp[i]} distinct ways to reach step ${i}.`,
        variables: {
          i,
          'dp[i]': dp[i],
          dp: dp.slice(),
        },
        visualization: makeViz(i, [], i),
      });
    }

    // Step: Return result
    steps.push({
      line: 7,
      explanation: `Return dp[${n}] = ${dp[n]}. There are ${dp[n]} distinct ways to climb ${n} stairs.`,
      variables: {
        n,
        result: dp[n],
        dp: dp.slice(),
      },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [i, i === n ? 'active' : 'found'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default climbingStairs;
