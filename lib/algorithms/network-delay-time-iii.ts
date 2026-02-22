import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const networkDelayTimeIII: AlgorithmDefinition = {
  id: 'network-delay-time-iii',
  title: 'Network Delay Time III',
  leetcodeNumber: 743,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'You have a network of n nodes and weighted directed edges. Given source node k, find the minimum time for a signal to reach ALL nodes. If any node is unreachable, return -1. Uses Bellman-Ford algorithm instead of Dijkstra for variety.',
  tags: ['Graph', 'Bellman-Ford', 'Shortest Path'],
  code: {
    pseudocode: `function networkDelayTime(times, n, k):
  dist = [Infinity] * (n+1)
  dist[k] = 0
  // Relax all edges n-1 times
  for i from 1 to n-1:
    for (u, v, w) in times:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
  maxDist = max(dist[1..n])
  return -1 if maxDist == Infinity else maxDist`,
    python: `def networkDelayTime(times, n, k):
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    for _ in range(n - 1):
        for u, v, w in times:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    maxDist = max(dist[1:])
    return -1 if maxDist == float('inf') else maxDist`,
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
        for (int[] t : times) {
            if (dist[t[0]] != Integer.MAX_VALUE && dist[t[0]] + t[2] < dist[t[1]])
                dist[t[1]] = dist[t[0]] + t[2];
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
    times: [[2,1,1],[2,3,1],[3,4,1]],
    n: 4,
    k: 2,
  },
  inputFields: [
    {
      name: 'times',
      label: 'Edges [u, v, w]',
      type: 'array',
      defaultValue: [[2,1,1],[2,3,1],[3,4,1]],
      placeholder: '[[2,1,1],[2,3,1],[3,4,1]]',
      helperText: 'Directed edges: [source, target, weight]',
    },
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'k',
      label: 'Source Node',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const times = input.times as number[][];
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;

    function makeViz(highlights: Record<number, string>, iteration: number, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: dist.slice(1).map(d => d === Infinity ? -1 : d),
        highlights,
        labels: Object.fromEntries(dist.slice(1).map((d, i) => [i, `n${i+1}:${d === Infinity ? 'INF' : d}`])),
        auxData: {
          label: 'Bellman-Ford',
          entries: [
            { key: 'Source', value: String(k) },
            { key: 'Iteration', value: `${iteration}/${n - 1}` },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    const initH: Record<number, string> = {};
    for (let i = 0; i < n; i++) initH[i] = i + 1 === k ? 'active' : 'default';
    steps.push({
      line: 1,
      explanation: `Bellman-Ford: Initialize dist[${k}]=0, all others=INF. Will relax all ${times.length} edges ${n-1} times. Array shows dist for nodes 1..${n}.`,
      variables: { n, k, edges: times.length },
      visualization: makeViz(initH, 0, 'Initialized'),
    });

    for (let iter = 1; iter <= n - 1; iter++) {
      let updated = false;
      for (const [u, v, w] of times) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
          const old = dist[v];
          dist[v] = dist[u] + w;
          updated = true;
          const h: Record<number, string> = {};
          for (let i = 0; i < n; i++) h[i] = 'default';
          h[u - 1] = 'found';
          h[v - 1] = 'active';
          steps.push({
            line: 6,
            explanation: `Iter ${iter}: Relax edge ${u}->${v} (w=${w}). dist[${v}] = ${old === Infinity ? 'INF' : old} → ${dist[v]}.`,
            variables: { iter, u, v, w, oldDist: old, newDist: dist[v] },
            visualization: makeViz(h, iter, `Updated dist[${v}]=${dist[v]}`),
          });
        }
      }
      if (!updated) {
        steps.push({
          line: 5,
          explanation: `Iteration ${iter}: No updates — converged early. Remaining iterations will change nothing.`,
          variables: { iter },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted'])),
            iter,
            'Converged'
          ),
        });
        break;
      }
    }

    let maxDist = 0;
    let reachable = true;
    for (let i = 1; i <= n; i++) {
      if (dist[i] === Infinity) { reachable = false; break; }
      maxDist = Math.max(maxDist, dist[i]);
    }
    const result = reachable ? maxDist : -1;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = dist[i + 1] === Infinity ? 'mismatch' : 'found';

    steps.push({
      line: 9,
      explanation: result === -1
        ? `Some nodes unreachable. Return -1.`
        : `All nodes reachable. Max distance = ${result}. Signal reaches all nodes in ${result} time.`,
      variables: { result },
      visualization: makeViz(finalH, n - 1, `Result: ${result}`),
    });

    return steps;
  },
};

export default networkDelayTimeIII;
