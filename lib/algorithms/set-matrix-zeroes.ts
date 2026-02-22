import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const setMatrixZeroes: AlgorithmDefinition = {
  id: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  leetcodeNumber: 73,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. Do it in-place using the first row and first column as markers to achieve O(1) extra space beyond two boolean flags.',
  tags: ['array', 'matrix', 'in-place', 'hash table'],

  code: {
    pseudocode: `function setZeroes(matrix):
  firstRowZero = any zero in row 0
  firstColZero = any zero in col 0
  for i from 1 to rows-1:
    for j from 1 to cols-1:
      if matrix[i][j] == 0:
        matrix[i][0] = 0
        matrix[0][j] = 0
  for i from 1 to rows-1:
    for j from 1 to cols-1:
      if matrix[i][0]==0 or matrix[0][j]==0:
        matrix[i][j] = 0
  if firstRowZero: zero row 0
  if firstColZero: zero col 0`,

    python: `def setZeroes(matrix: list[list[int]]) -> None:
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(cols))
    first_col_zero = any(matrix[i][0] == 0 for i in range(rows))
    for i in range(1, rows):
        for j in range(1, cols):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    for i in range(1, rows):
        for j in range(1, cols):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    if first_row_zero:
        for j in range(cols): matrix[0][j] = 0
    if first_col_zero:
        for i in range(rows): matrix[i][0] = 0`,

    javascript: `function setZeroes(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const firstRowZero = matrix[0].some(v => v === 0);
  const firstColZero = matrix.some(r => r[0] === 0);
  for (let i = 1; i < rows; i++)
    for (let j = 1; j < cols; j++)
      if (matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
  for (let i = 1; i < rows; i++)
    for (let j = 1; j < cols; j++)
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
  if (firstRowZero) for (let j = 0; j < cols; j++) matrix[0][j] = 0;
  if (firstColZero) for (let i = 0; i < rows; i++) matrix[i][0] = 0;
}`,

    java: `public void setZeroes(int[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    boolean firstRowZero = false, firstColZero = false;
    for (int j = 0; j < cols; j++) if (matrix[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < rows; i++) if (matrix[i][0] == 0) firstColZero = true;
    for (int i = 1; i < rows; i++)
        for (int j = 1; j < cols; j++)
            if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
    for (int i = 1; i < rows; i++)
        for (int j = 1; j < cols; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
    if (firstRowZero) for (int j = 0; j < cols; j++) matrix[0][j] = 0;
    if (firstColZero) for (int i = 0; i < rows; i++) matrix[i][0] = 0;
}`,
  },

  defaultInput: {
    matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened rows)',
      type: 'array',
      defaultValue: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
      placeholder: '1,1,1,1,0,1,1,1,1',
      helperText: 'Provide a 2D matrix for visualization',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawMatrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];

    // Deep copy for manipulation
    const matrix = rawMatrix.map(row => [...row]);
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Flatten for visualization
    const flatten = (m: number[][]) => m.flat();

    steps.push({
      line: 1,
      explanation: `Matrix has ${rows} rows and ${cols} cols. Scan first row and column to set flags.`,
      variables: { rows, cols },
      visualization: {
        type: 'array',
        array: flatten(matrix),
        highlights: {},
        labels: {},
      },
    });

    const firstRowZero = matrix[0].some(v => v === 0);
    const firstColZero = matrix.some(r => r[0] === 0);

    steps.push({
      line: 2,
      explanation: `firstRowZero=${firstRowZero}, firstColZero=${firstColZero}. These flags preserve original zero info for first row/col.`,
      variables: { firstRowZero, firstColZero },
      visualization: {
        type: 'array',
        array: flatten(matrix),
        highlights: {},
        labels: {},
      },
    });

    // Mark zeros using first row/col as markers
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        if (matrix[i][j] === 0) {
          matrix[i][0] = 0;
          matrix[0][j] = 0;
          steps.push({
            line: 6,
            explanation: `Found zero at (${i},${j}). Mark row marker matrix[${i}][0]=0 and col marker matrix[0][${j}]=0.`,
            variables: { i, j },
            visualization: {
              type: 'array',
              array: flatten(matrix),
              highlights: { [i * cols + j]: 'active', [i * cols]: 'comparing', [j]: 'comparing' },
              labels: { [i * cols + j]: '0' },
            },
          });
        }
      }
    }

    // Apply zeroes
    for (let i = 1; i < rows; i++) {
      for (let j = 1; j < cols; j++) {
        if (matrix[i][0] === 0 || matrix[0][j] === 0) {
          matrix[i][j] = 0;
          steps.push({
            line: 11,
            explanation: `Row marker or col marker is 0 for (${i},${j}). Set matrix[${i}][${j}]=0.`,
            variables: { i, j },
            visualization: {
              type: 'array',
              array: flatten(matrix),
              highlights: { [i * cols + j]: 'found' },
              labels: { [i * cols + j]: '0' },
            },
          });
        }
      }
    }

    if (firstRowZero) {
      for (let j = 0; j < cols; j++) matrix[0][j] = 0;
    }
    if (firstColZero) {
      for (let i = 0; i < rows; i++) matrix[i][0] = 0;
    }

    steps.push({
      line: 14,
      explanation: 'Applied first row/col zeroes based on flags. Matrix transformation complete.',
      variables: { firstRowZero, firstColZero },
      visualization: {
        type: 'array',
        array: flatten(matrix),
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default setMatrixZeroes;
