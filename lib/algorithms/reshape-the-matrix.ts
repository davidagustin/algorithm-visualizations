import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reshapeTheMatrix: AlgorithmDefinition = {
  id: 'reshape-the-matrix',
  title: 'Reshape the Matrix',
  leetcodeNumber: 566,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Reshape an m x n matrix into an r x c matrix with the same elements in row-major order. If total elements differ, return the original matrix. Use the flat index: element k goes to result[k/c][k%c].',
  tags: ['Matrix', 'Simulation'],
  code: {
    pseudocode: `function matrixReshape(mat, r, c):
  m, n = size(mat)
  if m*n != r*c: return mat
  flat = flatten(mat)
  result = new matrix r x c
  for k from 0 to m*n-1:
    result[k//c][k%c] = flat[k]
  return result`,
    python: `def matrixReshape(mat, r, c):
    m, n = len(mat), len(mat[0])
    if m*n != r*c: return mat
    flat = [v for row in mat for v in row]
    return [[flat[i*c+j] for j in range(c)] for i in range(r)]`,
    javascript: `function matrixReshape(mat, r, c) {
  const m=mat.length, n=mat[0].length;
  if (m*n !== r*c) return mat;
  const flat = mat.flat();
  return Array.from({length:r}, (_,i) => Array.from({length:c}, (_,j) => flat[i*c+j]));
}`,
    java: `public int[][] matrixReshape(int[][] mat, int r, int c) {
    int m=mat.length, n=mat[0].length;
    if(m*n!=r*c) return mat;
    int[][] res=new int[r][c];
    int[] flat=Arrays.stream(mat).flatMapToInt(Arrays::stream).toArray();
    for(int k=0;k<m*n;k++) res[k/c][k%c]=flat[k];
    return res;
}`,
  },
  defaultInput: { matrix: [[1, 2], [3, 4]], r: 1, c: 4 },
  inputFields: [
    {
      name: 'matrix',
      label: 'Source Matrix',
      type: 'string',
      defaultValue: '1 2, 3 4',
      placeholder: 'e.g. 1 2, 3 4',
      helperText: 'Rows by commas, values by spaces',
    },
    { name: 'r', label: 'Target Rows (r)', type: 'number', defaultValue: 1, placeholder: '1' },
    { name: 'c', label: 'Target Cols (c)', type: 'number', defaultValue: 4, placeholder: '4' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }
    const r = input.r as number;
    const c = input.c as number;
    const m = matrix.length, n = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    const flat = matrix.flat();
    const total = m * n;

    function makeVizSource(curr: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < total; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `(${ri},${ci})`;
        highlights[i] = i < curr ? 'visited' : i === curr ? 'active' : 'default';
      }
      return { type: 'array', array: flat, highlights, labels, auxData: { label: `Source ${m}x${n}`, entries: [{ key: 'Phase', value: 'Flatten' }] } };
    }

    steps.push({
      line: 1,
      explanation: `Reshape ${m}x${n} matrix into ${r}x${c}. Total=${total}. ${total === r * c ? 'Valid reshape.' : 'Invalid: return original.'}`,
      variables: { m, n, r, c, total },
      visualization: makeVizSource(-1),
    });

    if (total !== r * c) {
      steps.push({
        line: 3,
        explanation: `${total} ≠ ${r * c}: cannot reshape. Returning original matrix.`,
        variables: {},
        visualization: makeVizSource(-1),
      });
      return steps;
    }

    const result: number[] = new Array(r * c).fill(0);

    for (let k = 0; k < total; k++) {
      result[k] = flat[k];
      const srcRi = Math.floor(k / n), srcCi = k % n;
      const dstRi = Math.floor(k / c), dstCi = k % c;
      steps.push({
        line: 7,
        explanation: `Element ${flat[k]}: source (${srcRi},${srcCi}) → dest (${dstRi},${dstCi}).`,
        variables: { k, val: flat[k], src: `(${srcRi},${srcCi})`, dst: `(${dstRi},${dstCi})` },
        visualization: {
          type: 'array',
          array: result,
          highlights: Object.fromEntries(result.map((_, i) => [i, i < k ? 'visited' : i === k ? 'active' : 'default'])),
          labels: Object.fromEntries(result.map((_, i) => [i, `(${Math.floor(i / c)},${i % c})`])),
          auxData: { label: `Result ${r}x${c}`, entries: [{ key: 'Progress', value: `${k + 1}/${total}` }] },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Reshape complete. Result is a ${r}x${c} matrix with same elements in row-major order.`,
      variables: { r, c },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((_, i) => [i, `(${Math.floor(i / c)},${i % c})`])),
      },
    });

    return steps;
  },
};

export default reshapeTheMatrix;
