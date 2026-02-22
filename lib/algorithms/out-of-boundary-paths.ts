import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const outOfBoundaryPaths: AlgorithmDefinition = {
  id: 'out-of-boundary-paths',
  title: 'Out of Boundary Paths',
  leetcodeNumber: 576,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an m x n grid, a ball starts at position (startRow, startCol). You can move the ball in one of the four directions. Find the number of paths that move the ball out of the boundary in exactly maxMove moves. The DP state dp[move][r][c] is the number of ways to be at cell (r,c) after exactly "move" moves. We sum contributions to neighbors each step, counting exits from the grid.',
  tags: ['dp', 'matrix', 'path counting', 'modular arithmetic'],

  code: {
    pseudocode: `function findPaths(m, n, maxMove, startRow, startCol):
  MOD = 10^9 + 7
  dp = 3D array (maxMove+1) x m x n, all 0
  dp[0][startRow][startCol] = 1
  result = 0
  for move from 1 to maxMove:
    for r from 0 to m-1:
      for c from 0 to n-1:
        for each direction (dr, dc):
          nr = r + dr, nc = c + dc
          if out of bounds: result += dp[move-1][r][c]
          else: dp[move][nr][nc] += dp[move-1][r][c]
    result %= MOD
  return result % MOD`,
    python: `def findPaths(m, n, maxMove, startRow, startCol):
    MOD = 10**9 + 7
    dp = [[[0]*n for _ in range(m)] for _ in range(maxMove+1)]
    dp[0][startRow][startCol] = 1
    result = 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    for move in range(1, maxMove+1):
        for r in range(m):
            for c in range(n):
                for dr, dc in dirs:
                    nr, nc = r+dr, c+dc
                    if 0<=nr<m and 0<=nc<n:
                        dp[move][nr][nc] = (dp[move][nr][nc]+dp[move-1][r][c])%MOD
                    else:
                        result = (result+dp[move-1][r][c])%MOD
    return result`,
    javascript: `function findPaths(m, n, maxMove, startRow, startCol) {
  const MOD = 1e9+7;
  const dp = Array.from({length:maxMove+1}, () =>
    Array.from({length:m}, () => new Array(n).fill(0)));
  dp[0][startRow][startCol] = 1;
  let result = 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  for (let move = 1; move <= maxMove; move++) {
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        for (const [dr,dc] of dirs) {
          const nr=r+dr, nc=c+dc;
          if (nr>=0&&nr<m&&nc>=0&&nc<n) dp[move][nr][nc]=(dp[move][nr][nc]+dp[move-1][r][c])%MOD;
          else result=(result+dp[move-1][r][c])%MOD;
        }
      }
    }
  }
  return result;
}`,
    java: `public int findPaths(int m,int n,int maxMove,int startRow,int startCol){
    int MOD=1_000_000_007;
    long[][][] dp=new long[maxMove+1][m][n];
    dp[0][startRow][startCol]=1;
    long result=0;
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    for(int move=1;move<=maxMove;move++){
        for(int r=0;r<m;r++) for(int c=0;c<n;c++)
            for(int[]d:dirs){
                int nr=r+d[0],nc=c+d[1];
                if(nr>=0&&nr<m&&nc>=0&&nc<n) dp[move][nr][nc]=(dp[move][nr][nc]+dp[move-1][r][c])%MOD;
                else result=(result+dp[move-1][r][c])%MOD;
            }
    }
    return (int)(result%MOD);
}`,
  },

  defaultInput: {
    m: 2,
    n: 2,
    maxMove: 2,
    startRow: 0,
    startCol: 0,
  },

  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of columns in the grid',
    },
    {
      name: 'maxMove',
      label: 'Max Moves',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of moves allowed',
    },
    {
      name: 'startRow',
      label: 'Start Row',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting row of the ball',
    },
    {
      name: 'startCol',
      label: 'Start Column',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting column of the ball',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const maxMove = input.maxMove as number;
    const startRow = input.startRow as number;
    const startCol = input.startCol as number;
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;
    const dp: number[][][] = Array.from({ length: maxMove + 1 }, () =>
      Array.from({ length: m }, () => new Array(n).fill(0))
    );
    dp[0][startRow][startCol] = 1;
    let result = 0;
    const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    const makeViz = (moveIdx: number, highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dp[moveIdx].flat(),
      highlights,
      labels: Array.from({ length: m * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `${m}x${n} grid. Ball starts at (${startRow},${startCol}). maxMove=${maxMove}. Count exit paths.`,
      variables: { m, n, maxMove, startRow, startCol },
      visualization: makeViz(0, { [startRow * n + startCol]: 'found' }),
    });

    for (let move = 1; move <= maxMove; move++) {
      steps.push({
        line: 6,
        explanation: `Move #${move}: propagate paths from previous move.`,
        variables: { move, result },
        visualization: makeViz(move - 1, {}),
      });

      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          if (dp[move - 1][r][c] === 0) continue;
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
              dp[move][nr][nc] = (dp[move][nr][nc] + dp[move - 1][r][c]) % MOD;
            } else {
              result = (result + dp[move - 1][r][c]) % MOD;
              steps.push({
                line: 11,
                explanation: `Ball exits grid from (${r},${c}) after move ${move}. Adds ${dp[move - 1][r][c]} path(s). Total exits = ${result}.`,
                variables: { move, r, c, result },
                visualization: makeViz(move - 1, { [r * n + c]: 'found' }),
              });
            }
          }
        }
      }

      steps.push({
        line: 12,
        explanation: `After move ${move}: grid state updated. Cumulative exits = ${result}.`,
        variables: { move, result },
        visualization: makeViz(move, {}),
      });
    }

    steps.push({
      line: 13,
      explanation: `Total out-of-boundary paths in exactly ${maxMove} moves = ${result}.`,
      variables: { result },
      visualization: makeViz(maxMove, {}),
    });

    return steps;
  },
};

export default outOfBoundaryPaths;
