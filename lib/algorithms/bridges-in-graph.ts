import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bridgesInGraph: AlgorithmDefinition = {
  id: 'bridges-in-graph',
  title: 'Bridges in Graph (Critical Connections)',
  leetcodeNumber: 1192,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'A bridge is an edge whose removal increases the number of connected components. Found using DFS with discovery time and low-link values. Edge (u,v) is a bridge if low[v] > disc[u], meaning there is no back edge from the subtree rooted at v back to u or its ancestors.',
  tags: ['bridges', 'critical connections', 'DFS', 'low-link', 'graph'],

  code: {
    pseudocode: `function findBridges(V, adj):
  disc = [-1]*V, low = [0]*V
  parent = [-1]*V, bridges = []
  timer = 0
  function dfs(u):
    disc[u] = low[u] = timer++
    for each v in adj[u]:
      if disc[v] == -1:
        parent[v] = u
        dfs(v)
        low[u] = min(low[u], low[v])
        if low[v] > disc[u]:
          bridges.add((u, v))
      elif v != parent[u]:
        low[u] = min(low[u], disc[v])
  for each u: if disc[u]==-1: dfs(u)
  return bridges`,

    python: `def find_bridges(V, adj):
    disc = [-1] * V
    low = [0] * V
    parent = [-1] * V
    bridges = []
    timer = [0]
    def dfs(u):
        disc[u] = low[u] = timer[0]; timer[0] += 1
        for v in adj[u]:
            if disc[v] == -1:
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                if low[v] > disc[u]:
                    bridges.append((u, v))
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])
    for u in range(V):
        if disc[u] == -1: dfs(u)
    return bridges`,

    javascript: `function findBridges(V, adj) {
  const disc = new Array(V).fill(-1);
  const low = new Array(V).fill(0);
  const parent = new Array(V).fill(-1);
  const bridges = [];
  let timer = 0;
  function dfs(u) {
    disc[u] = low[u] = timer++;
    for (const v of adj[u]) {
      if (disc[v] === -1) {
        parent[v] = u; dfs(v);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) bridges.push([u, v]);
      } else if (v !== parent[u]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  }
  for (let u = 0; u < V; u++) if (disc[u] === -1) dfs(u);
  return bridges;
}`,

    java: `public List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
    int[] disc = new int[n], low = new int[n], parent = new int[n];
    Arrays.fill(disc, -1); Arrays.fill(parent, -1);
    List<List<Integer>>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (List<Integer> c : connections) {
        adj[c.get(0)].add(c.get(1)); adj[c.get(1)].add(c.get(0));
    }
    List<List<Integer>> res = new ArrayList<>();
    int[] timer = {0};
    for (int u = 0; u < n; u++) if (disc[u] == -1) dfs(u, adj, disc, low, parent, timer, res);
    return res;
}`,
  },

  defaultInput: {
    V: 6,
    edges: [0, 1, 1, 2, 2, 0, 1, 3, 3, 4, 4, 5],
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
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 2, 0, 1, 3, 3, 4, 4, 5],
      placeholder: '0,1,1,2,...',
      helperText: 'Flat list of undirected u-v edge pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: V }, () => []);
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) {
      const u = edgeFlat[i], v = edgeFlat[i + 1];
      adj[u].push(v);
      adj[v].push(u);
    }

    const disc: number[] = new Array(V).fill(-1);
    const low: number[] = new Array(V).fill(0);
    const parent: number[] = new Array(V).fill(-1);
    const bridges: [number, number][] = [];
    let timer = 0;

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: low.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          i === active ? 'active' : bridges.some(([u, v]) => u === i || v === i) ? 'found' : disc[i] >= 0 ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `low=${low[i]}`])),
    });

    function dfs(u: number) {
      disc[u] = low[u] = timer++;

      steps.push({
        line: 6,
        explanation: `Visit vertex ${u}: disc[${u}]=low[${u}]=${disc[u]}.`,
        variables: { u, disc: disc[u], low: low[u] },
        visualization: makeViz(u),
      });

      for (const v of adj[u]) {
        if (disc[v] === -1) {
          parent[v] = u;
          dfs(v);
          low[u] = Math.min(low[u], low[v]);

          if (low[v] > disc[u]) {
            bridges.push([u, v]);
            steps.push({
              line: 12,
              explanation: `Bridge found: edge (${u},${v}). low[${v}]=${low[v]} > disc[${u}]=${disc[u]}.`,
              variables: { bridge: `(${u},${v})`, 'low[v]': low[v], 'disc[u]': disc[u] },
              visualization: makeViz(u),
            });
          } else {
            steps.push({
              line: 11,
              explanation: `Edge (${u},${v}): low[${u}] updated to ${low[u]}. Not a bridge (low[${v}]=${low[v]} <= disc[${u}]=${disc[u]}).`,
              variables: { u, v, 'low[u]': low[u] },
              visualization: makeViz(u),
            });
          }
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
          steps.push({
            line: 14,
            explanation: `Back edge ${u}->${v}. low[${u}] = min(low[${u}], disc[${v}]) = ${low[u]}.`,
            variables: { u, v, 'low[u]': low[u] },
            visualization: makeViz(u),
          });
        }
      }
    }

    steps.push({
      line: 1,
      explanation: `Finding bridges in graph with ${V} vertices.`,
      variables: { V },
      visualization: makeViz(-1),
    });

    for (let u = 0; u < V; u++) {
      if (disc[u] === -1) dfs(u);
    }

    steps.push({
      line: 16,
      explanation: `Complete. Bridges found: [${bridges.map(([u, v]) => `(${u},${v})`).join(', ')}].`,
      variables: { bridges: bridges.map(([u, v]) => `${u}-${v}`) },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default bridgesInGraph;
