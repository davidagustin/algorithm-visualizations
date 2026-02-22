import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gameOfLifeII: AlgorithmDefinition = {
  id: 'game-of-life-ii',
  title: 'Game of Life',
  leetcodeNumber: 289,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    "Conway's Game of Life: given a board of 0s (dead) and 1s (live), apply rules simultaneously. A live cell with 2-3 live neighbors stays alive; a dead cell with exactly 3 live neighbors becomes alive; otherwise the cell dies/stays dead. Update in-place using encoded states.",
  tags: ['Matrix', 'Simulation', 'In-place'],
  code: {
    pseudocode: `function gameOfLife(board):
  for each cell (i,j):
    liveNeighbors = countLive(i,j)
    if board[i][j]==1 and liveNeighbors in {2,3}:
      board[i][j] = 2  # was live, stays live
    if board[i][j]==0 and liveNeighbors==3:
      board[i][j] = 3  # was dead, becomes live
  for each cell: board[i][j] = board[i][j] > 1 ? 1 : 0`,
    python: `def gameOfLife(board):
    m, n = len(board), len(board[0])
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for i in range(m):
        for j in range(n):
            live = sum(1 for di,dj in dirs
                       if 0<=i+di<m and 0<=j+dj<n
                       and board[i+di][j+dj] in {1,2})
            if board[i][j]==1 and live in {2,3}:
                board[i][j] = 2
            elif board[i][j]==0 and live==3:
                board[i][j] = 3
    for i in range(m):
        for j in range(n):
            board[i][j] = 1 if board[i][j] > 1 else 0`,
    javascript: `function gameOfLife(board) {
  const m = board.length, n = board[0].length;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const live = dirs.reduce((s,[di,dj]) => {
        const ni=i+di, nj=j+dj;
        return (ni>=0&&ni<m&&nj>=0&&nj<n&&(board[ni][nj]===1||board[ni][nj]===2))
          ? s+1 : s;
      }, 0);
      if (board[i][j]===1 && (live===2||live===3)) board[i][j]=2;
      else if (board[i][j]===0 && live===3) board[i][j]=3;
    }
  }
  for (let i=0;i<m;i++) for(let j=0;j<n;j++) board[i][j]=board[i][j]>1?1:0;
}`,
    java: `public void gameOfLife(int[][] board) {
    int m = board.length, n = board[0].length;
    int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            int live = 0;
            for (int[] d : dirs) {
                int ni=i+d[0], nj=j+d[1];
                if (ni>=0&&ni<m&&nj>=0&&nj<n&&(board[ni][nj]==1||board[ni][nj]==2))
                    live++;
            }
            if (board[i][j]==1 && (live==2||live==3)) board[i][j]=2;
            else if (board[i][j]==0 && live==3) board[i][j]=3;
        }
    for (int i=0;i<m;i++) for(int j=0;j<n;j++) board[i][j]=board[i][j]>1?1:0;
}`,
  },
  defaultInput: { matrix: [[0, 1, 0], [0, 0, 1], [1, 1, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Board (0=dead, 1=live)',
      type: 'string',
      defaultValue: '0 1 0, 0 0 1, 1 1 1',
      placeholder: 'e.g. 0 1 0, 0 0 1, 1 1 1',
      helperText: 'Rows separated by commas, 0=dead 1=live',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let board: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      board = (input.matrix as number[][]).map(r => [...r]);
    } else {
      const str = (input.matrix as string);
      board = str.split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = board.length, n = board[0].length;
    const steps: AlgorithmStep[] = [];
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    function makeViz(active: number, note: string): ArrayVisualization {
      const flat = board.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `(${ri},${ci})`;
        const v = flat[i];
        highlights[i] = v === 1 ? 'found' : v === 2 ? 'sorted' : v === 3 ? 'active' : 'default';
      }
      if (active >= 0) highlights[active] = 'comparing';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Game of Life', entries: [{ key: 'Phase', value: note }, { key: '2=liveStay 3=deadLive', value: '' }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Game of Life on ${m}x${n} board. Encode transitions: 2=live→live, 3=dead→live.`,
      variables: { m, n },
      visualization: makeViz(-1, 'Initial'),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const live = dirs.reduce((s, [di, dj]) => {
          const ni = i + di, nj = j + dj;
          return (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] === 1 || board[ni][nj] === 2)) ? s + 1 : s;
        }, 0);
        const idx = i * n + j;
        const prev = board[i][j];
        if (board[i][j] === 1 && (live === 2 || live === 3)) board[i][j] = 2;
        else if (board[i][j] === 0 && live === 3) board[i][j] = 3;
        steps.push({
          line: 4,
          explanation: `Cell (${i},${j})=${prev === 0 ? 'dead' : 'live'}, liveNeighbors=${live}. New state: ${board[i][j] === 2 ? 'stays live' : board[i][j] === 3 ? 'becomes live' : prev === 1 ? 'dies' : 'stays dead'}.`,
          variables: { i, j, prev, liveNeighbors: live, encoded: board[i][j] },
          visualization: makeViz(idx, 'Encoding'),
        });
      }
    }

    // Decode
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        board[i][j] = board[i][j] > 1 ? 1 : 0;

    steps.push({
      line: 8,
      explanation: `Decode: cells with value > 1 become 1, others become 0. Next generation computed in-place.`,
      variables: {},
      visualization: makeViz(-1, 'Final'),
    });

    return steps;
  },
};

export default gameOfLifeII;
