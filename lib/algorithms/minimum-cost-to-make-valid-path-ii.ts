import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumCostToMakeValidPathIi: AlgorithmDefinition = {
  id: 'minimum-cost-to-make-valid-path-ii',
  title: 'Minimum Cost to Make at Least One Valid Path in a Grid II',
  leetcodeNumber: 1368,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a grid where each cell has a direction (right, left, down, up), find minimum cost to reach the bottom-right. Moving in the existing direction costs 0; changing direction costs 1. Uses 0-1 BFS (deque): edges with cost 0 go to front, edges with cost 1 go to back.',
  tags: ['graph', '0-1 BFS', 'deque', 'grid', 'shortest path'],

  code: {
    pseudocode: `function minCost(grid):
  rows, cols = dimensions
  dist[0][0] = 0, others = INF
  deque = [(0, 0, 0)]  // cost, row, col
  dirs = [right, left, down, up] (1-indexed)
  while deque not empty:
    cost, r, c = pop front
    if cost > dist[r][c]: continue
    for d, (dr, dc) in enumerate(dirs):
      nr, nc = r+dr, c+dc
      newCost = cost + (0 if grid[r][c]==d+1 else 1)
      if newCost < dist[nr][nc]:
        dist[nr][nc] = newCost
        if newCost == cost: pushFront
        else: pushBack
  return dist[rows-1][cols-1]`,

    python: `from collections import deque
def minCost(grid):
    R,C=len(grid),len(grid[0])
    INF=float('inf')
    dist=[[INF]*C for _ in range(R)]
    dist[0][0]=0
    dq=deque([(0,0,0)])
    dirs=[(0,1),(0,-1),(1,0),(-1,0)]
    while dq:
        cost,r,c=dq.popleft()
        if cost>dist[r][c]: continue
        for i,(dr,dc) in enumerate(dirs):
            nr,nc=r+dr,c+dc
            if 0<=nr<R and 0<=nc<C:
                nc2=cost+(0 if grid[r][c]==i+1 else 1)
                if nc2<dist[nr][nc]:
                    dist[nr][nc]=nc2
                    if nc2==cost: dq.appendleft((nc2,nr,nc))
                    else: dq.append((nc2,nr,nc))
    return dist[R-1][C-1]`,

    javascript: `function minCost(grid) {
  const R=grid.length,C=grid[0].length,INF=Infinity;
  const dist=Array.from({length:R},()=>new Array(C).fill(INF));
  dist[0][0]=0;
  const dq=[[0,0,0]]; let qi=0;
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  while(qi<dq.length) {
    const[cost,r,c]=dq[qi++];
    if(cost>dist[r][c]) continue;
    for(let i=0;i<4;i++) {
      const[dr,dc]=dirs[i],nr=r+dr,nc2=c+dc;
      if(nr>=0&&nr<R&&nc2>=0&&nc2<C) {
        const nc3=cost+(grid[r][c]===i+1?0:1);
        if(nc3<dist[nr][nc2]) {
          dist[nr][nc2]=nc3;
          if(nc3===cost) dq.splice(qi,0,[nc3,nr,nc2]);
          else dq.push([nc3,nr,nc2]);
        }
      }
    }
  }
  return dist[R-1][C-1];
}`,

    java: `public int minCost(int[][] grid) {
    int R=grid.length,C=grid[0].length,INF=Integer.MAX_VALUE;
    int[][] dist=new int[R][C];
    for(int[]r:dist) Arrays.fill(r,INF); dist[0][0]=0;
    Deque<int[]> dq=new ArrayDeque<>(); dq.offer(new int[]{0,0,0});
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!dq.isEmpty()){
        int[]cur=dq.poll(); int cost=cur[0],r=cur[1],c=cur[2];
        if(cost>dist[r][c]) continue;
        for(int i=0;i<4;i++){
            int nr=r+dirs[i][0],nc=c+dirs[i][1];
            if(nr>=0&&nr<R&&nc>=0&&nc<C){
                int nc2=cost+(grid[r][c]==i+1?0:1);
                if(nc2<dist[nr][nc]){dist[nr][nc]=nc2;if(nc2==cost)dq.offerFirst(new int[]{nc2,nr,nc});else dq.offerLast(new int[]{nc2,nr,nc});}
            }
        }
    }
    return dist[R-1][C-1];
}`,
  },

  defaultInput: {
    n: 3,
    grid: [[1,1,3],[3,2,2],[1,1,4]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Grid Size (n x n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Grid dimensions',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const R = grid.length;
    const C = grid[0].length;
    const INF = 10000;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const dirNames = ['right', 'left', 'down', 'up'];

    const dist: number[][] = Array.from({ length: R }, () => new Array(C).fill(INF));
    dist[0][0] = 0;
    const deque: Array<[number, number, number]> = [[0, 0, 0]];

    steps.push({
      line: 2,
      explanation: `0-1 BFS on ${R}x${C} grid. Directions: 1=right,2=left,3=down,4=up. Moving in existing direction: cost 0; changing: cost 1.`,
      variables: { rows: R, cols: C, start: '(0,0)', end: `(${R - 1},${C - 1})` },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: { 0: 'active', [R * C - 1]: 'pointer' },
        labels: { 0: 'start', [R * C - 1]: 'end' },
      },
    });

    steps.push({
      line: 3,
      explanation: `Grid flattened: [${grid.flat().join(', ')}]. dist[0][0]=0.`,
      variables: { distAt00: 0 },
      visualization: {
        type: 'array',
        array: dist.flat().map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'active' },
        labels: { 0: 'cost=0' },
      },
    });

    let qi = 0;
    let iterations = 0;
    while (qi < deque.length && iterations < 20) {
      iterations++;
      const [cost, r, c] = deque[qi++];

      if (cost > dist[r][c]) continue;

      steps.push({
        line: 7,
        explanation: `Process cell (${r},${c}) cost=${cost}. Grid value=${grid[r][c]} means default direction: ${dirNames[grid[r][c] - 1]}.`,
        variables: { row: r, col: c, cost, direction: dirNames[grid[r][c] - 1] },
        visualization: {
          type: 'array',
          array: dist.flat().map(d => (d === INF ? 999 : d)),
          highlights: { [r * C + c]: 'active', [(R - 1) * C + (C - 1)]: 'pointer' },
          labels: { [r * C + c]: `c=${cost}` },
        },
      });

      for (let i = 0; i < 4; i++) {
        const [dr, dc] = dirs[i];
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
          const moveCost = cost + (grid[r][c] === i + 1 ? 0 : 1);
          if (moveCost < dist[nr][nc]) {
            dist[nr][nc] = moveCost;
            if (moveCost === cost) {
              deque.splice(qi, 0, [moveCost, nr, nc]);
            } else {
              deque.push([moveCost, nr, nc]);
            }
            steps.push({
              line: 11,
              explanation: `Move ${dirNames[i]} to (${nr},${nc}): cost ${moveCost} (${grid[r][c] === i + 1 ? 'FREE - matches direction' : 'costs 1 - direction change'}). Update dist[${nr}][${nc}]=${moveCost}.`,
              variables: { to: `(${nr},${nc})`, moveCost, isFree: grid[r][c] === i + 1 },
              visualization: {
                type: 'array',
                array: dist.flat().map(d => (d === INF ? 999 : d)),
                highlights: { [r * C + c]: 'active', [nr * C + nc]: 'comparing' },
                labels: { [nr * C + nc]: `=${moveCost}` },
              },
            });
          }
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Minimum cost to reach (${R - 1},${C - 1}) = ${dist[R - 1][C - 1]}.`,
      variables: { result: dist[R - 1][C - 1] },
      visualization: {
        type: 'array',
        array: dist.flat().map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'found', [R * C - 1]: 'found' },
        labels: { 0: 'start', [R * C - 1]: `cost=${dist[R - 1][C - 1]}` },
      },
    });

    return steps;
  },
};

export default minimumCostToMakeValidPathIi;
