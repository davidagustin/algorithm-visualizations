import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flipColumnsForMaximumRows: AlgorithmDefinition = {
  id: 'flip-columns-for-maximum-rows',
  title: 'Flip Columns For Maximum Number of Equal Rows',
  leetcodeNumber: 1072,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a binary matrix, you can flip any set of columns. Count the maximum number of rows that can have all equal values after some column flip. Two rows are equivalent if one is the bitwise complement of the other. Encode each row as a canonical pattern and count the most frequent pattern.',
  tags: ['hash map', 'matrix', 'array', 'pattern matching'],

  code: {
    pseudocode: `function maxEqualRowsAfterFlips(matrix):
  freq = {}
  for row in matrix:
    key = canonicalize(row)
    freq[key] += 1
  return max(freq.values())

function canonicalize(row):
  if row[0] == 0: return tuple(row)
  return tuple(1 - v for v in row)`,
    python: `def maxEqualRowsAfterFlips(matrix):
    from collections import Counter
    def canon(row):
        return tuple(row) if row[0] == 0 else tuple(1-v for v in row)
    return max(Counter(canon(row) for row in matrix).values())`,
    javascript: `function maxEqualRowsAfterFlips(matrix) {
  const freq = new Map();
  for (const row of matrix) {
    const key = (row[0] === 0 ? row : row.map(v => 1-v)).join(',');
    freq.set(key, (freq.get(key)||0)+1);
  }
  return Math.max(...freq.values());
}`,
    java: `public int maxEqualRowsAfterFlips(int[][] matrix) {
    Map<String, Integer> freq = new HashMap<>();
    for (int[] row : matrix) {
        StringBuilder sb = new StringBuilder();
        int flip = row[0];
        for (int v : row) sb.append(v ^ flip);
        freq.merge(sb.toString(), 1, Integer::sum);
    }
    return Collections.max(freq.values());
}`,
  },

  defaultInput: {
    matrix: [[0, 0, 0], [0, 0, 1], [1, 1, 0]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (rows as arrays)',
      type: 'array',
      defaultValue: [[0, 0, 0], [0, 0, 1], [1, 1, 0]],
      placeholder: '[[0,0,0],[0,0,1],[1,1,0]]',
      helperText: 'Binary matrix as nested arrays',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];

    const canonicalize = (row: number[]): string =>
      (row[0] === 0 ? row : row.map((v) => 1 - v)).join(',');

    const allRows = matrix.map((r) => r.join(','));

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: allRows as unknown as number[],
      highlights,
      labels,
    });

    const freq = new Map<string, number>();

    steps.push({
      line: 1,
      explanation: 'For each row, compute a canonical form: if first element is 1, flip all bits. Equal canonical forms can be made equal by the same column flip.',
      variables: { rows: matrix.length },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      const key = canonicalize(row);
      freq.set(key, (freq.get(key) || 0) + 1);

      steps.push({
        line: 3,
        explanation: `Row ${i} [${row.join(', ')}]: canonical key = "${key}" (count=${freq.get(key)})`,
        variables: { rowIndex: i, row: `[${row.join(', ')}]`, key, count: freq.get(key) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `key=${key}` }),
      });
    }

    const maxCount = Math.max(...freq.values());

    steps.push({
      line: 5,
      explanation: `Pattern frequencies: ${Array.from(freq.entries()).map(([k, v]) => `"${k}":${v}`).join(', ')}. Maximum equal rows = ${maxCount}.`,
      variables: { result: maxCount },
      visualization: makeViz(
        Object.fromEntries(matrix.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(matrix.map((_, i) => [i, `r${i}`]))
      ),
    });

    return steps;
  },
};

export default flipColumnsForMaximumRows;
