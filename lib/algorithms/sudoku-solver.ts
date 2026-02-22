import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sudokuSolver: AlgorithmDefinition = {
  id: 'sudoku-solver',
  title: 'Sudoku Solver',
  leetcodeNumber: 37,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Fill a 9x9 Sudoku board. Each row, column, and 3x3 box must contain digits 1-9 exactly once. Use backtracking: find an empty cell, try digits 1-9, check validity, recurse. If no digit works, backtrack to the previous cell.',
  tags: ['Backtracking', 'Recursion', 'Board'],
  code: {
    pseudocode: `function solveSudoku(board):
  for each empty cell (r, c):
    for digit from '1' to '9':
      if isValid(board, r, c, digit):
        board[r][c] = digit
        if solveSudoku(board): return true
        board[r][c] = '.'
  return true if no empty cell, else false

function isValid(board, r, c, digit):
  check row r has no digit
  check col c has no digit
  check 3x3 box has no digit`,
    python: `def solveSudoku(board):
    def isValid(r, c, ch):
        for i in range(9):
            if board[r][i] == ch: return False
            if board[i][c] == ch: return False
            br, bc = 3*(r//3)+i//3, 3*(c//3)+i%3
            if board[br][bc] == ch: return False
        return True
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for ch in '123456789':
                        if isValid(r, c, ch):
                            board[r][c] = ch
                            if solve(): return True
                            board[r][c] = '.'
                    return False
        return True
    solve()`,
    javascript: `function solveSudoku(board) {
  function isValid(r, c, ch) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch) return false;
      if (board[i][c] === ch) return false;
      const br = 3*Math.floor(r/3)+Math.floor(i/3);
      const bc = 3*Math.floor(c/3)+(i%3);
      if (board[br][bc] === ch) return false;
    }
    return true;
  }
  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let d = 1; d <= 9; d++) {
            const ch = String(d);
            if (isValid(r, c, ch)) {
              board[r][c] = ch;
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
boolean solve(char[][] board) {
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
      label: 'Sudoku Board (9x9, 0=empty)',
      type: 'array',
      defaultValue: [
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
      helperText: 'Flattened 9x9 board, 0 means empty cell',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoard = input.board as number[][];
    // Flatten to 81-element array; 0 = empty
    const board: number[] = rawBoard.flat().map(v => v);
    const steps: AlgorithmStep[] = [];

    function cellKey(r: number, c: number): number { return r * 9 + c; }

    function isValid(b: number[], r: number, c: number, d: number): boolean {
      for (let i = 0; i < 9; i++) {
        if (b[cellKey(r, i)] === d) return false;
        if (b[cellKey(i, c)] === d) return false;
        const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
        const bc = 3 * Math.floor(c / 3) + (i % 3);
        if (b[cellKey(br, bc)] === d) return false;
      }
      return true;
    }

    function makeViz(activeCell: number | null, tryDigit: number | null, valid: boolean | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < 81; i++) {
        labels[i] = board[i] === 0 ? '.' : String(board[i]);
        const wasGiven = rawBoard.flat()[i] !== 0;
        if (i === activeCell) {
          highlights[i] = valid === null ? 'active' : (valid ? 'found' : 'mismatch');
        } else if (wasGiven) {
          highlights[i] = 'sorted';
        } else if (board[i] !== 0) {
          highlights[i] = 'pointer';
        } else {
          highlights[i] = 'default';
        }
      }
      const filledCount = board.filter(v => v !== 0).length;
      return {
        type: 'array',
        array: board.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Sudoku State',
          entries: [
            { key: 'Filled cells', value: `${filledCount}/81` },
            { key: 'Empty cells', value: `${81 - filledCount}` },
            ...(activeCell !== null ? [{ key: 'Current cell', value: `Row ${Math.floor(activeCell / 9)}, Col ${activeCell % 9}` }] : []),
            ...(tryDigit !== null ? [{ key: 'Trying digit', value: String(tryDigit) }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Start Sudoku solver. Find the first empty cell and try digits 1-9, backtracking when stuck.',
      variables: { emptyCells: board.filter(v => v === 0).length },
      visualization: makeViz(null, null, null),
    });

    let solved = false;
    let stepCount = 0;
    const MAX_STEPS = 120;

    function solve(): boolean {
      if (solved || stepCount >= MAX_STEPS) return true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const idx = cellKey(r, c);
          if (board[idx] === 0) {
            if (stepCount < MAX_STEPS) {
              steps.push({
                line: 2,
                explanation: `Found empty cell at row ${r}, col ${c}. Try digits 1-9.`,
                variables: { row: r, col: c },
                visualization: makeViz(idx, null, null),
              });
              stepCount++;
            }

            for (let d = 1; d <= 9; d++) {
              if (stepCount >= MAX_STEPS) break;
              const v = isValid(board, r, c, d);
              if (stepCount < MAX_STEPS) {
                steps.push({
                  line: 4,
                  explanation: `Try digit ${d} at (${r},${c}): ${v ? 'valid' : 'invalid (conflict)'}. ${v ? 'Place it.' : 'Skip.'}`,
                  variables: { row: r, col: c, digit: d, valid: v },
                  visualization: makeViz(idx, d, v ? null : false),
                });
                stepCount++;
              }
              if (v) {
                board[idx] = d;
                if (stepCount < MAX_STEPS) {
                  steps.push({
                    line: 5,
                    explanation: `Placed ${d} at (${r},${c}). Recurse to next empty cell.`,
                    variables: { row: r, col: c, digit: d },
                    visualization: makeViz(idx, d, true),
                  });
                  stepCount++;
                }
                if (solve()) { solved = true; return true; }
                if (!solved) {
                  board[idx] = 0;
                  if (stepCount < MAX_STEPS) {
                    steps.push({
                      line: 6,
                      explanation: `Backtrack: remove ${d} from (${r},${c}). Try next digit.`,
                      variables: { row: r, col: c, removedDigit: d },
                      visualization: makeViz(idx, null, false),
                    });
                    stepCount++;
                  }
                }
              }
            }
            return false;
          }
        }
      }
      solved = true;
      return true;
    }

    solve();

    steps.push({
      line: 7,
      explanation: solved
        ? 'Sudoku solved! All cells filled with valid digits.'
        : 'Showing partial progress (step limit reached). Board partially filled.',
      variables: { solved },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < 81; i++) {
          l[i] = board[i] === 0 ? '.' : String(board[i]);
          const wasGiven = rawBoard.flat()[i] !== 0;
          h[i] = wasGiven ? 'sorted' : (board[i] !== 0 ? 'found' : 'default');
        }
        return {
          type: 'array' as const,
          array: board.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: solved ? 'Solved!' : 'Partial',
            entries: [{ key: 'Status', value: solved ? 'Complete' : 'Partial (capped steps)' }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default sudokuSolver;
