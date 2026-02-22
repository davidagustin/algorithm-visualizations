import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cherryPickupDp: AlgorithmDefinition = {
  id: 'cherry-pickup-dp',
  title: 'Cherry Pickup (DP)',
  leetcodeNumber: 741,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'In an n x n grid with cherries (1), empty cells (0), and thorns (-1), find the max cherries you can collect going from (0,0) to (n-1,n-1) and back. Equivalent to two simultaneous paths from (0,0) to (n-1,n-1). Uses 3D DP on the step count t and two column positions c1,c2.',
  tags: ['dynamic programming', 'grid', 'two paths', 'dp 3d'],

  code: {
    pseudocode: `function cherryPickup(grid):
  n = len(grid)
  dp[t][c1][c2] = max cherries from two paths at step t
  // r1 = t-c1, r2 = t-c2
  dp[0][0][0] = grid[0][0]
  for t from 1 to 2*(n-1):
    for c1 from max(0,t-(n-1)) to min(n-1,t):
      r1 = t - c1
      for c2 from c1 to min(n-1,t):
        r2 = t - c2
        if grid[r1][c1] == -1 or grid[r2][c2] == -1: continue
        cherries = grid[r1][c1]
        if c1 != c2: cherries += grid[r2][c2]
        best = max of 4 prev states
        dp[t][c1][c2] = best + cherries
  return max(0, dp[2n-2][n-1][n-1])`,
    python: `def cherryPickup(grid):
    n = len(grid)
    NEG_INF = float('-inf')
    dp = [[[NEG_INF]*n for _ in range(n)] for _ in range(2*n-1)]
    dp[0][0][0] = grid[0][0]
    for t in range(1, 2*n-1):
        for c1 in range(max(0,t-(n-1)), min(n-1,t)+1):
            r1 = t-c1
            for c2 in range(c1, min(n-1,t)+1):
                r2 = t-c2
                if grid[r1][c1]==-1 or grid[r2][c2]==-1: continue
                cherries = grid[r1][c1]+(0 if c1==c2 else grid[r2][c2])
                best = NEG_INF
                for dc1,dc2 in [(-1,-1),(-1,0),(0,-1),(0,0)]:
                    pc1,pc2 = c1+dc1, c2+dc2
                    if 0<=pc1<=min(n-1,t-1) and pc1<=pc2<=min(n-1,t-1):
                        best = max(best, dp[t-1][pc1][pc2])
                if best != NEG_INF:
                    dp[t][c1][c2] = best+cherries
    return max(0, dp[2*n-2][n-1][n-1])`,
    javascript: `function cherryPickup(grid) {
  const n = grid.length;
  const NEG = -Infinity;
  const dp = Array.from({length:2*n-1},()=>Array.from({length:n},()=>new Array(n).fill(NEG)));
  dp[0][0][0] = grid[0][0];
  for (let t=1;t<2*n-1;t++)
    for (let c1=Math.max(0,t-(n-1));c1<=Math.min(n-1,t);c1++) {
      const r1=t-c1;
      for (let c2=c1;c2<=Math.min(n-1,t);c2++) {
        const r2=t-c2;
        if (grid[r1][c1]===-1||grid[r2][c2]===-1) continue;
        const ch=grid[r1][c1]+(c1===c2?0:grid[r2][c2]);
        let best=NEG;
        for (const [dc1,dc2] of [[-1,-1],[-1,0],[0,-1],[0,0]]) {
          const [pc1,pc2]=[c1+dc1,c2+dc2];
          if (pc1>=0&&pc2>=pc1&&pc2<=Math.min(n-1,t-1)) best=Math.max(best,dp[t-1][pc1][pc2]);
        }
        if (best!==NEG) dp[t][c1][c2]=best+ch;
      }
    }
  return Math.max(0,dp[2*n-2][n-1][n-1]);
}`,
    java: `public int cherryPickup(int[][] grid) {
    int n = grid.length;
    int[][][] dp = new int[2*n-1][n][n];
    for (int[][] a: dp) for (int[] b: a) Arrays.fill(b, Integer.MIN_VALUE/2);
    dp[0][0][0] = grid[0][0];
    for (int t=1;t<2*n-1;t++)
        for (int c1=Math.max(0,t-(n-1));c1<=Math.min(n-1,t);c1++) {
            int r1=t-c1;
            for (int c2=c1;c2<=Math.min(n-1,t);c2++) {
                int r2=t-c2;
                if (grid[r1][c1]==-1||grid[r2][c2]==-1) continue;
                int ch=grid[r1][c1]+(c1==c2?0:grid[r2][c2]);
                int best=Integer.MIN_VALUE/2;
                int[][] moves={{-1,-1},{-1,0},{0,-1},{0,0}};
                for (int[] d: moves) {
                    int pc1=c1+d[0],pc2=c2+d[1];
                    if (pc1>=0&&pc2>=pc1&&pc2<=Math.min(n-1,t-1)) best=Math.max(best,dp[t-1][pc1][pc2]);
                }
                if (best>Integer.MIN_VALUE/2) dp[t][c1][c2]=best+ch;
            }
        }
    return Math.max(0,dp[2*n-2][n-1][n-1]);
}`,
  },

  defaultInput: {
    grid: [[0, 1, -1], [1, 0, -1], [1, 1, 1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened row by row)',
      type: 'array',
      defaultValue: [0, 1, -1, 1, 0, -1, 1, 1, 1],
      placeholder: '0,1,-1,1,0,-1,1,1,1',
      helperText: '1=cherry, 0=empty, -1=thorn. Flattened n x n grid.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawInput = input.grid;
    let grid: number[][];
    if (Array.isArray(rawInput) && Array.isArray(rawInput[0])) {
      grid = rawInput as number[][];
    } else {
      const flat = rawInput as number[];
      const n = Math.round(Math.sqrt(flat.length));
      grid = Array.from({ length: n }, (_, i) => flat.slice(i * n, (i + 1) * n));
    }

    const steps: AlgorithmStep[] = [];
    const n = grid.length;
    const flatGrid = grid.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flatGrid,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Cherry Pickup ${n}x${n} grid. Two simultaneous paths from (0,0) to (${n - 1},${n - 1}). Maximize total cherries.`,
      variables: { n, cherries: flatGrid.filter(v => v === 1).length },
      visualization: makeViz({}, {}),
    });

    // Show starting position
    steps.push({
      line: 4,
      explanation: `Both paths start at (0,0). Grid: 1=cherry, 0=empty, -1=thorn. Both move right or down each step.`,
      variables: { 'start value': grid[0][0] },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }),
    });

    const NEG = -Infinity;
    const dp = Array.from({ length: 2 * n - 1 }, () =>
      Array.from({ length: n }, () => new Array(n).fill(NEG))
    );
    dp[0][0][0] = grid[0][0];

    for (let t = 1; t < 2 * n - 1; t++) {
      for (let c1 = Math.max(0, t - (n - 1)); c1 <= Math.min(n - 1, t); c1++) {
        const r1 = t - c1;
        for (let c2 = c1; c2 <= Math.min(n - 1, t); c2++) {
          const r2 = t - c2;
          if (grid[r1][c1] === -1 || grid[r2][c2] === -1) continue;
          const ch = grid[r1][c1] + (c1 === c2 ? 0 : grid[r2][c2]);
          let best = NEG;
          for (const [dc1, dc2] of [[-1, -1], [-1, 0], [0, -1], [0, 0]]) {
            const pc1 = c1 + dc1, pc2 = c2 + dc2;
            if (pc1 >= 0 && pc2 >= pc1 && pc2 <= Math.min(n - 1, t - 1)) {
              best = Math.max(best, dp[t - 1][pc1][pc2]);
            }
          }
          if (best !== NEG) dp[t][c1][c2] = best + ch;
        }
      }

      if (t <= 2) {
        const idx1 = Math.min(n - 1, t) * n + t;
        const highlights: Record<number, string> = {};
        if (idx1 < flatGrid.length) highlights[idx1] = 'active';
        steps.push({
          line: 12,
          explanation: `Step t=${t}: Two paths advance. Best combined cherries so far explored.`,
          variables: { step: t },
          visualization: makeViz(highlights, {}),
        });
      }
    }

    const result = Math.max(0, dp[2 * n - 2][n - 1][n - 1]);

    steps.push({
      line: 14,
      explanation: `dp[${2 * n - 2}][${n - 1}][${n - 1}]=${dp[2 * n - 2][n - 1][n - 1]}. Maximum cherries = ${result} (0 if unreachable).`,
      variables: { result },
      visualization: makeViz(
        { [flatGrid.length - 1]: 'found', 0: 'found' },
        { [flatGrid.length - 1]: 'end', 0: `max:${result}` }
      ),
    });

    return steps;
  },
};

export default cherryPickupDp;
