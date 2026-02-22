import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nQueens: AlgorithmDefinition = {
  id: 'n-queens',
  title: 'N-Queens',
  leetcodeNumber: 51,
  difficulty: 'Hard',
  category: 'Arrays',
  description:
    'Place N queens on an NxN chessboard so that no two queens threaten each other (no two share the same row, column, or diagonal). We use backtracking: try placing a queen in each column of the current row, check for conflicts, and backtrack if no valid placement exists.',
  tags: ['Backtracking', 'Recursion', 'Board'],
  code: {
    pseudocode: `function solveNQueens(n):
  board = array of n, filled with -1
  solve(board, 0, n)

function solve(board, row, n):
  if row == n:
    record solution; return true
  for col from 0 to n-1:
    if isSafe(board, row, col):
      board[row] = col
      if solve(board, row+1, n): return true
      board[row] = -1
  return false`,
    python: `def solveNQueens(n):
    board = [-1] * n
    solve(board, 0, n)

def solve(board, row, n):
    if row == n:
        return True
    for col in range(n):
        if isSafe(board, row, col):
            board[row] = col
            if solve(board, row+1, n):
                return True
            board[row] = -1
    return False`,
    javascript: `function solveNQueens(n) {
  const board = new Array(n).fill(-1);
  solve(board, 0, n);
}
function solve(board, row, n) {
  if (row === n) return true;
  for (let col = 0; col < n; col++) {
    if (isSafe(board, row, col)) {
      board[row] = col;
      if (solve(board, row+1, n)) return true;
      board[row] = -1;
    }
  }
  return false;
}`,
    java: `void solveNQueens(int n) {
    int[] board = new int[n];
    Arrays.fill(board, -1);
    solve(board, 0, n);
}
boolean solve(int[] board, int row, int n) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col;
            if (solve(board, row+1, n)) return true;
            board[row] = -1;
        }
    }
    return false;
}`,
  },
  defaultInput: { n: 4 },
  inputFields: [
    {
      name: 'n',
      label: 'Board Size (N)',
      type: 'number',
      defaultValue: 4,
      placeholder: 'e.g. 4',
      helperText: 'Size of the chessboard (4 to 8 recommended)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const board: number[] = new Array(n).fill(-1);

    function isSafe(b: number[], row: number, col: number): boolean {
      for (let r = 0; r < row; r++) {
        if (b[r] === col) return false;
        if (Math.abs(b[r] - col) === Math.abs(r - row)) return false;
      }
      return true;
    }

    function boardDescription(b: number[]): { key: string; value: string }[] {
      const entries: { key: string; value: string }[] = [];
      for (let r = 0; r < n; r++) {
        if (b[r] !== -1) {
          const rowStr = Array.from({ length: n }, (_, c) =>
            c === b[r] ? 'Q' : '.'
          ).join(' ');
          entries.push({ key: `Row ${r}`, value: rowStr });
        } else {
          entries.push({ key: `Row ${r}`, value: '. '.repeat(n).trim() });
        }
      }
      return entries;
    }

    function makeViz(
      activeRow: number | null,
      conflictRow: number | null,
      checkingCol: number | null,
    ): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let r = 0; r < n; r++) {
        labels[r] = `Row ${r}`;
        if (board[r] !== -1) {
          highlights[r] = 'found'; // successfully placed queen
        }
      }

      if (conflictRow !== null) {
        highlights[conflictRow] = 'mismatch';
      }

      if (activeRow !== null) {
        highlights[activeRow] = 'active';
        if (checkingCol !== null) {
          highlights[activeRow] = 'comparing';
        }
      }

      return {
        type: 'array',
        array: board.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Board State',
          entries: boardDescription(board),
        },
      };
    }

    // Initial step
    steps.push({
      line: 2,
      explanation: `Initialize a ${n}x${n} board. board[row] = column of queen in that row. All set to -1 (no queen placed).`,
      variables: { n, board: board.slice() },
      visualization: makeViz(null, null, null),
    });

    let solved = false;

    function solve(row: number): boolean {
      if (solved) return true;

      // Base case
      if (row === n) {
        steps.push({
          line: 6,
          explanation: `All ${n} queens placed successfully! We found a valid solution.`,
          variables: { row, board: board.slice() },
          visualization: makeViz(null, null, null),
        });
        solved = true;
        return true;
      }

      steps.push({
        line: 5,
        explanation: `Trying to place queen in row ${row}. Testing each column from 0 to ${n - 1}.`,
        variables: { row, board: board.slice() },
        visualization: makeViz(row, null, null),
      });

      for (let col = 0; col < n; col++) {
        if (solved) return true;

        // Step: Try this column
        steps.push({
          line: 8,
          explanation: `Row ${row}: try column ${col}. Checking if position (${row}, ${col}) is safe.`,
          variables: { row, col, board: board.slice() },
          visualization: makeViz(row, null, col),
        });

        const safe = isSafe(board, row, col);

        if (!safe) {
          // Find which row causes conflict for the explanation
          let conflictRow: number | null = null;
          for (let r = 0; r < row; r++) {
            if (board[r] === col || Math.abs(board[r] - col) === Math.abs(r - row)) {
              conflictRow = r;
              break;
            }
          }

          const conflictType =
            conflictRow !== null && board[conflictRow] === col
              ? 'same column'
              : 'same diagonal';

          steps.push({
            line: 8,
            explanation: `Position (${row}, ${col}) is NOT safe: conflicts with queen at row ${conflictRow} (${conflictType}). Skip.`,
            variables: { row, col, conflict: conflictRow, board: board.slice() },
            visualization: makeViz(row, conflictRow, col),
          });
        } else {
          // Place queen
          board[row] = col;
          steps.push({
            line: 9,
            explanation: `Position (${row}, ${col}) is safe! Place queen here. board[${row}] = ${col}.`,
            variables: { row, col, board: board.slice() },
            visualization: makeViz(row, null, null),
          });

          // Recurse
          steps.push({
            line: 10,
            explanation: `Queen placed at row ${row}, column ${col}. Recurse to row ${row + 1}.`,
            variables: { row, nextRow: row + 1, board: board.slice() },
            visualization: makeViz(row, null, null),
          });

          if (solve(row + 1)) {
            return true;
          }

          // Backtrack
          board[row] = -1;
          steps.push({
            line: 11,
            explanation: `Backtrack: remove queen from row ${row}, column ${col}. Try next column.`,
            variables: { row, col, board: board.slice() },
            visualization: makeViz(row, null, null),
          });
        }
      }

      if (!solved) {
        steps.push({
          line: 12,
          explanation: `No valid column found for row ${row}. Backtrack to previous row.`,
          variables: { row, board: board.slice() },
          visualization: makeViz(row, null, null),
        });
      }

      return false;
    }

    solve(0);

    // Final step
    if (solved) {
      steps.push({
        line: 6,
        explanation: `Solution found! Queens are placed at columns [${board.join(', ')}] for rows [0..${n - 1}].`,
        variables: { board: board.slice(), solved: true },
        visualization: {
          type: 'array',
          array: board.slice(),
          highlights: Object.fromEntries(
            board.map((_, i) => [i, 'found'])
          ),
          labels: Object.fromEntries(
            board.map((col, i) => [i, `Row ${i}`])
          ),
          auxData: {
            label: 'Final Board',
            entries: boardDescription(board),
          },
        },
      });
    }

    return steps;
  },
};

export default nQueens;
