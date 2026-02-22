import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cherryPickupIi: AlgorithmDefinition = {
  id: 'cherry-pickup-ii',
  title: 'Cherry Pickup II',
  leetcodeNumber: 1463,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Two robots start at the top-left and top-right corners of a grid. They move down one row at a time, each moving to one of three columns (left, same, right). Collect cherries from cells they visit; if both land on the same cell, count cherries only once. Find the maximum cherries collected by both robots together.',
  tags: ['dynamic programming', 'grid', '3d dp', 'simulation'],

  code: {
    pseudocode: `function cherryPickup(grid):
  rows, cols = grid dimensions
  dp[r][c1][c2] = max cherries if robot1 at col c1, robot2 at col c2 at row r
  initialize dp[0][0][cols-1] = grid[0][0] + grid[0][cols-1]
  for each row r from 0 to rows-2:
    for each c1 from 0 to cols-1:
      for each c2 from 0 to cols-1:
        for each move combo (-1,0,1) x (-1,0,1):
          update dp[r+1][nc1][nc2]
  return max of dp[rows-1][*][*]`,
    python: `def cherryPickup(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [[[-1]*cols for _ in range(cols)] for _ in range(rows)]
    dp[0][0][cols-1] = grid[0][0] + grid[0][cols-1]
    for r in range(rows-1):
        for c1 in range(cols):
            for c2 in range(cols):
                if dp[r][c1][c2] < 0: continue
                for d1 in [-1,0,1]:
                    for d2 in [-1,0,1]:
                        nc1, nc2 = c1+d1, c2+d2
                        if 0<=nc1<cols and 0<=nc2<cols:
                            pick = grid[r+1][nc1]
                            if nc1 != nc2: pick += grid[r+1][nc2]
                            dp[r+1][nc1][nc2] = max(dp[r+1][nc1][nc2], dp[r][c1][c2]+pick)
    return max(dp[rows-1][c1][c2] for c1 in range(cols) for c2 in range(cols) if dp[rows-1][c1][c2]>=0)`,
    javascript: `function cherryPickup(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = Array.from({length: rows}, () =>
    Array.from({length: cols}, () => Array(cols).fill(-1)));
  dp[0][0][cols-1] = grid[0][0] + grid[0][cols-1];
  for (let r = 0; r < rows-1; r++)
    for (let c1 = 0; c1 < cols; c1++)
      for (let c2 = 0; c2 < cols; c2++) {
        if (dp[r][c1][c2] < 0) continue;
        for (let d1 = -1; d1 <= 1; d1++)
          for (let d2 = -1; d2 <= 1; d2++) {
            const nc1 = c1+d1, nc2 = c2+d2;
            if (nc1>=0&&nc1<cols&&nc2>=0&&nc2<cols) {
              let pick = grid[r+1][nc1];
              if (nc1 !== nc2) pick += grid[r+1][nc2];
              dp[r+1][nc1][nc2] = Math.max(dp[r+1][nc1][nc2], dp[r][c1][c2]+pick);
            }
          }
      }
  let ans = 0;
  for (let c1=0;c1<cols;c1++) for(let c2=0;c2<cols;c2++)
    ans = Math.max(ans, dp[rows-1][c1][c2]);
  return ans;
}`,
    java: `public int cherryPickup(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int[][][] dp = new int[rows][cols][cols];
    for (int[][] a : dp) for (int[] b : a) Arrays.fill(b, -1);
    dp[0][0][cols-1] = grid[0][0] + grid[0][cols-1];
    for (int r = 0; r < rows-1; r++)
        for (int c1 = 0; c1 < cols; c1++)
            for (int c2 = 0; c2 < cols; c2++) {
                if (dp[r][c1][c2] < 0) continue;
                for (int d1=-1;d1<=1;d1++) for (int d2=-1;d2<=1;d2++) {
                    int nc1=c1+d1,nc2=c2+d2;
                    if(nc1>=0&&nc1<cols&&nc2>=0&&nc2<cols) {
                        int pick=grid[r+1][nc1]+(nc1!=nc2?grid[r+1][nc2]:0);
                        dp[r+1][nc1][nc2]=Math.max(dp[r+1][nc1][nc2],dp[r][c1][c2]+pick);
                    }
                }
            }
    int ans=0;
    for(int c1=0;c1<cols;c1++) for(int c2=0;c2<cols;c2++)
        ans=Math.max(ans,dp[rows-1][c1][c2]);
    return ans;
}`,
  },

  defaultInput: {
    grid: [[3, 1, 1], [2, 5, 1], [1, 5, 5], [2, 1, 1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Cherry Grid',
      type: 'array',
      defaultValue: [[3, 1, 1], [2, 5, 1], [1, 5, 5], [2, 1, 1]],
      placeholder: '[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]',
      helperText: '2D grid with cherry counts at each cell',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const rows = grid.length;
    const cols = grid[0].length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Array(cols).fill(-1))
    );
    dp[0][0][cols - 1] = grid[0][0] + (cols > 1 ? grid[0][cols - 1] : 0);

    const makeViz = (rowData: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: rowData,
      highlights,
      labels,
    });

    steps.push({
      line: 4,
      explanation: `Initialize: Robot1 starts at col 0, Robot2 at col ${cols - 1} on row 0. Initial cherries = ${dp[0][0][cols - 1]}`,
      variables: { row: 0, robot1Col: 0, robot2Col: cols - 1, cherries: dp[0][0][cols - 1] },
      visualization: makeViz(grid[0], { 0: 'active', [cols - 1]: 'found' }, { 0: 'R1', [cols - 1]: 'R2' }),
    });

    for (let r = 0; r < rows - 1; r++) {
      let bestC1 = -1, bestC2 = -1, bestVal = -1;
      for (let c1 = 0; c1 < cols; c1++) {
        for (let c2 = 0; c2 < cols; c2++) {
          if (dp[r][c1][c2] < 0) continue;
          for (let d1 = -1; d1 <= 1; d1++) {
            for (let d2 = -1; d2 <= 1; d2++) {
              const nc1 = c1 + d1, nc2 = c2 + d2;
              if (nc1 >= 0 && nc1 < cols && nc2 >= 0 && nc2 < cols) {
                let pick = grid[r + 1][nc1];
                if (nc1 !== nc2) pick += grid[r + 1][nc2];
                const newVal = dp[r][c1][c2] + pick;
                if (dp[r + 1][nc1][nc2] < newVal) {
                  dp[r + 1][nc1][nc2] = newVal;
                  if (newVal > bestVal) { bestVal = newVal; bestC1 = nc1; bestC2 = nc2; }
                }
              }
            }
          }
        }
      }

      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      if (bestC1 >= 0) { hi[bestC1] = 'active'; lb[bestC1] = 'R1'; }
      if (bestC2 >= 0 && bestC2 !== bestC1) { hi[bestC2] = 'found'; lb[bestC2] = 'R2'; }

      steps.push({
        line: 9,
        explanation: `After row ${r + 1}: Best robot positions are col ${bestC1} and col ${bestC2} with ${bestVal} cherries`,
        variables: { row: r + 1, bestRobot1Col: bestC1, bestRobot2Col: bestC2, maxCherries: bestVal },
        visualization: makeViz(grid[r + 1], hi, lb),
      });
    }

    let maxCherries = 0;
    for (let c1 = 0; c1 < cols; c1++)
      for (let c2 = 0; c2 < cols; c2++)
        if (dp[rows - 1][c1][c2] > maxCherries) maxCherries = dp[rows - 1][c1][c2];

    steps.push({
      line: 11,
      explanation: `Final answer: Maximum cherries collected by both robots = ${maxCherries}`,
      variables: { maxCherries },
      visualization: makeViz(grid[rows - 1], {}, {}),
    });

    return steps;
  },
};

export default cherryPickupIi;
