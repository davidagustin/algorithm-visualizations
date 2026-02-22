import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const reshapeMatrix: AlgorithmDefinition = {
  id: 'reshape-matrix',
  title: 'Reshape the Matrix',
  leetcodeNumber: 566,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an m x n matrix, reshape it to an r x c matrix filling elements in row-major order. If the reshape is not possible (total elements differ), return the original matrix. Use a single linear index to map from old to new positions.',
  tags: ['array', 'matrix', 'simulation'],

  code: {
    pseudocode: `function matrixReshape(mat, r, c):
  m = rows(mat); n = cols(mat)
  if m*n != r*c: return mat
  flat = flatten(mat)
  result = empty r x c matrix
  for i from 0 to r*c-1:
    result[i/c][i%c] = flat[i]
  return result`,

    python: `def matrixReshape(mat: list[list[int]], r: int, c: int) -> list[list[int]]:
    m, n = len(mat), len(mat[0])
    if m * n != r * c:
        return mat
    flat = [val for row in mat for val in row]
    return [flat[i*c:(i+1)*c] for i in range(r)]`,

    javascript: `function matrixReshape(mat, r, c) {
  const m = mat.length, n = mat[0].length;
  if (m * n !== r * c) return mat;
  const flat = mat.flat();
  const result = [];
  for (let i = 0; i < r; i++) {
    result.push(flat.slice(i * c, (i + 1) * c));
  }
  return result;
}`,

    java: `public int[][] matrixReshape(int[][] mat, int r, int c) {
    int m = mat.length, n = mat[0].length;
    if (m * n != r * c) return mat;
    int[][] result = new int[r][c];
    int[] flat = new int[m * n];
    int k = 0;
    for (int[] row : mat) for (int v : row) flat[k++] = v;
    for (int i = 0; i < r * c; i++) result[i / c][i % c] = flat[i];
    return result;
}`,
  },

  defaultInput: {
    matrix: [[1, 2], [3, 4]],
    r: 1,
    c: 4,
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[1, 2], [3, 4]],
      placeholder: '1,2,3,4',
      helperText: '2D matrix to reshape',
    },
    {
      name: 'r',
      label: 'Target Rows',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of rows in reshaped matrix',
    },
    {
      name: 'c',
      label: 'Target Cols',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Number of columns in reshaped matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const r = input.r as number;
    const c = input.c as number;
    const steps: AlgorithmStep[] = [];

    const m = matrix.length;
    const n = matrix[0].length;
    const flat = matrix.flat();

    steps.push({
      line: 1,
      explanation: `Original matrix is ${m}x${n} (total=${m * n}). Target is ${r}x${c} (total=${r * c}).`,
      variables: { m, n, r, c, total: m * n },
      visualization: {
        type: 'array',
        array: [...flat],
        highlights: {},
        labels: {},
      },
    });

    if (m * n !== r * c) {
      steps.push({
        line: 2,
        explanation: `Total elements differ (${m * n} != ${r * c}). Cannot reshape. Return original.`,
        variables: { result: 'original matrix' },
        visualization: {
          type: 'array',
          array: [...flat],
          highlights: Object.fromEntries(flat.map((_, i) => [i, 'mismatch'])),
          labels: {},
        },
      });
      return steps;
    }

    steps.push({
      line: 3,
      explanation: `Totals match (${m * n}). Flatten to: ${JSON.stringify(flat)}.`,
      variables: { flat: JSON.stringify(flat) },
      visualization: {
        type: 'array',
        array: [...flat],
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(flat.map((_, i) => [i, String(i)])),
      },
    });

    const result: number[][] = Array.from({ length: r }, () => Array(c).fill(0));

    for (let i = 0; i < r * c; i++) {
      const newRow = Math.floor(i / c);
      const newCol = i % c;
      result[newRow][newCol] = flat[i];

      steps.push({
        line: 6,
        explanation: `flat[${i}]=${flat[i]} goes to result[${newRow}][${newCol}].`,
        variables: { i, value: flat[i], newRow, newCol },
        visualization: {
          type: 'array',
          array: [...flat],
          highlights: { [i]: 'found' },
          labels: { [i]: `-> [${newRow}][${newCol}]` },
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Reshape complete. Result: ${JSON.stringify(result)}.`,
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

export default reshapeMatrix;
