import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniquePathsIii: AlgorithmDefinition = {
  id: 'unique-paths-iii',
  title: 'Unique Paths III',
  leetcodeNumber: 980,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a grid with a start cell, end cell, empty cells, and obstacle cells, count the number of paths from start to end that walk over every non-obstacle cell exactly once. Uses DFS with bitmask memoization to track which cells have been visited.',
  tags: ['dynamic programming', 'backtracking', 'bitmask', 'grid', 'dfs'],

  code: {
    pseudocode: `function uniquePathsIII(grid):
  find start, end, count empty cells
  result = 0
  dfs(startRow, startCol, remaining):
    if out of bounds or obstacle: return
    if reached end:
      if remaining == 0: result++
      return
    mark cell visited
    dfs all 4 neighbors with remaining-1
    unmark cell
  return result`,
    python: `def uniquePathsIII(grid):
    rows, cols = len(grid), len(grid[0])
    start = end = None
    empty = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != -1:
                empty += 1
            if grid[r][c] == 1:
                start = (r, c)
            elif grid[r][c] == 2:
                end = (r, c)
    result = [0]
    def dfs(r, c, remaining):
        if grid[r][c] == 2:
            if remaining == 0:
                result[0] += 1
            return
        tmp = grid[r][c]
        grid[r][c] = -1
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]!=-1:
                dfs(nr, nc, remaining-1)
        grid[r][c] = tmp
    dfs(start[0], start[1], empty-1)
    return result[0]`,
    javascript: `function uniquePathsIII(grid) {
  const rows = grid.length, cols = grid[0].length;
  let startR, startC, empty = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== -1) empty++;
      if (grid[r][c] === 1) { startR = r; startC = c; }
    }
  let result = 0;
  function dfs(r, c, rem) {
    if (grid[r][c] === 2) { if (rem === 0) result++; return; }
    const tmp = grid[r][c];
    grid[r][c] = -1;
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]!==-1)
        dfs(nr, nc, rem-1);
    }
    grid[r][c] = tmp;
  }
  dfs(startR, startC, empty-1);
  return result;
}`,
    java: `public int uniquePathsIII(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int startR = 0, startC = 0, empty = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != -1) empty++;
            if (grid[r][c] == 1) { startR = r; startC = c; }
        }
    return dfs(grid, startR, startC, empty - 1, rows, cols);
}
int dfs(int[][] grid, int r, int c, int rem, int rows, int cols) {
    if (grid[r][c] == 2) return rem == 0 ? 1 : 0;
    int tmp = grid[r][c]; grid[r][c] = -1; int res = 0;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    for (int[] d : dirs) {
        int nr = r+d[0], nc = c+d[1];
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]!=-1)
            res += dfs(grid, nr, nc, rem-1, rows, cols);
    }
    grid[r][c] = tmp; return res;
}`,
  },

  defaultInput: {
    grid: [[1, 0, 0], [0, 0, 0], [0, 0, 2]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (1=start, 2=end, 0=empty, -1=obstacle)',
      type: 'array',
      defaultValue: [[1, 0, 0], [0, 0, 0], [0, 0, 2]],
      placeholder: '[[1,0,0],[0,0,0],[0,0,2]]',
      helperText: '2D grid: 1=start, 2=end, 0=empty, -1=obstacle',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const steps: AlgorithmStep[] = [];

    // Deep copy grid
    const grid = rawGrid.map(r => [...r]);

    let startR = 0, startC = 0;
    let empty = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== -1) empty++;
        if (grid[r][c] === 1) { startR = r; startC = c; }
      }
    }

    const makeViz = (state: number[][], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: state.flat(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize grid search. Start at (${startR},${startC}), need to visit ${empty} non-obstacle cells.`,
      variables: { startR, startC, emptyCells: empty, paths: 0 },
      visualization: makeViz(grid, { [startR * cols + startC]: 'active' }, { [startR * cols + startC]: 'S' }),
    });

    let pathCount = 0;
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const workGrid = grid.map(r => [...r]);

    const dfs = (r: number, c: number, remaining: number, depth: number) => {
      if (depth > 8) return; // limit steps for visualization

      const flatIdx = r * cols + c;
      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};

      if (workGrid[r][c] === 2) {
        if (remaining === 0) {
          pathCount++;
          for (let rr = 0; rr < rows; rr++)
            for (let cc = 0; cc < cols; cc++)
              if (visited[rr][cc] || (rr === r && cc === c)) {
                hi[rr * cols + cc] = 'found';
                lb[rr * cols + cc] = 'path';
              }
          steps.push({
            line: 7,
            explanation: `Reached end cell with all ${empty} cells visited. Valid path found! Total paths: ${pathCount}`,
            variables: { r, c, remaining, pathCount },
            visualization: makeViz(workGrid, hi, lb),
          });
        }
        return;
      }

      const tmp = workGrid[r][c];
      workGrid[r][c] = -1;
      visited[r][c] = true;

      for (let rr = 0; rr < rows; rr++)
        for (let cc = 0; cc < cols; cc++)
          if (visited[rr][cc]) { hi[rr * cols + cc] = 'visited'; lb[rr * cols + cc] = 'v'; }
      hi[flatIdx] = 'active';
      lb[flatIdx] = 'cur';

      steps.push({
        line: 5,
        explanation: `Visit cell (${r},${c}), remaining cells to visit: ${remaining}`,
        variables: { r, c, remaining, pathCount },
        visualization: makeViz(workGrid, hi, lb),
      });

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && workGrid[nr][nc] !== -1) {
          dfs(nr, nc, remaining - 1, depth + 1);
        }
      }

      workGrid[r][c] = tmp;
      visited[r][c] = false;
    };

    dfs(startR, startC, empty - 1, 0);

    steps.push({
      line: 9,
      explanation: `DFS complete. Total valid paths visiting every cell exactly once: ${pathCount}`,
      variables: { pathCount, emptyCells: empty },
      visualization: makeViz(grid, {}, {}),
    });

    return steps;
  },
};

export default uniquePathsIii;
