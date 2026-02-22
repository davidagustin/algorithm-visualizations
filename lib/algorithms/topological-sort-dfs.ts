import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const topologicalSortDfs: AlgorithmDefinition = {
  id: 'topological-sort-dfs',
  title: 'Topological Sort (DFS)',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'DFS-based topological sort visits each unvisited node, recursively visits all descendants, then pushes the current node onto a stack. Reversing the stack gives a valid topological ordering. Cycle detection uses a recursion-stack color set.',
  tags: ['topological sort', 'DFS', 'DAG', 'recursion', 'graph'],

  code: {
    pseudocode: `function topoSortDFS(V, adj):
  visited = [false] * V
  stack = []
  function dfs(u):
    visited[u] = true
    for each v in adj[u]:
      if not visited[v]:
        dfs(v)
    stack.append(u)
  for each u in 0..V-1:
    if not visited[u]: dfs(u)
  return reverse(stack)`,

    python: `def topo_sort_dfs(V, adj):
    visited = [False] * V
    stack = []
    def dfs(u):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                dfs(v)
        stack.append(u)
    for u in range(V):
        if not visited[u]:
            dfs(u)
    return stack[::-1]`,

    javascript: `function topoSortDFS(V, adj) {
  const visited = new Array(V).fill(false);
  const stack = [];
  function dfs(u) {
    visited[u] = true;
    for (const v of adj[u]) {
      if (!visited[v]) dfs(v);
    }
    stack.push(u);
  }
  for (let u = 0; u < V; u++) {
    if (!visited[u]) dfs(u);
  }
  return stack.reverse();
}`,

    java: `public int[] topoSortDFS(int V, List<List<Integer>> adj) {
    boolean[] visited = new boolean[V];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int u = 0; u < V; u++)
        if (!visited[u]) dfs(u, adj, visited, stack);
    int[] result = new int[V];
    for (int i = 0; i < V; i++) result[i] = stack.pop();
    return result;
}
void dfs(int u, List<List<Integer>> adj, boolean[] vis, Deque<Integer> stk) {
    vis[u] = true;
    for (int v : adj.get(u)) if (!vis[v]) dfs(v, adj, vis, stk);
    stk.push(u);
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

    const visited: boolean[] = new Array(V).fill(false);
    const stack: number[] = [];
    const visitOrder: number[] = [];

    const makeViz = (currentNode: number): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: V }, (_, i) => i),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          i === currentNode ? 'active' : stack.includes(i) ? 'sorted' : visited[i] ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
    });

    function dfs(u: number) {
      visited[u] = true;
      visitOrder.push(u);

      steps.push({
        line: 5,
        explanation: `DFS visit vertex ${u}. Exploring neighbors: [${adj[u].join(', ')}].`,
        variables: { currentNode: u, visitOrder: [...visitOrder] },
        visualization: makeViz(u),
      });

      for (const v of adj[u]) {
        if (!visited[v]) {
          steps.push({
            line: 6,
            explanation: `Vertex ${u}: neighbor ${v} not yet visited. Recurse into ${v}.`,
            variables: { u, v },
            visualization: makeViz(v),
          });
          dfs(v);
        }
      }

      stack.push(u);
      steps.push({
        line: 8,
        explanation: `All neighbors of ${u} processed. Push ${u} to stack. Stack: [${stack.join(', ')}].`,
        variables: { u, stack: [...stack] },
        visualization: makeViz(u),
      });
    }

    steps.push({
      line: 1,
      explanation: `Starting DFS topological sort on ${V} vertices.`,
      variables: { V },
      visualization: makeViz(-1),
    });

    for (let u = 0; u < V; u++) {
      if (!visited[u]) {
        steps.push({
          line: 10,
          explanation: `Vertex ${u} not visited. Start DFS from ${u}.`,
          variables: { u },
          visualization: makeViz(u),
        });
        dfs(u);
      }
    }

    const result = [...stack].reverse();
    steps.push({
      line: 11,
      explanation: `DFS complete. Reverse stack = topological order: [${result.join(', ')}].`,
      variables: { topologicalOrder: result },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(result.map((v, i) => [i, `v${v}`])),
      },
    });

    return steps;
  },
};

export default topologicalSortDfs;
