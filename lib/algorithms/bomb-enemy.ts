import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bombEnemy: AlgorithmDefinition = {
  id: 'bomb-enemy',
  title: 'Bomb Enemy',
  leetcodeNumber: 361,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a 2D grid with W (walls), E (enemies), and 0 (empty cells), find the empty cell where placing one bomb kills the most enemies. A bomb kills all enemies in the same row and column until blocked by a wall. Use DP to precompute row counts (reset on walls) and column counts.',
  tags: ['dynamic programming', 'grid', 'counting'],

  code: {
    pseudocode: `function maxKilledEnemies(grid):
  rows, cols = dimensions
  rowKills = 0
  colKills = array of cols
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      if c==0 or grid[r][c-1]=='W': recompute rowKills
      if r==0 or grid[r-1][c]=='W': recompute colKills[c]
      if grid[r][c]=='0':
        ans = max(ans, rowKills + colKills[c])
  return ans`,
    python: `def maxKilledEnemies(grid):
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    ans = rowKills = 0
    colKills = [0]*cols
    for r in range(rows):
        for c in range(cols):
            if c==0 or grid[r][c-1]=='W':
                rowKills = sum(1 for k in range(c,cols) if grid[r][k]=='E' and (k==c or all(grid[r][j]!='W' for j in range(c,k))))
            if r==0 or grid[r-1][c]=='W':
                colKills[c] = sum(1 for k in range(r,rows) if grid[k][c]=='E' and (k==r or all(grid[j][c]!='W' for j in range(r,k))))
            if grid[r][c]=='0':
                ans = max(ans, rowKills+colKills[c])
    return ans`,
    javascript: `function maxKilledEnemies(grid) {
  const rows = grid.length, cols = grid[0].length;
  let ans = 0, rowKills = 0;
  const colKills = Array(cols).fill(0);
  const countRow = (r, c) => {
    let k = 0;
    for (let j = c; j < cols && grid[r][j] !== 'W'; j++) if (grid[r][j] === 'E') k++;
    return k;
  };
  const countCol = (r, c) => {
    let k = 0;
    for (let i = r; i < rows && grid[i][c] !== 'W'; i++) if (grid[i][c] === 'E') k++;
    return k;
  };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (c === 0 || grid[r][c-1] === 'W') rowKills = countRow(r, c);
      if (r === 0 || grid[r-1][c] === 'W') colKills[c] = countCol(r, c);
      if (grid[r][c] === '0') ans = Math.max(ans, rowKills + colKills[c]);
    }
  return ans;
}`,
    java: `public int maxKilledEnemies(char[][] grid) {
    int rows = grid.length, cols = grid[0].length, ans = 0, rowKills = 0;
    int[] colKills = new int[cols];
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (c==0||grid[r][c-1]=='W') { rowKills=0; for(int k=c;k<cols&&grid[r][k]!='W';k++) if(grid[r][k]=='E') rowKills++; }
            if (r==0||grid[r-1][c]=='W') { colKills[c]=0; for(int k=r;k<rows&&grid[k][c]!='W';k++) if(grid[k][c]=='E') colKills[c]++; }
            if (grid[r][c]=='0') ans=Math.max(ans,rowKills+colKills[c]);
        }
    return ans;
}`,
  },

  defaultInput: {
    grid: [['0', 'E', '0', '0'], ['E', '0', 'W', 'E'], ['0', 'E', '0', '0']],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (0=empty, E=enemy, W=wall)',
      type: 'array',
      defaultValue: [['0', 'E', '0', '0'], ['E', '0', 'W', 'E'], ['0', 'E', '0', '0']],
      placeholder: '[["0","E","0","0"],["E","0","W","E"],["0","E","0","0"]]',
      helperText: '2D grid with 0, E, W characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as string[][];
    const rows = grid.length;
    const cols = grid[0].length;
    const steps: AlgorithmStep[] = [];

    const countRow = (r: number, c: number): number => {
      let k = 0;
      for (let j = c; j < cols && grid[r][j] !== 'W'; j++) if (grid[r][j] === 'E') k++;
      return k;
    };
    const countCol = (r: number, c: number): number => {
      let k = 0;
      for (let i = r; i < rows && grid[i][c] !== 'W'; i++) if (grid[i][c] === 'E') k++;
      return k;
    };

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    // Encode grid as numbers for display: E=2, W=-1, 0=0
    const encode = (ch: string) => ch === 'E' ? 2 : ch === 'W' ? -1 : 0;
    const flatGrid = grid.flat().map(encode);

    steps.push({
      line: 1,
      explanation: `Grid: ${rows} rows x ${cols} cols. E=enemy(2), W=wall(-1), 0=empty. Find best bomb placement.`,
      variables: { rows, cols },
      visualization: makeViz(flatGrid, {}, {}),
    });

    let ans = 0;
    let rowKills = 0;
    const colKills = Array(cols).fill(0);
    let bestR = -1, bestC = -1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c === 0 || grid[r][c - 1] === 'W') rowKills = countRow(r, c);
        if (r === 0 || grid[r - 1][c] === 'W') colKills[c] = countCol(r, c);

        if (grid[r][c] === '0') {
          const total = rowKills + colKills[c];
          const hi: Record<number, string> = {};
          const lb: Record<number, string> = {};
          hi[r * cols + c] = total > ans ? 'found' : 'active';
          lb[r * cols + c] = `${total}`;

          steps.push({
            line: 9,
            explanation: `Empty cell (${r},${c}): rowKills=${rowKills} + colKills=${colKills[c]} = ${total} enemies`,
            variables: { r, c, rowKills, colKills: colKills[c], total, best: Math.max(ans, total) },
            visualization: makeViz(flatGrid, hi, lb),
          });

          if (total > ans) { ans = total; bestR = r; bestC = c; }
        }
      }
    }

    const finalHi: Record<number, string> = { [bestR * cols + bestC]: 'found' };
    const finalLb: Record<number, string> = { [bestR * cols + bestC]: `best:${ans}` };
    steps.push({
      line: 11,
      explanation: `Best bomb at (${bestR},${bestC}) kills ${ans} enemies.`,
      variables: { bestRow: bestR, bestCol: bestC, maxKills: ans },
      visualization: makeViz(flatGrid, finalHi, finalLb),
    });

    return steps;
  },
};

export default bombEnemy;
