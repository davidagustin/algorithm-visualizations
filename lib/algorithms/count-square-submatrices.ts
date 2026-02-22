import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const countSquareSubmatrices: AlgorithmDefinition = {
  id: 'count-square-submatrices',
  title: 'Count Square Submatrices with All Ones',
  leetcodeNumber: 1277,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a binary matrix, return the number of square submatrices that contain all 1s. The key insight is that dp[i][j] represents the side length of the largest square whose bottom-right corner is at (i,j). This value also equals the number of squares that end at (i,j). The total count is the sum of all dp[i][j] values. When matrix[i][j] is 1, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
  tags: ['dp', 'matrix', 'square', 'counting'],

  code: {
    pseudocode: `function countSquares(matrix):
  rows = len(matrix), cols = len(matrix[0])
  dp = copy of matrix
  total = sum of first row + first col
  for i from 1 to rows-1:
    for j from 1 to cols-1:
      if matrix[i][j] == 1:
        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
      total += dp[i][j]
  return total`,
    python: `def countSquares(matrix):
    rows, cols = len(matrix), len(matrix[0])
    dp = [row[:] for row in matrix]
    total = sum(dp[0]) + sum(dp[i][0] for i in range(1, rows))
    for i in range(1, rows):
        for j in range(1, cols):
            if dp[i][j] == 1:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
            total += dp[i][j]
    return total`,
    javascript: `function countSquares(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dp = matrix.map(row => [...row]);
  let total = dp[0].reduce((a,b)=>a+b,0) +
              dp.slice(1).reduce((s,row)=>s+row[0],0);
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      if (dp[i][j] === 1) {
        dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
      total += dp[i][j];
    }
  }
  return total;
}`,
    java: `public int countSquares(int[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length, total = 0;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == 1 && i > 0 && j > 0) {
                matrix[i][j] = 1 + Math.min(matrix[i-1][j],
                    Math.min(matrix[i][j-1], matrix[i-1][j-1]));
            }
            total += matrix[i][j];
        }
    }
    return total;
}`,
  },

  defaultInput: {
    matrix: [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 1, 1, 1],
    ],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'array',
      defaultValue: [
        [0, 1, 1, 1],
        [1, 1, 1, 1],
        [0, 1, 1, 1],
      ],
      placeholder: '[[0,1,1],[1,1,1]]',
      helperText: 'Nested array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const dp: number[][] = matrix.map(row => [...row]);
    let total = 0;

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

    // Count first row and col
    for (let j = 0; j < cols; j++) total += dp[0][j];
    for (let i = 1; i < rows; i++) total += dp[i][0];

    steps.push({
      line: 1,
      explanation: `Initialize DP (same as matrix for first row/col). Running total from edges = ${total}.`,
      variables: { rows, cols, total },
      visualization: makeViz({}),
    });

    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        const idx = i * cols + j;
        if (dp[i][j] === 1) {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          total += dp[i][j];
          steps.push({
            line: 8,
            explanation: `Cell (${i},${j}) is 1. dp[${i}][${j}] = 1 + min(${dp[i - 1][j]}, ${dp[i][j - 1]}, ${dp[i - 1][j - 1]}) = ${dp[i][j]}. Adds ${dp[i][j]} squares. Total = ${total}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], total },
            visualization: makeViz({
              [idx]: 'found',
              [(i - 1) * cols + j]: 'comparing',
              [i * cols + (j - 1)]: 'comparing',
              [(i - 1) * cols + (j - 1)]: 'comparing',
            }),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `Cell (${i},${j}) is 0. dp[${i}][${j}] = 0. No squares end here. Total = ${total}.`,
            variables: { i, j, 'dp[i][j]': 0, total },
            visualization: makeViz({ [idx]: 'visited' }),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Total square submatrices with all 1s = ${total}.`,
      variables: { result: total },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default countSquareSubmatrices;
