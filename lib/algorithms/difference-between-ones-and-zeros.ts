import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const differenceBetweenOnesAndZeros: AlgorithmDefinition = {
  id: 'difference-between-ones-and-zeros',
  title: 'Difference Between Ones and Zeros in Row and Column',
  leetcodeNumber: 2482,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an m x n binary matrix, compute diff[i][j] = onesRow[i] + onesCol[j] - zerosRow[i] - zerosCol[j], where onesRow[i] is the count of 1s in row i, etc. Precompute row/col counts then fill the result matrix.',
  tags: ['Matrix', 'Prefix Sum', 'Array'],
  code: {
    pseudocode: `function onesMinusZeros(grid):
  m, n = size(grid)
  onesRow[i] = sum of row i
  onesCol[j] = sum of col j
  zerosRow[i] = n - onesRow[i]
  zerosCol[j] = m - onesCol[j]
  diff[i][j] = onesRow[i]+onesCol[j]-zerosRow[i]-zerosCol[j]
  return diff`,
    python: `def onesMinusZeros(grid):
    m, n = len(grid), len(grid[0])
    onesRow = [sum(row) for row in grid]
    onesCol = [sum(grid[i][j] for i in range(m)) for j in range(n)]
    return [[onesRow[i]+onesCol[j]-(n-onesRow[i])-(m-onesCol[j])
             for j in range(n)] for i in range(m)]`,
    javascript: `function onesMinusZeros(grid) {
  const m=grid.length, n=grid[0].length;
  const oR=grid.map(row=>row.reduce((s,v)=>s+v,0));
  const oC=Array.from({length:n},(_,j)=>grid.reduce((s,r)=>s+r[j],0));
  return Array.from({length:m},(_,i)=>Array.from({length:n},(_,j)=>oR[i]+oC[j]-(n-oR[i])-(m-oC[j])));
}`,
    java: `public int[][] onesMinusZeros(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int[] oR=new int[m], oC=new int[n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){oR[i]+=grid[i][j];oC[j]+=grid[i][j];}
    int[][] diff=new int[m][n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) diff[i][j]=oR[i]+oC[j]-(n-oR[i])-(m-oC[j]);
    return diff;
}`,
  },
  defaultInput: { matrix: [[0, 1, 1], [1, 0, 1], [0, 0, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Binary Matrix',
      type: 'string',
      defaultValue: '0 1 1, 1 0 1, 0 0 1',
      placeholder: 'e.g. 0 1 1, 1 0 1, 0 0 1',
      helperText: 'Rows by commas, binary values (0 or 1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let grid: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      grid = input.matrix as number[][];
    } else {
      grid = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = grid.length, n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    const onesRow = grid.map(row => row.reduce((s, v) => s + v, 0));
    const onesCol = Array.from({ length: n }, (_, j) => grid.reduce((s, r) => s + r[j], 0));
    const diff: number[] = new Array(m * n).fill(0);

    function makeViz(currIdx: number, isDiff: boolean, note: string): ArrayVisualization {
      const array = isDiff ? diff : grid.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `(${ri},${ci})=${isDiff ? diff[i] : grid[ri][ci]}`;
        highlights[i] = isDiff && diff[i] !== 0 ? (diff[i] > 0 ? 'found' : 'mismatch') : 'default';
      }
      if (currIdx >= 0) highlights[currIdx] = 'active';
      return {
        type: 'array',
        array,
        highlights,
        labels,
        auxData: { label: 'Ones-Zeros Diff', entries: [{ key: 'Phase', value: note }, { key: 'onesRow', value: onesRow.join(', ') }, { key: 'onesCol', value: onesCol.join(', ') }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Compute diff[i][j] = onesRow[i] + onesCol[j] - zerosRow[i] - zerosCol[j] for ${m}x${n} matrix.`,
      variables: { m, n, onesRow, onesCol },
      visualization: makeViz(-1, false, 'Computing row/col counts'),
    });

    steps.push({
      line: 3,
      explanation: `onesRow = [${onesRow.join(', ')}], onesCol = [${onesCol.join(', ')}].`,
      variables: { onesRow, onesCol },
      visualization: makeViz(-1, false, 'Counts ready'),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        const val = onesRow[i] + onesCol[j] - (n - onesRow[i]) - (m - onesCol[j]);
        diff[idx] = val;
        steps.push({
          line: 7,
          explanation: `diff[${i}][${j}] = onesRow[${i}](${onesRow[i]}) + onesCol[${j}](${onesCol[j]}) - zerosRow(${n - onesRow[i]}) - zerosCol(${m - onesCol[j]}) = ${val}.`,
          variables: { i, j, val, onesRow: onesRow[i], onesCol: onesCol[j] },
          visualization: makeViz(idx, true, `Filling (${i},${j})`),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Difference matrix complete. Positive = more 1s than 0s; negative = more 0s.`,
      variables: { diff },
      visualization: makeViz(-1, true, 'Done'),
    });

    return steps;
  },
};

export default differenceBetweenOnesAndZeros;
