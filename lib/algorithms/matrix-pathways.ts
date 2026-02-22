import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const matrixPathways: AlgorithmDefinition = {
  id: 'matrix-pathways',
  title: 'Matrix Pathways',
  leetcodeNumber: 62,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A robot is on an m x n grid at the top-left corner. It can only move right or down. Count the number of unique paths to reach the bottom-right corner. dp[i][j] = dp[i-1][j] + dp[i][j-1].',
  tags: ['Dynamic Programming', 'Matrix'],
  code: {
    pseudocode: `function uniquePaths(m, n):
  dp = matrix of size m x n
  for i from 0 to m-1: dp[i][0] = 1
  for j from 0 to n-1: dp[0][j] = 1
  for i from 1 to m-1:
    for j from 1 to n-1:
      dp[i][j] = dp[i-1][j] + dp[i][j-1]
  return dp[m-1][n-1]`,
    python: `def uniquePaths(m, n):
    dp = [[1]*n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]`,
    javascript: `function uniquePaths(m, n) {
  const dp = Array.from({length: m}, () => new Array(n).fill(1));
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
  return dp[m-1][n-1];
}`,
    java: `public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}`,
  },
  defaultInput: { m: 3, n: 3 },
  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows (1 to 10)',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns (1 to 10)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const total = m * n;

    const flat = (): (number | null)[] => {
      const arr: (number | null)[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          arr.push(dp[i][j] === 0 ? null : dp[i][j]);
      return arr;
    };

    const idx = (i: number, j: number) => i * n + j;

    const makeLabels = (): string[] => {
      const labels: string[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          labels.push(`(${i},${j})`);
      return labels;
    };

    function makeViz(
      activeIdx: number | null,
      comparingIndices: number[]
    ): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < total; k++) {
        if (flat()[k] !== null) highlights[k] = 'found';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return {
        type: 'dp-table',
        values: flat(),
        highlights,
        labels: makeLabels(),
      };
    }

    steps.push({
      line: 1,
      explanation: `Create a ${m}x${n} DP table. dp[i][j] = number of unique paths to cell (i,j). Flattened row by row for visualization.`,
      variables: { m, n },
      visualization: makeViz(null, []),
    });

    // Initialize first column
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    steps.push({
      line: 3,
      explanation: `First column: only one way to reach any cell in column 0 (go straight down). Set all dp[i][0] = 1.`,
      variables: {},
      visualization: makeViz(null, []),
    });

    // Initialize first row
    for (let j = 0; j < n; j++) dp[0][j] = 1;
    steps.push({
      line: 4,
      explanation: `First row: only one way to reach any cell in row 0 (go straight right). Set all dp[0][j] = 1.`,
      variables: {},
      visualization: makeViz(null, []),
    });

    // Fill the table
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const above = dp[i - 1][j];
        const left = dp[i][j - 1];

        steps.push({
          line: 6,
          explanation: `dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i}][${j - 1}] = ${above} + ${left} = ${above + left}. Paths from above + paths from left.`,
          variables: { i, j, above, left, sum: above + left },
          visualization: makeViz(idx(i, j), [idx(i - 1, j), idx(i, j - 1)]),
        });

        dp[i][j] = above + left;

        steps.push({
          line: 6,
          explanation: `dp[${i}][${j}] = ${dp[i][j]}.`,
          variables: { i, j, 'dp[i][j]': dp[i][j] },
          visualization: makeViz(idx(i, j), []),
        });
      }
    }

    // Final
    steps.push({
      line: 7,
      explanation: `dp[${m - 1}][${n - 1}] = ${dp[m - 1][n - 1]}. There are ${dp[m - 1][n - 1]} unique paths from top-left to bottom-right.`,
      variables: { result: dp[m - 1][n - 1] },
      visualization: {
        type: 'dp-table',
        values: flat(),
        highlights: Object.fromEntries(
          Array.from({ length: total }, (_, k) => [
            k,
            k === total - 1 ? 'active' : 'found',
          ])
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default matrixPathways;
