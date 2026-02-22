import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchA2dMatrix: AlgorithmDefinition = {
  id: 'search-a-2d-matrix',
  title: 'Search a 2D Matrix',
  leetcodeNumber: 240,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Search for a target value in an m x n matrix where each row is sorted and each column is sorted. Start from the top-right corner: if the value equals target return true; if value is greater move left; if smaller move down. O(m + n) time.',
  tags: ['binary search', 'matrix', 'two pointers'],

  code: {
    pseudocode: `function searchMatrix(matrix, target):
  row = 0
  col = cols - 1
  while row < rows and col >= 0:
    val = matrix[row][col]
    if val == target:
      return true
    else if val > target:
      col -= 1
    else:
      row += 1
  return false`,

    python: `def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    rows, cols = len(matrix), len(matrix[0])
    row, col = 0, cols - 1
    while row < rows and col >= 0:
        val = matrix[row][col]
        if val == target:
            return True
        elif val > target:
            col -= 1
        else:
            row += 1
    return False`,

    javascript: `function searchMatrix(matrix, target) {
  let row = 0, col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    const val = matrix[row][col];
    if (val === target) return true;
    else if (val > target) col--;
    else row++;
  }
  return false;
}`,

    java: `public boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        else if (val > target) col--;
        else row++;
    }
    return false;
}`,
  },

  defaultInput: {
    matrix: [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]],
    target: 5,
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened row by row)',
      type: 'array',
      defaultValue: [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]],
      placeholder: '1,4,7,11,2,5,8,12,3,6,9,16,10,13,14,17',
      helperText: 'Row and column sorted matrix values',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to search for in the matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawMatrix = input.matrix as number[][];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const rows = rawMatrix.length;
    const cols = rawMatrix[0].length;
    const flat = rawMatrix.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: flat,
      highlights,
      labels,
    });

    const idx = (r: number, c: number) => r * cols + c;

    let row = 0;
    let col = cols - 1;

    steps.push({
      line: 1,
      explanation: `Start at top-right corner: matrix[${row}][${col}]=${rawMatrix[row][col]}. Target=${target}.`,
      variables: { row, col, 'matrix[row][col]': rawMatrix[row][col], target },
      visualization: makeViz(
        { [idx(row, col)]: 'pointer' },
        { [idx(row, col)]: `(${row},${col})` }
      ),
    });

    while (row < rows && col >= 0) {
      const val = rawMatrix[row][col];

      steps.push({
        line: 4,
        explanation: `matrix[${row}][${col}]=${val}. Compare with target=${target}.`,
        variables: { row, col, val, target },
        visualization: makeViz(
          { [idx(row, col)]: 'comparing' },
          { [idx(row, col)]: `${val}` }
        ),
      });

      if (val === target) {
        steps.push({
          line: 6,
          explanation: `Found target=${target} at position (${row}, ${col}).`,
          variables: { row, col, result: true },
          visualization: makeViz(
            { [idx(row, col)]: 'found' },
            { [idx(row, col)]: `FOUND` }
          ),
        });
        return steps;
      } else if (val > target) {
        steps.push({
          line: 8,
          explanation: `${val} > ${target}. Eliminate column ${col}. Move left: col = ${col - 1}.`,
          variables: { row, col, val, target },
          visualization: makeViz(
            { [idx(row, col)]: 'mismatch' },
            { [idx(row, col)]: 'too big' }
          ),
        });
        col--;
      } else {
        steps.push({
          line: 10,
          explanation: `${val} < ${target}. Eliminate row ${row}. Move down: row = ${row + 1}.`,
          variables: { row, col, val, target },
          visualization: makeViz(
            { [idx(row, col)]: 'mismatch' },
            { [idx(row, col)]: 'too small' }
          ),
        });
        row++;
      }
    }

    steps.push({
      line: 11,
      explanation: `Went out of bounds. Target=${target} not found. Return false.`,
      variables: { row, col, result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default searchA2dMatrix;
