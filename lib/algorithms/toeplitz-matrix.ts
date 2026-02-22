import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const toeplitzMatrix: AlgorithmDefinition = {
  id: 'toeplitz-matrix',
  title: 'Toeplitz Matrix',
  leetcodeNumber: 766,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same element. Check each cell (not in the first row or first column) against its upper-left neighbor. If any mismatch is found, return false.',
  tags: ['array', 'matrix'],

  code: {
    pseudocode: `function isToeplitzMatrix(matrix):
  for i from 1 to rows-1:
    for j from 1 to cols-1:
      if matrix[i][j] != matrix[i-1][j-1]:
        return false
  return true`,

    python: `def isToeplitzMatrix(matrix: list[list[int]]) -> bool:
    for i in range(1, len(matrix)):
        for j in range(1, len(matrix[0])):
            if matrix[i][j] != matrix[i - 1][j - 1]:
                return False
    return True`,

    javascript: `function isToeplitzMatrix(matrix) {
  for (let i = 1; i < matrix.length; i++) {
    for (let j = 1; j < matrix[0].length; j++) {
      if (matrix[i][j] !== matrix[i - 1][j - 1]) return false;
    }
  }
  return true;
}`,

    java: `public boolean isToeplitzMatrix(int[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    for (int i = 1; i < rows; i++) {
        for (int j = 1; j < cols; j++) {
            if (matrix[i][j] != matrix[i - 1][j - 1]) return false;
        }
    }
    return true;
}`,
  },

  defaultInput: {
    matrix: [[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]],
      placeholder: '1,2,3,4,5,1,2,3,9,5,1,2',
      helperText: '2D matrix to check for Toeplitz property',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const flat = matrix.flat();

    steps.push({
      line: 1,
      explanation: `Matrix is ${rows}x${cols}. A Toeplitz matrix has all diagonals with equal elements. Check each cell against its upper-left neighbor.`,
      variables: { rows, cols },
      visualization: {
        type: 'array',
        array: [...flat],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        const curr = matrix[i][j];
        const above = matrix[i - 1][j - 1];
        const currIdx = i * cols + j;
        const aboveIdx = (i - 1) * cols + (j - 1);

        if (curr !== above) {
          steps.push({
            line: 4,
            explanation: `matrix[${i}][${j}]=${curr} != matrix[${i - 1}][${j - 1}]=${above}. Diagonal mismatch! Not Toeplitz.`,
            variables: { i, j, curr, above, result: false },
            visualization: {
              type: 'array',
              array: [...flat],
              highlights: { [currIdx]: 'mismatch', [aboveIdx]: 'mismatch' },
              labels: { [currIdx]: String(curr), [aboveIdx]: String(above) },
            },
          });
          return steps;
        }

        steps.push({
          line: 3,
          explanation: `matrix[${i}][${j}]=${curr} == matrix[${i - 1}][${j - 1}]=${above}. Diagonal matches.`,
          variables: { i, j, curr, above },
          visualization: {
            type: 'array',
            array: [...flat],
            highlights: { [currIdx]: 'found', [aboveIdx]: 'active' },
            labels: { [currIdx]: 'ok', [aboveIdx]: 'ref' },
          },
        });
      }
    }

    steps.push({
      line: 5,
      explanation: 'All diagonals are equal. Matrix is Toeplitz. Return true.',
      variables: { result: true },
      visualization: {
        type: 'array',
        array: [...flat],
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default toeplitzMatrix;
