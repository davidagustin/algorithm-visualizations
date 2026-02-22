import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximalRectangle: AlgorithmDefinition = {
  id: 'maximal-rectangle',
  title: 'Maximal Rectangle',
  leetcodeNumber: 85,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given a binary matrix filled with 0s and 1s, find the largest rectangle containing only 1s. Build a histogram row by row: for each row, heights[j] is the count of consecutive 1s ending at that row in column j. Then apply the largest rectangle in histogram algorithm using a monotonic stack on each row.',
  tags: ['stack', 'monotonic stack', 'matrix', 'histogram', 'dynamic programming'],

  code: {
    pseudocode: `function maximalRectangle(matrix):
  if empty: return 0
  cols = len(matrix[0])
  heights = [0] * cols
  maxArea = 0
  for each row in matrix:
    for j = 0 to cols-1:
      heights[j] = heights[j]+1 if row[j]=='1' else 0
    maxArea = max(maxArea, largestInHistogram(heights))
  return maxArea

function largestInHistogram(heights):
  stack = [-1], maxArea = 0
  for i = 0 to n:
    while stack.top != -1 and heights[stack.top] >= heights[i]:
      h = heights[stack.pop()]
      w = i - stack.top - 1
      maxArea = max(maxArea, h*w)
    stack.push(i)
  return maxArea`,

    python: `def maximalRectangle(matrix: list[list[str]]) -> int:
    if not matrix: return 0
    cols = len(matrix[0])
    heights = [0] * cols
    max_area = 0
    for row in matrix:
        for j in range(cols):
            heights[j] = heights[j] + 1 if row[j] == '1' else 0
        stack, max_area = [-1], max(max_area, largest_hist(heights))
    return max_area`,

    javascript: `function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let maxArea = 0;
  for (const row of matrix) {
    for (let j = 0; j < cols; j++) {
      heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
    }
    maxArea = Math.max(maxArea, largestInHistogram(heights));
  }
  return maxArea;
}
function largestInHistogram(h) {
  const s = [-1]; let max = 0;
  const hs = [...h, 0];
  for (let i = 0; i < hs.length; i++) {
    while (s.at(-1) !== -1 && hs[s.at(-1)] >= hs[i]) {
      const height = hs[s.pop()];
      max = Math.max(max, height * (i - s.at(-1) - 1));
    }
    s.push(i);
  }
  return max;
}`,

    java: `public int maximalRectangle(char[][] matrix) {
    if (matrix.length == 0) return 0;
    int cols = matrix[0].length;
    int[] heights = new int[cols];
    int maxArea = 0;
    for (char[] row : matrix) {
        for (int j = 0; j < cols; j++)
            heights[j] = row[j] == '1' ? heights[j] + 1 : 0;
        maxArea = Math.max(maxArea, largestInHistogram(heights));
    }
    return maxArea;
}`,
  },

  defaultInput: {
    matrix: '1010,1111,0110',
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'string',
      defaultValue: '1010,1111,0110',
      placeholder: '1010,1111,0110',
      helperText: 'Rows of 0s and 1s separated by commas',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrixStr = input.matrix as string;
    const rows = matrixStr.split(',').map(row => row.trim().split(''));
    const steps: AlgorithmStep[] = [];

    if (rows.length === 0 || rows[0].length === 0) {
      steps.push({
        line: 1,
        explanation: 'Empty matrix. Return 0.',
        variables: { result: 0 },
        visualization: { type: 'stack', items: [], inputChars: [], currentIndex: -1, action: 'idle' },
      });
      return steps;
    }

    const cols = rows[0].length;
    const heights = new Array(cols).fill(0);
    let maxArea = 0;
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: heights.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Matrix has ${rows.length} rows and ${cols} cols. Build histogram row by row.`,
      variables: { rows: rows.length, cols, heights: [...heights], maxArea: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let j = 0; j < cols; j++) {
        heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
      }

      stack.length = 0;
      stack.push(...heights.map((h, j) => `col${j}:h${h}`));

      steps.push({
        line: 7,
        explanation: `Row ${r} = [${row.join('')}]. Updated heights = [${heights.join(', ')}].`,
        variables: { row: r, heights: [...heights] },
        visualization: makeViz(r, 'push'),
      });

      // Largest rectangle in histogram
      const hs = [...heights, 0];
      const histStack: number[] = [-1];
      let rowMax = 0;

      for (let i = 0; i < hs.length; i++) {
        while (histStack[histStack.length - 1] !== -1 && hs[histStack[histStack.length - 1]] >= hs[i]) {
          const topIdx = histStack.pop()!;
          const h = hs[topIdx];
          const w = i - histStack[histStack.length - 1] - 1;
          const area = h * w;
          rowMax = Math.max(rowMax, area);

          stack.length = 0;
          stack.push(`h=${h}`, `w=${w}`, `area=${area}`);

          steps.push({
            line: 14,
            explanation: `Histogram pop at row ${r}: h=${h}, w=${w}, area=${area}. rowMax=${rowMax}.`,
            variables: { r, i, h, w, area, rowMax },
            visualization: makeViz(i, 'pop'),
          });
        }
        histStack.push(i);
      }

      maxArea = Math.max(maxArea, rowMax);
      steps.push({
        line: 8,
        explanation: `Row ${r} histogram max = ${rowMax}. Overall maxArea = ${maxArea}.`,
        variables: { row: r, rowMax, maxArea },
        visualization: makeViz(r, maxArea === rowMax ? 'match' : 'idle'),
      });
    }

    steps.push({
      line: 9,
      explanation: `All rows processed. Maximal rectangle area = ${maxArea}.`,
      variables: { result: maxArea },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default maximalRectangle;
