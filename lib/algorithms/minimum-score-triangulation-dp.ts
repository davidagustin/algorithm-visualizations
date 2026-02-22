import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumScoreTriangulationDp: AlgorithmDefinition = {
  id: 'minimum-score-triangulation-dp',
  title: 'Minimum Score Triangulation of Polygon (DP)',
  leetcodeNumber: 1039,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a convex polygon with n vertices, triangulate it into n-2 triangles. Each triangle score is the product of its three vertex values. Find the minimum total score. Uses interval DP: dp[i][j] = min score to triangulate the sub-polygon from vertex i to j. Try each vertex k as the triangle apex.',
  tags: ['dynamic programming', 'interval dp', 'math', 'geometry'],

  code: {
    pseudocode: `function minScoreTriangulation(values):
  n = len(values)
  dp[i][j] = min score triangulating polygon from i to j
  for len from 2 to n-1:
    for i from 0 to n-1-len:
      j = i + len
      dp[i][j] = infinity
      for k from i+1 to j-1:
        score = values[i]*values[j]*values[k] + dp[i][k] + dp[k][j]
        dp[i][j] = min(dp[i][j], score)
  return dp[0][n-1]`,
    python: `def minScoreTriangulation(values):
    n = len(values)
    dp = [[0]*n for _ in range(n)]
    for length in range(2, n):
        for i in range(n-length):
            j = i+length
            dp[i][j] = float('inf')
            for k in range(i+1, j):
                score = values[i]*values[j]*values[k]+dp[i][k]+dp[k][j]
                dp[i][j] = min(dp[i][j], score)
    return dp[0][n-1]`,
    javascript: `function minScoreTriangulation(values) {
  const n = values.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(0));
  for (let len=2;len<n;len++)
    for (let i=0;i<n-len;i++) {
      const j=i+len;
      dp[i][j]=Infinity;
      for (let k=i+1;k<j;k++) {
        const score=values[i]*values[j]*values[k]+dp[i][k]+dp[k][j];
        dp[i][j]=Math.min(dp[i][j],score);
      }
    }
  return dp[0][n-1];
}`,
    java: `public int minScoreTriangulation(int[] values) {
    int n = values.length;
    int[][] dp = new int[n][n];
    for (int len=2;len<n;len++)
        for (int i=0;i<n-len;i++) {
            int j=i+len;
            dp[i][j]=Integer.MAX_VALUE/2;
            for (int k=i+1;k<j;k++) {
                int score=values[i]*values[j]*values[k]+dp[i][k]+dp[k][j];
                dp[i][j]=Math.min(dp[i][j],score);
            }
        }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    values: [1, 3, 1, 4, 1, 5],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Polygon Vertex Values',
      type: 'array',
      defaultValue: [1, 3, 1, 4, 1, 5],
      placeholder: '1,3,1,4,1,5',
      helperText: 'Comma-separated vertex values of convex polygon',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = input.values as number[];
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...values],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Min Score Triangulation: polygon vertices=[${values.join(', ')}]. Triangulate into ${n - 2} triangles, minimize sum of triangle products.`,
      variables: { n, triangles: n - 2 },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    steps.push({
      line: 4,
      explanation: 'Base cases: dp[i][j]=0 when j-i < 2. No triangle can be formed from fewer than 3 vertices.',
      variables: {},
      visualization: makeViz(
        Object.fromEntries(values.map((_, i) => [i, 'active'])),
        Object.fromEntries(values.map((v, i) => [i, `v${i}=${v}`]))
      ),
    });

    for (let len = 2; len < n; len++) {
      for (let i = 0; i < n - len; i++) {
        const j = i + len;
        dp[i][j] = Infinity;
        let bestK = i + 1;
        for (let k = i + 1; k < j; k++) {
          const score = values[i] * values[j] * values[k] + dp[i][k] + dp[k][j];
          if (score < dp[i][j]) {
            dp[i][j] = score;
            bestK = k;
          }
        }

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        highlights[i] = 'active';
        highlights[j] = 'active';
        highlights[bestK] = 'found';
        labels[i] = `i=${i}`;
        labels[j] = `j=${j}`;
        labels[bestK] = `k=${bestK}`;

        if (len <= 3 || (i === 0 && j === n - 1)) {
          steps.push({
            line: 8,
            explanation: `dp[${i}][${j}]=${dp[i][j]}. Best triangle: vertices ${i},${bestK},${j} with values ${values[i]}*${values[bestK]}*${values[j]}=${values[i] * values[bestK] * values[j]}.`,
            variables: { i, j, bestK, 'dp[i][j]': dp[i][j], triangle_score: values[i] * values[bestK] * values[j] },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[0][${n - 1}]=${dp[0][n - 1]}. Minimum total score for triangulating the entire polygon.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz(
        Object.fromEntries(values.map((_, i) => [i, 'found'])),
        { 0: `min:${dp[0][n - 1]}` }
      ),
    });

    return steps;
  },
};

export default minimumScoreTriangulationDp;
