import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const search2DMatrixII: AlgorithmDefinition = {
  id: 'search-2d-matrix-ii',
  title: 'Search a 2D Matrix II',
  leetcodeNumber: 240,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Search for a target in an m x n matrix where each row is sorted left-to-right and each column is sorted top-to-bottom. Start from the top-right corner and eliminate a row or column at each step, achieving O(m + n) time.',
  tags: ['binary search', 'matrix', 'two pointers', 'divide and conquer'],

  code: {
    pseudocode: `function searchMatrix(matrix, target):
  row = 0
  col = cols - 1
  while row < rows and col >= 0:
    if matrix[row][col] == target:
      return true
    elif matrix[row][col] > target:
      col -= 1
    else:
      row += 1
  return false`,

    python: `def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    if not matrix:
        return False
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1
        else:
            row += 1
    return False`,

    javascript: `function searchMatrix(matrix, target) {
  let row = 0, col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) return true;
    else if (matrix[row][col] > target) col--;
    else row++;
  }
  return false;
}`,

    java: `public boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--;
        else row++;
    }
    return false;
}`,
  },

  defaultInput: {
    matrix: [
      [1, 4, 7, 11],
      [2, 5, 8, 12],
      [3, 6, 9, 16],
      [10, 13, 14, 17],
    ],
    target: 5,
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened row by row)',
      type: 'array',
      defaultValue: [1, 4, 7, 11, 2, 5, 8, 12, 3, 6, 9, 16, 10, 13, 14, 17],
      placeholder: '1,4,7,11,2,5,8,12,3,6,9,16,10,13,14,17',
      helperText: 'Flattened 4x4 matrix values, row by row',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.matrix as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    // Build a 4-col matrix from flat array
    const cols = 4;
    const rows = Math.floor(flat.length / cols);
    const matrix: number[][] = [];
    for (let r = 0; r < rows; r++) {
      matrix.push(flat.slice(r * cols, r * cols + cols));
    }

    // We visualize the matrix flattened as a 1D array
    const arr = flat.slice(0, rows * cols);

    const idxOf = (r: number, c: number) => r * cols + c;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: {
        label: 'Matrix layout (rows)',
        entries: matrix.map((row, r) => ({ key: `Row ${r}`, value: `[${row.join(', ')}]` })),
      },
    });

    let row = 0;
    let col = cols - 1;

    steps.push({
      line: 2,
      explanation: `Start at top-right corner: matrix[${row}][${col}] = ${matrix[row][col]}. Target = ${target}.`,
      variables: { row, col, 'matrix[row][col]': matrix[row][col], target },
      visualization: makeViz(
        { [idxOf(row, col)]: 'active' },
        { [idxOf(row, col)]: 'start' }
      ),
    });

    while (row < rows && col >= 0) {
      const val = matrix[row][col];
      const idx = idxOf(row, col);

      steps.push({
        line: 4,
        explanation: `Check matrix[${row}][${col}] = ${val} vs target ${target}.`,
        variables: { row, col, 'matrix[row][col]': val, target },
        visualization: makeViz({ [idx]: 'comparing' }, { [idx]: 'cur' }),
      });

      if (val === target) {
        steps.push({
          line: 5,
          explanation: `Found target ${target} at matrix[${row}][${col}]!`,
          variables: { row, col, result: true },
          visualization: makeViz({ [idx]: 'found' }, { [idx]: 'found' }),
        });
        return steps;
      } else if (val > target) {
        steps.push({
          line: 7,
          explanation: `${val} > ${target}: entire column ${col} at or below row ${row} is too large. Move left: col = ${col - 1}.`,
          variables: { row, col: col - 1, target },
          visualization: makeViz({ [idx]: 'visited' }, { [idx]: 'elim' }),
        });
        col--;
      } else {
        steps.push({
          line: 9,
          explanation: `${val} < ${target}: entire row ${row} up to column ${col} is too small. Move down: row = ${row + 1}.`,
          variables: { row: row + 1, col, target },
          visualization: makeViz({ [idx]: 'visited' }, { [idx]: 'elim' }),
        });
        row++;
      }
    }

    steps.push({
      line: 10,
      explanation: `Search space exhausted. Target ${target} not found in matrix. Return false.`,
      variables: { result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default search2DMatrixII;
