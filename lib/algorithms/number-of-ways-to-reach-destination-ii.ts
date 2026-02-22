import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfWaysToReachDestinationIi: AlgorithmDefinition = {
  id: 'number-of-ways-to-reach-destination-ii',
  title: 'Number of Ways to Arrive at Destination',
  leetcodeNumber: 1976,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a graph of roads with travel times, find the number of ways to reach the destination from node 0 with the minimum travel time. Combine Dijkstra\'s algorithm with counting: track both the minimum distance and the number of paths achieving that minimum distance to each node.',
  tags: ['Graph', 'Topological Sort', 'Dijkstra', 'Dynamic Programming'],
  code: {
    pseudocode: `function countPaths(n, roads):
  MOD = 1e9+7
  adj = build adjacency list
  dist = [INF]*n; dist[0] = 0
  ways = [0]*n; ways[0] = 1
  pq = [(0, 0)]  // (time, node)
  while pq:
    d, u = extractMin(pq)
    if d > dist[u]: continue
    for v, w in adj[u]:
      if dist[u]+w < dist[v]:
        dist[v] = dist[u]+w
        ways[v] = ways[u]
        pq.push((dist[v], v))
      elif dist[u]+w == dist[v]:
        ways[v] = (ways[v]+ways[u]) % MOD
  return ways[n-1]`,
    python: `def countPaths(n, roads):
    MOD = 10**9+7
    adj = [[] for _ in range(n)]
    for u,v,t in roads: adj[u].append((v,t)); adj[v].append((u,t))
    dist = [float('inf')]*n; dist[0]=0
    ways = [0]*n; ways[0]=1
    pq = [(0,0)]
    while pq:
        d,u = heapq.heappop(pq)
        if d>dist[u]: continue
        for v,w in adj[u]:
            if dist[u]+w < dist[v]:
                dist[v]=dist[u]+w; ways[v]=ways[u]
                heapq.heappush(pq,(dist[v],v))
            elif dist[u]+w==dist[v]:
                ways[v]=(ways[v]+ways[u])%MOD
    return ways[n-1]`,
    javascript: `function countPaths(n, roads) {
  const MOD=BigInt(1e9+7);
  const adj=Array.from({length:n},()=>[]);
  for(const[u,v,t]of roads){adj[u].push([v,t]);adj[v].push([u,t]);}
  const dist=new Array(n).fill(Infinity); dist[0]=0;
  const ways=new Array(n).fill(0n); ways[0]=1n;
  const pq=[[0,0]];
  while(pq.length){
    pq.sort((a,b)=>a[0]-b[0]);
    const[d,u]=pq.shift();
    if(d>dist[u])continue;
    for(const[v,w]of adj[u]){
      if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;ways[v]=ways[u];pq.push([dist[v],v]);}
      else if(dist[u]+w===dist[v])ways[v]=(ways[v]+ways[u])%MOD;
    }
  }
  return Number(ways[n-1]);
}`,
    java: `public int countPaths(int n, int[][] roads) {
    long MOD=1000000007;
    List<long[]>[]adj=new List[n];
    for(int i=0;i<n;i++)adj[i]=new ArrayList<>();
    for(int[]r:roads){adj[r[0]].add(new long[]{r[1],r[2]});adj[r[1]].add(new long[]{r[0],r[2]});}
    long[]dist=new long[n];Arrays.fill(dist,Long.MAX_VALUE);dist[0]=0;
    long[]ways=new long[n];ways[0]=1;
    PriorityQueue<long[]>pq=new PriorityQueue<>((a,b)->Long.compare(a[0],b[0]));
    pq.add(new long[]{0,0});
    while(!pq.isEmpty()){
        long[]top=pq.poll();long d=top[0];int u=(int)top[1];
        if(d>dist[u])continue;
        for(long[]e:adj[u]){int v=(int)e[0];long w=e[1];
            if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;ways[v]=ways[u];pq.add(new long[]{dist[v],v});}
            else if(dist[u]+w==dist[v])ways[v]=(ways[v]+ways[u])%MOD;
        }
    }
    return(int)ways[n-1];
}`,
  },
  defaultInput: {
    n: 7,
    roads: [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Intersections',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Nodes labeled 0 to n-1',
    },
    {
      name: 'roads',
      label: 'Roads [u, v, time]',
      type: 'array',
      defaultValue: [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]],
      placeholder: '[[0,6,7],[0,1,2],...]',
      helperText: 'Bidirectional roads with travel time',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const roads = input.roads as number[][];
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;

    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v, t] of roads) { adj[u].push([v, t]); adj[v].push([u, t]); }

    const dist = new Array(n).fill(Infinity);
    dist[0] = 0;
    const ways = new Array(n).fill(0);
    ways[0] = 1;

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      pq: [number, number][]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: ways,
        highlights,
        labels,
        auxData: {
          label: 'Count Shortest Paths (Dijkstra)',
          entries: [
            { key: 'PQ', value: pq.length > 0 ? pq.map(([d, u]) => `(${d},${u})`).join(' ') : 'empty' },
            { key: 'Dist', value: dist.map((d, i) => `${i}:${d === Infinity ? 'INF' : d}`).join(' ') },
            { key: 'Ways to n-1', value: String(ways[n - 1]) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes. Initialize dist[0]=0, ways[0]=1. Find min-time paths from 0 to ${n - 1}.`,
      variables: { n, dist: [...dist], ways: [...ways] },
      visualization: makeViz(
        { 0: 'active' },
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:w${ways[i]}`])),
        [[0, 0]]
      ),
    });

    const pq: [number, number][] = [[0, 0]];

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;

      if (d > dist[u]) continue;

      steps.push({
        line: 8,
        explanation: `Extract node ${u} (dist=${d}). Ways to reach ${u}: ${ways[u]}. Check neighbors.`,
        variables: { u, d, ways: ways[u] },
        visualization: makeViz(
          { [u]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:w${ways[i]}`])),
          [...pq]
        ),
      });

      for (const [v, w] of adj[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          ways[v] = ways[u];
          pq.push([dist[v], v]);

          steps.push({
            line: 12,
            explanation: `New shorter path to ${v}: dist=${dist[v]}. Reset ways[${v}]=${ways[v]}.`,
            variables: { u, v, w, newDist: dist[v], newWays: ways[v] },
            visualization: makeViz(
              { [u]: 'found', [v]: 'active' },
              Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:w${ways[i]}`])),
              [...pq]
            ),
          });
        } else if (dist[u] + w === dist[v]) {
          ways[v] = (ways[v] + ways[u]) % MOD;

          steps.push({
            line: 15,
            explanation: `Equal-length path to ${v}: add ways[${u}]=${ways[u]} to ways[${v}]. Now ways[${v}]=${ways[v]}.`,
            variables: { u, v, ways: ways[v] },
            visualization: makeViz(
              { [u]: 'found', [v]: 'comparing' },
              Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:w${ways[i]}`])),
              [...pq]
            ),
          });
        }
      }
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = i === n - 1 ? 'found' : 'sorted';

    steps.push({
      line: 18,
      explanation: `Answer: ${ways[n - 1]} ways to reach node ${n - 1} with minimum time ${dist[n - 1]}.`,
      variables: { result: ways[n - 1], minTime: dist[n - 1] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:w${ways[i]}`])),
        []
      ),
    });

    return steps;
  },
};

export default numberOfWaysToReachDestinationIi;
