import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findTheCityWithSmallestNeighbors: AlgorithmDefinition = {
  id: 'find-the-city-with-smallest-neighbors',
  title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
  leetcodeNumber: 1334,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n cities connected by weighted edges, find the city with the fewest reachable neighbors within a distance threshold. Uses Floyd-Warshall to compute all-pairs shortest paths, then counts reachable cities for each node. Return the city with the smallest count (highest index on tie).',
  tags: ['graph', 'floyd-warshall', 'all-pairs shortest path', 'dynamic programming'],

  code: {
    pseudocode: `function findTheCity(n, edges, threshold):
  dist = n x n matrix, dist[i][i]=0, others=INF
  for each edge (u, v, w):
    dist[u][v] = dist[v][u] = w
  Floyd-Warshall:
  for k in 0..n-1:
    for i in 0..n-1:
      for j in 0..n-1:
        dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])
  result = city with min reachable neighbors in threshold
  return result`,

    python: `def findTheCity(n, edges, distanceThreshold):
    INF = float('inf')
    dist = [[INF]*n for _ in range(n)]
    for i in range(n): dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = dist[v][u] = w
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    res, minCount = -1, n
    for i in range(n):
        cnt = sum(1 for j in range(n) if i != j and dist[i][j] <= distanceThreshold)
        if cnt <= minCount:
            minCount, res = cnt, i
    return res`,

    javascript: `function findTheCity(n, edges, distanceThreshold) {
  const INF = Infinity;
  const dist = Array.from({length:n}, (_, i) => Array.from({length:n}, (_, j) => i===j?0:INF));
  for (const [u,v,w] of edges) { dist[u][v]=w; dist[v][u]=w; }
  for (let k=0;k<n;k++)
    for (let i=0;i<n;i++)
      for (let j=0;j<n;j++)
        if (dist[i][k]+dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k]+dist[k][j];
  let res=-1, minCnt=n;
  for (let i=0;i<n;i++) {
    const cnt = dist[i].filter((d,j)=>i!==j&&d<=distanceThreshold).length;
    if (cnt <= minCnt) { minCnt=cnt; res=i; }
  }
  return res;
}`,

    java: `public int findTheCity(int n, int[][] edges, int distanceThreshold) {
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE/2);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) { dist[e[0]][e[1]]=e[2]; dist[e[1]][e[0]]=e[2]; }
    for (int k=0;k<n;k++)
        for (int i=0;i<n;i++)
            for (int j=0;j<n;j++)
                dist[i][j] = Math.min(dist[i][j], dist[i][k]+dist[k][j]);
    int res=-1, minCnt=n;
    for (int i=0;i<n;i++) {
        int cnt=0;
        for (int j=0;j<n;j++) if (i!=j && dist[i][j]<=distanceThreshold) cnt++;
        if (cnt<=minCnt) { minCnt=cnt; res=i; }
    }
    return res;
}`,
  },

  defaultInput: {
    n: 4,
    edges: [[0,1,3],[1,2,1],[1,3,4],[2,3,1]],
    distanceThreshold: 4,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total number of cities',
    },
    {
      name: 'distanceThreshold',
      label: 'Distance Threshold',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Maximum reachable distance',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const distanceThreshold = input.distanceThreshold as number;
    const steps: AlgorithmStep[] = [];

    const INF = 10000;
    const dist: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 0 : INF))
    );

    for (const [u, v, w] of edges) {
      dist[u][v] = w;
      dist[v][u] = w;
    }

    steps.push({
      line: 2,
      explanation: `Initialize distance matrix. dist[i][i]=0, edge weights set, rest = INF. Threshold = ${distanceThreshold}.`,
      variables: { phase: 'init', threshold: distanceThreshold },
      visualization: {
        type: 'array',
        array: dist[0].map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'active' },
        labels: { 0: 'city 0 row' },
      },
    });

    // Floyd-Warshall
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const old = dist[i][j];
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push({
              line: 7,
              explanation: `k=${k}: dist[${i}][${j}] updated from ${old === INF ? 'INF' : old} to ${dist[i][j]} via city ${k}.`,
              variables: { k, i, j, newDist: dist[i][j] },
              visualization: {
                type: 'array',
                array: dist[i].map(d => (d === INF ? 999 : d)),
                highlights: { [j]: 'active', [k]: 'comparing' },
                labels: { [i]: `row ${i}`, [j]: 'updated' },
              },
            });
          }
        }
      }

      steps.push({
        line: 6,
        explanation: `Floyd-Warshall phase k=${k} complete. All paths through city ${k} have been considered.`,
        variables: { k, rowSums: dist.map(r => r.filter(d => d < INF).length) },
        visualization: {
          type: 'array',
          array: dist[k].map(d => (d === INF ? 999 : d)),
          highlights: { [k]: 'sorted' },
          labels: { [k]: `k=${k}` },
        },
      });
    }

    // Count reachable
    let result = -1;
    let minCount = n;
    const counts: number[] = [];
    for (let i = 0; i < n; i++) {
      let cnt = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j && dist[i][j] <= distanceThreshold) cnt++;
      }
      counts.push(cnt);
      if (cnt <= minCount) {
        minCount = cnt;
        result = i;
      }
    }

    steps.push({
      line: 10,
      explanation: `Count reachable neighbors within threshold ${distanceThreshold} for each city: [${counts.join(', ')}]. City ${result} has min count ${minCount}.`,
      variables: { counts: counts.join(', '), result, minCount },
      visualization: {
        type: 'array',
        array: counts,
        highlights: { [result]: 'found' },
        labels: { [result]: 'answer' },
      },
    });

    return steps;
  },
};

export default findTheCityWithSmallestNeighbors;
