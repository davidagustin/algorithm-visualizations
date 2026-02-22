import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeSumQuery2D: AlgorithmDefinition = {
  id: 'range-sum-query-2d',
  title: 'Range Sum Query 2D',
  leetcodeNumber: 304,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given a 2D matrix, handle multiple range sum queries for subrectangles efficiently. Precompute a 2D prefix sum table where prefix[i][j] is the sum of all elements in the rectangle from (0,0) to (i-1,j-1). Then each query is answered in O(1) using inclusion-exclusion.',
  tags: ['Prefix Sum', '2D Array', 'Matrix', 'Design'],
  code: {
    pseudocode: `// Precompute prefix sums
function NumMatrix(matrix):
  prefix[i][j] = matrix[i-1][j-1]
               + prefix[i-1][j]
               + prefix[i][j-1]
               - prefix[i-1][j-1]

// Query sum of rectangle (r1,c1) to (r2,c2)
function sumRegion(r1, c1, r2, c2):
  return prefix[r2+1][c2+1]
       - prefix[r1][c2+1]
       - prefix[r2+1][c1]
       + prefix[r1][c1]`,
    python: `class NumMatrix:
    def __init__(self, matrix):
        m, n = len(matrix), len(matrix[0])
        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                self.prefix[i][j] = (matrix[i-1][j-1]
                    + self.prefix[i-1][j]
                    + self.prefix[i][j-1]
                    - self.prefix[i-1][j-1])

    def sumRegion(self, r1, c1, r2, c2):
        p = self.prefix
        return (p[r2+1][c2+1] - p[r1][c2+1]
                - p[r2+1][c1] + p[r1][c1])`,
    javascript: `class NumMatrix {
  constructor(matrix) {
    const m = matrix.length, n = matrix[0].length;
    this.prefix = Array.from({length: m+1}, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        this.prefix[i][j] = matrix[i-1][j-1]
          + this.prefix[i-1][j] + this.prefix[i][j-1]
          - this.prefix[i-1][j-1];
  }
  sumRegion(r1, c1, r2, c2) {
    const p = this.prefix;
    return p[r2+1][c2+1] - p[r1][c2+1] - p[r2+1][c1] + p[r1][c1];
  }
}`,
    java: `class NumMatrix {
    private int[][] prefix;
    public NumMatrix(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        prefix = new int[m+1][n+1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                prefix[i][j] = matrix[i-1][j-1]
                    + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
    }
    public int sumRegion(int r1, int c1, int r2, int c2) {
        return prefix[r2+1][c2+1] - prefix[r1][c2+1]
             - prefix[r2+1][c1] + prefix[r1][c1];
    }
}`,
  },
  defaultInput: {
    matrix: [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1], [4, 1, 0, 1]],
    r1: 1, c1: 1, r2: 2, c2: 2,
  },
  inputFields: [
    {
      name: 'matrix',
      label: '2D Matrix (rows)',
      type: 'array',
      defaultValue: [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1], [4, 1, 0, 1]],
      placeholder: '[[3,0,1,4],[5,6,3,2],[1,2,0,1],[4,1,0,1]]',
      helperText: 'Matrix rows as nested arrays',
    },
    { name: 'r1', label: 'Row 1', type: 'number', defaultValue: 1 },
    { name: 'c1', label: 'Col 1', type: 'number', defaultValue: 1 },
    { name: 'r2', label: 'Row 2', type: 'number', defaultValue: 2 },
    { name: 'c2', label: 'Col 2', type: 'number', defaultValue: 2 },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const r1 = input.r1 as number;
    const c1 = input.c1 as number;
    const r2 = input.r2 as number;
    const c2 = input.c2 as number;
    const steps: AlgorithmStep[] = [];

    const m = matrix.length;
    const n = matrix[0].length;

    // Build prefix sum table
    const prefix: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        prefix[i][j] = matrix[i - 1][j - 1] + prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1];
      }
    }

    // Flatten matrix for visualization
    const flat = matrix.flat();
    const totalCells = flat.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: { label: 'Prefix Sum State', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Build 2D prefix sum for ${m}x${n} matrix. prefix[i][j] = sum of rectangle (0,0) to (i-1,j-1). Flattened matrix shown row by row.`,
      variables: { m, n },
      visualization: makeViz({}, {}, [
        { key: 'matrix', value: matrix.map(row => `[${row.join(',')}]`).join(', ') },
        { key: 'query', value: `sumRegion(${r1},${c1},${r2},${c2})` },
      ]),
    });

    // Show building prefix table row by row
    for (let i = 1; i <= m; i++) {
      const rowHl: Record<number, string> = {};
      for (let j = 0; j < n; j++) rowHl[(i - 1) * n + j] = 'active';
      const prefixRow = Array.from({ length: n }, (_, j) => prefix[i][j + 1]);
      steps.push({
        line: 3,
        explanation: `Build prefix row ${i}: [${prefixRow.join(', ')}]. Each cell = matrix cell + above prefix + left prefix - diagonal prefix.`,
        variables: { row: i, prefixRow },
        visualization: makeViz(rowHl, {}, [
          { key: `prefix[${i}]`, value: `[${prefixRow.join(', ')}]` },
          { key: 'formula', value: `matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]` },
        ]),
      });
    }

    // Highlight query region
    const queryHl: Record<number, string> = {};
    for (let i = r1; i <= r2; i++) {
      for (let j = c1; j <= c2; j++) {
        queryHl[i * n + j] = 'found';
      }
    }

    steps.push({
      line: 8,
      explanation: `Query sumRegion(${r1},${c1},${r2},${c2}): highlighted cells are the target rectangle.`,
      variables: { r1, c1, r2, c2 },
      visualization: makeViz(queryHl, {}, [
        { key: 'query region', value: `rows ${r1}-${r2}, cols ${c1}-${c2}` },
      ]),
    });

    // Compute answer
    const ans = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];

    steps.push({
      line: 9,
      explanation: `Answer = prefix[${r2+1}][${c2+1}](${prefix[r2+1][c2+1]}) - prefix[${r1}][${c2+1}](${prefix[r1][c2+1]}) - prefix[${r2+1}][${c1}](${prefix[r2+1][c1]}) + prefix[${r1}][${c1}](${prefix[r1][c1]}) = ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(queryHl, {}, [
        { key: 'sumRegion result', value: String(ans) },
        { key: 'inclusion-exclusion', value: `${prefix[r2+1][c2+1]} - ${prefix[r1][c2+1]} - ${prefix[r2+1][c1]} + ${prefix[r1][c1]}` },
      ]),
    });

    return steps;
  },
};

export default rangeSumQuery2D;
