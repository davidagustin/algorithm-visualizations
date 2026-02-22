import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const floydWarshallAllPairs: AlgorithmDefinition = {
  id: 'floyd-warshall-all-pairs',
  title: 'Floyd-Warshall: All Pairs Shortest Path',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Floyd-Warshall algorithm computes shortest paths between all pairs of nodes. For each intermediate node k, it checks if routing through k improves any path. Works with negative weights but not negative cycles. Time complexity O(V^3), space O(V^2).',
  tags: ['graph', 'floyd-warshall', 'all-pairs shortest path', 'dynamic programming', 'classic'],

  code: {
    pseudocode: `function floydWarshall(n, edges):
  dist[i][j] = weight(i,j) if edge exists, INF otherwise
  dist[i][i] = 0 for all i
  for k in 0 to n-1:        // intermediate node
    for i in 0 to n-1:      // source
      for j in 0 to n-1:    // destination
        if dist[i][k] + dist[k][j] < dist[i][j]:
          dist[i][j] = dist[i][k] + dist[k][j]
  return dist`,

    python: `def floydWarshall(n, edges):
    INF = float('inf')
    dist = [[INF]*n for _ in range(n)]
    for i in range(n): dist[i][i]=0
    for u,v,w in edges: dist[u][v]=w; dist[v][u]=w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k]+dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k]+dist[k][j]
    return dist`,

    javascript: `function floydWarshall(n, edges) {
  const INF = Infinity;
  const dist = Array.from({length:n}, (_,i) =>
    Array.from({length:n}, (_,j) => i===j?0:INF));
  for (const [u,v,w] of edges) { dist[u][v]=w; dist[v][u]=w; }
  for (let k=0;k<n;k++)
    for (let i=0;i<n;i++)
      for (let j=0;j<n;j++)
        if (dist[i][k]+dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k]+dist[k][j];
  return dist;
}`,

    java: `public int[][] floydWarshall(int n, int[][] edges) {
    int INF = Integer.MAX_VALUE/2;
    int[][] dist = new int[n][n];
    for (int[] r : dist) Arrays.fill(r, INF);
    for (int i=0;i<n;i++) dist[i][i]=0;
    for (int[] e : edges) { dist[e[0]][e[1]]=e[2]; dist[e[1]][e[0]]=e[2]; }
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                if (dist[i][k]+dist[k][j]<dist[i][j])
                    dist[i][j]=dist[i][k]+dist[k][j];
    return dist;
}`,
  },

  defaultInput: {
    n: 4,
    edges: [[0,1,5],[0,3,10],[1,2,3],[2,3,1]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total nodes in graph',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const INF = 9999;
    const dist: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 0 : INF))
    );
    for (const [u, v, w] of edges) {
      dist[u][v] = w;
      dist[v][u] = w;
    }

    steps.push({
      line: 2,
      explanation: `Initialize ${n}x${n} distance matrix. Direct edges set, diagonal = 0, rest = INF.`,
      variables: { n, edgeCount: edges.length },
      visualization: {
        type: 'array',
        array: dist[0].map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'active' },
        labels: { 0: 'row 0' },
      },
    });

    // Floyd-Warshall
    for (let k = 0; k < n; k++) {
      steps.push({
        line: 4,
        explanation: `Phase k=${k}: Consider all paths through node ${k} as intermediate.`,
        variables: { intermediate: k },
        visualization: {
          type: 'array',
          array: dist[k].map(d => (d === INF ? 999 : d)),
          highlights: { [k]: 'active' },
          labels: { [k]: `k=${k}` },
        },
      });

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] < INF && dist[k][j] < INF) {
            const newDist = dist[i][k] + dist[k][j];
            if (newDist < dist[i][j]) {
              const old = dist[i][j];
              dist[i][j] = newDist;
              steps.push({
                line: 7,
                explanation: `Update dist[${i}][${j}]: via k=${k}, ${dist[i][k]}+${dist[k][j]}=${newDist} < ${old === INF ? 'INF' : old}.`,
                variables: { i, j, k, newDist, old: old === INF ? 'INF' : old },
                visualization: {
                  type: 'array',
                  array: dist[i].map(d => (d === INF ? 999 : d)),
                  highlights: { [j]: 'comparing', [k]: 'active' },
                  labels: { [j]: `=${newDist}` },
                },
              });
            }
          }
        }
      }
    }

    // Show final row 0
    steps.push({
      line: 8,
      explanation: `Floyd-Warshall complete. All-pairs shortest paths computed. Showing distances from node 0: [${dist[0].map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
      variables: { distFromNode0: dist[0].map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist[0].map(d => (d === INF ? 999 : d)),
        highlights: Object.fromEntries(dist[0].map((d, i) => [i, d < INF ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(dist[0].map((d, i) => [i, `${d < INF ? d : 'INF'}`])),
      },
    });

    return steps;
  },
};

export default floydWarshallAllPairs;
