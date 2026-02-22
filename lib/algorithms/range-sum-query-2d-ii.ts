import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeSumQuery2DII: AlgorithmDefinition = {
  id: 'range-sum-query-2d-ii',
  title: 'Range Sum Query 2D - Immutable II',
  leetcodeNumber: 304,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given a 2D matrix, handle multiple sumRegion queries efficiently. Build a 2D prefix sum where prefix[i][j] is the sum of all elements in the sub-rectangle from (0,0) to (i-1,j-1). Use inclusion-exclusion to answer each query in O(1).',
  tags: ['Prefix Sum', '2D Array', 'Matrix', 'Design'],
  code: {
    pseudocode: `function NumMatrix(matrix):
  m, n = dimensions of matrix
  prefix = (m+1) x (n+1) array of zeros
  for i from 1 to m:
    for j from 1 to n:
      prefix[i][j] = matrix[i-1][j-1]
                   + prefix[i-1][j]
                   + prefix[i][j-1]
                   - prefix[i-1][j-1]

function sumRegion(r1,c1,r2,c2):
  return prefix[r2+1][c2+1]
       - prefix[r1][c2+1]
       - prefix[r2+1][c1]
       + prefix[r1][c1]`,
    python: `class NumMatrix:
    def __init__(self, matrix):
        m, n = len(matrix), len(matrix[0])
        self.pre = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                self.pre[i][j] = (matrix[i-1][j-1]
                    + self.pre[i-1][j]
                    + self.pre[i][j-1]
                    - self.pre[i-1][j-1])

    def sumRegion(self, r1, c1, r2, c2):
        return (self.pre[r2+1][c2+1]
              - self.pre[r1][c2+1]
              - self.pre[r2+1][c1]
              + self.pre[r1][c1])`,
    javascript: `class NumMatrix {
  constructor(matrix) {
    const m = matrix.length, n = matrix[0].length;
    this.pre = Array.from({length: m+1}, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        this.pre[i][j] = matrix[i-1][j-1]
          + this.pre[i-1][j] + this.pre[i][j-1] - this.pre[i-1][j-1];
  }
  sumRegion(r1, c1, r2, c2) {
    return this.pre[r2+1][c2+1] - this.pre[r1][c2+1]
         - this.pre[r2+1][c1] + this.pre[r1][c1];
  }
}`,
    java: `class NumMatrix {
    private int[][] pre;
    public NumMatrix(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        pre = new int[m+1][n+1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                pre[i][j] = matrix[i-1][j-1] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1];
    }
    public int sumRegion(int r1, int c1, int r2, int c2) {
        return pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
    }
}`,
  },
  defaultInput: { matrix: [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1]], r1: 1, c1: 1, r2: 2, c2: 2 },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened row)',
      type: 'array',
      defaultValue: [3, 0, 1, 4, 5, 6, 3, 2, 1, 2, 0, 1],
      placeholder: '3,0,1,4,5,6,3,2,1,2,0,1',
      helperText: 'Flattened 2D matrix (row-major)',
    },
    { name: 'r1', label: 'Row1', type: 'number', defaultValue: 1, placeholder: '1' },
    { name: 'c1', label: 'Col1', type: 'number', defaultValue: 1, placeholder: '1' },
    { name: 'r2', label: 'Row2', type: 'number', defaultValue: 2, placeholder: '2' },
    { name: 'c2', label: 'Col2', type: 'number', defaultValue: 2, placeholder: '2' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.matrix as number[];
    const r1 = input.r1 as number;
    const c1 = input.c1 as number;
    const r2 = input.r2 as number;
    const c2 = input.c2 as number;
    const steps: AlgorithmStep[] = [];

    // Reconstruct matrix rows = 3 cols = 4 for default
    const cols = 4;
    const rows = Math.ceil(flat.length / cols);
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      matrix.push(flat.slice(i * cols, (i + 1) * cols));
    }

    const n = cols;
    const m = rows;

    // Build 2D prefix
    const pre: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        pre[i][j] = matrix[i - 1][j - 1] + pre[i - 1][j] + pre[i][j - 1] - pre[i - 1][j - 1];
      }
    }

    const result = pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build 2D prefix sum for ${m}x${n} matrix. prefix[i][j] = sum of sub-rectangle (0,0) to (i-1,j-1).`,
      variables: { m, n },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 9,
      explanation: `Query sumRegion(${r1},${c1},${r2},${c2}): using inclusion-exclusion on prefix array.`,
      variables: { r1, c1, r2, c2 },
      visualization: makeViz(
        Object.fromEntries(
          flat.map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            return [i, row >= r1 && row <= r2 && col >= c1 && col <= c2 ? 'found' : 'default'];
          }),
        ),
        {},
      ),
    });

    steps.push({
      line: 12,
      explanation: `sumRegion = pre[${r2 + 1}][${c2 + 1}](${pre[r2 + 1][c2 + 1]}) - pre[${r1}][${c2 + 1}](${pre[r1][c2 + 1]}) - pre[${r2 + 1}][${c1}](${pre[r2 + 1][c1]}) + pre[${r1}][${c1}](${pre[r1][c1]}) = ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(flat.map((_, i) => [i, 'found'])),
        { 0: `ans=${result}` },
      ),
    });

    return steps;
  },
};

export default rangeSumQuery2DII;
