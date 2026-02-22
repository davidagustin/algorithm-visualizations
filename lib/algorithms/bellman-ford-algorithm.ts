import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bellmanFordAlgorithm: AlgorithmDefinition = {
  id: 'bellman-ford-algorithm',
  title: 'Bellman-Ford Shortest Path',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Bellman-Ford computes single-source shortest paths in a weighted graph, handling negative edge weights. It relaxes all edges V-1 times. A Vth relaxation pass detects negative cycles.',
  tags: ['bellman-ford', 'shortest path', 'negative weights', 'graph'],

  code: {
    pseudocode: `function bellmanFord(graph, src, V):
  dist = array of size V filled with Infinity
  dist[src] = 0
  for i from 1 to V-1:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
  // Detect negative cycle
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      return "Negative cycle detected"
  return dist`,

    python: `def bellman_ford(edges, V, src):
    dist = [float('inf')] * V
    dist[src] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None  # negative cycle
    return dist`,

    javascript: `function bellmanFord(edges, V, src) {
  const dist = new Array(V).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  for (const [u, v, w] of edges) {
    if (dist[u] + w < dist[v]) return null; // negative cycle
  }
  return dist;
}`,

    java: `public int[] bellmanFord(int[][] edges, int V, int src) {
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++) {
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    return dist;
}`,
  },

  defaultInput: {
    V: 5,
    src: 0,
    edges: [0, 1, 6, 0, 2, 7, 1, 2, 8, 1, 3, 5, 1, 4, -4, 2, 3, -3, 2, 4, 9, 3, 1, -2, 4, 3, 7],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total vertices in graph',
    },
    {
      name: 'src',
      label: 'Source Vertex',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting vertex (0-indexed)',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 6, 0, 2, 7, 1, 2, 8, 1, 3, 5, 1, 4, -4, 2, 3, -3, 2, 4, 9, 3, 1, -2, 4, 3, 7],
      placeholder: '0,1,6,0,2,7,...',
      helperText: 'Flat list of u,v,w triples',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const src = input.src as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const edges: [number, number, number][] = [];
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      edges.push([edgeFlat[i], edgeFlat[i + 1], edgeFlat[i + 2]]);
    }

    const dist: number[] = new Array(V).fill(Infinity);
    dist[src] = 0;

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dist.map(d => (d === Infinity ? 999 : d)),
      highlights,
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dist[${src}] = 0, all other distances = Infinity.`,
      variables: { src, dist: dist.map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz({ [src]: 'active' }),
    });

    for (let iter = 0; iter < V - 1; iter++) {
      for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          const old = dist[v];
          dist[v] = dist[u] + w;
          steps.push({
            line: 6,
            explanation: `Iter ${iter + 1}: Relax edge ${u}->${v} (w=${w}). dist[${v}]: ${old === Infinity ? 'INF' : old} -> ${dist[v]}.`,
            variables: { iteration: iter + 1, u, v, w, 'new dist[v]': dist[v] },
            visualization: makeViz({ [u]: 'active', [v]: 'found' }),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: 'Checking for negative cycles by attempting one more relaxation pass.',
      variables: { dist: dist.map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz(Object.fromEntries(Array.from({ length: V }, (_, i) => [i, 'sorted']))),
    });

    let hasNegCycle = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        hasNegCycle = true;
        break;
      }
    }

    steps.push({
      line: 11,
      explanation: hasNegCycle
        ? 'Negative cycle detected! Shortest paths are not well-defined.'
        : `No negative cycle. Final shortest distances from vertex ${src}: [${dist.map(d => (d === Infinity ? 'INF' : d)).join(', ')}].`,
      variables: { negativeCycle: hasNegCycle, dist: dist.map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: V }, (_, i) => [i, hasNegCycle ? 'mismatch' : dist[i] === Infinity ? 'visited' : 'found']))
      ),
    });

    return steps;
  },
};

export default bellmanFordAlgorithm;
