import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const knightTour: AlgorithmDefinition = {
  id: 'knight-tour',
  title: 'Knight Tour Problem',
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'The Knight Tour problem finds a sequence of moves for a chess knight such that it visits every square on an N x N chessboard exactly once. Uses backtracking with the Warnsdorff heuristic (always move to the square with the fewest onward moves) to make the search efficient.',
  tags: ['backtracking', 'chess', 'graph', 'heuristic', 'warnsdorff'],

  code: {
    pseudocode: `function knightTour(n):
  board = n x n grid of -1
  board[0][0] = 0
  moves = [(2,1),(2,-1),(-2,1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2)]
  if backtrack(board, 0, 0, 1, n, moves): return board
  return "No solution"

function backtrack(board, r, c, moveNum, n, moves):
  if moveNum == n*n: return true
  nextMoves = sort possible moves by Warnsdorff count
  for each (nr, nc) in nextMoves:
    board[nr][nc] = moveNum
    if backtrack(board, nr, nc, moveNum+1, n, moves): return true
    board[nr][nc] = -1
  return false`,

    python: `def knightTour(n):
    board = [[-1] * n for _ in range(n)]
    moves = [(2,1),(2,-1),(-2,1),(-2,-1),(1,2),(1,-2),(-1,2),(-1,-2)]
    board[0][0] = 0
    def count_onward(r, c):
        count = 0
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and board[nr][nc] == -1:
                count += 1
        return count
    def backtrack(r, c, move_num):
        if move_num == n * n:
            return True
        next_moves = sorted(
            [(r+dr, c+dc) for dr, dc in moves if 0 <= r+dr < n and 0 <= c+dc < n and board[r+dr][c+dc] == -1],
            key=lambda pos: count_onward(*pos)
        )
        for nr, nc in next_moves:
            board[nr][nc] = move_num
            if backtrack(nr, nc, move_num + 1):
                return True
            board[nr][nc] = -1
        return False
    backtrack(0, 0, 1)
    return board`,

    javascript: `function knightTour(n) {
  const board = Array.from({length: n}, () => new Array(n).fill(-1));
  const moves = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  board[0][0] = 0;
  function countOnward(r, c) {
    return moves.filter(([dr,dc]) => {
      const nr = r+dr, nc = c+dc;
      return nr>=0&&nr<n&&nc>=0&&nc<n&&board[nr][nc]===-1;
    }).length;
  }
  function backtrack(r, c, moveNum) {
    if (moveNum === n*n) return true;
    const next = moves
      .map(([dr,dc]) => [r+dr, c+dc])
      .filter(([nr,nc]) => nr>=0&&nr<n&&nc>=0&&nc<n&&board[nr][nc]===-1)
      .sort((a,b) => countOnward(...a) - countOnward(...b));
    for (const [nr,nc] of next) {
      board[nr][nc] = moveNum;
      if (backtrack(nr, nc, moveNum+1)) return true;
      board[nr][nc] = -1;
    }
    return false;
  }
  backtrack(0, 0, 1);
  return board;
}`,

    java: `public int[][] knightTour(int n) {
    int[][] board = new int[n][n];
    for (int[] row : board) Arrays.fill(row, -1);
    int[][] moves = {{2,1},{2,-1},{-2,1},{-2,-1},{1,2},{1,-2},{-1,2},{-1,-2}};
    board[0][0] = 0;
    backtrack(board, 0, 0, 1, n, moves);
    return board;
}`,
  },

  defaultInput: {
    n: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Board Size (N)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Size of the N x N chessboard',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 6);
    const steps: AlgorithmStep[] = [];
    const board = Array.from({ length: n }, () => new Array(n).fill(-1));
    const knightMoves: [number, number][] = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
    board[0][0] = 0;

    steps.push({
      line: 1,
      explanation: `Knight Tour on ${n}x${n} board. Knight starts at (0,0). Must visit all ${n*n} squares exactly once using L-shaped moves.`,
      variables: { boardSize: n, totalSquares: n * n, startPos: '(0,0)' },
      visualization: {
        type: 'array',
        array: board.flat(),
        highlights: { 0: 'active' },
        labels: { 0: 'K(0)' },
      },
    });

    function countOnward(r: number, c: number): number {
      return knightMoves.filter(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        return nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === -1;
      }).length;
    }

    function backtrack(r: number, c: number, moveNum: number): boolean {
      if (moveNum === n * n) {
        steps.push({
          line: 7,
          explanation: `Knight Tour COMPLETE! All ${n*n} squares visited. Move sequence recorded on board.`,
          variables: { totalMoves: moveNum, complete: true },
          visualization: {
            type: 'array',
            array: board.flat(),
            highlights: board.flat().reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: board.flat().reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
          },
        });
        return true;
      }

      const nextMoves = knightMoves
        .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
        .filter(([nr, nc]) => nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === -1)
        .sort((a, b) => countOnward(a[0], a[1]) - countOnward(b[0], b[1]));

      for (const [nr, nc] of nextMoves) {
        board[nr][nc] = moveNum;

        steps.push({
          line: 12,
          explanation: `Move #${moveNum}: Knight from (${r},${c}) to (${nr},${nc}). Warnsdorff: chose square with fewest onward moves (${countOnward(nr, nc)}).`,
          variables: { from: `(${r},${c})`, to: `(${nr},${nc})`, moveNumber: moveNum, onwardMoves: countOnward(nr, nc) },
          visualization: {
            type: 'array',
            array: board.flat(),
            highlights: {
              [r * n + c]: 'sorted',
              [nr * n + nc]: 'active',
            },
            labels: board.flat().reduce((acc, v, i) => ({
              ...acc,
              [i]: v >= 0 ? `${v}` : '',
            }), {} as Record<number, string>),
          },
        });

        if (backtrack(nr, nc, moveNum + 1)) return true;

        board[nr][nc] = -1;

        steps.push({
          line: 14,
          explanation: `Backtrack: (${nr},${nc}) leads to dead end. Unmark and try next option from (${r},${c}).`,
          variables: { unmark: `(${nr},${nc})`, backTo: `(${r},${c})` },
          visualization: {
            type: 'array',
            array: board.flat(),
            highlights: { [nr * n + nc]: 'mismatch', [r * n + c]: 'comparing' },
            labels: board.flat().reduce((acc, v, i) => ({
              ...acc,
              [i]: v >= 0 ? `${v}` : '',
            }), {} as Record<number, string>),
          },
        });
      }

      return false;
    }

    const success = backtrack(0, 0, 1);

    if (!success) {
      steps.push({
        line: 6,
        explanation: `No complete Knight Tour found starting from (0,0) on a ${n}x${n} board.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: board.flat(),
          highlights: board.flat().reduce((acc, v, i) => ({ ...acc, [i]: v >= 0 ? 'sorted' : 'mismatch' }), {}),
          labels: board.flat().reduce((acc, v, i) => ({ ...acc, [i]: v >= 0 ? `${v}` : 'X' }), {} as Record<number, string>),
        },
      });
    }

    return steps;
  },
};

export default knightTour;
