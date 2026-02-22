import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumPathSumMatrix: AlgorithmDefinition = {
  id: 'minimum-path-sum-matrix',
  title: 'Minimum Path Sum',
  leetcodeNumber: 64,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an m x n grid filled with non-negative numbers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down. Use DP: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
  tags: ['Matrix', 'Dynamic Programming'],
  code: {
    pseudocode: `function minPathSum(grid):
  m, n = size(grid)
  dp = copy of grid
  for j from 1 to n-1: dp[0][j] += dp[0][j-1]  # first row
  for i from 1 to m-1: dp[i][0] += dp[i-1][0]  # first col
  for i from 1 to m-1:
    for j from 1 to n-1:
      dp[i][j] += min(dp[i-1][j], dp[i][j-1])
  return dp[m-1][n-1]`,
    python: `def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    dp = [row[:] for row in grid]
    for j in range(1, n): dp[0][j] += dp[0][j-1]
    for i in range(1, m): dp[i][0] += dp[i-1][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] += min(dp[i-1][j], dp[i][j-1])
    return dp[m-1][n-1]`,
    javascript: `function minPathSum(grid) {
  const m=grid.length, n=grid[0].length;
  const dp=grid.map(r=>[...r]);
  for(let j=1;j<n;j++) dp[0][j]+=dp[0][j-1];
  for(let i=1;i<m;i++) dp[i][0]+=dp[i-1][0];
  for(let i=1;i<m;i++) for(let j=1;j<n;j++) dp[i][j]+=Math.min(dp[i-1][j],dp[i][j-1]);
  return dp[m-1][n-1];
}`,
    java: `public int minPathSum(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int[][] dp=new int[m][n];
    dp[0][0]=grid[0][0];
    for(int j=1;j<n;j++) dp[0][j]=dp[0][j-1]+grid[0][j];
    for(int i=1;i<m;i++) dp[i][0]=dp[i-1][0]+grid[i][0];
    for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[i][j]=grid[i][j]+Math.min(dp[i-1][j],dp[i][j-1]);
    return dp[m-1][n-1];
}`,
  },
  defaultInput: { matrix: [[1, 3, 1], [1, 5, 1], [4, 2, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Grid',
      type: 'string',
      defaultValue: '1 3 1, 1 5 1, 4 2 1',
      placeholder: 'e.g. 1 3 1, 1 5 1, 4 2 1',
      helperText: 'Rows by commas, non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let grid: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      grid = input.matrix as number[][];
    } else {
      grid = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = grid.length, n = grid[0].length;
    const dp: number[][] = grid.map(r => [...r]);
    const steps: AlgorithmStep[] = [];

    function makeViz(curr: number, comparing: number[]): ArrayVisualization {
      const flat = dp.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${grid[ri][ci]}→${dp[ri][ci]}`;
        highlights[i] = dp[ri][ci] !== grid[ri][ci] ? 'visited' : 'default';
      }
      for (const c of comparing) highlights[c] = 'comparing';
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Min Path Sum', entries: [{ key: 'DP', value: 'grid[i][j] + min(above, left)' }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Min path sum in ${m}x${n} grid (right/down only). dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).`,
      variables: { m, n },
      visualization: makeViz(-1, []),
    });

    for (let j = 1; j < n; j++) {
      dp[0][j] += dp[0][j - 1];
      steps.push({
        line: 3,
        explanation: `First row: dp[0][${j}] = ${grid[0][j]} + dp[0][${j - 1}](${dp[0][j] - grid[0][j]}) = ${dp[0][j]}.`,
        variables: { j, val: dp[0][j] },
        visualization: makeViz(j, [j - 1]),
      });
    }

    for (let i = 1; i < m; i++) {
      dp[i][0] += dp[i - 1][0];
      steps.push({
        line: 4,
        explanation: `First col: dp[${i}][0] = ${grid[i][0]} + dp[${i - 1}][0](${dp[i][0] - grid[i][0]}) = ${dp[i][0]}.`,
        variables: { i, val: dp[i][0] },
        visualization: makeViz(i * n, [(i - 1) * n]),
      });
    }

    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const above = dp[i - 1][j], left = dp[i][j - 1];
        dp[i][j] += Math.min(above, left);
        steps.push({
          line: 8,
          explanation: `dp[${i}][${j}] = ${grid[i][j]} + min(dp[${i - 1}][${j}]=${above}, dp[${i}][${j - 1}]=${left}) = ${dp[i][j]}.`,
          variables: { i, j, val: dp[i][j], above, left },
          visualization: makeViz(i * n + j, [(i - 1) * n + j, i * n + j - 1]),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum path sum = dp[${m - 1}][${n - 1}] = ${dp[m - 1][n - 1]}.`,
      variables: { result: dp[m - 1][n - 1] },
      visualization: makeViz((m - 1) * n + (n - 1), []),
    });

    return steps;
  },
};

export default minimumPathSumMatrix;
