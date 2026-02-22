import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const multiSourceBfs: AlgorithmDefinition = {
  id: 'multi-source-bfs',
  title: 'Multi-Source BFS',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Multi-source BFS starts simultaneously from multiple source nodes. All sources are enqueued at level 0, then BFS expands outward. This efficiently computes the minimum distance from any source to every node. Used in problems like walls and gates, rotting oranges, and distance to nearest land.',
  tags: ['graph', 'BFS', 'multi-source', 'shortest distance', 'grid'],

  code: {
    pseudocode: `function multiSourceBFS(grid, sources):
  queue = all source cells at distance 0
  dist = distance array, INF for non-sources
  while queue not empty:
    cell = dequeue
    for each neighbor of cell:
      if dist[neighbor] == INF:
        dist[neighbor] = dist[cell] + 1
        enqueue neighbor
  return dist`,

    python: `from collections import deque
def multiSourceBFS(grid, sources):
    rows, cols = len(grid), len(grid[0])
    dist = [[float('inf')]*cols for _ in range(rows)]
    q = deque()
    for r,c in sources:
        dist[r][c] = 0; q.append((r,c))
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while q:
        r,c = q.popleft()
        for dr,dc in dirs:
            nr,nc = r+dr,c+dc
            if 0<=nr<rows and 0<=nc<cols and dist[nr][nc]==float('inf'):
                dist[nr][nc]=dist[r][c]+1; q.append((nr,nc))
    return dist`,

    javascript: `function multiSourceBFS(grid, sources) {
  const rows=grid.length, cols=grid[0].length;
  const dist=Array.from({length:rows},()=>new Array(cols).fill(Infinity));
  const q=[];
  for(const[r,c] of sources){dist[r][c]=0;q.push([r,c]);}
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  let qi=0;
  while(qi<q.length){
    const[r,c]=q[qi++];
    for(const[dr,dc] of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&dist[nr][nc]===Infinity){
        dist[nr][nc]=dist[r][c]+1; q.push([nr,nc]);
      }
    }
  }
  return dist;
}`,

    java: `public int[][] multiSourceBFS(int[][] grid, int[][] sources) {
    int R=grid.length,C=grid[0].length;
    int[][] dist=new int[R][C];
    for(int[] r:dist) Arrays.fill(r,Integer.MAX_VALUE);
    Queue<int[]> q=new LinkedList<>();
    for(int[] s:sources){dist[s[0]][s[1]]=0;q.offer(s);}
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){
        int[]cur=q.poll();
        for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];
            if(nr>=0&&nr<R&&nc>=0&&nc<C&&dist[nr][nc]==Integer.MAX_VALUE){
                dist[nr][nc]=dist[cur[0]][cur[1]]+1; q.offer(new int[]{nr,nc});}}
    }
    return dist;
}`,
  },

  defaultInput: {
    n: 8,
    edges: [[0,1],[1,2],[0,3],[3,4],[4,5],[2,6],[5,6],[6,7]],
    sources: [0, 5],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Total nodes in graph',
    },
    {
      name: 'sources',
      label: 'Source Nodes',
      type: 'array',
      defaultValue: [0, 5],
      placeholder: '0,5',
      helperText: 'Multiple BFS starting nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const sources = input.sources as number[];
    const steps: AlgorithmStep[] = [];

    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      graph[u].push(v);
      graph[v].push(u);
    }

    const dist = new Array(n).fill(-1);
    const queue: number[] = [];

    for (const s of sources) {
      dist[s] = 0;
      queue.push(s);
    }

    steps.push({
      line: 2,
      explanation: `Initialize multi-source BFS. Sources: [${sources.join(', ')}] all start at distance 0.`,
      variables: { sources: sources.join(', '), queueSize: queue.length },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: Object.fromEntries(sources.map(s => [s, 'active'])),
        labels: Object.fromEntries(sources.map(s => [s, 'src'])),
      },
    });

    let qi = 0;
    let level = 0;
    const levelBoundary = queue.length;

    while (qi < queue.length) {
      const node = queue[qi++];
      const curDist = dist[node];

      if (curDist > level) {
        level = curDist;
        steps.push({
          line: 4,
          explanation: `Advancing to BFS level ${level}. Processing nodes at distance ${level} from nearest source.`,
          variables: { level, queueRemaining: queue.length - qi + 1 },
          visualization: {
            type: 'array',
            array: dist.map(d => (d === -1 ? -1 : d)),
            highlights: {},
            labels: Object.fromEntries(sources.map(s => [s, 'src'])),
          },
        });
      }

      steps.push({
        line: 5,
        explanation: `Process node ${node} (distance ${curDist} from nearest source). Explore neighbors.`,
        variables: { node, distance: curDist },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === -1 ? -1 : d)),
          highlights: { [node]: 'active' },
          labels: { [node]: `d=${curDist}` },
        },
      });

      for (const nb of graph[node]) {
        if (dist[nb] === -1) {
          dist[nb] = curDist + 1;
          queue.push(nb);
          steps.push({
            line: 8,
            explanation: `Discover node ${nb} at distance ${dist[nb]} from nearest source.`,
            variables: { neighbor: nb, distance: dist[nb] },
            visualization: {
              type: 'array',
              array: dist.map(d => (d === -1 ? -1 : d)),
              highlights: { [node]: 'active', [nb]: 'comparing' },
              labels: { [nb]: `d=${dist[nb]}` },
            },
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Multi-source BFS complete. Minimum distances from any source: [${dist.map(d => (d === -1 ? 'INF' : d)).join(', ')}].`,
      variables: { distances: dist.map(d => (d === -1 ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? 999 : d)),
        highlights: Object.fromEntries(dist.map((d, i) => [i, d >= 0 ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(dist.map((d, i) => [i, `d=${d >= 0 ? d : 'INF'}`])),
      },
    });

    return steps;
  },
};

export default multiSourceBfs;
