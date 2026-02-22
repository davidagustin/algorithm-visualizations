import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToMakeValidPath: AlgorithmDefinition = {
  id: 'minimum-cost-to-make-valid-path',
  title: 'Minimum Cost to Make at Least One Valid Path in a Grid',
  leetcodeNumber: 1368,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Each cell in a grid has a direction arrow. Moving along the arrow costs 0; changing direction costs 1. Find the minimum cost path from top-left to bottom-right. Uses 0-1 BFS (deque): free moves go to front, cost-1 moves go to back of the deque.',
  tags: ['0-1 BFS', 'deque', 'shortest path', 'grid', 'graph'],

  code: {
    pseudocode: `function minCost(grid):
  m, n = dimensions
  dist = [Infinity]*m*n, dist[0][0] = 0
  deque = [(0, 0, 0)] // (cost, row, col)
  dirs = [right, left, down, up]
  while deque not empty:
    (cost, r, c) = dequeue front
    if cost > dist[r][c]: skip
    for each (dr, dc, d) in dirs:
      nr, nc = r+dr, c+dc
      newCost = cost + (grid[r][c] != d ? 1 : 0)
      if newCost < dist[nr][nc]:
        dist[nr][nc] = newCost
        if free: push front else push back
  return dist[m-1][n-1]`,

    python: `from collections import deque
def minCost(grid):
    m, n = len(grid), len(grid[0])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    dist = [[float('inf')]*n for _ in range(m)]
    dist[0][0] = 0
    dq = deque([(0,0,0)])
    while dq:
        cost,r,c = dq.popleft()
        if cost > dist[r][c]: continue
        for i,(dr,dc) in enumerate(dirs):
            nr,nc = r+dr,c+dc
            if 0<=nr<m and 0<=nc<n:
                nc_cost = cost + (0 if grid[r][c]==i+1 else 1)
                if nc_cost < dist[nr][nc]:
                    dist[nr][nc] = nc_cost
                    if grid[r][c]==i+1: dq.appendleft((nc_cost,nr,nc))
                    else: dq.append((nc_cost,nr,nc))
    return dist[m-1][n-1]`,

    javascript: `function minCost(grid) {
  const m=grid.length, n=grid[0].length;
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  const dist=Array.from({length:m},()=>new Array(n).fill(Infinity));
  dist[0][0]=0;
  const dq=[[0,0,0]];
  let head=0;
  while(head<dq.length){
    const[cost,r,c]=dq[head++];
    if(cost>dist[r][c])continue;
    dirs.forEach(([dr,dc],i)=>{
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<m&&nc>=0&&nc<n){
        const nc2=cost+(grid[r][c]===i+1?0:1);
        if(nc2<dist[nr][nc]){
          dist[nr][nc]=nc2;
          if(grid[r][c]===i+1)dq.unshift([nc2,nr,nc]);
          else dq.push([nc2,nr,nc]);
        }
      }
    });
  }
  return dist[m-1][n-1];
}`,

    java: `public int minCost(int[][] grid) {
    int m=grid.length,n=grid[0].length;
    int[][] dist=new int[m][n];
    for(int[] r:dist) Arrays.fill(r,Integer.MAX_VALUE);
    dist[0][0]=0;
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    Deque<int[]> dq=new ArrayDeque<>();
    dq.addFirst(new int[]{0,0,0});
    while(!dq.isEmpty()){
        int[] cur=dq.pollFirst();
        int cost=cur[0],r=cur[1],c=cur[2];
        if(cost>dist[r][c])continue;
        for(int i=0;i<4;i++){
            int nr=r+dirs[i][0],nc=c+dirs[i][1];
            if(nr>=0&&nr<m&&nc>=0&&nc<n){
                int nc2=cost+(grid[r][c]==i+1?0:1);
                if(nc2<dist[nr][nc]){dist[nr][nc]=nc2;
                if(grid[r][c]==i+1)dq.addFirst(new int[]{nc2,nr,nc});
                else dq.addLast(new int[]{nc2,nr,nc});}
            }
        }
    }
    return dist[m-1][n-1];
}`,
  },

  defaultInput: {
    grid: [1, 1, 1, 3, 1, 2],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flat row-major, 1=R,2=L,3=D,4=U)',
      type: 'array',
      defaultValue: [1, 1, 1, 3, 1, 2],
      placeholder: '1,1,1,3,1,2',
      helperText: 'Flat 2-row grid. Directions: 1=Right 2=Left 3=Down 4=Up',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.grid as number[];
    const steps: AlgorithmStep[] = [];

    // Interpret as 2-column grid for simplicity
    const cols = 3;
    const rows = Math.ceil(flat.length / cols);
    const grid: number[][] = Array.from({ length: rows }, (_, r) => flat.slice(r * cols, r * cols + cols));

    const m = grid.length, n = grid[0]?.length ?? 0;
    const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
    dist[0][0] = 0;

    const dq: [number, number, number][] = [[0, 0, 0]];
    let head = 0;

    const flatDist = () => dist.flat();

    const makeViz = (activeIdx: number): ArrayVisualization => ({
      type: 'array',
      array: flatDist().map(d => (d === Infinity ? 99 : d)),
      highlights: Object.fromEntries(
        flatDist().map((d, i) => [i, i === activeIdx ? 'active' : d < Infinity ? 'visited' : 'default'])
      ),
      labels: Object.fromEntries(flatDist().map((_, i) => [i, `(${Math.floor(i / n)},${i % n})`])),
    });

    steps.push({
      line: 2,
      explanation: `Grid is ${m}x${n}. 0-1 BFS: free moves (matching arrow) cost 0, direction changes cost 1.`,
      variables: { m, n, gridFlat: flat },
      visualization: makeViz(0),
    });

    while (head < dq.length) {
      const [cost, r, c] = dq[head++];
      if (cost > dist[r][c]) continue;

      const cellIdx = r * n + c;

      steps.push({
        line: 7,
        explanation: `Process cell (${r},${c}) with cost ${cost}. Arrow direction: ${['R', 'L', 'D', 'U'][grid[r][c] - 1]}.`,
        variables: { row: r, col: c, cost, direction: ['R', 'L', 'D', 'U'][grid[r][c] - 1] },
        visualization: makeViz(cellIdx),
      });

      for (let i = 0; i < 4; i++) {
        const nr = r + dirs[i][0], nc = c + dirs[i][1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          const newCost = cost + (grid[r][c] === i + 1 ? 0 : 1);
          if (newCost < dist[nr][nc]) {
            dist[nr][nc] = newCost;
            const isFree = grid[r][c] === i + 1;
            if (isFree) dq.splice(head, 0, [newCost, nr, nc]);
            else dq.push([newCost, nr, nc]);
            steps.push({
              line: 11,
              explanation: `Move to (${nr},${nc}): cost=${newCost} (${isFree ? 'free - matches arrow' : 'cost 1 - direction change'}). Push to ${isFree ? 'front' : 'back'}.`,
              variables: { nr, nc, newCost, isFree },
              visualization: makeViz(nr * n + nc),
            });
          }
        }
      }
    }

    const result = dist[m - 1][n - 1];
    steps.push({
      line: 13,
      explanation: `0-1 BFS complete. Minimum cost to reach bottom-right (${m - 1},${n - 1}) = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: flatDist().map(d => (d === Infinity ? 99 : d)),
        highlights: Object.fromEntries(flatDist().map((_, i) => [i, i === m * n - 1 ? 'found' : 'sorted'])),
        labels: Object.fromEntries(flatDist().map((_, i) => [i, `(${Math.floor(i / n)},${i % n})`])),
      },
    });

    return steps;
  },
};

export default minimumCostToMakeValidPath;
