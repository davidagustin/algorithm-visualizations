import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kruskalsAlgorithm: AlgorithmDefinition = {
  id: 'kruskals-algorithm',
  title: 'Kruskal MST Algorithm',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Kruskal algorithm builds the Minimum Spanning Tree by sorting all edges by weight, then greedily adding the smallest edge that does not form a cycle. Uses Union-Find (Disjoint Set Union) to detect cycles in O(alpha(N)) per operation.',
  tags: ['kruskal', 'minimum spanning tree', 'union-find', 'greedy', 'graph'],

  code: {
    pseudocode: `function kruskal(V, edges):
  sort edges by weight
  parent = [0..V-1], rank = [0..V-1]
  mst = [], totalWeight = 0
  for each edge (u, v, w) in sorted edges:
    if find(u) != find(v):
      union(u, v)
      mst.add(edge)
      totalWeight += w
  return mst, totalWeight`,

    python: `def kruskal(V, edges):
    edges.sort(key=lambda e: e[2])
    parent = list(range(V))
    rank = [0] * V
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(x, y):
        px, py = find(x), find(y)
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
    mst, cost = [], 0
    for u, v, w in edges:
        if find(u) != find(v):
            union(u, v)
            mst.append((u, v, w))
            cost += w
    return mst, cost`,

    javascript: `function kruskal(V, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({length: V}, (_, i) => i);
  const rank = new Array(V).fill(0);
  function find(x) {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(x, y) {
    const px = find(x), py = find(y);
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else { parent[py] = px; rank[px]++; }
  }
  const mst = []; let cost = 0;
  for (const [u, v, w] of edges) {
    if (find(u) !== find(v)) { union(u, v); mst.push([u, v, w]); cost += w; }
  }
  return { mst, cost };
}`,

    java: `public int kruskal(int V, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    int[] parent = new int[V];
    for (int i = 0; i < V; i++) parent[i] = i;
    int cost = 0;
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu != pv) { parent[pu] = pv; cost += e[2]; }
    }
    return cost;
}`,
  },

  defaultInput: {
    V: 5,
    edges: [0, 1, 2, 0, 3, 6, 1, 2, 3, 1, 3, 8, 1, 4, 5, 2, 4, 7, 3, 4, 9],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'edges',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 2, 0, 3, 6, 1, 2, 3, 1, 3, 8, 1, 4, 5, 2, 4, 7, 3, 4, 9],
      placeholder: '0,1,2,0,3,6,...',
      helperText: 'Flat list of u,v,w undirected edge triples',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    let edges: [number, number, number][] = [];
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) {
      edges.push([edgeFlat[i], edgeFlat[i + 1], edgeFlat[i + 2]]);
    }
    edges.sort((a, b) => a[2] - b[2]);

    const parent = Array.from({ length: V }, (_, i) => i);
    const rank = new Array(V).fill(0);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(x: number, y: number) {
      const px = find(x), py = find(y);
      if (rank[px] < rank[py]) parent[px] = py;
      else if (rank[px] > rank[py]) parent[py] = px;
      else { parent[py] = px; rank[px]++; }
    }

    const mstEdges: [number, number, number][] = [];
    let cost = 0;

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: edges.map(e => e[2]),
      highlights,
      labels: Object.fromEntries(edges.map((e, i) => [i, `${e[0]}-${e[1]}`])),
    });

    steps.push({
      line: 2,
      explanation: `Sort ${edges.length} edges by weight: [${edges.map(e => `(${e[0]},${e[1]},${e[2]})`).join(', ')}].`,
      variables: { sortedEdges: edges.map(e => `${e[0]}->${e[1]}:${e[2]}`) },
      visualization: makeViz({}),
    });

    steps.push({
      line: 3,
      explanation: `Initialize Union-Find: parent = [${parent.join(', ')}].`,
      variables: { parent: [...parent] },
      visualization: makeViz({}),
    });

    for (let i = 0; i < edges.length; i++) {
      const [u, v, w] = edges[i];
      const pu = find(u), pv = find(v);

      if (pu !== pv) {
        union(u, v);
        mstEdges.push([u, v, w]);
        cost += w;
        steps.push({
          line: 7,
          explanation: `Add edge (${u},${v},${w}) to MST. Components ${pu} and ${pv} merged. MST cost = ${cost}.`,
          variables: { u, v, w, mstEdges: mstEdges.map(e => `${e[0]}-${e[1]}`), totalCost: cost },
          visualization: makeViz({ [i]: 'found' }),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Skip edge (${u},${v},${w}): both in same component (${pu}). Would form a cycle.`,
          variables: { u, v, w, component: pu },
          visualization: makeViz({ [i]: 'mismatch' }),
        });
      }

      if (mstEdges.length === V - 1) break;
    }

    steps.push({
      line: 9,
      explanation: `Kruskal complete. MST edges: [${mstEdges.map(e => `(${e[0]},${e[1]},${e[2]})`).join(', ')}]. Total weight = ${cost}.`,
      variables: { mstEdgeCount: mstEdges.length, totalWeight: cost },
      visualization: makeViz(
        Object.fromEntries(
          edges.map((e, i) => [i, mstEdges.some(m => m[0] === e[0] && m[1] === e[1]) ? 'sorted' : 'visited'])
        )
      ),
    });

    return steps;
  },
};

export default kruskalsAlgorithm;
