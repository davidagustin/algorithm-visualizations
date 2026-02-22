import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const stampingTheGrid: AlgorithmDefinition = {
  id: 'stamping-the-grid',
  title: 'Stamping the Grid',
  leetcodeNumber: 2132,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given a binary grid and stamp dimensions, determine if you can cover all 0s with stamps (stampHeight x stampWidth rectangles) without covering any 1s. Uses 2D prefix sums to check valid stamp placement, combined with a difference array to mark stamp coverage.',
  tags: ['Stack', 'Array', 'Greedy', 'Prefix Sum', '2D Grid', 'Hard'],
  code: {
    pseudocode: `function possibleToStamp(grid, stampHeight, stampWidth):
  m, n = dimensions of grid
  prefix = 2D prefix sum of grid
  diff = 2D difference array
  // Try placing stamp at every valid top-left corner (r, c)
  for r from 0 to m-stampHeight:
    for c from 0 to n-stampWidth:
      r2, c2 = r+stampHeight-1, c+stampWidth-1
      if prefix[r2][c2] - prefix[r-1][c2] - prefix[r2][c-1] + prefix[r-1][c-1] == 0:
        // No 1s in this stamp region → place stamp
        diff[r][c] += 1
        diff[r+stampHeight][c] -= 1
        diff[r][c+stampWidth] -= 1
        diff[r+stampHeight][c+stampWidth] += 1
  // Reconstruct coverage, verify every 0 is covered
  for each cell (r, c):
    if grid[r][c] == 0 and coverage[r][c] == 0:
      return false
  return true`,
    python: `def possibleToStamp(grid, stampHeight, stampWidth):
    m, n = len(grid), len(grid[0])
    pre = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m):
        for j in range(n):
            pre[i+1][j+1] = grid[i][j] + pre[i][j+1] + pre[i+1][j] - pre[i][j]
    diff = [[0]*(n+2) for _ in range(m+2)]
    for r in range(m - stampHeight + 1):
        for c in range(n - stampWidth + 1):
            r2, c2 = r + stampHeight, c + stampWidth
            if pre[r2][c2] - pre[r][c2] - pre[r2][c] + pre[r][c] == 0:
                diff[r][c] += 1
                diff[r2][c] -= 1
                diff[r][c2] -= 1
                diff[r2][c2] += 1
    cover = [[0]*n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            cover[i][j] = diff[i][j] + (cover[i-1][j] if i else 0) + (cover[i][j-1] if j else 0) - (cover[i-1][j-1] if i and j else 0)
            if grid[i][j] == 0 and cover[i][j] == 0:
                return False
    return True`,
    javascript: `function possibleToStamp(grid, stampHeight, stampWidth) {
  const m = grid.length, n = grid[0].length;
  const pre = Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=0;i<m;i++) for(let j=0;j<n;j++)
    pre[i+1][j+1]=grid[i][j]+pre[i][j+1]+pre[i+1][j]-pre[i][j];
  const diff = Array.from({length:m+2},()=>new Array(n+2).fill(0));
  for(let r=0;r<=m-stampHeight;r++) for(let c=0;c<=n-stampWidth;c++) {
    const r2=r+stampHeight,c2=c+stampWidth;
    if(pre[r2][c2]-pre[r][c2]-pre[r2][c]+pre[r][c]===0) {
      diff[r][c]++;diff[r2][c]--;diff[r][c2]--;diff[r2][c2]++;
    }
  }
  const cov = Array.from({length:m},()=>new Array(n).fill(0));
  for(let i=0;i<m;i++) for(let j=0;j<n;j++) {
    cov[i][j]=diff[i][j]+(i?cov[i-1][j]:0)+(j?cov[i][j-1]:0)-(i&&j?cov[i-1][j-1]:0);
    if(grid[i][j]===0&&cov[i][j]===0) return false;
  }
  return true;
}`,
    java: `public boolean possibleToStamp(int[][] grid, int stampHeight, int stampWidth) {
    int m = grid.length, n = grid[0].length;
    int[][] pre = new int[m+1][n+1];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        pre[i+1][j+1]=grid[i][j]+pre[i][j+1]+pre[i+1][j]-pre[i][j];
    int[][] diff = new int[m+2][n+2];
    for(int r=0;r<=m-stampHeight;r++) for(int c=0;c<=n-stampWidth;c++) {
        int r2=r+stampHeight,c2=c+stampWidth;
        if(pre[r2][c2]-pre[r][c2]-pre[r2][c]+pre[r][c]==0) {
            diff[r][c]++;diff[r2][c]--;diff[r][c2]--;diff[r2][c2]++;
        }
    }
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) {
        diff[i][j]+=(i>0?diff[i-1][j]:0)+(j>0?diff[i][j-1]:0)-(i>0&&j>0?diff[i-1][j-1]:0);
        if(grid[i][j]==0&&diff[i][j]==0) return false;
    }
    return true;
}`,
  },
  defaultInput: { grid: [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]], stampHeight: 4, stampWidth: 3 },
  inputFields: [
    {
      name: 'stampHeight',
      label: 'Stamp Height',
      type: 'number',
      defaultValue: 4,
      placeholder: 'e.g. 4',
      helperText: 'Height of stamp',
    },
    {
      name: 'stampWidth',
      label: 'Stamp Width',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Width of stamp',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = (input.grid as number[][]) ?? [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]];
    const stampHeight = (input.stampHeight as number) ?? 4;
    const stampWidth = (input.stampWidth as number) ?? 3;
    const m = grid.length;
    const n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: grid.flat().map(v => String(v)),
      currentIndex: i,
      action,
    });

    // 2D prefix sum
    const pre: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        pre[i + 1][j + 1] = grid[i][j] + pre[i][j + 1] + pre[i + 1][j] - pre[i][j];

    steps.push({
      line: 1,
      explanation: `Grid ${m}x${n}, stamp ${stampHeight}x${stampWidth}. Build 2D prefix sum to quickly check if a stamp region has any 1s.`,
      variables: { m, n, stampHeight, stampWidth },
      visualization: makeViz(-1, 'idle'),
    });

    const diff: number[][] = Array.from({ length: m + 2 }, () => new Array(n + 2).fill(0));
    let stampsPlaced = 0;

    for (let r = 0; r <= m - stampHeight; r++) {
      for (let c = 0; c <= n - stampWidth; c++) {
        const r2 = r + stampHeight, c2 = c + stampWidth;
        const sum = pre[r2][c2] - pre[r][c2] - pre[r2][c] + pre[r][c];

        if (sum === 0) {
          diff[r][c]++;
          diff[r2][c]--;
          diff[r][c2]--;
          diff[r2][c2]++;
          stampsPlaced++;
          stack.length = 0;
          stack.push(`stamp@(${r},${c})`);

          steps.push({
            line: 7,
            explanation: `Valid stamp at (${r},${c}) to (${r2 - 1},${c2 - 1}): region has no 1s. Mark in diff array. ${stampsPlaced} stamps placed.`,
            variables: { r, c, stampsPlaced },
            visualization: makeViz(r * n + c, 'push'),
          });
        }
      }
    }

    // Reconstruct and verify
    let allCovered = true;
    const cov: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        cov[i][j] = diff[i][j] + (i > 0 ? cov[i - 1][j] : 0) + (j > 0 ? cov[i][j - 1] : 0) - (i > 0 && j > 0 ? cov[i - 1][j - 1] : 0);
        if (grid[i][j] === 0 && cov[i][j] === 0) {
          allCovered = false;
          stack.push(`FAIL:(${i},${j})`);
          steps.push({
            line: 15,
            explanation: `Cell (${i},${j}) is 0 but NOT covered by any stamp. Cannot satisfy condition.`,
            variables: { i, j, coverage: cov[i][j] },
            visualization: makeViz(i * n + j, 'mismatch'),
          });
          break;
        }
      }
      if (!allCovered) break;
    }

    steps.push({
      line: 16,
      explanation: `Result: ${allCovered ? 'true - all 0s can be covered by stamps' : 'false - some 0s cannot be covered'}.`,
      variables: { result: allCovered },
      visualization: makeViz(m * n - 1, allCovered ? 'match' : 'mismatch'),
    });

    return steps;
  },
};

export default stampingTheGrid;
