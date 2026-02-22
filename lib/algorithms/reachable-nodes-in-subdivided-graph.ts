import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const reachableNodesInSubdividedGraph: AlgorithmDefinition = {
  id: 'reachable-nodes-in-subdivided-graph',
  title: 'Reachable Nodes In Subdivided Graph',
  leetcodeNumber: 882,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Each edge (u, v, cnt) is subdivided by inserting cnt new nodes. Starting at node 0 with M moves, count how many original and inserted nodes are reachable. Uses Dijkstra to find the maximum moves remaining at each original node, then counts reachable inserted nodes per edge.',
  tags: ['graph', 'dijkstra', 'heap', 'subdivided graph', 'modified shortest path'],

  code: {
    pseudocode: `function reachableNodes(edges, maxMoves, n):
  graph = adjacency list with edge costs (cnt+1)
  dist = Dijkstra from node 0 (max moves remaining)
  result = count of reached original nodes
  for each edge (u, v, cnt):
    reachFromU = dist[u] > 0 ? min(dist[u], cnt) : 0
    reachFromV = dist[v] > 0 ? min(dist[v], cnt) : 0
    result += min(cnt, reachFromU + reachFromV)
  return result`,

    python: `import heapq
def reachableNodes(edges, maxMoves, n):
    graph = [[] for _ in range(n)]
    for u,v,cnt in edges:
        graph[u].append((v, cnt+1))
        graph[v].append((u, cnt+1))
    dist = [-1]*n; dist[0]=maxMoves
    heap = [(-maxMoves, 0)]
    while heap:
        d,u = heapq.heappop(heap)
        if -d < dist[u]: continue
        for v,w in graph[u]:
            rem = dist[u]-w
            if rem > dist[v]: dist[v]=rem; heapq.heappush(heap,(-rem,v))
    res = sum(1 for d in dist if d>=0)
    for u,v,cnt in edges:
        fromU = min(dist[u],cnt) if dist[u]>=0 else 0
        fromV = min(dist[v],cnt) if dist[v]>=0 else 0
        res += min(cnt, fromU+fromV)
    return res`,

    javascript: `function reachableNodes(edges, maxMoves, n) {
  const graph = Array.from({length:n},()=>[]);
  for (const [u,v,cnt] of edges) { graph[u].push([v,cnt+1]); graph[v].push([u,cnt+1]); }
  const dist = new Array(n).fill(-1); dist[0]=maxMoves;
  const heap=[[-maxMoves,0]];
  while(heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [neg,u]=heap.shift(); const d=-neg;
    if(d<dist[u]) continue;
    for(const [v,w] of graph[u]) {
      const rem=dist[u]-w;
      if(rem>dist[v]) { dist[v]=rem; heap.push([-rem,v]); }
    }
  }
  let res=dist.filter(d=>d>=0).length;
  for(const [u,v,cnt] of edges) {
    const fU=dist[u]>=0?Math.min(dist[u],cnt):0;
    const fV=dist[v]>=0?Math.min(dist[v],cnt):0;
    res+=Math.min(cnt,fU+fV);
  }
  return res;
}`,

    java: `public int reachableNodes(int[][] edges, int maxMoves, int n) {
    List<int[]>[] graph=new List[n];
    for(int i=0;i<n;i++) graph[i]=new ArrayList<>();
    for(int[] e:edges){graph[e[0]].add(new int[]{e[1],e[2]+1});graph[e[1]].add(new int[]{e[0],e[2]+1});}
    int[] dist=new int[n]; Arrays.fill(dist,-1); dist[0]=maxMoves;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->b[0]-a[0]);
    pq.offer(new int[]{maxMoves,0});
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int d=cur[0],u=cur[1];
        if(d<dist[u]) continue;
        for(int[] nb:graph[u]){int rem=dist[u]-nb[1];if(rem>dist[nb[0]]){dist[nb[0]]=rem;pq.offer(new int[]{rem,nb[0]});}}
    }
    int res=0;
    for(int d:dist) if(d>=0) res++;
    for(int[] e:edges){int fU=dist[e[0]]>=0?Math.min(dist[e[0]],e[2]):0,fV=dist[e[1]]>=0?Math.min(dist[e[1]],e[2]):0;res+=Math.min(e[2],fU+fV);}
    return res;
}`,
  },

  defaultInput: {
    n: 5,
    edges: [[0,1,5],[0,2,3],[1,3,2],[2,3,4]],
    maxMoves: 7,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Original Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Original nodes (not counting inserted ones)',
    },
    {
      name: 'maxMoves',
      label: 'Max Moves',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total moves available from node 0',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const maxMoves = input.maxMoves as number;
    const steps: AlgorithmStep[] = [];

    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, cnt] of edges) {
      graph[u].push([v, cnt + 1]);
      graph[v].push([u, cnt + 1]);
    }

    const dist = new Array(n).fill(-1);
    dist[0] = maxMoves;
    const heap: Array<[number, number]> = [[-maxMoves, 0]];

    steps.push({
      line: 2,
      explanation: `Dijkstra to find max remaining moves at each original node. Start at node 0 with ${maxMoves} moves. Edge cost = subdivisions + 1.`,
      variables: { maxMoves, startNode: 0 },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: { 0: 'active' },
        labels: { 0: `M=${maxMoves}` },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 20) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [neg, u] = heap.shift()!;
      const d = -neg;

      if (d < dist[u]) continue;

      steps.push({
        line: 4,
        explanation: `Process node ${u} with ${d} moves remaining. Explore neighbors.`,
        variables: { node: u, movesLeft: d },
        visualization: {
          type: 'array',
          array: dist.map(dv => (dv === -1 ? -1 : dv)),
          highlights: { [u]: 'active' },
          labels: { [u]: `rem=${d}` },
        },
      });

      for (const [v, w] of graph[u]) {
        const rem = dist[u] - w;
        if (rem > dist[v]) {
          dist[v] = rem;
          heap.push([-rem, v]);
          steps.push({
            line: 7,
            explanation: `Node ${u} -> Node ${v}: ${dist[u]} - ${w} = ${rem} moves remain. Update dist[${v}]=${rem}.`,
            variables: { from: u, to: v, cost: w, remaining: rem },
            visualization: {
              type: 'array',
              array: dist.map(dv => (dv === -1 ? -1 : dv)),
              highlights: { [u]: 'active', [v]: 'comparing' },
              labels: { [v]: `rem=${rem}` },
            },
          });
        }
      }
    }

    // Count reachable original nodes
    const reachedOriginal = dist.filter(d => d >= 0).length;
    steps.push({
      line: 9,
      explanation: `Dijkstra complete. Reached ${reachedOriginal} original nodes. Remaining moves: [${dist.join(', ')}].`,
      variables: { reachedOriginal, dist: dist.join(', ') },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: Object.fromEntries(dist.map((d, i) => [i, d >= 0 ? 'found' : 'mismatch'])),
        labels: {},
      },
    });

    // Count inserted nodes per edge
    let insertedCount = 0;
    for (const [u, v, cnt] of edges) {
      const fromU = dist[u] >= 0 ? Math.min(dist[u], cnt) : 0;
      const fromV = dist[v] >= 0 ? Math.min(dist[v], cnt) : 0;
      const reached = Math.min(cnt, fromU + fromV);
      insertedCount += reached;
      steps.push({
        line: 11,
        explanation: `Edge (${u},${v}) has ${cnt} inserted nodes. FromU=${fromU}, fromV=${fromV}. Reachable inserted = min(${cnt}, ${fromU}+${fromV}) = ${reached}.`,
        variables: { u, v, cnt, fromU, fromV, reached },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === -1 ? -1 : d)),
          highlights: { [u]: 'active', [v]: 'comparing' },
          labels: { [u]: `rem=${dist[u]}`, [v]: `rem=${dist[v]}` },
        },
      });
    }

    steps.push({
      line: 12,
      explanation: `Total reachable = ${reachedOriginal} original + ${insertedCount} inserted = ${reachedOriginal + insertedCount} nodes.`,
      variables: { original: reachedOriginal, inserted: insertedCount, total: reachedOriginal + insertedCount },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: { 0: 'sorted' },
        labels: { 0: `total=${reachedOriginal + insertedCount}` },
      },
    });

    return steps;
  },
};

export default reachableNodesInSubdividedGraph;
