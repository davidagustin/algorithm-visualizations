import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const uniquePathsWithObstacles: AlgorithmDefinition = {
  id: 'unique-paths-with-obstacles',
  title: 'Unique Paths II',
  leetcodeNumber: 63,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A robot starts at the top-left of an m x n grid with obstacles. It can only move right or down. Count the number of unique paths to the bottom-right corner, avoiding cells marked with 1 (obstacles). dp[i][j] = 0 if obstacle, else dp[i-1][j] + dp[i][j-1].',
  tags: ['Dynamic Programming', 'Matrix', 'Array'],
  code: {
    pseudocode: `function uniquePathsWithObstacles(grid):
  m = rows, n = cols
  if grid[0][0] == 1: return 0
  dp = m x n matrix of 0s
  dp[0][0] = 1
  for i from 0 to m-1:
    for j from 0 to n-1:
      if grid[i][j] == 1: dp[i][j] = 0
      else if i > 0: dp[i][j] += dp[i-1][j]
      else if j > 0: dp[i][j] += dp[i][j-1]
  return dp[m-1][n-1]`,
    python: `def uniquePathsWithObstacles(obstacleGrid):
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    dp = [[0]*n for _ in range(m)]
    dp[0][0] = 1 if obstacleGrid[0][0] == 0 else 0
    for i in range(m):
        for j in range(n):
            if obstacleGrid[i][j] == 1:
                dp[i][j] = 0
            else:
                if i > 0: dp[i][j] += dp[i-1][j]
                if j > 0: dp[i][j] += dp[i][j-1]
    return dp[m-1][n-1]`,
    javascript: `function uniquePathsWithObstacles(obstacleGrid) {
  const m = obstacleGrid.length, n = obstacleGrid[0].length;
  const dp = Array.from({length: m}, () => new Array(n).fill(0));
  dp[0][0] = obstacleGrid[0][0] === 0 ? 1 : 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 1) { dp[i][j] = 0; continue; }
      if (i > 0) dp[i][j] += dp[i-1][j];
      if (j > 0) dp[i][j] += dp[i][j-1];
    }
  }
  return dp[m-1][n-1];
}`,
    java: `public int uniquePathsWithObstacles(int[][] obstacleGrid) {
    int m = obstacleGrid.length, n = obstacleGrid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (obstacleGrid[i][j] == 1) { dp[i][j] = 0; continue; }
            if (i > 0) dp[i][j] += dp[i-1][j];
            if (j > 0) dp[i][j] += dp[i][j-1];
        }
    }
    return dp[m-1][n-1];
}`,
  },
  defaultInput: { grid: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
  inputFields: [
    {
      name: 'grid',
      label: 'Obstacle Grid (rows as arrays)',
      type: 'array',
      defaultValue: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
      placeholder: '0,0,0;0,1,0;0,0,0',
      helperText: '2D grid where 1 = obstacle. Small grids (max 4x4) work best.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const grid = rawGrid;
    const m = grid.length;
    const n = grid[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const total = m * n;
    const idx = (i: number, j: number) => i * n + j;

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          arr.push(grid[i][j] === 1 ? null : dp[i][j]);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          labels.push(grid[i][j] === 1 ? 'X' : `(${i},${j})`);
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < total; k++) {
        const i = Math.floor(k / n);
        const j = k % n;
        if (grid[i][j] === 1) {
          highlights[k] = 'mismatch';
        } else if (dp[i][j] > 0) {
          highlights[k] = 'found';
        }
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Unique Paths II: ${m}x${n} grid with obstacles. Count paths from (0,0) to (${m - 1},${n - 1}) moving only right or down.`,
      variables: { m, n },
      visualization: makeViz(null, []),
    });

    if (grid[0][0] === 1) {
      steps.push({
        line: 2,
        explanation: 'Start cell (0,0) is an obstacle. Return 0.',
        variables: { result: 0 },
        visualization: makeViz(0, []),
      });
      return steps;
    }

    dp[0][0] = 1;
    steps.push({
      line: 4,
      explanation: 'dp[0][0] = 1. One way to be at the start.',
      variables: { 'dp[0][0]': 1 },
      visualization: makeViz(idx(0, 0), []),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (i === 0 && j === 0) continue;
        if (grid[i][j] === 1) {
          dp[i][j] = 0;
          steps.push({
            line: 7,
            explanation: `Cell (${i},${j}) is an obstacle. dp[${i}][${j}] = 0.`,
            variables: { i, j },
            visualization: makeViz(idx(i, j), []),
          });
          continue;
        }
        const comparing: number[] = [];
        if (i > 0) comparing.push(idx(i - 1, j));
        if (j > 0) comparing.push(idx(i, j - 1));

        if (i > 0) dp[i][j] += dp[i - 1][j];
        if (j > 0) dp[i][j] += dp[i][j - 1];

        steps.push({
          line: 9,
          explanation: `dp[${i}][${j}] = ${i > 0 ? `dp[${i - 1}][${j}]=${dp[i - 1][j]}` : '0'} + ${j > 0 ? `dp[${i}][${j - 1}]=${dp[i][j - 1]}` : '0'} = ${dp[i][j]}.`,
          variables: { i, j, 'dp[i][j]': dp[i][j] },
          visualization: makeViz(idx(i, j), comparing),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `dp[${m - 1}][${n - 1}] = ${dp[m - 1][n - 1]}. There are ${dp[m - 1][n - 1]} unique paths avoiding obstacles.`,
      variables: { result: dp[m - 1][n - 1] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: total }, (_, k) => {
            const i = Math.floor(k / n);
            const j = k % n;
            if (grid[i][j] === 1) return [k, 'mismatch'];
            if (k === total - 1) return [k, 'active'];
            return [k, 'found'];
          })
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default uniquePathsWithObstacles;
