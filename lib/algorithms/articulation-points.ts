import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const articulationPoints: AlgorithmDefinition = {
  id: 'articulation-points',
  title: 'Articulation Points in Graph',
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'An articulation point (cut vertex) is a node whose removal disconnects the graph. Found using DFS with discovery time and low-link values. A node u is an articulation point if it has a child v with low[v] >= disc[u] (or u is root with 2+ children).',
  tags: ['articulation points', 'cut vertices', 'DFS', 'bridge finding', 'graph'],

  code: {
    pseudocode: `function articulationPoints(V, adj):
  disc = [-1]*V, low = [0]*V
  parent = [-1]*V, isAP = [false]*V
  timer = 0
  function dfs(u):
    disc[u] = low[u] = timer++
    children = 0
    for each v in adj[u]:
      if disc[v] == -1:
        children++, parent[v] = u
        dfs(v)
        low[u] = min(low[u], low[v])
        if parent[u]==-1 and children>1: isAP[u]=true
        if parent[u]!=-1 and low[v]>=disc[u]: isAP[u]=true
      elif v != parent[u]:
        low[u] = min(low[u], disc[v])
  for each u: if disc[u]==-1: dfs(u)
  return isAP`,

    python: `def articulation_points(V, adj):
    disc = [-1] * V
    low = [0] * V
    parent = [-1] * V
    is_ap = [False] * V
    timer = [0]
    def dfs(u):
        disc[u] = low[u] = timer[0]; timer[0] += 1
        children = 0
        for v in adj[u]:
            if disc[v] == -1:
                children += 1; parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])
                if parent[u] == -1 and children > 1: is_ap[u] = True
                if parent[u] != -1 and low[v] >= disc[u]: is_ap[u] = True
            elif v != parent[u]:
                low[u] = min(low[u], disc[v])
    for u in range(V):
        if disc[u] == -1: dfs(u)
    return [u for u in range(V) if is_ap[u]]`,

    javascript: `function articulationPoints(V, adj) {
  const disc = new Array(V).fill(-1);
  const low = new Array(V).fill(0);
  const parent = new Array(V).fill(-1);
  const isAP = new Array(V).fill(false);
  let timer = 0;
  function dfs(u) {
    disc[u] = low[u] = timer++;
    let children = 0;
    for (const v of adj[u]) {
      if (disc[v] === -1) {
        children++; parent[v] = u;
        dfs(v);
        low[u] = Math.min(low[u], low[v]);
        if (parent[u] === -1 && children > 1) isAP[u] = true;
        if (parent[u] !== -1 && low[v] >= disc[u]) isAP[u] = true;
      } else if (v !== parent[u]) {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  }
  for (let u = 0; u < V; u++) if (disc[u] === -1) dfs(u);
  return isAP.map((ap, i) => ap ? i : -1).filter(i => i !== -1);
}`,

    java: `public List<Integer> articulationPoints(int V, List<List<Integer>> adj) {
    int[] disc = new int[V], low = new int[V], parent = new int[V];
    boolean[] isAP = new boolean[V];
    Arrays.fill(disc, -1); Arrays.fill(parent, -1);
    int[] timer = {0};
    for (int u = 0; u < V; u++)
        if (disc[u] == -1) dfs(u, adj, disc, low, parent, isAP, timer);
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < V; i++) if (isAP[i]) result.add(i);
    return result;
}`,
  },

  defaultInput: {
    V: 7,
    edges: [0, 1, 1, 2, 2, 0, 1, 3, 3, 4, 4, 5, 5, 3, 3, 6],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
    },
    {
      name: 'edges',
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 2, 0, 1, 3, 3, 4, 4, 5, 5, 3, 3, 6],
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
    const isAP: boolean[] = new Array(V).fill(false);
    let timer = 0;

    const makeViz = (active: number): ArrayVisualization => ({
      type: 'array',
      array: low.slice(),
      highlights: Object.fromEntries(
        Array.from({ length: V }, (_, i) => [
          i,
          isAP[i] ? 'found' : i === active ? 'active' : disc[i] >= 0 ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(Array.from({ length: V }, (_, i) => [i, `v${i}`])),
    });

    function dfs(u: number) {
      disc[u] = low[u] = timer++;
      let children = 0;

      steps.push({
        line: 6,
        explanation: `DFS at vertex ${u}: disc=${disc[u]}, low=${low[u]}.`,
        variables: { u, disc: disc[u], low: low[u] },
        visualization: makeViz(u),
      });

      for (const v of adj[u]) {
        if (disc[v] === -1) {
          children++;
          parent[v] = u;
          dfs(v);
          low[u] = Math.min(low[u], low[v]);

          if (parent[u] === -1 && children > 1) {
            isAP[u] = true;
            steps.push({
              line: 12,
              explanation: `Root ${u} has ${children} children => articulation point.`,
              variables: { u, children },
              visualization: makeViz(u),
            });
          }
          if (parent[u] !== -1 && low[v] >= disc[u]) {
            isAP[u] = true;
            steps.push({
              line: 13,
              explanation: `low[${v}]=${low[v]} >= disc[${u}]=${disc[u]} => vertex ${u} is an articulation point.`,
              variables: { u, v, 'low[v]': low[v], 'disc[u]': disc[u] },
              visualization: makeViz(u),
            });
          }
        } else if (v !== parent[u]) {
          low[u] = Math.min(low[u], disc[v]);
          steps.push({
            line: 15,
            explanation: `Back edge ${u}->${v}. low[${u}] = min(low[${u}], disc[${v}]) = ${low[u]}.`,
            variables: { u, v, 'low[u]': low[u] },
            visualization: makeViz(u),
          });
        }
      }
    }

    steps.push({
      line: 1,
      explanation: `Find articulation points in graph with ${V} vertices.`,
      variables: { V },
      visualization: makeViz(-1),
    });

    for (let u = 0; u < V; u++) {
      if (disc[u] === -1) dfs(u);
    }

    const aps = Array.from({ length: V }, (_, i) => i).filter(i => isAP[i]);
    steps.push({
      line: 16,
      explanation: `Articulation points found: [${aps.join(', ')}].`,
      variables: { articulationPoints: aps },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default articulationPoints;
