import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dungeonGameMatrix: AlgorithmDefinition = {
  id: 'dungeon-game-matrix',
  title: 'Dungeon Game',
  leetcodeNumber: 174,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A knight starts at top-left and must reach the princess at bottom-right of a dungeon grid (negative=demon, positive=magic). Find the minimum initial health needed to survive. Use DP from bottom-right: dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
  tags: ['Matrix', 'Dynamic Programming'],
  code: {
    pseudocode: `function calculateMinimumHP(dungeon):
  m, n = size(dungeon)
  dp = (m+1) x (n+1) matrix filled with INF
  dp[m][n-1] = dp[m-1][n] = 1
  for i from m-1 downto 0:
    for j from n-1 downto 0:
      need = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
      dp[i][j] = max(need, 1)
  return dp[0][0]`,
    python: `def calculateMinimumHP(dungeon):
    m, n = len(dungeon), len(dungeon[0])
    dp = [[float('inf')]*(n+1) for _ in range(m+1)]
    dp[m][n-1] = dp[m-1][n] = 1
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            need = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
            dp[i][j] = max(need, 1)
    return dp[0][0]`,
    javascript: `function calculateMinimumHP(dungeon) {
  const m=dungeon.length, n=dungeon[0].length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(Infinity));
  dp[m][n-1]=dp[m-1][n]=1;
  for(let i=m-1;i>=0;i--) for(let j=n-1;j>=0;j--) {
    const need=Math.min(dp[i+1][j],dp[i][j+1])-dungeon[i][j];
    dp[i][j]=Math.max(need,1);
  }
  return dp[0][0];
}`,
    java: `public int calculateMinimumHP(int[][] dungeon) {
    int m=dungeon.length, n=dungeon[0].length;
    int[][] dp=new int[m+1][n+1];
    for(int[] r:dp) Arrays.fill(r,Integer.MAX_VALUE);
    dp[m][n-1]=dp[m-1][n]=1;
    for(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--) {
        int need=Math.min(dp[i+1][j],dp[i][j+1])-dungeon[i][j];
        dp[i][j]=Math.max(need,1);
    }
    return dp[0][0];
}`,
  },
  defaultInput: { matrix: [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Dungeon Grid',
      type: 'string',
      defaultValue: '-2 -3 3, -5 -10 1, 10 30 -5',
      placeholder: 'e.g. -2 -3 3, -5 -10 1, 10 30 -5',
      helperText: 'Rows by commas. Negative=demon damage, positive=magic orb',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let dungeon: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      dungeon = input.matrix as number[][];
    } else {
      dungeon = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = dungeon.length, n = dungeon[0].length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity));
    dp[m][n - 1] = 1;
    dp[m - 1][n] = 1;
    const steps: AlgorithmStep[] = [];

    function makeViz(curr: number): ArrayVisualization {
      // Show dp values for the m x n cells (not the extra border)
      const dpFlat = Array.from({ length: m * n }, (_, k) => {
        const ri = Math.floor(k / n), ci = k % n;
        return dp[ri][ci] === Infinity ? 0 : dp[ri][ci];
      });
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `d:${dungeon[ri][ci]} hp:${dp[ri][ci] === Infinity ? '?' : dp[ri][ci]}`;
        highlights[i] = dp[ri][ci] !== Infinity ? (dungeon[ri][ci] < 0 ? 'mismatch' : 'found') : 'default';
      }
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: dpFlat,
        highlights,
        labels,
        auxData: { label: 'Dungeon Game', entries: [{ key: 'Min HP at (0,0)', value: `${dp[0][0] === Infinity ? '?' : dp[0][0]}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Dungeon Game DP from bottom-right. dp[i][j] = min health needed at (i,j). dp[m-1][n]=dp[m][n-1]=1 as base.`,
      variables: { m, n },
      visualization: makeViz(-1),
    });

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        const right = dp[i][j + 1] === undefined ? Infinity : dp[i][j + 1];
        const down = dp[i + 1][j] === undefined ? Infinity : dp[i + 1][j];
        const need = Math.min(right, down) - dungeon[i][j];
        dp[i][j] = Math.max(need, 1);
        const idx = i * n + j;
        steps.push({
          line: 7,
          explanation: `dp[${i}][${j}]: need = min(right=${right === Infinity ? '∞' : right}, down=${down === Infinity ? '∞' : down}) - dungeon[${i}][${j}](${dungeon[i][j]}) = ${Math.min(right, down) - dungeon[i][j]} → max(that,1) = ${dp[i][j]}.`,
          variables: { i, j, right, down, dungeon: dungeon[i][j], dp: dp[i][j] },
          visualization: makeViz(idx),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum initial health = dp[0][0] = ${dp[0][0]}.`,
      variables: { minHealth: dp[0][0] },
      visualization: makeViz(0),
    });

    return steps;
  },
};

export default dungeonGameMatrix;
