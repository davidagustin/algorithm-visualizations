import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const aStarPathfinding: AlgorithmDefinition = {
  id: 'a-star-pathfinding',
  title: 'A* Pathfinding with Manhattan Heuristic',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A* uses a heuristic to guide Dijkstra toward the target. f(n) = g(n) + h(n) where g(n) is the cost from source and h(n) is the Manhattan distance estimate to the target. The heuristic makes A* faster than Dijkstra for grid-based pathfinding by exploring fewer nodes.',
  tags: ['graph', 'A*', 'heuristic', 'shortest path', 'Manhattan distance', 'grid'],

  code: {
    pseudocode: `function aStar(grid, start, end):
  g = cost from start, g[start] = 0
  h = Manhattan distance to end
  f = g + h (priority in heap)
  openSet = {start}, closedSet = {}
  while openSet not empty:
    current = node with lowest f
    if current == end: return g[end]
    move current to closedSet
    for each neighbor of current:
      if neighbor in closedSet: continue
      tentative_g = g[current] + 1
      if tentative_g < g[neighbor]:
        g[neighbor] = tentative_g
        f[neighbor] = g[neighbor] + h(neighbor)
        add neighbor to openSet`,

    python: `import heapq
def aStar(grid, start, end):
    rows,cols=len(grid),len(grid[0])
    def h(r,c): return abs(r-end[0])+abs(c-end[1])
    g={start:0}; f={start:h(*start)}
    heap=[(f[start],start)]; closed=set()
    while heap:
        _,cur=heapq.heappop(heap)
        if cur==end: return g[end]
        if cur in closed: continue
        closed.add(cur)
        for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr,nc=cur[0]+dr,cur[1]+dc
            nb=(nr,nc)
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==0 and nb not in closed:
                ng=g[cur]+1
                if ng<g.get(nb,float('inf')):
                    g[nb]=ng; f[nb]=ng+h(nr,nc)
                    heapq.heappush(heap,(f[nb],nb))
    return -1`,

    javascript: `function aStar(grid, start, end) {
  const [er,ec]=end;
  const h=(r,c)=>Math.abs(r-er)+Math.abs(c-ec);
  const g=new Map([[start.toString(),0]]);
  const heap=[[h(...start),...start]];
  const closed=new Set();
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  while(heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const[,r,c]=heap.shift(); const key=r+','+c;
    if(r===er&&c===ec) return g.get(key);
    if(closed.has(key)) continue; closed.add(key);
    for(const[dr,dc] of dirs){
      const nr=r+dr,nc=c+dc,nk=nr+','+nc;
      if(nr>=0&&nr<grid.length&&nc>=0&&nc<grid[0].length&&grid[nr][nc]===0&&!closed.has(nk)){
        const ng=(g.get(key)||0)+1;
        if(ng<(g.get(nk)||Infinity)){g.set(nk,ng);heap.push([ng+h(nr,nc),nr,nc]);}
      }
    }
  }
  return -1;
}`,

    java: `public int aStar(int[][] grid, int[] start, int[] end) {
    int R=grid.length,C=grid[0].length;
    int[][] g=new int[R][C]; for(int[] r:g) Arrays.fill(r,Integer.MAX_VALUE);
    g[start[0]][start[1]]=0;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{Math.abs(start[0]-end[0])+Math.abs(start[1]-end[1]),start[0],start[1]});
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int r=cur[1],c=cur[2];
        if(r==end[0]&&c==end[1]) return g[r][c];
        if(cur[0]>g[r][c]+Math.abs(r-end[0])+Math.abs(c-end[1])) continue;
        for(int[]d:new int[][]{{0,1},{0,-1},{1,0},{-1,0}}){
            int nr=r+d[0],nc=c+d[1];
            if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]==0){
                int ng=g[r][c]+1;
                if(ng<g[nr][nc]){g[nr][nc]=ng;pq.offer(new int[]{ng+Math.abs(nr-end[0])+Math.abs(nc-end[1]),nr,nc});}
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 7,
    edges: [[0,1],[1,2],[2,3],[0,4],[4,5],[5,3],[3,6]],
    source: 0,
    target: 6,
    heuristic: [6, 5, 4, 3, 5, 4, 0],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total nodes in graph',
    },
    {
      name: 'source',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'A* start node',
    },
    {
      name: 'target',
      label: 'Target Node',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'A* destination node',
    },
    {
      name: 'heuristic',
      label: 'Heuristic Values (h)',
      type: 'array',
      defaultValue: [6, 5, 4, 3, 5, 4, 0],
      placeholder: '6,5,4,3,5,4,0',
      helperText: 'Estimated cost to target for each node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const source = input.source as number;
    const target = input.target as number;
    const heuristic = input.heuristic as number[];
    const steps: AlgorithmStep[] = [];

    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      graph[u].push(v);
      graph[v].push(u);
    }

    const INF = 100000;
    const g = new Array(n).fill(INF);
    g[source] = 0;
    const f = new Array(n).fill(INF);
    f[source] = heuristic[source];
    const heap: Array<[number, number]> = [[f[source], source]];
    const closed = new Set<number>();

    steps.push({
      line: 2,
      explanation: `A* init: g[${source}]=0, f[${source}]=h[${source}]=${heuristic[source]}. Heuristic values: [${heuristic.join(', ')}].`,
      variables: { source, target, fScore: f[source], heuristic: heuristic[source] },
      visualization: {
        type: 'array',
        array: f.map(v => (v === INF ? 999 : v)),
        highlights: { [source]: 'active', [target]: 'pointer' },
        labels: { [source]: `f=${f[source]}`, [target]: 'goal' },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 25) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [fScore, cur] = heap.shift()!;

      if (closed.has(cur)) continue;
      closed.add(cur);

      steps.push({
        line: 6,
        explanation: `Process node ${cur}: g=${g[cur]}, h=${heuristic[cur]}, f=${fScore}. Move to closed set.`,
        variables: { node: cur, gScore: g[cur], hScore: heuristic[cur], fScore },
        visualization: {
          type: 'array',
          array: g.map(v => (v === INF ? 999 : v)),
          highlights: { [cur]: 'active', [target]: 'pointer', ...Object.fromEntries([...closed].map(v => [v, 'visited'])) },
          labels: { [cur]: `g=${g[cur]}` },
        },
      });

      if (cur === target) {
        steps.push({
          line: 7,
          explanation: `Reached target node ${target}. Shortest path cost = ${g[target]}.`,
          variables: { result: g[target] },
          visualization: {
            type: 'array',
            array: g.map(v => (v === INF ? 999 : v)),
            highlights: { [source]: 'found', [target]: 'found' },
            labels: { [source]: 'src', [target]: `g=${g[target]}` },
          },
        });
        break;
      }

      for (const nb of graph[cur]) {
        if (closed.has(nb)) continue;
        const tentativeG = g[cur] + 1;
        if (tentativeG < g[nb]) {
          g[nb] = tentativeG;
          f[nb] = tentativeG + heuristic[nb];
          heap.push([f[nb], nb]);
          steps.push({
            line: 12,
            explanation: `Update node ${nb}: g=${tentativeG}, h=${heuristic[nb]}, f=${f[nb]}. f = g+h guides toward target.`,
            variables: { neighbor: nb, g: tentativeG, h: heuristic[nb], f: f[nb] },
            visualization: {
              type: 'array',
              array: f.map(v => (v === INF ? 999 : v)),
              highlights: { [cur]: 'active', [nb]: 'comparing' },
              labels: { [nb]: `f=${f[nb]}` },
            },
          });
        }
      }
    }

    return steps;
  },
};

export default aStarPathfinding;
