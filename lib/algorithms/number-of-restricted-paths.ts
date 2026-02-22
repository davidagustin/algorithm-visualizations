import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const numberOfRestrictedPaths: AlgorithmDefinition = {
  id: 'number-of-restricted-paths',
  title: 'Number of Restricted Paths From First to Last Node',
  leetcodeNumber: 1786,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Count restricted paths from node 1 to node n. A restricted path has strictly decreasing dist[node] to node n along the path. Run Dijkstra from node n to get distances, then use DP/DFS to count paths where dist[next] < dist[current]. Return count modulo 1e9+7.',
  tags: ['graph', 'dijkstra', 'dynamic programming', 'counting paths', 'shortest path'],

  code: {
    pseudocode: `function countRestrictedPaths(n, edges):
  dist = Dijkstra from node n
  dp[i] = number of restricted paths from i to n
  dp[n] = 1
  process nodes in order of decreasing dist
  for node u (sorted by dist desc):
    for each neighbor v:
      if dist[v] < dist[u]:
        dp[u] = (dp[u] + dp[v]) % MOD
  return dp[1]`,

    python: `import heapq
def countRestrictedPaths(n, edges):
    MOD = 10**9+7
    graph = [[] for _ in range(n+1)]
    for u,v,w in edges:
        graph[u].append((v,w)); graph[v].append((u,w))
    INF = float('inf')
    dist = [INF]*(n+1); dist[n]=0
    heap=[(0,n)]
    while heap:
        d,u=heapq.heappop(heap)
        if d>dist[u]: continue
        for v,w in graph[u]:
            if dist[u]+w<dist[v]: dist[v]=dist[u]+w; heapq.heappush(heap,(dist[v],v))
    dp=[0]*(n+1); dp[n]=1
    order=sorted(range(1,n+1),key=lambda x:-dist[x])
    for u in order:
        for v,w in graph[u]:
            if dist[v]<dist[u]: dp[u]=(dp[u]+dp[v])%MOD
    return dp[1]`,

    javascript: `function countRestrictedPaths(n, edges) {
  const MOD=1e9+7;
  const graph=Array.from({length:n+1},()=>[]);
  for(const[u,v,w] of edges){graph[u].push([v,w]);graph[v].push([u,w]);}
  const dist=new Array(n+1).fill(Infinity); dist[n]=0;
  const heap=[[0,n]];
  while(heap.length){
    heap.sort((a,b)=>a[0]-b[0]);
    const[d,u]=heap.shift();
    if(d>dist[u]) continue;
    for(const[v,w] of graph[u]) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;heap.push([dist[v],v]);}
  }
  const dp=new Array(n+1).fill(0); dp[n]=1;
  const order=[...Array(n).keys()].map(i=>i+1).sort((a,b)=>dist[b]-dist[a]);
  for(const u of order)
    for(const[v] of graph[u]) if(dist[v]<dist[u]) dp[u]=(dp[u]+dp[v])%MOD;
  return dp[1];
}`,

    java: `public int countRestrictedPaths(int n, int[][] edges) {
    int MOD=1_000_000_007;
    List<int[]>[] graph=new List[n+1];
    for(int i=0;i<=n;i++) graph[i]=new ArrayList<>();
    for(int[]e:edges){graph[e[0]].add(new int[]{e[1],e[2]});graph[e[1]].add(new int[]{e[0],e[2]});}
    long[] dist=new long[n+1]; Arrays.fill(dist,Long.MAX_VALUE); dist[n]=0;
    PriorityQueue<long[]> pq=new PriorityQueue<>((a,b)->Long.compare(a[0],b[0]));
    pq.offer(new long[]{0,n});
    while(!pq.isEmpty()){long[]cur=pq.poll();if(cur[0]>dist[(int)cur[1]])continue;for(int[]nb:graph[(int)cur[1]])if(dist[(int)cur[1]]+nb[1]<dist[nb[0]]){dist[nb[0]]=dist[(int)cur[1]]+nb[1];pq.offer(new long[]{dist[nb[0]],nb[0]});}}
    long[] dp=new long[n+1]; dp[n]=1;
    Integer[] order=new Integer[n]; for(int i=0;i<n;i++) order[i]=i+1;
    Arrays.sort(order,(a,b)->Long.compare(dist[b],dist[a]));
    for(int u:order) for(int[]nb:graph[u]) if(dist[nb[0]]<dist[u]) dp[u]=(dp[u]+dp[nb[0]])%MOD;
    return (int)dp[1];
}`,
  },

  defaultInput: {
    n: 5,
    edges: [[1,2,3],[1,3,3],[2,3,1],[1,4,2],[5,2,2],[3,5,1],[5,4,10]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Nodes numbered 1 to n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;

    const graph: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of edges) {
      graph[u].push([v, w]);
      graph[v].push([u, w]);
    }

    const INF = 100000;
    const dist = new Array(n + 1).fill(INF);
    dist[n] = 0;
    const heap: Array<[number, number]> = [[0, n]];

    steps.push({
      line: 2,
      explanation: `Run Dijkstra from destination node ${n}. dist[${n}]=0.`,
      variables: { destination: n },
      visualization: {
        type: 'array',
        array: dist.slice(1),
        highlights: { [n - 1]: 'active' },
        labels: { [n - 1]: 'dest' },
      },
    });

    let iters = 0;
    while (heap.length > 0 && iters < 30) {
      iters++;
      heap.sort((a, b) => a[0] - b[0]);
      const [d, u] = heap.shift()!;
      if (d > dist[u]) continue;
      for (const [v, w] of graph[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          heap.push([dist[v], v]);
          steps.push({
            line: 5,
            explanation: `Relax edge ${u}->${v}: dist[${v}] updated to ${dist[v]}.`,
            variables: { from: u, to: v, newDist: dist[v] },
            visualization: {
              type: 'array',
              array: dist.slice(1).map(d2 => (d2 === INF ? 999 : d2)),
              highlights: { [v - 1]: 'comparing', [u - 1]: 'active' },
              labels: { [v - 1]: `d=${dist[v]}` },
            },
          });
        }
      }
    }

    steps.push({
      line: 6,
      explanation: `Dijkstra done. dist from node ${n}: [${dist.slice(1).map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { dist: dist.slice(1).map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.slice(1).map(d => (d === INF ? 999 : d)),
        highlights: { [n - 1]: 'found' },
        labels: { [n - 1]: 'dest' },
      },
    });

    // DP
    const dp = new Array(n + 1).fill(0);
    dp[n] = 1;
    const order = Array.from({ length: n }, (_, i) => i + 1).sort((a, b) => dist[b] - dist[a]);

    steps.push({
      line: 8,
      explanation: `DP: count restricted paths. Process nodes in decreasing dist order: [${order.join(', ')}]. dp[${n}]=1.`,
      variables: { order: order.join(', ') },
      visualization: {
        type: 'array',
        array: dp.slice(1),
        highlights: { [n - 1]: 'active' },
        labels: { [n - 1]: 'dp=1' },
      },
    });

    for (const u of order) {
      for (const [v] of graph[u]) {
        if (dist[v] < dist[u]) {
          dp[u] = (dp[u] + dp[v]) % MOD;
        }
      }
      if (dp[u] > 0) {
        steps.push({
          line: 10,
          explanation: `dp[${u}] = ${dp[u]}: sum of dp[v] for neighbors v where dist[v] < dist[${u}]=${dist[u]}.`,
          variables: { node: u, dp: dp[u] },
          visualization: {
            type: 'array',
            array: dp.slice(1),
            highlights: { [u - 1]: 'found' },
            labels: { [u - 1]: `dp=${dp[u]}` },
          },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Answer: dp[1] = ${dp[1]} restricted paths from node 1 to node ${n}.`,
      variables: { result: dp[1] },
      visualization: {
        type: 'array',
        array: dp.slice(1),
        highlights: { 0: 'found' },
        labels: { 0: `ans=${dp[1]}` },
      },
    });

    return steps;
  },
};

export default numberOfRestrictedPaths;
