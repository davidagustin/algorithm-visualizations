import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNegativeNumbers: AlgorithmDefinition = {
  id: 'count-negative-numbers',
  title: 'Count Negative Numbers in a Sorted Matrix',
  leetcodeNumber: 1351,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given an m x n matrix where rows and columns are sorted in non-increasing order, count the number of negative numbers. For each row, use binary search to find the first negative number and count negatives in that row. Total O(m log n) time.',
  tags: ['binary search', 'matrix', 'sorting'],

  code: {
    pseudocode: `function countNegatives(grid):
  count = 0
  for row in grid:
    left = 0, right = len(row)
    while left < right:
      mid = (left + right) / 2
      if row[mid] >= 0:
        left = mid + 1
      else:
        right = mid
    count += len(row) - left
  return count`,

    python: `def countNegatives(grid: list[list[int]]) -> int:
    count = 0
    for row in grid:
        left, right = 0, len(row)
        while left < right:
            mid = (left + right) // 2
            if row[mid] >= 0:
                left = mid + 1
            else:
                right = mid
        count += len(row) - left
    return count`,

    javascript: `function countNegatives(grid) {
  let count = 0;
  for (const row of grid) {
    let left = 0, right = row.length;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (row[mid] >= 0) left = mid + 1;
      else right = mid;
    }
    count += row.length - left;
  }
  return count;
}`,

    java: `public int countNegatives(int[][] grid) {
    int count = 0;
    for (int[] row : grid) {
        int left = 0, right = row.length;
        while (left < right) {
            int mid = (left + right) / 2;
            if (row[mid] >= 0) left = mid + 1;
            else right = mid;
        }
        count += row.length - left;
    }
    return count;
}`,
  },

  defaultInput: {
    grid: [[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened row by row)',
      type: 'array',
      defaultValue: [[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]],
      placeholder: '4,3,2,-1,3,2,1,-1,1,1,-1,-2,-1,-1,-2,-3',
      helperText: 'Sorted matrix values (non-increasing rows and columns)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];

    let totalCount = 0;

    for (let r = 0; r < rawGrid.length; r++) {
      const row = rawGrid[r];

      const makeViz = (
        highlights: Record<number, string>,
        labels: Record<number, string>
      ): ArrayVisualization => ({
        type: 'array',
        array: [...row],
        highlights,
        labels,
      });

      steps.push({
        line: 2,
        explanation: `Process row ${r}: [${row.join(', ')}]. Binary search for first negative.`,
        variables: { row: r, values: `[${row.join(', ')}]` },
        visualization: makeViz(
          row.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
          row.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {})
        ),
      });

      let left = 0;
      let right = row.length;

      while (left < right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
          line: 4,
          explanation: `Row ${r}: mid=${mid}, row[${mid}]=${row[mid]}. ${row[mid] >= 0 ? 'Non-negative, move left right.' : 'Negative, move right to mid.'}`,
          variables: { left, right, mid, 'row[mid]': row[mid] },
          visualization: makeViz(
            { [left]: 'active', [Math.min(right, row.length) - 1]: 'active', [mid]: 'comparing' },
            { [left]: 'L', [Math.min(right, row.length) - 1]: 'R', [mid]: `${row[mid]}` }
          ),
        });

        if (row[mid] >= 0) {
          left = mid + 1;
        } else {
          right = mid;
        }
      }

      const negCount = row.length - left;
      totalCount += negCount;

      steps.push({
        line: 9,
        explanation: `Row ${r}: first negative at index ${left}. Negatives in row = ${row.length} - ${left} = ${negCount}. Running total = ${totalCount}.`,
        variables: { row: r, firstNegIdx: left, negInRow: negCount, total: totalCount },
        visualization: makeViz(
          row.reduce((acc, _, i) => ({
            ...acc,
            [i]: i >= left ? 'found' : 'sorted',
          }), {}),
          { [left]: `neg start` }
        ),
      });
    }

    steps.push({
      line: 10,
      explanation: `All rows processed. Total negative numbers = ${totalCount}.`,
      variables: { result: totalCount },
      visualization: {
        type: 'array',
        array: rawGrid.flat(),
        highlights: rawGrid.flat().reduce((acc, v, i) => ({ ...acc, [i]: v < 0 ? 'found' : 'sorted' }), {}),
        labels: { 0: `total=${totalCount}` },
      },
    });

    return steps;
  },
};

export default countNegativeNumbers;
