import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countConnectedComponents: AlgorithmDefinition = {
  id: 'count-connected-components',
  title: 'Count Connected Components in an Undirected Graph',
  leetcodeNumber: 323,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes (0 to n-1) and a list of undirected edges, count the number of connected components. Use union find: start with n components, and for each edge that connects two different components, union them and decrement the count. The final count is the number of connected components.',
  tags: ['union find', 'graph', 'connected components', 'dfs alternative'],

  code: {
    pseudocode: `function countComponents(n, edges):
  parent = [0..n-1]
  components = n
  for [u, v] in edges:
    rootU = find(u), rootV = find(v)
    if rootU != rootV:
      parent[rootU] = rootV
      components -= 1
  return components`,

    python: `def countComponents(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    components = n
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            components -= 1
    return components`,

    javascript: `function countComponents(n, edges) {
  const parent=Array.from({length:n},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  let components=n;
  for(const[u,v]of edges){
    const ru=find(u),rv=find(v);
    if(ru!==rv){parent[ru]=rv;components--;}
  }
  return components;
}`,

    java: `public int countComponents(int n, int[][] edges) {
    int[]parent=new int[n];
    for(int i=0;i<n;i++) parent[i]=i;
    int components=n;
    for(int[]e:edges){
        int ru=find(parent,e[0]),rv=find(parent,e[1]);
        if(ru!=rv){parent[ru]=rv;components--;}
    }
    return components;
}`,
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
      label: 'Edges',
      type: 'array',
      defaultValue: [[0, 1], [1, 2], [3, 4]],
      placeholder: '[[0,1],[1,2],[3,4]]',
      helperText: 'Undirected edges as [u, v] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    let components = n;

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes, ${edges.length} edges. Initialize each node as its own component. Total components = ${n}.`,
      variables: { n, edgeCount: edges.length, components },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: {},
        labels: Object.fromEntries(parent.map((_, i) => [i, `n${i}`])),
      },
    });

    for (const [u, v] of edges) {
      const ru = find(u);
      const rv = find(v);

      steps.push({
        line: 3,
        explanation: `Edge [${u}-${v}]: find(${u})=${ru}, find(${v})=${rv}. ${ru !== rv ? 'Different components - merge! Components: ' + (components - 1) : 'Already connected.'}`,
        variables: { u, v, rootU: ru, rootV: rv, components: ru !== rv ? components - 1 : components },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: { [u]: 'active', [v]: 'comparing' },
          labels: { [ru]: `root-u`, [rv]: `root-v` },
        },
      });

      if (ru !== rv) {
        parent[ru] = rv;
        components--;

        steps.push({
          line: 5,
          explanation: `Merged! parent[${ru}] = ${rv}. Components remaining: ${components}.`,
          variables: { 'parent[ru]': rv, components },
          visualization: {
            type: 'array',
            array: [...parent],
            highlights: { [u]: 'found', [v]: 'found', [ru]: 'active' },
            labels: Object.fromEntries(parent.map((v, i) => [i, `p:${v}`])),
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `All edges processed. Final parent array: [${parent}]. Number of connected components: ${components}.`,
      variables: { result: components },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: Object.fromEntries(parent.map((v, i) => [i, v === i ? 'found' : 'sorted'])),
        labels: Object.fromEntries(parent.map((_, i) => [i, `root:${find(i)}`])),
      },
    });

    return steps;
  },
};

export default countConnectedComponents;
