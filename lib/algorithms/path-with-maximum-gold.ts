import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pathWithMaximumGold: AlgorithmDefinition = {
  id: 'path-with-maximum-gold',
  title: 'Path with Maximum Gold',
  leetcodeNumber: 1219,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'In a gold mine grid, each cell contains some gold (0 means no gold/blocked). You can start at any non-zero cell and move up/down/left/right, but cannot revisit cells or enter zero cells. Find the path that collects the maximum amount of gold using DFS backtracking from every valid starting cell.',
  tags: ['backtracking', 'dfs', 'matrix', 'recursion'],

  code: {
    pseudocode: `function getMaximumGold(grid):
  maxGold = 0
  function dfs(r, c, current):
    if out of bounds or grid[r][c] == 0: return
    gold = grid[r][c]
    grid[r][c] = 0  // mark visited
    current += gold
    maxGold = max(maxGold, current)
    dfs(r+1,c,current); dfs(r-1,c,current)
    dfs(r,c+1,current); dfs(r,c-1,current)
    grid[r][c] = gold  // restore
  for each cell (r,c):
    if grid[r][c] != 0: dfs(r, c, 0)
  return maxGold`,
    python: `def getMaximumGold(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    max_gold = 0
    def dfs(r, c, curr):
        nonlocal max_gold
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0: return
        gold = grid[r][c]
        grid[r][c] = 0
        curr += gold
        max_gold = max(max_gold, curr)
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            dfs(r+dr, c+dc, curr)
        grid[r][c] = gold
    for r in range(rows):
        for c in range(cols):
            if grid[r][c]: dfs(r, c, 0)
    return max_gold`,
    javascript: `function getMaximumGold(grid) {
  const rows = grid.length, cols = grid[0].length;
  let maxGold = 0;
  function dfs(r, c, curr) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return;
    const gold = grid[r][c];
    grid[r][c] = 0;
    curr += gold;
    maxGold = Math.max(maxGold, curr);
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) dfs(r+dr, c+dc, curr);
    grid[r][c] = gold;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c]) dfs(r, c, 0);
  return maxGold;
}`,
    java: `public int getMaximumGold(int[][] grid) {
    int rows = grid.length, cols = grid[0].length, max = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] != 0) max = Math.max(max, dfs(grid, r, c, rows, cols));
    return max;
}
private int dfs(int[][] grid, int r, int c, int rows, int cols) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0) return 0;
    int gold = grid[r][c]; grid[r][c] = 0;
    int max = 0;
    for (int[] d : new int[][]{{1,0},{-1,0},{0,1},{0,-1}}) max = Math.max(max, dfs(grid, r+d[0], c+d[1], rows, cols));
    grid[r][c] = gold;
    return gold + max;
}`,
  },

  defaultInput: {
    grid: [
      [0, 6, 0],
      [5, 8, 7],
      [0, 9, 0],
    ],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flat, row by row)',
      type: 'array',
      defaultValue: [0, 6, 0, 5, 8, 7, 0, 9, 0],
      placeholder: '0,6,0,5,8,7,0,9,0',
      helperText: 'Gold grid values (0=blocked), 3x3 grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];

    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);

    const flatGrid = (): number[] => grid.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatGrid(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find path with maximum gold in ${rows}x${cols} grid. Try DFS from every non-zero cell, mark visited, backtrack.`,
      variables: { rows, cols, totalCells: rows * cols },
      visualization: makeViz({}, Object.fromEntries(flatGrid().map((v, i) => [i, v === 0 ? 'X' : String(v)]))),
    });

    let maxGold = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    function dfs(r: number, c: number, curr: number) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return;
      const gold = grid[r][c];
      grid[r][c] = 0;
      curr += gold;
      maxGold = Math.max(maxGold, curr);

      if (steps.length < 30) {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        flatGrid().forEach((v, i) => {
          if (i === r * cols + c) { h[i] = 'active'; l[i] = `+${gold}`; }
          else if (v === 0) { h[i] = 'mismatch'; l[i] = 'X'; }
          else { l[i] = String(v); }
        });
        steps.push({
          line: 7,
          explanation: `Collect ${gold} gold at (${r},${c}). Running total: ${curr}. Max so far: ${maxGold}.`,
          variables: { row: r, col: c, goldCollected: gold, currentTotal: curr, maxGold },
          visualization: makeViz(h, l),
        });
      }

      for (const [dr, dc] of dirs) dfs(r + dr, c + dc, curr);
      grid[r][c] = gold;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== 0) {
          steps.push({
            line: 11,
            explanation: `Start DFS from cell (${r},${c}) with ${grid[r][c]} gold.`,
            variables: { startRow: r, startCol: c, startGold: grid[r][c], maxGold },
            visualization: makeViz(
              { [r * cols + c]: 'pointer' },
              Object.fromEntries(flatGrid().map((v, i) => [i, v === 0 ? 'X' : String(v)]))
            ),
          });
          dfs(r, c, 0);
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Maximum gold collectible: ${maxGold}.`,
      variables: { maxGold },
      visualization: makeViz({}, Object.fromEntries(rawGrid.flat().map((v, i) => [i, v === 0 ? 'X' : String(v)]))),
    });

    return steps;
  },
};

export default pathWithMaximumGold;
