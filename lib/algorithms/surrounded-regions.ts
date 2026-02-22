import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const surroundedRegions: AlgorithmDefinition = {
  id: 'surrounded-regions',
  title: 'Surrounded Regions',
  leetcodeNumber: 130,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a board of "X" and "O", capture all regions surrounded by "X" by flipping surrounded "O"s to "X". A region is NOT captured if any "O" is on the border. Use reverse BFS: mark all "O"s connected to the border as safe, then flip remaining "O"s.',
  tags: ['Graph', 'BFS', 'DFS', 'Matrix'],
  code: {
    pseudocode: `function solve(board):
  Mark all border-connected O's as safe (BFS)
  For each cell:
    if O and not safe → flip to X (captured)
    if safe → restore to O
  return board

function bfs(board, r, c):
  queue = [(r, c)]
  board[r][c] = "S"  // safe marker
  while queue:
    expand neighbors that are "O"
    mark them "S"`,
    python: `def solve(board):
    rows, cols = len(board), len(board[0])
    def bfs(r, c):
        queue = deque([(r, c)])
        board[r][c] = 'S'
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = cr+dr, cc+dc
                if 0<=nr<rows and 0<=nc<cols and board[nr][nc]=='O':
                    board[nr][nc] = 'S'
                    queue.append((nr, nc))
    for r in range(rows):
        for c in [0, cols-1]:
            if board[r][c]=='O': bfs(r, c)
    for c in range(cols):
        for r in [0, rows-1]:
            if board[r][c]=='O': bfs(r, c)
    for r in range(rows):
        for c in range(cols):
            if board[r][c]=='O': board[r][c]='X'
            elif board[r][c]=='S': board[r][c]='O'`,
    javascript: `function solve(board) {
  const rows = board.length, cols = board[0].length;
  function bfs(r, c) {
    const queue = [[r, c]];
    board[r][c] = 'S';
    while (queue.length) {
      const [cr, cc] = queue.shift();
      for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr=cr+dr, nc=cc+dc;
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&board[nr][nc]==='O') {
          board[nr][nc]='S'; queue.push([nr,nc]);
        }
      }
    }
  }
  for (let r=0;r<rows;r++) { if(board[r][0]==='O') bfs(r,0); if(board[r][cols-1]==='O') bfs(r,cols-1); }
  for (let c=0;c<cols;c++) { if(board[0][c]==='O') bfs(0,c); if(board[rows-1][c]==='O') bfs(rows-1,c); }
  for (let r=0;r<rows;r++) for(let c=0;c<cols;c++) board[r][c]=board[r][c]==='O'?'X':board[r][c]==='S'?'O':board[r][c];
}`,
    java: `public void solve(char[][] board) {
    int rows=board.length, cols=board[0].length;
    for(int r=0;r<rows;r++){bfs(board,r,0);bfs(board,r,cols-1);}
    for(int c=0;c<cols;c++){bfs(board,0,c);bfs(board,rows-1,c);}
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++){
        if(board[r][c]=='O') board[r][c]='X';
        else if(board[r][c]=='S') board[r][c]='O';
    }
}
void bfs(char[][] board,int r,int c){
    if(r<0||r>=board.length||c<0||c>=board[0].length||board[r][c]!='O') return;
    Queue<int[]> q=new LinkedList<>();q.add(new int[]{r,c});board[r][c]='S';
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){int[]cur=q.poll();for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];if(nr>=0&&nr<board.length&&nc>=0&&nc<board[0].length&&board[nr][nc]=='O'){board[nr][nc]='S';q.add(new int[]{nr,nc});}}}
}`,
  },
  defaultInput: {
    board: [
      [1, 1, 1, 1],
      [1, 0, 0, 1],
      [1, 1, 0, 1],
      [1, 0, 1, 1],
    ],
  },
  inputFields: [
    {
      name: 'board',
      label: 'Board (1=X, 0=O)',
      type: 'array',
      defaultValue: [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [1, 1, 0, 1],
        [1, 0, 1, 1],
      ],
      placeholder: '[[1,1,1],[1,0,1],[1,1,1]]',
      helperText: '2D grid: 1=X, 0=O. Border O\'s are never captured.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoard = input.board as number[][];
    const rows = rawBoard.length;
    const cols = rawBoard[0].length;
    // 0=O, 1=X, 2=safe(S)
    const board = rawBoard.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => board.flat();

    function makeViz(highlights: Record<number, string>, phase: string, captured: number): ArrayVisualization {
      return {
        type: 'array',
        array: flat(),
        highlights,
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => {
            const v = board[Math.floor(i / cols)][i % cols];
            return [i, v === 1 ? 'X' : v === 2 ? 'S' : 'O'];
          })
        ),
        auxData: {
          label: 'Surrounded Regions',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Captured', value: String(captured) },
            { key: 'Safe (border-connected)', value: String(board.flat().filter(v => v === 2).length) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Board is ${rows}x${cols}. Phase 1: BFS from all border O cells to mark border-connected O's as safe (S=2). Phase 2: flip remaining O's to X.`,
      variables: { rows, cols },
      visualization: makeViz({}, 'Init', 0),
    });

    // BFS from borders
    function bfs(r: number, c: number) {
      if (board[r][c] !== 0) return;
      board[r][c] = 2;
      const queue: [number, number][] = [[r, c]];
      while (queue.length > 0) {
        const [cr, cc] = queue.shift()!;
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
          const nr = cr + dr, nc = cc + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === 0) {
            board[nr][nc] = 2;
            queue.push([nr, nc]);
            steps.push({
              line: 10,
              explanation: `Safe BFS: (${nr},${nc}) is O connected to border. Mark as safe.`,
              variables: { nr, nc },
              visualization: makeViz({ [idx(nr, nc)]: 'pointer', [idx(cr, cc)]: 'active' }, 'Marking Safe', 0),
            });
          }
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `BFS from border O cells. Left/right columns and top/bottom rows.`,
      variables: {},
      visualization: makeViz({}, 'Border BFS', 0),
    });

    for (let r = 0; r < rows; r++) { bfs(r, 0); bfs(r, cols - 1); }
    for (let c = 0; c < cols; c++) { bfs(0, c); bfs(rows - 1, c); }

    steps.push({
      line: 14,
      explanation: `All border-connected O's marked safe. Now flip remaining O's to X and restore safe cells to O.`,
      variables: { safeCount: board.flat().filter(v => v === 2).length },
      visualization: makeViz(
        Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => [i, board.flat()[i] === 2 ? 'found' : 'default'])
        ),
        'Flipping', 0
      ),
    });

    let captured = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === 0) {
          board[r][c] = 1;
          captured++;
          steps.push({
            line: 16,
            explanation: `Cell (${r},${c}) is surrounded O → flip to X. Captured: ${captured}.`,
            variables: { r, c, captured },
            visualization: makeViz({ [idx(r, c)]: 'swapping' }, 'Flipping', captured),
          });
        } else if (board[r][c] === 2) {
          board[r][c] = 0;
        }
      }
    }

    const finalHL: Record<number, string> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        finalHL[idx(r, c)] = board[r][c] === 1 ? 'sorted' : 'found';
      }
    }

    steps.push({
      line: 17,
      explanation: `Done. ${captured} O cells captured (flipped to X). Border-connected O's preserved.`,
      variables: { captured },
      visualization: makeViz(finalHL, 'Complete', captured),
    });

    return steps;
  },
};

export default surroundedRegions;
