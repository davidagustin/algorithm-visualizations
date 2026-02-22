import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPathsInMatrix: AlgorithmDefinition = {
  id: 'count-paths-in-matrix',
  title: 'Count All Paths in Grid',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count all paths from top-left to bottom-right of a grid, moving only right or down. This classic DP problem fills a table where dp[r][c] equals the number of ways to reach cell (r,c) from the top-left corner. The answer is dp[rows-1][cols-1].',
  tags: ['dynamic programming', 'grid', 'combinatorics', 'classic'],

  code: {
    pseudocode: `function countPaths(rows, cols):
  dp = 2D array of size rows x cols, filled with 0
  for r from 0 to rows-1:
    dp[r][0] = 1  (only one way: go straight down)
  for c from 0 to cols-1:
    dp[0][c] = 1  (only one way: go straight right)
  for r from 1 to rows-1:
    for c from 1 to cols-1:
      dp[r][c] = dp[r-1][c] + dp[r][c-1]
  return dp[rows-1][cols-1]`,
    python: `def countPaths(rows, cols):
    dp = [[0]*cols for _ in range(rows)]
    for r in range(rows): dp[r][0] = 1
    for c in range(cols): dp[0][c] = 1
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r-1][c] + dp[r][c-1]
    return dp[rows-1][cols-1]`,
    javascript: `function countPaths(rows, cols) {
  const dp = Array.from({length: rows}, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) dp[r][0] = 1;
  for (let c = 0; c < cols; c++) dp[0][c] = 1;
  for (let r = 1; r < rows; r++)
    for (let c = 1; c < cols; c++)
      dp[r][c] = dp[r-1][c] + dp[r][c-1];
  return dp[rows-1][cols-1];
}`,
    java: `public int countPaths(int rows, int cols) {
    int[][] dp = new int[rows][cols];
    for (int r = 0; r < rows; r++) dp[r][0] = 1;
    for (int c = 0; c < cols; c++) dp[0][c] = 1;
    for (int r = 1; r < rows; r++)
        for (int c = 1; c < cols; c++)
            dp[r][c] = dp[r-1][c] + dp[r][c-1];
    return dp[rows-1][cols-1];
}`,
  },

  defaultInput: {
    rows: 3,
    cols: 4,
  },

  inputFields: [
    {
      name: 'rows',
      label: 'Number of Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'cols',
      label: 'Number of Columns',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of columns in the grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rows = input.rows as number;
    const cols = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Initialize ${rows}x${cols} DP table. Count paths from (0,0) to (${rows - 1},${cols - 1}) moving only right or down.`,
      variables: { rows, cols },
      visualization: makeViz(dp.flat(), {}, {}),
    });

    // Fill first column
    for (let r = 0; r < rows; r++) dp[r][0] = 1;
    const hi1: Record<number, string> = {};
    for (let r = 0; r < rows; r++) hi1[r * cols] = 'active';
    steps.push({
      line: 3,
      explanation: 'Set first column to 1: only one path (all down) to reach any cell in column 0.',
      variables: { firstColValue: 1 },
      visualization: makeViz(dp.flat(), hi1, {}),
    });

    // Fill first row
    for (let c = 0; c < cols; c++) dp[0][c] = 1;
    const hi2: Record<number, string> = {};
    for (let c = 0; c < cols; c++) hi2[c] = 'found';
    steps.push({
      line: 5,
      explanation: 'Set first row to 1: only one path (all right) to reach any cell in row 0.',
      variables: { firstRowValue: 1 },
      visualization: makeViz(dp.flat(), hi2, {}),
    });

    // Fill rest
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = 'active';
        hi[(r - 1) * cols + c] = 'comparing';
        hi[r * cols + (c - 1)] = 'comparing';
        lb[r * cols + c] = `${dp[r][c]}`;
        lb[(r - 1) * cols + c] = `from above`;
        lb[r * cols + (c - 1)] = `from left`;
        steps.push({
          line: 8,
          explanation: `dp[${r}][${c}] = dp[${r - 1}][${c}] + dp[${r}][${c - 1}] = ${dp[r - 1][c]} + ${dp[r][c - 1]} = ${dp[r][c]}`,
          variables: { r, c, fromAbove: dp[r - 1][c], fromLeft: dp[r][c - 1], result: dp[r][c] },
          visualization: makeViz(dp.flat(), hi, lb),
        });
      }
    }

    const finalHi: Record<number, string> = { [(rows - 1) * cols + (cols - 1)]: 'found' };
    const finalLb: Record<number, string> = { [(rows - 1) * cols + (cols - 1)]: `${dp[rows - 1][cols - 1]}` };
    steps.push({
      line: 10,
      explanation: `Total paths from (0,0) to (${rows - 1},${cols - 1}) = ${dp[rows - 1][cols - 1]}`,
      variables: { answer: dp[rows - 1][cols - 1] },
      visualization: makeViz(dp.flat(), finalHi, finalLb),
    });

    return steps;
  },
};

export default countPathsInMatrix;
