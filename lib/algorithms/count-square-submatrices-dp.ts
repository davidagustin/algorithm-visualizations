import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSquareSubmatricesDp: AlgorithmDefinition = {
  id: 'count-square-submatrices-dp',
  title: 'Count Square Submatrices with All Ones (DP)',
  leetcodeNumber: 1277,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the total number of square submatrices that contain all ones. Use DP where dp[r][c] represents the side length of the largest square whose bottom-right corner is (r,c). A cell with value 1 contributes dp[r][c] to the total count (one square of each size from 1 to dp[r][c]).',
  tags: ['dynamic programming', 'grid', 'matrix', 'squares', 'counting'],

  code: {
    pseudocode: `function countSquares(matrix):
  total = 0
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      if matrix[r][c] == 1 and r > 0 and c > 0:
        matrix[r][c] = min(matrix[r-1][c], matrix[r][c-1], matrix[r-1][c-1]) + 1
      total += matrix[r][c]
  return total`,
    python: `def countSquares(matrix):
    total=0
    for r in range(len(matrix)):
        for c in range(len(matrix[0])):
            if matrix[r][c] and r and c:
                matrix[r][c]=min(matrix[r-1][c],matrix[r][c-1],matrix[r-1][c-1])+1
            total+=matrix[r][c]
    return total`,
    javascript: `function countSquares(matrix) {
  let total = 0;
  for (let r = 0; r < matrix.length; r++)
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] && r && c)
        matrix[r][c] = Math.min(matrix[r-1][c],matrix[r][c-1],matrix[r-1][c-1])+1;
      total += matrix[r][c];
    }
  return total;
}`,
    java: `public int countSquares(int[][] matrix) {
    int total=0;
    for(int r=0;r<matrix.length;r++)
        for(int c=0;c<matrix[0].length;c++) {
            if(matrix[r][c]>0&&r>0&&c>0)
                matrix[r][c]=Math.min(Math.min(matrix[r-1][c],matrix[r][c-1]),matrix[r-1][c-1])+1;
            total+=matrix[r][c];
        }
    return total;
}`,
  },

  defaultInput: {
    matrix: [[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'array',
      defaultValue: [[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]],
      placeholder: '[[0,1,1,1],[1,1,1,1],[0,1,1,1]]',
      helperText: '2D binary matrix (0s and 1s)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const orig = input.matrix as number[][];
    const rows = orig.length;
    const cols = orig[0].length;
    const steps: AlgorithmStep[] = [];

    // Work on a copy
    const matrix = orig.map(r => [...r]);
    let total = 0;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Count all square submatrices of all-ones in a ${rows}x${cols} binary matrix. dp[r][c] = side of largest square at (r,c).`,
      variables: { rows, cols, total: 0 },
      visualization: makeViz(matrix.flat(), {}, {}),
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] > 0 && r > 0 && c > 0) {
          matrix[r][c] = Math.min(matrix[r - 1][c], matrix[r][c - 1], matrix[r - 1][c - 1]) + 1;
        }
        total += matrix[r][c];

        const hi: Record<number, string> = { [r * cols + c]: matrix[r][c] > 0 ? 'active' : 'mismatch' };
        const lb: Record<number, string> = { [r * cols + c]: `${matrix[r][c]}` };

        steps.push({
          line: 5,
          explanation: `Cell (${r},${c}): dp=${matrix[r][c]} (contributes ${matrix[r][c]} squares). Running total = ${total}`,
          variables: { r, c, dpVal: matrix[r][c], contribution: matrix[r][c], total },
          visualization: makeViz(matrix.flat(), hi, lb),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Total square submatrices with all ones = ${total}`,
      variables: { answer: total },
      visualization: makeViz(matrix.flat(), {}, {}),
    });

    return steps;
  },
};

export default countSquareSubmatricesDp;
