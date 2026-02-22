import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSpanningTreeKruskal: AlgorithmDefinition = {
  id: 'minimum-spanning-tree-kruskal',
  title: "Kruskal's Minimum Spanning Tree",
  difficulty: 'Medium',
  category: 'Graph',
  description:
    "Kruskal's algorithm finds the Minimum Spanning Tree of an undirected weighted graph by sorting all edges by weight and greedily adding edges that do not form a cycle. Uses Union-Find to detect cycles efficiently.",
  tags: ['Graph', 'MST', 'Union-Find', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function kruskalMST(n, edges):
  sort edges by weight ascending
  parent = [0..n-1], rank = [0..0]
  mstCost = 0, mstEdges = []
  function find(x): path-compressed find
  function union(x, y): union by rank
  for each (u, v, w) in sorted edges:
    if find(u) != find(v):
      union(u, v)
      mstEdges.append((u, v, w))
      mstCost += w
      if len(mstEdges) == n-1: break
  return mstCost, mstEdges`,
    python: `def kruskalMST(n, edges):
    edges.sort(key=lambda e: e[2])
    parent = list(range(n))
    rank = [0] * n
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        px, py = find(x), find(y)
        if px == py: return False
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
        return True
    mst_cost = 0
    mst_edges = []
    for u, v, w in edges:
        if union(u, v):
            mst_edges.append((u, v, w))
            mst_cost += w
            if len(mst_edges) == n - 1:
                break
    return mst_cost`,
    javascript: `function kruskalMST(n, edges) {
  edges.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({length: n}, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    let px = find(x), py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) [px, py] = [py, px];
    parent[py] = px;
    if (rank[px] === rank[py]) rank[px]++;
    return true;
  }
  let mstCost = 0;
  const mstEdges = [];
  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      mstEdges.push([u, v, w]);
      mstCost += w;
      if (mstEdges.length === n - 1) break;
    }
  }
  return mstCost;
}`,
    java: `public int kruskalMST(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    int[] parent = new int[n], rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int mstCost = 0, count = 0;
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu != pv) {
            if (rank[pu] < rank[pv]) { int t=pu; pu=pv; pv=t; }
            parent[pv] = pu;
            if (rank[pu] == rank[pv]) rank[pu]++;
            mstCost += e[2];
            if (++count == n - 1) break;
        }
    }
    return mstCost;
}
private int find(int[] p, int x) {
    if (p[x] != x) p[x] = find(p, p[x]);
    return p[x];
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
      helperText: 'Nodes are labeled 0 to n-1',
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
    const rawEdges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const edges = [...rawEdges].sort((a, b) => a[2] - b[2]);
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    const mstEdges: number[][] = [];
    let mstCost = 0;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: string
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...parent],
        highlights,
        labels,
        auxData: {
          label: "Kruskal's MST",
          entries: [
            { key: 'MST Cost', value: String(mstCost) },
            { key: 'MST Edges', value: mstEdges.length > 0 ? mstEdges.map(e => `(${e[0]}-${e[1]}:${e[2]})`).join(', ') : 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    const nodeLabels = () => {
      const l: Record<number, string> = {};
      for (let i = 0; i < n; i++) l[i] = `p[${i}]=${parent[i]}`;
      return l;
    };

    steps.push({
      line: 1,
      explanation: `Initialize Kruskal's. Sort ${edges.length} edges by weight. Each node is its own component.`,
      variables: { n, edgesCount: edges.length, sortedWeights: edges.map(e => e[2]) },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        nodeLabels(),
        'Sorted edges ready'
      ),
    });

    for (let idx = 0; idx < edges.length; idx++) {
      const [u, v, w] = edges[idx];
      const pu = find(u);
      const pv = find(v);

      if (pu === pv) {
        steps.push({
          line: 7,
          explanation: `Edge (${u}-${v}, w=${w}): find(${u})=find(${v})=${pu}. Same component — skip to avoid cycle.`,
          variables: { u, v, w, pu, pv, mstCost },
          visualization: makeViz(
            { [u]: 'mismatch', [v]: 'mismatch' },
            nodeLabels(),
            `Skip edge ${u}-${v}`
          ),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Edge (${u}-${v}, w=${w}): find(${u})=${pu} ≠ find(${v})=${pv}. Different components — add to MST.`,
          variables: { u, v, w, pu, pv },
          visualization: makeViz(
            { [u]: 'active', [v]: 'active', [pu]: 'comparing', [pv]: 'comparing' },
            nodeLabels(),
            `Adding edge ${u}-${v}`
          ),
        });

        let rpx = pu, rpy = pv;
        if (rank[rpx] < rank[rpy]) { const tmp = rpx; rpx = rpy; rpy = tmp; }
        parent[rpy] = rpx;
        if (rank[rpx] === rank[rpy]) rank[rpx]++;
        mstEdges.push([u, v, w]);
        mstCost += w;

        steps.push({
          line: 9,
          explanation: `Union(${u}, ${v}): parent[${rpy}]=${rpx}. MST cost now ${mstCost}. MST edges: ${mstEdges.length}/${n - 1}.`,
          variables: { parent: [...parent], mstCost, mstEdgesCount: mstEdges.length },
          visualization: makeViz(
            { [rpx]: 'found', [rpy]: 'pointer' },
            nodeLabels(),
            `MST edges: ${mstEdges.length}`
          ),
        });

        if (mstEdges.length === n - 1) break;
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 11,
      explanation: `Kruskal's complete. MST total cost = ${mstCost} using ${mstEdges.length} edges.`,
      variables: { mstCost, mstEdges },
      visualization: makeViz(finalH, nodeLabels(), `Total MST cost: ${mstCost}`),
    });

    return steps;
  },
};

export default minimumSpanningTreeKruskal;
