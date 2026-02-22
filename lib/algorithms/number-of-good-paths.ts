import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfGoodPaths: AlgorithmDefinition = {
  id: 'number-of-good-paths',
  title: 'Number of Good Paths',
  leetcodeNumber: 2421,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'A good path in a tree starts and ends at nodes with equal values and all intermediate nodes have values at most equal to the start/end value. Count all good paths. Sort nodes by value, then process them in increasing order. When adding a node, union it with adjacent nodes of equal or lesser value. Count pairs within each component that share the same maximum value.',
  tags: ['union find', 'graph', 'tree', 'sorting'],

  code: {
    pseudocode: `function numberOfGoodPaths(vals, edges):
  n = len(vals)
  parent = [0..n-1]
  size = [1]*n  // count of nodes with max value in component
  // Sort nodes by value
  sortedNodes = sorted(0..n-1 by vals)
  // Build adjacency list
  adj = build from edges
  result = n  // each node is its own good path
  for node in sortedNodes:
    for neighbor in adj[node]:
      if vals[neighbor] <= vals[node]:
        rootN = find(node), rootNb = find(neighbor)
        if rootN != rootNb:
          if vals[rootN] == vals[rootNb]:
            result += size[rootN] * size[rootNb]
          union and update size
  return result`,

    python: `def numberOfGoodPaths(vals, edges):
    n = len(vals)
    parent = list(range(n))
    size = [1] * n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    nodes = sorted(range(n), key=lambda x: vals[x])
    result = n
    for node in nodes:
        for nb in adj[node]:
            if vals[nb] <= vals[node]:
                rootN, rootNb = find(node), find(nb)
                if rootN != rootNb:
                    if vals[rootN] == vals[rootNb]:
                        result += size[rootN] * size[rootNb]
                        size[find(rootNb)] = size[rootN] + size[rootNb]
                    parent[rootN] = rootNb
                    if vals[rootN] > vals[rootNb]:
                        size[rootN] += size[rootNb]
    return result`,

    javascript: `function numberOfGoodPaths(vals, edges) {
  const n=vals.length;
  const parent=Array.from({length:n},(_,i)=>i);
  const size=new Array(n).fill(1);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  const adj=Array.from({length:n},()=>[]);
  for(const[u,v]of edges){adj[u].push(v);adj[v].push(u);}
  const nodes=[...Array(n).keys()].sort((a,b)=>vals[a]-vals[b]);
  let result=n;
  for(const node of nodes){
    for(const nb of adj[node]){
      if(vals[nb]<=vals[node]){
        const rn=find(node),rnb=find(nb);
        if(rn!==rnb){
          if(vals[rn]===vals[rnb]) result+=size[rn]*size[rnb];
          if(vals[rn]<=vals[rnb]){parent[rn]=rnb;if(vals[rn]===vals[rnb])size[rnb]+=size[rn];}
          else{parent[rnb]=rn;size[rn]+=size[rnb];}
        }
      }
    }
  }
  return result;
}`,

    java: `public int numberOfGoodPaths(int[] vals, int[][] edges) {
    int n=vals.length;
    int[] parent=new int[n],size=new int[n];
    for(int i=0;i<n;i++){parent[i]=i;size[i]=1;}
    List<List<Integer>> adj=new ArrayList<>();
    for(int i=0;i<n;i++) adj.add(new ArrayList<>());
    for(int[]e:edges){adj.get(e[0]).add(e[1]);adj.get(e[1]).add(e[0]);}
    Integer[]nodes=new Integer[n];
    for(int i=0;i<n;i++) nodes[i]=i;
    Arrays.sort(nodes,(a,b)->vals[a]-vals[b]);
    int res=n;
    for(int node:nodes)
        for(int nb:adj.get(node))
            if(vals[nb]<=vals[node]){
                int rn=find(parent,node),rnb=find(parent,nb);
                if(rn!=rnb){
                    if(vals[rn]==vals[rnb]) res+=size[rn]*size[rnb];
                    // merge by value
                }
            }
    return res;
}`,
  },

  defaultInput: {
    vals: [1, 3, 2, 1, 3],
    edges: [[0, 1], [0, 2], [2, 3], [2, 4]],
  },

  inputFields: [
    {
      name: 'vals',
      label: 'Node Values',
      type: 'array',
      defaultValue: [1, 3, 2, 1, 3],
      placeholder: '1,3,2,1,3',
      helperText: 'Value at each node (0-indexed)',
    },
    {
      name: 'edges',
      label: 'Edges',
      type: 'array',
      defaultValue: [[0, 1], [0, 2], [2, 3], [2, 4]],
      placeholder: '[[0,1],[0,2]]',
      helperText: 'Tree edges as [u, v] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const vals = input.vals as number[];
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];
    const n = vals.length;

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const size: number[] = new Array(n).fill(1);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      adj[u].push(v);
      adj[v].push(u);
    }

    const sortedNodes = Array.from({ length: n }, (_, i) => i).sort((a, b) => vals[a] - vals[b]);

    steps.push({
      line: 1,
      explanation: `Tree with ${n} nodes. Values: [${vals}]. Sort nodes by value: [${sortedNodes.map(i => `${i}(v=${vals[i]})`).join(', ')}]. Each node starts as its own good path.`,
      variables: { n, result: n },
      visualization: {
        type: 'array',
        array: [...vals],
        highlights: {},
        labels: Object.fromEntries(vals.map((v, i) => [i, `${v}`])),
      },
    });

    let result = n;

    for (const node of sortedNodes) {
      steps.push({
        line: 9,
        explanation: `Processing node ${node} (value=${vals[node]}).`,
        variables: { node, value: vals[node], currentResult: result },
        visualization: {
          type: 'array',
          array: [...vals],
          highlights: { [node]: 'active' },
          labels: { [node]: `node:${node}` },
        },
      });

      for (const nb of adj[node]) {
        if (vals[nb] <= vals[node]) {
          const rn = find(node);
          const rnb = find(nb);

          if (rn !== rnb) {
            if (vals[rn] === vals[rnb]) {
              const added = size[rn] * size[rnb];
              result += added;

              steps.push({
                line: 12,
                explanation: `Merge node ${node} (root ${rn}, val=${vals[rn]}, size=${size[rn]}) with neighbor ${nb} (root ${rnb}, val=${vals[rnb]}, size=${size[rnb]}). Same max value => add ${added} good paths. Total: ${result}.`,
                variables: { node, nb, addedPaths: added, result },
                visualization: {
                  type: 'array',
                  array: [...vals],
                  highlights: { [node]: 'found', [nb]: 'found' },
                  labels: { [node]: `+${added}`, 0: `total:${result}` },
                },
              });

              size[rnb] += size[rn];
            } else if (vals[rn] < vals[rnb]) {
              size[rnb] += size[rn];
            } else {
              size[rn] += size[rnb];
            }

            if (vals[rn] <= vals[rnb]) {
              parent[rn] = rnb;
            } else {
              parent[rnb] = rn;
            }
          }
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `All nodes processed. Total good paths: ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...vals],
        highlights: Object.fromEntries(vals.map((_, i) => [i, 'sorted'])),
        labels: { 0: `result:${result}` },
      },
    });

    return steps;
  },
};

export default numberOfGoodPaths;
