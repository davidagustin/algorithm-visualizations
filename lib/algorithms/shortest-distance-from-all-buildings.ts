import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const shortestDistanceFromAllBuildings: AlgorithmDefinition = {
  id: 'shortest-distance-from-all-buildings',
  title: 'Shortest Distance from All Buildings',
  leetcodeNumber: 317,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find an empty land cell with minimum total distance to all buildings. BFS from each building, accumulating distances to empty cells. Track how many buildings can reach each cell. Only cells reachable from all buildings are valid candidates. Return minimum total distance.',
  tags: ['graph', 'BFS', 'multi-source', 'grid', 'building distance'],

  code: {
    pseudocode: `function shortestDistance(grid):
  buildings = all cells with value 1
  totalDist = 0 matrix, reach = 0 matrix
  for each building (br, bc):
    BFS from (br, bc):
      for each empty cell (r, c) reached:
        totalDist[r][c] += steps
        reach[r][c] += 1
  numBuildings = len(buildings)
  result = min(totalDist[r][c]) where reach[r][c] == numBuildings
  return result or -1`,

    python: `from collections import deque
def shortestDistance(grid):
    R,C=len(grid),len(grid[0])
    totalDist=[[0]*C for _ in range(R)]
    reach=[[0]*C for _ in range(R)]
    buildings=[(r,c) for r in range(R) for c in range(C) if grid[r][c]==1]
    dirs=[(0,1),(0,-1),(1,0),(-1,0)]
    for br,bc in buildings:
        vis=set(); q=deque([(br,bc,0)])
        while q:
            r,c,d=q.popleft()
            for dr,dc in dirs:
                nr,nc=r+dr,c+dc
                if 0<=nr<R and 0<=nc<C and grid[nr][nc]==0 and (nr,nc) not in vis:
                    vis.add((nr,nc)); totalDist[nr][nc]+=d+1; reach[nr][nc]+=1; q.append((nr,nc,d+1))
    nb=len(buildings)
    res=[totalDist[r][c] for r in range(R) for c in range(C) if reach[r][c]==nb]
    return min(res) if res else -1`,

    javascript: `function shortestDistance(grid) {
  const R=grid.length,C=grid[0].length;
  const totalDist=Array.from({length:R},()=>new Array(C).fill(0));
  const reach=Array.from({length:R},()=>new Array(C).fill(0));
  const buildings=[];
  for(let r=0;r<R;r++) for(let c=0;c<C;c++) if(grid[r][c]===1) buildings.push([r,c]);
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  for(const[br,bc] of buildings){
    const vis=new Set(),q=[[br,bc,0]]; let qi=0;
    while(qi<q.length){
      const[r,c,d]=q[qi++];
      for(const[dr,dc] of dirs){
        const nr=r+dr,nc=c+dc,k=nr+','+nc;
        if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===0&&!vis.has(k)){
          vis.add(k);totalDist[nr][nc]+=d+1;reach[nr][nc]++;q.push([nr,nc,d+1]);
        }
      }
    }
  }
  const nb=buildings.length;
  const res=[];
  for(let r=0;r<R;r++) for(let c=0;c<C;c++) if(reach[r][c]===nb) res.push(totalDist[r][c]);
  return res.length?Math.min(...res):-1;
}`,

    java: `public int shortestDistance(int[][] grid) {
    int R=grid.length,C=grid[0].length;
    int[][] totalDist=new int[R][C], reach=new int[R][C];
    int nb=0;
    for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(grid[r][c]==1) nb++;
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(grid[r][c]==1){
        boolean[][]vis=new boolean[R][C];
        Queue<int[]> q=new LinkedList<>(); q.offer(new int[]{r,c,0});
        while(!q.isEmpty()){
            int[]cur=q.poll();
            for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];
                if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]==0&&!vis[nr][nc]){
                    vis[nr][nc]=true;totalDist[nr][nc]+=cur[2]+1;reach[nr][nc]++;q.offer(new int[]{nr,nc,cur[2]+1});}}}
    }
    int res=Integer.MAX_VALUE;
    for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(reach[r][c]==nb) res=Math.min(res,totalDist[r][c]);
    return res==Integer.MAX_VALUE?-1:res;
}`,
  },

  defaultInput: {
    grid: [[1,0,2,0,1],[0,0,0,0,0],[0,0,1,0,0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [1,0,2,0,1,0,0,0,0,0,0,0,1,0,0],
      placeholder: '1,0,2,0,1,...',
      helperText: '0=empty, 1=building, 2=obstacle',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const R = grid.length;
    const C = grid[0].length;

    const totalDist: number[][] = Array.from({ length: R }, () => new Array(C).fill(0));
    const reach: number[][] = Array.from({ length: R }, () => new Array(C).fill(0));
    const buildings: Array<[number, number]> = [];

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === 1) buildings.push([r, c]);
      }
    }

    steps.push({
      line: 2,
      explanation: `Found ${buildings.length} building(s) at: [${buildings.map(([r, c]) => `(${r},${c})`).join(', ')}]. BFS from each to accumulate distances to empty cells.`,
      variables: { buildings: buildings.length, gridSize: `${R}x${C}` },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(buildings.map(([r, c]) => [r * C + c, 'active'])),
        labels: Object.fromEntries(buildings.map(([r, c], i) => [r * C + c, `B${i + 1}`])),
      },
    });

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let bi = 0; bi < buildings.length; bi++) {
      const [br, bc] = buildings[bi];
      const vis = new Set<string>();
      const queue: Array<[number, number, number]> = [[br, bc, 0]];
      let qi = 0;

      steps.push({
        line: 5,
        explanation: `BFS from building ${bi + 1} at (${br},${bc}). Spreading distances to all reachable empty cells.`,
        variables: { building: bi + 1, from: `(${br},${bc})` },
        visualization: {
          type: 'array',
          array: grid.flat(),
          highlights: { [br * C + bc]: 'active' },
          labels: { [br * C + bc]: `B${bi + 1}` },
        },
      });

      while (qi < queue.length) {
        const [r, c, d] = queue[qi++];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 0 && !vis.has(key)) {
            vis.add(key);
            totalDist[nr][nc] += d + 1;
            reach[nr][nc]++;
            queue.push([nr, nc, d + 1]);
          }
        }
      }

      steps.push({
        line: 8,
        explanation: `BFS from B${bi + 1} done. Accumulated distances in totalDist. Cells now reached by ${bi + 1} building(s).`,
        variables: { buildingsDone: bi + 1, totalBuildings: buildings.length },
        visualization: {
          type: 'array',
          array: totalDist.flat(),
          highlights: Object.fromEntries(buildings.slice(0, bi + 1).map(([r, c]) => [r * C + c, 'sorted'])),
          labels: Object.fromEntries(buildings.map(([r, c], i) => [r * C + c, `B${i + 1}`])),
        },
      });
    }

    // Find minimum
    let result = 100000;
    let bestR = -1;
    let bestC = -1;
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (reach[r][c] === buildings.length && totalDist[r][c] < result) {
          result = totalDist[r][c];
          bestR = r;
          bestC = c;
        }
      }
    }

    if (result === 100000) {
      steps.push({
        line: 10,
        explanation: 'No empty cell is reachable from all buildings. Return -1.',
        variables: { result: -1 },
        visualization: {
          type: 'array',
          array: grid.flat(),
          highlights: {},
          labels: { 0: 'no solution' },
        },
      });
    } else {
      steps.push({
        line: 10,
        explanation: `Best meeting point at (${bestR},${bestC}) with total distance ${result}. This cell is reachable from all ${buildings.length} buildings.`,
        variables: { result, bestCell: `(${bestR},${bestC})` },
        visualization: {
          type: 'array',
          array: totalDist.flat().map(d => d === 0 && grid.flat()[totalDist.flat().indexOf(d)] !== 0 ? 999 : d),
          highlights: { [bestR * C + bestC]: 'found', ...Object.fromEntries(buildings.map(([r, c]) => [r * C + c, 'active'])) },
          labels: { [bestR * C + bestC]: `best=${result}` },
        },
      });
    }

    return steps;
  },
};

export default shortestDistanceFromAllBuildings;
