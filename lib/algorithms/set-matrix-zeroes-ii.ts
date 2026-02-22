import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const setMatrixZeroesII: AlgorithmDefinition = {
  id: 'set-matrix-zeroes-ii',
  title: 'Set Matrix Zeroes',
  leetcodeNumber: 73,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an m x n matrix, if an element is 0, set its entire row and column to 0 in-place. Use O(1) extra space by storing the zero-row/col flags in the first row and first column of the matrix itself.',
  tags: ['Matrix', 'In-place', 'Hash Map'],
  code: {
    pseudocode: `function setZeroes(matrix):
  firstRowZero = 0 in matrix[0]
  firstColZero = any(matrix[i][0]==0 for i)
  for i from 1 to m-1:
    for j from 1 to n-1:
      if matrix[i][j]==0:
        matrix[i][0]=0; matrix[0][j]=0
  for i from 1 to m-1:
    for j from 1 to n-1:
      if matrix[i][0]==0 or matrix[0][j]==0:
        matrix[i][j]=0
  if firstRowZero: zero out row 0
  if firstColZero: zero out col 0`,
    python: `def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row = any(matrix[0][j]==0 for j in range(n))
    first_col = any(matrix[i][0]==0 for i in range(m))
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0]==0 or matrix[0][j]==0:
                matrix[i][j] = 0
    if first_row:
        for j in range(n): matrix[0][j] = 0
    if first_col:
        for i in range(m): matrix[i][0] = 0`,
    javascript: `function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const firstRow = matrix[0].some(v => v === 0);
  const firstCol = matrix.some(r => r[0] === 0);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][j] === 0) matrix[i][0] = matrix[0][j] = 0;
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
  if (firstRow) for (let j = 0; j < n; j++) matrix[0][j] = 0;
  if (firstCol) for (let i = 0; i < m; i++) matrix[i][0] = 0;
}`,
    java: `public void setZeroes(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    boolean firstRow = false, firstCol = false;
    for (int j = 0; j < n; j++) if (matrix[0][j]==0) firstRow=true;
    for (int i = 0; i < m; i++) if (matrix[i][0]==0) firstCol=true;
    for (int i=1;i<m;i++) for(int j=1;j<n;j++)
        if (matrix[i][j]==0) { matrix[i][0]=0; matrix[0][j]=0; }
    for (int i=1;i<m;i++) for(int j=1;j<n;j++)
        if (matrix[i][0]==0||matrix[0][j]==0) matrix[i][j]=0;
    if (firstRow) for(int j=0;j<n;j++) matrix[0][j]=0;
    if (firstCol) for(int i=0;i<m;i++) matrix[i][0]=0;
}`,
  },
  defaultInput: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'string',
      defaultValue: '1 1 1, 1 0 1, 1 1 1',
      placeholder: 'e.g. 1 1 1, 1 0 1, 1 1 1',
      helperText: 'Rows separated by commas, values by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = (input.matrix as number[][]).map(r => [...r]);
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = matrix.length, n = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    function makeViz(hl: Record<number, string>, note: string): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          labels[i * n + j] = `(${i},${j})`;
      return {
        type: 'array',
        array: matrix.flat(),
        highlights: hl,
        labels,
        auxData: { label: 'Set Matrix Zeroes', entries: [{ key: 'Phase', value: note }] },
      };
    }

    function allDefault(): Record<number, string> {
      return Object.fromEntries(Array.from({ length: m * n }, (_, i) => [i, matrix.flat()[i] === 0 ? 'active' : 'default']));
    }

    steps.push({
      line: 1,
      explanation: `Set Matrix Zeroes on ${m}x${n} matrix. Use first row/col as flags to achieve O(1) space.`,
      variables: { m, n },
      visualization: makeViz(allDefault(), 'Initial'),
    });

    const firstRowZero = matrix[0].some(v => v === 0);
    const firstColZero = matrix.some(r => r[0] === 0);

    steps.push({
      line: 2,
      explanation: `Record: firstRowZero=${firstRowZero}, firstColZero=${firstColZero}. These flags needed before we overwrite row/col 0.`,
      variables: { firstRowZero, firstColZero },
      visualization: makeViz(allDefault(), 'Flags recorded'),
    });

    // Mark flags in first row/col
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (matrix[i][j] === 0) {
          const hl = allDefault();
          hl[i * n + j] = 'comparing';
          hl[j] = 'swapping';
          hl[i * n] = 'swapping';
          steps.push({
            line: 6,
            explanation: `matrix[${i}][${j}]=0 → mark matrix[${i}][0] and matrix[0][${j}] as 0.`,
            variables: { i, j },
            visualization: makeViz(hl, 'Marking flags'),
          });
          matrix[i][0] = 0;
          matrix[0][j] = 0;
        }
      }
    }

    // Zero out inner cells
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        if (matrix[i][0] === 0 || matrix[0][j] === 0) {
          const hl = allDefault();
          hl[i * n + j] = 'active';
          steps.push({
            line: 9,
            explanation: `matrix[${i}][0]=${matrix[i][0]} or matrix[0][${j}]=${matrix[0][j]} is 0 → zero out (${i},${j}).`,
            variables: { i, j },
            visualization: makeViz(hl, 'Zeroing cells'),
          });
          matrix[i][j] = 0;
        }
      }
    }

    if (firstRowZero) for (let j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;

    steps.push({
      line: 13,
      explanation: `Apply flags for row 0 and col 0. Matrix zeroes set in-place with O(1) extra space.`,
      variables: {},
      visualization: makeViz(Object.fromEntries(Array.from({ length: m * n }, (_, i) => [i, matrix.flat()[i] === 0 ? 'found' : 'visited'])), 'Done'),
    });

    return steps;
  },
};

export default setMatrixZeroesII;
