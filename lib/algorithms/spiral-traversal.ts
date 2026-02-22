import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const spiralTraversal: AlgorithmDefinition = {
  id: 'spiral-traversal',
  title: 'Spiral Traversal',
  leetcodeNumber: 54,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Traverse a matrix in spiral order by tracking four boundaries (top, bottom, left, right) and peeling off the outermost layer in each iteration: go right, down, left, up, then shrink boundaries.',
  tags: ['Matrix', 'Simulation'],
  code: {
    pseudocode: `function spiralOrder(matrix):
  result = []
  top = 0, bottom = rows-1
  left = 0, right = cols-1
  while top <= bottom and left <= right:
    for i from left to right:
      result.append(matrix[top][i])
    top += 1
    for i from top to bottom:
      result.append(matrix[i][right])
    right -= 1
    if top <= bottom:
      for i from right down to left:
        result.append(matrix[bottom][i])
      bottom -= 1
    if left <= right:
      for i from bottom down to top:
        result.append(matrix[i][left])
      left += 1
  return result`,
    python: `def spiralOrder(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1):
            result.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1):
            result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1):
                result.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                result.append(matrix[i][left])
            left += 1
    return result`,
    javascript: `function spiralOrder(matrix) {
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++)
      result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++)
      result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--)
        result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--)
        result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`,
    java: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++)
            result.add(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++)
            result.add(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--)
                result.add(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                result.add(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
  },
  defaultInput: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'string',
      defaultValue: '1 2 3, 4 5 6, 7 8 9',
      placeholder: 'e.g. 1 2 3, 4 5 6, 7 8 9',
      helperText: 'Rows separated by commas, values by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray(input.matrix[0])) {
      matrix = input.matrix as number[][];
    } else {
      const str = input.matrix as string;
      matrix = str.split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const flat = matrix.flat();
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const visited = new Set<number>();

    function idx(r: number, c: number): number {
      return r * cols + c;
    }

    function makeViz(currR: number, currC: number, direction: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < flat.length; i++) {
        if (visited.has(i)) {
          highlights[i] = 'visited';
        } else {
          highlights[i] = 'default';
        }
      }

      const ci = idx(currR, currC);
      if (ci >= 0 && ci < flat.length) {
        highlights[ci] = 'active';
        labels[ci] = 'curr';
      }

      // Label row/col positions
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(r, c);
          if (!labels[i]) labels[i] = `(${r},${c})`;
        }
      }

      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: {
          label: 'Spiral State',
          entries: [
            { key: 'Direction', value: direction },
            { key: 'Result so far', value: result.length > 0 ? result.join(', ') : 'empty' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Traverse ${rows}x${cols} matrix in spiral order. Start from top-left.`,
      variables: { rows, cols },
      visualization: makeViz(0, 0, 'start'),
    });

    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;

    while (top <= bottom && left <= right) {
      // Right
      for (let i = left; i <= right; i++) {
        visited.add(idx(top, i));
        result.push(matrix[top][i]);
      }
      steps.push({
        line: 6,
        explanation: `Go RIGHT along row ${top}: added [${matrix[top].slice(left, right + 1).join(', ')}].`,
        variables: { direction: 'right', row: top, result: [...result] },
        visualization: makeViz(top, right, 'right ->'),
      });
      top++;

      // Down
      for (let i = top; i <= bottom; i++) {
        visited.add(idx(i, right));
        result.push(matrix[i][right]);
      }
      if (top <= bottom + 1) {
        steps.push({
          line: 9,
          explanation: `Go DOWN along column ${right}: added [${Array.from({ length: bottom - top + 2 }, (_, j) => matrix[top + j - 1]?.[right]).filter(v => v !== undefined).join(', ')}].`,
          variables: { direction: 'down', col: right, result: [...result] },
          visualization: makeViz(bottom, right, 'down v'),
        });
      }
      right--;

      // Left
      if (top <= bottom) {
        for (let i = right; i >= left; i--) {
          visited.add(idx(bottom, i));
          result.push(matrix[bottom][i]);
        }
        steps.push({
          line: 12,
          explanation: `Go LEFT along row ${bottom}: added [${matrix[bottom].slice(left, right + 2).reverse().join(', ')}].`,
          variables: { direction: 'left', row: bottom, result: [...result] },
          visualization: makeViz(bottom, left, '<- left'),
        });
        bottom--;
      }

      // Up
      if (left <= right) {
        for (let i = bottom; i >= top; i--) {
          visited.add(idx(i, left));
          result.push(matrix[i][left]);
        }
        steps.push({
          line: 16,
          explanation: `Go UP along column ${left}: collected values upward.`,
          variables: { direction: 'up', col: left, result: [...result] },
          visualization: makeViz(top, left, '^ up'),
        });
        left++;
      }
    }

    // Final
    steps.push({
      line: 18,
      explanation: `Spiral traversal complete! Result: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'found'])),
        labels: {},
        auxData: {
          label: 'Final Result',
          entries: [{ key: 'Spiral order', value: result.join(', ') }],
        },
      },
    });

    return steps;
  },
};

export default spiralTraversal;
