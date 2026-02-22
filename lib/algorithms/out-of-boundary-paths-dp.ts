import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const outOfBoundaryPathsDP: AlgorithmDefinition = {
  id: 'out-of-boundary-paths-dp',
  title: 'Out of Boundary Paths',
  leetcodeNumber: 576,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count paths for a ball starting at (startRow, startCol) in an m×n grid to move out of bounds in exactly maxMove moves. dp[move][r][c] = ways to exit in exactly (remaining) moves from (r,c). Sum contributions from all border-crossing moves.',
  tags: ['Dynamic Programming', 'BFS', 'State Machine'],
  code: {
    pseudocode: `function findPaths(m, n, maxMove, startRow, startCol):
  MOD = 1e9+7
  dp = 3D array[maxMove+1][m][n], dp[0][startRow][startCol]=1
  result = 0
  for move from 1 to maxMove:
    for r from 0 to m-1:
      for c from 0 to n-1:
        for each direction (dr,dc):
          nr, nc = r+dr, c+dc
          if out of bounds: result += dp[move-1][r][c]
          else: dp[move][nr][nc] += dp[move-1][r][c]
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
                for dr,dc in dirs:
                    nr,nc = r+dr, c+dc
                    if 0<=nr<m and 0<=nc<n:
                        dp[move][nr][nc] = (dp[move][nr][nc]+dp[move-1][r][c])%MOD
                    else:
                        result = (result+dp[move-1][r][c])%MOD
    return result`,
    javascript: `function findPaths(m, n, maxMove, startRow, startCol) {
  const MOD = 1000000007;
  const dp = Array.from({length:maxMove+1},
    ()=>Array.from({length:m},()=>new Array(n).fill(0)));
  dp[0][startRow][startCol] = 1;
  let result = 0;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  for (let move = 1; move <= maxMove; move++)
    for (let r = 0; r < m; r++)
      for (let c = 0; c < n; c++)
        for (const [dr,dc] of dirs) {
          const [nr,nc] = [r+dr, c+dc];
          if (nr>=0&&nr<m&&nc>=0&&nc<n)
            dp[move][nr][nc] = (dp[move][nr][nc]+dp[move-1][r][c])%MOD;
          else result = (result+dp[move-1][r][c])%MOD;
        }
  return result;
}`,
    java: `public int findPaths(int m, int n, int maxMove, int startRow, int startCol) {
    int MOD = 1_000_000_007;
    int[][][] dp = new int[maxMove+1][m][n];
    dp[0][startRow][startCol] = 1;
    int result = 0;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    for (int move = 1; move <= maxMove; move++)
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                for (int[] d : dirs) {
                    int nr=r+d[0], nc=c+d[1];
                    if (nr>=0&&nr<m&&nc>=0&&nc<n)
                        dp[move][nr][nc]=(dp[move][nr][nc]+dp[move-1][r][c])%MOD;
                    else result=(result+dp[move-1][r][c])%MOD;
                }
    return result;
}`,
  },
  defaultInput: { m: 2, n: 2, maxMove: 2, startRow: 0, startCol: 0 },
  inputFields: [
    {
      name: 'm',
      label: 'Grid Rows (m)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'n',
      label: 'Grid Columns (n)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of columns in the grid',
    },
    {
      name: 'maxMove',
      label: 'Max Moves',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Maximum number of moves allowed',
    },
    {
      name: 'startRow',
      label: 'Start Row',
      type: 'number',
      defaultValue: 0,
      placeholder: 'e.g. 0',
      helperText: 'Starting row (0-indexed)',
    },
    {
      name: 'startCol',
      label: 'Start Column',
      type: 'number',
      defaultValue: 0,
      placeholder: 'e.g. 0',
      helperText: 'Starting column (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const maxMove = input.maxMove as number;
    const startRow = input.startRow as number;
    const startCol = input.startCol as number;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];

    const dp: number[][][] = Array.from({ length: maxMove + 1 },
      () => Array.from({ length: m }, () => new Array(n).fill(0)));
    dp[0][startRow][startCol] = 1;
    let result = 0;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    // Flatten grid per move for visualization
    const resultByMove: number[] = new Array(maxMove + 1).fill(0);
    const labels: string[] = Array.from({ length: maxMove + 1 }, (_, i) => `move${i}`);

    function makeViz(activeMove: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= maxMove; i++) {
        if (i === activeMove) highlights[i] = 'active';
        else if (resultByMove[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: resultByMove.slice(), highlights, labels };
    }

    steps.push({
      line: 2,
      explanation: `Grid ${m}×${n}, maxMove=${maxMove}, start=(${startRow},${startCol}). dp[move][r][c]=ways to reach (r,c) after that many moves.`,
      variables: { m, n, maxMove, startRow, startCol },
      visualization: makeViz(0),
    });

    for (let move = 1; move <= maxMove; move++) {
      let addedThisMove = 0;
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
              dp[move][nr][nc] = (dp[move][nr][nc] + dp[move - 1][r][c]) % MOD;
            } else {
              addedThisMove = (addedThisMove + dp[move - 1][r][c]) % MOD;
              result = (result + dp[move - 1][r][c]) % MOD;
            }
          }
        }
      }
      resultByMove[move] = result;

      steps.push({
        line: 9,
        explanation: `Move ${move}: ${addedThisMove} new exit paths found. Total exits so far: ${result}.`,
        variables: { move, newExits: addedThisMove, totalResult: result },
        visualization: makeViz(move),
      });
    }

    steps.push({
      line: 10,
      explanation: `Answer = ${result}. Total paths out of bounds in at most ${maxMove} moves from (${startRow},${startCol}).`,
      variables: { result },
      visualization: makeViz(maxMove),
    });

    return steps;
  },
};

export default outOfBoundaryPathsDP;
