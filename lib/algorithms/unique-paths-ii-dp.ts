import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniquePathsIiDp: AlgorithmDefinition = {
  id: 'unique-paths-ii-dp',
  title: 'Unique Paths II - With Obstacles (DP)',
  leetcodeNumber: 63,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count unique paths from top-left to bottom-right of a grid with obstacles. A cell with value 1 is an obstacle. If start or end is blocked, return 0. dp[r][c] = number of paths to reach (r,c); if cell is obstacle, dp[r][c] = 0. Otherwise sum from above and left.',
  tags: ['dynamic programming', 'grid', 'obstacle', 'combinatorics'],

  code: {
    pseudocode: `function uniquePathsWithObstacles(grid):
  rows, cols = dimensions
  if grid[0][0] == 1 or grid[rows-1][cols-1] == 1: return 0
  dp = copy of grid
  dp[0][0] = 1
  fill first column: dp[r][0] = dp[r-1][0] if no obstacle else 0
  fill first row: dp[0][c] = dp[0][c-1] if no obstacle else 0
  for r, c from 1 to end:
    dp[r][c] = 0 if obstacle else dp[r-1][c] + dp[r][c-1]
  return dp[rows-1][cols-1]`,
    python: `def uniquePathsWithObstacles(obstacleGrid):
    rows,cols=len(obstacleGrid),len(obstacleGrid[0])
    if obstacleGrid[0][0] or obstacleGrid[-1][-1]: return 0
    dp=[[0]*cols for _ in range(rows)]
    dp[0][0]=1
    for r in range(1,rows): dp[r][0]=dp[r-1][0] if not obstacleGrid[r][0] else 0
    for c in range(1,cols): dp[0][c]=dp[0][c-1] if not obstacleGrid[0][c] else 0
    for r in range(1,rows):
        for c in range(1,cols):
            dp[r][c]=0 if obstacleGrid[r][c] else dp[r-1][c]+dp[r][c-1]
    return dp[-1][-1]`,
    javascript: `function uniquePathsWithObstacles(obstacleGrid) {
  const rows=obstacleGrid.length,cols=obstacleGrid[0].length;
  if(obstacleGrid[0][0]||obstacleGrid[rows-1][cols-1]) return 0;
  const dp=Array.from({length:rows},()=>Array(cols).fill(0));
  dp[0][0]=1;
  for(let r=1;r<rows;r++) dp[r][0]=obstacleGrid[r][0]?0:dp[r-1][0];
  for(let c=1;c<cols;c++) dp[0][c]=obstacleGrid[0][c]?0:dp[0][c-1];
  for(let r=1;r<rows;r++)
    for(let c=1;c<cols;c++)
      dp[r][c]=obstacleGrid[r][c]?0:dp[r-1][c]+dp[r][c-1];
  return dp[rows-1][cols-1];
}`,
    java: `public int uniquePathsWithObstacles(int[][] g) {
    int rows=g.length,cols=g[0].length;
    if(g[0][0]==1||g[rows-1][cols-1]==1) return 0;
    int[][] dp=new int[rows][cols];
    dp[0][0]=1;
    for(int r=1;r<rows;r++) dp[r][0]=g[r][0]==1?0:dp[r-1][0];
    for(int c=1;c<cols;c++) dp[0][c]=g[0][c]==1?0:dp[0][c-1];
    for(int r=1;r<rows;r++)
        for(int c=1;c<cols;c++)
            dp[r][c]=g[r][c]==1?0:dp[r-1][c]+dp[r][c-1];
    return dp[rows-1][cols-1];
}`,
  },

  defaultInput: {
    grid: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Obstacle Grid (0=free, 1=obstacle)',
      type: 'array',
      defaultValue: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
      placeholder: '[[0,0,0],[0,1,0],[0,0,0]]',
      helperText: '2D grid: 0=free cell, 1=obstacle',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const obstacleGrid = input.grid as number[][];
    const rows = obstacleGrid.length;
    const cols = obstacleGrid[0].length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Grid ${rows}x${cols} with obstacles (1). Count paths from (0,0) to (${rows - 1},${cols - 1}) moving right/down.`,
      variables: { rows, cols },
      visualization: makeViz(obstacleGrid.flat(), { 0: 'active', [(rows - 1) * cols + (cols - 1)]: 'found' }, {}),
    });

    if (obstacleGrid[0][0] === 1 || obstacleGrid[rows - 1][cols - 1] === 1) {
      steps.push({
        line: 2,
        explanation: 'Start or end cell is blocked by obstacle. Answer is 0.',
        variables: { answer: 0 },
        visualization: makeViz(obstacleGrid.flat(), {}, {}),
      });
      return steps;
    }

    const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    dp[0][0] = 1;

    for (let r = 1; r < rows; r++) dp[r][0] = obstacleGrid[r][0] ? 0 : dp[r - 1][0];
    for (let c = 1; c < cols; c++) dp[0][c] = obstacleGrid[0][c] ? 0 : dp[0][c - 1];

    const initHi: Record<number, string> = { 0: 'active' };
    const initLb: Record<number, string> = {};
    for (let r = 0; r < rows; r++) { initHi[r * cols] = obstacleGrid[r][0] ? 'mismatch' : 'active'; initLb[r * cols] = `${dp[r][0]}`; }
    for (let c = 0; c < cols; c++) { initHi[c] = obstacleGrid[0][c] ? 'mismatch' : 'found'; initLb[c] = `${dp[0][c]}`; }
    steps.push({
      line: 6,
      explanation: 'Fill first row and column. Obstacle cells = 0, others carry forward the count.',
      variables: { firstCol: Array.from({ length: rows }, (_, r) => dp[r][0]), firstRow: [...dp[0]] },
      visualization: makeViz(dp.flat(), initHi, initLb),
    });

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        if (obstacleGrid[r][c]) {
          dp[r][c] = 0;
          const hi: Record<number, string> = { [r * cols + c]: 'mismatch' };
          const lb: Record<number, string> = { [r * cols + c]: 'obstacle' };
          steps.push({
            line: 9,
            explanation: `Cell (${r},${c}) is an obstacle. dp[${r}][${c}] = 0.`,
            variables: { r, c, obstacle: true },
            visualization: makeViz(dp.flat(), hi, lb),
          });
        } else {
          dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
          const hi: Record<number, string> = {};
          const lb: Record<number, string> = {};
          hi[r * cols + c] = 'active';
          hi[(r - 1) * cols + c] = 'comparing';
          hi[r * cols + (c - 1)] = 'comparing';
          lb[r * cols + c] = `${dp[r][c]}`;
          steps.push({
            line: 9,
            explanation: `dp[${r}][${c}] = dp[${r - 1}][${c}](${dp[r - 1][c]}) + dp[${r}][${c - 1}](${dp[r][c - 1]}) = ${dp[r][c]}`,
            variables: { r, c, fromAbove: dp[r - 1][c], fromLeft: dp[r][c - 1], paths: dp[r][c] },
            visualization: makeViz(dp.flat(), hi, lb),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Total unique paths with obstacles = ${dp[rows - 1][cols - 1]}`,
      variables: { answer: dp[rows - 1][cols - 1] },
      visualization: makeViz(dp.flat(), { [(rows - 1) * cols + (cols - 1)]: 'found' }, { [(rows - 1) * cols + (cols - 1)]: `${dp[rows - 1][cols - 1]}` }),
    });

    return steps;
  },
};

export default uniquePathsIiDp;
