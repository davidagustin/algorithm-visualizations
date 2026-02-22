import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfConnectedComponentsII: AlgorithmDefinition = {
  id: 'number-of-connected-components-ii',
  title: 'Number of Connected Components in Undirected Graph II',
  leetcodeNumber: 323,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes (0 to n-1) and a list of undirected edges, count the number of connected components. Uses Union-Find with path compression and union by rank for O(α(n)) per operation.',
  tags: ['Graph', 'Union-Find', 'DFS'],
  code: {
    pseudocode: `function countComponents(n, edges):
  parent = [0..n-1], rank = [0..0]
  components = n
  function find(x): path-compressed
  function union(x, y):
    px, py = find(x), find(y)
    if px == py: return
    union by rank
    components--
  for (u, v) in edges: union(u, v)
  return components`,
    python: `def countComponents(n, edges):
    parent = list(range(n))
    rank = [0] * n
    components = n
    def find(x):
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        nonlocal components
        px, py = find(x), find(y)
        if px == py: return
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
        components -= 1
    for u, v in edges: union(u, v)
    return components`,
    javascript: `function countComponents(n, edges) {
  const parent = Array.from({length: n}, (_, i) => i);
  const rank = new Array(n).fill(0);
  let components = n;
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    let px = find(x), py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) [px, py] = [py, px];
    parent[py] = px;
    if (rank[px] === rank[py]) rank[px]++;
    components--;
  }
  for (const [u, v] of edges) union(u, v);
  return components;
}`,
    java: `public int countComponents(int n, int[][] edges) {
    int[] parent = new int[n], rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int[] comp = {n};
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu != pv) {
            if (rank[pu] < rank[pv]) { int t=pu; pu=pv; pv=t; }
            parent[pv] = pu;
            if (rank[pu] == rank[pv]) rank[pu]++;
            comp[0]--;
        }
    }
    return comp[0];
}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0,1],[1,2],[3,4]],
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
      label: 'Edges [u, v]',
      type: 'array',
      defaultValue: [[0,1],[1,2],[3,4]],
      placeholder: '[[0,1],[1,2]]',
      helperText: 'Undirected edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    let components = n;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      const roots = new Set<number>();
      for (let i = 0; i < n; i++) roots.add(find(i));
      return {
        type: 'array',
        array: [...parent],
        highlights,
        labels: Object.fromEntries(parent.map((p, i) => [i, `p[${i}]=${p}`])),
        auxData: {
          label: 'Connected Components (Union-Find)',
          entries: [
            { key: 'Components', value: String(components) },
            { key: 'Roots', value: [...roots].sort((a, b) => a - b).join(', ') },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize ${n} nodes each as separate component. Total components = ${n}.`,
      variables: { n, edgeCount: edges.length, components },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        `${n} components initially`
      ),
    });

    for (const [u, v] of edges) {
      const pu = find(u);
      const pv = find(v);

      if (pu === pv) {
        steps.push({
          line: 9,
          explanation: `Edge (${u}-${v}): Already same component (root ${pu}). Components = ${components}.`,
          variables: { u, v, root: pu, components },
          visualization: makeViz({ [u]: 'visited', [v]: 'visited' }, 'Same component — no change'),
        });
      } else {
        let rpx = pu, rpy = pv;
        if (rank[rpx] < rank[rpy]) { const tmp = rpx; rpx = rpy; rpy = tmp; }
        parent[rpy] = rpx;
        if (rank[rpx] === rank[rpy]) rank[rpx]++;
        components--;

        steps.push({
          line: 7,
          explanation: `Edge (${u}-${v}): Merge components with roots ${pu} and ${pv}. Components now = ${components}.`,
          variables: { u, v, pu, pv, components, parent: [...parent] },
          visualization: makeViz({ [u]: 'active', [v]: 'active', [rpx]: 'found', [rpy]: 'pointer' }, `Merged → ${components} components`),
        });
      }
    }

    const finalH: Record<number, string> = {};
    const colorMap: Record<number, string> = {};
    const colorList = ['found', 'pointer', 'active', 'comparing', 'sorted'];
    const roots = new Set<number>();
    for (let i = 0; i < n; i++) roots.add(find(i));
    const rootList = [...roots];
    for (let i = 0; i < n; i++) {
      const r = find(i);
      colorMap[r] = colorMap[r] ?? colorList[rootList.indexOf(r) % colorList.length];
      finalH[i] = colorMap[r];
    }

    steps.push({
      line: 10,
      explanation: `Done. Total connected components = ${components}.`,
      variables: { result: components },
      visualization: makeViz(finalH, `Result: ${components} components`),
    });

    return steps;
  },
};

export default numberOfConnectedComponentsII;
