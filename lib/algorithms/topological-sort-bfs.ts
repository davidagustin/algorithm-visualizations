import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const topologicalSortBfs: AlgorithmDefinition = {
  id: 'topological-sort-bfs',
  title: 'Topological Sort (Kahn BFS)',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Kahn algorithm performs topological sort using BFS. It tracks in-degree of each node, enqueues nodes with zero in-degree, and repeatedly removes them while decrementing neighbor in-degrees. If all nodes are processed, the graph is a DAG.',
  tags: ['topological sort', 'BFS', 'Kahn', 'DAG', 'graph'],

  code: {
    pseudocode: `function kahnTopoSort(V, adj):
  inDegree = count in-degrees for each node
  queue = all nodes with inDegree == 0
  order = []
  while queue not empty:
    u = dequeue(queue)
    order.append(u)
    for each v in adj[u]:
      inDegree[v] -= 1
      if inDegree[v] == 0:
        enqueue(queue, v)
  if len(order) == V: return order
  return [] // cycle detected`,

    python: `from collections import deque
def topo_sort_bfs(V, adj):
    in_deg = [0] * V
    for u in range(V):
        for v in adj[u]:
            in_deg[v] += 1
    q = deque(i for i in range(V) if in_deg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_deg[v] -= 1
            if in_deg[v] == 0:
                q.append(v)
    return order if len(order) == V else []`,

    javascript: `function topoSortBFS(V, adj) {
  const inDeg = new Array(V).fill(0);
  for (let u = 0; u < V; u++)
    for (const v of adj[u]) inDeg[v]++;
  const queue = [];
  for (let i = 0; i < V; i++) if (inDeg[i] === 0) queue.push(i);
  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of adj[u]) {
      inDeg[v]--;
      if (inDeg[v] === 0) queue.push(v);
    }
  }
  return order.length === V ? order : [];
}`,

    java: `public int[] topoSortBFS(int V, List<List<Integer>> adj) {
    int[] inDeg = new int[V];
    for (int u = 0; u < V; u++)
        for (int v : adj.get(u)) inDeg[v]++;
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < V; i++) if (inDeg[i] == 0) q.offer(i);
    int[] order = new int[V];
    int idx = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[idx++] = u;
        for (int v : adj.get(u))
            if (--inDeg[v] == 0) q.offer(v);
    }
    return idx == V ? order : new int[0];
}`,
  },

  defaultInput: {
    V: 6,
    edges: [5, 2, 5, 0, 4, 0, 4, 1, 2, 3, 3, 1],
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
      name: 'edges',
      label: 'Directed Edges (u,v pairs)',
      type: 'array',
      defaultValue: [5, 2, 5, 0, 4, 0, 4, 1, 2, 3, 3, 1],
      placeholder: '5,2,5,0,...',
      helperText: 'Flat list of directed u->v edge pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) {
      adj[edgeFlat[i]].push(edgeFlat[i + 1]);
    }

    const inDeg: number[] = new Array(V).fill(0);
    for (let u = 0; u < V; u++) for (const v of adj[u]) inDeg[v]++;

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...inDeg],
      highlights,
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Compute in-degrees: [${inDeg.join(', ')}].`,
      variables: { inDegree: [...inDeg] },
      visualization: makeViz({}),
    });

    const queue: number[] = [];
    for (let i = 0; i < V; i++) if (inDeg[i] === 0) queue.push(i);

    steps.push({
      line: 3,
      explanation: `Enqueue zero-in-degree nodes: [${queue.join(', ')}].`,
      variables: { queue: [...queue] },
      visualization: makeViz(Object.fromEntries(queue.map(v => [v, 'active']))),
    });

    const order: number[] = [];

    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);

      steps.push({
        line: 5,
        explanation: `Dequeue vertex ${u}. Topological order so far: [${order.join(', ')}].`,
        variables: { u, order: [...order], queue: [...queue] },
        visualization: makeViz({ [u]: 'found', ...Object.fromEntries(order.slice(0, -1).map(v => [v, 'sorted'])) }),
      });

      for (const v of adj[u]) {
        inDeg[v]--;
        if (inDeg[v] === 0) {
          queue.push(v);
          steps.push({
            line: 9,
            explanation: `Decrement in-degree of ${v} to ${inDeg[v]}. Enqueue ${v} (now zero in-degree).`,
            variables: { u, v, 'inDeg[v]': inDeg[v] },
            visualization: makeViz({ [u]: 'sorted', [v]: 'active', ...Object.fromEntries(order.map(x => [x, 'sorted'])) }),
          });
        }
      }
    }

    const isCycle = order.length !== V;
    steps.push({
      line: 11,
      explanation: isCycle
        ? `Cycle detected! Only ${order.length} of ${V} nodes processed.`
        : `Topological sort complete: [${order.join(', ')}].`,
      variables: { order, valid: !isCycle },
      visualization: makeViz(Object.fromEntries(order.map((v, i) => [v, 'sorted']))),
    });

    return steps;
  },
};

export default topologicalSortBfs;
