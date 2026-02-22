import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const knightProbabilityInChessboard: AlgorithmDefinition = {
  id: 'knight-probability-in-chessboard',
  title: 'Knight Probability in Chessboard',
  leetcodeNumber: 688,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A knight starts at (row, col) on an n x n chessboard and makes exactly k moves. At each step it has 8 possible knight moves, each equally likely. Find the probability that it stays on the board after all k moves. Use DP where dp[r][c] = probability of being at (r,c) after some number of moves.',
  tags: ['dynamic programming', 'grid', 'probability', 'chess'],

  code: {
    pseudocode: `function knightProbability(n, k, row, col):
  dp = n x n grid, dp[row][col] = 1.0
  moves = 8 knight move directions
  for step from 1 to k:
    newDp = n x n grid of zeros
    for r from 0 to n-1:
      for c from 0 to n-1:
        if dp[r][c] > 0:
          for each (nr, nc) in knight moves from (r,c):
            if on board: newDp[nr][nc] += dp[r][c] / 8
    dp = newDp
  return sum of all dp values`,
    python: `def knightProbability(n, k, row, col):
    moves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]
    dp = [[0.0]*n for _ in range(n)]
    dp[row][col] = 1.0
    for _ in range(k):
        ndp = [[0.0]*n for _ in range(n)]
        for r in range(n):
            for c in range(n):
                if dp[r][c]:
                    for dr,dc in moves:
                        nr,nc=r+dr,c+dc
                        if 0<=nr<n and 0<=nc<n:
                            ndp[nr][nc]+=dp[r][c]/8
        dp=ndp
    return sum(sum(row) for row in dp)`,
    javascript: `function knightProbability(n, k, row, col) {
  const moves=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  let dp=Array.from({length:n},()=>Array(n).fill(0));
  dp[row][col]=1;
  for(let s=0;s<k;s++) {
    const ndp=Array.from({length:n},()=>Array(n).fill(0));
    for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(dp[r][c]) {
      for(const [dr,dc] of moves) {
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<n&&nc>=0&&nc<n) ndp[nr][nc]+=dp[r][c]/8;
      }
    }
    dp=ndp;
  }
  return dp.reduce((s,row)=>s+row.reduce((a,b)=>a+b,0),0);
}`,
    java: `public double knightProbability(int n, int k, int row, int col) {
    int[][] moves={{-2,-1},{-2,1},{-1,-2},{-1,2},{1,-2},{1,2},{2,-1},{2,1}};
    double[][] dp=new double[n][n];
    dp[row][col]=1;
    for(int s=0;s<k;s++) {
        double[][] ndp=new double[n][n];
        for(int r=0;r<n;r++) for(int c=0;c<n;c++) if(dp[r][c]>0)
            for(int[] m:moves) { int nr=r+m[0],nc=c+m[1]; if(nr>=0&&nr<n&&nc>=0&&nc<n) ndp[nr][nc]+=dp[r][c]/8; }
        dp=ndp;
    }
    double ans=0; for(double[] row2:dp) for(double v:row2) ans+=v; return ans;
}`,
  },

  defaultInput: {
    n: 3,
    k: 2,
    row: 0,
    col: 0,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Board Size (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Size of the n x n chessboard',
    },
    {
      name: 'k',
      label: 'Number of Moves (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of knight moves to make',
    },
    {
      name: 'row',
      label: 'Starting Row',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting row position (0-indexed)',
    },
    {
      name: 'col',
      label: 'Starting Column',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Starting column position (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const startRow = input.row as number;
    const startCol = input.col as number;
    const steps: AlgorithmStep[] = [];

    const moves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    let dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    dp[startRow][startCol] = 1.0;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    const flatProb = dp.flat().map(v => Math.round(v * 1000) / 1000);
    steps.push({
      line: 1,
      explanation: `Knight starts at (${startRow},${startCol}) with probability 1.0. Board is ${n}x${n}.`,
      variables: { n, k, startRow, startCol, totalProb: 1.0 },
      visualization: makeViz(flatProb, { [startRow * n + startCol]: 'active' }, { [startRow * n + startCol]: '1.0' }),
    });

    for (let step = 0; step < k; step++) {
      const ndp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (dp[r][c] > 0) {
            for (const [dr, dc] of moves) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                ndp[nr][nc] += dp[r][c] / 8;
              }
            }
          }
        }
      }
      dp = ndp;

      const flat = dp.flat().map(v => Math.round(v * 1000) / 1000);
      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      let maxProb = 0, maxIdx = 0;
      for (let i = 0; i < flat.length; i++) {
        if (flat[i] > 0) { hi[i] = 'active'; lb[i] = `${flat[i]}`; }
        if (flat[i] > maxProb) { maxProb = flat[i]; maxIdx = i; }
      }
      if (maxIdx >= 0 && flat[maxIdx] > 0) hi[maxIdx] = 'found';

      const totalProb = flat.reduce((a, b) => a + b, 0);
      steps.push({
        line: 8,
        explanation: `After move ${step + 1}: probability spread over board. Total remaining prob = ${Math.round(totalProb * 1000) / 1000}`,
        variables: { step: step + 1, remainingProbability: Math.round(totalProb * 1000) / 1000 },
        visualization: makeViz(flat, hi, lb),
      });
    }

    const totalFinal = dp.flat().reduce((a, b) => a + b, 0);
    const finalProb = Math.round(totalFinal * 10000) / 10000;
    const flat = dp.flat().map(v => Math.round(v * 1000) / 1000);

    steps.push({
      line: 11,
      explanation: `After ${k} moves, probability of staying on board = ${finalProb}`,
      variables: { answer: finalProb, moves: k },
      visualization: makeViz(flat, {}, {}),
    });

    return steps;
  },
};

export default knightProbabilityInChessboard;
