import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stampingTheGridSegment: AlgorithmDefinition = {
  id: 'stamping-the-grid-segment',
  title: 'Stamping the Grid',
  leetcodeNumber: 2132,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a binary grid and stamp dimensions, determine if you can stamp the grid to fill all empty cells (0s) without covering occupied cells (1s). Use 2D prefix sums to check if a stamp placement is valid (no 1s in the region) and a 2D difference array to mark covered cells.',
  tags: ['Prefix Sum', '2D Difference Array', 'Greedy', 'Array'],
  code: {
    pseudocode: `function possibleToStamp(grid, stampH, stampW):
  m, n = grid dimensions
  // prefix sum to query #occupied cells in any rectangle
  prefix = 2D prefix sum of grid

  // difference array to track which cells get stamped
  diff = 2D array of zeros

  for r from 0 to m-stampH:
    for c from 0 to n-stampW:
      // check if rectangle [r,c] to [r+stampH-1,c+stampW-1] has no 1s
      if sumInRect(r, c, r+stampH-1, c+stampW-1) == 0:
        mark diff: diff[r][c]++ and subtract at borders

  // accumulate diff to get stamp coverage count
  // every 0 cell must be covered by at least one stamp`,
    python: `class Solution:
    def possibleToStamp(self, grid, stampHeight, stampWidth):
        m, n = len(grid), len(grid[0])
        # 2D prefix sum
        psum = [[0]*(n+1) for _ in range(m+1)]
        for i in range(m):
            for j in range(n):
                psum[i+1][j+1] = grid[i][j]+psum[i][j+1]+psum[i+1][j]-psum[i][j]

        def query(r1,c1,r2,c2):
            return psum[r2+1][c2+1]-psum[r1][c2+1]-psum[r2+1][c1]+psum[r1][c1]

        # 2D difference array
        diff = [[0]*(n+2) for _ in range(m+2)]
        for r in range(m-stampHeight+1):
            for c in range(n-stampWidth+1):
                if query(r,c,r+stampHeight-1,c+stampWidth-1)==0:
                    diff[r][c]+=1
                    diff[r+stampHeight][c]-=1
                    diff[r][c+stampWidth]-=1
                    diff[r+stampHeight][c+stampWidth]+=1

        # check coverage
        cover = [[0]*(n+1) for _ in range(m+1)]
        for i in range(m):
            for j in range(n):
                cover[i][j]=(cover[i-1][j] if i>0 else 0)+(cover[i][j-1] if j>0 else 0)-(cover[i-1][j-1] if i>0 and j>0 else 0)+diff[i][j]
                if grid[i][j]==0 and cover[i][j]==0: return False
        return True`,
    javascript: `var possibleToStamp = function(grid, stampHeight, stampWidth) {
  const m=grid.length, n=grid[0].length;
  const psum=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=0;i<m;i++)
    for(let j=0;j<n;j++)
      psum[i+1][j+1]=grid[i][j]+psum[i][j+1]+psum[i+1][j]-psum[i][j];
  const q=(r1,c1,r2,c2)=>psum[r2+1][c2+1]-psum[r1][c2+1]-psum[r2+1][c1]+psum[r1][c1];
  const diff=Array.from({length:m+2},()=>new Array(n+2).fill(0));
  for(let r=0;r<=m-stampHeight;r++)
    for(let c=0;c<=n-stampWidth;c++)
      if(q(r,c,r+stampHeight-1,c+stampWidth-1)===0){
        diff[r][c]++;diff[r+stampHeight][c]--;diff[r][c+stampWidth]--;diff[r+stampHeight][c+stampWidth]++;
      }
  for(let i=0;i<m;i++)
    for(let j=0;j<n;j++){
      if(i>0)diff[i][j]+=diff[i-1][j];
      if(j>0)diff[i][j]+=diff[i][j-1];
      if(i>0&&j>0)diff[i][j]-=diff[i-1][j-1];
      if(grid[i][j]===0&&diff[i][j]===0)return false;
    }
  return true;
};`,
    java: `class Solution {
    public boolean possibleToStamp(int[][] grid,int sh,int sw){
        int m=grid.length,n=grid[0].length;
        int[][]p=new int[m+1][n+1];
        for(int i=0;i<m;i++)for(int j=0;j<n;j++)
            p[i+1][j+1]=grid[i][j]+p[i][j+1]+p[i+1][j]-p[i][j];
        int[][]d=new int[m+2][n+2];
        for(int r=0;r<=m-sh;r++)for(int c=0;c<=n-sw;c++)
            if(p[r+sh][c+sw]-p[r][c+sw]-p[r+sh][c]+p[r][c]==0)
                {d[r][c]++;d[r+sh][c]--;d[r][c+sw]--;d[r+sh][c+sw]++;}
        for(int i=0;i<m;i++)for(int j=0;j<n;j++){
            if(i>0)d[i][j]+=d[i-1][j];if(j>0)d[i][j]+=d[i][j-1];
            if(i>0&&j>0)d[i][j]-=d[i-1][j-1];
            if(grid[i][j]==0&&d[i][j]==0)return false;}
        return true;
    }
}`,
  },
  defaultInput: { grid: [[1,0,0,0],[1,0,0,0],[1,0,0,1],[0,1,0,0]], stampHeight: 2, stampWidth: 2 },
  inputFields: [
    { name: 'grid', label: 'Grid (flattened rows)', type: 'array', defaultValue: [[1,0,0,0],[1,0,0,0],[1,0,0,1],[0,1,0,0]], helperText: '2D binary grid' },
    { name: 'stampHeight', label: 'Stamp Height', type: 'number', defaultValue: 2 },
    { name: 'stampWidth', label: 'Stamp Width', type: 'number', defaultValue: 2 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const stampHeight = input.stampHeight as number;
    const stampWidth = input.stampWidth as number;
    const steps: AlgorithmStep[] = [];

    const m = grid.length, n = grid[0].length;
    const flatGrid = grid.flat();

    steps.push({
      line: 1,
      explanation: `Grid: ${m}×${n}, stamp: ${stampHeight}×${stampWidth}. Build 2D prefix sums to quickly check if stamp placement is valid.`,
      variables: { m, n, stampHeight, stampWidth },
      visualization: { type: 'array', array: flatGrid, highlights: {}, labels: Object.fromEntries(flatGrid.map((v,i)=>[i,`${v}`])) },
    });

    const psum = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        psum[i+1][j+1] = grid[i][j] + psum[i][j+1] + psum[i+1][j] - psum[i][j];

    const q = (r1: number, c1: number, r2: number, c2: number) =>
      psum[r2+1][c2+1] - psum[r1][c2+1] - psum[r2+1][c1] + psum[r1][c1];

    let stampsPlaced = 0;
    const stampPositions: [number,number][] = [];

    for (let r = 0; r <= m - stampHeight; r++) {
      for (let c = 0; c <= n - stampWidth; c++) {
        if (q(r, c, r + stampHeight - 1, c + stampWidth - 1) === 0) {
          stampsPlaced++;
          stampPositions.push([r, c]);
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Found ${stampsPlaced} valid stamp placements. Checking if all 0-cells are covered.`,
      variables: { stampsPlaced, stampPositions },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: Object.fromEntries(flatGrid.map((v, i) => [i, v === 0 ? 'active' : 'visited'])),
        labels: { 0: `stamps=${stampsPlaced}` },
      },
    });

    const diff = Array.from({ length: m + 2 }, () => new Array(n + 2).fill(0));
    for (const [r, c] of stampPositions) {
      diff[r][c]++;
      diff[r + stampHeight][c]--;
      diff[r][c + stampWidth]--;
      diff[r + stampHeight][c + stampWidth]++;
    }

    let possible = true;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (i > 0) diff[i][j] += diff[i-1][j];
        if (j > 0) diff[i][j] += diff[i][j-1];
        if (i > 0 && j > 0) diff[i][j] -= diff[i-1][j-1];
        if (grid[i][j] === 0 && diff[i][j] === 0) { possible = false; }
      }
    }

    steps.push({
      line: 18,
      explanation: `Result: ${possible ? 'true — all empty cells can be covered' : 'false — some empty cell cannot be covered'}`,
      variables: { possible },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: Object.fromEntries(flatGrid.map((_, i) => [i, possible ? 'found' : 'mismatch'])),
        labels: { 0: `${possible}` },
      },
    });

    return steps;
  },
};

export default stampingTheGridSegment;
