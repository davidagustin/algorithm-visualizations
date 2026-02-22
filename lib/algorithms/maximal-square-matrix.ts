import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximalSquareMatrix: AlgorithmDefinition = {
  id: 'maximal-square-matrix',
  title: 'Maximal Square',
  leetcodeNumber: 221,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    "Find the largest square containing only 1s in a binary matrix and return its area. Use DP: dp[i][j] = side length of the largest square whose bottom-right corner is at (i,j). dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 when matrix[i][j]=='1'.",
  tags: ['Matrix', 'Dynamic Programming'],
  code: {
    pseudocode: `function maximalSquare(matrix):
  m, n = size(matrix)
  dp = m x n zeros
  maxSide = 0
  for i,j:
    if matrix[i][j] == '1':
      if i==0 or j==0: dp[i][j]=1
      else: dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
      maxSide = max(maxSide, dp[i][j])
  return maxSide * maxSide`,
    python: `def maximalSquare(matrix):
    m, n = len(matrix), len(matrix[0])
    dp = [[0]*n for _ in range(m)]
    maxSide = 0
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i==0 or j==0: dp[i][j]=1
                else: dp[i][j]=min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])+1
                maxSide=max(maxSide,dp[i][j])
    return maxSide*maxSide`,
    javascript: `function maximalSquare(matrix) {
  const m=matrix.length, n=matrix[0].length;
  const dp=Array.from({length:m},()=>new Array(n).fill(0));
  let maxSide=0;
  for(let i=0;i<m;i++) for(let j=0;j<n;j++)
    if(matrix[i][j]==='1'||matrix[i][j]===1) {
      dp[i][j]=(i===0||j===0)?1:Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])+1;
      maxSide=Math.max(maxSide,dp[i][j]);
    }
  return maxSide*maxSide;
}`,
    java: `public int maximalSquare(char[][] matrix) {
    int m=matrix.length, n=matrix[0].length, maxSide=0;
    int[][] dp=new int[m][n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(matrix[i][j]=='1') {
            dp[i][j]=(i==0||j==0)?1:Math.min(dp[i-1][j],Math.min(dp[i][j-1],dp[i-1][j-1]))+1;
            maxSide=Math.max(maxSide,dp[i][j]);
        }
    return maxSide*maxSide;
}`,
  },
  defaultInput: { matrix: [[1, 0, 1, 0, 0], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [1, 0, 0, 1, 0]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'string',
      defaultValue: '1 0 1 0 0, 1 0 1 1 1, 1 1 1 1 1, 1 0 0 1 0',
      placeholder: 'e.g. 1 0 1 0 0, 1 0 1 1 1',
      helperText: 'Rows by commas, binary values (0 or 1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = matrix.length, n = matrix[0].length;
    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    let maxSide = 0;
    const steps: AlgorithmStep[] = [];

    function makeViz(curr: number, comparing: number[]): ArrayVisualization {
      const flatDP = dp.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${matrix[ri][ci]}|dp:${dp[ri][ci]}`;
        highlights[i] = dp[ri][ci] > 0 ? 'visited' : matrix[ri][ci] === 0 ? 'default' : 'found';
      }
      for (const c of comparing) highlights[c] = 'comparing';
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: flatDP,
        highlights,
        labels,
        auxData: { label: 'Maximal Square', entries: [{ key: 'MaxSide', value: `${maxSide}` }, { key: 'Area', value: `${maxSide * maxSide}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Maximal square of 1s in ${m}x${n} binary matrix. dp[i][j] = side length of largest square with bottom-right at (i,j).`,
      variables: { m, n },
      visualization: makeViz(-1, []),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (matrix[i][j] === 1) {
          const idx = i * n + j;
          if (i === 0 || j === 0) {
            dp[i][j] = 1;
            steps.push({
              line: 7,
              explanation: `(${i},${j})=1 on border → dp[${i}][${j}]=1.`,
              variables: { i, j, dp: 1 },
              visualization: makeViz(idx, []),
            });
          } else {
            const a = dp[i - 1][j], b = dp[i][j - 1], c = dp[i - 1][j - 1];
            dp[i][j] = Math.min(a, b, c) + 1;
            steps.push({
              line: 8,
              explanation: `dp[${i}][${j}] = min(above=${a}, left=${b}, diag=${c}) + 1 = ${dp[i][j]}.`,
              variables: { i, j, above: a, left: b, diag: c, dp: dp[i][j] },
              visualization: makeViz(idx, [(i - 1) * n + j, i * n + j - 1, (i - 1) * n + j - 1]),
            });
          }
          if (dp[i][j] > maxSide) maxSide = dp[i][j];
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Largest square side = ${maxSide}. Area = ${maxSide * maxSide}.`,
      variables: { maxSide, area: maxSide * maxSide },
      visualization: makeViz(-1, []),
    });

    return steps;
  },
};

export default maximalSquareMatrix;
