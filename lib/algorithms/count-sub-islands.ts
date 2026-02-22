import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubIslands: AlgorithmDefinition = {
  id: 'count-sub-islands',
  title: 'Count Sub Islands',
  leetcodeNumber: 1905,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given two binary grids grid1 and grid2, count the number of islands in grid2 that are sub-islands of grid1. An island in grid2 is a sub-island if every land cell in that island also corresponds to a land cell in grid1. Use DFS to traverse each island in grid2 and verify.',
  tags: ['graph', 'dfs', 'island', 'matrix', 'sub-island'],

  code: {
    pseudocode: `function countSubIslands(grid1, grid2):
  rows, cols = dimensions
  count = 0
  for each cell (r, c):
    if grid2[r][c] == 1:
      isSub = dfs(r, c, grid1, grid2)
      if isSub: count += 1
  return count

function dfs(r, c, grid1, grid2):
  if out of bounds or grid2[r][c] == 0: return true
  grid2[r][c] = 0  // mark visited
  isSub = grid1[r][c] == 1  // this cell valid in grid1?
  for each direction:
    isSub = dfs(neighbor) and isSub
  return isSub`,

    python: `def countSubIslands(grid1, grid2):
    rows, cols = len(grid1), len(grid1[0])
    def dfs(r, c):
        if r<0 or r>=rows or c<0 or c>=cols or grid2[r][c]==0:
            return True
        grid2[r][c] = 0
        res = grid1[r][c] == 1
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            res = dfs(r+dr, c+dc) and res
        return res
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid2[r][c] == 1:
                if dfs(r, c): count += 1
    return count`,

    javascript: `function countSubIslands(grid1, grid2) {
  const rows = grid1.length, cols = grid1[0].length;
  function dfs(r, c) {
    if (r<0||r>=rows||c<0||c>=cols||grid2[r][c]===0) return true;
    grid2[r][c] = 0;
    let res = grid1[r][c] === 1;
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]])
      res = dfs(r+dr,c+dc) && res;
    return res;
  }
  let count = 0;
  for (let r=0;r<rows;r++) for(let c=0;c<cols;c++)
    if (grid2[r][c]===1 && dfs(r,c)) count++;
  return count;
}`,

    java: `public int countSubIslands(int[][] grid1, int[][] grid2) {
    int rows = grid1.length, cols = grid1[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid2[r][c] == 1 && dfs(grid1, grid2, r, c)) count++;
    return count;
}
boolean dfs(int[][] grid1, int[][] grid2, int r, int c) {
    if (r<0||r>=grid1.length||c<0||c>=grid1[0].length||grid2[r][c]==0) return true;
    grid2[r][c] = 0;
    boolean res = grid1[r][c] == 1;
    for (int[] d : new int[][]{{-1,0},{1,0},{0,-1},{0,1}})
        res = dfs(grid1,grid2,r+d[0],c+d[1]) && res;
    return res;
}`,
  },

  defaultInput: {
    grid1: [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    grid2: [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    rows: 3,
    cols: 5,
  },

  inputFields: [
    {
      name: 'grid1',
      label: 'Grid 1 (flattened)',
      type: 'array',
      defaultValue: [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      placeholder: '1,1,1,0,0,...',
      helperText: 'Reference grid (1=land, 0=water)',
    },
    {
      name: 'grid2',
      label: 'Grid 2 (flattened)',
      type: 'array',
      defaultValue: [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      placeholder: '1,1,1,0,0,...',
      helperText: 'Grid to count sub-islands from',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat1 = input.grid1 as number[];
    const flat2 = input.grid2 as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const grid1 = flat1.slice(0, rows * cols);
    const grid2 = flat2.slice(0, rows * cols);
    while (grid1.length < rows * cols) grid1.push(0);
    while (grid2.length < rows * cols) grid2.push(0);

    const g2 = [...grid2]; // working copy
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...g2],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count sub-islands. Grid2 shown (${rows}x${cols}). An island in grid2 is a sub-island if all its cells are land in grid1 too.`,
      variables: { rows, cols },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    let islandNum = 0;

    function dfs(r: number, c: number): boolean {
      if (r < 0 || r >= rows || c < 0 || c >= cols || g2[r * cols + c] === 0) return true;
      const idx = r * cols + c;
      g2[idx] = 0;
      let res = grid1[idx] === 1;
      for (const [dr, dc] of dirs) {
        res = dfs(r + dr, c + dc) && res;
      }
      return res;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (g2[idx] === 1) {
          islandNum++;

          const preDfsG2 = [...g2];
          const startHl: Record<number, string> = {};
          const startLb: Record<number, string> = {};
          startHl[idx] = 'active';
          startLb[idx] = `isl${islandNum}`;

          steps.push({
            line: 4,
            explanation: `Found land cell (${r},${c}) in grid2 - start of island ${islandNum}. Run DFS to explore and check if it is a sub-island.`,
            variables: { islandNum, startCell: `(${r},${c})` },
            visualization: { type: 'array', array: [...preDfsG2], highlights: startHl, labels: startLb },
          });

          const isSub = dfs(r, c);
          if (isSub) count++;

          const postHl: Record<number, string> = {};
          const postLb: Record<number, string> = {};
          // Highlight cells that were just processed (now 0 in g2 but were 1)
          for (let i = 0; i < rows * cols; i++) {
            if (preDfsG2[i] === 1 && g2[i] === 0) {
              postHl[i] = isSub ? 'found' : 'mismatch';
              postLb[i] = isSub ? 'sub' : 'not-sub';
            }
          }

          steps.push({
            line: 6,
            explanation: `Island ${islandNum} is ${isSub ? 'a SUB-ISLAND' : 'NOT a sub-island'}. All cells match grid1: ${isSub}. Count: ${count}.`,
            variables: { islandNum, isSub, count },
            visualization: makeViz(postHl, postLb),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `All islands in grid2 processed. Total sub-islands = ${count}.`,
      variables: { result: count },
      visualization: makeViz({ 0: count > 0 ? 'sorted' : 'mismatch' }, { 0: `ans=${count}` }),
    });

    return steps;
  },
};

export default countSubIslands;
