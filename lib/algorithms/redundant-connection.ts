import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const redundantConnection: AlgorithmDefinition = {
  id: 'redundant-connection',
  title: 'Redundant Connection',
  leetcodeNumber: 684,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a tree with n nodes (1-indexed) and one extra edge added, find the edge that creates a cycle. Process edges one by one using Union-Find: the first edge where both endpoints are already in the same component is the redundant edge.',
  tags: ['Graph', 'Union Find', 'DFS'],
  code: {
    pseudocode: `function findRedundantConnection(edges):
  parent = [i for i in range(n+1)]
  rank = [0] * (n+1)
  def find(x): path compression
  def union(x, y):
    px, py = find(x), find(y)
    if px == py: return False  // cycle!
    merge by rank
    return True
  for [u, v] in edges:
    if not union(u, v): return [u, v]`,
    python: `def findRedundantConnection(edges):
    n = len(edges)
    parent = list(range(n+1))
    rank = [0] * (n+1)
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
    for u, v in edges:
        if not union(u, v): return [u, v]`,
    javascript: `function findRedundantConnection(edges) {
  const n = edges.length;
  const parent = Array.from({length: n+1}, (_,i) => i);
  const rank = new Array(n+1).fill(0);
  const find = x => parent[x]===x?x:(parent[x]=find(parent[x]));
  const union = (x,y) => {
    const [px,py]=[find(x),find(y)];
    if(px===py) return false;
    if(rank[px]>rank[py]) parent[py]=px;
    else if(rank[px]<rank[py]) parent[px]=py;
    else { parent[py]=px; rank[px]++; }
    return true;
  };
  for (const [u,v] of edges) if (!union(u,v)) return [u,v];
}`,
    java: `public int[] findRedundantConnection(int[][] edges) {
    int n=edges.length;
    int[] parent=new int[n+1], rank=new int[n+1];
    for(int i=0;i<=n;i++) parent[i]=i;
    for(int[] e:edges) if(!union(parent,rank,e[0],e[1])) return e;
    return new int[]{};
}
int find(int[]p,int x){return p[x]==x?x:(p[x]=find(p,p[x]));}
boolean union(int[]p,int[]r,int x,int y){int px=find(p,x),py=find(p,y);if(px==py)return false;if(r[px]>r[py])p[py]=px;else if(r[px]<r[py])p[px]=py;else{p[py]=px;r[px]++;}return true;}`,
  },
  defaultInput: {
    edges: [[1, 2], [1, 3], [2, 3]],
  },
  inputFields: [
    {
      name: 'edges',
      label: 'Edges [u, v]',
      type: 'array',
      defaultValue: [[1, 2], [1, 3], [2, 3]],
      placeholder: '[[1,2],[1,3],[2,3]]',
      helperText: 'Edges of the graph (1-indexed, n+1 edges for n nodes)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edges = input.edges as number[][];
    const n = edges.length;
    const steps: AlgorithmStep[] = [];

    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const rank = new Array(n + 1).fill(0);

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

    // Show nodes 1..n
    function makeViz(
      highlights: Record<number, string>,
      edgeIdx: number,
      redundant: [number, number] | null
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 1; i <= n; i++) labels[i - 1] = `n${i}→r${find(i)}`;
      return {
        type: 'array',
        array: parent.slice(1),
        highlights,
        labels,
        auxData: {
          label: 'Union-Find',
          entries: [
            { key: 'Edges processed', value: `${edgeIdx} / ${edges.length}` },
            { key: 'Redundant edge', value: redundant ? `[${redundant[0]}, ${redundant[1]}]` : 'not found yet' },
            { key: 'Components', value: String(new Set(parent.slice(1).map((_, i) => find(i + 1))).size) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes, ${edges.length} edges (tree has n-1 edges, so 1 is extra). Union-Find: process each edge; if endpoints already connected, that edge creates a cycle.`,
      variables: { n, edges: edges.length },
      visualization: makeViz({}, 0, null),
    });

    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      const pu = find(u), pv = find(v);

      const hl: Record<number, string> = { [u - 1]: 'active', [v - 1]: 'comparing' };

      steps.push({
        line: 9,
        explanation: `Process edge [${u}, ${v}]. find(${u})=${pu}, find(${v})=${pv}. ${pu === pv ? 'Same root — CYCLE detected!' : 'Different roots — safe to merge.'}`,
        variables: { u, v, rootU: pu, rootV: pv },
        visualization: makeViz(hl, i, null),
      });

      if (!union(u, v)) {
        steps.push({
          line: 10,
          explanation: `Edge [${u}, ${v}] creates a cycle. This is the redundant connection. Return [${u}, ${v}].`,
          variables: { result: [u, v] },
          visualization: makeViz({ [u - 1]: 'swapping', [v - 1]: 'swapping' }, i + 1, [u, v]),
        });
        return steps;
      }

      const hl2: Record<number, string> = {};
      for (let j = 1; j <= n; j++) {
        hl2[j - 1] = find(j) === find(u) ? 'found' : 'default';
      }

      steps.push({
        line: 12,
        explanation: `Merged component containing ${u} and ${v}. Root: ${find(u)}. No cycle yet.`,
        variables: { u, v, newRoot: find(u) },
        visualization: makeViz(hl2, i + 1, null),
      });
    }

    return steps;
  },
};

export default redundantConnection;
