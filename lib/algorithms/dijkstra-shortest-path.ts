import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const dijkstraShortestPath: AlgorithmDefinition = {
  id: 'dijkstra-shortest-path',
  title: 'Dijkstra Shortest Path (Classic)',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Classic Dijkstra algorithm for finding single-source shortest paths in a weighted graph with non-negative edge weights. Uses a min-heap (priority queue) to always process the closest unvisited node. Time complexity O((V+E) log V).',
  tags: ['graph', 'dijkstra', 'shortest path', 'greedy', 'priority queue', 'classic'],

  code: {
    pseudocode: `function dijkstra(graph, source):
  dist = array of INF, dist[source] = 0
  visited = empty set
  minHeap = [(0, source)]
  while minHeap not empty:
    d, u = pop minimum from heap
    if u in visited: continue
    visited.add(u)
    for each neighbor v, weight w of u:
      if dist[u] + w < dist[v]:
        dist[v] = dist[u] + w
        push (dist[v], v) to heap
  return dist`,

    python: `import heapq
def dijkstra(graph, source, n):
    dist = [float('inf')] * n
    dist[source] = 0
    heap = [(0, source)]
    visited = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in visited: continue
        visited.add(u)
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist`,

    javascript: `function dijkstra(graph, source, n) {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  const heap = [[0, source]];
  const visited = new Set();
  while (heap.length) {
    heap.sort((a, b) => a[0] - b[0]);
    const [d, u] = heap.shift();
    if (visited.has(u)) continue;
    visited.add(u);
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        heap.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,

    java: `public int[] dijkstra(List<int[]>[] graph, int source, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;
    boolean[] visited = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, source});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[1];
        if (visited[u]) continue;
        visited[u] = true;
        for (int[] nb : graph[u]) {
            if (dist[u]+nb[1] < dist[nb[0]]) {
                dist[nb[0]] = dist[u]+nb[1];
                pq.offer(new int[]{dist[nb[0]], nb[0]});
            }
        }
    }
    return dist;
}`,
  },

  defaultInput: {
    n: 6,
    edges: [[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,4,5],[3,4,3],[3,5,2],[4,5,1]],
    source: 0,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Total nodes in the graph',
    },
    {
      name: 'source',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting node for shortest paths',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const source = input.source as number;
    const steps: AlgorithmStep[] = [];

    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      graph[u].push([v, w]);
      graph[v].push([u, w]);
    }

    const INF = 100000;
    const dist = new Array(n).fill(INF);
    dist[source] = 0;
    const visited = new Set<number>();
    const heap: Array<[number, number]> = [[0, source]];

    steps.push({
      line: 2,
      explanation: `Initialize: dist[${source}]=0, all others=INF. Start Dijkstra from node ${source}.`,
      variables: { source, dist: dist.map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: { [source]: 'active' },
        labels: { [source]: 'src=0' },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 25) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [d, u] = heap.shift()!;

      if (visited.has(u)) {
        steps.push({
          line: 6,
          explanation: `Node ${u} already visited. Skip stale heap entry.`,
          variables: { node: u, staleDist: d },
          visualization: {
            type: 'array',
            array: dist.map(d2 => (d2 === INF ? 999 : d2)),
            highlights: { [u]: 'mismatch' },
            labels: { [u]: 'skip' },
          },
        });
        continue;
      }

      visited.add(u);

      steps.push({
        line: 7,
        explanation: `Visit node ${u} with shortest distance ${d}. Mark as visited.`,
        variables: { node: u, distance: d, visited: [...visited].join(', ') },
        visualization: {
          type: 'array',
          array: dist.map(d2 => (d2 === INF ? 999 : d2)),
          highlights: { [u]: 'sorted', ...Object.fromEntries([...visited].filter(v => v !== u).map(v => [v, 'visited'])) },
          labels: { [u]: `d=${d}` },
        },
      });

      for (const [v, w] of graph[u]) {
        const newDist = dist[u] + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          heap.push([newDist, v]);
          steps.push({
            line: 10,
            explanation: `Relax edge ${u}->${v}: ${d}+${w}=${newDist} < ${dist[v] === newDist ? 'prev' : dist[v]}. Push (${newDist}, ${v}) to heap.`,
            variables: { from: u, to: v, weight: w, newDist },
            visualization: {
              type: 'array',
              array: dist.map(d2 => (d2 === INF ? 999 : d2)),
              highlights: { [u]: 'sorted', [v]: 'comparing' },
              labels: { [v]: `=${newDist}` },
            },
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Dijkstra complete. Shortest distances from node ${source}: [${dist.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { result: dist.map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: Object.fromEntries(dist.map((d, i) => [i, d < INF ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(dist.map((d, i) => [i, d < INF ? `d=${d}` : 'unreachable'])),
      },
    });

    return steps;
  },
};

export default dijkstraShortestPath;
