import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cellsWithOddValues: AlgorithmDefinition = {
  id: 'cells-with-odd-values',
  title: 'Cells with Odd Values in a Matrix',
  leetcodeNumber: 1252,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an m x n matrix initialized to zeros and a list of indices [ri, ci], each operation increments all elements in row ri and all elements in column ci by 1. After all operations, count the number of cells with odd values. Use row and column increment counters and apply parity math to avoid building the full matrix.',
  tags: ['array', 'matrix', 'simulation'],

  code: {
    pseudocode: `function oddCells(m, n, indices):
  rowCount = array of zeros size m
  colCount = array of zeros size n
  for [ri, ci] in indices:
    rowCount[ri]++; colCount[ci]++
  count = 0
  for r in range(m):
    for c in range(n):
      if (rowCount[r] + colCount[c]) % 2 == 1:
        count++
  return count`,
    python: `def oddCells(m, n, indices):
    row_count = [0] * m
    col_count = [0] * n
    for ri, ci in indices:
        row_count[ri] += 1
        col_count[ci] += 1
    count = 0
    for r in range(m):
        for c in range(n):
            if (row_count[r] + col_count[c]) % 2 == 1:
                count += 1
    return count`,
    javascript: `function oddCells(m, n, indices) {
  const rowCount = new Array(m).fill(0);
  const colCount = new Array(n).fill(0);
  for (const [ri, ci] of indices) {
    rowCount[ri]++;
    colCount[ci]++;
  }
  let count = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if ((rowCount[r] + colCount[c]) % 2 === 1) count++;
  return count;
}`,
    java: `public int oddCells(int m, int n, int[][] indices) {
    int[] rowCount = new int[m], colCount = new int[n];
    for (int[] idx : indices) { rowCount[idx[0]]++; colCount[idx[1]]++; }
    int count = 0;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if ((rowCount[r] + colCount[c]) % 2 == 1) count++;
    return count;
}`,
  },

  defaultInput: {
    m: 2,
    n: 3,
    indices: [[0, 1], [1, 1]],
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of rows',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = (input.m as number) || 2;
    const n = (input.n as number) || 3;
    const indices = [[0, 1], [1, 1]];
    const steps: AlgorithmStep[] = [];

    const rowCount = new Array(m).fill(0);
    const colCount = new Array(n).fill(0);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize ${m}x${n} matrix. Track row/column increment counts instead of full matrix.`,
      variables: { m, n, rowCount: rowCount.join(', '), colCount: colCount.join(', ') },
      visualization: makeViz(new Array(m * n).fill(0), {}, {}),
    });

    for (const [ri, ci] of indices) {
      rowCount[ri]++;
      colCount[ci]++;
      steps.push({
        line: 4,
        explanation: `Operation [${ri},${ci}]: rowCount[${ri}]=${rowCount[ri]}, colCount[${ci}]=${colCount[ci]}.`,
        variables: { ri, ci, rowCount: rowCount.join(', '), colCount: colCount.join(', ') },
        visualization: makeViz([...rowCount, ...colCount], { [ri]: 'active', [m + ci]: 'active' }, {}),
      });
    }

    // Build actual matrix for visualization
    const matrix: number[][] = Array.from({ length: m }, (_, r) =>
      Array.from({ length: n }, (_, c) => rowCount[r] + colCount[c])
    );
    const flat = matrix.flat();

    steps.push({
      line: 5,
      explanation: `Matrix values computed from row+col counts. Now count cells with odd sums.`,
      variables: { matrix: flat.join(', ') },
      visualization: makeViz(flat, {}, {}),
    });

    let count = 0;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        const val = rowCount[r] + colCount[c];
        const isOdd = val % 2 === 1;
        if (isOdd) count++;
        steps.push({
          line: 8,
          explanation: `Cell (${r},${c}): rowCount[${r}]+colCount[${c}]=${rowCount[r]}+${colCount[c]}=${val}. ${isOdd ? 'Odd! count=' + count : 'Even.'}`,
          variables: { r, c, value: val, isOdd, count },
          visualization: makeViz(flat, { [r * n + c]: isOdd ? 'found' : 'comparing' }, { [r * n + c]: String(val) }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Total cells with odd values: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        flat,
        Object.fromEntries(flat.map((v, i) => [i, v % 2 === 1 ? 'found' : 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default cellsWithOddValues;
