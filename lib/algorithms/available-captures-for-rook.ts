import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const availableCapturesForRook: AlgorithmDefinition = {
  id: 'available-captures-for-rook',
  title: 'Available Captures for Rook',
  leetcodeNumber: 999,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'On an 8x8 chessboard with one white rook (R), some white bishops (B), and some black pawns (p), find how many pawns the rook can capture in one move. The rook moves in straight lines (up/down/left/right) and is blocked by bishops. Count pawns reachable before any bishop in each of the 4 directions.',
  tags: ['array', 'matrix', 'simulation', 'chess'],

  code: {
    pseudocode: `function numRookCaptures(board):
  find rook position (r, c)
  count = 0
  for each direction (dr, dc) in 4 directions:
    x, y = r+dr, c+dc
    while in bounds:
      if board[x][y] == "B": break (blocked)
      if board[x][y] == "p": count++; break
      x+=dr; y+=dc
  return count`,
    python: `def numRookCaptures(board):
    for r in range(8):
        for c in range(8):
            if board[r][c] == 'R':
                rr, rc = r, c
    count = 0
    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
        x, y = rr+dr, rc+dc
        while 0<=x<8 and 0<=y<8:
            if board[x][y] == 'B': break
            if board[x][y] == 'p': count += 1; break
            x+=dr; y+=dc
    return count`,
    javascript: `function numRookCaptures(board) {
  let rr, rc;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === 'R') { rr=r; rc=c; }
  let count = 0;
  for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    let x=rr+dr, y=rc+dc;
    while(x>=0&&x<8&&y>=0&&y<8) {
      if(board[x][y]==='B') break;
      if(board[x][y]==='p') { count++; break; }
      x+=dr; y+=dc;
    }
  }
  return count;
}`,
    java: `public int numRookCaptures(char[][] board) {
    int rr=0, rc=0;
    for(int r=0;r<8;r++) for(int c=0;c<8;c++) if(board[r][c]=='R'){rr=r;rc=c;}
    int count=0;
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    for(int[] d:dirs){
        int x=rr+d[0],y=rc+d[1];
        while(x>=0&&x<8&&y>=0&&y<8){
            if(board[x][y]=='B') break;
            if(board[x][y]=='p'){count++;break;}
            x+=d[0];y+=d[1];
        }
    }
    return count;
}`,
  },

  defaultInput: {
    board: [
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'p', '.', '.', '.', '.'],
      ['.', '.', '.', 'R', '.', '.', '.', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'p', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
    ],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board (use default)',
      type: 'array',
      defaultValue: [0],
      placeholder: '0',
      helperText: 'Uses the default board configuration',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = [
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'p', '.', '.', '.', '.'],
      ['.', '.', '.', 'R', '.', '.', '.', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', 'p', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
    ];
    const steps: AlgorithmStep[] = [];

    // Encode board as numbers for visualization: 0=empty, 1=rook, 2=bishop, 3=pawn
    const encode = (ch: string): number => ch === 'R' ? 1 : ch === 'B' ? 2 : ch === 'p' ? 3 : 0;
    const flat = (): number[] => board.flat().map(encode);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flat(),
      highlights,
      labels,
    });

    let rr = 0, rc = 0;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (board[r][c] === 'R') { rr = r; rc = c; }

    steps.push({
      line: 1,
      explanation: `Found rook at row ${rr}, col ${rc}. Search 4 directions for capturable pawns.`,
      variables: { rookRow: rr, rookCol: rc },
      visualization: makeViz({ [rr * 8 + rc]: 'found' }, { [rr * 8 + rc]: 'R' }),
    });

    let count = 0;
    const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const dirNames = ['up', 'down', 'left', 'right'];

    for (let d = 0; d < directions.length; d++) {
      const [dr, dc] = directions[d];
      let x = rr + dr, y = rc + dc;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const idx = x * 8 + y;
        if (board[x][y] === 'B') {
          steps.push({
            line: 6,
            explanation: `Direction ${dirNames[d]}: bishop at (${x},${y}) blocks the rook. Stop.`,
            variables: { direction: dirNames[d], x, y, blocked: true },
            visualization: makeViz({ [rr * 8 + rc]: 'found', [idx]: 'comparing' }, { [rr * 8 + rc]: 'R', [idx]: 'B' }),
          });
          break;
        }
        if (board[x][y] === 'p') {
          count++;
          steps.push({
            line: 7,
            explanation: `Direction ${dirNames[d]}: pawn at (${x},${y}) captured! count=${count}.`,
            variables: { direction: dirNames[d], x, y, captured: true, count },
            visualization: makeViz({ [rr * 8 + rc]: 'found', [idx]: 'active' }, { [rr * 8 + rc]: 'R', [idx]: 'p' }),
          });
          break;
        }
        steps.push({
          line: 8,
          explanation: `Direction ${dirNames[d]}: (${x},${y}) is empty, continue.`,
          variables: { direction: dirNames[d], x, y },
          visualization: makeViz({ [rr * 8 + rc]: 'found', [idx]: 'pointer' }, { [rr * 8 + rc]: 'R' }),
        });
        x += dr; y += dc;
      }
    }

    steps.push({
      line: 9,
      explanation: `Rook can capture ${count} pawn(s).`,
      variables: { result: count },
      visualization: makeViz({ [rr * 8 + rc]: 'found' }, { [rr * 8 + rc]: 'R' }),
    });

    return steps;
  },
};

export default availableCapturesForRook;
