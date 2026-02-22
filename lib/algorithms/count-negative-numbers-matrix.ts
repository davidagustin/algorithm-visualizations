import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNegativeNumbersMatrix: AlgorithmDefinition = {
  id: 'count-negative-numbers-matrix',
  title: 'Count Negative Numbers in a Sorted Matrix',
  leetcodeNumber: 1351,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Count the number of negative numbers in an m x n matrix sorted in non-increasing order (each row and column is sorted descending). Use a staircase search starting from the top-right corner for O(m+n) time.',
  tags: ['Matrix', 'Binary Search', 'Counting'],
  code: {
    pseudocode: `function countNegatives(grid):
  count = 0
  r = 0, c = cols-1
  while r < rows and c >= 0:
    if grid[r][c] < 0:
      count += rows - r
      c -= 1
    else:
      r += 1
  return count`,
    python: `def countNegatives(grid):
    m, n = len(grid), len(grid[0])
    count, r, c = 0, 0, n-1
    while r < m and c >= 0:
        if grid[r][c] < 0:
            count += m - r
            c -= 1
        else:
            r += 1
    return count`,
    javascript: `function countNegatives(grid) {
  let count=0, r=0, c=grid[0].length-1;
  while (r<grid.length && c>=0) {
    if (grid[r][c]<0) { count+=grid.length-r; c--; }
    else r++;
  }
  return count;
}`,
    java: `public int countNegatives(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int count=0, r=0, c=n-1;
    while (r<m && c>=0) {
        if (grid[r][c]<0) { count+=m-r; c--; }
        else r++;
    }
    return count;
}`,
  },
  defaultInput: { matrix: [[4, 3, 2, -1], [3, 2, 1, -1], [1, 1, -1, -2], [-1, -1, -2, -3]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Sorted Grid (non-increasing)',
      type: 'string',
      defaultValue: '4 3 2 -1, 3 2 1 -1, 1 1 -1 -2, -1 -1 -2 -3',
      placeholder: 'e.g. 4 3 2 -1, 3 2 1 -1',
      helperText: 'Rows by commas, sorted non-increasing',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let grid: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      grid = input.matrix as number[][];
    } else {
      grid = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = grid.length, n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    let count = 0, r = 0, c = n - 1;

    function makeViz(currR: number, currC: number): ArrayVisualization {
      const flat = grid.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${flat[i]}`;
        highlights[i] = flat[i] < 0 ? 'mismatch' : 'default';
      }
      if (currR >= 0 && currC >= 0) highlights[currR * n + currC] = 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Count Negatives', entries: [{ key: 'Count', value: `${count}` }, { key: 'Pointer', value: `(${currR},${currC})` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count negatives in ${m}x${n} sorted matrix. Staircase from top-right corner O(m+n).`,
      variables: { m, n },
      visualization: makeViz(r, c),
    });

    while (r < m && c >= 0) {
      const val = grid[r][c];
      if (val < 0) {
        const contribution = m - r;
        count += contribution;
        steps.push({
          line: 4,
          explanation: `grid[${r}][${c}]=${val} < 0. All ${contribution} cells in column ${c} from row ${r} onward are negative. count += ${contribution} = ${count}.`,
          variables: { r, c, val, contribution, count },
          visualization: makeViz(r, c),
        });
        c--;
      } else {
        steps.push({
          line: 7,
          explanation: `grid[${r}][${c}]=${val} >= 0. Move down (row ${r} → ${r + 1}).`,
          variables: { r, c, val },
          visualization: makeViz(r, c),
        });
        r++;
      }
    }

    steps.push({
      line: 9,
      explanation: `Total negative numbers = ${count}.`,
      variables: { count },
      visualization: makeViz(-1, -1),
    });

    return steps;
  },
};

export default countNegativeNumbersMatrix;
