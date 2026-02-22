import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const maximalRectangleDp: AlgorithmDefinition = {
  id: 'maximal-rectangle-dp',
  title: 'Maximal Rectangle (DP Approach)',
  leetcodeNumber: 85,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a binary matrix of 0s and 1s, find the largest rectangle containing only 1s. The DP approach computes for each cell the height (consecutive 1s above including current row), left boundary (leftmost index of continuous 1s at this height), and right boundary. Area at each cell = (right - left) * height. We update these three DP arrays row by row.',
  tags: ['dp', 'matrix', 'rectangle', 'histogram'],

  code: {
    pseudocode: `function maximalRectangle(matrix):
  rows = len(matrix), cols = len(matrix[0])
  height = array of cols zeros
  left = array of cols zeros
  right = array of cols, all cols
  maxArea = 0
  for i from 0 to rows-1:
    currLeft = 0, currRight = cols
    for j from 0 to cols-1:
      if matrix[i][j] == '1': height[j]++
      else: height[j] = 0
    for j from 0 to cols-1:
      if matrix[i][j] == '1': left[j] = max(left[j], currLeft)
      else: left[j] = 0; currLeft = j+1
    for j from cols-1 downto 0:
      if matrix[i][j] == '1': right[j] = min(right[j], currRight)
      else: right[j] = cols; currRight = j
    for j from 0 to cols-1:
      maxArea = max(maxArea, (right[j]-left[j])*height[j])
  return maxArea`,
    python: `def maximalRectangle(matrix):
    if not matrix: return 0
    rows, cols = len(matrix), len(matrix[0])
    height = [0]*cols; left = [0]*cols; right = [cols]*cols
    max_area = 0
    for i in range(rows):
        curr_left, curr_right = 0, cols
        for j in range(cols):
            height[j] = height[j]+1 if matrix[i][j]=='1' else 0
        for j in range(cols):
            if matrix[i][j]=='1': left[j] = max(left[j], curr_left)
            else: left[j]=0; curr_left=j+1
        for j in range(cols-1,-1,-1):
            if matrix[i][j]=='1': right[j] = min(right[j], curr_right)
            else: right[j]=cols; curr_right=j
        for j in range(cols):
            max_area = max(max_area, (right[j]-left[j])*height[j])
    return max_area`,
    javascript: `function maximalRectangle(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const height = new Array(cols).fill(0);
  const left = new Array(cols).fill(0);
  const right = new Array(cols).fill(cols);
  let maxArea = 0;
  for (let i = 0; i < rows; i++) {
    let currLeft = 0, currRight = cols;
    for (let j = 0; j < cols; j++)
      height[j] = matrix[i][j]==='1' ? height[j]+1 : 0;
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j]==='1') left[j] = Math.max(left[j], currLeft);
      else { left[j]=0; currLeft=j+1; }
    }
    for (let j = cols-1; j >= 0; j--) {
      if (matrix[i][j]==='1') right[j] = Math.min(right[j], currRight);
      else { right[j]=cols; currRight=j; }
    }
    for (let j = 0; j < cols; j++)
      maxArea = Math.max(maxArea, (right[j]-left[j])*height[j]);
  }
  return maxArea;
}`,
    java: `public int maximalRectangle(char[][] matrix) {
    int rows=matrix.length, cols=matrix[0].length;
    int[] height=new int[cols], left=new int[cols];
    int[] right=new int[cols];
    Arrays.fill(right, cols);
    int maxArea=0;
    for (int i=0;i<rows;i++) {
        int currLeft=0, currRight=cols;
        for (int j=0;j<cols;j++)
            height[j]=matrix[i][j]=='1'?height[j]+1:0;
        for (int j=0;j<cols;j++) {
            if(matrix[i][j]=='1') left[j]=Math.max(left[j],currLeft);
            else {left[j]=0;currLeft=j+1;}
        }
        for (int j=cols-1;j>=0;j--) {
            if(matrix[i][j]=='1') right[j]=Math.min(right[j],currRight);
            else {right[j]=cols;currRight=j;}
        }
        for (int j=0;j<cols;j++)
            maxArea=Math.max(maxArea,(right[j]-left[j])*height[j]);
    }
    return maxArea;
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
      placeholder: '[[1,0,1],[1,1,1]]',
      helperText: 'Nested array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const height = new Array(cols).fill(0);
    const left = new Array(cols).fill(0);
    const right = new Array(cols).fill(cols);
    let maxArea = 0;

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: string[]): DPVisualization => ({
      type: 'dp-table',
      values: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize height, left, right arrays of length ${cols}. Process each row to find max rectangle.`,
      variables: { rows, cols, maxArea },
      visualization: makeViz(height, {}, Array.from({ length: cols }, (_, j) => `col${j}`)),
    });

    for (let i = 0; i < rows; i++) {
      // Update heights
      for (let j = 0; j < cols; j++) {
        height[j] = matrix[i][j] === 1 ? height[j] + 1 : 0;
      }
      steps.push({
        line: 10,
        explanation: `Row ${i}: updated heights = [${height.join(', ')}].`,
        variables: { row: i, height: height.join(',') },
        visualization: makeViz([...height], {}, Array.from({ length: cols }, (_, j) => `h[${j}]`)),
      });

      // Update left
      let currLeft = 0;
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === 1) {
          left[j] = Math.max(left[j], currLeft);
        } else {
          left[j] = 0;
          currLeft = j + 1;
        }
      }

      // Update right
      let currRight = cols;
      for (let j = cols - 1; j >= 0; j--) {
        if (matrix[i][j] === 1) {
          right[j] = Math.min(right[j], currRight);
        } else {
          right[j] = cols;
          currRight = j;
        }
      }

      steps.push({
        line: 17,
        explanation: `Row ${i}: left = [${left.join(', ')}], right = [${right.join(', ')}].`,
        variables: { row: i, left: left.join(','), right: right.join(',') },
        visualization: makeViz([...left], {}, Array.from({ length: cols }, (_, j) => `L[${j}]`)),
      });

      // Compute areas
      for (let j = 0; j < cols; j++) {
        const area = (right[j] - left[j]) * height[j];
        if (area > maxArea) {
          maxArea = area;
          steps.push({
            line: 19,
            explanation: `Row ${i}, col ${j}: area = (${right[j]}-${left[j]}) * ${height[j]} = ${area}. New max area!`,
            variables: { row: i, col: j, area, maxArea },
            visualization: makeViz([...height], { [j]: 'found' }, Array.from({ length: cols }, (_, k) => `h[${k}]`)),
          });
        }
      }
    }

    steps.push({
      line: 20,
      explanation: `Maximum rectangle area = ${maxArea}.`,
      variables: { result: maxArea },
      visualization: makeViz(height, {}, Array.from({ length: cols }, (_, j) => `col${j}`)),
    });

    return steps;
  },
};

export default maximalRectangleDp;
