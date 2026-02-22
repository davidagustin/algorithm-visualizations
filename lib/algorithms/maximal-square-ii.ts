import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximalSquareIi: AlgorithmDefinition = {
  id: 'maximal-square-ii',
  title: 'Maximal Square (Tracking Approach)',
  leetcodeNumber: 221,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area. This tracking approach uses a DP table where dp[i][j] represents the side length of the largest square whose bottom-right corner is at cell (i, j). For each cell containing 1, the value is 1 plus the minimum of the three neighboring DP values (top, left, top-left).',
  tags: ['dp', 'matrix', 'square', '2d dp'],

  code: {
    pseudocode: `function maximalSquare(matrix):
  rows = matrix.rows, cols = matrix.cols
  dp = 2D array of zeros (rows x cols)
  maxSide = 0
  for i from 0 to rows-1:
    for j from 0 to cols-1:
      if matrix[i][j] == '1':
        if i == 0 or j == 0:
          dp[i][j] = 1
        else:
          dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
        maxSide = max(maxSide, dp[i][j])
  return maxSide * maxSide`,
    python: `def maximalSquare(matrix):
    rows, cols = len(matrix), len(matrix[0])
    dp = [[0] * cols for _ in range(rows)]
    max_side = 0
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
                max_side = max(max_side, dp[i][j])
    return max_side * max_side`,
    javascript: `function maximalSquare(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dp = Array.from({length: rows}, () => new Array(cols).fill(0));
  let maxSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === '1') {
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
        } else {
          dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        }
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}`,
    java: `public int maximalSquare(char[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    int[][] dp = new int[rows][cols];
    int maxSide = 0;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == '1') {
                if (i == 0 || j == 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = 1 + Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1]));
                }
                maxSide = Math.max(maxSide, dp[i][j]);
            }
        }
    }
    return maxSide * maxSide;
}`,
  },

  defaultInput: {
    matrix: [
      [1, 0, 1, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0],
    ],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix (rows as arrays)',
      type: 'array',
      defaultValue: [
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0],
      ],
      placeholder: '[[1,0,1],[1,1,1]]',
      helperText: 'Nested array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    let maxSide = 0;

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP table of size ${rows}x${cols} with all zeros. We will fill each cell based on the matrix values.`,
      variables: { rows, cols, maxSide },
      visualization: makeViz({}),
    });

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const idx = i * cols + j;
        if (matrix[i][j] === 1) {
          if (i === 0 || j === 0) {
            dp[i][j] = 1;
            steps.push({
              line: 8,
              explanation: `Cell (${i},${j}) is 1 and on an edge. dp[${i}][${j}] = 1.`,
              variables: { i, j, 'dp[i][j]': 1, maxSide },
              visualization: makeViz({ [idx]: 'active' }),
            });
          } else {
            const top = dp[i - 1][j];
            const left = dp[i][j - 1];
            const diag = dp[i - 1][j - 1];
            dp[i][j] = 1 + Math.min(top, left, diag);
            steps.push({
              line: 10,
              explanation: `Cell (${i},${j}) is 1. dp[${i}][${j}] = 1 + min(top=${top}, left=${left}, diag=${diag}) = ${dp[i][j]}.`,
              variables: { i, j, top, left, diag, 'dp[i][j]': dp[i][j], maxSide },
              visualization: makeViz({
                [idx]: 'active',
                [(i - 1) * cols + j]: 'comparing',
                [i * cols + (j - 1)]: 'comparing',
                [(i - 1) * cols + (j - 1)]: 'comparing',
              }),
            });
          }
          if (dp[i][j] > maxSide) {
            maxSide = dp[i][j];
            steps.push({
              line: 11,
              explanation: `New max side length found: ${maxSide}. Area = ${maxSide * maxSide}.`,
              variables: { i, j, maxSide, area: maxSide * maxSide },
              visualization: makeViz({ [idx]: 'found' }),
            });
          }
        } else {
          steps.push({
            line: 6,
            explanation: `Cell (${i},${j}) is 0. dp[${i}][${j}] stays 0.`,
            variables: { i, j, 'dp[i][j]': 0, maxSide },
            visualization: makeViz({ [idx]: 'visited' }),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Maximum square side = ${maxSide}, area = ${maxSide * maxSide}.`,
      variables: { maxSide, result: maxSide * maxSide },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default maximalSquareIi;
