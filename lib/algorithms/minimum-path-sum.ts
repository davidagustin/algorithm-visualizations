import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumPathSum: AlgorithmDefinition = {
  id: 'minimum-path-sum',
  title: 'Minimum Path Sum',
  leetcodeNumber: 64,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an m x n grid filled with non-negative numbers, find a path from the top-left to the bottom-right which minimizes the sum of all numbers along its path. You can only move right or down. dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).',
  tags: ['Dynamic Programming', 'Matrix', 'Array'],
  code: {
    pseudocode: `function minPathSum(grid):
  m = rows, n = cols
  dp = copy of grid
  for i from 0 to m-1:
    for j from 0 to n-1:
      if i == 0 and j == 0: continue
      fromTop = dp[i-1][j] if i > 0 else Infinity
      fromLeft = dp[i][j-1] if j > 0 else Infinity
      dp[i][j] = grid[i][j] + min(fromTop, fromLeft)
  return dp[m-1][n-1]`,
    python: `def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    dp = [row[:] for row in grid]
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0: continue
            top = dp[i-1][j] if i > 0 else float('inf')
            left = dp[i][j-1] if j > 0 else float('inf')
            dp[i][j] = grid[i][j] + min(top, left)
    return dp[m-1][n-1]`,
    javascript: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = grid.map(row => [...row]);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      const top = i > 0 ? dp[i-1][j] : Infinity;
      const left = j > 0 ? dp[i][j-1] : Infinity;
      dp[i][j] = grid[i][j] + Math.min(top, left);
    }
  }
  return dp[m-1][n-1];
}`,
    java: `public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            dp[i][j] = grid[i][j];
            if (i == 0 && j == 0) continue;
            int top = i > 0 ? dp[i-1][j] : Integer.MAX_VALUE;
            int left = j > 0 ? dp[i][j-1] : Integer.MAX_VALUE;
            dp[i][j] += Math.min(top, left);
        }
    return dp[m-1][n-1];
}`,
  },
  defaultInput: { grid: [[1, 3, 1], [1, 5, 1], [4, 2, 1]] },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid Values',
      type: 'array',
      defaultValue: [[1, 3, 1], [1, 5, 1], [4, 2, 1]],
      placeholder: '1,3,1;1,5,1;4,2,1',
      helperText: '2D grid of non-negative numbers. Small grids (max 4x4) work best.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const m = grid.length;
    const n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    const total = m * n;
    const idx = (i: number, j: number) => i * n + j;

    const dp: number[][] = grid.map(row => [...row]);
    // Reset dp to just the grid values initially for tracking
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        dp[i][j] = grid[i][j];

    const computed: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          arr.push(computed[i][j] ? dp[i][j] : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          labels.push(`(${i},${j})\ng=${grid[i][j]}`);
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < total; k++) {
        const i = Math.floor(k / n);
        const j = k % n;
        if (computed[i][j]) highlights[k] = 'found';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Minimum Path Sum: ${m}x${n} grid. Find path from (0,0) to (${m - 1},${n - 1}) with minimum sum. dp[i][j] = min cost to reach cell (i,j).`,
      variables: { m, n },
      visualization: makeViz(null, []),
    });

    // Process all cells
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (i === 0 && j === 0) {
          computed[0][0] = true;
          steps.push({
            line: 4,
            explanation: `dp[0][0] = grid[0][0] = ${grid[0][0]}. Starting cell cost is just its own value.`,
            variables: { 'dp[0][0]': dp[0][0] },
            visualization: makeViz(0, []),
          });
          continue;
        }

        const top = i > 0 ? dp[i - 1][j] : Infinity;
        const left = j > 0 ? dp[i][j - 1] : Infinity;
        const comparing: number[] = [];
        if (i > 0) comparing.push(idx(i - 1, j));
        if (j > 0) comparing.push(idx(i, j - 1));

        dp[i][j] = grid[i][j] + Math.min(top, left);
        computed[i][j] = true;

        const fromDir = top <= left ? `top (${top})` : `left (${left})`;
        steps.push({
          line: 8,
          explanation: `dp[${i}][${j}] = grid[${i}][${j}](${grid[i][j]}) + min(${top === Infinity ? '∞' : top}, ${left === Infinity ? '∞' : left}) = ${dp[i][j]}. Came from ${fromDir}.`,
          variables: { i, j, 'dp[i][j]': dp[i][j], top: top === Infinity ? '∞' : top, left: left === Infinity ? '∞' : left },
          visualization: makeViz(idx(i, j), comparing),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[${m - 1}][${n - 1}] = ${dp[m - 1][n - 1]}. Minimum path sum from top-left to bottom-right is ${dp[m - 1][n - 1]}.`,
      variables: { result: dp[m - 1][n - 1] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: total }, (_, k) => [k, k === total - 1 ? 'active' : 'found'])
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default minimumPathSum;
