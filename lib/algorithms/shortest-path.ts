import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPath: AlgorithmDefinition = {
  id: 'shortest-path',
  title: 'Shortest Path',
  leetcodeNumber: 743,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'You are given a network of n nodes and weighted directed edges. Given a source node k, find the time it takes for a signal to reach all nodes. If impossible, return -1. This is classic Dijkstra\'s algorithm using a priority queue.',
  tags: ['Graph', 'Dijkstra', 'Heap'],
  code: {
    pseudocode: `function networkDelayTime(times, n, k):
  adj = build adjacency list from times
  dist = array of size n+1, all Infinity
  dist[k] = 0
  pq = min-heap with (0, k)
  while pq not empty:
    (d, u) = pq.extractMin()
    if d > dist[u]: continue
    for (v, w) in adj[u]:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        pq.insert((dist[v], v))
  maxDist = max(dist[1..n])
  return maxDist == Infinity ? -1 : maxDist`,
    python: `def networkDelayTime(times, n, k):
    adj = defaultdict(list)
    for u, v, w in times:
        adj[u].append((v, w))
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    maxDist = max(dist[1:])
    return -1 if maxDist == float('inf') else maxDist`,
    javascript: `function networkDelayTime(times, n, k) {
  const adj = new Map();
  for (const [u, v, w] of times) {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u).push([v, w]);
  }
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  // Simple priority queue using sorted array
  const pq = [[0, k]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of (adj.get(u) || [])) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  const maxDist = Math.max(...dist.slice(1));
  return maxDist === Infinity ? -1 : maxDist;
}`,
    java: `public int networkDelayTime(int[][] times, int n, int k) {
    Map<Integer, List<int[]>> adj = new HashMap<>();
    for (int[] t : times)
        adj.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);
    pq.add(new int[]{0, k});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;
        if (adj.containsKey(u))
            for (int[] edge : adj.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{dist[v], v});
                }
            }
    }
    int max = 0;
    for (int i = 1; i <= n; i++) max = Math.max(max, dist[i]);
    return max == Integer.MAX_VALUE ? -1 : max;
}`,
  },
  defaultInput: {
    times: [[2, 1, 1], [2, 3, 1], [3, 4, 1]],
    n: 4,
    k: 2,
  },
  inputFields: [
    {
      name: 'times',
      label: 'Edges [u, v, w]',
      type: 'array',
      defaultValue: [[2, 1, 1], [2, 3, 1], [3, 4, 1]],
      placeholder: '[[2,1,1],[2,3,1],[3,4,1]]',
      helperText: 'Directed edges: [source, target, weight]',
    },
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Nodes are labeled 1 to n',
    },
    {
      name: 'k',
      label: 'Source Node',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Source node for Dijkstra',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const times = input.times as number[][];
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    // Build adjacency list
    const adj = new Map<number, [number, number][]>();
    for (const [u, v, w] of times) {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u)!.push([v, w]);
    }

    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    const finalized = new Set<number>();

    // Display: dist array for nodes 1..n
    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      pqStr: string
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        const node = i + 1;
        if (finalized.has(node)) baseHighlights[i] = 'sorted';
      }
      return {
        type: 'array',
        array: dist.slice(1).map((d: number) => d === Infinity ? -1 : d),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'Dijkstra State',
          entries: [
            { key: 'Source', value: String(k) },
            { key: 'Priority Queue', value: pqStr || 'empty' },
            { key: 'Finalized', value: finalized.size > 0 ? [...finalized].sort((a, b) => a - b).join(', ') : 'none' },
          ],
        },
      };
    }

    const nodeLabels = () => {
      const l: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        const d = dist[i + 1];
        l[i] = `n${i + 1}:${d === Infinity ? 'INF' : d}`;
      }
      return l;
    };

    steps.push({
      line: 1,
      explanation: `Dijkstra from node ${k}. Initialize dist[${k}]=0, all others=INF. Array shows dist for nodes 1..${n} (-1 means INF).`,
      variables: { n, k, edges: times.length },
      visualization: makeViz({ [k - 1]: 'active' }, nodeLabels(), `(0, ${k})`),
    });

    // Simple priority queue simulation
    const pq: [number, number][] = [[0, k]];

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [d, u] = pq.shift()!;

      if (d > dist[u]) continue;

      finalized.add(u);
      const pqStr = pq.map(([dd, uu]) => `(${dd},${uu})`).join(', ');

      steps.push({
        line: 7,
        explanation: `Extract min: node ${u} with distance ${d}. Finalize node ${u}.`,
        variables: { u, d, finalized: [...finalized] },
        visualization: makeViz({ [u - 1]: 'found' }, nodeLabels(), pqStr),
      });

      const neighbors = adj.get(u) || [];
      for (const [v, w] of neighbors) {
        const newDist = dist[u] + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          pq.push([newDist, v]);

          steps.push({
            line: 10,
            explanation: `Edge ${u}->${v} (weight ${w}): dist[${u}]+${w} = ${newDist} < dist[${v}] (was ${dist[v] === newDist ? 'INF' : 'higher'}). Update dist[${v}] = ${newDist}.`,
            variables: { u, v, w, newDist },
            visualization: makeViz(
              { [u - 1]: 'found', [v - 1]: 'active' },
              nodeLabels(),
              pq.map(([dd, uu]) => `(${dd},${uu})`).join(', ')
            ),
          });
        } else {
          steps.push({
            line: 9,
            explanation: `Edge ${u}->${v} (weight ${w}): dist[${u}]+${w} = ${newDist} >= dist[${v}]=${dist[v]}. No improvement.`,
            variables: { u, v, w, currentDist: dist[v] },
            visualization: makeViz(
              { [u - 1]: 'found', [v - 1]: 'visited' },
              nodeLabels(),
              pq.map(([dd, uu]) => `(${dd},${uu})`).join(', ')
            ),
          });
        }
      }
    }

    // Compute result
    let maxDist = 0;
    for (let i = 1; i <= n; i++) {
      if (dist[i] === Infinity) { maxDist = Infinity; break; }
      maxDist = Math.max(maxDist, dist[i]);
    }
    const result = maxDist === Infinity ? -1 : maxDist;

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHighlights[i] = dist[i + 1] === Infinity ? 'mismatch' : 'found';
    }

    steps.push({
      line: 13,
      explanation: result === -1
        ? `Some nodes are unreachable. Return -1.`
        : `All nodes reachable. Maximum distance = ${result}. Signal reaches all nodes in ${result} time units.`,
      variables: { result, dist: dist.slice(1) },
      visualization: makeViz(finalHighlights, nodeLabels(), ''),
    });

    return steps;
  },
};

export default shortestPath;
