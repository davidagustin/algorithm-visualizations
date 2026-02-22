import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumWhiteTiles: AlgorithmDefinition = {
  id: 'minimum-white-tiles',
  title: 'Minimum White Tiles After Covering With Carpets',
  leetcodeNumber: 2209,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a floor string of "0" (black) and "1" (white) tiles, place numCarpets carpets of carpetLen length to minimize visible white tiles. dp[i][j] = min white tiles in first i tiles using j carpets. Either skip tile i or use a carpet ending at i.',
  tags: ['Dynamic Programming', 'Prefix Sum', 'Greedy'],
  code: {
    pseudocode: `function minimumWhiteTiles(floor, numCarpets, carpetLen):
  n = length(floor)
  prefix[i] = count of white tiles in floor[0..i-1]
  dp[i][j] = min white tiles in floor[0..i-1] with j carpets
  for i from 1 to n:
    for j from 0 to numCarpets:
      // Don't use carpet on tile i
      dp[i][j] = dp[i-1][j] + (floor[i-1]=='1' ? 1 : 0)
      // Use carpet ending at tile i
      if j > 0:
        start = max(0, i - carpetLen)
        dp[i][j] = min(dp[i][j], dp[start][j-1])
  return dp[n][numCarpets]`,
    python: `def minimumWhiteTiles(floor, numCarpets, carpetLen):
    n = len(floor)
    dp = [[0]*(numCarpets+1) for _ in range(n+1)]
    for i in range(1, n+1):
        w = 1 if floor[i-1]=='1' else 0
        for j in range(numCarpets+1):
            dp[i][j] = dp[i-1][j] + w
            if j > 0:
                start = max(0, i - carpetLen)
                dp[i][j] = min(dp[i][j], dp[start][j-1])
    return dp[n][numCarpets]`,
    javascript: `function minimumWhiteTiles(floor, numCarpets, carpetLen) {
  const n = floor.length;
  const dp = Array.from({length:n+1}, ()=>new Array(numCarpets+1).fill(0));
  for (let i = 1; i <= n; i++) {
    const w = floor[i-1] === '1' ? 1 : 0;
    for (let j = 0; j <= numCarpets; j++) {
      dp[i][j] = dp[i-1][j] + w;
      if (j > 0) {
        const start = Math.max(0, i - carpetLen);
        dp[i][j] = Math.min(dp[i][j], dp[start][j-1]);
      }
    }
  }
  return dp[n][numCarpets];
}`,
    java: `public int minimumWhiteTiles(String floor, int numCarpets, int carpetLen) {
    int n = floor.length();
    int[][] dp = new int[n+1][numCarpets+1];
    for (int i = 1; i <= n; i++) {
        int w = floor.charAt(i-1)=='1' ? 1 : 0;
        for (int j = 0; j <= numCarpets; j++) {
            dp[i][j] = dp[i-1][j] + w;
            if (j > 0) {
                int start = Math.max(0, i-carpetLen);
                dp[i][j] = Math.min(dp[i][j], dp[start][j-1]);
            }
        }
    }
    return dp[n][numCarpets];
}`,
  },
  defaultInput: { floor: '10110101', numCarpets: 2, carpetLen: 2 },
  inputFields: [
    {
      name: 'floor',
      label: 'Floor Pattern',
      type: 'string',
      defaultValue: '10110101',
      placeholder: 'e.g. 10110101',
      helperText: 'String of 0 (black) and 1 (white) tiles',
    },
    {
      name: 'numCarpets',
      label: 'Number of Carpets',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'How many carpets you can place',
    },
    {
      name: 'carpetLen',
      label: 'Carpet Length',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Length of each carpet in tiles',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const floor = input.floor as string;
    const numCarpets = input.numCarpets as number;
    const carpetLen = input.carpetLen as number;
    const n = floor.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(numCarpets + 1).fill(0));

    // Flatten for viz: show dp[i][numCarpets] column (final carpet count)
    const dpFinal: number[] = new Array(n + 1).fill(0);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => `i=${i}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dpFinal[i] < dpFinal[n] || i === 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dpFinal.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Floor="${floor}", carpets=${numCarpets}, carpetLen=${carpetLen}. dp[i][j]=min white tiles in first i tiles using j carpets.`,
      variables: { n, numCarpets, carpetLen },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= n; i++) {
      const w = floor[i - 1] === '1' ? 1 : 0;
      for (let j = 0; j <= numCarpets; j++) {
        dp[i][j] = dp[i - 1][j] + w;
        if (j > 0) {
          const start = Math.max(0, i - carpetLen);
          dp[i][j] = Math.min(dp[i][j], dp[start][j - 1]);
        }
      }
      dpFinal[i] = dp[i][numCarpets];

      steps.push({
        line: 7,
        explanation: `i=${i}: tile='${floor[i-1]}'. dp[${i}][${numCarpets}]=${dp[i][numCarpets]}. Running min white tiles with ${numCarpets} carpets.`,
        variables: { i, tile: floor[i - 1], 'dp[i][carpets]': dp[i][numCarpets] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 10,
      explanation: `Answer = dp[${n}][${numCarpets}] = ${dp[n][numCarpets]}. Minimum visible white tiles after placing ${numCarpets} carpets.`,
      variables: { result: dp[n][numCarpets] },
      visualization: makeViz(n),
    });

    return steps;
  },
};

export default minimumWhiteTiles;
