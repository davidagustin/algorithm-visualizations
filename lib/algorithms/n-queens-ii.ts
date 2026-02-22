import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nQueensIi: AlgorithmDefinition = {
  id: 'n-queens-ii',
  title: 'N-Queens II',
  leetcodeNumber: 52,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Count the number of distinct solutions to the N-Queens puzzle. Given an integer n, return the number of distinct solutions to the n-queens puzzle where n queens are placed on an n x n chessboard such that no two queens attack each other.',
  tags: ['backtracking', 'recursion', 'bit manipulation'],

  code: {
    pseudocode: `function totalNQueens(n):
  count = 0
  function backtrack(row, cols, diag1, diag2):
    if row == n:
      count += 1
      return
    for col in 0..n-1:
      if col not in cols and (row-col) not in diag1 and (row+col) not in diag2:
        backtrack(row+1, cols+col, diag1+(row-col), diag2+(row+col))
  backtrack(0, {}, {}, {})
  return count`,
    python: `def totalNQueens(n: int) -> int:
    count = 0
    def backtrack(row, cols, diag1, diag2):
        nonlocal count
        if row == n:
            count += 1
            return
        for col in range(n):
            if col not in cols and (row - col) not in diag1 and (row + col) not in diag2:
                backtrack(row + 1, cols | {col}, diag1 | {row - col}, diag2 | {row + col})
    backtrack(0, set(), set(), set())
    return count`,
    javascript: `function totalNQueens(n) {
  let count = 0;
  function backtrack(row, cols, diag1, diag2) {
    if (row === n) { count++; return; }
    for (let col = 0; col < n; col++) {
      if (!cols.has(col) && !diag1.has(row - col) && !diag2.has(row + col)) {
        cols.add(col); diag1.add(row - col); diag2.add(row + col);
        backtrack(row + 1, cols, diag1, diag2);
        cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
      }
    }
  }
  backtrack(0, new Set(), new Set(), new Set());
  return count;
}`,
    java: `public int totalNQueens(int n) {
    int[] count = {0};
    backtrack(n, 0, new HashSet<>(), new HashSet<>(), new HashSet<>(), count);
    return count[0];
}
private void backtrack(int n, int row, Set<Integer> cols, Set<Integer> d1, Set<Integer> d2, int[] count) {
    if (row == n) { count[0]++; return; }
    for (int col = 0; col < n; col++) {
        if (!cols.contains(col) && !d1.contains(row - col) && !d2.contains(row + col)) {
            cols.add(col); d1.add(row - col); d2.add(row + col);
            backtrack(n, row + 1, cols, d1, d2, count);
            cols.remove(col); d1.remove(row - col); d2.remove(row + col);
        }
    }
}`,
  },

  defaultInput: { n: 4 },

  inputFields: [
    {
      name: 'n',
      label: 'Board Size (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Size of the n x n chessboard',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const board: number[] = new Array(n).fill(-1);
    let solutionCount = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...board],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start N-Queens II for n=${n}. Board represented as array where board[row] = queen column. Goal: count all valid placements.`,
      variables: { n, count: 0 },
      visualization: makeViz({}, {}),
    });

    const cols = new Set<number>();
    const diag1 = new Set<number>();
    const diag2 = new Set<number>();

    function backtrack(row: number) {
      if (row === n) {
        solutionCount++;
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let r = 0; r < n; r++) { h[r] = 'found'; l[r] = `Q(${board[r]})`; }
        steps.push({
          line: 4,
          explanation: `Solution #${solutionCount} found! All ${n} queens placed without conflicts.`,
          variables: { count: solutionCount, placement: [...board] },
          visualization: makeViz(h, l),
        });
        return;
      }

      for (let col = 0; col < n; col++) {
        if (!cols.has(col) && !diag1.has(row - col) && !diag2.has(row + col)) {
          board[row] = col;
          cols.add(col); diag1.add(row - col); diag2.add(row + col);

          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          for (let r = 0; r <= row; r++) { h[r] = r === row ? 'active' : 'visited'; l[r] = `Q(${board[r]})`; }

          steps.push({
            line: 6,
            explanation: `Place queen at row ${row}, col ${col}. No conflicts with existing queens.`,
            variables: { row, col, count: solutionCount },
            visualization: makeViz(h, l),
          });

          backtrack(row + 1);

          board[row] = -1;
          cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
        } else if (steps.length < 40) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          for (let r = 0; r < row; r++) { h[r] = 'visited'; l[r] = `Q(${board[r]})`; }
          h[row] = 'mismatch';
          steps.push({
            line: 6,
            explanation: `Skip col ${col} at row ${row}: conflicts detected (column, diagonal, or anti-diagonal).`,
            variables: { row, col, conflict: true },
            visualization: makeViz(h, l),
          });
        }
      }
    }

    backtrack(0);

    steps.push({
      line: 10,
      explanation: `Backtracking complete. Total distinct N-Queens solutions for n=${n}: ${solutionCount}.`,
      variables: { n, totalSolutions: solutionCount },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default nQueensIi;
