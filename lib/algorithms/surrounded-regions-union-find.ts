import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const surroundedRegionsUnionFind: AlgorithmDefinition = {
  id: 'surrounded-regions-union-find',
  title: 'Surrounded Regions (Union Find)',
  leetcodeNumber: 130,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Capture all regions of "O" surrounded by "X" (not connected to the border). Use union find: create a virtual "border" node. Union all border "O" cells to this virtual node, then union adjacent "O" cells together. Any "O" not connected to the border node is surrounded and should be flipped to "X".',
  tags: ['union find', 'graph', 'grid', 'dfs alternative'],

  code: {
    pseudocode: `function solve(board):
  m, n = dimensions
  virtualBorder = m * n  // virtual node for border-connected cells
  parent = [0..m*n]
  // Union border O cells with virtual border node
  for each border cell (r, c) where board[r][c] == 'O':
    union(r*n+c, virtualBorder)
  // Union adjacent O cells
  for r in 1..m-2:
    for c in 1..n-2:
      if board[r][c] == 'O':
        for each neighbor that is 'O':
          union(r*n+c, neighbor index)
  // Flip O not connected to border
  for each cell:
    if board[r][c]=='O' and find(r*n+c) != find(virtualBorder):
      board[r][c] = 'X'`,

    python: `def solve(board):
    if not board: return
    m, n = len(board), len(board[0])
    virtual = m * n
    parent = list(range(m * n + 1))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb: parent[pa] = pb
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O':
                if r==0 or r==m-1 or c==0 or c==n-1:
                    union(r*n+c, virtual)
                else:
                    for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                        nr,nc = r+dr,c+dc
                        if board[nr][nc]=='O':
                            union(r*n+c, nr*n+nc)
    for r in range(m):
        for c in range(n):
            if board[r][c]=='O' and find(r*n+c)!=find(virtual):
                board[r][c]='X'`,

    javascript: `function solve(board) {
  const m=board.length, n=board[0].length;
  const virtual=m*n;
  const parent=Array.from({length:m*n+1},(_,i)=>i);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){const pa=find(a),pb=find(b);if(pa!==pb)parent[pa]=pb;}
  for(let r=0;r<m;r++) for(let c=0;c<n;c++)
    if(board[r][c]==='O'){
      if(r===0||r===m-1||c===0||c===n-1) union(r*n+c,virtual);
      else for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){
        const nr=r+dr,nc=c+dc;
        if(board[nr][nc]==='O') union(r*n+c,nr*n+nc);
      }
    }
  for(let r=0;r<m;r++) for(let c=0;c<n;c++)
    if(board[r][c]==='O'&&find(r*n+c)!==find(virtual)) board[r][c]='X';
}`,

    java: `public void solve(char[][] board) {
    int m=board.length, n=board[0].length, virtual=m*n;
    int[] parent=new int[m*n+1];
    for(int i=0;i<m*n+1;i++) parent[i]=i;
    for(int r=0;r<m;r++) for(int c=0;c<n;c++)
        if(board[r][c]=='O'){
            if(r==0||r==m-1||c==0||c==n-1) union(parent,r*n+c,virtual);
            else for(int[]d:new int[][]{{-1,0},{1,0},{0,-1},{0,1}}){
                if(board[r+d[0]][c+d[1]]=='O') union(parent,r*n+c,(r+d[0])*n+(c+d[1]));
            }
        }
    for(int r=0;r<m;r++) for(int c=0;c<n;c++)
        if(board[r][c]=='O'&&find(parent,r*n+c)!=find(parent,virtual)) board[r][c]='X';
}`,
  },

  defaultInput: {
    board: [
      ['X', 'X', 'X', 'X'],
      ['X', 'O', 'O', 'X'],
      ['X', 'X', 'O', 'X'],
      ['X', 'O', 'X', 'X'],
    ],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board',
      type: 'array',
      defaultValue: [['X', 'X', 'X', 'X'], ['X', 'O', 'O', 'X'], ['X', 'X', 'O', 'X'], ['X', 'O', 'X', 'X']],
      placeholder: '[["X","O"],["O","X"]]',
      helperText: 'Grid of "X" and "O" characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = (input.board as string[][]).map(row => [...row]);
    const steps: AlgorithmStep[] = [];
    const m = board.length;
    const n = board[0].length;
    const virtual = m * n;
    const parent: number[] = Array.from({ length: m * n + 1 }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      const pa = find(a), pb = find(b);
      if (pa !== pb) parent[pa] = pb;
    }

    const flatBoard = board.flat();

    steps.push({
      line: 1,
      explanation: `Board is ${m}x${n}. Create virtual border node (index ${virtual}). Union all border "O" cells to it.`,
      variables: { m, n, virtual },
      visualization: {
        type: 'array',
        array: flatBoard.map(v => (v === 'O' ? 1 : 0)),
        highlights: {},
        labels: Object.fromEntries(flatBoard.map((v, i) => [i, v])),
      },
    });

    // Connect border O cells
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] === 'O' && (r === 0 || r === m - 1 || c === 0 || c === n - 1)) {
          union(r * n + c, virtual);
          steps.push({
            line: 5,
            explanation: `Border cell (${r},${c}) is "O". Union with virtual border node ${virtual}.`,
            variables: { r, c, index: r * n + c, virtual },
            visualization: {
              type: 'array',
              array: flatBoard.map(v => (v === 'O' ? 1 : 0)),
              highlights: { [r * n + c]: 'found' },
              labels: { [r * n + c]: 'border' },
            },
          });
        }
      }
    }

    // Union adjacent O cells
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] !== 'O') continue;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && board[nr][nc] === 'O') {
            const ra = find(r * n + c), rb = find(nr * n + nc);
            if (ra !== rb) {
              union(r * n + c, nr * n + nc);
              steps.push({
                line: 10,
                explanation: `Union adjacent O cells (${r},${c}) and (${nr},${nc}).`,
                variables: { r, c, nr, nc },
                visualization: {
                  type: 'array',
                  array: flatBoard.map(v => (v === 'O' ? 1 : 0)),
                  highlights: { [r * n + c]: 'active', [nr * n + nc]: 'comparing' },
                  labels: { [r * n + c]: 'O', [nr * n + nc]: 'O' },
                },
              });
            }
          }
        }
      }
    }

    // Flip surrounded O cells
    let flipped = 0;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (board[r][c] === 'O' && find(r * n + c) !== find(virtual)) {
          board[r][c] = 'X';
          flipped++;
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Flipped ${flipped} surrounded "O" cells to "X". Cells connected to virtual border node are safe.`,
      variables: { flipped },
      visualization: {
        type: 'array',
        array: board.flat().map(v => (v === 'O' ? 1 : 0)),
        highlights: Object.fromEntries(board.flat().map((v, i) => [i, v === 'O' ? 'found' : 'visited'])),
        labels: Object.fromEntries(board.flat().map((v, i) => [i, v])),
      },
    });

    return steps;
  },
};

export default surroundedRegionsUnionFind;
