import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zeroStriping: AlgorithmDefinition = {
  id: 'zero-striping',
  title: 'Set Matrix Zeroes',
  leetcodeNumber: 73,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. First pass identifies zero positions and marks affected rows/columns. Second pass sets zeros. Represented as a flat array for visualization.',
  tags: ['hash set', 'matrix', 'in-place'],

  code: {
    pseudocode: `function setZeroes(matrix):
  rows = set()
  cols = set()
  for r = 0 to numRows - 1:
    for c = 0 to numCols - 1:
      if matrix[r][c] == 0:
        rows.add(r)
        cols.add(c)
  for r = 0 to numRows - 1:
    for c = 0 to numCols - 1:
      if r in rows or c in cols:
        matrix[r][c] = 0`,

    python: `def setZeroes(matrix: list[list[int]]) -> None:
    rows, cols = set(), set()
    m, n = len(matrix), len(matrix[0])
    for r in range(m):
        for c in range(n):
            if matrix[r][c] == 0:
                rows.add(r)
                cols.add(c)
    for r in range(m):
        for c in range(n):
            if r in rows or c in cols:
                matrix[r][c] = 0`,

    javascript: `function setZeroes(matrix) {
  const rows = new Set();
  const cols = new Set();
  const m = matrix.length, n = matrix[0].length;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0) {
        rows.add(r);
        cols.add(c);
      }
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (rows.has(r) || cols.has(c)) {
        matrix[r][c] = 0;
      }
    }
  }
}`,

    java: `public void setZeroes(int[][] matrix) {
    Set<Integer> rows = new HashSet<>();
    Set<Integer> cols = new HashSet<>();
    int m = matrix.length, n = matrix[0].length;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (matrix[r][c] == 0) {
                rows.add(r);
                cols.add(c);
            }
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (rows.contains(r) || cols.contains(c))
                matrix[r][c] = 0;
}`,
  },

  defaultInput: {
    matrix: [1, 1, 1, 1, 0, 1, 1, 1, 1],
    numCols: 3,
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flat)',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 0, 1, 1, 1, 1],
      placeholder: '1,1,1,1,0,1,1,1,1',
      helperText: 'Flattened matrix values row by row',
    },
    {
      name: 'numCols',
      label: 'Number of Columns',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in the matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = [...(input.matrix as number[])];
    const numCols = input.numCols as number;
    const numRows = Math.floor(flat.length / numCols);
    const steps: AlgorithmStep[] = [];
    const zeroRows = new Set<number>();
    const zeroCols = new Set<number>();

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Marked',
        entries: [
          { key: 'Rows', value: zeroRows.size > 0 ? Array.from(zeroRows).join(',') : 'none' },
          { key: 'Cols', value: zeroCols.size > 0 ? Array.from(zeroCols).join(',') : 'none' },
        ],
      },
    });

    // Step: Initialize
    steps.push({
      line: 1,
      explanation: `Matrix is ${numRows}x${numCols}. First pass: find all zero positions to determine which rows and columns to zero out.`,
      variables: { numRows, numCols },
      visualization: makeViz(flat, {}, {}),
    });

    // Pass 1: Find zeros
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const idx = r * numCols + c;
        if (flat[idx] === 0) {
          zeroRows.add(r);
          zeroCols.add(c);

          const highlights: Record<number, string> = {};
          // Highlight entire row and column of this zero
          for (let cc = 0; cc < numCols; cc++) highlights[r * numCols + cc] = 'comparing';
          for (let rr = 0; rr < numRows; rr++) highlights[rr * numCols + c] = 'comparing';
          highlights[idx] = 'found';

          steps.push({
            line: 6,
            explanation: `Found zero at (${r}, ${c}). Mark row ${r} and column ${c} for zeroing.`,
            variables: { r, c, zeroRows: Array.from(zeroRows), zeroCols: Array.from(zeroCols) },
            visualization: makeViz(flat, highlights, { [idx]: '0!' }),
          });
        }
      }
    }

    // Pass 2: Set zeros
    steps.push({
      line: 9,
      explanation: `Second pass: set all cells in marked rows {${Array.from(zeroRows).join(',')}} and columns {${Array.from(zeroCols).join(',')}} to zero.`,
      variables: { zeroRows: Array.from(zeroRows), zeroCols: Array.from(zeroCols) },
      visualization: makeViz(flat, {}, {}),
    });

    const highlights: Record<number, string> = {};
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const idx = r * numCols + c;
        if (zeroRows.has(r) || zeroCols.has(c)) {
          flat[idx] = 0;
          highlights[idx] = 'swapping';
        } else {
          highlights[idx] = 'sorted';
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Zeroing complete. Result: [${flat.join(', ')}].`,
      variables: { result: [...flat] },
      visualization: makeViz(flat, highlights, {}),
    });

    // Final
    steps.push({
      line: 12,
      explanation: `Done! All cells in affected rows and columns have been set to zero.`,
      variables: { result: [...flat] },
      visualization: makeViz(
        flat,
        Object.fromEntries(flat.map((v, i) => [i, v === 0 ? 'visited' : 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default zeroStriping;
