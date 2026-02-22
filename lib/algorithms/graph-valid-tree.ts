import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const graphValidTree: AlgorithmDefinition = {
  id: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  leetcodeNumber: 261,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes and undirected edges, determine if they form a valid tree. A valid tree has exactly n-1 edges AND is fully connected (one connected component). Use Union-Find: if any edge connects nodes already in the same component, there is a cycle.',
  tags: ['Graph', 'Union Find', 'DFS', 'BFS'],
  code: {
    pseudocode: `function validTree(n, edges):
  if len(edges) != n - 1: return False
  parent = [i for i in range(n)]
  rank = [0] * n
  def find(x): path compression
  def union(x, y):
    px, py = find(x), find(y)
    if px == py: return False  // cycle!
    merge by rank
    return True
  for [u, v] in edges:
    if not union(u, v): return False
  return True`,
    python: `def validTree(n, edges):
    if len(edges) != n - 1: return False
    parent = list(range(n))
    rank = [0] * n
    def find(x):
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        px, py = find(x), find(y)
        if px == py: return False
        if rank[px] > rank[py]: parent[py] = px
        elif rank[px] < rank[py]: parent[px] = py
        else: parent[py] = px; rank[px] += 1
        return True
    return all(union(u, v) for u, v in edges)`,
    javascript: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent=Array.from({length:n},(_,i)=>i), rank=new Array(n).fill(0);
  const find=x=>parent[x]===x?x:(parent[x]=find(parent[x]));
  const union=(x,y)=>{const[px,py]=[find(x),find(y)];if(px===py)return false;if(rank[px]>rank[py])parent[py]=px;else if(rank[px]<rank[py])parent[px]=py;else{parent[py]=px;rank[px]++;}return true;};
  return edges.every(([u,v])=>union(u,v));
}`,
    java: `public boolean validTree(int n, int[][] edges) {
    if(edges.length!=n-1) return false;
    int[]parent=new int[n],rank=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    for(int[]e:edges){int pu=find(parent,e[0]),pv=find(parent,e[1]);if(pu==pv)return false;if(rank[pu]>rank[pv])parent[pv]=pu;else if(rank[pu]<rank[pv])parent[pu]=pv;else{parent[pv]=pu;rank[pu]++;}}
    return true;
}
int find(int[]p,int x){return p[x]==x?x:(p[x]=find(p,p[x]));}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0, 1], [0, 2], [0, 3], [1, 4]],
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
      defaultValue: [[0, 1], [0, 2], [0, 3], [1, 4]],
      placeholder: '[[0,1],[0,2],[0,3],[1,4]]',
      helperText: 'Undirected edges. Valid tree needs exactly n-1 edges, no cycles.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);

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
      return true;
    }

    const colorMap = ['found', 'active', 'pointer', 'comparing', 'match', 'sorted'];

    function makeViz(highlights: Record<number, string>, edgeIdx: number, valid: boolean | null): ArrayVisualization {
      const roots = new Map<number, number>();
      let ci = 0;
      for (let i = 0; i < n; i++) {
        const root = find(i);
        if (!roots.has(root)) roots.set(root, ci++);
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
          label: 'Valid Tree Check',
          entries: [
            { key: 'Edges needed', value: String(n - 1) },
            { key: 'Edges given', value: String(edges.length) },
            { key: 'Processed', value: `${edgeIdx} / ${edges.length}` },
            { key: 'Components', value: String(new Set(Array.from({ length: n }, (_, i) => find(i))).size) },
            { key: 'Valid tree?', value: valid !== null ? String(valid) : '...' },
          ],
        },
      };
    }

    // Check edge count
    if (edges.length !== n - 1) {
      steps.push({
        line: 1,
        explanation: `A tree with ${n} nodes needs exactly ${n - 1} edges. Given ${edges.length} edges. ${edges.length > n - 1 ? 'Too many edges (cycle exists)' : 'Too few edges (disconnected)'}. Return false.`,
        variables: { n, edgesNeeded: n - 1, edgesGiven: edges.length },
        visualization: makeViz({}, 0, false),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes, ${edges.length} edges (exactly n-1=${n - 1}). Good start! Now check for cycles using Union-Find. A cycle would mean it's not a tree.`,
      variables: { n, edges: edges.length },
      visualization: makeViz({}, 0, null),
    });

    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      const pu = find(u), pv = find(v);
      const same = pu === pv;

      steps.push({
        line: 12,
        explanation: `Edge [${u},${v}]: find(${u})=${pu}, find(${v})=${pv}. ${same ? 'CYCLE DETECTED — not a valid tree!' : 'Safe to merge.'}`,
        variables: { u, v, pu, pv },
        visualization: makeViz({ [u]: same ? 'mismatch' : 'active', [v]: same ? 'mismatch' : 'comparing' }, i, same ? false : null),
      });

      if (!union(u, v)) {
        steps.push({
          line: 13,
          explanation: `Cycle detected at edge [${u},${v}]. Graph is not a valid tree. Return false.`,
          variables: { result: false },
          visualization: makeViz({ [u]: 'mismatch', [v]: 'mismatch' }, i + 1, false),
        });
        return steps;
      }

      steps.push({
        line: 14,
        explanation: `Merged components of ${u} and ${v}. No cycle so far. Components: ${new Set(Array.from({ length: n }, (_, j) => find(j))).size}.`,
        variables: { u, v },
        visualization: makeViz({}, i + 1, null),
      });
    }

    const components = new Set(Array.from({ length: n }, (_, i) => find(i))).size;
    const isTree = components === 1;

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = isTree ? 'found' : 'mismatch';

    steps.push({
      line: 16,
      explanation: isTree
        ? `All ${edges.length} edges processed. 1 connected component. Valid tree! Return true.`
        : `${components} components remain — graph is disconnected. Return false.`,
      variables: { result: isTree, components },
      visualization: makeViz(finalHL, edges.length, isTree),
    });

    return steps;
  },
};

export default graphValidTree;
