import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const dungeonGame: AlgorithmDefinition = {
  id: 'dungeon-game',
  title: 'Dungeon Game',
  leetcodeNumber: 174,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A knight starts at the top-left of a dungeon grid and must reach the bottom-right to rescue the princess. Each cell contains a value (negative = demon damage, positive = health orb). Find the minimum initial health the knight needs to survive. We fill the DP table from bottom-right to top-left. dp[i][j] is the minimum health needed entering cell (i,j). At each cell, we need max(1, dp[next] - dungeon[i][j]).',
  tags: ['dp', 'matrix', 'reverse dp', 'path'],

  code: {
    pseudocode: `function calculateMinimumHP(dungeon):
  rows = len(dungeon), cols = len(dungeon[0])
  dp = 2D array (rows+1) x (cols+1), all INFINITY
  dp[rows][cols-1] = 1, dp[rows-1][cols] = 1  // sentinels
  for i from rows-1 downto 0:
    for j from cols-1 downto 0:
      minHealth = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
      dp[i][j] = max(1, minHealth)
  return dp[0][0]`,
    python: `def calculateMinimumHP(dungeon):
    rows, cols = len(dungeon), len(dungeon[0])
    dp = [[float('inf')]*(cols+1) for _ in range(rows+1)]
    dp[rows][cols-1] = dp[rows-1][cols] = 1
    for i in range(rows-1, -1, -1):
        for j in range(cols-1, -1, -1):
            min_health = min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]
            dp[i][j] = max(1, min_health)
    return dp[0][0]`,
    javascript: `function calculateMinimumHP(dungeon) {
  const rows = dungeon.length, cols = dungeon[0].length;
  const dp = Array.from({length: rows+1}, () => new Array(cols+1).fill(Infinity));
  dp[rows][cols-1] = dp[rows-1][cols] = 1;
  for (let i = rows-1; i >= 0; i--) {
    for (let j = cols-1; j >= 0; j--) {
      const minHealth = Math.min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j];
      dp[i][j] = Math.max(1, minHealth);
    }
  }
  return dp[0][0];
}`,
    java: `public int calculateMinimumHP(int[][] dungeon) {
    int rows = dungeon.length, cols = dungeon[0].length;
    int[][] dp = new int[rows+1][cols+1];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[rows][cols-1] = dp[rows-1][cols] = 1;
    for (int i = rows-1; i >= 0; i--) {
        for (int j = cols-1; j >= 0; j--) {
            int minHealth = Math.min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j];
            dp[i][j] = Math.max(1, minHealth);
        }
    }
    return dp[0][0];
}`,
  },

  defaultInput: {
    dungeon: [
      [-2, -3, 3],
      [-5, -10, 1],
      [10, 30, -5],
    ],
  },

  inputFields: [
    {
      name: 'dungeon',
      label: 'Dungeon Grid',
      type: 'array',
      defaultValue: [
        [-2, -3, 3],
        [-5, -10, 1],
        [10, 30, -5],
      ],
      placeholder: '[[-2,-3,3],[-5,-10,1],[10,30,-5]]',
      helperText: 'Nested array: negative values are demons, positive are health orbs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dungeon = input.dungeon as number[][];
    const steps: AlgorithmStep[] = [];
    const rows = dungeon.length;
    const cols = dungeon[0].length;
    const INF = 999999;
    const dp: number[][] = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(INF)
    );
    dp[rows][cols - 1] = 1;
    dp[rows - 1][cols] = 1;

    const flatDP = (): number[] => dp.slice(0, rows).map(row => row.slice(0, cols)).flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: rows * cols }, (_, k) => {
        const r = Math.floor(k / cols);
        const c = k % cols;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP (bottom-right to top-left). dungeon is ${rows}x${cols}. Sentinels set at borders.`,
      variables: { rows, cols },
      visualization: makeViz({}),
    });

    for (let i = rows - 1; i >= 0; i--) {
      for (let j = cols - 1; j >= 0; j--) {
        const idx = i * cols + j;
        const below = dp[i + 1][j] === INF ? INF : dp[i + 1][j];
        const right = dp[i][j + 1] === INF ? INF : dp[i][j + 1];
        const minNext = Math.min(below, right);
        const minHealth = minNext - dungeon[i][j];
        dp[i][j] = Math.max(1, minHealth);
        steps.push({
          line: 6,
          explanation: `dp[${i}][${j}]: dungeon[${i}][${j}]=${dungeon[i][j]}. min(below=${below === INF ? 'inf' : below}, right=${right === INF ? 'inf' : right}) - ${dungeon[i][j]} = ${minHealth}. max(1, ${minHealth}) = ${dp[i][j]}.`,
          variables: { i, j, 'dungeon[i][j]': dungeon[i][j], 'dp[i][j]': dp[i][j] },
          visualization: makeViz({
            [idx]: 'active',
            ...(i + 1 < rows ? { [(i + 1) * cols + j]: 'comparing' } : {}),
            ...(j + 1 < cols ? { [i * cols + (j + 1)]: 'comparing' } : {}),
          }),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Minimum initial HP required = dp[0][0] = ${dp[0][0]}.`,
      variables: { result: dp[0][0] },
      visualization: makeViz({ 0: 'found' }),
    });

    return steps;
  },
};

export default dungeonGame;
