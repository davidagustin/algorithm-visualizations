import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const networkDelayTimeDijkstra: AlgorithmDefinition = {
  id: 'network-delay-time-dijkstra',
  title: 'Network Delay Time (Dijkstra Approach)',
  leetcodeNumber: 743,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the time for a signal sent from source k to reach all nodes. Uses Dijkstra algorithm to compute shortest paths from k. The answer is the maximum shortest path among all nodes. If any node is unreachable, return -1.',
  tags: ['graph', 'dijkstra', 'shortest path', 'network', 'signal propagation'],

  code: {
    pseudocode: `function networkDelayTime(times, n, k):
  graph = adjacency list from times
  dist = array of INF, dist[k] = 0
  heap = [(0, k)]
  while heap not empty:
    d, u = pop min
    if d > dist[u]: continue
    for v, w in graph[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        push (dist[v], v) to heap
  maxDist = max(dist[1..n])
  return maxDist if maxDist < INF else -1`,

    python: `import heapq
def networkDelayTime(times, n, k):
    INF = float('inf')
    graph = [[] for _ in range(n+1)]
    for u,v,w in times: graph[u].append((v,w))
    dist = [INF]*(n+1); dist[k]=0
    heap=[(0,k)]
    while heap:
        d,u=heapq.heappop(heap)
        if d>dist[u]: continue
        for v,w in graph[u]:
            if dist[u]+w<dist[v]: dist[v]=dist[u]+w; heapq.heappush(heap,(dist[v],v))
    mx=max(dist[1:])
    return mx if mx<INF else -1`,

    javascript: `function networkDelayTime(times, n, k) {
  const INF=Infinity;
  const graph=Array.from({length:n+1},()=>[]);
  for(const[u,v,w] of times) graph[u].push([v,w]);
  const dist=new Array(n+1).fill(INF); dist[k]=0;
  const heap=[[0,k]];
  while(heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const[d,u]=heap.shift();
    if(d>dist[u]) continue;
    for(const[v,w] of graph[u])
      if(dist[u]+w<dist[v]) { dist[v]=dist[u]+w; heap.push([dist[v],v]); }
  }
  const mx=Math.max(...dist.slice(1));
  return mx===INF?-1:mx;
}`,

    java: `public int networkDelayTime(int[][] times, int n, int k) {
    List<int[]>[] graph=new List[n+1];
    for(int i=0;i<=n;i++) graph[i]=new ArrayList<>();
    for(int[]t:times) graph[t[0]].add(new int[]{t[1],t[2]});
    int[] dist=new int[n+1]; Arrays.fill(dist,Integer.MAX_VALUE); dist[k]=0;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,k});
    while(!pq.isEmpty()){
        int[]cur=pq.poll(); if(cur[0]>dist[cur[1]]) continue;
        for(int[]nb:graph[cur[1]]) if(dist[cur[1]]+nb[1]<dist[nb[0]]){dist[nb[0]]=dist[cur[1]]+nb[1];pq.offer(new int[]{dist[nb[0]],nb[0]});}
    }
    int mx=Arrays.stream(dist,1,n+1).max().getAsInt();
    return mx==Integer.MAX_VALUE?-1:mx;
}`,
  },

  defaultInput: {
    n: 4,
    times: [[2,1,1],[2,3,1],[3,4,1]],
    k: 2,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Nodes numbered 1 to n',
    },
    {
      name: 'k',
      label: 'Source Node',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Signal origin (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const times = input.times as number[][];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    const graph: Array<Array<[number, number]>> = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of times) {
      graph[u].push([v, w]);
    }

    const dist = new Array(n + 1).fill(INF);
    dist[k] = 0;
    const heap: Array<[number, number]> = [[0, k]];

    steps.push({
      line: 2,
      explanation: `Network delay: signal from node ${k}. Find time to reach ALL ${n} nodes. dist[${k}]=0.`,
      variables: { source: k, n },
      visualization: {
        type: 'array',
        array: dist.slice(1).map(d => (d === INF ? 999 : d)),
        highlights: { [k - 1]: 'active' },
        labels: { [k - 1]: `k=${k}` },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 20) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [d, u] = heap.shift()!;

      if (d > dist[u]) continue;

      steps.push({
        line: 6,
        explanation: `Process node ${u}: delay = ${d}. Signal reaches node ${u} after ${d} time units.`,
        variables: { node: u, delay: d },
        visualization: {
          type: 'array',
          array: dist.slice(1).map(dv => (dv === INF ? 999 : dv)),
          highlights: { [u - 1]: 'active' },
          labels: { [u - 1]: `d=${d}` },
        },
      });

      for (const [v, w] of graph[u]) {
        const newDelay = dist[u] + w;
        if (newDelay < dist[v]) {
          dist[v] = newDelay;
          heap.push([newDelay, v]);
          steps.push({
            line: 9,
            explanation: `Signal from ${u} reaches ${v} at time ${newDelay} (${dist[u]}+${w}). Update dist[${v}]=${newDelay}.`,
            variables: { from: u, to: v, travelTime: w, totalDelay: newDelay },
            visualization: {
              type: 'array',
              array: dist.slice(1).map(dv => (dv === INF ? 999 : dv)),
              highlights: { [u - 1]: 'active', [v - 1]: 'comparing' },
              labels: { [v - 1]: `d=${newDelay}` },
            },
          });
        }
      }
    }

    const validDist = dist.slice(1);
    const maxDelay = Math.max(...validDist.map(d => (d === INF ? -1 : d)));
    const hasUnreachable = validDist.some(d => d === INF);

    steps.push({
      line: 11,
      explanation: `Dijkstra complete. Delays: [${validDist.map(d => (d === INF ? 'INF' : d)).join(', ')}]. Answer = max delay = ${hasUnreachable ? -1 : maxDelay} (${hasUnreachable ? 'some unreachable' : 'all reachable'}).`,
      variables: { maxDelay: hasUnreachable ? -1 : maxDelay, allReachable: !hasUnreachable },
      visualization: {
        type: 'array',
        array: validDist.map(d => (d === INF ? 999 : d)),
        highlights: Object.fromEntries(validDist.map((d, i) => [i, d < INF ? (d === maxDelay ? 'found' : 'sorted') : 'mismatch'])),
        labels: Object.fromEntries(validDist.map((d, i) => [i, `n${i + 1}=${d < INF ? d : 'INF'}`])),
      },
    });

    return steps;
  },
};

export default networkDelayTimeDijkstra;
