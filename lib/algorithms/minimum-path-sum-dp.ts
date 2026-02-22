import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumPathSumDp: AlgorithmDefinition = {
  id: 'minimum-path-sum-dp',
  title: 'Minimum Path Sum (DP)',
  leetcodeNumber: 64,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the path from top-left to bottom-right of a grid with the minimum sum of values. You can only move right or down. Use DP where dp[r][c] = minimum cost to reach cell (r,c). First row and column have only one way to reach them; interior cells take the minimum of coming from above or left.',
  tags: ['dynamic programming', 'grid', 'path', 'optimization'],

  code: {
    pseudocode: `function minPathSum(grid):
  rows, cols = dimensions
  dp = copy of grid
  for r from 1 to rows-1: dp[r][0] += dp[r-1][0]  (first col)
  for c from 1 to cols-1: dp[0][c] += dp[0][c-1]  (first row)
  for r from 1 to rows-1:
    for c from 1 to cols-1:
      dp[r][c] += min(dp[r-1][c], dp[r][c-1])
  return dp[rows-1][cols-1]`,
    python: `def minPathSum(grid):
    rows,cols=len(grid),len(grid[0])
    dp=[row[:] for row in grid]
    for r in range(1,rows): dp[r][0]+=dp[r-1][0]
    for c in range(1,cols): dp[0][c]+=dp[0][c-1]
    for r in range(1,rows):
        for c in range(1,cols):
            dp[r][c]+=min(dp[r-1][c],dp[r][c-1])
    return dp[-1][-1]`,
    javascript: `function minPathSum(grid) {
  const rows=grid.length,cols=grid[0].length;
  const dp=grid.map(r=>[...r]);
  for(let r=1;r<rows;r++) dp[r][0]+=dp[r-1][0];
  for(let c=1;c<cols;c++) dp[0][c]+=dp[0][c-1];
  for(let r=1;r<rows;r++)
    for(let c=1;c<cols;c++)
      dp[r][c]+=Math.min(dp[r-1][c],dp[r][c-1]);
  return dp[rows-1][cols-1];
}`,
    java: `public int minPathSum(int[][] grid) {
    int rows=grid.length,cols=grid[0].length;
    int[][] dp=new int[rows][cols];
    dp[0][0]=grid[0][0];
    for(int r=1;r<rows;r++) dp[r][0]=dp[r-1][0]+grid[r][0];
    for(int c=1;c<cols;c++) dp[0][c]=dp[0][c-1]+grid[0][c];
    for(int r=1;r<rows;r++)
        for(int c=1;c<cols;c++)
            dp[r][c]=grid[r][c]+Math.min(dp[r-1][c],dp[r][c-1]);
    return dp[rows-1][cols-1];
}`,
  },

  defaultInput: {
    grid: [[1, 3, 1], [1, 5, 1], [4, 2, 1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Cost Grid',
      type: 'array',
      defaultValue: [[1, 3, 1], [1, 5, 1], [4, 2, 1]],
      placeholder: '[[1,3,1],[1,5,1],[4,2,1]]',
      helperText: '2D grid of non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const rows = grid.length;
    const cols = grid[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = grid.map(r => [...r]);

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Grid ${rows}x${cols}. Find minimum cost path from top-left to bottom-right moving only right or down.`,
      variables: { rows, cols },
      visualization: makeViz(grid.flat(), { 0: 'active' }, { 0: 'start' }),
    });

    // Fill first column
    for (let r = 1; r < rows; r++) dp[r][0] += dp[r - 1][0];
    const hi1: Record<number, string> = {};
    const lb1: Record<number, string> = {};
    for (let r = 0; r < rows; r++) { hi1[r * cols] = 'active'; lb1[r * cols] = `${dp[r][0]}`; }
    steps.push({
      line: 3,
      explanation: `Fill first column: each cell = grid[r][0] + dp[r-1][0]. Values: [${Array.from({ length: rows }, (_, r) => dp[r][0]).join(', ')}]`,
      variables: { direction: 'first column' },
      visualization: makeViz(dp.flat(), hi1, lb1),
    });

    // Fill first row
    for (let c = 1; c < cols; c++) dp[0][c] += dp[0][c - 1];
    const hi2: Record<number, string> = {};
    const lb2: Record<number, string> = {};
    for (let c = 0; c < cols; c++) { hi2[c] = 'found'; lb2[c] = `${dp[0][c]}`; }
    steps.push({
      line: 4,
      explanation: `Fill first row: each cell = grid[0][c] + dp[0][c-1]. Values: [${dp[0].join(', ')}]`,
      variables: { direction: 'first row' },
      visualization: makeViz(dp.flat(), hi2, lb2),
    });

    // Fill interior
    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const fromAbove = dp[r - 1][c];
        const fromLeft = dp[r][c - 1];
        dp[r][c] += Math.min(fromAbove, fromLeft);

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = 'active';
        hi[(r - 1) * cols + c] = 'comparing';
        hi[r * cols + (c - 1)] = 'comparing';
        lb[r * cols + c] = `${dp[r][c]}`;

        steps.push({
          line: 7,
          explanation: `dp[${r}][${c}] = grid[${r}][${c}](${grid[r][c]}) + min(above=${fromAbove}, left=${fromLeft}) = ${dp[r][c]}`,
          variables: { r, c, fromAbove, fromLeft, dp: dp[r][c] },
          visualization: makeViz(dp.flat(), hi, lb),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Minimum path sum = ${dp[rows - 1][cols - 1]}`,
      variables: { answer: dp[rows - 1][cols - 1] },
      visualization: makeViz(dp.flat(), { [(rows - 1) * cols + (cols - 1)]: 'found' }, { [(rows - 1) * cols + (cols - 1)]: `ans:${dp[rows - 1][cols - 1]}` }),
    });

    return steps;
  },
};

export default minimumPathSumDp;
