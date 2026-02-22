import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPeakElementIi: AlgorithmDefinition = {
  id: 'find-peak-element-ii',
  title: 'Find a Peak Element II',
  leetcodeNumber: 1901,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given an m x n matrix where no two adjacent cells are equal, find any peak element where the element is strictly greater than its neighbors. Binary search on columns: for each mid column find the row maximum, then decide direction based on neighbors.',
  tags: ['binary search', 'matrix', 'divide and conquer'],

  code: {
    pseudocode: `function findPeakGrid(mat):
  left = 0, right = cols - 1
  while left <= right:
    mid = (left + right) / 2
    maxRow = row with max value in column mid
    if mat[maxRow][mid] < mat[maxRow][mid+1]:
      left = mid + 1
    else if mat[maxRow][mid] < mat[maxRow][mid-1]:
      right = mid - 1
    else:
      return [maxRow, mid]`,

    python: `def findPeakGrid(mat: list[list[int]]) -> list[int]:
    left, right = 0, len(mat[0]) - 1
    while left <= right:
        mid = (left + right) // 2
        max_row = max(range(len(mat)), key=lambda r: mat[r][mid])
        if mid + 1 < len(mat[0]) and mat[max_row][mid] < mat[max_row][mid + 1]:
            left = mid + 1
        elif mid - 1 >= 0 and mat[max_row][mid] < mat[max_row][mid - 1]:
            right = mid - 1
        else:
            return [max_row, mid]
    return [-1, -1]`,

    javascript: `function findPeakGrid(mat) {
  let left = 0, right = mat[0].length - 1;
  while (left <= right) {
    const mid = (left + right) >> 1;
    let maxRow = 0;
    for (let r = 0; r < mat.length; r++)
      if (mat[r][mid] > mat[maxRow][mid]) maxRow = r;
    if (mid + 1 < mat[0].length && mat[maxRow][mid] < mat[maxRow][mid + 1])
      left = mid + 1;
    else if (mid - 1 >= 0 && mat[maxRow][mid] < mat[maxRow][mid - 1])
      right = mid - 1;
    else
      return [maxRow, mid];
  }
  return [-1, -1];
}`,

    java: `public int[] findPeakGrid(int[][] mat) {
    int left = 0, right = mat[0].length - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        int maxRow = 0;
        for (int r = 0; r < mat.length; r++)
            if (mat[r][mid] > mat[maxRow][mid]) maxRow = r;
        if (mid + 1 < mat[0].length && mat[maxRow][mid] < mat[maxRow][mid + 1])
            left = mid + 1;
        else if (mid - 1 >= 0 && mat[maxRow][mid] < mat[maxRow][mid - 1])
            right = mid - 1;
        else
            return new int[]{maxRow, mid};
    }
    return new int[]{-1, -1};
}`,
  },

  defaultInput: {
    mat: [[1, 4, 3, 2], [2, 5, 7, 4], [3, 6, 8, 5]],
  },

  inputFields: [
    {
      name: 'mat',
      label: 'Matrix (flattened row by row)',
      type: 'array',
      defaultValue: [[1, 4, 3, 2], [2, 5, 7, 4], [3, 6, 8, 5]],
      placeholder: '1,4,3,2,2,5,7,4,3,6,8,5',
      helperText: 'Grid values with no two adjacent cells equal',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const mat = input.mat as number[][];
    const steps: AlgorithmStep[] = [];

    const rows = mat.length;
    const cols = mat[0].length;
    const flat = mat.flat();

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

    let left = 0;
    let right = cols - 1;

    steps.push({
      line: 1,
      explanation: `Binary search on columns [0, ${right}]. Matrix is ${rows}x${cols}.`,
      variables: { left, right, rows, cols },
      visualization: makeViz({}, {}),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      let maxRow = 0;
      for (let r = 0; r < rows; r++) {
        if (mat[r][mid] > mat[maxRow][mid]) maxRow = r;
      }

      steps.push({
        line: 4,
        explanation: `mid col=${mid}. Max in col ${mid} is mat[${maxRow}][${mid}]=${mat[maxRow][mid]}.`,
        variables: { left, right, mid, maxRow, maxVal: mat[maxRow][mid] },
        visualization: makeViz(
          Array.from({ length: rows }, (_, r) => idx(r, mid))
            .reduce((acc, flatIdx, r) => ({
              ...acc,
              [flatIdx]: r === maxRow ? 'comparing' : 'active',
            }), {}),
          { [idx(maxRow, mid)]: `max=${mat[maxRow][mid]}` }
        ),
      });

      if (mid + 1 < cols && mat[maxRow][mid] < mat[maxRow][mid + 1]) {
        steps.push({
          line: 6,
          explanation: `mat[${maxRow}][${mid}]=${mat[maxRow][mid]} < mat[${maxRow}][${mid + 1}]=${mat[maxRow][mid + 1]}. Peak is to the right. left=${mid + 1}.`,
          variables: { left, right, mid, maxRow },
          visualization: makeViz(
            { [idx(maxRow, mid)]: 'mismatch', [idx(maxRow, mid + 1)]: 'active' },
            { [idx(maxRow, mid)]: 'go right', [idx(maxRow, mid + 1)]: 'larger' }
          ),
        });
        left = mid + 1;
      } else if (mid - 1 >= 0 && mat[maxRow][mid] < mat[maxRow][mid - 1]) {
        steps.push({
          line: 8,
          explanation: `mat[${maxRow}][${mid}]=${mat[maxRow][mid]} < mat[${maxRow}][${mid - 1}]=${mat[maxRow][mid - 1]}. Peak is to the left. right=${mid - 1}.`,
          variables: { left, right, mid, maxRow },
          visualization: makeViz(
            { [idx(maxRow, mid)]: 'mismatch', [idx(maxRow, mid - 1)]: 'active' },
            { [idx(maxRow, mid)]: 'go left', [idx(maxRow, mid - 1)]: 'larger' }
          ),
        });
        right = mid - 1;
      } else {
        steps.push({
          line: 10,
          explanation: `mat[${maxRow}][${mid}]=${mat[maxRow][mid]} is greater than its left and right neighbors. Peak found at (${maxRow}, ${mid}).`,
          variables: { result: `[${maxRow}, ${mid}]`, peakValue: mat[maxRow][mid] },
          visualization: makeViz(
            { [idx(maxRow, mid)]: 'found' },
            { [idx(maxRow, mid)]: `PEAK` }
          ),
        });
        return steps;
      }
    }

    steps.push({
      line: 11,
      explanation: 'No peak found.',
      variables: { result: [-1, -1] },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default findPeakElementIi;
