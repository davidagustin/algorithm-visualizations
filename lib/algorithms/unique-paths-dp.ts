import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniquePathsDp: AlgorithmDefinition = {
  id: 'unique-paths-dp',
  title: 'Unique Paths (DP)',
  leetcodeNumber: 62,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of unique paths from top-left to bottom-right of an m x n grid, moving only right or down. Classic DP: dp[r][c] = number of ways to reach (r,c). First row and column are all 1. Interior cells = sum of cell above and cell to the left.',
  tags: ['dynamic programming', 'grid', 'combinatorics', 'classic dp'],

  code: {
    pseudocode: `function uniquePaths(m, n):
  dp = m x n grid filled with 1
  for r from 1 to m-1:
    for c from 1 to n-1:
      dp[r][c] = dp[r-1][c] + dp[r][c-1]
  return dp[m-1][n-1]`,
    python: `def uniquePaths(m, n):
    dp = [[1]*n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r-1][c] + dp[r][c-1]
    return dp[m-1][n-1]`,
    javascript: `function uniquePaths(m, n) {
  const dp = Array.from({length:m}, () => Array(n).fill(1));
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      dp[r][c] = dp[r-1][c] + dp[r][c-1];
  return dp[m-1][n-1];
}`,
    java: `public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int r = 0; r < m; r++) dp[r][0] = 1;
    for (int c = 0; c < n; c++) dp[0][c] = 1;
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++)
            dp[r][c] = dp[r-1][c] + dp[r][c-1];
    return dp[m-1][n-1];
}`,
  },

  defaultInput: {
    m: 3,
    n: 4,
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of columns in the grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m }, () => Array(n).fill(1));

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Initialize ${m}x${n} DP table with all 1s. First row and column always have 1 path (go straight right or straight down).`,
      variables: { m, n },
      visualization: makeViz(dp.flat(), {}, {}),
    });

    for (let r = 1; r < m; r++) {
      for (let c = 1; c < n; c++) {
        const fromAbove = dp[r - 1][c];
        const fromLeft = dp[r][c - 1];
        dp[r][c] = fromAbove + fromLeft;

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * n + c] = 'active';
        hi[(r - 1) * n + c] = 'comparing';
        hi[r * n + (c - 1)] = 'comparing';
        lb[r * n + c] = `${dp[r][c]}`;
        lb[(r - 1) * n + c] = `${fromAbove}`;
        lb[r * n + (c - 1)] = `${fromLeft}`;

        steps.push({
          line: 4,
          explanation: `dp[${r}][${c}] = dp[${r - 1}][${c}](${fromAbove}) + dp[${r}][${c - 1}](${fromLeft}) = ${dp[r][c]}`,
          variables: { r, c, fromAbove, fromLeft, paths: dp[r][c] },
          visualization: makeViz(dp.flat(), hi, lb),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Total unique paths from (0,0) to (${m - 1},${n - 1}) = ${dp[m - 1][n - 1]}`,
      variables: { answer: dp[m - 1][n - 1] },
      visualization: makeViz(dp.flat(), { [(m - 1) * n + (n - 1)]: 'found' }, { [(m - 1) * n + (n - 1)]: `${dp[m - 1][n - 1]}` }),
    });

    return steps;
  },
};

export default uniquePathsDp;
