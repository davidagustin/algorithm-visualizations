import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToMakeAtLeastOneValidPath: AlgorithmDefinition = {
  id: 'minimum-cost-to-make-at-least-one-valid-path',
  title: 'Minimum Cost to Make at Least One Valid Path in a Grid',
  leetcodeNumber: 1368,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a grid where each cell has a direction (1=right, 2=left, 3=down, 4=up), find the minimum cost to go from (0,0) to (m-1,n-1). Moving in the cell\'s direction costs 0; changing the direction costs 1. Use 0-1 BFS (deque): free moves go to front, cost-1 moves go to back.',
  tags: ['Graph', 'BFS', 'Deque', '0-1 BFS', 'Shortest Path'],
  code: {
    pseudocode: `function minCost(grid):
  m, n = dimensions
  dist = INF matrix
  dist[0][0] = 0
  deque = [(0, 0, 0)]  // cost, row, col
  dirs = [(0,1), (0,-1), (1,0), (-1,0)]
  while deque:
    cost, r, c = deque.popleft()
    if cost > dist[r][c]: continue
    for d, (dr,dc) in enumerate(dirs):
      nr, nc = r+dr, c+dc
      if valid(nr,nc):
        moveCost = 0 if grid[r][c]==d+1 else 1
        if cost+moveCost < dist[nr][nc]:
          dist[nr][nc] = cost+moveCost
          if moveCost==0: deque.appendleft(...)
          else: deque.append(...)
  return dist[m-1][n-1]`,
    python: `def minCost(grid):
    m,n=len(grid),len(grid[0])
    dist=[[float('inf')]*n for _ in range(m)]
    dist[0][0]=0
    dq=deque([(0,0,0)])
    dirs=[(0,1),(0,-1),(1,0),(-1,0)]
    while dq:
        cost,r,c=dq.popleft()
        if cost>dist[r][c]: continue
        for d,(dr,dc) in enumerate(dirs):
            nr,nc=r+dr,c+dc
            if 0<=nr<m and 0<=nc<n:
                w=0 if grid[r][c]==d+1 else 1
                if cost+w<dist[nr][nc]:
                    dist[nr][nc]=cost+w
                    if w==0: dq.appendleft((cost,nr,nc))
                    else: dq.append((cost+1,nr,nc))
    return dist[m-1][n-1]`,
    javascript: `function minCost(grid) {
  const m=grid.length,n=grid[0].length;
  const dist=Array.from({length:m},()=>new Array(n).fill(Infinity));
  dist[0][0]=0;
  const dq=[[0,0,0]]; // cost,r,c
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  while(dq.length){
    const[cost,r,c]=dq.shift();
    if(cost>dist[r][c])continue;
    for(let d=0;d<4;d++){
      const[dr,dc]=dirs[d];const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<m&&nc>=0&&nc<n){
        const w=grid[r][c]===d+1?0:1;
        if(cost+w<dist[nr][nc]){
          dist[nr][nc]=cost+w;
          if(w===0)dq.unshift([cost,nr,nc]);else dq.push([cost+1,nr,nc]);
        }
      }
    }
  }
  return dist[m-1][n-1];
}`,
    java: `public int minCost(int[][] grid) {
    int m=grid.length,n=grid[0].length;
    int[][]dist=new int[m][n];for(int[]r:dist)Arrays.fill(r,Integer.MAX_VALUE);
    dist[0][0]=0;
    Deque<int[]>dq=new ArrayDeque<>();dq.add(new int[]{0,0,0});
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!dq.isEmpty()){
        int[]cur=dq.pollFirst();int cost=cur[0],r=cur[1],c=cur[2];
        if(cost>dist[r][c])continue;
        for(int d=0;d<4;d++){
            int nr=r+dirs[d][0],nc=c+dirs[d][1];
            if(nr>=0&&nr<m&&nc>=0&&nc<n){
                int w=grid[r][c]==d+1?0:1;
                if(cost+w<dist[nr][nc]){
                    dist[nr][nc]=cost+w;
                    if(w==0)dq.addFirst(new int[]{cost,nr,nc});
                    else dq.addLast(new int[]{cost+1,nr,nc});
                }
            }
        }
    }
    return dist[m-1][n-1];
}`,
  },
  defaultInput: {
    grid: [[1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1], [2, 2, 2, 2]],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid (1=right,2=left,3=down,4=up)',
      type: 'array',
      defaultValue: [[1, 1, 1, 1], [2, 2, 2, 2], [1, 1, 1, 1], [2, 2, 2, 2]],
      placeholder: '[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]',
      helperText: 'grid[i][j] = direction (1=R,2=L,3=D,4=U)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const m = grid.length, n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const dirNames = ['R', 'L', 'D', 'U'];

    const dist: number[][] = Array.from({ length: m }, () => new Array(n).fill(Infinity));
    dist[0][0] = 0;

    // Flatten grid for visualization
    function flatDist(): number[] {
      const res: number[] = [];
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        res.push(dist[i][j] === Infinity ? -1 : dist[i][j]);
      }
      return res;
    }

    function cellIdx(r: number, c: number): number { return r * n + c; }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      dequeSize: number,
      lastCell: string
    ): ArrayVisualization {
      return {
        type: 'array',
        array: flatDist(),
        highlights,
        labels,
        auxData: {
          label: '0-1 BFS: Min Cost Valid Path',
          entries: [
            { key: 'Last Processed', value: lastCell },
            { key: 'Deque Size', value: String(dequeSize) },
            { key: 'Grid Dirs', value: grid.flat().map((d, i) => dirNames[d - 1]).join('') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${m}x${n} grid. Directions: 1=R,2=L,3=D,4=U. Find min cost path (0,0)->(${m-1},${n-1}) using 0-1 BFS.`,
      variables: { m, n, startDir: grid[0][0] },
      visualization: makeViz(
        { 0: 'active' },
        Object.fromEntries(Array.from({ length: m * n }, (_, i) => [i, dirNames[grid[Math.floor(i / n)][i % n] - 1]])),
        1,
        '(0,0)'
      ),
    });

    const deque: [number, number, number][] = [[0, 0, 0]];
    let stepCount = 0;

    while (deque.length > 0 && stepCount < 20) {
      const [cost, r, c] = deque.shift()!;
      stepCount++;

      if (cost > dist[r][c]) continue;

      const curHighlights: Record<number, string> = {};
      curHighlights[cellIdx(r, c)] = 'found';
      for (let rr = 0; rr < m; rr++) for (let cc = 0; cc < n; cc++) {
        if (dist[rr][cc] < Infinity) curHighlights[cellIdx(rr, cc)] = curHighlights[cellIdx(rr, cc)] || 'sorted';
      }

      steps.push({
        line: 7,
        explanation: `Process (${r},${c}) cost=${cost}. Direction=${dirNames[grid[r][c] - 1]}. Explore neighbors.`,
        variables: { r, c, cost, dir: dirNames[grid[r][c] - 1] },
        visualization: makeViz(
          curHighlights,
          Object.fromEntries(Array.from({ length: m * n }, (_, i) => {
            const row = Math.floor(i / n), col = i % n;
            return [i, dist[row][col] === Infinity ? dirNames[grid[row][col] - 1] : String(dist[row][col])];
          })),
          deque.length,
          `(${r},${c}):c${cost}`
        ),
      });

      for (let d = 0; d < 4; d++) {
        const nr = r + dirs[d][0], nc = c + dirs[d][1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          const w = grid[r][c] === d + 1 ? 0 : 1;
          if (cost + w < dist[nr][nc]) {
            dist[nr][nc] = cost + w;
            if (w === 0) deque.unshift([cost, nr, nc]);
            else deque.push([cost + 1, nr, nc]);

            const nbHighlights = { ...curHighlights, [cellIdx(nr, nc)]: w === 0 ? 'active' : 'comparing' };
            steps.push({
              line: 13,
              explanation: `Move to (${nr},${nc}): cost ${w === 0 ? '0 (follow arrow)' : '1 (change direction)'}. dist[${nr}][${nc}]=${cost + w}.`,
              variables: { nr, nc, moveCost: w, newDist: cost + w },
              visualization: makeViz(
                nbHighlights,
                Object.fromEntries(Array.from({ length: m * n }, (_, i) => {
                  const row = Math.floor(i / n), col = i % n;
                  return [i, dist[row][col] === Infinity ? dirNames[grid[row][col] - 1] : String(dist[row][col])];
                })),
                deque.length,
                `->(${nr},${nc}):c${cost + w}`
              ),
            });
          }
        }
      }
    }

    const result = dist[m - 1][n - 1];
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < m * n; i++) {
      finalHighlights[i] = dist[Math.floor(i / n)][i % n] === Infinity ? 'mismatch' : 'found';
    }
    finalHighlights[cellIdx(m - 1, n - 1)] = 'active';

    steps.push({
      line: 16,
      explanation: `Minimum cost to reach (${m - 1},${n - 1}): ${result}.`,
      variables: { result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: m * n }, (_, i) => {
          const row = Math.floor(i / n), col = i % n;
          return [i, dist[row][col] === Infinity ? 'INF' : String(dist[row][col])];
        })),
        0,
        `ans=${result}`
      ),
    });

    return steps;
  },
};

export default minimumCostToMakeAtLeastOneValidPath;
