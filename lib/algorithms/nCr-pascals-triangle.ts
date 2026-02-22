import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nCrPascalsTriangle: AlgorithmDefinition = {
  id: 'nCr-pascals-triangle',
  title: 'nCr — Combinations via Pascal\'s Triangle',
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Compute C(n,r) using Pascal\'s triangle identity: C(n,r) = C(n-1,r-1) + C(n-1,r). Build the triangle row by row and highlight the target cell.',
  tags: ['Math', 'Combinatorics', 'Pascal', 'DP'],
  code: {
    pseudocode: `function nCr(n, r):
  C = 2D array of zeros
  for i from 0 to n:
    C[i][0] = 1
    for j from 1 to i:
      C[i][j] = C[i-1][j-1] + C[i-1][j]
    C[i][i] = 1
  return C[n][r]`,
    python: `def nCr(n, r):
    C = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        C[i][0] = 1
        for j in range(1, i):
            C[i][j] = C[i-1][j-1] + C[i-1][j]
        C[i][i] = 1
    return C[n][r]`,
    javascript: `function nCr(n, r) {
  const C = Array.from({length: n+1}, () => new Array(n+1).fill(0));
  for (let i = 0; i <= n; i++) {
    C[i][0] = 1;
    for (let j = 1; j < i; j++)
      C[i][j] = C[i-1][j-1] + C[i-1][j];
    C[i][i] = 1;
  }
  return C[n][r];
}`,
    java: `public int nCr(int n, int r) {
    int[][] C = new int[n+1][n+1];
    for (int i = 0; i <= n; i++) {
        C[i][0] = 1;
        for (int j = 1; j < i; j++)
            C[i][j] = C[i-1][j-1] + C[i-1][j];
        C[i][i] = 1;
    }
    return C[n][r];
}`,
  },
  defaultInput: { n: 6, r: 2 },
  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 6, placeholder: 'e.g. 6', helperText: 'n >= r >= 0, n <= 10' },
    { name: 'r', label: 'r', type: 'number', defaultValue: 2, placeholder: 'e.g. 2' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 10);
    const r = Math.min(input.r as number, n);
    const steps: AlgorithmStep[] = [];
    const C: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));

    const makeViz = (activeRow: number, activeCol: number): ArrayVisualization => {
      const flat: number[] = [];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      let idx = 0;
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
          flat.push(C[i][j]);
          if (i === activeRow && j === activeCol) highlights[idx] = 'active';
          else if (i === n && j === r) highlights[idx] = 'sorted';
          else if (C[i][j] > 0) highlights[idx] = 'found';
          labels[idx] = `C(${i},${j})`;
          idx++;
        }
      }
      return { type: 'array', array: flat, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Compute C(${n},${r}) using Pascal's triangle. Building rows 0..${n}.`,
      variables: { n, r },
      visualization: makeViz(-1, -1),
    });

    for (let i = 0; i <= n; i++) {
      C[i][0] = 1;
      C[i][i] = 1;
      for (let j = 1; j < i; j++) {
        C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
        steps.push({
          line: 5,
          explanation: `C(${i},${j}) = C(${i-1},${j-1}) + C(${i-1},${j}) = ${C[i-1][j-1]} + ${C[i-1][j]} = ${C[i][j]}.`,
          variables: { i, j, value: C[i][j] },
          visualization: makeViz(i, j),
        });
      }
      steps.push({
        line: 6,
        explanation: `Row ${i} complete. C(${i},0)=C(${i},${i})=1.`,
        variables: { row: i },
        visualization: makeViz(i, -1),
      });
    }

    steps.push({
      line: 8,
      explanation: `C(${n},${r}) = ${C[n][r]}.`,
      variables: { n, r, result: C[n][r] },
      visualization: makeViz(n, r),
    });

    return steps;
  },
};

export default nCrPascalsTriangle;
