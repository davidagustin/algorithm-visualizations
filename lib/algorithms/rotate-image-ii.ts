import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateImageII: AlgorithmDefinition = {
  id: 'rotate-image-ii',
  title: 'Rotate Image',
  leetcodeNumber: 48,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Rotate an n x n matrix 90 degrees clockwise in-place. The approach is to first transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row. This achieves the rotation without extra space.',
  tags: ['Matrix', 'In-place', 'Simulation'],
  code: {
    pseudocode: `function rotate(matrix):
  n = len(matrix)
  # Step 1: Transpose
  for i from 0 to n-1:
    for j from i+1 to n-1:
      swap(matrix[i][j], matrix[j][i])
  # Step 2: Reverse each row
  for i from 0 to n-1:
    reverse(matrix[i])`,
    python: `def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()`,
    javascript: `function rotate(matrix) {
  const n = matrix.length;
  // Transpose
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
  // Reverse each row
  for (let i = 0; i < n; i++)
    matrix[i].reverse();
}`,
    java: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    // Reverse each row
    for (int i = 0; i < n; i++) {
        int l = 0, r = n - 1;
        while (l < r) {
            int tmp = matrix[i][l];
            matrix[i][l++] = matrix[i][r];
            matrix[i][r--] = tmp;
        }
    }
}`,
  },
  defaultInput: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Square Matrix',
      type: 'string',
      defaultValue: '1 2 3, 4 5 6, 7 8 9',
      placeholder: 'e.g. 1 2 3, 4 5 6, 7 8 9',
      helperText: 'Rows separated by commas, values by spaces (must be n x n)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = (input.matrix as number[][]).map(r => [...r]);
    } else {
      const str = input.matrix as string;
      matrix = str.split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const n = matrix.length;
    const steps: AlgorithmStep[] = [];

    function flat(): number[] {
      return matrix.flat();
    }

    function makeViz(highlights: Record<number, string>, note: string): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
          labels[r * n + c] = `(${r},${c})`;
      return {
        type: 'array',
        array: flat(),
        highlights,
        labels,
        auxData: { label: 'Rotate Image', entries: [{ key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Rotate ${n}x${n} matrix 90° clockwise in-place. Step 1: Transpose, Step 2: Reverse rows.`,
      variables: { n },
      visualization: makeViz(Object.fromEntries(flat().map((_, i) => [i, 'default'])), 'Initial'),
    });

    // Transpose
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const hi: Record<number, string> = {};
        flat().forEach((_, k) => { hi[k] = 'default'; });
        hi[i * n + j] = 'swapping';
        hi[j * n + i] = 'swapping';
        steps.push({
          line: 5,
          explanation: `Transpose: swap matrix[${i}][${j}]=${matrix[i][j]} with matrix[${j}][${i}]=${matrix[j][i]}.`,
          variables: { i, j, a: matrix[i][j], b: matrix[j][i] },
          visualization: makeViz(hi, 'Transposing'),
        });
        const tmp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = tmp;
      }
    }

    steps.push({
      line: 7,
      explanation: `Transpose complete. Now reverse each row to complete 90° rotation.`,
      variables: {},
      visualization: makeViz(Object.fromEntries(flat().map((_, i) => [i, 'visited'])), 'Transposed'),
    });

    // Reverse rows
    for (let i = 0; i < n; i++) {
      let l = 0, r = n - 1;
      while (l < r) {
        const hi: Record<number, string> = {};
        flat().forEach((_, k) => { hi[k] = 'default'; });
        hi[i * n + l] = 'swapping';
        hi[i * n + r] = 'swapping';
        steps.push({
          line: 9,
          explanation: `Reverse row ${i}: swap positions ${l} and ${r} → ${matrix[i][l]} ↔ ${matrix[i][r]}.`,
          variables: { row: i, l, r },
          visualization: makeViz(hi, `Reversing row ${i}`),
        });
        const tmp = matrix[i][l];
        matrix[i][l] = matrix[i][r];
        matrix[i][r] = tmp;
        l++; r--;
      }
    }

    steps.push({
      line: 10,
      explanation: `Rotation complete! Matrix rotated 90° clockwise in-place.`,
      variables: { result: matrix.map(r => r.join(' ')).join(' | ') },
      visualization: makeViz(Object.fromEntries(flat().map((_, i) => [i, 'found'])), 'Done'),
    });

    return steps;
  },
};

export default rotateImageII;
