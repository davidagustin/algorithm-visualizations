import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const regionsCutBySlashes: AlgorithmDefinition = {
  id: 'regions-cut-by-slashes',
  title: 'Regions Cut by Slashes',
  leetcodeNumber: 959,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n grid where each cell is "/" or "\\" or " ", count the number of regions formed. Scale the grid by 3x to represent each slash as a pattern of filled cells, then count connected components using union find or DFS. Each cell becomes a 3x3 block where slashes cut diagonally.',
  tags: ['union find', 'graph', 'grid', 'connected components'],

  code: {
    pseudocode: `function regionsBySlashes(grid):
  n = len(grid)
  // Scale grid by 3: each cell -> 3x3 block
  scaled = 3n x 3n grid of zeros
  for r in 0..n-1:
    for c in 0..n-1:
      if grid[r][c] == '/':
        mark (r*3+0,c*3+2), (r*3+1,c*3+1), (r*3+2,c*3+0) as 1
      elif grid[r][c] == '\\\\':
        mark (r*3+0,c*3+0), (r*3+1,c*3+1), (r*3+2,c*3+2) as 1
  // Count connected components of 0s
  count = 0
  for each cell (r,c) in scaled:
    if scaled[r][c] == 0:
      dfs(scaled, r, c)
      count += 1
  return count`,

    python: `def regionsBySlashes(grid):
    n = len(grid)
    size = 3 * n
    scaled = [[0]*size for _ in range(size)]
    for r in range(n):
        for c in range(n):
            if grid[r][c] == '/':
                scaled[r*3][c*3+2] = scaled[r*3+1][c*3+1] = scaled[r*3+2][c*3] = 1
            elif grid[r][c] == '\\\\':
                scaled[r*3][c*3] = scaled[r*3+1][c*3+1] = scaled[r*3+2][c*3+2] = 1
    def dfs(r, c):
        if r < 0 or r >= size or c < 0 or c >= size or scaled[r][c]:
            return
        scaled[r][c] = 1
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            dfs(r+dr, c+dc)
    count = 0
    for r in range(size):
        for c in range(size):
            if not scaled[r][c]:
                dfs(r, c)
                count += 1
    return count`,

    javascript: `function regionsBySlashes(grid) {
  const n = grid.length, size = 3 * n;
  const scaled = Array.from({length: size}, () => new Array(size).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === '/') {
        scaled[r*3][c*3+2] = scaled[r*3+1][c*3+1] = scaled[r*3+2][c*3] = 1;
      } else if (grid[r][c] === '\\\\') {
        scaled[r*3][c*3] = scaled[r*3+1][c*3+1] = scaled[r*3+2][c*3+2] = 1;
      }
    }
  }
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= size || c < 0 || c >= size || scaled[r][c]) return;
    scaled[r][c] = 1;
    dfs(r-1,c); dfs(r+1,c); dfs(r,c-1); dfs(r,c+1);
  }
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!scaled[r][c]) { dfs(r,c); count++; }
  return count;
}`,

    java: `public int regionsBySlashes(String[] grid) {
    int n = grid.length, size = 3 * n;
    int[][] scaled = new int[size][size];
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++) {
            if (grid[r].charAt(c) == '/') {
                scaled[r*3][c*3+2]=scaled[r*3+1][c*3+1]=scaled[r*3+2][c*3]=1;
            } else if (grid[r].charAt(c) == '\\\\') {
                scaled[r*3][c*3]=scaled[r*3+1][c*3+1]=scaled[r*3+2][c*3+2]=1;
            }
        }
    int count = 0;
    for (int r = 0; r < size; r++)
        for (int c = 0; c < size; c++)
            if (scaled[r][c] == 0) { dfs(scaled, r, c, size); count++; }
    return count;
}`,
  },

  defaultInput: {
    grid: ['/ \\', '\\  ', ' \\\\'],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid Rows',
      type: 'array',
      defaultValue: ['/ \\', '\\  ', ' \\\\'],
      placeholder: '["/\\ ","\\ / "]',
      helperText: 'Each string is a row with /, \\, or space characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const gridInput = input.grid as string[];
    const steps: AlgorithmStep[] = [];

    const n = gridInput.length;
    const size = 3 * n;
    const scaled: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));

    steps.push({
      line: 1,
      explanation: `Grid is ${n}x${n}. Scale by 3 to get ${size}x${size} grid. Each cell becomes a 3x3 block.`,
      variables: { n, scaledSize: size },
      visualization: {
        type: 'array',
        array: new Array(size * size).fill(0),
        highlights: {},
        labels: { 0: `${size}x${size} scaled grid` },
      },
    });

    let slashCount = 0;
    let backslashCount = 0;

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const ch = gridInput[r][c];
        if (ch === '/') {
          scaled[r * 3][c * 3 + 2] = 1;
          scaled[r * 3 + 1][c * 3 + 1] = 1;
          scaled[r * 3 + 2][c * 3] = 1;
          slashCount++;
          const rowKey1 = r * 3 + 1;
          steps.push({
            line: 7,
            explanation: `Cell (${r},${c}) has '/'. Mark diagonal cells in 3x3 block as walls.`,
            variables: { row: r, col: c, char: '/' },
            visualization: {
              type: 'array',
              array: scaled.flat().slice(0, n * 3),
              highlights: { [rowKey1]: 'active' },
              labels: { [rowKey1]: `row${rowKey1}` },
            },
          });
        } else if (ch === '\\') {
          scaled[r * 3][c * 3] = 1;
          scaled[r * 3 + 1][c * 3 + 1] = 1;
          scaled[r * 3 + 2][c * 3 + 2] = 1;
          backslashCount++;
          const rowKey2 = r * 3 + 1;
          steps.push({
            line: 9,
            explanation: `Cell (${r},${c}) has a backslash. Mark anti-diagonal cells in 3x3 block as walls.`,
            variables: { row: r, col: c, char: 'backslash' },
            visualization: {
              type: 'array',
              array: scaled.flat().slice(0, n * 3),
              highlights: { [rowKey2]: 'comparing' },
              labels: { [rowKey2]: `row${rowKey2}` },
            },
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Scaled grid built. ${slashCount} forward slashes, ${backslashCount} backslashes converted to wall cells. Now count connected regions of open cells.`,
      variables: { slashCount, backslashCount, scaledSize: size },
      visualization: {
        type: 'array',
        array: scaled.flat().slice(0, size),
        highlights: {},
        labels: { 0: 'row0 of scaled' },
      },
    });

    // Count connected components via DFS
    let count = 0;
    function dfs(r: number, c: number): void {
      if (r < 0 || r >= size || c < 0 || c >= size || scaled[r][c]) return;
      scaled[r][c] = 1;
      dfs(r - 1, c); dfs(r + 1, c); dfs(r, c - 1); dfs(r, c + 1);
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!scaled[r][c]) {
          dfs(r, c);
          count++;
          steps.push({
            line: 14,
            explanation: `Found open cell at (${r},${c}). DFS fills region. Total regions found: ${count}.`,
            variables: { regionCount: count, startRow: r, startCol: c },
            visualization: {
              type: 'array',
              array: scaled.flat().slice(0, size),
              highlights: { [r]: 'found' },
              labels: { [r]: `region${count}` },
            },
          });
        }
      }
    }

    steps.push({
      line: 15,
      explanation: `Finished. Total regions cut by slashes: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: new Array(count).fill(1).map((_, i) => i + 1),
        highlights: Object.fromEntries(Array.from({ length: count }, (_, i) => [i, 'found'])),
        labels: Object.fromEntries(Array.from({ length: count }, (_, i) => [i, `R${i + 1}`])),
      },
    });

    return steps;
  },
};

export default regionsCutBySlashes;
