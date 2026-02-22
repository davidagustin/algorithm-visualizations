import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximalSquareDp: AlgorithmDefinition = {
  id: 'maximal-square-dp',
  title: 'Maximal Square (DP)',
  leetcodeNumber: 221,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the largest square containing only 1s in a binary matrix and return its area. Use DP where dp[r][c] = side length of the largest square whose bottom-right corner is at (r,c). The recurrence is: dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 when matrix[r][c] = 1.',
  tags: ['dynamic programming', 'grid', 'matrix', 'squares'],

  code: {
    pseudocode: `function maximalSquare(matrix):
  rows, cols = dimensions
  dp = 2D array of zeros
  maxSide = 0
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      if matrix[r][c] == '1':
        if r == 0 or c == 0: dp[r][c] = 1
        else: dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1
        maxSide = max(maxSide, dp[r][c])
  return maxSide * maxSide`,
    python: `def maximalSquare(matrix):
    rows,cols=len(matrix),len(matrix[0])
    dp=[[0]*cols for _ in range(rows)]
    maxSide=0
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c]=='1':
                dp[r][c]=1 if r==0 or c==0 else min(dp[r-1][c],dp[r][c-1],dp[r-1][c-1])+1
                maxSide=max(maxSide,dp[r][c])
    return maxSide*maxSide`,
    javascript: `function maximalSquare(matrix) {
  const rows=matrix.length,cols=matrix[0].length;
  const dp=Array.from({length:rows},()=>Array(cols).fill(0));
  let maxSide=0;
  for(let r=0;r<rows;r++)
    for(let c=0;c<cols;c++)
      if(matrix[r][c]==='1') {
        dp[r][c]=r===0||c===0?1:Math.min(dp[r-1][c],dp[r][c-1],dp[r-1][c-1])+1;
        maxSide=Math.max(maxSide,dp[r][c]);
      }
  return maxSide*maxSide;
}`,
    java: `public int maximalSquare(char[][] matrix) {
    int rows=matrix.length,cols=matrix[0].length,maxSide=0;
    int[][] dp=new int[rows][cols];
    for(int r=0;r<rows;r++)
        for(int c=0;c<cols;c++)
            if(matrix[r][c]=='1') {
                dp[r][c]=r==0||c==0?1:Math.min(Math.min(dp[r-1][c],dp[r][c-1]),dp[r-1][c-1])+1;
                maxSide=Math.max(maxSide,dp[r][c]);
            }
    return maxSide*maxSide;
}`,
  },

  defaultInput: {
    matrix: [['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix (0s and 1s as strings)',
      type: 'array',
      defaultValue: [['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']],
      placeholder: '[["1","0"],["1","1"]]',
      helperText: '2D binary matrix with characters 0 and 1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as string[][];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    let maxSide = 0;
    let bestR = 0, bestC = 0;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Binary matrix ${rows}x${cols}. Find largest square of 1s using DP (dp[r][c] = side length of largest square at (r,c)).`,
      variables: { rows, cols, maxSide: 0 },
      visualization: makeViz(matrix.flat().map(v => Number(v)), {}, {}),
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === '1') {
          if (r === 0 || c === 0) {
            dp[r][c] = 1;
          } else {
            dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) + 1;
          }

          const hi: Record<number, string> = {};
          const lb: Record<number, string> = {};
          hi[r * cols + c] = dp[r][c] > maxSide ? 'found' : 'active';
          lb[r * cols + c] = `${dp[r][c]}`;
          if (r > 0) hi[(r - 1) * cols + c] = 'comparing';
          if (c > 0) hi[r * cols + (c - 1)] = 'comparing';
          if (r > 0 && c > 0) hi[(r - 1) * cols + (c - 1)] = 'comparing';

          if (dp[r][c] > maxSide) { maxSide = dp[r][c]; bestR = r; bestC = c; }

          steps.push({
            line: r === 0 || c === 0 ? 7 : 8,
            explanation: `dp[${r}][${c}] = ${dp[r][c]}. MaxSide so far = ${maxSide}.`,
            variables: { r, c, dpVal: dp[r][c], maxSide, maxArea: maxSide * maxSide },
            visualization: makeViz(dp.flat(), hi, lb),
          });
        }
      }
    }

    const finalHi: Record<number, string> = { [bestR * cols + bestC]: 'found' };
    const finalLb: Record<number, string> = { [bestR * cols + bestC]: `${maxSide}` };
    steps.push({
      line: 10,
      explanation: `Largest square has side ${maxSide}. Area = ${maxSide * maxSide}.`,
      variables: { maxSide, maxArea: maxSide * maxSide },
      visualization: makeViz(dp.flat(), finalHi, finalLb),
    });

    return steps;
  },
};

export default maximalSquareDp;
