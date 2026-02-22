import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumStarSumOfGraph: AlgorithmDefinition = {
  id: 'maximum-star-sum-of-graph',
  title: 'Maximum Star Sum of a Graph',
  leetcodeNumber: 2497,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given a graph with node values and edges, a star graph is a center node plus any subset of its neighbors. The star sum is the sum of values of selected nodes. For each node as center, greedily add neighbors with positive values using a max heap approach. Return the maximum star sum.',
  tags: ['heap', 'greedy', 'graph', 'array'],

  code: {
    pseudocode: `function maxStarSum(vals, edges, k):
  neighbors = adjacency list of neighbor values
  maxSum = max(vals)  // single node star
  for each node v:
    neighborVals = sorted neighbor values descending
    starSum = vals[v]
    for i in 0..min(k, len(neighborVals))-1:
      if neighborVals[i] > 0:
        starSum += neighborVals[i]
    maxSum = max(maxSum, starSum)
  return maxSum`,

    python: `def maxStarSum(vals: list[int], edges: list[list[int]], k: int) -> int:
    n = len(vals)
    neighbors = [[] for _ in range(n)]
    for u, v in edges:
        neighbors[u].append(vals[v])
        neighbors[v].append(vals[u])
    max_sum = max(vals)
    for v in range(n):
        neighbors[v].sort(reverse=True)
        star = vals[v]
        for i in range(min(k, len(neighbors[v]))):
            if neighbors[v][i] > 0:
                star += neighbors[v][i]
        max_sum = max(max_sum, star)
    return max_sum`,

    javascript: `function maxStarSum(vals, edges, k) {
  const n = vals.length;
  const neighbors = Array.from({length: n}, () => []);
  for (const [u, v] of edges) {
    neighbors[u].push(vals[v]);
    neighbors[v].push(vals[u]);
  }
  let maxSum = Math.max(...vals);
  for (let v = 0; v < n; v++) {
    neighbors[v].sort((a,b)=>b-a);
    let star = vals[v];
    for (let i = 0; i < Math.min(k, neighbors[v].length); i++) {
      if (neighbors[v][i] > 0) star += neighbors[v][i];
    }
    maxSum = Math.max(maxSum, star);
  }
  return maxSum;
}`,

    java: `public int maxStarSum(int[] vals, int[][] edges, int k) {
    int n = vals.length;
    List<Integer>[] neighbors = new List[n];
    for (int i = 0; i < n; i++) neighbors[i] = new ArrayList<>();
    for (int[] e : edges) {
        neighbors[e[0]].add(vals[e[1]]);
        neighbors[e[1]].add(vals[e[0]]);
    }
    int maxSum = Arrays.stream(vals).max().getAsInt();
    for (int v = 0; v < n; v++) {
        neighbors[v].sort(Collections.reverseOrder());
        int star = vals[v];
        for (int i = 0; i < Math.min(k, neighbors[v].size()); i++) {
            if (neighbors[v].get(i) > 0) star += neighbors[v].get(i);
        }
        maxSum = Math.max(maxSum, star);
    }
    return maxSum;
}`,
  },

  defaultInput: {
    vals: [1, 2, 3, 4, 10, -10, -20],
    edges: [0, 1, 1, 2, 1, 3, 3, 4, 3, 5, 3, 6],
    k: 2,
  },

  inputFields: [
    {
      name: 'vals',
      label: 'Node Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 10, -10, -20],
      placeholder: '1,2,3,4,10,-10,-20',
      helperText: 'Value of each node',
    },
    {
      name: 'edges',
      label: 'Edges (u,v pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 2, 1, 3, 3, 4, 3, 5, 3, 6],
      placeholder: '0,1,1,2,1,3',
      helperText: 'Pairs of undirected edge endpoints',
    },
    {
      name: 'k',
      label: 'K (max neighbors)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum neighbors in star',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const vals = input.vals as number[];
    const flatEdges = input.edges as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = vals.length;

    const edgePairs: [number, number][] = [];
    for (let i = 0; i + 1 < flatEdges.length; i += 2) {
      edgePairs.push([flatEdges[i], flatEdges[i + 1]]);
    }

    const neighbors: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edgePairs) {
      neighbors[u].push(vals[v]);
      neighbors[v].push(vals[u]);
    }

    steps.push({
      line: 1,
      explanation: `Build adjacency with neighbor values. ${n} nodes, ${edgePairs.length} edges. k=${k}.`,
      variables: { n, edges: edgePairs.length, k },
      visualization: {
        type: 'array',
        array: vals,
        highlights: {},
        labels: Object.fromEntries(vals.map((v, i) => [i, `v${i}=${v}`])),
      } as ArrayVisualization,
    });

    let maxSum = Math.max(...vals);

    for (let v = 0; v < n; v++) {
      const sorted = [...neighbors[v]].sort((a, b) => b - a);
      let star = vals[v];
      let added = 0;

      for (let i = 0; i < Math.min(k, sorted.length); i++) {
        if (sorted[i] > 0) { star += sorted[i]; added++; }
      }

      const improved = star > maxSum;
      if (improved) maxSum = star;

      steps.push({
        line: 7,
        explanation: `Node ${v} (val=${vals[v]}): top-${k} neighbors=[${sorted.slice(0, k).join(',')}]. Added ${added} positive neighbors. Star sum=${star}. ${improved ? 'New max!' : `Best=${maxSum}`}`,
        variables: { node: v, val: vals[v], starSum: star, maxSum, added },
        visualization: {
          type: 'array',
          array: vals,
          highlights: {
            [v]: improved ? 'found' : 'active',
            ...Object.fromEntries(edgePairs.filter(([u, vv]) => u === v || vv === v).map(([u, vv]) => [u === v ? vv : u, 'comparing'])),
          },
          labels: { [v]: `star=${star}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 9,
      explanation: `Maximum star sum: ${maxSum}`,
      variables: { result: maxSum },
      visualization: {
        type: 'array',
        array: vals,
        highlights: {},
        labels: { 0: `max=${maxSum}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumStarSumOfGraph;
