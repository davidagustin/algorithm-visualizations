import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const bellmanFordNegativeCycle: AlgorithmDefinition = {
  id: 'bellman-ford-negative-cycle',
  title: 'Bellman-Ford: Negative Cycle Detection',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Bellman-Ford computes single-source shortest paths and detects negative weight cycles. Relax all edges V-1 times. If any edge can still be relaxed after V-1 iterations, a negative cycle exists. Unlike Dijkstra, handles negative edge weights. Time complexity O(VE).',
  tags: ['graph', 'bellman-ford', 'negative cycle', 'shortest path', 'dynamic programming'],

  code: {
    pseudocode: `function bellmanFord(graph, source, n):
  dist = array of INF, dist[source] = 0
  for i in 1 to n-1:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
  // Negative cycle check
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      return "Negative cycle detected"
  return dist`,

    python: `def bellmanFord(edges, n, source):
    INF = float('inf')
    dist = [INF] * n
    dist[source] = 0
    for _ in range(n-1):
        for u,v,w in edges:
            if dist[u] != INF and dist[u]+w < dist[v]:
                dist[v] = dist[u]+w
    for u,v,w in edges:
        if dist[u] != INF and dist[u]+w < dist[v]:
            return None  # negative cycle
    return dist`,

    javascript: `function bellmanFord(edges, n, source) {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  for (let i = 0; i < n-1; i++) {
    for (const [u,v,w] of edges) {
      if (dist[u] !== Infinity && dist[u]+w < dist[v]) {
        dist[v] = dist[u]+w;
      }
    }
  }
  for (const [u,v,w] of edges) {
    if (dist[u] !== Infinity && dist[u]+w < dist[v]) {
      return null; // negative cycle
    }
  }
  return dist;
}`,

    java: `public int[] bellmanFord(int[][] edges, int n, int source) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE/2);
    dist[source] = 0;
    for (int i=0; i<n-1; i++) {
        for (int[] e : edges) {
            if (dist[e[0]]+e[2] < dist[e[1]])
                dist[e[1]] = dist[e[0]]+e[2];
        }
    }
    for (int[] e : edges) {
        if (dist[e[0]]+e[2] < dist[e[1]])
            return null; // negative cycle
    }
    return dist;
}`,
  },

  defaultInput: {
    n: 5,
    edges: [[0,1,6],[0,2,7],[1,2,8],[1,3,-4],[2,4,9],[3,0,2],[4,3,7],[4,1,5]],
    source: 0,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total nodes in the graph',
    },
    {
      name: 'source',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const source = input.source as number;
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    const dist = new Array(n).fill(INF);
    dist[source] = 0;

    steps.push({
      line: 2,
      explanation: `Initialize: dist[${source}]=0, all others=INF. Bellman-Ford runs V-1=${n - 1} iterations.`,
      variables: { n, source, iterations: n - 1 },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: { [source]: 'active' },
        labels: { [source]: 'src=0' },
      },
    });

    // Run n-1 iterations
    for (let i = 0; i < n - 1; i++) {
      let relaxed = false;
      for (const [u, v, w] of edges) {
        if (dist[u] !== INF && dist[u] + w < dist[v]) {
          const old = dist[v];
          dist[v] = dist[u] + w;
          relaxed = true;
          steps.push({
            line: 5,
            explanation: `Iteration ${i + 1}: Relax edge ${u}->${v} (weight ${w}): ${dist[u]}+${w}=${dist[v]} < ${old === INF ? 'INF' : old}. Update dist[${v}]=${dist[v]}.`,
            variables: { iteration: i + 1, from: u, to: v, weight: w, newDist: dist[v] },
            visualization: {
              type: 'array',
              array: dist.map(d => (d === INF ? 999 : d)),
              highlights: { [u]: 'active', [v]: 'comparing' },
              labels: { [v]: `=${dist[v]}` },
            },
          });
        }
      }

      if (!relaxed) {
        steps.push({
          line: 4,
          explanation: `Iteration ${i + 1}: No edges relaxed. Early termination - shortest paths found.`,
          variables: { iteration: i + 1, earlyStop: true },
          visualization: {
            type: 'array',
            array: dist.map(d => (d === INF ? 999 : d)),
            highlights: Object.fromEntries(dist.map((d, i2) => [i2, d < INF ? 'sorted' : 'mismatch'])),
            labels: {},
          },
        });
        break;
      }
    }

    steps.push({
      line: 4,
      explanation: `V-1=${n - 1} iterations complete. Distances: [${dist.map(d => (d === INF ? 'INF' : d)).join(', ')}]. Now checking for negative cycles.`,
      variables: { dist: dist.map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: {},
        labels: {},
      },
    });

    // Negative cycle check
    let hasNegCycle = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        hasNegCycle = true;
        steps.push({
          line: 8,
          explanation: `Negative cycle detected! Edge ${u}->${v} (weight ${w}): dist[${u}]+${w}=${dist[u] + w} < dist[${v}]=${dist[v]}. Relaxation still possible after V-1 iterations.`,
          variables: { negCycleEdge: `${u}->${v}`, weight: w },
          visualization: {
            type: 'array',
            array: dist.map(d => (d === INF ? 999 : d)),
            highlights: { [u]: 'mismatch', [v]: 'mismatch' },
            labels: { [u]: 'neg-cycle!', [v]: 'neg-cycle!' },
          },
        });
        break;
      }
    }

    if (!hasNegCycle) {
      steps.push({
        line: 9,
        explanation: `No negative cycle detected. Shortest distances from ${source}: [${dist.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
        variables: { result: dist.map(d => (d === INF ? 'INF' : d)) },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === INF ? 999 : d)),
          highlights: Object.fromEntries(dist.map((d, i) => [i, d < INF ? 'found' : 'mismatch'])),
          labels: Object.fromEntries(dist.map((d, i) => [i, `d=${d < INF ? d : 'INF'}`])),
        },
      });
    }

    return steps;
  },
};

export default bellmanFordNegativeCycle;
