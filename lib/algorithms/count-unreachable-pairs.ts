import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countUnreachablePairs: AlgorithmDefinition = {
  id: 'count-unreachable-pairs',
  title: 'Count Unreachable Pairs of Nodes',
  leetcodeNumber: 2316,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an undirected graph, count the number of pairs of nodes (i, j) where i < j and there is no path connecting them. Use Union-Find to find connected components, then for each component of size s, count pairs it contributes as s * (totalRemaining - s) / 2.',
  tags: ['union-find', 'connected components', 'counting', 'graph'],

  code: {
    pseudocode: `function countPairs(n, edges):
  parent = [0..n-1]
  for each (u, v) in edges:
    union(u, v)
  sizes = count component sizes
  total = 0, remaining = n
  for each component size s:
    total += s * (remaining - s)
    remaining -= s
  return total`,

    python: `def countPairs(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
        return x
    def union(x, y): parent[find(x)] = find(y)
    for u, v in edges: union(u, v)
    from collections import Counter
    sizes = Counter(find(i) for i in range(n)).values()
    total = remaining = 0
    remaining = n
    for s in sizes:
        total += s * (remaining - s)
        remaining -= s
    return total`,

    javascript: `function countPairs(n, edges) {
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for (const [u,v] of edges) parent[find(u)]=find(v);
  const sizeMap = {};
  for (let i=0;i<n;i++){const r=find(i);sizeMap[r]=(sizeMap[r]||0)+1;}
  const sizes = Object.values(sizeMap);
  let total=0, remaining=n;
  for (const s of sizes){total+=s*(remaining-s);remaining-=s;}
  return total;
}`,

    java: `public long countPairs(int n, int[][] edges) {
    int[] parent = new int[n];
    for (int i=0;i<n;i++) parent[i]=i;
    for (int[] e : edges) parent[find(parent,e[0])]=find(parent,e[1]);
    Map<Integer,Integer> sizes = new HashMap<>();
    for (int i=0;i<n;i++) sizes.merge(find(parent,i),1,Integer::sum);
    long total=0; int rem=n;
    for (int s : sizes.values()){total+=(long)s*(rem-s);rem-=s;}
    return total;
}`,
  },

  defaultInput: {
    n: 7,
    edges: [0, 2, 0, 5, 2, 4, 1, 6, 5, 4],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
    },
    {
      name: 'edges',
      label: 'Undirected Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 2, 0, 5, 2, 4, 1, 6, 5, 4],
      placeholder: '0,2,0,5,...',
      helperText: 'Flat list of undirected u-v edge pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edgeFlat = input.edges as number[];
    const steps: AlgorithmStep[] = [];

    const edges: [number, number][] = [];
    for (let i = 0; i + 1 < edgeFlat.length; i += 2) edges.push([edgeFlat[i], edgeFlat[i + 1]]);

    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }
    function union(x: number, y: number) { parent[find(x)] = find(y); }

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: n }, (_, i) => find(i)),
      highlights,
      labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}`])),
    });

    steps.push({
      line: 1,
      explanation: `Initialize Union-Find for ${n} nodes. Count unreachable pairs.`,
      variables: { n, edges: edges.map(([u, v]) => `${u}-${v}`) },
      visualization: makeViz({}),
    });

    for (const [u, v] of edges) {
      const pu = find(u), pv = find(v);
      union(u, v);
      steps.push({
        line: 3,
        explanation: `Union nodes ${u} (root: ${pu}) and ${v} (root: ${pv}). Now in same component.`,
        variables: { u, v, newRoot: find(u) },
        visualization: makeViz({ [u]: 'active', [v]: 'active' }),
      });
    }

    const sizeMap: Record<number, number> = {};
    for (let i = 0; i < n; i++) {
      const r = find(i);
      sizeMap[r] = (sizeMap[r] || 0) + 1;
    }

    const sizes = Object.values(sizeMap);

    steps.push({
      line: 5,
      explanation: `Found ${sizes.length} connected components with sizes: [${sizes.join(', ')}].`,
      variables: { components: sizes.length, sizes },
      visualization: makeViz(Object.fromEntries(
        Array.from({ length: n }, (_, i) => [i, 'visited'])
      )),
    });

    let total = 0;
    let remaining = n;
    for (let idx = 0; idx < sizes.length; idx++) {
      const s = sizes[idx];
      const contribution = s * (remaining - s);
      total += contribution;
      steps.push({
        line: 8,
        explanation: `Component of size ${s}: contributes ${s} * ${remaining - s} = ${contribution} unreachable pairs. Running total = ${total}.`,
        variables: { componentSize: s, remaining, contribution, total },
        visualization: makeViz({}),
      });
      remaining -= s;
    }

    steps.push({
      line: 9,
      explanation: `Total unreachable pairs = ${total}.`,
      variables: { result: total },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted']))),
    });

    return steps;
  },
};

export default countUnreachablePairs;
