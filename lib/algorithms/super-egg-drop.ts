import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const superEggDrop: AlgorithmDefinition = {
  id: 'super-egg-drop',
  title: 'Super Egg Drop',
  leetcodeNumber: 887,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given k eggs and n floors, find the minimum number of moves to determine the critical floor with certainty. Optimized approach: dp[m][k] = max floors we can check with m moves and k eggs. We find the minimum m such that dp[m][k] >= n. This avoids the O(kn^2) naive DP and runs in O(k log n) time.',
  tags: ['dynamic programming', 'binary search', 'math'],

  code: {
    pseudocode: `function superEggDrop(k, n):
  // dp[m][k] = max floors checkable with m moves and k eggs
  m = 0
  dp = 2D array
  dp[0][*] = 0
  while dp[m][k] < n:
    m += 1
    for j in 1..k:
      dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1
      // break egg: check dp[m-1][j-1] floors below
      // survive: check dp[m-1][j] floors above + current
  return m`,

    python: `def superEggDrop(k, n):
    # dp[m][eggs] = max floors w/ m moves, eggs eggs
    m = 0
    dp = [[0]*(k+1) for _ in range(n+1)]
    while dp[m][k] < n:
        m += 1
        for j in range(1, k+1):
            dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1
    return m`,

    javascript: `function superEggDrop(k, n) {
  let m = 0;
  const dp = Array.from({length: n+1}, () => new Array(k+1).fill(0));
  while (dp[m][k] < n) {
    m++;
    for (let j = 1; j <= k; j++) {
      dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1;
    }
  }
  return m;
}`,

    java: `public int superEggDrop(int k, int n) {
    int m = 0;
    int[][] dp = new int[n+1][k+1];
    while (dp[m][k] < n) {
        m++;
        for (int j = 1; j <= k; j++) {
            dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1;
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
      label: 'Number of Eggs (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of eggs available',
    },
    {
      name: 'n',
      label: 'Number of Floors (n)',
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

    const dp: number[][] = Array.from({ length: n + 2 }, () => new Array(k + 1).fill(0));
    let m = 0;

    steps.push({
      line: 1,
      explanation: `Super Egg Drop with k=${k} eggs and n=${n} floors. dp[m][eggs] = max floors verifiable with m moves and given eggs.`,
      variables: { k, n, m },
      visualization: {
        type: 'dp-table' as const,
        values: Array.from({ length: k }, () => 0) as (number | null)[],
        highlights: {} as Record<number, string>,
        labels: Array.from({ length: k }, (_, j) => `m=0,${j + 1}egg`),
      },
    });

    const tableRows: { label: string; cells: { value: string | number; highlight: string }[] }[] = [
      {
        label: 'm=0',
        cells: [
          { value: 'm=0', highlight: 'default' },
          ...Array.from({ length: k }, () => ({ value: 0, highlight: 'default' })),
        ],
      },
    ];

    while (dp[m][k] < n) {
      m++;
      for (let j = 1; j <= k; j++) {
        dp[m][j] = dp[m - 1][j - 1] + dp[m - 1][j] + 1;
      }

      const row = {
        label: `m=${m}`,
        cells: [
          { value: `m=${m}`, highlight: 'default' as string },
          ...Array.from({ length: k }, (_, j) => ({
            value: dp[m][j + 1],
            highlight: dp[m][j + 1] >= n && j + 1 === k ? 'found' : dp[m][j + 1] > 0 ? 'active' : 'default',
          })),
        ],
      };
      tableRows.push(row);

      steps.push({
        line: 6,
        explanation: `Move ${m}: dp[${m}][j] = dp[${m - 1}][j-1] + dp[${m - 1}][j] + 1. With ${m} moves and ${k} eggs, can check ${dp[m][k]} floors. Need ${n}.`,
        variables: { m, eggsRow: Array.from({ length: k }, (_, j) => dp[m][j + 1]), target: n },
        visualization: {
          type: 'dp-table' as const,
          values: Array.from({ length: k }, (_, j) => dp[m][j + 1]) as (number | null)[],
          highlights: Object.fromEntries(
            Array.from({ length: k }, (_, j) => [j, dp[m][j + 1] >= n && j + 1 === k ? 'found' : dp[m][j + 1] > 0 ? 'active' : 'default'])
          ) as Record<number, string>,
          labels: Array.from({ length: k }, (_, j) => `m=${m},${j + 1}egg`),
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `With ${m} moves, we can verify all ${n} floors using ${k} eggs. Minimum number of moves required: ${m}.`,
      variables: { answer: m, maxFloorsVerifiable: dp[m][k] },
      visualization: {
        type: 'dp-table' as const,
        values: Array.from({ length: k }, (_, j) => dp[m][j + 1]) as (number | null)[],
        highlights: { [k - 1]: 'found' } as Record<number, string>,
        labels: Array.from({ length: k }, (_, j) => `m=${m},${j + 1}egg`),
      },
    });

    return steps;
  },
};

export default superEggDrop;
