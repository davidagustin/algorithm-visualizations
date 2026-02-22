import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubmatricesWithAllOnes: AlgorithmDefinition = {
  id: 'count-submatrices-with-all-ones',
  title: 'Count Submatrices With All Ones',
  leetcodeNumber: 1504,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a binary matrix, count the number of submatrices that contain all ones. For each cell, compute the number of consecutive 1s ending at that cell going upward (height), then for each row sweep left to count valid rectangles using a histogram approach.',
  tags: ['dynamic programming', 'grid', 'matrix', 'counting'],

  code: {
    pseudocode: `function numSubmat(mat):
  rows, cols = dimensions
  height = 2D array, height[r][c] = consecutive 1s above (r,c)
  total = 0
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      height[r][c] = mat[r][c]==0 ? 0 : height[r-1][c]+1
    for c from 0 to cols-1:
      minH = height[r][c]
      for k from c downto 0:
        minH = min(minH, height[r][k])
        total += minH
  return total`,
    python: `def numSubmat(mat):
    rows, cols = len(mat), len(mat[0])
    height = [[0]*cols for _ in range(rows)]
    total = 0
    for r in range(rows):
        for c in range(cols):
            height[r][c] = 0 if mat[r][c]==0 else (height[r-1][c]+1 if r>0 else 1)
        for c in range(cols):
            minH = height[r][c]
            for k in range(c,-1,-1):
                minH = min(minH, height[r][k])
                total += minH
    return total`,
    javascript: `function numSubmat(mat) {
  const rows = mat.length, cols = mat[0].length;
  const height = Array.from({length:rows},()=>Array(cols).fill(0));
  let total = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++)
      height[r][c] = mat[r][c]===0 ? 0 : (r>0 ? height[r-1][c]+1 : 1);
    for (let c = 0; c < cols; c++) {
      let minH = height[r][c];
      for (let k = c; k >= 0; k--) {
        minH = Math.min(minH, height[r][k]);
        total += minH;
      }
    }
  }
  return total;
}`,
    java: `public int numSubmat(int[][] mat) {
    int rows = mat.length, cols = mat[0].length, total = 0;
    int[][] height = new int[rows][cols];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++)
            height[r][c] = mat[r][c]==0 ? 0 : (r>0 ? height[r-1][c]+1 : 1);
        for (int c = 0; c < cols; c++) {
            int minH = height[r][c];
            for (int k = c; k >= 0; k--) {
                minH = Math.min(minH, height[r][k]);
                total += minH;
            }
        }
    }
    return total;
}`,
  },

  defaultInput: {
    mat: [[1, 0, 1], [1, 1, 0], [1, 1, 0]],
  },

  inputFields: [
    {
      name: 'mat',
      label: 'Binary Matrix',
      type: 'array',
      defaultValue: [[1, 0, 1], [1, 1, 0], [1, 1, 0]],
      placeholder: '[[1,0,1],[1,1,0],[1,1,0]]',
      helperText: '2D binary matrix (0s and 1s)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const mat = input.mat as number[][];
    const rows = mat.length;
    const cols = mat[0].length;
    const steps: AlgorithmStep[] = [];

    const height: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    let total = 0;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Count all-one submatrices in a ${rows}x${cols} binary matrix using column height DP.`,
      variables: { rows, cols, total: 0 },
      visualization: makeViz(mat.flat(), {}, {}),
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        height[r][c] = mat[r][c] === 0 ? 0 : (r > 0 ? height[r - 1][c] + 1 : 1);
      }

      const heightRow = height[r];
      const hi: Record<number, string> = {};
      for (let c = 0; c < cols; c++) if (heightRow[c] > 0) hi[c] = 'active';

      steps.push({
        line: 5,
        explanation: `Row ${r}: Heights (consecutive 1s from top) = [${heightRow.join(', ')}]`,
        variables: { row: r, heights: [...heightRow] },
        visualization: makeViz([...heightRow], hi, {}),
      });

      for (let c = 0; c < cols; c++) {
        let minH = height[r][c];
        const rowContrib: Record<number, number> = {};
        for (let k = c; k >= 0; k--) {
          minH = Math.min(minH, height[r][k]);
          rowContrib[k] = minH;
          total += minH;
        }

        const stepHi: Record<number, string> = {};
        const stepLb: Record<number, string> = {};
        for (const k in rowContrib) { stepHi[Number(k)] = 'comparing'; stepLb[Number(k)] = `+${rowContrib[Number(k)]}`; }
        stepHi[c] = 'active';

        steps.push({
          line: 9,
          explanation: `Cell (${r},${c}): sweep left, count rectangles. Running total = ${total}`,
          variables: { row: r, col: c, minH, total },
          visualization: makeViz([...heightRow], stepHi, stepLb),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Total submatrices with all 1s = ${total}`,
      variables: { answer: total },
      visualization: makeViz(mat.flat(), {}, {}),
    });

    return steps;
  },
};

export default countSubmatricesWithAllOnes;
