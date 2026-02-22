import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const graphConnectivityWithThreshold: AlgorithmDefinition = {
  id: 'graph-connectivity-with-threshold',
  title: 'Graph Connectivity With Threshold',
  leetcodeNumber: 1627,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given n cities (1 to n) and a threshold, two cities u and v are directly connected if they share a common factor greater than threshold. For each query [u, v], determine if they are in the same connected component. Use union find with factor enumeration: for each factor f from threshold+1 to n, union all multiples of f together.',
  tags: ['union find', 'graph', 'math', 'factor enumeration'],

  code: {
    pseudocode: `function areConnected(n, threshold, queries):
  parent = [0..n]
  // Union all multiples of each factor > threshold
  for f in threshold+1..n:
    for multiple in 2f, 3f, ... <= n:
      union(f, multiple)
  // Answer each query
  result = []
  for [u, v] in queries:
    result.append(find(u) == find(v))
  return result`,

    python: `def areConnected(n, threshold, queries):
    parent = list(range(n + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    for f in range(threshold + 1, n + 1):
        multiple = f * 2
        while multiple <= n:
            union(f, multiple)
            multiple += f
    return [find(u) == find(v) for u, v in queries]`,

    javascript: `function areConnected(n, threshold, queries) {
  const parent=Array.from({length:n+1},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){const pa=find(a),pb=find(b);if(pa!==pb)parent[pa]=pb;}
  for(let f=threshold+1;f<=n;f++)
    for(let m=f*2;m<=n;m+=f) union(f,m);
  return queries.map(([u,v])=>find(u)===find(v));
}`,

    java: `public List<Boolean> areConnected(int n, int threshold, int[][] queries) {
    int[] parent = new int[n+1];
    for(int i=0;i<=n;i++) parent[i]=i;
    for(int f=threshold+1;f<=n;f++)
        for(int m=f*2;m<=n;m+=f) union(parent,f,m);
    List<Boolean> res = new ArrayList<>();
    for(int[]q:queries) res.add(find(parent,q[0])==find(parent,q[1]));
    return res;
}`,
  },

  defaultInput: {
    n: 6,
    threshold: 2,
    queries: [[1, 4], [2, 5], [3, 6]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Cities labeled 1 to n',
    },
    {
      name: 'threshold',
      label: 'Threshold',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Common factor must be greater than this threshold',
    },
    {
      name: 'queries',
      label: 'Queries',
      type: 'array',
      defaultValue: [[1, 4], [2, 5], [3, 6]],
      placeholder: '[[1,4],[2,5]]',
      helperText: 'Pairs [u,v] to check connectivity',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const threshold = input.threshold as number;
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];

    const parent: number[] = Array.from({ length: n + 1 }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      const pa = find(a), pb = find(b);
      if (pa !== pb) parent[pa] = pb;
    }

    steps.push({
      line: 1,
      explanation: `n=${n}, threshold=${threshold}. Union all cities sharing a common factor greater than ${threshold}.`,
      variables: { n, threshold },
      visualization: {
        type: 'array',
        array: parent.slice(1),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i + 1}`])),
      },
    });

    for (let f = threshold + 1; f <= n; f++) {
      let multiple = f * 2;
      const unioned: number[] = [];
      while (multiple <= n) {
        union(f, multiple);
        unioned.push(multiple);
        multiple += f;
      }

      if (unioned.length > 0) {
        steps.push({
          line: 4,
          explanation: `Factor ${f}: union city ${f} with multiples [${unioned.join(', ')}]. They all share factor ${f}.`,
          variables: { factor: f, multiples: unioned.join(',') },
          visualization: {
            type: 'array',
            array: parent.slice(1),
            highlights: {
              [f - 1]: 'active',
              ...Object.fromEntries(unioned.map(m => [m - 1, 'comparing'])),
            },
            labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `r:${find(i + 1)}`])),
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Union phase complete. Now answering ${queries.length} queries.`,
      variables: { queryCount: queries.length },
      visualization: {
        type: 'array',
        array: parent.slice(1),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `root:${find(i + 1)}`])),
      },
    });

    const results: boolean[] = [];
    for (const [u, v] of queries) {
      const rootU = find(u);
      const rootV = find(v);
      const connected = rootU === rootV;
      results.push(connected);

      steps.push({
        line: 9,
        explanation: `Query [${u}, ${v}]: find(${u})=${rootU}, find(${v})=${rootV}. ${connected ? 'Same root - CONNECTED.' : 'Different roots - NOT connected.'}`,
        variables: { u, v, rootU, rootV, connected },
        visualization: {
          type: 'array',
          array: parent.slice(1),
          highlights: { [u - 1]: 'active', [v - 1]: 'comparing' },
          labels: { [u - 1]: `r:${rootU}`, [v - 1]: `r:${rootV}` },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `All queries answered: [${results.join(', ')}].`,
      variables: { results: results.join(',') },
      visualization: {
        type: 'array',
        array: results.map(b => b ? 1 : 0),
        highlights: Object.fromEntries(results.map((b, i) => [i, b ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(results.map((b, i) => [i, b ? 'true' : 'false'])),
      },
    });

    return steps;
  },
};

export default graphConnectivityWithThreshold;
