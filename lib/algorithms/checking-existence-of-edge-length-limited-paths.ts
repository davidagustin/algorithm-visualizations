import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkingExistenceOfEdgeLengthLimitedPaths: AlgorithmDefinition = {
  id: 'checking-existence-of-edge-length-limited-paths',
  title: 'Edge Length Limited Paths',
  leetcodeNumber: 1697,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a graph and queries [u, v, limit], answer whether a path exists from u to v using only edges with weight strictly less than limit. Offline approach: sort both edges and queries by weight/limit, then incrementally add edges using Union-Find to answer queries in order.',
  tags: ['union-find', 'offline queries', 'sorting', 'graph'],

  code: {
    pseudocode: `function distanceLimitedPathsExist(n, edgeList, queries):
  sort edges by weight
  sort queries by limit, keeping original indices
  parent = [0..n-1]
  results = [false]*len(queries)
  edgeIdx = 0
  for each (u, v, limit, origIdx) in sorted queries:
    add all edges with weight < limit to union-find
    results[origIdx] = (find(u) == find(v))
  return results`,

    python: `def distanceLimitedPathsExist(n, edgeList, queries):
    edgeList.sort(key=lambda e: e[2])
    qs = sorted(enumerate(queries), key=lambda x: x[1][2])
    parent = list(range(n))
    def find(x):
        while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
        return x
    def union(x, y): parent[find(x)] = find(y)
    res = [False] * len(queries)
    ei = 0
    for qi, (u, v, limit) in qs:
        while ei < len(edgeList) and edgeList[ei][2] < limit:
            union(edgeList[ei][0], edgeList[ei][1]); ei += 1
        res[qi] = find(u) == find(v)
    return res`,

    javascript: `function distanceLimitedPathsExist(n, edgeList, queries) {
  edgeList.sort((a,b) => a[2]-b[2]);
  const qs = queries.map((q,i) => [...q,i]).sort((a,b) => a[2]-b[2]);
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(x,y){parent[find(x)]=find(y);}
  const res = new Array(queries.length).fill(false);
  let ei = 0;
  for (const [u,v,limit,qi] of qs) {
    while(ei<edgeList.length && edgeList[ei][2]<limit){union(edgeList[ei][0],edgeList[ei][1]);ei++;}
    res[qi] = find(u)===find(v);
  }
  return res;
}`,

    java: `public boolean[] distanceLimitedPathsExist(int n, int[][] edgeList, int[][] queries) {
    Arrays.sort(edgeList, (a,b)->a[2]-b[2]);
    Integer[] qi = new Integer[queries.length];
    for(int i=0;i<qi.length;i++) qi[i]=i;
    Arrays.sort(qi,(a,b)->queries[a][2]-queries[b][2]);
    int[] parent = new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    boolean[] res = new boolean[queries.length];
    int ei=0;
    for(int idx : qi){
        while(ei<edgeList.length && edgeList[ei][2]<queries[idx][2])
            union(parent,edgeList[ei][0],edgeList[ei++][1]);
        res[idx]=find(parent,queries[idx][0])==find(parent,queries[idx][1]);
    }
    return res;
}`,
  },

  defaultInput: {
    n: 5,
    edgeList: [0, 1, 2, 1, 2, 4, 2, 3, 4, 3, 4, 5],
    queries: [0, 3, 5, 1, 4, 6],
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
      name: 'edgeList',
      label: 'Edges (u,v,w triples)',
      type: 'array',
      defaultValue: [0, 1, 2, 1, 2, 4, 2, 3, 4, 3, 4, 5],
      placeholder: '0,1,2,...',
      helperText: 'Flat list of u,v,weight triples',
    },
    {
      name: 'queries',
      label: 'Queries (u,v,limit triples)',
      type: 'array',
      defaultValue: [0, 3, 5, 1, 4, 6],
      placeholder: '0,3,5,1,4,6',
      helperText: 'Flat list of u,v,limit query triples',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edgeFlat = input.edgeList as number[];
    const queryFlat = input.queries as number[];
    const steps: AlgorithmStep[] = [];

    const edges: [number, number, number][] = [];
    for (let i = 0; i + 2 < edgeFlat.length; i += 3) edges.push([edgeFlat[i], edgeFlat[i + 1], edgeFlat[i + 2]]);

    const rawQueries: [number, number, number][] = [];
    for (let i = 0; i + 2 < queryFlat.length; i += 3) rawQueries.push([queryFlat[i], queryFlat[i + 1], queryFlat[i + 2]]);

    edges.sort((a, b) => a[2] - b[2]);
    const sortedQueries = rawQueries.map((q, i) => [...q, i] as [number, number, number, number]).sort((a, b) => a[2] - b[2]);

    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(x: number, y: number) { parent[find(x)] = find(y); }

    const results: boolean[] = new Array(rawQueries.length).fill(false);

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: n }, (_, i) => find(i)),
      highlights,
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `node${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Sort ${edges.length} edges by weight. Sort ${rawQueries.length} queries by limit. Process offline.`,
      variables: { sortedEdges: edges.map(e => `(${e[0]},${e[1]},${e[2]})`), n },
      visualization: makeViz({}),
    });

    let ei = 0;

    for (const [u, v, limit, qi] of sortedQueries) {
      steps.push({
        line: 7,
        explanation: `Query ${qi}: path from ${u} to ${v} with limit=${limit}. Adding edges with weight < ${limit}.`,
        variables: { u, v, limit, qi },
        visualization: makeViz({ [u]: 'active', [v]: 'active' }),
      });

      let edgesAdded = 0;
      while (ei < edges.length && edges[ei][2] < limit) {
        union(edges[ei][0], edges[ei][1]);
        edgesAdded++;
        ei++;
      }

      if (edgesAdded > 0) {
        steps.push({
          line: 8,
          explanation: `Added ${edgesAdded} edge(s) with weight < ${limit}. Union-Find roots: [${Array.from({ length: n }, (_, i) => find(i)).join(', ')}].`,
          variables: { edgesAdded, roots: Array.from({ length: n }, (_, i) => find(i)) },
          visualization: makeViz({}),
        });
      }

      results[qi] = find(u) === find(v);
      steps.push({
        line: 9,
        explanation: `Query ${qi} result: find(${u})=${find(u)}, find(${v})=${find(v)}. Path exists: ${results[qi]}.`,
        variables: { u, v, limit, result: results[qi] },
        visualization: makeViz({ [u]: results[qi] ? 'found' : 'mismatch', [v]: results[qi] ? 'found' : 'mismatch' }),
      });
    }

    steps.push({
      line: 10,
      explanation: `All queries answered. Results: [${results.map(r => String(r)).join(', ')}].`,
      variables: { results },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted']))),
    });

    return steps;
  },
};

export default checkingExistenceOfEdgeLengthLimitedPaths;
