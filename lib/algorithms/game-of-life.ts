import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gameOfLife: AlgorithmDefinition = {
  id: 'game-of-life',
  title: 'Game of Life',
  leetcodeNumber: 289,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Simulate one step of Conway\'s Game of Life on an m×n board. Rules: (1) Live cell with 2-3 live neighbors → stays alive; (2) Live cell with <2 or >3 neighbors → dies; (3) Dead cell with exactly 3 live neighbors → becomes alive. In-place solution uses encoding: 2=dead→alive, -1=alive→dead to track previous state.',
  tags: ['Array', 'Matrix', 'Simulation'],
  code: {
    pseudocode: `function gameOfLife(board):
  for each cell (i,j):
    count = live neighbors (using original values)
    if board[i][j]==1 and count not in {2,3}: board[i][j]=-1
    if board[i][j]==0 and count==3: board[i][j]=2
  for each cell (i,j):
    if board[i][j]==2: board[i][j]=1
    if board[i][j]==-1: board[i][j]=0`,
    python: `def gameOfLife(board):
    m, n = len(board), len(board[0])
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    for i in range(m):
        for j in range(n):
            live = sum(1 for di,dj in dirs
                if 0<=i+di<m and 0<=j+dj<n
                and abs(board[i+di][j+dj])==1)
            if board[i][j]==1 and live not in {2,3}: board[i][j]=-1
            elif board[i][j]==0 and live==3: board[i][j]=2
    for i in range(m):
        for j in range(n):
            if board[i][j]==2: board[i][j]=1
            elif board[i][j]==-1: board[i][j]=0`,
    javascript: `function gameOfLife(board) {
  const m=board.length, n=board[0].length;
  const dirs=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  for (let i=0;i<m;i++) for (let j=0;j<n;j++) {
    let live=0;
    for (const [di,dj] of dirs) {
      const ni=i+di, nj=j+dj;
      if (ni>=0&&ni<m&&nj>=0&&nj<n&&Math.abs(board[ni][nj])===1) live++;
    }
    if (board[i][j]===1&&(live<2||live>3)) board[i][j]=-1;
    else if (board[i][j]===0&&live===3) board[i][j]=2;
  }
  for (let i=0;i<m;i++) for (let j=0;j<n;j++) {
    if (board[i][j]===2) board[i][j]=1;
    else if (board[i][j]===-1) board[i][j]=0;
  }
}`,
    java: `public void gameOfLife(int[][] board) {
    int m=board.length, n=board[0].length;
    int[][] dirs={{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        int live=0;
        for(int[] d:dirs){
            int ni=i+d[0],nj=j+d[1];
            if(ni>=0&&ni<m&&nj>=0&&nj<n&&Math.abs(board[ni][nj])==1) live++;
        }
        if(board[i][j]==1&&(live<2||live>3)) board[i][j]=-1;
        else if(board[i][j]==0&&live==3) board[i][j]=2;
    }
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(board[i][j]==2) board[i][j]=1;
        else if(board[i][j]==-1) board[i][j]=0;
    }
}`,
  },
  defaultInput: {
    board: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  inputFields: [
    {
      name: 'board',
      label: 'Board (rows separated by ;)',
      type: 'string',
      defaultValue: '0,1,0;0,0,1;1,1,1;0,0,0',
      placeholder: '0,1,0;0,0,1;1,1,1;0,0,0',
      helperText: 'Matrix of 0s and 1s. Rows separated by semicolons.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let board: number[][];

    if (Array.isArray(input.board) && Array.isArray(input.board[0])) {
      board = (input.board as number[][]).map(row => [...row]);
    } else {
      const str = input.board as string;
      board = str.split(';').map(row => row.split(',').map(Number));
    }

    const m = board.length;
    const n = board[0].length;
    const steps: AlgorithmStep[] = [];
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

    const flatBoard = (b: number[][]): number[] => b.flat();

    const makeViz = (
      b: number[][],
      activeIdx: number,
      action: string,
      liveNeighbors?: number,
    ): ArrayVisualization => {
      const arr = flatBoard(b).map(v => Math.abs(v)); // show absolute values for display
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < arr.length; k++) {
        const row = Math.floor(k / n);
        const col = k % n;
        const val = b[row][col];

        if (k === activeIdx) {
          highlights[k] = 'active';
          labels[k] = 'curr';
        } else if (val === -1) {
          highlights[k] = 'mismatch'; // dying
          labels[k] = '→0';
        } else if (val === 2) {
          highlights[k] = 'found'; // born
          labels[k] = '→1';
        } else if (val === 1) {
          highlights[k] = 'sorted'; // alive
        } else {
          highlights[k] = 'default'; // dead
        }
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Game of Life',
          entries: [
            { key: 'Board', value: `${m}×${n}` },
            { key: 'Action', value: action },
            ...(liveNeighbors !== undefined ? [{ key: 'Live neighbors', value: String(liveNeighbors) }] : []),
            ...b.map((row, i) => ({ key: `Row ${i}`, value: row.map(v => v === -1 ? '→0' : v === 2 ? '→1' : String(v)).join(' ') })),
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Simulate one step of Conway's Game of Life on ${m}×${n} board. Live=1 (violet), Dead=0 (default). Use encoding: -1=dying, 2=born.`,
      variables: { m, n },
      visualization: makeViz(board, -1, 'Initial board'),
    });

    // Phase 1: encode transitions
    steps.push({
      line: 3,
      explanation: `Phase 1: Scan each cell, count live neighbors, encode transitions (-1=will die, 2=will be born).`,
      variables: {},
      visualization: makeViz(board, -1, 'Start encoding'),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let liveCount = 0;
        for (const [di, dj] of dirs) {
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < m && nj >= 0 && nj < n && Math.abs(board[ni][nj]) === 1) {
            liveCount++;
          }
        }

        const flatIdx = i * n + j;
        const curVal = board[i][j];
        let newEnc = curVal;

        if (curVal === 1 && (liveCount < 2 || liveCount > 3)) {
          newEnc = -1;
          board[i][j] = -1;
          steps.push({
            line: 5,
            explanation: `Cell (${i},${j})=1 (alive), ${liveCount} live neighbors. Under/Overpopulation → dies. Encode as -1.`,
            variables: { i, j, liveCount },
            visualization: makeViz(board, flatIdx, `(${i},${j}) dying`, liveCount),
          });
        } else if (curVal === 0 && liveCount === 3) {
          newEnc = 2;
          board[i][j] = 2;
          steps.push({
            line: 6,
            explanation: `Cell (${i},${j})=0 (dead), exactly 3 live neighbors → born. Encode as 2.`,
            variables: { i, j, liveCount },
            visualization: makeViz(board, flatIdx, `(${i},${j}) born`, liveCount),
          });
        } else {
          steps.push({
            line: 4,
            explanation: `Cell (${i},${j})=${curVal}, ${liveCount} live neighbors → no change.`,
            variables: { i, j, liveCount, value: curVal },
            visualization: makeViz(board, flatIdx, `(${i},${j}) unchanged`, liveCount),
          });
        }
      }
    }

    // Phase 2: finalize
    steps.push({
      line: 7,
      explanation: `Phase 2: Finalize encoded values. -1 → 0, 2 → 1.`,
      variables: {},
      visualization: makeViz(board, -1, 'Finalizing'),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 2) board[i][j] = 1;
        else if (board[i][j] === -1) board[i][j] = 0;
      }
    }

    const finalHl: Record<number, string> = {};
    const flat = flatBoard(board);
    for (let k = 0; k < flat.length; k++) {
      finalHl[k] = flat[k] === 1 ? 'found' : 'default';
    }

    steps.push({
      line: 8,
      explanation: `Game of Life step complete. New board state shown.`,
      variables: { board: board.map(r => [...r]) },
      visualization: {
        type: 'array',
        array: flat,
        highlights: finalHl,
        labels: {},
        auxData: {
          label: 'Next Generation',
          entries: board.map((row, i) => ({ key: `Row ${i}`, value: row.join(' ') })),
        },
      },
    });

    return steps;
  },
};

export default gameOfLife;
