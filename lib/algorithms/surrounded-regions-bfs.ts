import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const surroundedRegionsBfs: AlgorithmDefinition = {
  id: 'surrounded-regions-bfs',
  title: 'Surrounded Regions (BFS)',
  leetcodeNumber: 130,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an m x n board of X and O cells, capture all regions surrounded by X. A region is captured by flipping all O cells that are not connected to the border. BFS from all border O cells to mark safe cells, then flip remaining O cells to X.',
  tags: ['bfs', 'graph', 'grid', 'connected components'],

  code: {
    pseudocode: `function solve(board):
  m, n = dimensions
  queue = []
  // Start BFS from all border O cells
  for each border cell (r, c):
    if board[r][c] == 'O':
      queue.add((r, c))
      board[r][c] = 'S'  // mark safe
  BFS from queue:
    for each (r, c) in frontier:
      mark neighbors that are O as 'S'
  // Finalize: S -> O (safe), O -> X (captured), X -> X
  for each cell:
    if 'S': restore to 'O'
    if 'O': flip to 'X'`,

    python: `from collections import deque

def solve(board):
    if not board: return
    m, n = len(board), len(board[0])
    queue = deque()
    for r in range(m):
        for c in range(n):
            if (r in (0, m-1) or c in (0, n-1)) and board[r][c] == 'O':
                queue.append((r, c))
                board[r][c] = 'S'
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0<=nr<m and 0<=nc<n and board[nr][nc]=='O':
                board[nr][nc]='S'
                queue.append((nr, nc))
    for r in range(m):
        for c in range(n):
            if board[r][c]=='S': board[r][c]='O'
            elif board[r][c]=='O': board[r][c]='X'`,

    javascript: `function solve(board) {
  if (!board.length) return;
  const m = board.length, n = board[0].length;
  const queue = [];
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
    if ((r===0||r===m-1||c===0||c===n-1) && board[r][c]==='O') {
      queue.push([r,c]); board[r][c]='S';
    }
  }
  const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
  let head=0;
  while(head<queue.length){
    const[r,c]=queue[head++];
    for(const[dr,dc]of dirs){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<m&&nc>=0&&nc<n&&board[nr][nc]==='O'){board[nr][nc]='S';queue.push([nr,nc]);}
    }
  }
  for(let r=0;r<m;r++) for(let c=0;c<n;c++) {
    if(board[r][c]==='S') board[r][c]='O';
    else if(board[r][c]==='O') board[r][c]='X';
  }
}`,

    java: `public void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    Queue<int[]> queue = new LinkedList<>();
    for (int r=0;r<m;r++) for (int c=0;c<n;c++) {
        if ((r==0||r==m-1||c==0||c==n-1) && board[r][c]=='O') {
            queue.offer(new int[]{r,c}); board[r][c]='S';
        }
    }
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!queue.isEmpty()){
        int[]cur=queue.poll(); int r=cur[0],c=cur[1];
        for(int[]d:dirs){int nr=r+d[0],nc=c+d[1];
            if(nr>=0&&nr<m&&nc>=0&&nc<n&&board[nr][nc]=='O'){board[nr][nc]='S';queue.offer(new int[]{nr,nc});}
        }
    }
    for(int r=0;r<m;r++) for(int c=0;c<n;c++){
        if(board[r][c]=='S') board[r][c]='O'; else if(board[r][c]=='O') board[r][c]='X';
    }
}`,
  },

  defaultInput: {
    board: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board',
      type: 'array',
      defaultValue: ['X','X','X','X','X','O','O','X','X','X','O','X','X','O','X','X'],
      placeholder: 'X,X,X,X,...',
      helperText: 'X or O cells in row-major order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const boardInput = input.board as string[][];
    const board = boardInput.map(row => [...row]);
    const steps: AlgorithmStep[] = [];
    const m = board.length;
    const n = board[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    const toFlat = () => board.flat().map(c => c === 'O' ? 1 : c === 'S' ? 2 : 0);

    steps.push({
      line: 1,
      explanation: `Board is ${m}x${n}. Phase 1: BFS from all border 'O' cells to find safe (border-connected) regions.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: toFlat(),
        highlights: Object.fromEntries(
          board.flat().map((v, i) => [i, v === 'O' ? 'active' : 'default'])
        ),
        labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
      } as ArrayVisualization,
    });

    const queue: [number, number][] = [];
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if ((r === 0 || r === m - 1 || c === 0 || c === n - 1) && board[r][c] === 'O') {
          queue.push([r, c]);
          board[r][c] = 'S';
        }
      }
    }

    steps.push({
      line: 6,
      explanation: `Marked ${queue.length} border 'O' cell(s) as 'S' (safe). Starting BFS to propagate safety.`,
      variables: { borderSafeCells: queue.length },
      visualization: {
        type: 'array',
        array: toFlat(),
        highlights: Object.fromEntries(
          board.flat().map((v, i) => [i, v === 'S' ? 'active' : 'default'])
        ),
        labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
      } as ArrayVisualization,
    });

    let head = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'O') {
          board[nr][nc] = 'S';
          queue.push([nr, nc]);
          steps.push({
            line: 9,
            explanation: `BFS: (${r},${c}) -> neighbor (${nr},${nc}) is 'O', mark as 'S' (safe - border connected).`,
            variables: { from: `(${r},${c})`, to: `(${nr},${nc})` },
            visualization: {
              type: 'array',
              array: toFlat(),
              highlights: { [r * n + c]: 'visited', [nr * n + nc]: 'active' },
              labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
            } as ArrayVisualization,
          });
        }
      }
      if (steps.length > 16) break;
    }

    steps.push({
      line: 11,
      explanation: `BFS complete. Phase 2: Flip 'S' back to 'O' (safe), and remaining 'O' to 'X' (captured).`,
      variables: {},
      visualization: {
        type: 'array',
        array: toFlat(),
        highlights: Object.fromEntries(board.flat().map((v, i) => [i, v === 'S' ? 'found' : v === 'O' ? 'mismatch' : 'default'])),
        labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
      } as ArrayVisualization,
    });

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] === 'S') board[r][c] = 'O';
        else if (board[r][c] === 'O') board[r][c] = 'X';
      }
    }

    steps.push({
      line: 12,
      explanation: `Final board: all surrounded 'O' regions captured as 'X'. Border-connected 'O' regions preserved.`,
      variables: {},
      visualization: {
        type: 'array',
        array: board.flat().map(v => v === 'O' ? 1 : 0),
        highlights: Object.fromEntries(board.flat().map((v, i) => [i, v === 'O' ? 'found' : 'default'])),
        labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default surroundedRegionsBfs;
