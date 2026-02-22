import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfFish: AlgorithmDefinition = {
  id: 'maximum-number-of-fish',
  title: 'Maximum Number of Fish in a Grid',
  leetcodeNumber: 2658,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a grid where grid[r][c] is the number of fish in a water cell (>0) or a land cell (0), find the maximum number of fish you can catch in a connected water region. Use union find to group connected water cells, tracking total fish per component. The answer is the maximum fish in any component.',
  tags: ['union find', 'graph', 'grid', 'dfs'],

  code: {
    pseudocode: `function findMaxFish(grid):
  m, n = dimensions
  parent = [0..m*n-1]
  fishCount = [grid[r][c] for all cells]
  for r in 0..m-1:
    for c in 0..n-1:
      if grid[r][c] > 0:
        for each neighbor (nr, nc) that is water:
          rootA = find(r*n+c)
          rootB = find(nr*n+nc)
          if rootA != rootB:
            fishCount[rootB] += fishCount[rootA]
            parent[rootA] = rootB
  return max(fishCount[find(r*n+c)] for water cells)`,

    python: `def findMaxFish(grid):
    m, n = len(grid), len(grid[0])
    parent = list(range(m * n))
    fish = [grid[r][c] for r in range(m) for c in range(n)]
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    for r in range(m):
        for c in range(n):
            if grid[r][c] > 0:
                for dr, dc in dirs:
                    nr, nc = r+dr, c+dc
                    if 0<=nr<m and 0<=nc<n and grid[nr][nc]>0:
                        ra, rb = find(r*n+c), find(nr*n+nc)
                        if ra != rb:
                            fish[rb] += fish[ra]
                            parent[ra] = rb
    return max((fish[find(r*n+c)] for r in range(m) for c in range(n) if grid[r][c]>0), default=0)`,

    javascript: `function findMaxFish(grid) {
  const m=grid.length,n=grid[0].length;
  const parent=Array.from({length:m*n},(_,i)=>i);
  const fish=grid.flat();
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  const dirs=[[0,1],[1,0],[0,-1],[-1,0]];
  for(let r=0;r<m;r++) for(let c=0;c<n;c++)
    if(grid[r][c]>0)
      for(const[dr,dc]of dirs){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]>0){
          const ra=find(r*n+c),rb=find(nr*n+nc);
          if(ra!==rb){fish[rb]+=fish[ra];parent[ra]=rb;}
        }
      }
  let res=0;
  for(let r=0;r<m;r++) for(let c=0;c<n;c++)
    if(grid[r][c]>0) res=Math.max(res,fish[find(r*n+c)]);
  return res;
}`,

    java: `public int findMaxFish(int[][] grid) {
    int m=grid.length,n=grid[0].length;
    int[]parent=new int[m*n],fish=new int[m*n];
    for(int r=0;r<m;r++) for(int c=0;c<n;c++){parent[r*n+c]=r*n+c;fish[r*n+c]=grid[r][c];}
    int[][]dirs={{0,1},{1,0},{0,-1},{-1,0}};
    for(int r=0;r<m;r++) for(int c=0;c<n;c++)
        if(grid[r][c]>0) for(int[]d:dirs){
            int nr=r+d[0],nc=c+d[1];
            if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]>0){
                int ra=find(parent,r*n+c),rb=find(parent,nr*n+nc);
                if(ra!=rb){fish[rb]+=fish[ra];parent[ra]=rb;}
            }
        }
    int res=0;
    for(int r=0;r<m;r++) for(int c=0;c<n;c++)
        if(grid[r][c]>0) res=Math.max(res,fish[find(parent,r*n+c)]);
    return res;
}`,
  },

  defaultInput: {
    grid: [[0, 2, 1, 0], [4, 0, 0, 3], [1, 0, 0, 4], [0, 3, 2, 0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [[0, 2, 1, 0], [4, 0, 0, 3], [1, 0, 0, 4], [0, 3, 2, 0]],
      placeholder: '[[0,2,1,0],[4,0,0,3]]',
      helperText: 'Grid where 0=land, positive=water with fish count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;

    const parent: number[] = Array.from({ length: m * n }, (_, i) => i);
    const fish: number[] = grid.flat();

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `${m}x${n} grid. Water cells (>0) contain fish. Track fish count per union-find component.`,
      variables: { m, n, totalFish: fish.reduce((a, b) => a + b, 0) },
      visualization: {
        type: 'array',
        array: fish,
        highlights: Object.fromEntries(fish.map((v, i) => [i, v > 0 ? 'active' : 'default'])),
        labels: Object.fromEntries(fish.map((v, i) => [i, v > 0 ? `f:${v}` : 'land'])),
      },
    });

    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] <= 0) continue;
        const idx = r * n + c;

        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > 0) {
            const ra = find(idx);
            const rb = find(nr * n + nc);

            if (ra !== rb) {
              fish[rb] += fish[ra];
              parent[ra] = rb;

              steps.push({
                line: 10,
                explanation: `Union water cell (${r},${c}) with (${nr},${nc}). Combined fish: ${fish[rb]}.`,
                variables: { r, c, nr, nc, combinedFish: fish[rb] },
                visualization: {
                  type: 'array',
                  array: fish,
                  highlights: { [idx]: 'active', [nr * n + nc]: 'comparing' },
                  labels: { [rb]: `fish:${fish[rb]}`, [idx]: `merged` },
                },
              });
            }
          }
        }
      }
    }

    let maxFish = 0;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] > 0) {
          maxFish = Math.max(maxFish, fish[find(r * n + c)]);
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `All water cells processed. Maximum fish in any connected water region: ${maxFish}.`,
      variables: { result: maxFish },
      visualization: {
        type: 'array',
        array: fish,
        highlights: Object.fromEntries(fish.map((v, i) => [i, fish[find(i)] === maxFish && grid[Math.floor(i / n)][i % n] > 0 ? 'found' : 'visited'])),
        labels: { 0: `max:${maxFish}` },
      },
    });

    return steps;
  },
};

export default maximumNumberOfFish;
