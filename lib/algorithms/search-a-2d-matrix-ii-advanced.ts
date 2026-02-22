import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const searchA2dMatrixIIAdvanced: AlgorithmDefinition = {
  id: 'search-a-2d-matrix-ii-advanced',
  title: 'Search a 2D Matrix II',
  leetcodeNumber: 240,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Search for a target in an m x n matrix where each row and column is sorted in ascending order. Start from the top-right corner: if current > target, move left; if current < target, move down. This eliminates one row or column per step, achieving O(m+n) time.',
  tags: ['Matrix', 'Binary Search', 'Divide and Conquer'],
  code: {
    pseudocode: `function searchMatrix(matrix, target):
  r = 0, c = cols-1
  while r < rows and c >= 0:
    if matrix[r][c] == target: return true
    elif matrix[r][c] > target: c -= 1
    else: r += 1
  return false`,
    python: `def searchMatrix(matrix, target):
    if not matrix: return False
    r, c = 0, len(matrix[0]) - 1
    while r < len(matrix) and c >= 0:
        if matrix[r][c] == target:
            return True
        elif matrix[r][c] > target:
            c -= 1
        else:
            r += 1
    return False`,
    javascript: `function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true;
    else if (matrix[r][c] > target) c--;
    else r++;
  }
  return false;
}`,
    java: `public boolean searchMatrix(int[][] matrix, int target) {
    int r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
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
      label: 'Matrix (sorted rows & cols)',
      type: 'string',
      defaultValue: '1 4 7 11, 2 5 8 12, 3 6 9 16, 10 13 14 17',
      placeholder: 'e.g. 1 4 7 11, 2 5 8 12',
      helperText: 'Rows by commas, values by spaces. Each row and column must be sorted.',
    },
    { name: 'target', label: 'Target', type: 'number', defaultValue: 5, placeholder: '5' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }
    const target = input.target as number;
    const rows = matrix.length, cols = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    function makeViz(r: number, c: number, found: boolean): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          labels[idx] = `(${i},${j})`;
          highlights[idx] = 'default';
        }
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        highlights[r * cols + c] = found ? 'found' : 'active';
      }
      return {
        type: 'array',
        array: matrix.flat(),
        highlights,
        labels,
        auxData: { label: 'Search 2D Matrix II', entries: [{ key: 'Current', value: `(${r},${c})` }, { key: 'Target', value: `${target}` }] },
      };
    }

    let r = 0, c = cols - 1;
    steps.push({
      line: 1,
      explanation: `Search for ${target} starting at top-right corner (0,${cols - 1}). Move left if too large, down if too small.`,
      variables: { target, r, c },
      visualization: makeViz(r, c, false),
    });

    while (r < rows && c >= 0) {
      const val = matrix[r][c];
      if (val === target) {
        steps.push({
          line: 4,
          explanation: `Found target ${target} at (${r},${c})!`,
          variables: { r, c, val },
          visualization: makeViz(r, c, true),
        });
        return steps;
      } else if (val > target) {
        steps.push({
          line: 5,
          explanation: `matrix[${r}][${c}]=${val} > ${target}. Move left (eliminate column ${c}).`,
          variables: { r, c, val, target },
          visualization: makeViz(r, c, false),
        });
        c--;
      } else {
        steps.push({
          line: 6,
          explanation: `matrix[${r}][${c}]=${val} < ${target}. Move down (eliminate row ${r}).`,
          variables: { r, c, val, target },
          visualization: makeViz(r, c, false),
        });
        r++;
      }
    }

    steps.push({
      line: 7,
      explanation: `Search exhausted. Target ${target} not found in the matrix.`,
      variables: { found: false },
      visualization: makeViz(-1, -1, false),
    });

    return steps;
  },
};

export default searchA2dMatrixIIAdvanced;
