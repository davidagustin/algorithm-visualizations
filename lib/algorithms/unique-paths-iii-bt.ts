import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniquePathsIiiBt: AlgorithmDefinition = {
  id: 'unique-paths-iii-bt',
  title: 'Unique Paths III (Backtracking)',
  leetcodeNumber: 980,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'On a 2D grid, find the number of paths from the starting square (value 1) to the ending square (value 2) that pass over every non-obstacle square exactly once. Squares with value -1 are obstacles. Use DFS backtracking, marking visited cells and counting valid complete paths.',
  tags: ['backtracking', 'dfs', 'matrix', 'recursion'],

  code: {
    pseudocode: `function uniquePathsIII(grid):
  start, end, empty = find_positions(grid)
  count = 0
  function dfs(r, c, remaining):
    nonlocal count
    if (r,c) == end:
      if remaining == 0: count += 1
      return
    if out_of_bounds or obstacle or visited: return
    grid[r][c] = -1  // mark visited
    for each direction:
      dfs(neighbor, remaining-1)
    grid[r][c] = restore  // unmark
  dfs(start, empty)
  return count`,
    python: `def uniquePathsIII(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    start = end = None
    empty = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != -1: empty += 1
            if grid[r][c] == 1: start = (r, c)
            if grid[r][c] == 2: end = (r, c)
    count = 0
    def dfs(r, c, rem):
        nonlocal count
        if (r, c) == end:
            if rem == 0: count += 1
            return
        if r < 0 or r >= rows or c < 0 or c >= cols: return
        if grid[r][c] == -1: return
        tmp = grid[r][c]
        grid[r][c] = -1
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            dfs(r+dr, c+dc, rem-1)
        grid[r][c] = tmp
    dfs(*start, empty - 1)
    return count`,
    javascript: `function uniquePathsIII(grid) {
  const rows = grid.length, cols = grid[0].length;
  let start, end, empty = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (grid[r][c] !== -1) empty++;
    if (grid[r][c] === 1) start = [r, c];
    if (grid[r][c] === 2) end = [r, c];
  }
  let count = 0;
  function dfs(r, c, rem) {
    if (r === end[0] && c === end[1]) { if (rem === 0) count++; return; }
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === -1) return;
    const tmp = grid[r][c]; grid[r][c] = -1;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) dfs(r+dr, c+dc, rem-1);
    grid[r][c] = tmp;
  }
  dfs(start[0], start[1], empty - 1);
  return count;
}`,
    java: `public int uniquePathsIII(int[][] grid) {
    int rows = grid.length, cols = grid[0].length, empty = 0;
    int sr = 0, sc = 0;
    for (int r = 0; r < rows; r++) for (int c = 0; c < cols; c++) {
        if (grid[r][c] != -1) empty++;
        if (grid[r][c] == 1) { sr = r; sc = c; }
    }
    return dfs(grid, sr, sc, empty - 1, rows, cols);
}
private int dfs(int[][] g, int r, int c, int rem, int rows, int cols) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || g[r][c] == -1) return 0;
    if (g[r][c] == 2) return rem == 0 ? 1 : 0;
    int tmp = g[r][c]; g[r][c] = -1; int res = 0;
    for (int[] d : new int[][]{{1,0},{-1,0},{0,1},{0,-1}}) res += dfs(g, r+d[0], c+d[1], rem-1, rows, cols);
    g[r][c] = tmp; return res;
}`,
  },

  defaultInput: {
    grid: [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 2, -1],
    ],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flat)',
      type: 'array',
      defaultValue: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, -1],
      placeholder: '1,0,0,0,0,0,0,0,0,0,2,-1',
      helperText: '1=start, 2=end, -1=obstacle, 0=empty (3x4 grid)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];

    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);

    let startR = 0, startC = 0, endR = 0, endC = 0, empty = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== -1) empty++;
        if (grid[r][c] === 1) { startR = r; startC = c; }
        if (grid[r][c] === 2) { endR = r; endC = c; }
      }
    }

    const flatGrid = (): number[] => grid.flat();
    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatGrid(),
      highlights,
      labels,
    });

    const cellLabel = (v: number): string => {
      if (v === 1) return 'S';
      if (v === 2) return 'E';
      if (v === -1) return 'X';
      return String(v);
    };

    steps.push({
      line: 1,
      explanation: `Unique Paths III: find all paths from S(${startR},${startC}) to E(${endR},${endC}) visiting all ${empty} non-obstacle cells exactly once.`,
      variables: { start: `(${startR},${startC})`, end: `(${endR},${endC})`, emptySquares: empty },
      visualization: makeViz(
        { [startR * cols + startC]: 'active', [endR * cols + endC]: 'found' },
        Object.fromEntries(rawGrid.flat().map((v, i) => [i, cellLabel(v)]))
      ),
    });

    let count = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    function dfs(r: number, c: number, rem: number) {
      if (r === endR && c === endC) {
        if (rem === 0) {
          count++;
          if (steps.length < 40) {
            steps.push({
              line: 7,
              explanation: `Reached end at (${r},${c}) with 0 remaining cells. Valid path #${count}!`,
              variables: { pathCount: count, remaining: rem },
              visualization: makeViz({ [r * cols + c]: 'found' }, Object.fromEntries(rawGrid.flat().map((v, i) => [i, cellLabel(v)]))),
            });
          }
        }
        return;
      }
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === -1) return;

      const tmp = grid[r][c];
      grid[r][c] = -1;

      if (steps.length < 25) {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        flatGrid().forEach((v, i) => {
          if (i === r * cols + c) { h[i] = 'active'; l[i] = 'V'; }
          else if (v === -1) { h[i] = 'mismatch'; l[i] = 'X'; }
          else { l[i] = cellLabel(v); }
        });
        steps.push({
          line: 9,
          explanation: `Visit (${r},${c}), mark as visited. Remaining to visit: ${rem - 1}.`,
          variables: { row: r, col: c, remaining: rem - 1, pathsFound: count },
          visualization: makeViz(h, l),
        });
      }

      for (const [dr, dc] of dirs) dfs(r + dr, c + dc, rem - 1);
      grid[r][c] = tmp;
    }

    dfs(startR, startC, empty - 1);

    steps.push({
      line: 13,
      explanation: `Total unique paths visiting every non-obstacle cell exactly once: ${count}.`,
      variables: { uniquePaths: count },
      visualization: makeViz(
        { [startR * cols + startC]: 'active', [endR * cols + endC]: 'found' },
        Object.fromEntries(rawGrid.flat().map((v, i) => [i, cellLabel(v)]))
      ),
    });

    return steps;
  },
};

export default uniquePathsIiiBt;
