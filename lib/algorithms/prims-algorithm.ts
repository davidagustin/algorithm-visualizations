import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const primsAlgorithm: AlgorithmDefinition = {
  id: 'prims-algorithm',
  title: 'Prim MST Algorithm',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Prim algorithm grows the Minimum Spanning Tree one vertex at a time. Starting from an arbitrary node, it always picks the minimum-weight edge that connects a visited node to an unvisited node, using a min-priority queue for efficiency.',
  tags: ['prim', 'minimum spanning tree', 'priority queue', 'greedy', 'graph'],

  code: {
    pseudocode: `function prim(V, adj, start):
  key = [Infinity] * V, key[start] = 0
  inMST = [false] * V
  parent = [-1] * V
  minHeap = [(0, start)]
  while minHeap not empty:
    (cost, u) = extractMin(minHeap)
    if inMST[u]: continue
    inMST[u] = true
    for each (v, w) in adj[u]:
      if not inMST[v] and w < key[v]:
        key[v] = w
        parent[v] = u
        push (w, v) to minHeap
  return parent, sum(key)`,

    python: `import heapq
def prim(V, adj, start=0):
    key = [float('inf')] * V
    key[start] = 0
    in_mst = [False] * V
    parent = [-1] * V
    heap = [(0, start)]
    total = 0
    while heap:
        cost, u = heapq.heappop(heap)
        if in_mst[u]: continue
        in_mst[u] = True
        total += cost
        for v, w in adj[u]:
            if not in_mst[v] and w < key[v]:
                key[v] = w
                parent[v] = u
                heapq.heappush(heap, (w, v))
    return parent, total`,

    javascript: `function prim(V, adj, start = 0) {
  const key = new Array(V).fill(Infinity);
  key[start] = 0;
  const inMST = new Array(V).fill(false);
  const parent = new Array(V).fill(-1);
  // Min-heap simulation with sorted array
  const heap = [[0, start]];
  let total = 0;
  while (heap.length > 0) {
    heap.sort((a, b) => a[0] - b[0]);
    const [cost, u] = heap.shift();
    if (inMST[u]) continue;
    inMST[u] = true;
    total += cost;
    for (const [v, w] of adj[u]) {
      if (!inMST[v] && w < key[v]) {
        key[v] = w;
        parent[v] = u;
        heap.push([w, v]);
      }
    }
  }
  return { parent, total };
}`,

    java: `public int prim(int V, List<int[]>[] adj) {
    int[] key = new int[V];
    Arrays.fill(key, Integer.MAX_VALUE);
    boolean[] inMST = new boolean[V];
    key[0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, 0});
    int total = 0;
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[1];
        if (inMST[u]) continue;
        inMST[u] = true;
        total += cur[0];
        for (int[] e : adj[u])
            if (!inMST[e[0]] && e[1] < key[e[0]]) {
                key[e[0]] = e[1];
                pq.offer(new int[]{e[1], e[0]});
            }
    }
    return total;
}`,
  },

  defaultInput: {
    V: 5,
    start: 0,
    edges: [0, 1, 2, 0, 3, 6, 1, 2, 3, 1, 3, 8, 1, 4, 5, 2, 4, 7, 3, 4, 9],
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
      name: 'start',
      label: 'Start Vertex',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting vertex for Prim',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 2, 0, 3, 6, 1, 2, 3, 1, 3, 8, 1, 4, 5, 2, 4, 7, 3, 4, 9],
      placeholder: '0,1,2,...',
      helperText: 'Flat list of u,v,w undirected edge triples',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const start = input.start as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: [number, number][][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      const u = edgeFlat[i], v = edgeFlat[i + 1], w = edgeFlat[i + 2];
      adj[u].push([v, w]);
      adj[v].push([u, w]);
    }

    const key: number[] = new Array(V).fill(Infinity);
    key[start] = 0;
    const inMST: boolean[] = new Array(V).fill(false);
    const parent: number[] = new Array(V).fill(-1);
    let total = 0;

    const makeViz = (): ArrayVisualization => ({
      type: 'array',
      array: key.map(k => (k === Infinity ? 999 : k)),
      highlights: Object.fromEntries(
        key.map((_, i) => [i, inMST[i] ? 'sorted' : key[i] === Infinity ? 'default' : 'active'])
      ),
      labels: Object.fromEntries(key.map((_, i) => [i, `v${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize key array. key[${start}] = 0, rest = Infinity.`,
      variables: { key: key.map(k => (k === Infinity ? 'INF' : k)), start },
      visualization: makeViz(),
    });

    const heap: [number, number][] = [[0, start]];

    while (heap.length > 0) {
      heap.sort((a, b) => a[0] - b[0]);
      const [cost, u] = heap.shift()!;
      if (inMST[u]) continue;
      inMST[u] = true;
      total += cost;

      steps.push({
        line: 8,
        explanation: `Extract min: vertex ${u} with key ${cost}. Add to MST. Total MST weight = ${total}.`,
        variables: { u, cost, total, inMST: inMST.map((v, i) => (v ? i : null)).filter(v => v !== null) },
        visualization: makeViz(),
      });

      for (const [v, w] of adj[u]) {
        if (!inMST[v] && w < key[v]) {
          key[v] = w;
          parent[v] = u;
          heap.push([w, v]);
          steps.push({
            line: 12,
            explanation: `Update key[${v}] = ${w} via vertex ${u}. Edge (${u},${v}) is a candidate MST edge.`,
            variables: { u, v, w, 'key[v]': w, 'parent[v]': u },
            visualization: makeViz(),
          });
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Prim complete. MST total weight = ${total}. Parent array: [${parent.join(', ')}].`,
      variables: { totalWeight: total, parent },
      visualization: makeViz(),
    });

    return steps;
  },
};

export default primsAlgorithm;
