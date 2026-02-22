import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateImage: AlgorithmDefinition = {
  id: 'rotate-image',
  title: 'Rotate Image',
  leetcodeNumber: 48,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given an n x n 2D matrix, rotate it 90 degrees clockwise in-place. The trick is to first transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row. Both steps together achieve a 90-degree clockwise rotation.',
  tags: ['Matrix', 'Math', 'In-place'],
  code: {
    pseudocode: `function rotate(matrix):
  n = matrix.length
  // Step 1: Transpose
  for i from 0 to n-1:
    for j from i+1 to n-1:
      swap(matrix[i][j], matrix[j][i])
  // Step 2: Reverse each row
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
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`,
    java: `public void rotate(int[][] matrix) {
    int n = matrix.length;
    // Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    }
    // Reverse each row
    for (int i = 0; i < n; i++) {
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int tmp = matrix[i][l];
            matrix[i][l] = matrix[i][r];
            matrix[i][r] = tmp;
        }
    }
}`,
  },
  defaultInput: {
    matrix: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (NxN)',
      type: 'string',
      defaultValue: '1,2,3;4,5,6;7,8,9',
      placeholder: '1,2,3;4,5,6;7,8,9',
      helperText: 'Rows separated by semicolons, values by commas (e.g. 3x3)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];

    if (Array.isArray(input.matrix) && Array.isArray(input.matrix[0])) {
      matrix = (input.matrix as number[][]).map(row => [...row]);
    } else {
      const str = input.matrix as string;
      matrix = str.split(';').map(row => row.split(',').map(Number));
    }

    const n = matrix.length;
    const steps: AlgorithmStep[] = [];

    const flatMatrix = (): number[] => matrix.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      action: string,
    ): ArrayVisualization => ({
      type: 'array',
      array: flatMatrix(),
      highlights,
      labels,
      auxData: {
        label: 'Matrix State',
        entries: [
          { key: 'Action', value: action },
          { key: 'Size', value: `${n}x${n}` },
          ...matrix.map((row, i) => ({ key: `Row ${i}`, value: `[${row.join(', ')}]` })),
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Rotate ${n}x${n} matrix 90 degrees clockwise in-place. Strategy: (1) Transpose the matrix, (2) Reverse each row.`,
      variables: { n, matrix: matrix.map(r => [...r]) },
      visualization: makeViz({}, {}, 'Initial matrix'),
    });

    // Transpose
    steps.push({
      line: 3,
      explanation: 'Step 1: Transpose the matrix — swap matrix[i][j] with matrix[j][i] for all i < j.',
      variables: { step: 'transpose' },
      visualization: makeViz({}, {}, 'Starting transpose'),
    });

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const idxA = i * n + j;
        const idxB = j * n + i;

        steps.push({
          line: 5,
          explanation: `Swap matrix[${i}][${j}]=${matrix[i][j]} and matrix[${j}][${i}]=${matrix[j][i]}.`,
          variables: { i, j, 'matrix[i][j]': matrix[i][j], 'matrix[j][i]': matrix[j][i] },
          visualization: makeViz({ [idxA]: 'comparing', [idxB]: 'comparing' }, { [idxA]: `[${i}][${j}]`, [idxB]: `[${j}][${i}]` }, `Swap (${i},${j}) and (${j},${i})`),
        });

        const tmp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = tmp;

        steps.push({
          line: 5,
          explanation: `After swap: matrix[${i}][${j}]=${matrix[i][j]}, matrix[${j}][${i}]=${matrix[j][i]}.`,
          variables: { i, j, 'matrix[i][j]': matrix[i][j], 'matrix[j][i]': matrix[j][i] },
          visualization: makeViz({ [idxA]: 'swapping', [idxB]: 'swapping' }, { [idxA]: `[${i}][${j}]`, [idxB]: `[${j}][${i}]` }, `Swapped`),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: 'Transpose complete. Now Step 2: Reverse each row.',
      variables: { step: 'reverse rows', transposed: matrix.map(r => [...r]) },
      visualization: makeViz({}, {}, 'Transposed — now reversing rows'),
    });

    // Reverse each row
    for (let i = 0; i < n; i++) {
      steps.push({
        line: 8,
        explanation: `Reversing row ${i}: [${matrix[i].join(', ')}] → [${[...matrix[i]].reverse().join(', ')}].`,
        variables: { row: i, before: [...matrix[i]] },
        visualization: makeViz(
          Object.fromEntries(matrix[i].map((_, j) => [i * n + j, 'active'])),
          { [i * n]: 'L', [i * n + n - 1]: 'R' },
          `Reverse row ${i}`,
        ),
      });

      matrix[i].reverse();

      steps.push({
        line: 8,
        explanation: `Row ${i} reversed: [${matrix[i].join(', ')}].`,
        variables: { row: i, after: [...matrix[i]] },
        visualization: makeViz(
          Object.fromEntries(matrix[i].map((_, j) => [i * n + j, 'sorted'])),
          {},
          `Row ${i} done`,
        ),
      });
    }

    // Final state
    const finalHl: Record<number, string> = {};
    for (let k = 0; k < n * n; k++) finalHl[k] = 'found';

    steps.push({
      line: 9,
      explanation: `Rotation complete. Final matrix after 90-degree clockwise rotation.`,
      variables: { result: matrix.map(r => [...r]) },
      visualization: makeViz(finalHl, {}, 'Rotated 90° clockwise'),
    });

    return steps;
  },
};

export default rotateImage;
