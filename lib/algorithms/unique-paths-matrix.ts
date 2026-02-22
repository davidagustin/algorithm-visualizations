import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniquePathsMatrix: AlgorithmDefinition = {
  id: 'unique-paths-matrix',
  title: 'Unique Paths',
  leetcodeNumber: 62,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of unique paths from the top-left to the bottom-right corner of an m x n grid, moving only right or down. Use DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]. All cells in the first row and column have exactly 1 path.',
  tags: ['Matrix', 'Dynamic Programming', 'Math'],
  code: {
    pseudocode: `function uniquePaths(m, n):
  dp = m x n matrix
  for i: dp[i][0] = 1
  for j: dp[0][j] = 1
  for i from 1 to m-1:
    for j from 1 to n-1:
      dp[i][j] = dp[i-1][j] + dp[i][j-1]
  return dp[m-1][n-1]`,
    python: `def uniquePaths(m, n):
    dp = [[1]*n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]`,
    javascript: `function uniquePaths(m, n) {
  const dp=Array.from({length:m},()=>new Array(n).fill(1));
  for(let i=1;i<m;i++) for(let j=1;j<n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1];
  return dp[m-1][n-1];
}`,
    java: `public int uniquePaths(int m, int n) {
    int[][] dp=new int[m][n];
    for(int i=0;i<m;i++) dp[i][0]=1;
    for(int j=0;j<n;j++) dp[0][j]=1;
    for(int i=1;i<m;i++) for(int j=1;j<n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1];
    return dp[m-1][n-1];
}`,
  },
  defaultInput: { m: 3, n: 4 },
  inputFields: [
    { name: 'm', label: 'Rows (m)', type: 'number', defaultValue: 3, placeholder: '3', helperText: 'Number of rows' },
    { name: 'n', label: 'Cols (n)', type: 'number', defaultValue: 4, placeholder: '4', helperText: 'Number of columns' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(1));
    const steps: AlgorithmStep[] = [];

    function makeViz(curr: number, comparing: number[]): ArrayVisualization {
      const flat = dp.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `(${ri},${ci})=${flat[i]}`;
        highlights[i] = flat[i] > 1 ? 'visited' : 'default';
      }
      for (const c of comparing) highlights[c] = 'comparing';
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Unique Paths', entries: [{ key: 'Target', value: `dp[${m - 1}][${n - 1}]=${dp[m - 1][n - 1]}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count unique paths in ${m}x${n} grid (right/down only). First row and column = 1 path each.`,
      variables: { m, n },
      visualization: makeViz(-1, []),
    });

    steps.push({
      line: 4,
      explanation: `Base case: dp[i][0]=1 for all rows, dp[0][j]=1 for all cols (only one direction each).`,
      variables: {},
      visualization: makeViz(-1, []),
    });

    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const above = dp[i - 1][j], left = dp[i][j - 1];
        dp[i][j] = above + left;
        steps.push({
          line: 7,
          explanation: `dp[${i}][${j}] = dp[${i - 1}][${j}](${above}) + dp[${i}][${j - 1}](${left}) = ${dp[i][j]}.`,
          variables: { i, j, above, left, paths: dp[i][j] },
          visualization: makeViz(i * n + j, [(i - 1) * n + j, i * n + j - 1]),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Total unique paths = dp[${m - 1}][${n - 1}] = ${dp[m - 1][n - 1]}.`,
      variables: { result: dp[m - 1][n - 1] },
      visualization: makeViz((m - 1) * n + (n - 1), []),
    });

    return steps;
  },
};

export default uniquePathsMatrix;
