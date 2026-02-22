import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumHeightTreesIi: AlgorithmDefinition = {
  id: 'minimum-height-trees-ii',
  title: 'Minimum Height Trees',
  leetcodeNumber: 310,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an undirected tree with n nodes, find all roots that produce minimum height trees. The key insight: roots of minimum height trees are always the center node(s) of the tree (at most 2). Use a topological sort approach: repeatedly trim leaf nodes (degree 1) until 1 or 2 nodes remain. Those are the MHT roots.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Tree'],
  code: {
    pseudocode: `function findMinHeightTrees(n, edges):
  if n == 1: return [0]
  adj = build adjacency list
  degree = degree of each node
  leaves = nodes with degree 1
  remaining = n
  while remaining > 2:
    remaining -= len(leaves)
    newLeaves = []
    for leaf in leaves:
      neighbor = the one neighbor of leaf
      degree[neighbor] -= 1
      if degree[neighbor] == 1:
        newLeaves.append(neighbor)
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
        new_leaves = []
        for leaf in leaves:
            neighbor = next(iter(adj[leaf]))
            adj[neighbor].remove(leaf)
            if len(adj[neighbor]) == 1:
                new_leaves.append(neighbor)
        leaves = new_leaves
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
    if (n == 1) return List.of(0);
    Set<Integer>[] adj = new HashSet[n];
    for (int i = 0; i < n; i++) adj[i] = new HashSet<>();
    for (int[] e : edges) { adj[e[0]].add(e[1]); adj[e[1]].add(e[0]); }
    List<Integer> leaves = new ArrayList<>();
    for (int i = 0; i < n; i++) if (adj[i].size() == 1) leaves.add(i);
    int remaining = n;
    while (remaining > 2) {
        remaining -= leaves.size();
        List<Integer> newLeaves = new ArrayList<>();
        for (int leaf : leaves) {
            int nb = adj[leaf].iterator().next();
            adj[nb].remove(leaf);
            if (adj[nb].size() == 1) newLeaves.add(nb);
        }
        leaves = newLeaves;
    }
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
      helperText: 'Nodes are labeled 0 to n-1',
    },
    {
      name: 'edges',
      label: 'Edges [u, v]',
      type: 'array',
      defaultValue: [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]],
      placeholder: '[[3,0],[3,1],[3,2],[3,4],[5,4]]',
      helperText: 'Undirected tree edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    if (n === 1) {
      steps.push({
        line: 1,
        explanation: 'Only one node. It is the root of the minimum height tree.',
        variables: { result: [0] },
        visualization: {
          type: 'array',
          array: [1],
          highlights: { 0: 'found' },
          labels: { 0: 'root' },
        },
      });
      return steps;
    }

    const degree = new Array(n).fill(0);
    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
    for (const [u, v] of edges) {
      adj[u].add(v); adj[v].add(u);
      degree[u]++; degree[v]++;
    }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      leaves: number[],
      remaining: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...degree],
        highlights,
        labels,
        auxData: {
          label: 'Minimum Height Trees',
          entries: [
            { key: 'Leaves', value: leaves.length > 0 ? leaves.join(', ') : 'none' },
            { key: 'Remaining', value: String(remaining) },
            { key: 'Degrees', value: degree.map((d, i) => `n${i}:${d}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 2,
      explanation: `Build adjacency list. Degrees: [${degree.map((d, i) => `n${i}=${d}`).join(', ')}].`,
      variables: { degrees: [...degree] },
      visualization: makeViz(
        {},
        Object.fromEntries(degree.map((d, i) => [i, `n${i}:${d}`])),
        [],
        n
      ),
    });

    let leaves: number[] = [];
    for (let i = 0; i < n; i++) if (degree[i] === 1) leaves.push(i);

    const leafHighlights: Record<number, string> = {};
    for (const l of leaves) leafHighlights[l] = 'active';

    steps.push({
      line: 6,
      explanation: `Initial leaves (degree=1): [${leaves.join(', ')}]. Trim them iteratively.`,
      variables: { leaves: [...leaves] },
      visualization: makeViz(leafHighlights, Object.fromEntries(degree.map((d, i) => [i, `n${i}:${d}`])), [...leaves], n),
    });

    let remaining = n;
    let round = 0;

    while (remaining > 2) {
      remaining -= leaves.length;
      round++;
      const newLeaves: number[] = [];

      for (const leaf of leaves) {
        degree[leaf] = 0;
        for (const nb of adj[leaf]) {
          adj[nb].delete(leaf);
          degree[nb]--;
          if (degree[nb] === 1) newLeaves.push(nb);
        }
        adj[leaf].clear();
      }

      const trimHighlights: Record<number, string> = {};
      for (const l of leaves) trimHighlights[l] = 'visited';
      for (const l of newLeaves) trimHighlights[l] = 'active';

      steps.push({
        line: 10,
        explanation: `Round ${round}: Trim leaves [${leaves.join(', ')}]. New leaves: [${newLeaves.join(', ')}]. Remaining: ${remaining}.`,
        variables: { trimmed: [...leaves], newLeaves: [...newLeaves], remaining },
        visualization: makeViz(
          trimHighlights,
          Object.fromEntries(degree.map((d, i) => [i, `n${i}:${d}`])),
          [...newLeaves],
          remaining
        ),
      });

      leaves = newLeaves;
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'visited';
    for (const l of leaves) finalHighlights[l] = 'found';

    steps.push({
      line: 15,
      explanation: `MHT roots: [${leaves.join(', ')}]. These are the center node(s) of the tree.`,
      variables: { result: [...leaves] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(degree.map((d, i) => [i, leaves.includes(i) ? 'root' : `n${i}`])),
        [...leaves],
        leaves.length
      ),
    });

    return steps;
  },
};

export default minimumHeightTreesIi;
