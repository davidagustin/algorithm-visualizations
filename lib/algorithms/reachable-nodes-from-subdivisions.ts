import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reachableNodesFromSubdivisions: AlgorithmDefinition = {
  id: 'reachable-nodes-from-subdivisions',
  title: 'Reachable Nodes In Subdivided Graph',
  leetcodeNumber: 882,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'An undirected graph has n nodes. Each edge (u, v, cnt) is subdivided with cnt new nodes. Given moves, find how many original and new nodes can be reached from node 0 using at most moves steps. Use Dijkstra to find shortest distances, then count reachable original nodes and new subdivision nodes on used edges.',
  tags: ['math', 'graph', 'dijkstra', 'shortest path'],

  code: {
    pseudocode: `function reachableNodes(edges, maxMoves, n):
  build adjacency list with (neighbor, subNodes)
  dist = Dijkstra from node 0
  result = count of original nodes where dist <= maxMoves
  for each edge (u, v, cnt):
    fromU = max(0, maxMoves - dist[u])
    fromV = max(0, maxMoves - dist[v])
    result += min(cnt, fromU + fromV)
  return result`,

    python: `import heapq
def reachableNodes(edges, maxMoves, n):
    g = [[] for _ in range(n)]
    for u, v, cnt in edges:
        g[u].append((v, cnt)); g[v].append((u, cnt))
    dist = [float('inf')] * n
    dist[0] = 0
    pq = [(0, 0)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, cnt in g[u]:
            nd = d + cnt + 1
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    result = sum(1 for d in dist if d <= maxMoves)
    for u, v, cnt in edges:
        fu = max(0, maxMoves - dist[u])
        fv = max(0, maxMoves - dist[v])
        result += min(cnt, fu + fv)
    return result`,

    javascript: `function reachableNodes(edges, maxMoves, n) {
  const g = Array.from({length: n}, () => []);
  for (const [u, v, cnt] of edges) {
    g[u].push([v, cnt]); g[v].push([u, cnt]);
  }
  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;
  const pq = [[0, 0]]; // [dist, node]
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, cnt] of g[u]) {
      const nd = d + cnt + 1;
      if (nd < dist[v]) { dist[v] = nd; pq.push([nd, v]); }
    }
  }
  let result = dist.filter(d => d <= maxMoves).length;
  for (const [u, v, cnt] of edges) {
    const fu = Math.max(0, maxMoves - dist[u]);
    const fv = Math.max(0, maxMoves - dist[v]);
    result += Math.min(cnt, fu + fv);
  }
  return result;
}`,

    java: `public int reachableNodes(int[][] edges, int maxMoves, int n) {
    List<int[]>[] g = new List[n];
    for (int i = 0; i < n; i++) g[i] = new ArrayList<>();
    for (int[] e : edges) { g[e[0]].add(new int[]{e[1], e[2]}); g[e[1]].add(new int[]{e[0], e[2]}); }
    int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE); dist[0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, 0});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        if (cur[0] > dist[cur[1]]) continue;
        for (int[] nb : g[cur[1]]) {
            int nd = cur[0] + nb[1] + 1;
            if (nd < dist[nb[0]]) { dist[nb[0]] = nd; pq.offer(new int[]{nd, nb[0]}); }
        }
    }
    int result = 0;
    for (int d : dist) if (d <= maxMoves) result++;
    for (int[] e : edges) {
        int fu = Math.max(0, maxMoves - dist[e[0]]);
        int fv = Math.max(0, maxMoves - dist[e[1]]);
        result += Math.min(e[2], fu + fv);
    }
    return result;
}`,
  },

  defaultInput: {
    edges: [[0, 1, 10], [0, 2, 1], [1, 2, 2]],
    maxMoves: 6,
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of original nodes',
    },
    {
      name: 'maxMoves',
      label: 'Max Moves',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Maximum number of moves allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edges = (input.edges as number[][]) ?? [[0, 1, 10], [0, 2, 1], [1, 2, 2]];
    const maxMoves = input.maxMoves as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Graph has ${n} original nodes. Each edge can have subdivision nodes. Max moves = ${maxMoves}. Run Dijkstra from node 0 to find shortest distances.`,
      variables: { n, maxMoves, edges },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      } as ArrayVisualization,
    });

    // Build adjacency list
    const g: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v, cnt] of edges) {
      g[u].push([v, cnt]);
      g[v].push([u, cnt]);
    }

    // Dijkstra (simple for small graph)
    const dist = new Array(n).fill(Infinity);
    dist[0] = 0;
    const visited = new Array(n).fill(false);

    for (let iter = 0; iter < n; iter++) {
      // Find unvisited node with min dist
      let u = -1;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && (u === -1 || dist[i] < dist[u])) u = i;
      }
      if (u === -1 || dist[u] === Infinity) break;
      visited[u] = true;

      steps.push({
        line: 3,
        explanation: `Dijkstra: processing node ${u} with dist ${dist[u]}.`,
        variables: { node: u, dist: dist[u], allDists: [...dist] },
        visualization: {
          type: 'array',
          array: dist.map((d, i) => d === Infinity ? -1 : d),
          highlights: { [u]: 'active' },
          labels: Object.fromEntries(dist.map((d, i) => [i, d === Infinity ? 'INF' : `d[${i}]=${d}`])),
        } as ArrayVisualization,
      });

      for (const [v, cnt] of g[u]) {
        const nd = dist[u] + cnt + 1;
        if (nd < dist[v]) {
          dist[v] = nd;
          steps.push({
            line: 4,
            explanation: `Relax edge ${u}->${v} (${cnt} sub-nodes). New dist[${v}] = ${nd}.`,
            variables: { from: u, to: v, subNodes: cnt, newDist: nd },
            visualization: {
              type: 'array',
              array: dist.map((d, i) => d === Infinity ? -1 : d),
              highlights: { [u]: 'active', [v]: 'comparing' },
              labels: Object.fromEntries(dist.map((d, i) => [i, d === Infinity ? 'INF' : `${d}`])),
            } as ArrayVisualization,
          });
        }
      }
    }

    const reachableOriginal = dist.filter(d => d <= maxMoves).length;
    steps.push({
      line: 6,
      explanation: `Reachable original nodes (dist <= ${maxMoves}): ${dist.map((d, i) => d <= maxMoves ? i : -1).filter(i => i >= 0).join(', ')}. Count = ${reachableOriginal}.`,
      variables: { reachableOriginal, dists: [...dist] },
      visualization: {
        type: 'array',
        array: dist.map((d, i) => d === Infinity ? -1 : d),
        highlights: Object.fromEntries(dist.map((d, i) => [i, d <= maxMoves ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(dist.map((d, i) => [i, d === Infinity ? 'INF' : String(d)])),
      } as ArrayVisualization,
    });

    let result = reachableOriginal;
    for (const [u, v, cnt] of edges) {
      const fromU = Math.max(0, maxMoves - dist[u]);
      const fromV = Math.max(0, maxMoves - dist[v]);
      const subReachable = Math.min(cnt, fromU + fromV);
      result += subReachable;
      steps.push({
        line: 7,
        explanation: `Edge ${u}-${v} with ${cnt} sub-nodes. From U: ${fromU}, From V: ${fromV}. Reachable sub-nodes = min(${cnt}, ${fromU + fromV}) = ${subReachable}.`,
        variables: { u, v, cnt, fromU, fromV, subReachable, totalSoFar: result },
        visualization: {
          type: 'array',
          array: [fromU, fromV, subReachable],
          highlights: { 0: 'active', 1: 'active', 2: 'found' },
          labels: { 0: `fromU=${fromU}`, 1: `fromV=${fromV}`, 2: `reach=${subReachable}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Total reachable nodes (original + sub-nodes) = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [result],
        highlights: { 0: 'found' },
        labels: { 0: `result=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default reachableNodesFromSubdivisions;
