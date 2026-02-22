import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const redundantConnectionIi: AlgorithmDefinition = {
  id: 'redundant-connection-ii',
  title: 'Redundant Connection II',
  leetcodeNumber: 685,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'In a directed graph with n nodes, one extra edge was added making some node have two parents or creating a cycle. Find the edge that can be removed to make the graph a valid rooted tree. Handle three cases: node with two parents and no cycle, cycle with no double-parent node, and both a double-parent node and a cycle.',
  tags: ['union find', 'graph', 'directed graph', 'tree'],

  code: {
    pseudocode: `function findRedundantDirectedConnection(edges):
  parent = array of size n+1 (each node is own parent)
  candidate1, candidate2 = null  // edges causing double parent
  for each edge [u, v] in edges:
    if parent[v] != v:
      candidate1 = [parent[v], v]  // first edge to v
      candidate2 = [u, v]          // second edge to v
      mark edge as skipped
    else:
      parent[v] = u
  // Reset and check if cycle exists without candidate2
  reinitialize union-find
  for each edge [u, v] not skipped:
    if find(u) == find(v): return candidate1 or edge
    union(u, v)
  return candidate2`,

    python: `def findRedundantDirectedConnection(edges):
    n = len(edges)
    parent = list(range(n + 1))
    candidate1 = candidate2 = None

    for u, v in edges:
        if parent[v] != v:
            candidate1 = [parent[v], v]
            candidate2 = [u, v]
            parent[v] = parent[v]  # keep original
        else:
            parent[v] = u

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    parent = list(range(n + 1))
    for u, v in edges:
        if candidate2 and [u, v] == candidate2:
            continue
        if find(u) == find(v):
            return candidate1 if candidate1 else [u, v]
        parent[find(u)] = find(v)
    return candidate2`,

    javascript: `function findRedundantDirectedConnection(edges) {
  const n = edges.length;
  const parent = Array.from({length: n + 1}, (_, i) => i);
  let candidate1 = null, candidate2 = null;

  for (const [u, v] of edges) {
    if (parent[v] !== v) {
      candidate1 = [parent[v], v];
      candidate2 = [u, v];
    } else {
      parent[v] = u;
    }
  }

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  for (let i = 0; i <= n; i++) parent[i] = i;
  for (const [u, v] of edges) {
    if (candidate2 && u === candidate2[0] && v === candidate2[1]) continue;
    if (find(u) === find(v)) return candidate1 || [u, v];
    parent[find(u)] = find(v);
  }
  return candidate2;
}`,

    java: `public int[] findRedundantDirectedConnection(int[][] edges) {
    int n = edges.length;
    int[] parent = new int[n + 1];
    for (int i = 0; i <= n; i++) parent[i] = i;
    int[] c1 = null, c2 = null;
    for (int[] e : edges) {
        if (parent[e[1]] != e[1]) {
            c1 = new int[]{parent[e[1]], e[1]};
            c2 = e;
        } else parent[e[1]] = e[0];
    }
    for (int i = 0; i <= n; i++) parent[i] = i;
    for (int[] e : edges) {
        if (c2 != null && e == c2) continue;
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu == pv) return c1 != null ? c1 : e;
        parent[pu] = pv;
    }
    return c2;
}`,
  },

  defaultInput: {
    edges: [[1, 2], [1, 3], [2, 3]],
  },

  inputFields: [
    {
      name: 'edges',
      label: 'Edges (as flat pairs)',
      type: 'array',
      defaultValue: [[1, 2], [1, 3], [2, 3]],
      placeholder: '[[1,2],[1,3],[2,3]]',
      helperText: 'Directed edges as [from, to] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];
    const n = edges.length;

    const parent: number[] = Array.from({ length: n + 1 }, (_, i) => i);
    const inDegree: number[] = new Array(n + 1).fill(0);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...parent],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize parent array for ${n + 1} nodes. Each node points to itself initially.`,
      variables: { n, phase: 'init' },
      visualization: makeViz({}, Object.fromEntries(parent.map((_, i) => [i, String(i)]))),
    });

    let candidate1: number[] | null = null;
    let candidate2: number[] | null = null;
    const skipped: Set<number> = new Set();

    for (let i = 0; i < edges.length; i++) {
      const [u, v] = edges[i];
      inDegree[v]++;

      steps.push({
        line: 4,
        explanation: `Processing edge [${u} -> ${v}]. Current in-degree of node ${v} is ${inDegree[v]}.`,
        variables: { u, v, 'inDegree[v]': inDegree[v] },
        visualization: makeViz({ [v]: 'active', [u]: 'comparing' }, { [v]: `in:${inDegree[v]}` }),
      });

      if (parent[v] !== v && candidate1 === null) {
        candidate1 = [parent[v], v];
        candidate2 = [u, v];
        skipped.add(i);

        steps.push({
          line: 6,
          explanation: `Node ${v} already has a parent (${parent[v]}). Two parents detected. candidate1=[${candidate1}], candidate2=[${candidate2}]. Skip this edge.`,
          variables: { candidate1: JSON.stringify(candidate1), candidate2: JSON.stringify(candidate2) },
          visualization: makeViz({ [v]: 'found', [u]: 'mismatch' }, { [v]: `double-parent` }),
        });
      } else {
        parent[v] = u;
        steps.push({
          line: 9,
          explanation: `Set parent[${v}] = ${u}.`,
          variables: { 'parent[v]': u },
          visualization: makeViz({ [v]: 'visited', [u]: 'pointer' }, { [v]: `par:${u}` }),
        });
      }
    }

    // Reset union-find
    const uf: number[] = Array.from({ length: n + 1 }, (_, i) => i);
    function find(x: number): number {
      while (uf[x] !== x) {
        uf[x] = uf[uf[x]];
        x = uf[x];
      }
      return x;
    }

    steps.push({
      line: 11,
      explanation: 'Reset union-find. Now check edges (skipping candidate2) for cycles.',
      variables: { candidate1: JSON.stringify(candidate1), candidate2: JSON.stringify(candidate2) },
      visualization: makeViz({}, Object.fromEntries(uf.map((v, i) => [i, String(v)]))),
    });

    let result: number[] = [];
    for (let i = 0; i < edges.length; i++) {
      if (skipped.has(i)) continue;
      const [u, v] = edges[i];
      const pu = find(u);
      const pv = find(v);

      steps.push({
        line: 13,
        explanation: `Edge [${u} -> ${v}]: find(${u})=${pu}, find(${v})=${pv}. ${pu === pv ? 'Cycle detected!' : 'No cycle, union them.'}`,
        variables: { u, v, findU: pu, findV: pv },
        visualization: makeViz({ [u]: 'active', [v]: 'comparing' }, { [pu]: 'root' }),
      });

      if (pu === pv) {
        result = candidate1 !== null ? candidate1 : edges[i];
        steps.push({
          line: 14,
          explanation: `Cycle found! Return ${candidate1 !== null ? 'candidate1' : 'current edge'}: [${result}].`,
          variables: { result: JSON.stringify(result) },
          visualization: makeViz({ [u]: 'found', [v]: 'found' }, { [u]: 'cycle', [v]: 'cycle' }),
        });
        return steps;
      }
      uf[pu] = pv;
    }

    result = candidate2 !== null ? candidate2 : [];
    steps.push({
      line: 16,
      explanation: `No cycle found when skipping candidate2. The redundant edge is candidate2: [${result}].`,
      variables: { result: JSON.stringify(result) },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default redundantConnectionIi;
