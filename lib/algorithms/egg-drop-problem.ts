import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const eggDropProblem: AlgorithmDefinition = {
  id: 'egg-drop-problem',
  title: 'Super Egg Drop',
  leetcodeNumber: 887,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'You have k eggs and a building with n floors. Find the minimum number of moves to determine the critical floor f such that an egg dropped from above f always breaks and from at or below never breaks. The DP approach here uses dp[m][k] = the maximum number of floors we can check with m moves and k eggs. We increment moves until dp[m][k] >= n.',
  tags: ['dp', 'binary search', 'egg drop', 'decision making'],

  code: {
    pseudocode: `function superEggDrop(k, n):
  // dp[m][k] = max floors checkable with m moves and k eggs
  dp = 2D array, all 0
  m = 0  // number of moves
  while dp[m][k] < n:
    m++
    for e from 1 to k:
      // if egg breaks: dp[m-1][e-1] floors below
      // if egg survives: dp[m-1][e] floors above
      dp[m][e] = dp[m-1][e-1] + dp[m-1][e] + 1
  return m`,
    python: `def superEggDrop(k: int, n: int) -> int:
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    m = 0
    while dp[m][k] < n:
        m += 1
        for e in range(1, k + 1):
            dp[m][e] = dp[m-1][e-1] + dp[m-1][e] + 1
    return m`,
    javascript: `function superEggDrop(k, n) {
  const dp = Array.from({length: n+1}, () => new Array(k+1).fill(0));
  let m = 0;
  while (dp[m][k] < n) {
    m++;
    for (let e = 1; e <= k; e++) {
      dp[m][e] = dp[m-1][e-1] + dp[m-1][e] + 1;
    }
  }
  return m;
}`,
    java: `public int superEggDrop(int k, int n) {
    int[][] dp = new int[n+1][k+1];
    int m = 0;
    while (dp[m][k] < n) {
        m++;
        for (int e = 1; e <= k; e++) {
            dp[m][e] = dp[m-1][e-1] + dp[m-1][e] + 1;
        }
    }
    return m;
}`,
  },

  defaultInput: {
    k: 2,
    n: 10,
  },

  inputFields: [
    {
      name: 'k',
      label: 'Number of Eggs',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of eggs available',
    },
    {
      name: 'n',
      label: 'Number of Floors',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Number of floors in the building',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const maxMoves = n + 1;
    const dp: number[][] = Array.from({ length: maxMoves + 1 }, () => new Array(k + 1).fill(0));
    let m = 0;

    const makeViz = (moveRow: number, highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dp[moveRow].slice(1),
      highlights,
      labels: Array.from({ length: k }, (_, i) => `e=${i + 1}`),
    });

    steps.push({
      line: 1,
      explanation: `k=${k} eggs, n=${n} floors. dp[m][e] = max floors checkable in m moves with e eggs. Increment m until dp[m][k] >= ${n}.`,
      variables: { k, n, m },
      visualization: makeViz(0, {}),
    });

    while (dp[m][k] < n) {
      m++;
      steps.push({
        line: 5,
        explanation: `Move ${m}: compute dp[${m}][e] for each egg count e.`,
        variables: { m, 'dp[m][k]': dp[m - 1][k], target: n },
        visualization: makeViz(m - 1, {}),
      });

      for (let e = 1; e <= k; e++) {
        dp[m][e] = dp[m - 1][e - 1] + dp[m - 1][e] + 1;
        steps.push({
          line: 7,
          explanation: `dp[${m}][${e}] = dp[${m - 1}][${e - 1}] + dp[${m - 1}][${e}] + 1 = ${dp[m - 1][e - 1]} + ${dp[m - 1][e]} + 1 = ${dp[m][e]} floors covered with ${m} moves and ${e} eggs.`,
          variables: { m, e, 'dp[m][e]': dp[m][e], breaks: dp[m - 1][e - 1], survives: dp[m - 1][e] },
          visualization: makeViz(m, { [e - 1]: dp[m][e] >= n ? 'found' : 'active' }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `dp[${m}][${k}] = ${dp[m][k]} >= ${n}. Minimum moves required = ${m}.`,
      variables: { result: m, 'dp[m][k]': dp[m][k] },
      visualization: makeViz(m, { [k - 1]: 'found' }),
    });

    return steps;
  },
};

export default eggDropProblem;
