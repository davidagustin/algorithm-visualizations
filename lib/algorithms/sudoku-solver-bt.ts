import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sudokuSolverBt: AlgorithmDefinition = {
  id: 'sudoku-solver-bt',
  title: 'Sudoku Solver (Backtracking)',
  leetcodeNumber: 37,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Solve a Sudoku puzzle by filling in the empty cells. A sudoku solution must satisfy all rules: each row, column, and 3x3 box must contain digits 1-9 without repetition. Uses backtracking to try each digit and backtrack on conflicts.',
  tags: ['backtracking', 'hash set', 'matrix', 'constraint satisfaction'],

  code: {
    pseudocode: `function solveSudoku(board):
  function isValid(board, row, col, num):
    check row, col, 3x3 box for num
    return true if not found
  function solve(board):
    for each empty cell:
      for digit 1..9:
        if isValid(board, row, col, digit):
          board[row][col] = digit
          if solve(board): return true
          board[row][col] = '.'
      return false
    return true`,
    python: `def solveSudoku(board):
    def isValid(r, c, num):
        box_r, box_c = 3 * (r // 3), 3 * (c // 3)
        for i in range(9):
            if board[r][i] == num: return False
            if board[i][c] == num: return False
            if board[box_r + i//3][box_c + i%3] == num: return False
        return True
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for num in '123456789':
                        if isValid(r, c, num):
                            board[r][c] = num
                            if solve(): return True
                            board[r][c] = '.'
                    return False
        return True
    solve()`,
    javascript: `function solveSudoku(board) {
  function isValid(r, c, num) {
    const br = 3 * Math.floor(r / 3), bc = 3 * Math.floor(c / 3);
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === num || board[i][c] === num ||
          board[br + Math.floor(i/3)][bc + i%3] === num) return false;
    }
    return true;
  }
  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let d = 1; d <= 9; d++) {
            if (isValid(r, c, String(d))) {
              board[r][c] = String(d);
              if (solve()) return true;
              board[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
}`,
    java: `public void solveSudoku(char[][] board) {
    solve(board);
}
private boolean solve(char[][] board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') {
                for (char d = '1'; d <= '9'; d++) {
                    if (isValid(board, r, c, d)) {
                        board[r][c] = d;
                        if (solve(board)) return true;
                        board[r][c] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
}`,
  },

  defaultInput: {
    board: [
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
      name: 'board',
      label: 'Sudoku Board (use 0 for empty)',
      type: 'array',
      defaultValue: [5, 3, 0, 0, 7, 0, 0, 0, 0],
      placeholder: '5,3,0,0,7,0,0,0,0',
      helperText: 'First row of sudoku (9 numbers, 0=empty)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoard = input.board as number[][];
    const steps: AlgorithmStep[] = [];

    const board: number[][] = rawBoard.map(row => [...row]);
    const flatBoard = (): number[] => board.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatBoard(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Start solving sudoku with backtracking. Board shown as flat array (row by row). 0 = empty cell.',
      variables: { emptyCells: flatBoard().filter(v => v === 0).length },
      visualization: makeViz({}, {}),
    });

    function isValid(r: number, c: number, num: number): boolean {
      const br = 3 * Math.floor(r / 3);
      const bc = 3 * Math.floor(c / 3);
      for (let i = 0; i < 9; i++) {
        if (board[r][i] === num) return false;
        if (board[i][c] === num) return false;
        if (board[br + Math.floor(i / 3)][bc + i % 3] === num) return false;
      }
      return true;
    }

    let stepCount = 0;

    function solve(): boolean {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            for (let d = 1; d <= 9; d++) {
              if (isValid(r, c, d)) {
                board[r][c] = d;
                stepCount++;
                if (stepCount <= 20) {
                  const h: Record<number, string> = {};
                  const l: Record<number, string> = {};
                  h[r * 9 + c] = 'active';
                  l[r * 9 + c] = `${d}`;
                  steps.push({
                    line: 8,
                    explanation: `Try digit ${d} at row ${r}, col ${c}. Valid placement - no conflicts in row, column, or box.`,
                    variables: { row: r, col: c, digit: d, attempt: stepCount },
                    visualization: makeViz(h, l),
                  });
                }
                if (solve()) return true;
                board[r][c] = 0;
                if (stepCount <= 20) {
                  const h: Record<number, string> = {};
                  h[r * 9 + c] = 'mismatch';
                  steps.push({
                    line: 9,
                    explanation: `Backtrack: digit ${d} at row ${r}, col ${c} led to conflict. Resetting cell.`,
                    variables: { row: r, col: c, backtrack: true },
                    visualization: makeViz(h, {}),
                  });
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    solve();

    const solvedHighlights: Record<number, string> = {};
    flatBoard().forEach((v, i) => { solvedHighlights[i] = 'found'; });

    steps.push({
      line: 12,
      explanation: 'Sudoku solved successfully! All cells filled with valid digits.',
      variables: { solved: true },
      visualization: makeViz(solvedHighlights, {}),
    });

    return steps;
  },
};

export default sudokuSolverBt;
