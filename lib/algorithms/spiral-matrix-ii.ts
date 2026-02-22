import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const spiralMatrixIi: AlgorithmDefinition = {
  id: 'spiral-matrix-ii',
  title: 'Spiral Matrix II',
  leetcodeNumber: 59,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given a positive integer n, generate an n x n matrix filled with elements from 1 to n squared in spiral order. Start from the top-left and move right, then down, then left, then up, repeating until the matrix is filled.',
  tags: ['matrix', 'simulation', 'spiral'],

  code: {
    pseudocode: `function generateMatrix(n):
  matrix = n x n grid of zeros
  top=0, bottom=n-1, left=0, right=n-1
  num = 1
  while num <= n*n:
    for col in [left..right]: matrix[top][col] = num++; top++
    for row in [top..bottom]: matrix[row][right] = num++; right--
    for col in [right..left]: matrix[bottom][col] = num++; bottom--
    for row in [bottom..top]: matrix[row][left] = num++; left++
  return matrix`,
    python: `def generateMatrix(n: int) -> list[list[int]]:
    matrix = [[0]*n for _ in range(n)]
    top, bottom, left, right = 0, n-1, 0, n-1
    num = 1
    while num <= n*n:
        for col in range(left, right+1):
            matrix[top][col] = num; num += 1
        top += 1
        for row in range(top, bottom+1):
            matrix[row][right] = num; num += 1
        right -= 1
        for col in range(right, left-1, -1):
            matrix[bottom][col] = num; num += 1
        bottom -= 1
        for row in range(bottom, top-1, -1):
            matrix[row][left] = num; num += 1
        left += 1
    return matrix`,
    javascript: `function generateMatrix(n) {
  const matrix = Array.from({length: n}, () => Array(n).fill(0));
  let top = 0, bottom = n-1, left = 0, right = n-1, num = 1;
  while (num <= n*n) {
    for (let c = left; c <= right; c++) matrix[top][c] = num++;
    top++;
    for (let r = top; r <= bottom; r++) matrix[r][right] = num++;
    right--;
    for (let c = right; c >= left; c--) matrix[bottom][c] = num++;
    bottom--;
    for (let r = bottom; r >= top; r--) matrix[r][left] = num++;
    left++;
  }
  return matrix;
}`,
    java: `public int[][] generateMatrix(int n) {
    int[][] matrix = new int[n][n];
    int top = 0, bottom = n-1, left = 0, right = n-1, num = 1;
    while (num <= n*n) {
        for (int c = left; c <= right; c++) matrix[top][c] = num++;
        top++;
        for (int r = top; r <= bottom; r++) matrix[r][right] = num++;
        right--;
        for (int c = right; c >= left; c--) matrix[bottom][c] = num++;
        bottom--;
        for (int r = bottom; r >= top; r--) matrix[r][left] = num++;
        left++;
    }
    return matrix;
}`,
  },

  defaultInput: {
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Matrix Size (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of the n x n matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    const flatMatrix = (): number[] => {
      const flat: number[] = [];
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) flat.push(matrix[r][c]);
      return flat;
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatMatrix(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize ${n}x${n} matrix with zeros. Will fill 1 to ${n * n} in spiral order.`,
      variables: { n, num: 1, top: 0, bottom: n - 1, left: 0, right: n - 1 },
      visualization: makeViz({}, {}),
    });

    let top = 0, bottom = n - 1, left = 0, right = n - 1, num = 1;

    while (num <= n * n) {
      // Fill top row left to right
      for (let c = left; c <= right; c++) {
        matrix[top][c] = num;
        const idx = top * n + c;
        steps.push({
          line: 5,
          explanation: `Place ${num} at row ${top}, col ${c} (top row, left to right).`,
          variables: { num, row: top, col: c, top, bottom, left, right },
          visualization: makeViz({ [idx]: 'active' }, { [idx]: String(num) }),
        });
        num++;
      }
      top++;

      // Fill right column top to bottom
      for (let r = top; r <= bottom; r++) {
        matrix[r][right] = num;
        const idx = r * n + right;
        steps.push({
          line: 6,
          explanation: `Place ${num} at row ${r}, col ${right} (right column, top to bottom).`,
          variables: { num, row: r, col: right, top, bottom, left, right },
          visualization: makeViz({ [idx]: 'active' }, { [idx]: String(num) }),
        });
        num++;
      }
      right--;

      if (top <= bottom) {
        // Fill bottom row right to left
        for (let c = right; c >= left; c--) {
          matrix[bottom][c] = num;
          const idx = bottom * n + c;
          steps.push({
            line: 7,
            explanation: `Place ${num} at row ${bottom}, col ${c} (bottom row, right to left).`,
            variables: { num, row: bottom, col: c, top, bottom, left, right },
            visualization: makeViz({ [idx]: 'active' }, { [idx]: String(num) }),
          });
          num++;
        }
        bottom--;
      }

      if (left <= right) {
        // Fill left column bottom to top
        for (let r = bottom; r >= top; r--) {
          matrix[r][left] = num;
          const idx = r * n + left;
          steps.push({
            line: 8,
            explanation: `Place ${num} at row ${r}, col ${left} (left column, bottom to top).`,
            variables: { num, row: r, col: left, top, bottom, left, right },
            visualization: makeViz({ [idx]: 'active' }, { [idx]: String(num) }),
          });
          num++;
        }
        left++;
      }
    }

    const sortedHighlights: Record<number, string> = {};
    for (let i = 0; i < n * n; i++) sortedHighlights[i] = 'sorted';
    steps.push({
      line: 9,
      explanation: `Spiral matrix complete. Matrix filled with 1 to ${n * n}.`,
      variables: { result: 'matrix filled' },
      visualization: makeViz(sortedHighlights, {}),
    });

    return steps;
  },
};

export default spiralMatrixIi;
