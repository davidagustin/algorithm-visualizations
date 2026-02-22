import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfEveryRowAndColumn: AlgorithmDefinition = {
  id: 'check-if-every-row-and-column-contains-all-numbers',
  title: 'Check if Every Row and Column Contains All Numbers',
  leetcodeNumber: 2133,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'An n x n matrix is valid if every row and every column contains all integers from 1 to n exactly once. Check each row and column using a set of expected values.',
  tags: ['Matrix', 'Hash Map', 'Validation'],
  code: {
    pseudocode: `function checkValid(matrix):
  n = len(matrix)
  expected = {1..n}
  for each row: if set(row) != expected: return false
  for each col: if set(col) != expected: return false
  return true`,
    python: `def checkValid(matrix):
    n = len(matrix)
    expected = set(range(1, n+1))
    for row in matrix:
        if set(row) != expected: return False
    for j in range(n):
        if set(matrix[i][j] for i in range(n)) != expected: return False
    return True`,
    javascript: `function checkValid(matrix) {
  const n=matrix.length;
  const expected=new Set(Array.from({length:n},(_,i)=>i+1));
  const eq=(a)=>a.size===n&&[...a].every(v=>expected.has(v));
  for(let i=0;i<n;i++) if(!eq(new Set(matrix[i]))) return false;
  for(let j=0;j<n;j++) if(!eq(new Set(matrix.map(r=>r[j])))) return false;
  return true;
}`,
    java: `public boolean checkValid(int[][] matrix) {
    int n=matrix.length;
    for(int i=0;i<n;i++) {
        Set<Integer> row=new HashSet<>(), col=new HashSet<>();
        for(int j=0;j<n;j++) { row.add(matrix[i][j]); col.add(matrix[j][i]); }
        if(row.size()!=n||col.size()!=n) return false;
    }
    return true;
}`,
  },
  defaultInput: { matrix: [[1, 2, 3], [3, 1, 2], [2, 3, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (n x n)',
      type: 'string',
      defaultValue: '1 2 3, 3 1 2, 2 3 1',
      placeholder: 'e.g. 1 2 3, 3 1 2, 2 3 1',
      helperText: 'Rows by commas. Each row and col should have 1..n exactly once.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const n = matrix.length;
    const steps: AlgorithmStep[] = [];
    const expected = new Set(Array.from({ length: n }, (_, i) => i + 1));
    let valid = true;

    function makeViz(highlights: Record<number, string>, note: string): ArrayVisualization {
      const flat = matrix.flat();
      const labels: Record<number, string> = {};
      for (let i = 0; i < n * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${flat[i]}(${ri},${ci})`;
      }
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Row/Col Validation', entries: [{ key: 'Expected', value: `1..${n}` }, { key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Validate ${n}x${n} matrix: each row and column must contain 1..${n} exactly once.`,
      variables: { n, expected: `{1..${n}}` },
      visualization: makeViz(Object.fromEntries(matrix.flat().map((_, i) => [i, 'default'])), 'Start'),
    });

    // Check rows
    for (let i = 0; i < n && valid; i++) {
      const rowSet = new Set(matrix[i]);
      const rowValid = rowSet.size === n && [...rowSet].every(v => expected.has(v));
      const hl: Record<number, string> = {};
      matrix.flat().forEach((_, k) => { hl[k] = 'default'; });
      for (let j = 0; j < n; j++) hl[i * n + j] = rowValid ? 'found' : 'mismatch';
      steps.push({
        line: 3,
        explanation: `Row ${i}: [${matrix[i].join(', ')}] → ${rowValid ? 'valid' : 'INVALID (missing or duplicate)'}`,
        variables: { row: i, values: matrix[i], valid: rowValid },
        visualization: makeViz(hl, `Checking row ${i}`),
      });
      if (!rowValid) valid = false;
    }

    // Check cols
    for (let j = 0; j < n && valid; j++) {
      const col = matrix.map(r => r[j]);
      const colSet = new Set(col);
      const colValid = colSet.size === n && [...colSet].every(v => expected.has(v));
      const hl: Record<number, string> = {};
      matrix.flat().forEach((_, k) => { hl[k] = 'default'; });
      for (let i = 0; i < n; i++) hl[i * n + j] = colValid ? 'found' : 'mismatch';
      steps.push({
        line: 5,
        explanation: `Column ${j}: [${col.join(', ')}] → ${colValid ? 'valid' : 'INVALID (missing or duplicate)'}`,
        variables: { col: j, values: col, valid: colValid },
        visualization: makeViz(hl, `Checking col ${j}`),
      });
      if (!colValid) valid = false;
    }

    steps.push({
      line: 6,
      explanation: valid ? 'All rows and columns valid. Matrix IS valid.' : 'Invalid row or column found. Matrix is NOT valid.',
      variables: { valid },
      visualization: makeViz(Object.fromEntries(matrix.flat().map((_, i) => [i, valid ? 'found' : 'mismatch'])), valid ? 'VALID' : 'INVALID'),
    });

    return steps;
  },
};

export default checkIfEveryRowAndColumn;
