import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const surroundedRegionsII: AlgorithmDefinition = {
  id: 'surrounded-regions-ii',
  title: 'Surrounded Regions II',
  leetcodeNumber: 130,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a matrix of \'X\' and \'O\', capture all regions of \'O\' that are surrounded by \'X\'. A region is surrounded if none of its cells touch the border. DFS/BFS from border \'O\' cells to mark safe ones, then flip the rest.',
  tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function solve(board):
  mark all 'O' cells reachable from border as 'S' (safe)
  for each cell in board:
    if 'O': flip to 'X' (surrounded)
    if 'S': restore to 'O'`,
    python: `def solve(board):
    if not board: return
    m, n = len(board), len(board[0])
    def dfs(r, c):
        if r<0 or r>=m or c<0 or c>=n or board[r][c]!='O': return
        board[r][c]='S'
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    for r in range(m):
        dfs(r,0); dfs(r,n-1)
    for c in range(n):
        dfs(0,c); dfs(m-1,c)
    for r in range(m):
        for c in range(n):
            if board[r][c]=='O': board[r][c]='X'
            elif board[r][c]=='S': board[r][c]='O'`,
    javascript: `function solve(board) {
  const m = board.length, n = board[0].length;
  function dfs(r, c) {
    if (r<0||r>=m||c<0||c>=n||board[r][c]!=='O') return;
    board[r][c] = 'S';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let r=0;r<m;r++){dfs(r,0);dfs(r,n-1);}
  for (let c=0;c<n;c++){dfs(0,c);dfs(m-1,c);}
  for (let r=0;r<m;r++) for (let c=0;c<n;c++) {
    if (board[r][c]==='O') board[r][c]='X';
    else if (board[r][c]==='S') board[r][c]='O';
  }
}`,
    java: `public void solve(char[][] board) {
    int m=board.length,n=board[0].length;
    for (int r=0;r<m;r++){dfs(board,r,0,m,n);dfs(board,r,n-1,m,n);}
    for (int c=0;c<n;c++){dfs(board,0,c,m,n);dfs(board,m-1,c,m,n);}
    for (int r=0;r<m;r++) for (int c=0;c<n;c++) {
        if (board[r][c]=='O') board[r][c]='X';
        else if (board[r][c]=='S') board[r][c]='O';
    }
}
void dfs(char[][] b,int r,int c,int m,int n) {
    if(r<0||r>=m||c<0||c>=n||b[r][c]!='O') return;
    b[r][c]='S';
    dfs(b,r+1,c,m,n);dfs(b,r-1,c,m,n);dfs(b,r,c+1,m,n);dfs(b,r,c-1,m,n);
}`,
  },
  defaultInput: {
    board: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']],
  },
  inputFields: [
    {
      name: 'board',
      label: 'Board (X and O)',
      type: 'array',
      defaultValue: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']],
      placeholder: '[["X","X"],["X","O"]]',
      helperText: 'Grid of X and O characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoard = input.board as string[][];
    const m = rawBoard.length;
    const n = rawBoard[0].length;
    const steps: AlgorithmStep[] = [];

    const board = rawBoard.map(row => [...row]);

    // Encode: X=0, O=1, S=2
    function flatNums(): number[] {
      return board.flat().map(c => c === 'X' ? 0 : c === 'O' ? 1 : 2);
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: flatNums(),
        highlights,
        labels: Object.fromEntries(flatNums().map((v, i) => [i, `(${Math.floor(i/n)},${i%n}):${v===0?'X':v===1?'O':'S'}`])),
        auxData: {
          label: 'Surrounded Regions',
          entries: [
            { key: 'Legend', value: '0=X, 1=O, 2=S(safe)' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    function dfs(r: number, c: number) {
      if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'O') return;
      board[r][c] = 'S';
      dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    }

    steps.push({
      line: 1,
      explanation: `${m}x${n} board. Phase 1: DFS from all border 'O' cells to mark safe 'O's as 'S'. Then flip remaining 'O' to 'X'.`,
      variables: { m, n },
      visualization: makeViz(Object.fromEntries(flatNums().map((_, i) => [i, 'default'])), 'Initial board'),
    });

    // DFS from borders
    for (let r = 0; r < m; r++) { dfs(r, 0); dfs(r, n-1); }
    for (let c = 0; c < n; c++) { dfs(0, c); dfs(m-1, c); }

    const afterDFS = flatNums();
    const h1: Record<number, string> = {};
    for (let i = 0; i < afterDFS.length; i++) {
      h1[i] = afterDFS[i] === 2 ? 'found' : afterDFS[i] === 1 ? 'mismatch' : 'default';
    }
    steps.push({
      line: 5,
      explanation: `DFS from borders complete. 'S' cells (${afterDFS.filter(v => v === 2).length}) are safe. Remaining 'O' cells (${afterDFS.filter(v => v === 1).length}) are surrounded.`,
      variables: { safe: afterDFS.filter(v => v === 2).length, surrounded: afterDFS.filter(v => v === 1).length },
      visualization: makeViz(h1, 'Safe cells marked'),
    });

    // Flip
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] === 'O') board[r][c] = 'X';
        else if (board[r][c] === 'S') board[r][c] = 'O';
      }
    }

    const finalNums = flatNums();
    const h2: Record<number, string> = {};
    for (let i = 0; i < finalNums.length; i++) h2[i] = finalNums[i] === 1 ? 'found' : 'sorted';
    steps.push({
      line: 8,
      explanation: `Phase 2 complete: captured all surrounded 'O' regions. Remaining 'O' cells are border-connected.`,
      variables: { captured: finalNums.filter(v => v === 0).length, remaining: finalNums.filter(v => v === 1).length },
      visualization: makeViz(h2, 'Regions captured'),
    });

    return steps;
  },
};

export default surroundedRegionsII;
