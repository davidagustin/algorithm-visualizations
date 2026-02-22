import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const swimInRisingWaterUf: AlgorithmDefinition = {
  id: 'swim-in-rising-water-uf',
  title: 'Swim in Rising Water (Union Find)',
  leetcodeNumber: 778,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an n x n grid where grid[r][c] is the elevation at that cell, find the minimum time T such that there exists a path from (0,0) to (n-1,n-1) where all cells have elevation at most T. Use union find: sort all cells by elevation, then add them one by one. After adding each cell, union with adjacent already-added cells. Stop when (0,0) and (n-1,n-1) are connected.',
  tags: ['union find', 'graph', 'binary search', 'sorting'],

  code: {
    pseudocode: `function swimInWater(grid):
  n = len(grid)
  parent = [0..n*n-1]
  // Sort cells by elevation value
  cells = sorted((grid[r][c], r, c) for all r,c)
  added = set()
  for (t, r, c) in cells:
    added.add((r, c))
    for each neighbor (nr, nc) in added:
      union(r*n+c, nr*n+nc)
    if find(0) == find(n*n-1):
      return t
  return n*n-1`,

    python: `def swimInWater(grid):
    n = len(grid)
    parent = list(range(n * n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    cells = sorted((grid[r][c], r, c) for r in range(n) for c in range(n))
    added = [[False]*n for _ in range(n)]
    for t, r, c in cells:
        added[r][c] = True
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<n and 0<=nc<n and added[nr][nc]:
                union(r*n+c, nr*n+nc)
        if find(0) == find(n*n-1):
            return t
    return n*n-1`,

    javascript: `function swimInWater(grid) {
  const n=grid.length;
  const parent=Array.from({length:n*n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){const pa=find(a),pb=find(b);if(pa!==pb)parent[pa]=pb;}
  const cells=[];
  for(let r=0;r<n;r++) for(let c=0;c<n;c++) cells.push([grid[r][c],r,c]);
  cells.sort((a,b)=>a[0]-b[0]);
  const added=Array.from({length:n},()=>new Array(n).fill(false));
  for(const[t,r,c]of cells){
    added[r][c]=true;
    for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<n&&nc>=0&&nc<n&&added[nr][nc]) union(r*n+c,nr*n+nc);
    }
    if(find(0)===find(n*n-1)) return t;
  }
  return n*n-1;
}`,

    java: `public int swimInWater(int[][] grid) {
    int n=grid.length;
    int[]parent=new int[n*n];
    for(int i=0;i<n*n;i++) parent[i]=i;
    int[][]cells=new int[n*n][3];
    int k=0;
    for(int r=0;r<n;r++) for(int c=0;c<n;c++) cells[k++]=new int[]{grid[r][c],r,c};
    Arrays.sort(cells,(a,b)->a[0]-b[0]);
    boolean[][]added=new boolean[n][n];
    for(int[]cell:cells){
        int t=cell[0],r=cell[1],c=cell[2];
        added[r][c]=true;
        for(int[]d:new int[][]{{-1,0},{1,0},{0,-1},{0,1}}){
            int nr=r+d[0],nc=c+d[1];
            if(nr>=0&&nr<n&&nc>=0&&nc<n&&added[nr][nc]) union(parent,r*n+c,nr*n+nc);
        }
        if(find(parent,0)==find(parent,n*n-1)) return t;
    }
    return n*n-1;
}`,
  },

  defaultInput: {
    grid: [[0, 2], [1, 3]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [[0, 2], [1, 3]],
      placeholder: '[[0,2],[1,3]]',
      helperText: 'n x n grid of elevations (permutation of 0 to n^2-1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const n = grid.length;
    const parent: number[] = Array.from({ length: n * n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      const pa = find(a), pb = find(b);
      if (pa !== pb) parent[pa] = pb;
    }

    const cells: Array<[number, number, number]> = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        cells.push([grid[r][c], r, c]);
      }
    }
    cells.sort((a, b) => a[0] - b[0]);

    const flatGrid = grid.flat();

    steps.push({
      line: 1,
      explanation: `${n}x${n} grid. Sort all ${n * n} cells by elevation. Add cells from lowest to highest. Stop when (0,0) and (n-1,n-1) connect.`,
      variables: { n, target: n * n - 1 },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: { 0: 'active', [n * n - 1]: 'comparing' },
        labels: { 0: 'start', [n * n - 1]: 'end' },
      },
    });

    const added: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [t, r, c] of cells) {
      added[r][c] = true;
      const idx = r * n + c;

      steps.push({
        line: 6,
        explanation: `Time t=${t}: add cell (${r},${c}) with elevation ${t}. Union with adjacent already-added cells.`,
        variables: { t, r, c, idx },
        visualization: {
          type: 'array',
          array: flatGrid,
          highlights: { [idx]: 'active' },
          labels: { [idx]: `t=${t}`, 0: `find(0)=${find(0)}`, [n * n - 1]: `find(end)=${find(n * n - 1)}` },
        },
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && added[nr][nc]) {
          union(idx, nr * n + nc);
        }
      }

      if (find(0) === find(n * n - 1)) {
        steps.push({
          line: 9,
          explanation: `(0,0) and (n-1,n-1) are now connected at time t=${t}. Minimum time to swim across: ${t}.`,
          variables: { result: t },
          visualization: {
            type: 'array',
            array: flatGrid,
            highlights: {
              0: 'found',
              [n * n - 1]: 'found',
              [idx]: 'found',
            },
            labels: { 0: 'start', [n * n - 1]: 'end', [idx]: `t=${t}` },
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 11,
      explanation: `All cells added. Result: ${n * n - 1}.`,
      variables: { result: n * n - 1 },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default swimInRisingWaterUf;
