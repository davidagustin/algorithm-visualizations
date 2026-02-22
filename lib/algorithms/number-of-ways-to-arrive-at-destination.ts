import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const numberOfWaysToArriveAtDestination: AlgorithmDefinition = {
  id: 'number-of-ways-to-arrive-at-destination',
  title: 'Number of Ways to Arrive at Destination',
  leetcodeNumber: 1976,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of shortest paths from node 0 to node n-1 in a weighted undirected graph. Run Dijkstra to find shortest distances, then count paths using DP: ways[v] = sum of ways[u] for all edges u->v on a shortest path. Answer is modulo 10^9+7.',
  tags: ['dynamic programming', 'dijkstra', 'graph', 'shortest path'],

  code: {
    pseudocode: `function countPaths(n, roads):
  build adjacency list
  dist = [INF]*n, dist[0]=0, ways=[0]*n, ways[0]=1
  pq = min-heap [(0, 0)]
  while pq not empty:
    d, u = pq.pop()
    if d > dist[u]: continue
    for each neighbor v with weight w:
      if dist[u]+w < dist[v]:
        dist[v] = dist[u]+w
        ways[v] = ways[u]
        pq.push((dist[v], v))
      elif dist[u]+w == dist[v]:
        ways[v] = (ways[v] + ways[u]) % MOD
  return ways[n-1]`,

    python: `def countPaths(n, roads):
    import heapq
    MOD = 10**9+7
    g = [[] for _ in range(n)]
    for u,v,w in roads:
        g[u].append((v,w)); g[v].append((u,w))
    dist = [float('inf')]*n; dist[0]=0
    ways = [0]*n; ways[0]=1
    pq = [(0,0)]
    while pq:
        d,u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v,w in g[u]:
            if dist[u]+w < dist[v]:
                dist[v]=dist[u]+w; ways[v]=ways[u]
                heapq.heappush(pq,(dist[v],v))
            elif dist[u]+w==dist[v]:
                ways[v]=(ways[v]+ways[u])%MOD
    return ways[n-1]`,

    javascript: `function countPaths(n, roads) {
  const MOD = 1e9+7;
  const g = Array.from({length:n}, ()=>[]);
  for (const [u,v,w] of roads) { g[u].push([v,w]); g[v].push([u,w]); }
  const dist = new Array(n).fill(Infinity); dist[0]=0;
  const ways = new Array(n).fill(0); ways[0]=1;
  const pq = [[0,0]]; // [dist, node]
  while (pq.length) {
    pq.sort((a,b)=>a[0]-b[0]);
    const [d,u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v,w] of g[u]) {
      if (dist[u]+w < dist[v]) {
        dist[v]=dist[u]+w; ways[v]=ways[u]; pq.push([dist[v],v]);
      } else if (dist[u]+w===dist[v]) ways[v]=(ways[v]+ways[u])%MOD;
    }
  }
  return ways[n-1];
}`,

    java: `public int countPaths(int n, int[][] roads) {
    long MOD = 1_000_000_007L;
    List<long[]>[] g = new List[n];
    for (int i=0;i<n;i++) g[i]=new ArrayList<>();
    for (int[] r:roads){g[r[0]].add(new long[]{r[1],r[2]});g[r[1]].add(new long[]{r[0],r[2]});}
    long[] dist=new long[n], ways=new long[n];
    Arrays.fill(dist,Long.MAX_VALUE/2); dist[0]=0; ways[0]=1;
    PriorityQueue<long[]> pq=new PriorityQueue<>((a,b)->Long.compare(a[0],b[0]));
    pq.offer(new long[]{0,0});
    while(!pq.isEmpty()){
        long[]curr=pq.poll(); long d=curr[0]; int u=(int)curr[1];
        if(d>dist[u])continue;
        for(long[]e:g[u]){int v=(int)e[0];long w=e[1];
            if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;ways[v]=ways[u];pq.offer(new long[]{dist[v],v});}
            else if(dist[u]+w==dist[v])ways[v]=(ways[v]+ways[u])%MOD;
        }
    }
    return (int)ways[n-1];
}`,
  },

  defaultInput: {
    n: 7,
    roads: [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes (n)',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Number of intersections (nodes)',
    },
    {
      name: 'roads',
      label: 'Roads [u, v, time]',
      type: 'array',
      defaultValue: [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]],
      placeholder: '[[0,6,7],[0,1,2]]',
      helperText: 'Each road as [u, v, travel_time]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const roads = input.roads as number[][];
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;

    const g: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of roads) {
      g[u].push([v, w]);
      g[v].push([u, w]);
    }

    const dist = new Array(n).fill(Infinity);
    dist[0] = 0;
    const ways = new Array(n).fill(0);
    ways[0] = 1;

    steps.push({
      line: 1,
      explanation: `Graph with ${n} nodes and ${roads.length} roads. Run Dijkstra from node 0. dist[0]=0, ways[0]=1 (one way to be at start).`,
      variables: { n, edgeCount: roads.length },
      visualization: {
        type: 'array',
        array: dist.map(v => v === Infinity ? -1 : v),
        highlights: { 0: 'found' },
        labels: Object.fromEntries(dist.map((_, i) => [i, `n${i}`])),
      },
    });

    const pq: [number, number][] = [[0, 0]];
    const processed = new Set<number>();

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;
      if (d > dist[u] || processed.has(u)) continue;
      processed.add(u);

      steps.push({
        line: 5,
        explanation: `Process node ${u} at distance ${d}. ways[${u}]=${ways[u]}. Exploring neighbors...`,
        variables: { node: u, distance: d, waysToReach: ways[u] },
        visualization: {
          type: 'array',
          array: dist.map(v => v === Infinity ? -1 : v),
          highlights: { [u]: 'active', ...(Object.fromEntries([...processed].map(p => [p, 'visited']))) },
          labels: Object.fromEntries(ways.map((w, i) => [i, `w${w}`])),
        },
      });

      for (const [v, w] of g[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          ways[v] = ways[u];
          pq.push([dist[v], v]);
          steps.push({
            line: 8,
            explanation: `Found shorter path to node ${v}: dist=${dist[v]}, ways=${ways[v]}.`,
            variables: { neighbor: v, newDist: dist[v], newWays: ways[v] },
            visualization: {
              type: 'array',
              array: dist.map(x => x === Infinity ? -1 : x),
              highlights: { [v]: 'found', [u]: 'active' },
              labels: Object.fromEntries(ways.map((x, i) => [i, `w${x}`])),
            },
          });
        } else if (dist[u] + w === dist[v]) {
          ways[v] = (ways[v] + ways[u]) % MOD;
          steps.push({
            line: 11,
            explanation: `Equal-length path to node ${v}: added ${ways[u]} paths. ways[${v}]=${ways[v]}.`,
            variables: { neighbor: v, ways: ways[v] },
            visualization: {
              type: 'array',
              array: dist.map(x => x === Infinity ? -1 : x),
              highlights: { [v]: 'comparing', [u]: 'active' },
              labels: Object.fromEntries(ways.map((x, i) => [i, `w${x}`])),
            },
          });
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Total shortest paths from node 0 to node ${n - 1}: ${ways[n - 1]} (mod 10^9+7).`,
      variables: { answer: ways[n - 1], shortestDist: dist[n - 1] },
      visualization: {
        type: 'array',
        array: dist.map(v => v === Infinity ? -1 : v),
        highlights: { [n - 1]: 'found' },
        labels: Object.fromEntries(ways.map((w, i) => [i, `w${w}`])),
      },
    });

    return steps;
  },
};

export default numberOfWaysToArriveAtDestination;
