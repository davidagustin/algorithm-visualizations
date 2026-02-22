import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const floydWarshallAlgorithm: AlgorithmDefinition = {
  id: 'floyd-warshall-algorithm',
  title: 'Floyd-Warshall All-Pairs Shortest Path',
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Floyd-Warshall finds shortest paths between all pairs of vertices in a weighted graph. It uses dynamic programming: for each intermediate vertex k, it checks if routing through k improves any pair distance. Time complexity O(V^3).',
  tags: ['floyd-warshall', 'all-pairs shortest path', 'dynamic programming', 'graph'],

  code: {
    pseudocode: `function floydWarshall(dist, V):
  for k from 0 to V-1:
    for i from 0 to V-1:
      for j from 0 to V-1:
        if dist[i][k] + dist[k][j] < dist[i][j]:
          dist[i][j] = dist[i][k] + dist[k][j]
  return dist`,

    python: `def floyd_warshall(graph, V):
    dist = [row[:] for row in graph]
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,

    javascript: `function floydWarshall(graph, V) {
  const dist = graph.map(row => [...row]);
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`,

    java: `public int[][] floydWarshall(int[][] graph, int V) {
    int[][] dist = new int[V][V];
    for (int i = 0; i < V; i++)
        dist[i] = graph[i].clone();
    for (int k = 0; k < V; k++)
        for (int i = 0; i < V; i++)
            for (int j = 0; j < V; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    return dist;
}`,
  },

  defaultInput: {
    V: 4,
    matrix: [0, 3, 999, 7, 8, 0, 2, 999, 5, 999, 0, 1, 2, 999, 999, 0],
  },

  inputFields: [
    {
      name: 'V',
      label: 'Number of Vertices',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Graph size (NxN matrix)',
    },
    {
      name: 'matrix',
      label: 'Adjacency Matrix (flat)',
      type: 'array',
      defaultValue: [0, 3, 999, 7, 8, 0, 2, 999, 5, 999, 0, 1, 2, 999, 999, 0],
      placeholder: '0,3,999,7,...',
      helperText: 'Row-major flat matrix. Use 999 for no edge.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const V = input.V as number;
    const flat = input.matrix as number[];
    const steps: AlgorithmStep[] = [];

    const INF = 999;
    const dist: number[][] = Array.from({ length: V }, (_, i) =>
      Array.from({ length: V }, (__, j) => flat[i * V + j] ?? INF)
    );

    const flatDist = () => dist.flat();

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatDist(),
      highlights,
      labels: {},
    });

    steps.push({
      line: 1,
      explanation: `Initialize distance matrix from adjacency matrix. ${V}x${V} grid, 999 means no direct edge.`,
      variables: { V, matrix: flatDist() },
      visualization: makeViz({}),
    });

    for (let k = 0; k < V; k++) {
      steps.push({
        line: 2,
        explanation: `Using vertex ${k} as intermediate node. Checking if routing through ${k} shortens any path.`,
        variables: { k },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: V }, (_, i) => [k * V + i, 'active']))
        ),
      });

      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const old = dist[i][j];
            dist[i][j] = dist[i][k] + dist[k][j];
            steps.push({
              line: 5,
              explanation: `dist[${i}][${j}] via ${k}: ${old} -> ${dist[i][j]} (${dist[i][k]} + ${dist[k][j]}).`,
              variables: { k, i, j, 'old dist': old, 'new dist': dist[i][j] },
              visualization: makeViz({
                [i * V + k]: 'active',
                [k * V + j]: 'active',
                [i * V + j]: 'found',
              }),
            });
          }
        }
      }
    }

    steps.push({
      line: 7,
      explanation: 'Floyd-Warshall complete. All shortest pair distances computed.',
      variables: { result: flatDist() },
      visualization: makeViz(
        Object.fromEntries(flatDist().map((_, idx) => [idx, 'sorted']))
      ),
    });

    return steps;
  },
};

export default floydWarshallAlgorithm;
