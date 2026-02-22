import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfIslandsUnionFind: AlgorithmDefinition = {
  id: 'number-of-islands-union-find',
  title: 'Number of Islands (Union Find)',
  leetcodeNumber: 200,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Count the number of islands in a grid using Union Find. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. Initialize each land cell as its own component. Then union adjacent land cells. The number of components at the end equals the number of islands.',
  tags: ['union find', 'graph', 'grid', 'connected components'],

  code: {
    pseudocode: `function numIslands(grid):
  m, n = dimensions
  parent = [r*n+c for each land cell]
  islandCount = count of land cells
  for r in 0..m-1:
    for c in 0..n-1:
      if grid[r][c] == '1':
        for each neighbor (nr, nc) that is land:
          rootA = find(r*n+c)
          rootB = find(nr*n+nc)
          if rootA != rootB:
            union(rootA, rootB)
            islandCount -= 1
  return islandCount`,

    python: `def numIslands(grid):
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    parent = list(range(m * n))
    count = sum(grid[r][c] == '1' for r in range(m) for c in range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                for dr, dc in [(0,1),(1,0)]:
                    nr, nc = r+dr, c+dc
                    if 0<=nr<m and 0<=nc<n and grid[nr][nc]=='1':
                        ra, rb = find(r*n+c), find(nr*n+nc)
                        if ra != rb:
                            parent[ra] = rb
                            count -= 1
    return count`,

    javascript: `function numIslands(grid) {
  const m=grid.length, n=grid[0].length;
  const parent=Array.from({length:m*n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  let count=0;
  for(let r=0;r<m;r++) for(let c=0;c<n;c++) if(grid[r][c]==='1') count++;
  for(let r=0;r<m;r++) for(let c=0;c<n;c++) {
    if(grid[r][c]==='1') {
      for(const[dr,dc]of[[0,1],[1,0]]) {
        const nr=r+dr,nc=c+dc;
        if(nr<m&&nc<n&&grid[nr][nc]==='1'){
          const ra=find(r*n+c),rb=find(nr*n+nc);
          if(ra!==rb){parent[ra]=rb;count--;}
        }
      }
    }
  }
  return count;
}`,

    java: `public int numIslands(char[][] grid) {
    int m=grid.length, n=grid[0].length;
    int[] parent=new int[m*n];
    for(int i=0;i<m*n;i++) parent[i]=i;
    int count=0;
    for(char[]row:grid) for(char c:row) if(c=='1') count++;
    int[][]dirs={{0,1},{1,0}};
    for(int r=0;r<m;r++) for(int c=0;c<n;c++)
        if(grid[r][c]=='1')
            for(int[]d:dirs){
                int nr=r+d[0],nc=c+d[1];
                if(nr<m&&nc<n&&grid[nr][nc]=='1'){
                    int ra=find(parent,r*n+c),rb=find(parent,nr*n+nc);
                    if(ra!=rb){parent[ra]=rb;count--;}
                }
            }
    return count;
}`,
  },

  defaultInput: {
    grid: [
      ['1', '1', '0', '0', '0'],
      ['1', '1', '0', '0', '0'],
      ['0', '0', '1', '0', '0'],
      ['0', '0', '0', '1', '1'],
    ],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']],
      placeholder: '[["1","1","0"],["0","0","0"]]',
      helperText: 'Grid of "1" (land) and "0" (water)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as string[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;

    const parent: number[] = Array.from({ length: m * n }, (_, i) => i);
    let count = 0;

    // Count initial land cells
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === '1') count++;
      }
    }

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    const flatGrid = grid.flat().map(v => (v === '1' ? 1 : 0));

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Found ${count} land cells. Each land cell starts as its own island component.`,
      variables: { m, n, initialLandCells: count },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: Object.fromEntries(flatGrid.map((v, i) => [i, v === 1 ? 'visited' : 'default'])),
        labels: Object.fromEntries(flatGrid.map((v, i) => [i, v === 1 ? '1' : '0'])),
      },
    });

    const dirs = [[0, 1], [1, 0]];

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] !== '1') continue;
        const idx = r * n + c;

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < m && nc < n && grid[nr][nc] === '1') {
            const nIdx = nr * n + nc;
            const ra = find(idx);
            const rb = find(nIdx);

            steps.push({
              line: 9,
              explanation: `Check cell (${r},${c}) with neighbor (${nr},${nc}). find(${idx})=${ra}, find(${nIdx})=${rb}. ${ra !== rb ? 'Different islands - merge them! Islands: ' + (count - 1) : 'Same island already.'}`,
              variables: { r, c, nr, nc, rootA: ra, rootB: rb, islands: ra !== rb ? count - 1 : count },
              visualization: {
                type: 'array',
                array: flatGrid,
                highlights: { [idx]: 'active', [nIdx]: 'comparing' },
                labels: { [idx]: `r:${find(idx)}`, [nIdx]: `r:${find(nIdx)}` },
              },
            });

            if (ra !== rb) {
              parent[ra] = rb;
              count--;
            }
          }
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `All adjacent land cells merged. Total islands: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: flatGrid,
        highlights: Object.fromEntries(flatGrid.map((v, i) => [i, v === 1 ? 'found' : 'default'])),
        labels: { 0: `islands:${count}` },
      },
    });

    return steps;
  },
};

export default numberOfIslandsUnionFind;
