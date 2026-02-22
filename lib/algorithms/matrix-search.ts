import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const matrixSearch: AlgorithmDefinition = {
  id: 'matrix-search',
  title: 'Matrix Search',
  leetcodeNumber: 74,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Search for a target in an m x n matrix where each row is sorted and the first element of each row is greater than the last element of the previous row. Treat the matrix as a virtual flattened sorted array and perform binary search using index mapping: row = index / cols, col = index % cols. O(log(m*n)) time.',
  tags: ['Binary Search', 'Matrix'],
  code: {
    pseudocode: `function searchMatrix(matrix, target):
  m = rows, n = cols
  left = 0, right = m * n - 1
  while left <= right:
    mid = left + (right - left) / 2
    row = mid / n, col = mid % n
    val = matrix[row][col]
    if val == target:
      return true
    else if val < target:
      left = mid + 1
    else:
      right = mid - 1
  return false`,
    python: `def searchMatrix(matrix, target):
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    while left <= right:
        mid = left + (right - left) // 2
        row, col = mid // n, mid % n
        val = matrix[row][col]
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
    return False`,
    javascript: `function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let left = 0, right = m * n - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const row = Math.floor(mid / n), col = mid % n;
    const val = matrix[row][col];
    if (val === target) return true;
    else if (val < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}`,
    java: `public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int left = 0, right = m * n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}`,
  },
  defaultInput: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (row-sorted)',
      type: 'array',
      defaultValue: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]],
      placeholder: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]',
      helperText: 'Nested array where rows are sorted and row-connected',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Value to search for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const flat = matrix.flat();
    const m = matrix.length;
    const n = matrix[0].length;
    const eliminated = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      eliminated.forEach((idx) => { merged[idx] = 'visited'; });
      for (const [k, v] of Object.entries(highlights)) {
        merged[Number(k)] = v;
      }
      return { type: 'array', array: [...flat], highlights: merged, labels };
    };

    steps.push({
      line: 1,
      explanation: `Flatten ${m}x${n} matrix into virtual array of ${m * n} elements: [${flat.join(', ')}]. Search for target ${target}.`,
      variables: { m, n, total: m * n, target },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = m * n - 1;

    steps.push({
      line: 3,
      explanation: `Initialize left=0, right=${right}. Binary search on virtual flat indices.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' },
      ),
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const row = Math.floor(mid / n);
      const col = mid % n;
      const val = matrix[row][col];

      steps.push({
        line: 5,
        explanation: `mid=${mid} maps to matrix[${row}][${col}] = ${val}.`,
        variables: { left, right, mid, row, col, val, target },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: `[${row},${col}]` },
        ),
      });

      if (val === target) {
        steps.push({
          line: 8,
          explanation: `matrix[${row}][${col}] = ${val} == target ${target}. Found!`,
          variables: { row, col, result: true },
          visualization: makeViz({ [mid]: 'found' }, { [mid]: 'found' }),
        });
        return steps;
      } else if (val < target) {
        steps.push({
          line: 10,
          explanation: `${val} < ${target}. Eliminate left half. left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: makeViz(
            { [mid]: 'visited', [mid + 1 < flat.length ? mid + 1 : mid]: 'pointer', [right]: 'pointer' },
            { ...(mid + 1 < flat.length ? { [mid + 1]: 'L' } : {}), [right]: 'R' },
          ),
        });
        for (let e = left; e <= mid; e++) eliminated.add(e);
        left = mid + 1;
      } else {
        steps.push({
          line: 12,
          explanation: `${val} > ${target}. Eliminate right half. right = ${mid - 1}.`,
          variables: { left, right: mid - 1 },
          visualization: makeViz(
            { [left]: 'pointer', ...(mid - 1 >= 0 ? { [mid - 1]: 'pointer' } : {}), [mid]: 'visited' },
            { [left]: 'L', ...(mid - 1 >= 0 ? { [mid - 1]: 'R' } : {}) },
          ),
        });
        for (let e = mid; e <= right; e++) eliminated.add(e);
        right = mid - 1;
      }
    }

    steps.push({
      line: 13,
      explanation: `left > right. Target ${target} not found in the matrix. Return false.`,
      variables: { result: false },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default matrixSearch;
