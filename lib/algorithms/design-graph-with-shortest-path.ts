import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designGraphWithShortestPath: AlgorithmDefinition = {
  id: 'design-graph-with-shortest-path',
  title: 'Design Graph With Shortest Path Calculator',
  leetcodeNumber: 2642,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Design a graph class that supports adding directed weighted edges and querying shortest paths. Each query uses Dijkstra algorithm on the current state of the graph. The graph supports dynamic edge addition with addEdge and shortest path queries with shortestPath.',
  tags: ['graph', 'dijkstra', 'design', 'heap', 'shortest path'],

  code: {
    pseudocode: `class Graph:
  __init__(n, edges):
    build adjacency list from edges
  addEdge(edge):
    graph[edge[0]].append((edge[1], edge[2]))
  shortestPath(node1, node2):
    dist = array of INF, dist[node1] = 0
    minHeap = [(0, node1)]
    while heap not empty:
      d, u = pop min
      if u == node2: return d
      if d > dist[u]: continue
      for v, w in graph[u]:
        if dist[u]+w < dist[v]:
          dist[v] = dist[u]+w
          push (dist[v], v) to heap
    return -1`,

    python: `import heapq
class Graph:
    def __init__(self, n, edges):
        self.graph = [[] for _ in range(n)]
        for u, v, w in edges:
            self.graph[u].append((v, w))
    def addEdge(self, edge):
        self.graph[edge[0]].append((edge[1], edge[2]))
    def shortestPath(self, node1, node2):
        n = len(self.graph)
        dist = [float('inf')] * n
        dist[node1] = 0
        heap = [(0, node1)]
        while heap:
            d, u = heapq.heappop(heap)
            if u == node2: return d
            if d > dist[u]: continue
            for v, w in self.graph[u]:
                if dist[u]+w < dist[v]:
                    dist[v] = dist[u]+w
                    heapq.heappush(heap, (dist[v], v))
        return -1`,

    javascript: `class Graph {
  constructor(n, edges) {
    this.graph = Array.from({length:n}, ()=>[]);
    for (const [u,v,w] of edges) this.graph[u].push([v,w]);
  }
  addEdge([u,v,w]) { this.graph[u].push([v,w]); }
  shortestPath(node1, node2) {
    const n = this.graph.length;
    const dist = new Array(n).fill(Infinity);
    dist[node1] = 0;
    const heap = [[0, node1]];
    while (heap.length) {
      heap.sort((a,b)=>a[0]-b[0]);
      const [d,u] = heap.shift();
      if (u===node2) return d;
      if (d>dist[u]) continue;
      for (const [v,w] of this.graph[u]) {
        if (dist[u]+w<dist[v]) {
          dist[v]=dist[u]+w;
          heap.push([dist[v],v]);
        }
      }
    }
    return -1;
  }
}`,

    java: `class Graph {
    private List<int[]>[] graph;
    public Graph(int n, int[][] edges) {
        graph = new List[n];
        for (int i=0;i<n;i++) graph[i]=new ArrayList<>();
        for (int[] e:edges) graph[e[0]].add(new int[]{e[1],e[2]});
    }
    public void addEdge(int[] edge) { graph[edge[0]].add(new int[]{edge[1],edge[2]}); }
    public int shortestPath(int node1, int node2) {
        int n=graph.length;
        int[] dist=new int[n]; Arrays.fill(dist,Integer.MAX_VALUE);
        dist[node1]=0;
        PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
        pq.offer(new int[]{0,node1});
        while (!pq.isEmpty()) {
            int[] cur=pq.poll();
            if (cur[1]==node2) return cur[0];
            if (cur[0]>dist[cur[1]]) continue;
            for (int[] nb:graph[cur[1]]) {
                int nd=dist[cur[1]]+nb[1];
                if (nd<dist[nb[0]]) { dist[nb[0]]=nd; pq.offer(new int[]{nd,nb[0]}); }
            }
        }
        return -1;
    }
}`,
  },

  defaultInput: {
    n: 5,
    edges: [[0,1,2],[0,2,4],[1,3,1],[2,3,1],[3,4,3]],
    queryNode1: 0,
    queryNode2: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total number of nodes',
    },
    {
      name: 'queryNode1',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Start of shortest path query',
    },
    {
      name: 'queryNode2',
      label: 'Target Node',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'End of shortest path query',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const node1 = input.queryNode1 as number;
    const node2 = input.queryNode2 as number;
    const steps: AlgorithmStep[] = [];

    // Build graph
    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      graph[u].push([v, w]);
    }

    steps.push({
      line: 2,
      explanation: `Graph initialized with ${n} nodes and ${edges.length} directed edges. Running shortestPath(${node1}, ${node2}).`,
      variables: { n, edgeCount: edges.length, from: node1, to: node2 },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: { [node1]: 'active', [node2]: 'pointer' },
        labels: { [node1]: 'src', [node2]: 'dst' },
      },
    });

    // Dijkstra
    const INF = 10000;
    const dist = new Array(n).fill(INF);
    dist[node1] = 0;
    const heap: Array<[number, number]> = [[0, node1]];

    steps.push({
      line: 6,
      explanation: `Dijkstra init: dist[${node1}] = 0, all others = INF.`,
      variables: { dist: dist.map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: { [node1]: 'active' },
        labels: { [node1]: 'src=0' },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 20) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [d, u] = heap.shift()!;

      steps.push({
        line: 9,
        explanation: `Pop node ${u} with dist ${d}. Exploring neighbors.`,
        variables: { node: u, dist: d },
        visualization: {
          type: 'array',
          array: dist.map(d2 => (d2 === INF ? 999 : d2)),
          highlights: { [u]: 'active', [node2]: 'pointer' },
          labels: { [u]: 'cur', [node2]: 'dst' },
        },
      });

      if (u === node2) {
        steps.push({
          line: 10,
          explanation: `Reached destination node ${node2}. Shortest path = ${d}.`,
          variables: { result: d },
          visualization: {
            type: 'array',
            array: dist.map(d2 => (d2 === INF ? 999 : d2)),
            highlights: { [node1]: 'found', [node2]: 'found' },
            labels: { [node1]: 'src', [node2]: `dist=${d}` },
          },
        });
        break;
      }

      if (d > dist[u]) continue;

      for (const [v, w] of graph[u]) {
        const newDist = dist[u] + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          heap.push([newDist, v]);
          steps.push({
            line: 14,
            explanation: `Relax edge ${u} -> ${v}: dist ${dist[u]} + weight ${w} = ${newDist} < ${dist[v] === INF ? 'INF' : dist[v]}. Update dist[${v}] = ${newDist}.`,
            variables: { from: u, to: v, weight: w, newDist },
            visualization: {
              type: 'array',
              array: dist.map(d2 => (d2 === INF ? 999 : d2)),
              highlights: { [u]: 'active', [v]: 'comparing' },
              labels: { [u]: 'cur', [v]: `=${newDist}` },
            },
          });
        }
      }
    }

    return steps;
  },
};

export default designGraphWithShortestPath;
