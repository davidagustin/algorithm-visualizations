import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const magicSquaresInGrid: AlgorithmDefinition = {
  id: 'magic-squares-in-grid',
  title: 'Magic Squares In Grid',
  leetcodeNumber: 840,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Count 3x3 magic squares inside an m x n grid. A 3x3 magic square contains distinct numbers 1-9 and all rows, columns, and both diagonals sum to 15. Slide a 3x3 window over the grid and validate each subgrid by checking the magic square properties.',
  tags: ['array', 'matrix', 'enumeration'],

  code: {
    pseudocode: `function numMagicSquaresInside(grid):
  count = 0
  for r in range(len(grid)-2):
    for c in range(len(grid[0])-2):
      if isMagic(grid, r, c):
        count++
  return count

function isMagic(grid, r, c):
  seen = set of values in 3x3 subgrid
  if seen != {1..9}: return false
  check all row sums, col sums, diagonal sums == 15`,
    python: `def numMagicSquaresInside(grid):
    def is_magic(r, c):
        vals = {grid[r+i][c+j] for i in range(3) for j in range(3)}
        if vals != set(range(1, 10)):
            return False
        s = 15
        return all(sum(grid[r+i][c+j] for j in range(3)) == s for i in range(3)) and \
               all(sum(grid[r+i][c+j] for i in range(3)) == s for j in range(3)) and \
               grid[r][c]+grid[r+1][c+1]+grid[r+2][c+2] == s and \
               grid[r][c+2]+grid[r+1][c+1]+grid[r+2][c] == s
    count = 0
    for r in range(len(grid)-2):
        for c in range(len(grid[0])-2):
            if is_magic(r, c): count += 1
    return count`,
    javascript: `function numMagicSquaresInside(grid) {
  function isMagic(r, c) {
    const vals = new Set();
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        vals.add(grid[r+i][c+j]);
    if (vals.size !== 9 || !vals.has(1) || !vals.has(9)) return false;
    const s = 15;
    for (let i = 0; i < 3; i++) {
      if (grid[r+i].slice(c,c+3).reduce((a,b)=>a+b,0) !== s) return false;
      if ([0,1,2].reduce((a,k)=>a+grid[r+k][c+i],0) !== s) return false;
    }
    return grid[r][c]+grid[r+1][c+1]+grid[r+2][c+2]===s &&
           grid[r][c+2]+grid[r+1][c+1]+grid[r+2][c]===s;
  }
  let count = 0;
  for (let r = 0; r <= grid.length-3; r++)
    for (let c = 0; c <= grid[0].length-3; c++)
      if (isMagic(r, c)) count++;
  return count;
}`,
    java: `public int numMagicSquaresInside(int[][] grid) {
    int count = 0;
    for (int r = 0; r <= grid.length - 3; r++)
        for (int c = 0; c <= grid[0].length - 3; c++)
            if (isMagic(grid, r, c)) count++;
    return count;
}
private boolean isMagic(int[][] g, int r, int c) {
    int[] freq = new int[10];
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++) { int v=g[r+i][c+j]; if(v<1||v>9||++freq[v]>1) return false; }
    for (int i=0;i<3;i++) {
        int rs=0,cs=0;
        for(int j=0;j<3;j++){rs+=g[r+i][c+j];cs+=g[r+j][c+i];}
        if(rs!=15||cs!=15) return false;
    }
    return g[r][c]+g[r+1][c+1]+g[r+2][c+2]==15 && g[r][c+2]+g[r+1][c+1]+g[r+2][c]==15;
}`,
  },

  defaultInput: {
    grid: [[4, 3, 8, 4], [9, 5, 1, 9], [2, 7, 6, 2]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [4, 3, 8, 4, 9, 5, 1, 9, 2, 7, 6, 2],
      placeholder: '4,3,8,4,9,5,1,9,2,7,6,2',
      helperText: 'Row-major flattened 3x4 grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = [[4, 3, 8, 4], [9, 5, 1, 9], [2, 7, 6, 2]];
    const steps: AlgorithmStep[] = [];
    const m = grid.length, n = grid[0].length;
    const flat = grid.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
    });

    const isMagic = (r: number, c: number): boolean => {
      const vals = new Set<number>();
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) vals.add(grid[r + i][c + j]);
      if (vals.size !== 9) return false;
      for (let v = 1; v <= 9; v++) if (!vals.has(v)) return false;
      for (let i = 0; i < 3; i++) {
        let rs = 0, cs = 0;
        for (let j = 0; j < 3; j++) { rs += grid[r + i][c + j]; cs += grid[r + j][c + i]; }
        if (rs !== 15 || cs !== 15) return false;
      }
      return grid[r][c] + grid[r + 1][c + 1] + grid[r + 2][c + 2] === 15 &&
        grid[r][c + 2] + grid[r + 1][c + 1] + grid[r + 2][c] === 15;
    };

    steps.push({
      line: 1,
      explanation: `Search ${m}x${n} grid for 3x3 magic squares (distinct 1-9, all sums = 15).`,
      variables: { m, n },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    for (let r = 0; r <= m - 3; r++) {
      for (let c = 0; c <= n - 3; c++) {
        const magic = isMagic(r, c);
        if (magic) count++;
        const highlights: Record<number, string> = {};
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) highlights[(r + i) * n + (c + j)] = magic ? 'found' : 'comparing';
        steps.push({
          line: 4,
          explanation: `3x3 subgrid at (${r},${c}): ${magic ? 'IS a magic square! count=' + count : 'NOT a magic square.'}`,
          variables: { r, c, isMagic: magic, count },
          visualization: makeViz(highlights, {}),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Total magic squares in grid: ${count}.`,
      variables: { result: count },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default magicSquaresInGrid;
