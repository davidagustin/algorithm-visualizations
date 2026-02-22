import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumFallingPathSum: AlgorithmDefinition = {
  id: 'minimum-falling-path-sum',
  title: 'Minimum Falling Path Sum',
  leetcodeNumber: 931,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an n x n matrix, return the minimum sum of any falling path (one element per row, adjacent columns allowed). Process row by row: for each cell, dp[j] = matrix[row][j] + min(prev[j-1], prev[j], prev[j+1]). This is a 1D DP per row approach.',
  tags: ['dynamic programming', 'matrix', 'path', '1D DP per row'],

  code: {
    pseudocode: `function minFallingPathSum(matrix):
  n = len(matrix)
  dp = matrix[0][:]
  for row from 1 to n-1:
    new_dp = array of n
    for j from 0 to n-1:
      best = dp[j]
      if j>0: best = min(best, dp[j-1])
      if j<n-1: best = min(best, dp[j+1])
      new_dp[j] = matrix[row][j] + best
    dp = new_dp
  return min(dp)`,

    python: `def minFallingPathSum(matrix: list[list[int]]) -> int:
    n = len(matrix)
    dp = matrix[0][:]
    for row in range(1, n):
        new_dp = [0] * n
        for j in range(n):
            best = dp[j]
            if j > 0: best = min(best, dp[j-1])
            if j < n-1: best = min(best, dp[j+1])
            new_dp[j] = matrix[row][j] + best
        dp = new_dp
    return min(dp)`,

    javascript: `function minFallingPathSum(matrix) {
  const n = matrix.length;
  let dp = [...matrix[0]];
  for (let row = 1; row < n; row++) {
    const newDp = new Array(n);
    for (let j = 0; j < n; j++) {
      let best = dp[j];
      if (j > 0) best = Math.min(best, dp[j-1]);
      if (j < n-1) best = Math.min(best, dp[j+1]);
      newDp[j] = matrix[row][j] + best;
    }
    dp = newDp;
  }
  return Math.min(...dp);
}`,

    java: `public int minFallingPathSum(int[][] matrix) {
    int n = matrix.length;
    int[] dp = matrix[0].clone();
    for (int row = 1; row < n; row++) {
        int[] newDp = new int[n];
        for (int j = 0; j < n; j++) {
            int best = dp[j];
            if (j > 0) best = Math.min(best, dp[j-1]);
            if (j < n-1) best = Math.min(best, dp[j+1]);
            newDp[j] = matrix[row][j] + best;
        }
        dp = newDp;
    }
    int res = dp[0];
    for (int v : dp) res = Math.min(res, v);
    return res;
}`,
  },

  defaultInput: { matrix: [[2, 1, 3], [6, 5, 4], [7, 8, 9]] },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened, n x n)',
      type: 'array',
      defaultValue: [2, 1, 3, 6, 5, 4, 7, 8, 9],
      placeholder: '2,1,3,6,5,4,7,8,9',
      helperText: 'Flattened n x n matrix row by row (sqrt of length = n)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.matrix as number[];
    const n = Math.round(Math.sqrt(flat.length));
    const matrix: number[][] = Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n));
    const steps: AlgorithmStep[] = [];

    let dp: number[] = [...matrix[0]];

    steps.push({
      line: 3,
      explanation: `Initialize dp = first row = [${dp.join(', ')}]. Matrix is ${n}x${n}.`,
      variables: { dp: dp.join(','), row: 0 },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((_, j) => [j, 'active'])),
        labels: dp.map((_, j) => `col${j}`),
      },
    });

    for (let row = 1; row < n; row++) {
      const newDp: number[] = Array(n);
      for (let j = 0; j < n; j++) {
        let best = dp[j];
        if (j > 0) best = Math.min(best, dp[j - 1]);
        if (j < n - 1) best = Math.min(best, dp[j + 1]);
        newDp[j] = matrix[row][j] + best;
      }
      dp = newDp;

      steps.push({
        line: 10,
        explanation: `Row ${row}: dp = [${dp.join(', ')}]. Each cell = matrix[${row}][j] + min of 3 neighbors above.`,
        variables: { row, dp: dp.join(',') },
        visualization: {
          type: 'dp-table',
          values: [...dp],
          highlights: Object.fromEntries(dp.map((_, j) => [j, 'active'])),
          labels: dp.map((_, j) => `r${row}c${j}`),
        } as DPVisualization,
      });
    }

    const result = Math.min(...dp);
    steps.push({
      line: 11,
      explanation: `Minimum falling path sum = min(dp) = min([${dp.join(', ')}]) = ${result}.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: Object.fromEntries(dp.map((v, j) => [j, v === result ? 'found' : 'sorted'])),
        labels: dp.map((_, j) => `col${j}`),
      },
    });

    return steps;
  },
};

export default minimumFallingPathSum;
