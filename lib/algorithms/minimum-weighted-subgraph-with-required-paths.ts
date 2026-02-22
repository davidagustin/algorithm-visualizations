import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumWeightedSubgraphWithRequiredPaths: AlgorithmDefinition = {
  id: 'minimum-weighted-subgraph-with-required-paths',
  title: 'Minimum Weighted Subgraph With the Required Paths',
  leetcodeNumber: 2203,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a directed weighted graph, find the minimum weight subgraph containing paths from src1 to dest and from src2 to dest. Run Dijkstra from src1, src2 (forward), and dest (reversed graph). The answer is the minimum over all nodes v of dist1[v] + dist2[v] + distDest[v].',
  tags: ['graph', 'dijkstra', 'shortest path', 'directed graph', 'hard'],

  code: {
    pseudocode: `function minimumWeight(n, edges, src1, src2, dest):
  build forward graph and reverse graph
  dist1 = dijkstra(forward, src1)
  dist2 = dijkstra(forward, src2)
  distDest = dijkstra(reverse, dest)
  ans = INF
  for each node v in 0..n-1:
    if dist1[v] + dist2[v] + distDest[v] < ans:
      ans = dist1[v] + dist2[v] + distDest[v]
  return ans if ans < INF else -1`,

    python: `import heapq
def minimumWeight(n, edges, src1, src2, dest):
    INF = float('inf')
    fwd = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]
    for u,v,w in edges:
        fwd[u].append((v,w)); rev[v].append((u,w))
    def dijk(graph, src):
        dist=[INF]*n; dist[src]=0
        pq=[(0,src)]
        while pq:
            d,u=heapq.heappop(pq)
            if d>dist[u]: continue
            for v,w in graph[u]:
                if dist[u]+w<dist[v]:
                    dist[v]=dist[u]+w; heapq.heappush(pq,(dist[v],v))
        return dist
    d1=dijk(fwd,src1); d2=dijk(fwd,src2); d3=dijk(rev,dest)
    ans=min(d1[v]+d2[v]+d3[v] for v in range(n))
    return ans if ans<INF else -1`,

    javascript: `function minimumWeight(n, edges, src1, src2, dest) {
  const INF = Infinity;
  const fwd = Array.from({length:n},()=>[]);
  const rev = Array.from({length:n},()=>[]);
  for (const [u,v,w] of edges) { fwd[u].push([v,w]); rev[v].push([u,w]); }
  function dijk(graph, src) {
    const dist = new Array(n).fill(INF); dist[src]=0;
    const heap=[[0,src]];
    while(heap.length) {
      heap.sort((a,b)=>a[0]-b[0]);
      const [d,u]=heap.shift();
      if(d>dist[u]) continue;
      for(const [v,w] of graph[u])
        if(dist[u]+w<dist[v]) { dist[v]=dist[u]+w; heap.push([dist[v],v]); }
    }
    return dist;
  }
  const d1=dijk(fwd,src1),d2=dijk(fwd,src2),d3=dijk(rev,dest);
  const ans=Math.min(...Array.from({length:n},(_,v)=>d1[v]+d2[v]+d3[v]));
  return ans===INF?-1:ans;
}`,

    java: `public long minimumWeight(int n, int[][] edges, int src1, int src2, int dest) {
    List<long[]>[] fwd=new List[n], rev=new List[n];
    for(int i=0;i<n;i++){fwd[i]=new ArrayList<>();rev[i]=new ArrayList<>();}
    for(int[] e:edges){fwd[e[0]].add(new long[]{e[1],e[2]});rev[e[1]].add(new long[]{e[0],e[2]});}
    long[] d1=dijk(fwd,src1,n),d2=dijk(fwd,src2,n),d3=dijk(rev,dest,n);
    long ans=Long.MAX_VALUE;
    for(int v=0;v<n;v++) if(d1[v]<Long.MAX_VALUE&&d2[v]<Long.MAX_VALUE&&d3[v]<Long.MAX_VALUE)
        ans=Math.min(ans,d1[v]+d2[v]+d3[v]);
    return ans==Long.MAX_VALUE?-1:ans;
}`,
  },

  defaultInput: {
    n: 6,
    edges: [[0,2,2],[0,3,1],[1,2,1],[1,3,2],[3,4,3],[2,4,1],[4,5,2]],
    src1: 0,
    src2: 1,
    dest: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Total nodes in graph',
    },
    {
      name: 'src1',
      label: 'Source 1',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'First required path source',
    },
    {
      name: 'src2',
      label: 'Source 2',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Second required path source',
    },
    {
      name: 'dest',
      label: 'Destination',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Common destination node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const src1 = input.src1 as number;
    const src2 = input.src2 as number;
    const dest = input.dest as number;
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    const fwd: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    const rev: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      fwd[u].push([v, w]);
      rev[v].push([u, w]);
    }

    function dijkstra(graph: Array<Array<[number, number]>>, src: number): number[] {
      const dist = new Array(n).fill(INF);
      dist[src] = 0;
      const heap: Array<[number, number]> = [[0, src]];
      let iters = 0;
      while (heap.length > 0 && iters < 100) {
        iters++;
        heap.sort((a, b) => a[0] - b[0]);
        const [d, u] = heap.shift()!;
        if (d > dist[u]) continue;
        for (const [v, w] of graph[u]) {
          if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            heap.push([dist[v], v]);
          }
        }
      }
      return dist;
    }

    steps.push({
      line: 2,
      explanation: `Build forward graph and reverse graph. Run 3 Dijkstras: from src1=${src1}, src2=${src2}, and from dest=${dest} on reversed graph.`,
      variables: { src1, src2, dest, n },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { [src1]: 'active', [src2]: 'comparing', [dest]: 'found' },
        labels: { [src1]: 'src1', [src2]: 'src2', [dest]: 'dest' },
      },
    });

    const d1 = dijkstra(fwd, src1);
    steps.push({
      line: 3,
      explanation: `Dijkstra from src1=${src1} complete. Distances: [${d1.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { phase: 'dist1', src1 },
      visualization: {
        type: 'array',
        array: d1.map(d => (d === INF ? 999 : d)),
        highlights: { [src1]: 'active' },
        labels: { [src1]: 'src1' },
      },
    });

    const d2 = dijkstra(fwd, src2);
    steps.push({
      line: 4,
      explanation: `Dijkstra from src2=${src2} complete. Distances: [${d2.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { phase: 'dist2', src2 },
      visualization: {
        type: 'array',
        array: d2.map(d => (d === INF ? 999 : d)),
        highlights: { [src2]: 'comparing' },
        labels: { [src2]: 'src2' },
      },
    });

    const d3 = dijkstra(rev, dest);
    steps.push({
      line: 5,
      explanation: `Dijkstra from dest=${dest} on reversed graph complete. Distances: [${d3.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { phase: 'distDest', dest },
      visualization: {
        type: 'array',
        array: d3.map(d => (d === INF ? 999 : d)),
        highlights: { [dest]: 'found' },
        labels: { [dest]: 'dest' },
      },
    });

    // Combine
    const combined = d1.map((v, i) => v + d2[i] + d3[i]);
    let ans = INF;
    let bestNode = -1;
    for (let i = 0; i < n; i++) {
      if (combined[i] < ans) {
        ans = combined[i];
        bestNode = i;
      }
    }

    steps.push({
      line: 7,
      explanation: `Combined sums (d1+d2+d3) per node: [${combined.map(d => (d >= INF ? 'INF' : d)).join(', ')}]. Minimum at node ${bestNode} = ${ans >= INF ? -1 : ans}.`,
      variables: { bestNode, answer: ans >= INF ? -1 : ans },
      visualization: {
        type: 'array',
        array: combined.map(d => (d >= INF ? 999 : d)),
        highlights: { [bestNode]: 'found' },
        labels: { [bestNode]: 'best' },
      },
    });

    return steps;
  },
};

export default minimumWeightedSubgraphWithRequiredPaths;
