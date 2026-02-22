import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumScoreTriangulation: AlgorithmDefinition = {
  id: 'minimum-score-triangulation',
  title: 'Minimum Score Triangulation of Polygon',
  leetcodeNumber: 1039,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a convex polygon with n vertices, triangulate it into n-2 triangles. The score of a triangulation is the sum of products of the values at the three vertices of each triangle. Find the minimum total score. This is an interval DP problem: dp[i][j] = minimum score to triangulate the sub-polygon from vertex i to j. For each vertex k between i and j, we pick it as the apex of the triangle (i, k, j) and recurse on both sub-polygons.',
  tags: ['dp', 'interval dp', 'polygon', 'triangulation'],

  code: {
    pseudocode: `function minScoreTriangulation(values):
  n = len(values)
  dp = 2D array n x n, all 0
  for length from 2 to n-1:
    for i from 0 to n-length-1:
      j = i + length
      dp[i][j] = INFINITY
      for k from i+1 to j-1:
        score = values[i]*values[k]*values[j] + dp[i][k] + dp[k][j]
        dp[i][j] = min(dp[i][j], score)
  return dp[0][n-1]`,
    python: `def minScoreTriangulation(values):
    n = len(values)
    dp = [[0]*n for _ in range(n)]
    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i+1, j):
                dp[i][j] = min(dp[i][j],
                    values[i]*values[k]*values[j] + dp[i][k] + dp[k][j])
    return dp[0][n-1]`,
    javascript: `function minScoreTriangulation(values) {
  const n = values.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 0; i < n - len; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i+1; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j],
          values[i]*values[k]*values[j] + dp[i][k] + dp[k][j]);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int minScoreTriangulation(int[] values) {
    int n = values.length;
    int[][] dp = new int[n][n];
    for (int len = 2; len < n; len++) {
        for (int i = 0; i < n-len; i++) {
            int j = i+len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i+1; k < j; k++) {
                dp[i][j] = Math.min(dp[i][j],
                    values[i]*values[k]*values[j] + dp[i][k] + dp[k][j]);
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    values: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Polygon Vertex Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Values at each vertex of the convex polygon (n >= 3)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = input.values as number[];
    const steps: AlgorithmStep[] = [];
    const n = values.length;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Triangulate polygon with ${n} vertices: [${values.join(', ')}]. dp[i][j] = min score for sub-polygon i..j.`,
      variables: { n, values: values.join(',') },
      visualization: makeViz({}),
    });

    for (let length = 2; length < n; length++) {
      for (let i = 0; i < n - length; i++) {
        const j = i + length;
        const idx = i * n + j;
        dp[i][j] = Infinity;
        let bestK = i + 1;
        let bestScore = Infinity;

        for (let k = i + 1; k < j; k++) {
          const triangleScore = values[i] * values[k] * values[j];
          const totalScore = triangleScore + dp[i][k] + dp[k][j];
          steps.push({
            line: 8,
            explanation: `Sub-polygon (${i},${j}), apex k=${k}: triangle score = ${values[i]}*${values[k]}*${values[j]}=${triangleScore}. Total = ${triangleScore}+${dp[i][k]}+${dp[k][j]} = ${totalScore}.`,
            variables: { i, j, k, triangleScore, totalScore, currentMin: dp[i][j] === Infinity ? 'Inf' : dp[i][j] },
            visualization: makeViz({
              [idx]: 'active',
              [i * n + k]: 'comparing',
              [k * n + j]: 'comparing',
            }),
          });
          if (totalScore < bestScore) {
            bestScore = totalScore;
            bestK = k;
          }
          dp[i][j] = Math.min(dp[i][j], totalScore);
        }

        steps.push({
          line: 9,
          explanation: `Best for (${i},${j}): apex k=${bestK}, dp[${i}][${j}] = ${dp[i][j]}.`,
          variables: { i, j, bestK, 'dp[i][j]': dp[i][j] },
          visualization: makeViz({ [idx]: 'found' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum triangulation score = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz({ [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default minimumScoreTriangulation;
