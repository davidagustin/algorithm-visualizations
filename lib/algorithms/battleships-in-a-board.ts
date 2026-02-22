import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const battleshipsInABoard: AlgorithmDefinition = {
  id: 'battleships-in-a-board',
  title: 'Battleships in a Board',
  leetcodeNumber: 419,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    "Count the number of battleships in an m x n board. Battleships are represented by 'X' cells arranged horizontally or vertically. Count only the top-left cell of each battleship: a cell is a top-left if it is 'X' and has no 'X' above or to the left.",
  tags: ['Matrix', 'Counting'],
  code: {
    pseudocode: `function countBattleships(board):
  count = 0
  for each cell (i,j):
    if board[i][j] == 'X':
      if i>0 and board[i-1][j]=='X': continue
      if j>0 and board[i][j-1]=='X': continue
      count += 1
  return count`,
    python: `def countBattleships(board):
    count = 0
    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 'X':
                if i > 0 and board[i-1][j] == 'X': continue
                if j > 0 and board[i][j-1] == 'X': continue
                count += 1
    return count`,
    javascript: `function countBattleships(board) {
  let count = 0;
  for (let i = 0; i < board.length; i++)
    for (let j = 0; j < board[0].length; j++)
      if (board[i][j]==='X') {
        if (i>0 && board[i-1][j]==='X') continue;
        if (j>0 && board[i][j-1]==='X') continue;
        count++;
      }
  return count;
}`,
    java: `public int countBattleships(char[][] board) {
    int count = 0;
    for (int i=0;i<board.length;i++)
        for (int j=0;j<board[0].length;j++)
            if (board[i][j]=='X') {
                if (i>0 && board[i-1][j]=='X') continue;
                if (j>0 && board[i][j-1]=='X') continue;
                count++;
            }
    return count;
}`,
  },
  defaultInput: { matrix: [[1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 0]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Board (1=X ship, 0=water)',
      type: 'string',
      defaultValue: '1 0 0 1, 1 0 0 1, 1 0 0 0',
      placeholder: 'e.g. 1 0 0 1, 1 0 0 1, 1 0 0 0',
      helperText: 'Rows by commas. 1=X (ship), 0=. (water)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = matrix.length, n = matrix[0].length;
    const steps: AlgorithmStep[] = [];
    let count = 0;

    function makeViz(curr: number, isTopLeft: boolean, note: string): ArrayVisualization {
      const flat = matrix.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        labels[i] = flat[i] === 1 ? 'X' : '.';
        highlights[i] = flat[i] === 1 ? 'visited' : 'default';
      }
      if (curr >= 0) highlights[curr] = isTopLeft ? 'found' : 'comparing';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Battleships', entries: [{ key: 'Ships', value: `${count}` }, { key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count battleships in ${m}x${n} board. Count only the top-left 'X' of each ship.`,
      variables: { m, n },
      visualization: makeViz(-1, false, 'Initial'),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        if (matrix[i][j] === 1) {
          const hasAbove = i > 0 && matrix[i - 1][j] === 1;
          const hasLeft = j > 0 && matrix[i][j - 1] === 1;
          if (hasAbove || hasLeft) {
            steps.push({
              line: 5,
              explanation: `(${i},${j}) is X but ${hasAbove ? 'has X above' : 'has X to the left'}. Skip — not the top-left of a ship.`,
              variables: { i, j, hasAbove, hasLeft },
              visualization: makeViz(idx, false, `Skip (${i},${j})`),
            });
          } else {
            count++;
            steps.push({
              line: 7,
              explanation: `(${i},${j}) is top-left X. No X above or left. Count ship #${count}.`,
              variables: { i, j, count },
              visualization: makeViz(idx, true, `Ship #${count}`),
            });
          }
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Total battleships = ${count}.`,
      variables: { count },
      visualization: makeViz(-1, false, `Done: ${count} ships`),
    });

    return steps;
  },
};

export default battleshipsInABoard;
