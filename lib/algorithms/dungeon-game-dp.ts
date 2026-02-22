import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dungeonGameDp: AlgorithmDefinition = {
  id: 'dungeon-game-dp',
  title: 'Dungeon Game (DP)',
  leetcodeNumber: 174,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A knight must rescue a princess in a dungeon grid. Each room has a value (negative = demon damage, positive = magic orb health). Find the minimum initial health the knight needs to reach bottom-right alive (health always >= 1). Solve bottom-up DP from the princess room back to the start.',
  tags: ['dynamic programming', 'grid', 'backward dp', 'optimization'],

  code: {
    pseudocode: `function calculateMinimumHP(dungeon):
  rows, cols = dimensions
  dp = (rows+1) x (cols+1) grid filled with INF
  dp[rows][cols-1] = dp[rows-1][cols] = 1  (boundary)
  for r from rows-1 downto 0:
    for c from cols-1 downto 0:
      need = min(dp[r+1][c], dp[r][c+1]) - dungeon[r][c]
      dp[r][c] = max(need, 1)  (health must be at least 1)
  return dp[0][0]`,
    python: `def calculateMinimumHP(dungeon):
    rows,cols=len(dungeon),len(dungeon[0])
    dp=[[float('inf')]*(cols+1) for _ in range(rows+1)]
    dp[rows][cols-1]=dp[rows-1][cols]=1
    for r in range(rows-1,-1,-1):
        for c in range(cols-1,-1,-1):
            need=min(dp[r+1][c],dp[r][c+1])-dungeon[r][c]
            dp[r][c]=max(need,1)
    return dp[0][0]`,
    javascript: `function calculateMinimumHP(dungeon) {
  const rows=dungeon.length,cols=dungeon[0].length;
  const dp=Array.from({length:rows+1},()=>Array(cols+1).fill(Infinity));
  dp[rows][cols-1]=dp[rows-1][cols]=1;
  for(let r=rows-1;r>=0;r--)
    for(let c=cols-1;c>=0;c--) {
      const need=Math.min(dp[r+1][c],dp[r][c+1])-dungeon[r][c];
      dp[r][c]=Math.max(need,1);
    }
  return dp[0][0];
}`,
    java: `public int calculateMinimumHP(int[][] dungeon) {
    int rows=dungeon.length,cols=dungeon[0].length;
    int[][] dp=new int[rows+1][cols+1];
    for(int[]row:dp) Arrays.fill(row,Integer.MAX_VALUE);
    dp[rows][cols-1]=dp[rows-1][cols]=1;
    for(int r=rows-1;r>=0;r--)
        for(int c=cols-1;c>=0;c--) {
            int need=Math.min(dp[r+1][c],dp[r][c+1])-dungeon[r][c];
            dp[r][c]=Math.max(need,1);
        }
    return dp[0][0];
}`,
  },

  defaultInput: {
    dungeon: [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]],
  },

  inputFields: [
    {
      name: 'dungeon',
      label: 'Dungeon Grid',
      type: 'array',
      defaultValue: [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]],
      placeholder: '[[-2,-3,3],[-5,-10,1],[10,30,-5]]',
      helperText: '2D grid: negative=damage, positive=health orb',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dungeon = input.dungeon as number[][];
    const rows = dungeon.length;
    const cols = dungeon[0].length;
    const steps: AlgorithmStep[] = [];
    const INF = 1e9;

    const dp: number[][] = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(INF));
    dp[rows][cols - 1] = 1;
    dp[rows - 1][cols] = 1;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Dungeon ${rows}x${cols}. Solve backward from princess room (bottom-right). Knight needs min health >= 1 everywhere.`,
      variables: { rows, cols },
      visualization: makeViz(dungeon.flat(), { [(rows - 1) * cols + (cols - 1)]: 'found' }, { [(rows - 1) * cols + (cols - 1)]: 'princess' }),
    });

    for (let r = rows - 1; r >= 0; r--) {
      for (let c = cols - 1; c >= 0; c--) {
        const right = dp[r][c + 1] === INF ? INF : dp[r][c + 1];
        const down = dp[r + 1][c] === INF ? INF : dp[r + 1][c];
        const need = Math.min(right, down) - dungeon[r][c];
        dp[r][c] = Math.max(need, 1);

        const dpSlice = [];
        for (let rr = 0; rr < rows; rr++)
          for (let cc = 0; cc < cols; cc++)
            dpSlice.push(dp[rr][cc] === INF ? 0 : dp[rr][cc]);

        const hi: Record<number, string> = {};
        const lb: Record<number, string> = {};
        hi[r * cols + c] = 'active';
        lb[r * cols + c] = `${dp[r][c]}`;
        if (r < rows - 1) { hi[(r + 1) * cols + c] = 'comparing'; }
        if (c < cols - 1) { hi[r * cols + (c + 1)] = 'comparing'; }

        steps.push({
          line: 6,
          explanation: `dp[${r}][${c}]: need min(right=${right === INF ? 'INF' : right}, down=${down === INF ? 'INF' : down}) - dungeon=${dungeon[r][c]} = ${dp[r][c]}`,
          variables: { r, c, dungeonVal: dungeon[r][c], right: right === INF ? 'INF' : right, down: down === INF ? 'INF' : down, minHealth: dp[r][c] },
          visualization: makeViz(dpSlice, hi, lb),
        });
      }
    }

    const dpFlat = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dpFlat.push(dp[r][c]);

    steps.push({
      line: 8,
      explanation: `Minimum initial health needed = ${dp[0][0]}`,
      variables: { answer: dp[0][0] },
      visualization: makeViz(dpFlat, { 0: 'found' }, { 0: `start:${dp[0][0]}` }),
    });

    return steps;
  },
};

export default dungeonGameDp;
