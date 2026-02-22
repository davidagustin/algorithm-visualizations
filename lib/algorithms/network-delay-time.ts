import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const networkDelayTime: AlgorithmDefinition = {
  id: 'network-delay-time',
  title: 'Network Delay Time',
  leetcodeNumber: 743,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a network of n nodes and travel times along directed edges, find how long it takes for all nodes to receive a signal sent from source k. Uses Bellman-Ford to relax all edges V-1 times, finding shortest paths to every node.',
  tags: ['bellman-ford', 'shortest path', 'graph', 'dynamic programming'],

  code: {
    pseudocode: `function networkDelayTime(times, n, k):
  dist = array of size n+1 filled with Infinity
  dist[k] = 0
  for i from 1 to n-1:
    for each edge (u, v, w) in times:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
  maxDist = max(dist[1..n])
  return maxDist == Infinity ? -1 : maxDist`,

    python: `def networkDelayTime(times, n, k):
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    for _ in range(n - 1):
        for u, v, w in times:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    max_dist = max(dist[1:])
    return -1 if max_dist == float('inf') else max_dist`,

    javascript: `function networkDelayTime(times, n, k) {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let i = 0; i < n - 1; i++) {
    for (const [u, v, w] of times) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  const maxDist = Math.max(...dist.slice(1));
  return maxDist === Infinity ? -1 : maxDist;
}`,

    java: `public int networkDelayTime(int[][] times, int n, int k) {
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int[] edge : times) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    int max = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;
        max = Math.max(max, dist[i]);
    }
    return max;
}`,
  },

  defaultInput: {
    n: 4,
    k: 1,
    edges: [1, 2, 1, 2, 3, 1, 3, 4, 1, 1, 4, 4],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total nodes in network',
    },
    {
      name: 'k',
      label: 'Source Node',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Signal origin node (1-indexed)',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 3, 1, 3, 4, 1, 1, 4, 4],
      placeholder: '1,2,1,2,3,1,3,4,1,1,4,4',
      helperText: 'Flat list of u,v,w triples representing directed edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const times: [number, number, number][] = [];
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      times.push([edgeFlat[i], edgeFlat[i + 1], edgeFlat[i + 2]]);
    }

    const dist: number[] = new Array(n + 1).fill(Infinity);
    dist[k] = 0;

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dist.slice(1).map(d => (d === Infinity ? -1 : d)),
      highlights,
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `Node ${i + 1}`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dist array. dist[${k}] = 0, all others = Infinity.`,
      variables: { k, dist: dist.slice(1).map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz({ [k - 1]: 'active' }),
    });

    for (let iter = 0; iter < n - 1; iter++) {
      let relaxed = false;
      for (const [u, v, w] of times) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          const oldV = dist[v];
          dist[v] = dist[u] + w;
          relaxed = true;
          steps.push({
            line: 6,
            explanation: `Iteration ${iter + 1}: Relax edge ${u}->${v} (weight ${w}). dist[${v}] updated from ${oldV === Infinity ? 'INF' : oldV} to ${dist[v]}.`,
            variables: { iteration: iter + 1, u, v, w, 'dist[u]': dist[u], 'dist[v]': dist[v] },
            visualization: makeViz({ [u - 1]: 'active', [v - 1]: 'found' }),
          });
        } else {
          steps.push({
            line: 5,
            explanation: `Iteration ${iter + 1}: Check edge ${u}->${v} (weight ${w}). No relaxation needed (dist[${u}]=${dist[u] === Infinity ? 'INF' : dist[u]}, dist[${v}]=${dist[v] === Infinity ? 'INF' : dist[v]}).`,
            variables: { iteration: iter + 1, u, v, w },
            visualization: makeViz({ [u - 1]: 'comparing', [v - 1]: 'comparing' }),
          });
        }
      }
      if (!relaxed) break;
    }

    const maxDist = Math.max(...dist.slice(1));
    const result = maxDist === Infinity ? -1 : maxDist;

    steps.push({
      line: 8,
      explanation: `All relaxations done. Max distance among all nodes = ${result === -1 ? 'INF (unreachable node)' : result}. Result: ${result}.`,
      variables: { result, dist: dist.slice(1).map(d => (d === Infinity ? 'INF' : d)) },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, dist[i + 1] === Infinity ? 'mismatch' : 'sorted']))
      ),
    });

    return steps;
  },
};

export default networkDelayTime;
