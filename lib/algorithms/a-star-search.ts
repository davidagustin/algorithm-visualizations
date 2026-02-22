import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const aStarSearch: AlgorithmDefinition = {
  id: 'a-star-search',
  title: 'A* Pathfinding Algorithm',
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'A* is an informed search that finds the shortest path using f(n) = g(n) + h(n), where g(n) is cost from start and h(n) is an admissible heuristic estimating cost to goal. It is optimal when the heuristic never overestimates. Demonstrated on a flat weighted graph with Manhattan-style heuristic.',
  tags: ['A*', 'heuristic search', 'shortest path', 'informed search', 'graph'],

  code: {
    pseudocode: `function aStar(V, adj, src, dst, h):
  g = [Infinity]*V, g[src] = 0
  f = [Infinity]*V, f[src] = h[src]
  prev = [-1]*V
  open = priority queue with (f[src], src)
  while open not empty:
    (_, u) = extractMin(open)
    if u == dst: break
    for each (v, w) in adj[u]:
      tentativeG = g[u] + w
      if tentativeG < g[v]:
        g[v] = tentativeG
        f[v] = g[v] + h[v]
        prev[v] = u
        push (f[v], v) to open
  return g[dst], reconstruct(prev, dst)`,

    python: `import heapq
def a_star(V, adj, src, dst, h):
    g = [float('inf')] * V
    g[src] = 0
    f = [float('inf')] * V
    f[src] = h[src]
    prev = [-1] * V
    heap = [(f[src], src)]
    while heap:
        _, u = heapq.heappop(heap)
        if u == dst: break
        for v, w in adj[u]:
            tg = g[u] + w
            if tg < g[v]:
                g[v] = tg
                f[v] = g[v] + h[v]
                prev[v] = u
                heapq.heappush(heap, (f[v], v))
    return g[dst], prev`,

    javascript: `function aStar(V, adj, src, dst, h) {
  const g = new Array(V).fill(Infinity);
  g[src] = 0;
  const f = new Array(V).fill(Infinity);
  f[src] = h[src];
  const prev = new Array(V).fill(-1);
  const open = [[f[src], src]];
  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, u] = open.shift();
    if (u === dst) break;
    for (const [v, w] of adj[u]) {
      const tg = g[u] + w;
      if (tg < g[v]) {
        g[v] = tg; f[v] = g[v] + h[v];
        prev[v] = u; open.push([f[v], v]);
      }
    }
  }
  return { cost: g[dst], prev };
}`,

    java: `public int aStar(int V, List<int[]>[] adj, int src, int dst, int[] h) {
    int[] g = new int[V], f = new int[V], prev = new int[V];
    Arrays.fill(g, Integer.MAX_VALUE / 2);
    Arrays.fill(f, Integer.MAX_VALUE / 2);
    Arrays.fill(prev, -1);
    g[src] = 0; f[src] = h[src];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{f[src], src});
    while (!pq.isEmpty()) {
        int u = pq.poll()[1];
        if (u == dst) break;
        for (int[] e : adj[u]) {
            int tg = g[u] + e[1];
            if (tg < g[e[0]]) {
                g[e[0]] = tg; f[e[0]] = tg + h[e[0]]; prev[e[0]] = u;
                pq.offer(new int[]{f[e[0]], e[0]});
            }
        }
    }
    return g[dst];
}`,
  },

  defaultInput: {
    V: 6,
    src: 0,
    dst: 5,
    heuristic: [7, 6, 2, 1, 4, 0],
    edges: [0, 1, 2, 0, 2, 5, 1, 3, 1, 2, 3, 3, 2, 4, 2, 3, 5, 4, 4, 5, 1],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
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
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'heuristic',
      label: 'Heuristic h(n) per vertex',
      type: 'array',
      defaultValue: [7, 6, 2, 1, 4, 0],
      placeholder: '7,6,2,1,4,0',
      helperText: 'Estimated cost from each vertex to destination',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 2, 0, 2, 5, 1, 3, 1, 2, 3, 3, 2, 4, 2, 3, 5, 4, 4, 5, 1],
      placeholder: '0,1,2,...',
      helperText: 'Flat list of directed u->v with weight w',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const src = input.src as number;
    const dst = input.dst as number;
    const h = input.heuristic as number[];
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: [number, number][][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      adj[edgeFlat[i]].push([edgeFlat[i + 1], edgeFlat[i + 2]]);
    }

    const g: number[] = new Array(V).fill(Infinity);
    g[src] = 0;
    const f: number[] = new Array(V).fill(Infinity);
    f[src] = h[src];
    const prev: number[] = new Array(V).fill(-1);

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: g.map(d => (d === Infinity ? 999 : d)),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          i === dst ? 'found' : i === active ? 'active' : i === src ? 'pointer' : g[i] < Infinity ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `g=${g[i] === Infinity ? '?' : g[i]},h=${h[i]}`])),
    });

    steps.push({
      line: 2,
      explanation: `A* init: g[${src}]=0, f[${src}]=h[${src}]=${h[src]}. Heuristic: [${h.join(', ')}].`,
      variables: { src, dst, heuristic: h },
      visualization: makeViz(src),
    });

    const open: [number, number][] = [[f[src], src]];

    while (open.length > 0) {
      open.sort((a, b) => a[0] - b[0]);
      const [fVal, u] = open.shift()!;

      steps.push({
        line: 7,
        explanation: `Expand vertex ${u} with f=${fVal} (g=${g[u]}, h=${h[u]}).`,
        variables: { u, g: g[u], h: h[u], f: fVal },
        visualization: makeViz(u),
      });

      if (u === dst) break;

      for (const [v, w] of adj[u]) {
        const tg = g[u] + w;
        if (tg < g[v]) {
          g[v] = tg;
          f[v] = g[v] + h[v];
          prev[v] = u;
          open.push([f[v], v]);
          steps.push({
            line: 12,
            explanation: `Update vertex ${v}: g[${v}]=${g[v]}, f[${v}]=${f[v]} (g=${g[v]}+h=${h[v]}). prev[${v}]=${u}.`,
            variables: { v, 'g[v]': g[v], 'h[v]': h[v], 'f[v]': f[v] },
            visualization: makeViz(v),
          });
        }
      }
    }

    const path: number[] = [];
    let cur = dst;
    while (cur !== -1) { path.push(cur); cur = prev[cur]; }
    path.reverse();

    steps.push({
      line: 15,
      explanation: `A* complete. Shortest path from ${src} to ${dst}: [${path.join(' -> ')}], cost = ${g[dst] === Infinity ? 'unreachable' : g[dst]}.`,
      variables: { path, cost: g[dst] },
      visualization: {
        type: 'array',
        array: g.map(d => (d === Infinity ? 999 : d)),
        highlights: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, path.includes(i) ? 'found' : 'visited'])),
        labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
      },
    });

    return steps;
  },
};

export default aStarSearch;
