import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const cherryPickup: AlgorithmDefinition = {
  id: 'cherry-pickup',
  title: 'Cherry Pickup',
  leetcodeNumber: 741,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'In an n x n grid, each cell has 0, 1 (cherry), or -1 (thorn). Collect maximum cherries going from top-left to bottom-right then back. This is equivalent to two simultaneous paths both going from top-left to bottom-right. Using 3D DP where dp[t][r1][r2] represents max cherries when both walkers are at step t with walker 1 at row r1 and walker 2 at row r2. Their columns are inferred as t-r1 and t-r2.',
  tags: ['dp', 'matrix', 'two walkers', 'path'],

  code: {
    pseudocode: `function cherryPickup(grid):
  n = len(grid)
  // dp[t][r1][r2] = max cherries at step t, walker1 at row r1, walker2 at row r2
  dp = 3D array (2n-1) x n x n, all -INFINITY
  dp[0][0][0] = grid[0][0]
  for t from 1 to 2n-2:
    for r1 from max(0,t-n+1) to min(n-1,t):
      c1 = t - r1
      if c1 < 0 or c1 >= n or grid[r1][c1] == -1: continue
      for r2 from r1 to min(n-1,t):
        c2 = t - r2
        if c2 < 0 or c2 >= n or grid[r2][c2] == -1: continue
        best = max over prev (dr1, dr2 in {0,1}x{0,1}): dp[t-1][r1-dr1][r2-dr2]
        cherries = grid[r1][c1] + (r1!=r2 ? grid[r2][c2] : 0)
        dp[t][r1][r2] = best + cherries
  return max(0, dp[2n-2][n-1][n-1])`,
    python: `def cherryPickup(grid):
    n = len(grid)
    NEG_INF = float('-inf')
    dp = [[[NEG_INF]*n for _ in range(n)] for _ in range(2*n-1)]
    dp[0][0][0] = grid[0][0]
    for t in range(1, 2*n-1):
        for r1 in range(max(0,t-n+1), min(n,t+1)):
            c1 = t - r1
            if c1 < 0 or c1 >= n or grid[r1][c1] == -1: continue
            for r2 in range(r1, min(n,t+1)):
                c2 = t - r2
                if c2 < 0 or c2 >= n or grid[r2][c2] == -1: continue
                best = NEG_INF
                for dr1 in range(2):
                    for dr2 in range(2):
                        if r1-dr1 >= 0 and r2-dr2 >= 0:
                            best = max(best, dp[t-1][r1-dr1][r2-dr2])
                cherries = grid[r1][c1] + (grid[r2][c2] if r1 != r2 else 0)
                dp[t][r1][r2] = best + cherries if best != NEG_INF else NEG_INF
    return max(0, dp[2*n-2][n-1][n-1])`,
    javascript: `function cherryPickup(grid) {
  const n = grid.length;
  const NEG_INF = -Infinity;
  const dp = Array.from({length:2*n-1}, () =>
    Array.from({length:n}, () => new Array(n).fill(NEG_INF)));
  dp[0][0][0] = grid[0][0];
  for (let t = 1; t < 2*n-1; t++) {
    for (let r1 = Math.max(0,t-n+1); r1 <= Math.min(n-1,t); r1++) {
      const c1 = t - r1;
      if (c1 < 0||c1>=n||grid[r1][c1]===-1) continue;
      for (let r2 = r1; r2 <= Math.min(n-1,t); r2++) {
        const c2 = t - r2;
        if (c2 < 0||c2>=n||grid[r2][c2]===-1) continue;
        let best = NEG_INF;
        for (let dr1 = 0; dr1 < 2; dr1++)
          for (let dr2 = 0; dr2 < 2; dr2++)
            if (r1-dr1>=0 && r2-dr2>=0)
              best = Math.max(best, dp[t-1][r1-dr1][r2-dr2]);
        const cherries = grid[r1][c1] + (r1!==r2 ? grid[r2][c2] : 0);
        dp[t][r1][r2] = best === NEG_INF ? NEG_INF : best + cherries;
      }
    }
  }
  return Math.max(0, dp[2*n-2][n-1][n-1]);
}`,
    java: `public int cherryPickup(int[][] grid) {
    int n = grid.length;
    int[][][] dp = new int[2*n-1][n][n];
    for (int[][] a : dp) for (int[] b : a) Arrays.fill(b, Integer.MIN_VALUE);
    dp[0][0][0] = grid[0][0];
    for (int t = 1; t < 2*n-1; t++) {
        for (int r1 = Math.max(0,t-n+1); r1 <= Math.min(n-1,t); r1++) {
            int c1 = t-r1;
            if (c1<0||c1>=n||grid[r1][c1]==-1) continue;
            for (int r2 = r1; r2 <= Math.min(n-1,t); r2++) {
                int c2 = t-r2;
                if (c2<0||c2>=n||grid[r2][c2]==-1) continue;
                int best = Integer.MIN_VALUE;
                for (int d1=0;d1<2;d1++) for (int d2=0;d2<2;d2++)
                    if (r1-d1>=0&&r2-d2>=0&&dp[t-1][r1-d1][r2-d2]!=Integer.MIN_VALUE)
                        best = Math.max(best, dp[t-1][r1-d1][r2-d2]);
                int cherries = grid[r1][c1]+(r1!=r2?grid[r2][c2]:0);
                dp[t][r1][r2] = best==Integer.MIN_VALUE ? Integer.MIN_VALUE : best+cherries;
            }
        }
    }
    return Math.max(0, dp[2*n-2][n-1][n-1]);
}`,
  },

  defaultInput: {
    grid: [
      [0, 1, -1],
      [1, 0, -1],
      [1, 1, 1],
    ],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (0=empty, 1=cherry, -1=thorn)',
      type: 'array',
      defaultValue: [
        [0, 1, -1],
        [1, 0, -1],
        [1, 1, 1],
      ],
      placeholder: '[[0,1,-1],[1,0,-1],[1,1,1]]',
      helperText: 'n x n grid with 0 (empty), 1 (cherry), -1 (thorn)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const n = grid.length;
    const NEG_INF = -Infinity;
    const dp: number[][][] = Array.from({ length: 2 * n - 1 }, () =>
      Array.from({ length: n }, () => new Array(n).fill(NEG_INF))
    );

    if (grid[0][0] !== -1) dp[0][0][0] = grid[0][0];

    const makeViz = (t: number, highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dp[t].map(row => row.map(v => (v === NEG_INF ? -1 : v))).flat(),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `${n}x${n} grid. Two walkers from (0,0) to (${n - 1},${n - 1}) simultaneously. dp[t][r1][r2] = max cherries at diagonal step t.`,
      variables: { n, 'dp[0][0][0]': dp[0][0][0] },
      visualization: makeViz(0, { 0: 'found' }),
    });

    for (let t = 1; t < 2 * n - 1; t++) {
      steps.push({
        line: 6,
        explanation: `Processing diagonal step t=${t}. Both walkers have taken ${t} steps total.`,
        variables: { t },
        visualization: makeViz(Math.max(0, t - 1), {}),
      });

      for (let r1 = Math.max(0, t - n + 1); r1 <= Math.min(n - 1, t); r1++) {
        const c1 = t - r1;
        if (c1 < 0 || c1 >= n || grid[r1][c1] === -1) continue;
        for (let r2 = r1; r2 <= Math.min(n - 1, t); r2++) {
          const c2 = t - r2;
          if (c2 < 0 || c2 >= n || grid[r2][c2] === -1) continue;

          let best = NEG_INF;
          for (let dr1 = 0; dr1 < 2; dr1++) {
            for (let dr2 = 0; dr2 < 2; dr2++) {
              if (r1 - dr1 >= 0 && r2 - dr2 >= 0) {
                const prev = dp[t - 1][r1 - dr1][r2 - dr2];
                if (prev !== NEG_INF && prev > best) best = prev;
              }
            }
          }
          const cherries = grid[r1][c1] + (r1 !== r2 ? grid[r2][c2] : 0);
          dp[t][r1][r2] = best === NEG_INF ? NEG_INF : best + cherries;

          if (dp[t][r1][r2] !== NEG_INF) {
            steps.push({
              line: 11,
              explanation: `Step t=${t}, walkers at (${r1},${c1}) and (${r2},${c2}). Cherries collected this step: ${cherries}. Total: ${dp[t][r1][r2]}.`,
              variables: { t, r1, c1, r2, c2, cherries, total: dp[t][r1][r2] },
              visualization: makeViz(t, { [r1 * n + r2]: 'active' }),
            });
          }
        }
      }
    }

    const finalResult = Math.max(0, dp[2 * n - 2][n - 1][n - 1]);
    steps.push({
      line: 14,
      explanation: `Maximum cherries collectible = ${finalResult}.`,
      variables: { result: finalResult },
      visualization: makeViz(2 * n - 2, { [n * n - 1]: 'found' }),
    });

    return steps;
  },
};

export default cherryPickup;
