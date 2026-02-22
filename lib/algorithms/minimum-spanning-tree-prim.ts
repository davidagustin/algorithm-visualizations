import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSpanningTreePrim: AlgorithmDefinition = {
  id: 'minimum-spanning-tree-prim',
  title: "Prim's Minimum Spanning Tree",
  difficulty: 'Medium',
  category: 'Graph',
  description:
    "Prim's algorithm builds the Minimum Spanning Tree by growing it one edge at a time. Starting from an arbitrary node, it repeatedly picks the minimum-weight edge that connects a visited node to an unvisited node.",
  tags: ['Graph', 'MST', 'Greedy', 'Heap'],
  code: {
    pseudocode: `function primMST(n, edges):
  build adjacency list from edges
  inMST = [false] * n
  minCost = [Infinity] * n
  minCost[0] = 0
  pq = min-heap with (0, 0)
  total = 0
  while pq not empty:
    (cost, u) = pq.extractMin()
    if inMST[u]: continue
    inMST[u] = true
    total += cost
    for (v, w) in adj[u]:
      if not inMST[v] and w < minCost[v]:
        minCost[v] = w
        pq.push((w, v))
  return total`,
    python: `def primMST(n, edges):
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))
    inMST = [False] * n
    minCost = [float('inf')] * n
    minCost[0] = 0
    pq = [(0, 0)]
    total = 0
    while pq:
        cost, u = heapq.heappop(pq)
        if inMST[u]: continue
        inMST[u] = True
        total += cost
        for v, w in adj[u]:
            if not inMST[v] and w < minCost[v]:
                minCost[v] = w
                heapq.heappush(pq, (w, v))
    return total`,
    javascript: `function primMST(n, edges) {
  const adj = Array.from({length: n}, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }
  const inMST = new Array(n).fill(false);
  const minCost = new Array(n).fill(Infinity);
  minCost[0] = 0;
  const pq = [[0, 0]]; // [cost, node]
  let total = 0;
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, u] = pq.shift();
    if (inMST[u]) continue;
    inMST[u] = true;
    total += cost;
    for (const [v, w] of adj[u]) {
      if (!inMST[v] && w < minCost[v]) {
        minCost[v] = w;
        pq.push([w, v]);
      }
    }
  }
  return total;
}`,
    java: `public int primMST(int n, int[][] edges) {
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] e : edges) {
        adj[e[0]].add(new int[]{e[1], e[2]});
        adj[e[1]].add(new int[]{e[0], e[2]});
    }
    boolean[] inMST = new boolean[n];
    int[] minCost = new int[n];
    Arrays.fill(minCost, Integer.MAX_VALUE);
    minCost[0] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.add(new int[]{0, 0});
    int total = 0;
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int cost = top[0], u = top[1];
        if (inMST[u]) continue;
        inMST[u] = true;
        total += cost;
        for (int[] nb : adj[u])
            if (!inMST[nb[0]] && nb[1] < minCost[nb[0]]) {
                minCost[nb[0]] = nb[1];
                pq.add(new int[]{nb[1], nb[0]});
            }
    }
    return total;
}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0,1,2],[0,3,6],[1,2,3],[1,3,8],[1,4,5],[2,4,7],[3,4,9]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'edges',
      label: 'Edges [u, v, w]',
      type: 'array',
      defaultValue: [[0,1,2],[0,3,6],[1,2,3],[1,3,8],[1,4,5],[2,4,7],[3,4,9]],
      placeholder: '[[0,1,2],[1,2,3]]',
      helperText: 'Undirected weighted edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      adj[u].push([v, w]);
      adj[v].push([u, w]);
    }

    const inMST = new Array(n).fill(false);
    const minCost = new Array(n).fill(Infinity);
    minCost[0] = 0;
    let total = 0;

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: minCost.map(c => c === Infinity ? -1 : c),
        highlights,
        labels: Object.fromEntries(minCost.map((c, i) => [i, `n${i}:${c === Infinity ? 'INF' : c}`])),
        auxData: {
          label: "Prim's MST",
          entries: [
            { key: 'Total MST Cost', value: String(total) },
            { key: 'In MST', value: inMST.map((v, i) => v ? i : null).filter(x => x !== null).join(', ') || 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize Prim's from node 0. minCost[0]=0, all others INF. Array shows min cost to add each node to MST.`,
      variables: { n, minCost: [...minCost] },
      visualization: makeViz({ 0: 'active' }, 'Starting from node 0'),
    });

    const pq: [number, number][] = [[0, 0]];

    while (pq.length > 0) {
      pq.sort((a, b) => a[0] - b[0]);
      const [cost, u] = pq.shift()!;

      if (inMST[u]) continue;
      inMST[u] = true;
      total += cost;

      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) highlights[i] = inMST[i] ? 'sorted' : 'default';

      steps.push({
        line: 8,
        explanation: `Add node ${u} to MST with edge cost ${cost}. Total MST cost = ${total}.`,
        variables: { u, cost, total },
        visualization: makeViz({ ...highlights, [u]: 'found' }, `Added node ${u}, cost=${cost}`),
      });

      for (const [v, w] of adj[u]) {
        if (!inMST[v] && w < minCost[v]) {
          minCost[v] = w;
          pq.push([w, v]);

          const h: Record<number, string> = {};
          for (let i = 0; i < n; i++) h[i] = inMST[i] ? 'sorted' : 'default';
          steps.push({
            line: 14,
            explanation: `Update minCost[${v}] = ${w} (edge from ${u}). Better than previous cost.`,
            variables: { u, v, w, newMinCost: minCost[v] },
            visualization: makeViz({ ...h, [u]: 'found', [v]: 'active' }, `Update node ${v} cost to ${w}`),
          });
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 16,
      explanation: `Prim's complete. Minimum Spanning Tree total cost = ${total}.`,
      variables: { total, minCost: [...minCost] },
      visualization: makeViz(finalH, `MST total cost: ${total}`),
    });

    return steps;
  },
};

export default minimumSpanningTreePrim;
