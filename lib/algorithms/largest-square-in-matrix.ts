import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestSquareInMatrix: AlgorithmDefinition = {
  id: 'largest-square-in-matrix',
  title: 'Largest Square in Matrix',
  leetcodeNumber: 221,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an m x n binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area. dp[i][j] = size of the largest square with bottom-right corner at (i,j). dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 if matrix[i][j] == 1.',
  tags: ['Dynamic Programming', 'Matrix'],
  code: {
    pseudocode: `function maximalSquare(matrix):
  rows = matrix.length, cols = matrix[0].length
  dp = matrix of size rows x cols, all 0
  maxSide = 0
  for i from 0 to rows-1:
    for j from 0 to cols-1:
      if matrix[i][j] == "1":
        if i == 0 or j == 0:
          dp[i][j] = 1
        else:
          dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
        maxSide = max(maxSide, dp[i][j])
  return maxSide * maxSide`,
    python: `def maximalSquare(matrix):
    rows, cols = len(matrix), len(matrix[0])
    dp = [[0]*cols for _ in range(rows)]
    maxSide = 0
    for i in range(rows):
        for j in range(cols):
            if matrix[i][j] == "1":
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                maxSide = max(maxSide, dp[i][j])
    return maxSide * maxSide`,
    javascript: `function maximalSquare(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const dp = Array.from({length: rows}, () => new Array(cols).fill(0));
  let maxSide = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === "1") {
        if (i === 0 || j === 0) {
          dp[i][j] = 1;
        } else {
          dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
        }
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}`,
    java: `public int maximalSquare(char[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    int[][] dp = new int[rows][cols];
    int maxSide = 0;
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == '1') {
                if (i == 0 || j == 0) {
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = Math.min(dp[i-1][j], Math.min(dp[i][j-1], dp[i-1][j-1])) + 1;
                }
                maxSide = Math.max(maxSide, dp[i][j]);
            }
        }
    }
    return maxSide * maxSide;
}`,
  },
  defaultInput: {
    matrix: [
      [1, 0, 1, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0],
    ],
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'array',
      defaultValue: [
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0],
      ],
      placeholder: '[[1,0,1],[1,1,1],[1,1,1]]',
      helperText: '2D binary matrix (1s and 0s)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    let maxSide = 0;

    const idx = (r: number, c: number) => r * cols + c;
    const flatMatrix = (): number[] => {
      const arr: number[] = [];
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
          arr.push(matrix[i][j]);
      return arr;
    };

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (dp[i][j] > 0) baseHighlights[idx(i, j)] = 'found';
          else if (matrix[i][j] === 0) baseHighlights[idx(i, j)] = 'default';
        }
      }
      return {
        type: 'array',
        array: flatMatrix(),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'DP State',
          entries: [
            { key: 'Max Side', value: String(maxSide) },
            { key: 'Max Area', value: String(maxSide * maxSide) },
            ...Array.from({ length: rows }, (_, r) => ({
              key: `dp[${r}]`,
              value: dp[r].join(', '),
            })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Binary matrix ${rows}x${cols}. dp[i][j] = side length of largest square ending at (i,j). Array shows matrix values flattened row by row.`,
      variables: { rows, cols },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === 1) {
          if (i === 0 || j === 0) {
            dp[i][j] = 1;

            steps.push({
              line: 8,
              explanation: `(${i},${j}) is "1" on edge. dp[${i}][${j}] = 1.`,
              variables: { i, j, 'dp[i][j]': 1 },
              visualization: makeViz({ [idx(i, j)]: 'active' }, { [idx(i, j)]: '1' }),
            });
          } else {
            const up = dp[i - 1][j];
            const left = dp[i][j - 1];
            const diag = dp[i - 1][j - 1];
            dp[i][j] = Math.min(up, left, diag) + 1;

            steps.push({
              line: 10,
              explanation: `(${i},${j}) is "1". dp = min(up=${up}, left=${left}, diag=${diag}) + 1 = ${dp[i][j]}. ${dp[i][j] > 1 ? `Can form ${dp[i][j]}x${dp[i][j]} square.` : 'Only 1x1 square.'}`,
              variables: { i, j, up, left, diag, 'dp[i][j]': dp[i][j] },
              visualization: makeViz(
                {
                  [idx(i, j)]: 'active',
                  [idx(i - 1, j)]: 'comparing',
                  [idx(i, j - 1)]: 'comparing',
                  [idx(i - 1, j - 1)]: 'comparing',
                },
                { [idx(i, j)]: String(dp[i][j]) }
              ),
            });
          }

          if (dp[i][j] > maxSide) {
            maxSide = dp[i][j];
            steps.push({
              line: 11,
              explanation: `New max side = ${maxSide}! Largest square area so far = ${maxSide * maxSide}.`,
              variables: { maxSide, area: maxSide * maxSide },
              visualization: makeViz({ [idx(i, j)]: 'match' }, { [idx(i, j)]: `best:${maxSide}` }),
            });
          }
        } else {
          dp[i][j] = 0;
        }
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        if (dp[i][j] > 0) finalHighlights[idx(i, j)] = dp[i][j] === maxSide ? 'match' : 'found';

    steps.push({
      line: 12,
      explanation: `Largest square side = ${maxSide}. Area = ${maxSide * maxSide}.`,
      variables: { result: maxSide * maxSide, maxSide },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default largestSquareInMatrix;
