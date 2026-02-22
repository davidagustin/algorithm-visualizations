import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validSudokuII: AlgorithmDefinition = {
  id: 'valid-sudoku-ii',
  title: 'Valid Sudoku',
  leetcodeNumber: 36,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Determine if a 9x9 Sudoku board is valid. Each row, column, and 3x3 sub-box must contain digits 1-9 without repetition. Use three sets of hash sets — one per row, one per column, one per box — to detect duplicates in a single pass.',
  tags: ['Matrix', 'Hash Map', 'Validation'],
  code: {
    pseudocode: `function isValidSudoku(board):
  rows = [set() for _ in 9]
  cols = [set() for _ in 9]
  boxes = [set() for _ in 9]
  for i,j in each non-'.' cell:
    num = board[i][j]
    box = (i//3)*3 + j//3
    if num in rows[i] or cols[j] or boxes[box]:
      return false
    add num to rows[i], cols[j], boxes[box]
  return true`,
    python: `def isValidSudoku(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    for i in range(9):
        for j in range(9):
            val = board[i][j]
            if val == '.': continue
            box = (i//3)*3 + j//3
            if val in rows[i] or val in cols[j] or val in boxes[box]:
                return False
            rows[i].add(val); cols[j].add(val); boxes[box].add(val)
    return True`,
    javascript: `function isValidSudoku(board) {
  const rows = Array.from({length:9}, ()=>new Set());
  const cols = Array.from({length:9}, ()=>new Set());
  const boxes = Array.from({length:9}, ()=>new Set());
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++) {
      const v = board[i][j];
      if (v === '.') continue;
      const b = Math.floor(i/3)*3 + Math.floor(j/3);
      if (rows[i].has(v)||cols[j].has(v)||boxes[b].has(v)) return false;
      rows[i].add(v); cols[j].add(v); boxes[b].add(v);
    }
  return true;
}`,
    java: `public boolean isValidSudoku(char[][] board) {
    Set<String> seen = new HashSet<>();
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            char c = board[i][j];
            if (c == '.') continue;
            if (!seen.add(c+"r"+i) || !seen.add(c+"c"+j) ||
                !seen.add(c+"b"+(i/3*3+j/3))) return false;
        }
    return true;
}`,
  },
  defaultInput: {
    matrix: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Sudoku Board (0 for empty)',
      type: 'string',
      defaultValue: '5 3 0 0 7 0 0 0 0, 6 0 0 1 9 5 0 0 0, 0 9 8 0 0 0 0 6 0, 8 0 0 0 6 0 0 0 3, 4 0 0 8 0 3 0 0 1, 7 0 0 0 2 0 0 0 6, 0 6 0 0 0 0 2 8 0, 0 0 0 4 1 9 0 0 5, 0 0 0 0 8 0 0 7 9',
      placeholder: '9 rows separated by commas',
      helperText: 'Use 0 for empty cells',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let board: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      board = input.matrix as number[][];
    } else {
      board = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const steps: AlgorithmStep[] = [];
    const rows: Set<number>[] = Array.from({ length: 9 }, () => new Set());
    const cols: Set<number>[] = Array.from({ length: 9 }, () => new Set());
    const boxes: Set<number>[] = Array.from({ length: 9 }, () => new Set());
    let valid = true;

    function makeViz(curr: number, conflict: boolean, note: string): ArrayVisualization {
      const flat = board.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < 81; i++) {
        const ri = Math.floor(i / 9), ci = i % 9;
        labels[i] = `(${ri},${ci})`;
        highlights[i] = flat[i] === 0 ? 'default' : 'visited';
      }
      if (curr >= 0) highlights[curr] = conflict ? 'mismatch' : 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Valid Sudoku', entries: [{ key: 'Status', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Validate 9x9 Sudoku board. Check each row, column, and 3x3 box for duplicate digits.',
      variables: {},
      visualization: makeViz(-1, false, 'Checking...'),
    });

    for (let i = 0; i < 9 && valid; i++) {
      for (let j = 0; j < 9; j++) {
        const val = board[i][j];
        if (val === 0) continue;
        const box = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        const conflict = rows[i].has(val) || cols[j].has(val) || boxes[box].has(val);
        const idx = i * 9 + j;
        steps.push({
          line: 7,
          explanation: `Cell (${i},${j})=${val}, box=${box}. ${conflict ? `Duplicate found! Board is INVALID.` : 'No duplicate. Continue.'}`,
          variables: { i, j, val, box, conflict },
          visualization: makeViz(idx, conflict, conflict ? 'INVALID' : `Checking (${i},${j})`),
        });
        if (conflict) { valid = false; break; }
        rows[i].add(val); cols[j].add(val); boxes[box].add(val);
      }
    }

    steps.push({
      line: 10,
      explanation: valid ? 'All cells valid. Sudoku board is VALID.' : 'Conflict found. Sudoku board is INVALID.',
      variables: { valid },
      visualization: makeViz(-1, !valid, valid ? 'VALID' : 'INVALID'),
    });

    return steps;
  },
};

export default validSudokuII;
