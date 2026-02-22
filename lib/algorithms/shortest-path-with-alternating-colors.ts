import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPathWithAlternatingColors: AlgorithmDefinition = {
  id: 'shortest-path-with-alternating-colors',
  title: 'Shortest Path with Alternating Colors',
  leetcodeNumber: 1129,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find shortest paths from node 0 to all other nodes in a graph where edges are colored red or blue. Each path must alternate between red and blue edges. Use BFS with state (node, lastColor) to explore both color transitions.',
  tags: ['BFS', 'shortest path', 'state graph', 'coloring', 'graph'],

  code: {
    pseudocode: `function shortestAlternatingPaths(n, redEdges, blueEdges):
  adj = build adjacency list with color
  dist = [-1]*n, dist[0] = 0
  queue = [(0, RED), (0, BLUE)]
  steps = [0]*n
  while queue not empty:
    (u, color) = dequeue
    for each (v, edgeColor) in adj[u]:
      if edgeColor != color and dist[v] == -1:
        dist[v] = steps[u] + 1
        enqueue (v, edgeColor)
  return dist`,

    python: `from collections import deque
def shortestAlternatingPaths(n, redEdges, blueEdges):
    RED, BLUE = 0, 1
    adj = [[] for _ in range(n)]
    for u,v in redEdges: adj[u].append((v, RED))
    for u,v in blueEdges: adj[u].append((v, BLUE))
    dist = [-1] * n
    dist[0] = 0
    q = deque([(0, RED, 0), (0, BLUE, 0)])
    visited = set([(0, RED), (0, BLUE)])
    while q:
        u, color, d = q.popleft()
        for v, ec in adj[u]:
            if ec != color and (v, ec) not in visited:
                visited.add((v, ec))
                if dist[v] == -1: dist[v] = d + 1
                q.append((v, ec, d+1))
    return dist`,

    javascript: `function shortestAlternatingPaths(n, redEdges, blueEdges) {
  const adj = Array.from({length:n},()=>[]);
  for (const [u,v] of redEdges) adj[u].push([v,0]);
  for (const [u,v] of blueEdges) adj[u].push([v,1]);
  const dist = new Array(n).fill(-1);
  dist[0] = 0;
  const queue = [[0,0,0],[0,1,0]]; // [node, lastColor, distance]
  const visited = new Set(['0,0','0,1']);
  while (queue.length) {
    const [u, color, d] = queue.shift();
    for (const [v, ec] of adj[u]) {
      const key = v+','+ec;
      if (ec !== color && !visited.has(key)) {
        visited.add(key);
        if (dist[v] === -1) dist[v] = d + 1;
        queue.push([v, ec, d+1]);
      }
    }
  }
  return dist;
}`,

    java: `public int[] shortestAlternatingPaths(int n, int[][] red, int[][] blue) {
    List<int[]>[] adj = new List[n];
    for (int i=0;i<n;i++) adj[i]=new ArrayList<>();
    for (int[] e:red) adj[e[0]].add(new int[]{e[1],0});
    for (int[] e:blue) adj[e[0]].add(new int[]{e[1],1});
    int[] dist = new int[n];
    Arrays.fill(dist,-1); dist[0]=0;
    Queue<int[]> q = new LinkedList<>();
    q.offer(new int[]{0,0,0}); q.offer(new int[]{0,1,0});
    boolean[][] vis = new boolean[n][2];
    vis[0][0]=vis[0][1]=true;
    while(!q.isEmpty()){
        int[] cur=q.poll(); int u=cur[0],c=cur[1],d=cur[2];
        for(int[] e:adj[u]) if(e[1]!=c&&!vis[e[0]][e[1]]){
            vis[e[0]][e[1]]=true; if(dist[e[0]]==-1)dist[e[0]]=d+1;
            q.offer(new int[]{e[0],e[1],d+1});
        }
    }
    return dist;
}`,
  },

  defaultInput: {
    n: 5,
    redEdges: [0, 1, 1, 2, 2, 3, 3, 4],
    blueEdges: [1, 2, 2, 3, 3, 4],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'redEdges',
      label: 'Red Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 2, 3, 3, 4],
      placeholder: '0,1,1,2,...',
    },
    {
      name: 'blueEdges',
      label: 'Blue Edges (u,v pairs)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 3, 4],
      placeholder: '1,2,2,3,...',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const redFlat = input.redEdges as number[];
    const blueFlat = input.blueEdges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (let i = 0; i + 1 < redFlat.length; i += 2) adj[redFlat[i]].push([redFlat[i + 1], 0]);
    for (let i = 0; i + 1 < blueFlat.length; i += 2) adj[blueFlat[i]].push([blueFlat[i + 1], 1]);

    const dist: number[] = new Array(n).fill(-1);
    dist[0] = 0;

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: dist.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: n }, (_, i) => [
          i,
          i === 0 ? 'pointer' : i === active ? 'active' : dist[i] >= 0 ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `node${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Build alternating-color graph. BFS state = (node, lastEdgeColor). Start from node 0 with both colors.`,
      variables: { n, redEdges: redFlat.length / 2, blueEdges: blueFlat.length / 2 },
      visualization: makeViz(0),
    });

    const queue: [number, number, number][] = [[0, 0, 0], [0, 1, 0]];
    const visited = new Set<string>(['0,0', '0,1']);

    while (queue.length > 0) {
      const [u, color, d] = queue.shift()!;
      const colorName = color === 0 ? 'RED' : 'BLUE';

      steps.push({
        line: 7,
        explanation: `BFS: node=${u}, lastColor=${colorName}, dist=${d}. Exploring neighbors via opposite color.`,
        variables: { node: u, lastColor: colorName, distance: d },
        visualization: makeViz(u),
      });

      for (const [v, ec] of adj[u]) {
        const key = `${v},${ec}`;
        if (ec !== color && !visited.has(key)) {
          visited.add(key);
          if (dist[v] === -1) dist[v] = d + 1;
          queue.push([v, ec, d + 1]);
          steps.push({
            line: 9,
            explanation: `Visit node ${v} via ${ec === 0 ? 'RED' : 'BLUE'} edge (alternates from ${colorName}). dist[${v}] = ${dist[v]}.`,
            variables: { v, edgeColor: ec === 0 ? 'RED' : 'BLUE', 'dist[v]': dist[v] },
            visualization: makeViz(v),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `BFS complete. Distances: [${dist.join(', ')}]. -1 means unreachable.`,
      variables: { distances: dist },
      visualization: {
        type: 'array',
        array: dist.slice(),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, dist[i] === -1 ? 'mismatch' : 'sorted'])),
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `node${i}`])),
      },
    });

    return steps;
  },
};

export default shortestPathWithAlternatingColors;
