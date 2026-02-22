import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchA2DMatrixIISearch: AlgorithmDefinition = {
  id: 'search-a-2d-matrix-ii-search',
  title: 'Search a 2D Matrix II',
  leetcodeNumber: 240,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 240: Search in an m×n matrix where each row and column is sorted. Start from top-right: if target < current, move left; if target > current, move down. O(m+n).',
  tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Matrix', 'Sorting'],
  code: {
    pseudocode: `function searchMatrix(matrix, target):
  row = 0, col = n - 1
  while row < m and col >= 0:
    if matrix[row][col] == target:
      return true
    elif matrix[row][col] > target:
      col--   # move left
    else:
      row++   # move down
  return false`,
    python: `def searchMatrix(matrix, target):
    if not matrix: return False
    row, col = 0, len(matrix[0]) - 1
    while row < len(matrix) and col >= 0:
        val = matrix[row][col]
        if val == target: return True
        elif val > target: col -= 1
        else: row += 1
    return False`,
    javascript: `function searchMatrix(matrix, target) {
  let row = 0, col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    const val = matrix[row][col];
    if (val === target) return true;
    if (val > target) col--;
    else row++;
  }
  return false;
}`,
    java: `public boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        if (val > target) col--;
        else row++;
    }
    return false;
}`,
  },
  defaultInput: { matrix: [15, 20, 70, 85, 40, 80, 100, 120, 45, 82, 105, 116, 60, 99, 115, 120], rows: 4, cols: 4, target: 82 },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened)',
      type: 'array',
      defaultValue: [15, 20, 70, 85, 40, 80, 100, 120, 45, 82, 105, 116, 60, 99, 115, 120],
      placeholder: '15,20,70,85,...',
      helperText: 'Flattened row-major matrix values',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 82,
      placeholder: '82',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = (input.matrix as number[]).slice();
    const rows = (input.rows as number) || 4;
    const cols = (input.cols as number) || 4;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const get = (r: number, c: number) => flat[r * cols + c];
    const idx = (r: number, c: number) => r * cols + c;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: '2D Matrix Search', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Search for ${target} in ${rows}x${cols} sorted matrix. Start at top-right corner.`,
      variables: { target, rows, cols },
      visualization: makeViz(
        { [idx(0, cols - 1)]: 'active' },
        { [idx(0, cols - 1)]: 'start' },
        [{ key: 'Target', value: String(target) }, { key: 'Start', value: `[0,${cols - 1}]` }],
      ),
    });

    let row = 0, col = cols - 1;

    while (row < rows && col >= 0) {
      const val = get(row, col);
      const hl: Record<number, string> = {};
      hl[idx(row, col)] = 'active';

      steps.push({
        line: 3,
        explanation: `Check matrix[${row}][${col}]=${val} vs target=${target}.`,
        variables: { row, col, val, target },
        visualization: makeViz(hl, { [idx(row, col)]: `[${row},${col}]` },
          [{ key: 'Value', value: String(val) }, { key: 'Target', value: String(target) }, { key: 'Pos', value: `[${row},${col}]` }]),
      });

      if (val === target) {
        steps.push({
          line: 4,
          explanation: `Found target=${target} at [${row}][${col}]!`,
          variables: { row, col },
          visualization: makeViz({ [idx(row, col)]: 'found' }, { [idx(row, col)]: 'found' },
            [{ key: 'Found at', value: `[${row},${col}]` }]),
        });
        break;
      } else if (val > target) {
        steps.push({
          line: 7,
          explanation: `${val} > ${target}. Move left: col=${col - 1}.`,
          variables: { col: col - 1 },
          visualization: makeViz({ [idx(row, col)]: 'visited' }, {},
            [{ key: 'Direction', value: '← Left' }]),
        });
        col--;
      } else {
        steps.push({
          line: 9,
          explanation: `${val} < ${target}. Move down: row=${row + 1}.`,
          variables: { row: row + 1 },
          visualization: makeViz({ [idx(row, col)]: 'visited' }, {},
            [{ key: 'Direction', value: '↓ Down' }]),
        });
        row++;
      }
    }

    const found = row < rows && col >= 0 && get(row, col) === target;
    steps.push({
      line: 1,
      explanation: found ? `Target ${target} found. Return true.` : `Target ${target} not found. Return false.`,
      variables: { result: found },
      visualization: makeViz(
        found ? { [idx(row, col)]: 'found' } : {},
        {},
        [{ key: 'Result', value: String(found) }],
      ),
    });

    return steps;
  },
};

export default searchA2DMatrixIISearch;
