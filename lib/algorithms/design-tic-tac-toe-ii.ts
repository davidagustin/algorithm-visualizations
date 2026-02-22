import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designTicTacToeIi: AlgorithmDefinition = {
  id: 'design-tic-tac-toe-ii',
  title: 'Design Tic-Tac-Toe',
  leetcodeNumber: 348,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a Tic-Tac-Toe game. Players alternate placing pieces on an n x n board. A player wins when they fill an entire row, column, or diagonal. Use row/column/diagonal counters for O(1) win check.',
  tags: ['Hash Map', 'Design', 'Array', 'Matrix'],
  code: {
    pseudocode: `class TicTacToe:
  function init(n):
    rows = [0]*n, cols = [0]*n for each player (1,2)
    diagonal = [0,0], anti_diagonal = [0,0]
  function move(row, col, player):
    mark = 1 if player==1 else -1
    rows[row] += mark; cols[col] += mark
    if row==col: diagonal += mark
    if row+col==n-1: anti_diagonal += mark
    if abs(rows[row])==n or abs(cols[col])==n
       or abs(diagonal)==n or abs(anti_diagonal)==n:
      return player
    return 0`,
    python: `class TicTacToe:
    def __init__(self, n: int):
        self.n = n
        self.rows = [0] * n
        self.cols = [0] * n
        self.diag = 0
        self.anti = 0

    def move(self, row: int, col: int, player: int) -> int:
        mark = 1 if player == 1 else -1
        self.rows[row] += mark
        self.cols[col] += mark
        if row == col: self.diag += mark
        if row + col == self.n - 1: self.anti += mark
        if (abs(self.rows[row]) == self.n or
            abs(self.cols[col]) == self.n or
            abs(self.diag) == self.n or
            abs(self.anti) == self.n):
            return player
        return 0`,
    javascript: `class TicTacToe {
  constructor(n) {
    this.n = n;
    this.rows = new Array(n).fill(0);
    this.cols = new Array(n).fill(0);
    this.diag = 0; this.anti = 0;
  }
  move(row, col, player) {
    const mark = player === 1 ? 1 : -1;
    this.rows[row] += mark; this.cols[col] += mark;
    if (row === col) this.diag += mark;
    if (row + col === this.n - 1) this.anti += mark;
    if ([this.rows[row], this.cols[col], this.diag, this.anti]
        .some(v => Math.abs(v) === this.n)) return player;
    return 0;
  }
}`,
    java: `class TicTacToe {
    private int[] rows, cols;
    private int diag, anti, n;
    public TicTacToe(int n) {
        this.n = n; rows = new int[n]; cols = new int[n];
    }
    public int move(int row, int col, int player) {
        int mark = player == 1 ? 1 : -1;
        rows[row] += mark; cols[col] += mark;
        if (row == col) diag += mark;
        if (row + col == n - 1) anti += mark;
        if (Math.abs(rows[row]) == n || Math.abs(cols[col]) == n
            || Math.abs(diag) == n || Math.abs(anti) == n) return player;
        return 0;
    }
}`,
  },
  defaultInput: {
    n: 3,
    operations: [['move', 0, 0, 1], ['move', 0, 2, 2], ['move', 1, 1, 1], ['move', 0, 1, 2], ['move', 2, 2, 1]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Board Size (n x n)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
    {
      name: 'operations',
      label: 'Moves',
      type: 'string',
      defaultValue: 'move 0 0 1, move 0 2 2, move 1 1 1, move 0 1 2, move 2 2 1',
      placeholder: 'move row col player',
      helperText: 'Comma-separated: "move row col player"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = (input.n as number) || 3;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return [parts[0], Number(parts[1]), Number(parts[2]), Number(parts[3])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const rows = new Array(n).fill(0);
    const cols = new Array(n).fill(0);
    let diag = 0, anti = 0;
    const board = Array.from({ length: n }, () => new Array(n).fill(0));

    function makeViz(lastRow: number, lastCol: number, label: string, winner: number): ArrayVisualization {
      const flat = board.flat();
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      flat.forEach((v, i) => {
        const r = Math.floor(i / n);
        const c = i % n;
        highlights[i] = r === lastRow && c === lastCol ? 'active' : v === 1 ? 'found' : v === 2 ? 'mismatch' : 'default';
        lbls[i] = v === 1 ? 'X' : v === 2 ? 'O' : '.';
      });
      return {
        type: 'array',
        array: flat,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Tic-Tac-Toe Board',
          entries: [
            { key: 'Action', value: label },
            { key: 'Winner', value: winner === 0 ? 'None' : `Player ${winner}` },
            { key: 'Diagonal', value: `${diag}` },
            { key: 'Anti-diag', value: `${anti}` },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize ${n}x${n} Tic-Tac-Toe board.`, variables: { n }, visualization: makeViz(-1, -1, 'Init', 0) });

    for (const op of operations) {
      const row = Number(op[1]);
      const col = Number(op[2]);
      const player = Number(op[3]);
      const mark = player === 1 ? 1 : -1;

      board[row][col] = player;
      rows[row] += mark;
      cols[col] += mark;
      if (row === col) diag += mark;
      if (row + col === n - 1) anti += mark;

      const winner = (Math.abs(rows[row]) === n || Math.abs(cols[col]) === n || Math.abs(diag) === n || Math.abs(anti) === n) ? player : 0;

      steps.push({
        line: 9,
        explanation: winner !== 0
          ? `move(${row}, ${col}, ${player}): Player ${player} wins!`
          : `move(${row}, ${col}, ${player}): Player ${player} places at (${row},${col}). No winner yet.`,
        variables: { row, col, player, rows: [...rows], cols: [...cols], diag, anti, winner },
        visualization: makeViz(row, col, `move(${row},${col},${player}) -> ${winner}`, winner),
      });

      if (winner !== 0) break;
    }

    steps.push({ line: 16, explanation: 'Game complete.', variables: { rows: [...rows], cols: [...cols] }, visualization: makeViz(-1, -1, 'Complete', 0) });

    return steps;
  },
};

export default designTicTacToeIi;
