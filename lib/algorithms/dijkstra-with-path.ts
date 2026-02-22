import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dijkstraWithPath: AlgorithmDefinition = {
  id: 'dijkstra-with-path',
  title: 'Dijkstra with Path Reconstruction',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Dijkstra algorithm finds shortest paths from a source node to all other nodes in a non-negative weighted graph. This variant also records a predecessor array so the exact shortest path to any destination can be reconstructed by backtracking through predecessors.',
  tags: ['dijkstra', 'shortest path', 'priority queue', 'path reconstruction', 'graph'],

  code: {
    pseudocode: `function dijkstra(V, adj, src):
  dist = [Infinity]*V, dist[src] = 0
  prev = [-1]*V
  minHeap = [(0, src)]
  while heap not empty:
    (d, u) = extractMin(heap)
    if d > dist[u]: continue
    for each (v, w) in adj[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        prev[v] = u
        push (dist[v], v) to heap
  return dist, prev`,

    python: `import heapq
def dijkstra(V, adj, src):
    dist = [float('inf')] * V
    dist[src] = 0
    prev = [-1] * V
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))
    return dist, prev

def get_path(prev, dst):
    path = []
    while dst != -1:
        path.append(dst)
        dst = prev[dst]
    return path[::-1]`,

    javascript: `function dijkstra(V, adj, src) {
  const dist = new Array(V).fill(Infinity);
  dist[src] = 0;
  const prev = new Array(V).fill(-1);
  const heap = [[0, src]];
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        heap.push([dist[v], v]);
      }
    }
  }
  return { dist, prev };
}`,

    java: `public int[] dijkstra(int V, List<int[]>[] adj, int src) {
    int[] dist = new int[V];
    int[] prev = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    Arrays.fill(prev, -1);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : adj[u])
            if (dist[u] + e[1] < dist[e[0]]) {
                dist[e[0]] = dist[u] + e[1];
                prev[e[0]] = u;
                pq.offer(new int[]{dist[e[0]], e[0]});
            }
    }
    return dist;
}`,
  },

  defaultInput: {
    V: 5,
    src: 0,
    dst: 4,
    edges: [0, 1, 4, 0, 2, 1, 1, 3, 1, 2, 1, 2, 2, 3, 5, 3, 4, 3],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'src',
      label: 'Source Vertex',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      name: 'dst',
      label: 'Destination Vertex',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 4, 0, 2, 1, 1, 3, 1, 2, 1, 2, 2, 3, 5, 3, 4, 3],
      placeholder: '0,1,4,0,2,1,...',
      helperText: 'Flat list of directed u->v with weight w',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const src = input.src as number;
    const dst = input.dst as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: [number, number][][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      adj[edgeFlat[i]].push([edgeFlat[i + 1], edgeFlat[i + 2]]);
    }

    const dist: number[] = new Array(V).fill(Infinity);
    dist[src] = 0;
    const prev: number[] = new Array(V).fill(-1);

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: dist.map(d => (d === Infinity ? 999 : d)),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          i === src ? 'pointer' : i === active ? 'active' : dist[i] < Infinity ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dist[${src}]=0, all others=Infinity.`,
      variables: { src, dist: dist.map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz(src),
    });

    const heap: [number, number][] = [[0, src]];

    while (heap.length > 0) {
      heap.sort((a, b) => a[0] - b[0]);
      const [d, u] = heap.shift()!;

      if (d > dist[u]) continue;

      steps.push({
        line: 5,
        explanation: `Process vertex ${u} with distance ${d}.`,
        variables: { u, distance: d, remaining: heap.length },
        visualization: makeViz(u),
      });

      for (const [v, w] of adj[u]) {
        if (dist[u] + w < dist[v]) {
          const old = dist[v];
          dist[v] = dist[u] + w;
          prev[v] = u;
          heap.push([dist[v], v]);
          steps.push({
            line: 9,
            explanation: `Relax edge ${u}->${v} (w=${w}). dist[${v}]: ${old === Infinity ? 'INF' : old} -> ${dist[v]}. prev[${v}]=${u}.`,
            variables: { u, v, w, 'dist[v]': dist[v], 'prev[v]': u },
            visualization: makeViz(v),
          });
        }
      }
    }

    // Reconstruct path to dst
    const path: number[] = [];
    let cur = dst;
    while (cur !== -1) { path.push(cur); cur = prev[cur]; }
    path.reverse();

    steps.push({
      line: 12,
      explanation: `Dijkstra complete. Shortest path from ${src} to ${dst}: [${path.join(' -> ')}] with total distance ${dist[dst] === Infinity ? 'INF' : dist[dst]}.`,
      variables: { path, 'dist[dst]': dist[dst] === Infinity ? 'INF' : dist[dst] },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === Infinity ? 999 : d)),
        highlights: Object.fromEntries(
          Array.from({ length: V }, (_, i) => [i, path.includes(i) ? 'found' : dist[i] < Infinity ? 'visited' : 'default'])
        ),
        labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
      },
    });

    return steps;
  },
};

export default dijkstraWithPath;
