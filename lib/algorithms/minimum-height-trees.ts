import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumHeightTrees: AlgorithmDefinition = {
  id: 'minimum-height-trees',
  title: 'Minimum Height Trees',
  leetcodeNumber: 310,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n nodes (0 to n-1) and undirected edges, find all roots such that the resulting tree has minimum height. The strategy is to iteratively trim leaves (degree-1 nodes) from the outside in, like peeling an onion. The remaining 1-2 nodes are the answer.',
  tags: ['Graph', 'BFS', 'Topological Sort', 'Tree'],
  code: {
    pseudocode: `function findMinHeightTrees(n, edges):
  if n == 1: return [0]
  degree = degree of each node
  leaves = nodes with degree 1
  remaining = n
  while remaining > 2:
    newLeaves = []
    for leaf in leaves:
      for neighbor of leaf:
        degree[neighbor] -= 1
        if degree[neighbor] == 1:
          newLeaves.append(neighbor)
    remaining -= len(leaves)
    leaves = newLeaves
  return leaves`,
    python: `def findMinHeightTrees(n, edges):
    if n == 1: return [0]
    adj = [set() for _ in range(n)]
    for u, v in edges:
        adj[u].add(v); adj[v].add(u)
    leaves = [i for i in range(n) if len(adj[i]) == 1]
    remaining = n
    while remaining > 2:
        remaining -= len(leaves)
        newLeaves = []
        for leaf in leaves:
            nb = adj[leaf].pop()
            adj[nb].discard(leaf)
            if len(adj[nb]) == 1:
                newLeaves.append(nb)
        leaves = newLeaves
    return leaves`,
    javascript: `function findMinHeightTrees(n, edges) {
  if (n === 1) return [0];
  const adj = Array.from({length: n}, () => new Set());
  for (const [u, v] of edges) { adj[u].add(v); adj[v].add(u); }
  let leaves = [];
  for (let i = 0; i < n; i++) if (adj[i].size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const newLeaves = [];
    for (const leaf of leaves) {
      const nb = [...adj[leaf]][0];
      adj[nb].delete(leaf);
      if (adj[nb].size === 1) newLeaves.push(nb);
    }
    leaves = newLeaves;
  }
  return leaves;
}`,
    java: `public List<Integer> findMinHeightTrees(int n, int[][] edges) {
    if(n==1) return Collections.singletonList(0);
    List<Set<Integer>> adj=new ArrayList<>();
    for(int i=0;i<n;i++) adj.add(new HashSet<>());
    for(int[] e:edges){adj.get(e[0]).add(e[1]);adj.get(e[1]).add(e[0]);}
    List<Integer> leaves=new ArrayList<>();
    for(int i=0;i<n;i++) if(adj.get(i).size()==1) leaves.add(i);
    int remaining=n;
    while(remaining>2){remaining-=leaves.size();List<Integer> nl=new ArrayList<>();for(int l:leaves){int nb=adj.get(l).iterator().next();adj.get(nb).remove(l);if(adj.get(nb).size()==1)nl.add(nb);}leaves=nl;}
    return leaves;
}`,
  },
  defaultInput: {
    n: 6,
    edges: [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Nodes labeled 0 to n-1',
    },
    {
      name: 'edges',
      label: 'Edges [u, v]',
      type: 'array',
      defaultValue: [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]],
      placeholder: '[[3,0],[3,1],[3,2],[3,4],[5,4]]',
      helperText: 'Undirected edges of the tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    if (n === 1) {
      steps.push({
        line: 1,
        explanation: 'Only one node. Root is [0].',
        variables: { result: [0] },
        visualization: {
          type: 'array',
          array: [0],
          highlights: { 0: 'found' },
          labels: { 0: 'root' },
        },
      });
      return steps;
    }

    const degree = new Array(n).fill(0);
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
    for (const [u, v] of edges) {
      adj[u].add(v);
      adj[v].add(u);
      degree[u]++;
      degree[v]++;
    }

    const removed = new Array(n).fill(false);

    function makeViz(
      highlights: Record<number, string>,
      leaves: number[],
      remaining: number,
      round: number
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) labels[i] = `n${i}:${removed[i] ? 'X' : adj[i].size}`;
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => removed[i] ? -1 : adj[i].size),
        highlights,
        labels,
        auxData: {
          label: 'Leaf Trimming',
          entries: [
            { key: 'Round', value: String(round) },
            { key: 'Remaining nodes', value: String(remaining) },
            { key: 'Current leaves', value: leaves.join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 2,
      explanation: `Build adjacency. Array shows degree of each node. Leaf nodes (degree=1) will be trimmed iteratively.`,
      variables: { degree: [...degree] },
      visualization: makeViz({}, [], n, 0),
    });

    let leaves = [];
    for (let i = 0; i < n; i++) {
      if (adj[i].size === 1) leaves.push(i);
    }

    const leafHL: Record<number, string> = {};
    for (const l of leaves) leafHL[l] = 'swapping';
    steps.push({
      line: 5,
      explanation: `Initial leaves (degree=1): [${leaves.join(', ')}]. Trim them round by round until ≤2 nodes remain.`,
      variables: { leaves: [...leaves] },
      visualization: makeViz(leafHL, [...leaves], n, 0),
    });

    let remaining = n;
    let round = 1;

    while (remaining > 2) {
      remaining -= leaves.length;
      const newLeaves: number[] = [];

      for (const leaf of leaves) {
        removed[leaf] = true;
        for (const nb of adj[leaf]) {
          adj[nb].delete(leaf);
          if (adj[nb].size === 1) {
            newLeaves.push(nb);
          }
        }
        adj[leaf].clear();
      }

      const hl: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (removed[i]) hl[i] = 'visited';
      }
      for (const nl of newLeaves) hl[nl] = 'active';

      steps.push({
        line: 11,
        explanation: `Round ${round}: trimmed ${leaves.join(', ')}. New leaves: [${newLeaves.join(', ')}]. Remaining: ${remaining}.`,
        variables: { round, trimmed: [...leaves], newLeaves: [...newLeaves], remaining },
        visualization: makeViz(hl, [...newLeaves], remaining, round),
      });

      leaves = newLeaves;
      round++;
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHL[i] = removed[i] ? 'visited' : 'found';
    }

    steps.push({
      line: 13,
      explanation: `Trimming complete. Remaining nodes are the MHT roots: [${leaves.join(', ')}]. These minimize tree height.`,
      variables: { result: [...leaves] },
      visualization: makeViz(finalHL, [...leaves], remaining, round),
    });

    return steps;
  },
};

export default minimumHeightTrees;
