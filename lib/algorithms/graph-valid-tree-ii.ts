import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const graphValidTreeII: AlgorithmDefinition = {
  id: 'graph-valid-tree-ii',
  title: 'Graph Valid Tree II',
  leetcodeNumber: 261,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes and a list of undirected edges, check if they form a valid tree. A valid tree must have exactly n-1 edges and be fully connected (no cycles, no disconnected components). Uses Union-Find.',
  tags: ['Graph', 'Union-Find', 'DFS', 'Tree'],
  code: {
    pseudocode: `function validTree(n, edges):
  if len(edges) != n-1: return false
  parent = [0..n-1], rank = [0..0]
  function find(x): path-compressed find
  for (u, v) in edges:
    pu, pv = find(u), find(v)
    if pu == pv: return false // cycle
    union(pu, pv)
  return true // n-1 edges, no cycle → valid tree`,
    python: `def validTree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    def find(x):
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu == pv: return False
        parent[pu] = pv
    return True`,
    javascript: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const parent = Array.from({length: n}, (_, i) => i);
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  for (const [u, v] of edges) {
    const pu = find(u), pv = find(v);
    if (pu === pv) return false;
    parent[pu] = pv;
  }
  return true;
}`,
    java: `public boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu == pv) return false;
        parent[pu] = pv;
    }
    return true;
}
private int find(int[] p, int x) {
    if (p[x]!=x) p[x]=find(p,p[x]); return p[x];
}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0,1],[0,2],[0,3],[1,4]],
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
      defaultValue: [[0,1],[0,2],[0,3],[1,4]],
      placeholder: '[[0,1],[1,2]]',
      helperText: 'Undirected edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const parent = Array.from({ length: n }, (_, i) => i);
    let hasCycle = false;
    const edgeCountOk = edges.length === n - 1;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: [...parent],
        highlights,
        labels: Object.fromEntries(parent.map((p, i) => [i, `p[${i}]=${p}`])),
        auxData: {
          label: 'Graph Valid Tree',
          entries: [
            { key: 'Edges', value: `${edges.length} (need ${n-1})` },
            { key: 'Edge Count OK', value: edgeCountOk ? 'Yes' : 'No' },
            { key: 'Cycle Found', value: hasCycle ? 'Yes' : 'No' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    if (!edgeCountOk) {
      steps.push({
        line: 1,
        explanation: `Edge count check: ${edges.length} edges but need exactly ${n-1} for ${n} nodes. Not a valid tree.`,
        variables: { n, edgeCount: edges.length, needed: n - 1 },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'mismatch'])),
          `Wrong edge count: ${edges.length} != ${n-1}`
        ),
      });
      return steps;
    }

    steps.push({
      line: 2,
      explanation: `Edge count OK: ${edges.length} = ${n}-1. Now check for cycles using Union-Find.`,
      variables: { n, edgeCount: edges.length },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        'Edge count valid, checking connectivity'
      ),
    });

    for (const [u, v] of edges) {
      const pu = find(u);
      const pv = find(v);

      if (pu === pv) {
        hasCycle = true;
        steps.push({
          line: 7,
          explanation: `Edge (${u}-${v}): find(${u})=find(${v})=${pu}. Cycle detected! Not a valid tree.`,
          variables: { u, v, pu, pv },
          visualization: makeViz({ [u]: 'mismatch', [v]: 'mismatch' }, 'Cycle detected!'),
        });
        break;
      }

      parent[pu] = pv;
      steps.push({
        line: 8,
        explanation: `Edge (${u}-${v}): find(${u})=${pu}, find(${v})=${pv}. Different components. Union: parent[${pu}]=${pv}.`,
        variables: { u, v, pu, pv, parent: [...parent] },
        visualization: makeViz({ [u]: 'found', [v]: 'found' }, `Union(${u}, ${v})`),
      });
    }

    const isValid = edgeCountOk && !hasCycle;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = isValid ? 'sorted' : 'mismatch';
    steps.push({
      line: 9,
      explanation: isValid
        ? `Valid tree! ${n} nodes, ${n-1} edges, no cycles, fully connected.`
        : `Not a valid tree. ${hasCycle ? 'Cycle detected.' : 'Wrong edge count.'}`,
      variables: { result: isValid },
      visualization: makeViz(finalH, `Result: ${isValid}`),
    });

    return steps;
  },
};

export default graphValidTreeII;
