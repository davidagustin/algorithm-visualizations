import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const transposeMatrix: AlgorithmDefinition = {
  id: 'transpose-matrix',
  title: 'Transpose Matrix',
  leetcodeNumber: 867,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a 2D integer matrix, return its transpose. The transpose of a matrix is created by flipping it over its main diagonal: element at [i][j] moves to [j][i]. Create a new matrix of dimensions cols x rows and fill it accordingly.',
  tags: ['array', 'matrix', 'simulation'],

  code: {
    pseudocode: `function transpose(matrix):
  m = rows(matrix); n = cols(matrix)
  result = empty n x m matrix
  for i from 0 to m-1:
    for j from 0 to n-1:
      result[j][i] = matrix[i][j]
  return result`,

    python: `def transpose(matrix: list[list[int]]) -> list[list[int]]:
    m, n = len(matrix), len(matrix[0])
    result = [[0] * m for _ in range(n)]
    for i in range(m):
        for j in range(n):
            result[j][i] = matrix[i][j]
    return result`,

    javascript: `function transpose(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const result = Array.from({length: n}, () => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      result[j][i] = matrix[i][j];
    }
  }
  return result;
}`,

    java: `public int[][] transpose(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[][] result = new int[n][m];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}`,
  },

  defaultInput: {
    matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      placeholder: '1,2,3,4,5,6,7,8,9',
      helperText: '2D matrix to transpose',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const m = matrix.length;
    const n = matrix[0].length;
    const result: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

    steps.push({
      line: 1,
      explanation: `Matrix is ${m}x${n}. Transpose will be ${n}x${m}. Each element [i][j] moves to [j][i].`,
      variables: { m, n },
      visualization: {
        type: 'array',
        array: matrix.flat(),
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const val = matrix[i][j];
        result[j][i] = val;
        const srcIdx = i * n + j;

        steps.push({
          line: 5,
          explanation: `matrix[${i}][${j}]=${val} -> result[${j}][${i}]=${val}.`,
          variables: { i, j, value: val, 'src [i][j]': `[${i}][${j}]`, 'dst [j][i]': `[${j}][${i}]` },
          visualization: {
            type: 'array',
            array: matrix.flat(),
            highlights: { [srcIdx]: 'found' },
            labels: { [srcIdx]: `-> [${j}][${i}]` },
          },
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Transpose complete. Result: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: result.flat(),
        highlights: Object.fromEntries(result.flat().map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default transposeMatrix;
