import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNonNegativeProduct: AlgorithmDefinition = {
  id: 'maximum-non-negative-product',
  title: 'Maximum Non-Negative Product in a Matrix',
  leetcodeNumber: 1594,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the path from top-left to bottom-right of a matrix (moving only right or down) with the maximum non-negative product. Track both max and min products at each cell because a negative times a negative can become a positive maximum. Return -1 if no non-negative product path exists.',
  tags: ['dynamic programming', 'grid', 'product', 'math'],

  code: {
    pseudocode: `function maxProductPath(grid):
  rows, cols = dimensions
  dpMax[r][c] = max product path to (r,c)
  dpMin[r][c] = min product path to (r,c)
  dpMax[0][0] = dpMin[0][0] = grid[0][0]
  fill first row and column
  for r from 1 to rows-1:
    for c from 1 to cols-1:
      candidates = [dpMax[r-1][c]*v, dpMin[r-1][c]*v, dpMax[r][c-1]*v, dpMin[r][c-1]*v]
      dpMax[r][c] = max(candidates)
      dpMin[r][c] = min(candidates)
  return dpMax[rows-1][cols-1] % MOD if >= 0 else -1`,
    python: `def maxProductPath(grid):
    MOD = 10**9+7
    rows,cols=len(grid),len(grid[0])
    dpMax=[[0]*cols for _ in range(rows)]
    dpMin=[[0]*cols for _ in range(rows)]
    dpMax[0][0]=dpMin[0][0]=grid[0][0]
    for c in range(1,cols): dpMax[0][c]=dpMin[0][c]=dpMax[0][c-1]*grid[0][c]
    for r in range(1,rows): dpMax[r][0]=dpMin[r][0]=dpMax[r-1][0]*grid[r][0]
    for r in range(1,rows):
        for c in range(1,cols):
            v=grid[r][c]
            cands=[dpMax[r-1][c]*v,dpMin[r-1][c]*v,dpMax[r][c-1]*v,dpMin[r][c-1]*v]
            dpMax[r][c]=max(cands)
            dpMin[r][c]=min(cands)
    return dpMax[-1][-1]%MOD if dpMax[-1][-1]>=0 else -1`,
    javascript: `function maxProductPath(grid) {
  const MOD = 1e9+7;
  const rows=grid.length,cols=grid[0].length;
  const dpMax=Array.from({length:rows},()=>Array(cols).fill(0));
  const dpMin=Array.from({length:rows},()=>Array(cols).fill(0));
  dpMax[0][0]=dpMin[0][0]=grid[0][0];
  for(let c=1;c<cols;c++) dpMax[0][c]=dpMin[0][c]=dpMax[0][c-1]*grid[0][c];
  for(let r=1;r<rows;r++) dpMax[r][0]=dpMin[r][0]=dpMax[r-1][0]*grid[r][0];
  for(let r=1;r<rows;r++) for(let c=1;c<cols;c++) {
    const v=grid[r][c];
    const cs=[dpMax[r-1][c]*v,dpMin[r-1][c]*v,dpMax[r][c-1]*v,dpMin[r][c-1]*v];
    dpMax[r][c]=Math.max(...cs); dpMin[r][c]=Math.min(...cs);
  }
  return dpMax[rows-1][cols-1]>=0?dpMax[rows-1][cols-1]%MOD:-1;
}`,
    java: `public int maxProductPath(int[][] grid) {
    long MOD=1_000_000_007L;
    int rows=grid.length,cols=grid[0].length;
    long[][] dpMax=new long[rows][cols],dpMin=new long[rows][cols];
    dpMax[0][0]=dpMin[0][0]=grid[0][0];
    for(int c=1;c<cols;c++) dpMax[0][c]=dpMin[0][c]=dpMax[0][c-1]*grid[0][c];
    for(int r=1;r<rows;r++) dpMax[r][0]=dpMin[r][0]=dpMax[r-1][0]*grid[r][0];
    for(int r=1;r<rows;r++) for(int c=1;c<cols;c++) {
        long v=grid[r][c];
        long a=dpMax[r-1][c]*v,b=dpMin[r-1][c]*v,cc=dpMax[r][c-1]*v,d=dpMin[r][c-1]*v;
        dpMax[r][c]=Math.max(Math.max(a,b),Math.max(cc,d));
        dpMin[r][c]=Math.min(Math.min(a,b),Math.min(cc,d));
    }
    return dpMax[rows-1][cols-1]>=0?(int)(dpMax[rows-1][cols-1]%MOD):-1;
}`,
  },

  defaultInput: {
    grid: [[-1, -2, -3], [-2, -3, -3], [-3, -3, -2]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (can have negatives)',
      type: 'array',
      defaultValue: [[-1, -2, -3], [-2, -3, -3], [-3, -3, -2]],
      placeholder: '[[-1,-2,-3],[-2,-3,-3],[-3,-3,-2]]',
      helperText: '2D grid, can contain negative numbers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const rows = grid.length;
    const cols = grid[0].length;
    const steps: AlgorithmStep[] = [];
    const MOD = 1e9 + 7;

    const dpMax: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    const dpMin: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    dpMax[0][0] = dpMin[0][0] = grid[0][0];
    for (let c = 1; c < cols; c++) dpMax[0][c] = dpMin[0][c] = dpMax[0][c - 1] * grid[0][c];
    for (let r = 1; r < rows; r++) dpMax[r][0] = dpMin[r][0] = dpMax[r - 1][0] * grid[r][0];

    steps.push({
      line: 3,
      explanation: `Initialize top-left corner. First row and col products: max=[${dpMax[0].join(',')}]`,
      variables: { startVal: grid[0][0] },
      visualization: makeViz(dpMax.flat(), { 0: 'active' }, { 0: `${grid[0][0]}` }),
    });

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const v = grid[r][c];
        const cands = [
          dpMax[r - 1][c] * v,
          dpMin[r - 1][c] * v,
          dpMax[r][c - 1] * v,
          dpMin[r][c - 1] * v,
        ];
        dpMax[r][c] = Math.max(...cands);
        dpMin[r][c] = Math.min(...cands);

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = dpMax[r][c] >= 0 ? 'active' : 'mismatch';
        lb[r * cols + c] = `max:${dpMax[r][c]}`;

        steps.push({
          line: 9,
          explanation: `Cell (${r},${c}) value=${v}: maxProduct=${dpMax[r][c]}, minProduct=${dpMin[r][c]}`,
          variables: { r, c, value: v, maxProduct: dpMax[r][c], minProduct: dpMin[r][c] },
          visualization: makeViz(dpMax.flat(), hi, lb),
        });
      }
    }

    const finalMax = dpMax[rows - 1][cols - 1];
    const answer = finalMax >= 0 ? finalMax % MOD : -1;

    const finalHi: Record<number, string> = { [(rows - 1) * cols + (cols - 1)]: finalMax >= 0 ? 'found' : 'mismatch' };
    const finalLb: Record<number, string> = { [(rows - 1) * cols + (cols - 1)]: `ans:${answer}` };

    steps.push({
      line: 11,
      explanation: `Maximum non-negative product = ${answer}${answer === -1 ? ' (no valid path)' : ' (mod 10^9+7)'}`,
      variables: { answer, rawMax: finalMax },
      visualization: makeViz(dpMax.flat(), finalHi, finalLb),
    });

    return steps;
  },
};

export default maximumNonNegativeProduct;
