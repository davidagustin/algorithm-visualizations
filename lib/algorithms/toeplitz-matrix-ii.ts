import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const toeplitzMatrixII: AlgorithmDefinition = {
  id: 'toeplitz-matrix-ii',
  title: 'Toeplitz Matrix',
  leetcodeNumber: 766,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same element. Check this by verifying matrix[i][j] == matrix[i-1][j-1] for all valid i, j.',
  tags: ['Matrix', 'Validation'],
  code: {
    pseudocode: `function isToeplitzMatrix(matrix):
  for i from 1 to rows-1:
    for j from 1 to cols-1:
      if matrix[i][j] != matrix[i-1][j-1]:
        return false
  return true`,
    python: `def isToeplitzMatrix(matrix):
    for i in range(1, len(matrix)):
        for j in range(1, len(matrix[0])):
            if matrix[i][j] != matrix[i-1][j-1]:
                return False
    return True`,
    javascript: `function isToeplitzMatrix(matrix) {
  for (let i = 1; i < matrix.length; i++)
    for (let j = 1; j < matrix[0].length; j++)
      if (matrix[i][j] !== matrix[i-1][j-1]) return false;
  return true;
}`,
    java: `public boolean isToeplitzMatrix(int[][] matrix) {
    for (int i=1;i<matrix.length;i++)
        for (int j=1;j<matrix[0].length;j++)
            if (matrix[i][j]!=matrix[i-1][j-1]) return false;
    return true;
}`,
  },
  defaultInput: { matrix: [[1, 2, 3, 4], [5, 1, 2, 3], [9, 5, 1, 2]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'string',
      defaultValue: '1 2 3 4, 5 1 2 3, 9 5 1 2',
      placeholder: 'e.g. 1 2 3 4, 5 1 2 3, 9 5 1 2',
      helperText: 'Rows by commas, values by spaces',
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
    const steps: AlgorithmStep[] = [];
    let isToeplitz = true;

    function makeViz(curr: number, prev: number, match: boolean): ArrayVisualization {
      const flat = matrix.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${flat[i]}`;
        highlights[i] = 'default';
        // Color same-diagonal cells
        const diagKey = ci - ri;
        highlights[i] = diagKey % 3 === 0 ? 'visited' : diagKey % 3 === 1 ? 'sorted' : 'default';
      }
      if (curr >= 0) highlights[curr] = match ? 'found' : 'mismatch';
      if (prev >= 0) highlights[prev] = match ? 'active' : 'swapping';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Toeplitz Matrix', entries: [{ key: 'Valid', value: isToeplitz ? 'Yes' : 'No' }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Check if ${m}x${n} matrix is Toeplitz: every diagonal has the same elements. Verify matrix[i][j] == matrix[i-1][j-1].`,
      variables: { m, n },
      visualization: makeViz(-1, -1, true),
    });

    outer:
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        const curr = i * n + j;
        const prev = (i - 1) * n + (j - 1);
        const match = matrix[i][j] === matrix[i - 1][j - 1];
        steps.push({
          line: 4,
          explanation: `matrix[${i}][${j}]=${matrix[i][j]} vs matrix[${i - 1}][${j - 1}]=${matrix[i - 1][j - 1]}: ${match ? 'match' : 'MISMATCH → not Toeplitz'}.`,
          variables: { i, j, curr: matrix[i][j], prev: matrix[i - 1][j - 1], match },
          visualization: makeViz(curr, prev, match),
        });
        if (!match) { isToeplitz = false; break outer; }
      }
    }

    steps.push({
      line: 6,
      explanation: isToeplitz ? 'All diagonals uniform. Matrix IS Toeplitz.' : 'Diagonal mismatch found. Matrix is NOT Toeplitz.',
      variables: { isToeplitz },
      visualization: makeViz(-1, -1, isToeplitz),
    });

    return steps;
  },
};

export default toeplitzMatrixII;
