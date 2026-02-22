import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const makingALargeIsland: AlgorithmDefinition = {
  id: 'making-a-large-island',
  title: 'Making A Large Island',
  leetcodeNumber: 827,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an n x n binary grid, you may change at most one 0 to 1. Find the size of the largest island after this change. First label each island with a unique ID and compute island sizes using DFS. Then for each 0 cell, try flipping it and sum up the sizes of all distinct neighboring islands.',
  tags: ['graph', 'dfs', 'union find', 'island', 'matrix'],

  code: {
    pseudocode: `function largestIsland(grid):
  n = grid size
  islandId = 2  // starting label (0 and 1 are reserved)
  islandSize = {}
  // Label each island with DFS
  for each cell (r, c) with value 1:
    dfs(r, c, islandId, islandSize)
    islandId++
  // Try flipping each 0 cell
  maxSize = max(islandSize.values())
  for each cell (r, c) with value 0:
    neighbors = distinct island IDs adjacent
    maxSize = max(maxSize, 1 + sum(islandSize[id] for id in neighbors))
  return maxSize`,

    python: `def largestIsland(grid):
    n = len(grid)
    def dfs(r, c, iid):
        if r<0 or r>=n or c<0 or c>=n or grid[r][c]!=1: return 0
        grid[r][c] = iid
        return 1 + dfs(r-1,c,iid)+dfs(r+1,c,iid)+dfs(r,c-1,iid)+dfs(r,c+1,iid)
    iid = 2
    sizes = {}
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 1:
                sizes[iid] = dfs(r, c, iid); iid += 1
    res = max(sizes.values(), default=0)
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 0:
                seen = set()
                for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                    nr,nc=r+dr,c+dc
                    if 0<=nr<n and 0<=nc<n and grid[nr][nc]>1:
                        seen.add(grid[nr][nc])
                res = max(res, 1+sum(sizes[i] for i in seen))
    return res`,

    javascript: `function largestIsland(grid) {
  const n = grid.length;
  const sizes = new Map();
  let iid = 2;
  function dfs(r, c, id) {
    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return 0;
    grid[r][c] = id;
    return 1+dfs(r-1,c,id)+dfs(r+1,c,id)+dfs(r,c-1,id)+dfs(r,c+1,id);
  }
  for (let r=0;r<n;r++) for(let c=0;c<n;c++)
    if (grid[r][c]===1) { sizes.set(iid, dfs(r,c,iid)); iid++; }
  let res = Math.max(...sizes.values(), 0);
  for (let r=0;r<n;r++) for(let c=0;c<n;c++) if(grid[r][c]===0) {
    const seen = new Set();
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr,nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1) seen.add(grid[nr][nc]);
    }
    res = Math.max(res, 1+[...seen].reduce((s,id)=>s+sizes.get(id),0));
  }
  return res;
}`,

    java: `public int largestIsland(int[][] grid) {
    int n = grid.length;
    Map<Integer,Integer> sizes = new HashMap<>();
    int iid=2;
    for (int r=0;r<n;r++) for(int c=0;c<n;c++)
        if (grid[r][c]==1) { sizes.put(iid,dfs(grid,r,c,iid,n)); iid++; }
    int res = sizes.values().stream().mapToInt(Integer::intValue).max().orElse(0);
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    for (int r=0;r<n;r++) for(int c=0;c<n;c++) if(grid[r][c]==0) {
        Set<Integer> seen=new HashSet<>();
        for(int[] d:dirs) { int nr=r+d[0],nc=c+d[1]; if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]>1) seen.add(grid[nr][nc]); }
        int sum=1; for(int id:seen) sum+=sizes.getOrDefault(id,0);
        res=Math.max(res,sum);
    }
    return res;
}`,
  },

  defaultInput: {
    grid: [1, 0, 0, 0, 0, 0, 0, 1, 1],
    n: 3,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened NxN)',
      type: 'array',
      defaultValue: [1, 0, 0, 0, 0, 0, 0, 1, 1],
      placeholder: '1,0,0,0,0,0,0,1,1',
      helperText: 'Flattened NxN binary grid (1=land, 0=water)',
    },
    {
      name: 'n',
      label: 'Grid Size N',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatGrid = input.grid as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const g = flatGrid.slice(0, n * n);
    while (g.length < n * n) g.push(0);

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const sizes: Map<number, number> = new Map();
    let iid = 2;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...g],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find largest island after flipping one 0 to 1 in a ${n}x${n} grid. First label all islands with DFS.`,
      variables: { n },
      visualization: makeViz(
        g.reduce((acc, v, i) => { acc[i] = v === 1 ? 'active' : 'visited'; return acc; }, {} as Record<number, string>),
        {}
      ),
    });

    // DFS labeling
    function dfs(r: number, c: number, id: number): number {
      if (r < 0 || r >= n || c < 0 || c >= n || g[r * n + c] !== 1) return 0;
      g[r * n + c] = id;
      return 1 + dfs(r - 1, c, id) + dfs(r + 1, c, id) + dfs(r, c - 1, id) + dfs(r, c + 1, id);
    }

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (g[r * n + c] === 1) {
          const size = dfs(r, c, iid);
          sizes.set(iid, size);

          const hl: Record<number, string> = {};
          const lb: Record<number, string> = {};
          for (let i = 0; i < n * n; i++) {
            if (g[i] >= 2) { hl[i] = g[i] === iid ? 'found' : 'sorted'; lb[i] = `isl${g[i]}`; }
          }

          steps.push({
            line: 4,
            explanation: `Labeled island starting at (${r},${c}) as ID ${iid}. Size = ${size}.`,
            variables: { islandId: iid, size, totalIslands: sizes.size },
            visualization: makeViz(hl, lb),
          });

          iid++;
        }
      }
    }

    let res = sizes.size > 0 ? Math.max(...sizes.values()) : 0;

    steps.push({
      line: 7,
      explanation: `All islands labeled. Island sizes: ${[...sizes.entries()].map(([k, v]) => `ID${k}:${v}`).join(', ')}. Max without flip: ${res}.`,
      variables: { islandSizes: [...sizes.entries()].map(([k, v]) => `${k}:${v}`).join(','), maxWithoutFlip: res },
      visualization: makeViz(
        g.reduce((acc, v, i) => { acc[i] = v >= 2 ? 'sorted' : 'visited'; return acc; }, {} as Record<number, string>),
        g.reduce((acc, v, i) => { acc[i] = v >= 2 ? `isl${v}` : '0'; return acc; }, {} as Record<number, string>)
      ),
    });

    // Try each 0 cell
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const idx = r * n + c;
        if (g[idx] === 0) {
          const seen = new Set<number>();
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            const nIdx = nr * n + nc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && g[nIdx] > 1) {
              seen.add(g[nIdx]);
            }
          }

          let sum = 1;
          for (const id of seen) sum += sizes.get(id) || 0;

          const hl: Record<number, string> = {};
          const lb: Record<number, string> = {};
          hl[idx] = 'active';
          lb[idx] = `flip: ${sum}`;
          for (const id of seen) {
            for (let i = 0; i < n * n; i++) {
              if (g[i] === id) { hl[i] = 'comparing'; lb[i] = `isl${id}`; }
            }
          }

          steps.push({
            line: 10,
            explanation: `Flip (${r},${c}): connect islands [${[...seen].join(', ')}] of sizes [${[...seen].map(id => sizes.get(id)).join(', ')}]. Total = ${sum}.`,
            variables: { cell: `(${r},${c})`, neighborIslands: [...seen].join(','), total: sum },
            visualization: makeViz(hl, lb),
          });

          if (sum > res) res = sum;
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Maximum island size achievable by flipping one 0 = ${res}.`,
      variables: { result: res },
      visualization: makeViz(
        g.reduce((acc, v, i) => { acc[i] = v >= 2 ? 'sorted' : 'visited'; return acc; }, {} as Record<number, string>),
        { 0: `ans=${res}` }
      ),
    });

    return steps;
  },
};

export default makingALargeIsland;
