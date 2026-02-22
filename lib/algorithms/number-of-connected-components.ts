import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfConnectedComponents: AlgorithmDefinition = {
  id: 'number-of-connected-components',
  title: 'Number of Connected Components in Graph',
  leetcodeNumber: 323,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes (0 to n-1) and undirected edges, count the number of connected components. Uses Union-Find: initially each node is its own component, then union connected nodes. The answer equals the number of distinct root nodes remaining.',
  tags: ['Graph', 'Union Find', 'DFS', 'BFS'],
  code: {
    pseudocode: `function countComponents(n, edges):
  parent = [i for i in range(n)]
  rank = [0] * n
  components = n
  def find(x): path compression
  def union(x, y):
    px, py = find(x), find(y)
    if px == py: return
    merge by rank
    components -= 1
  for [u, v] in edges:
    union(u, v)
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
        if rank[px] > rank[py]: parent[py] = px
        elif rank[px] < rank[py]: parent[px] = py
        else: parent[py] = px; rank[px] += 1
        components -= 1
    for u, v in edges:
        union(u, v)
    return components`,
    javascript: `function countComponents(n, edges) {
  const parent = Array.from({length:n},(_,i)=>i), rank=new Array(n).fill(0);
  let components = n;
  const find = x => parent[x]===x?x:(parent[x]=find(parent[x]));
  const union = (x,y) => {
    const [px,py]=[find(x),find(y)];
    if(px===py) return;
    if(rank[px]>rank[py]) parent[py]=px;
    else if(rank[px]<rank[py]) parent[px]=py;
    else { parent[py]=px; rank[px]++; }
    components--;
  };
  for (const [u,v] of edges) union(u,v);
  return components;
}`,
    java: `public int countComponents(int n, int[][] edges) {
    int[] parent=new int[n],rank=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    int[]comp={n};
    for(int[]e:edges){int pu=find(parent,e[0]),pv=find(parent,e[1]);if(pu!=pv){if(rank[pu]>rank[pv])parent[pv]=pu;else if(rank[pu]<rank[pv])parent[pu]=pv;else{parent[pv]=pu;rank[pu]++;}comp[0]--;}}
    return comp[0];
}
int find(int[]p,int x){return p[x]==x?x:(p[x]=find(p,p[x]));}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0, 1], [1, 2], [3, 4]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Nodes labeled 0 to n-1',
    },
    {
      name: 'edges',
      label: 'Edges [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [1, 2], [3, 4]],
      placeholder: '[[0,1],[1,2],[3,4]]',
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

    function union(x: number, y: number): boolean {
      const px = find(x), py = find(y);
      if (px === py) return false;
      if (rank[px] > rank[py]) parent[py] = px;
      else if (rank[px] < rank[py]) parent[px] = py;
      else { parent[py] = px; rank[px]++; }
      components--;
      return true;
    }

    const colorMap = ['found', 'active', 'pointer', 'comparing', 'match', 'sorted'];

    function makeViz(highlights: Record<number, string>, edgeIdx: number): ArrayVisualization {
      const roots = new Map<number, number>();
      let ci = 0;
      for (let i = 0; i < n; i++) {
        const root = find(i);
        if (!roots.has(root)) { roots.set(root, ci++); }
      }
      const base: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        const root = find(i);
        base[i] = colorMap[roots.get(root)! % colorMap.length];
      }
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) labels[i] = `n${i}→r${find(i)}`;
      return {
        type: 'array',
        array: parent.slice(0, n),
        highlights: { ...base, ...highlights },
        labels,
        auxData: {
          label: 'Connected Components',
          entries: [
            { key: 'Edges processed', value: `${edgeIdx} / ${edges.length}` },
            { key: 'Components', value: String(components) },
            { key: 'Roots', value: [...roots.keys()].sort((a, b) => a - b).join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes, ${edges.length} edges. Init: each node is its own component (${n} components). Array shows parent of each node.`,
      variables: { n, components },
      visualization: makeViz({}, 0),
    });

    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      const pu = find(u), pv = find(v);
      const same = pu === pv;

      steps.push({
        line: 12,
        explanation: `Edge [${u},${v}]: find(${u})=${pu}, find(${v})=${pv}. ${same ? 'Same component — skip.' : 'Different components — merge.'}`,
        variables: { u, v, pu, pv, same },
        visualization: makeViz({ [u]: 'swapping', [v]: 'swapping' }, i),
      });

      union(u, v);

      steps.push({
        line: 13,
        explanation: same
          ? `No change. Components: ${components}.`
          : `Merged! Components reduced to ${components}.`,
        variables: { components },
        visualization: makeViz({}, i + 1),
      });
    }

    steps.push({
      line: 15,
      explanation: `All edges processed. ${components} connected component(s) remain.`,
      variables: { result: components },
      visualization: makeViz({}, edges.length),
    });

    return steps;
  },
};

export default numberOfConnectedComponents;
