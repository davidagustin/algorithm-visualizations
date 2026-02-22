import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const stoneGame: AlgorithmDefinition = {
  id: 'stone-game',
  title: 'Stone Game',
  leetcodeNumber: 877,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Alice and Bob take turns picking from either end of a row of piles. Alice goes first. The player with more stones wins. dp[i][j] = net stones the current player gains over the opponent from piles[i..j]. Alice wins if dp[0][n-1] > 0. (Alex always wins with even n piles.)',
  tags: ['Dynamic Programming', 'Math', 'Game Theory'],
  code: {
    pseudocode: `function stoneGame(piles):
  n = length(piles)
  dp[i][i] = piles[i] for all i
  for length from 2 to n:
    for i from 0 to n-length:
      j = i + length - 1
      dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])
  return dp[0][n-1] > 0`,
    python: `def stoneGame(piles):
    n = len(piles)
    dp = [[0]*n for _ in range(n)]
    for i in range(n): dp[i][i] = piles[i]
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            dp[i][j] = max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])
    return dp[0][n-1] > 0`,
    javascript: `function stoneGame(piles) {
  const n = piles.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = piles[i];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      const j = i + len - 1;
      dp[i][j] = Math.max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]);
    }
  }
  return dp[0][n-1] > 0;
}`,
    java: `public boolean stoneGame(int[] piles) {
    int n = piles.length;
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = piles[i];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n-len; i++) {
            int j = i + len - 1;
            dp[i][j] = Math.max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1]);
        }
    }
    return dp[0][n-1] > 0;
}`,
  },
  defaultInput: { piles: [5, 3, 4, 5] },
  inputFields: [
    {
      name: 'piles',
      label: 'Piles',
      type: 'array',
      defaultValue: [5, 3, 4, 5],
      placeholder: '5,3,4,5',
      helperText: 'Even number of piles of stones',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const piles = input.piles as number[];
    const n = piles.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const filled: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    const flatIdx = (i: number, j: number) => i * n + j;
    const totalCells = n * n;

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          arr.push(filled[i][j] ? dp[i][j] : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          labels.push(i <= j ? `(${i},${j})` : 'X');
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < totalCells; k++) {
        const i = Math.floor(k / n);
        const j = k % n;
        if (i > j) { highlights[k] = 'visited'; continue; }
        if (filled[i][j]) highlights[k] = dp[i][j] > 0 ? 'found' : 'comparing';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Stone Game: piles=[${piles.join(', ')}]. dp[i][j] = net stones current player gains over opponent when picking from piles[i..j].`,
      variables: { piles, n },
      visualization: makeViz(null, []),
    });

    // Base: single pile
    for (let i = 0; i < n; i++) {
      dp[i][i] = piles[i];
      filled[i][i] = true;
    }
    steps.push({
      line: 2,
      explanation: `Base case: dp[i][i] = piles[i]. Only one pile to take, current player takes it all.`,
      variables: {},
      visualization: makeViz(null, []),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        const takeLeft = piles[i] - dp[i + 1][j];
        const takeRight = piles[j] - dp[i][j - 1];
        dp[i][j] = Math.max(takeLeft, takeRight);
        filled[i][j] = true;

        const action = takeLeft >= takeRight ? `take left pile[${i}]=${piles[i]}` : `take right pile[${j}]=${piles[j]}`;
        steps.push({
          line: 5,
          explanation: `dp[${i}][${j}]: range [${i}..${j}]. Take left: ${piles[i]}-dp[${i + 1}][${j}]=${piles[i]}-${dp[i + 1][j]}=${takeLeft}. Take right: ${piles[j]}-dp[${i}][${j - 1}]=${piles[j]}-${dp[i][j - 1]}=${takeRight}. Best: ${action}. dp[${i}][${j}]=${dp[i][j]}.`,
          variables: { i, j, takeLeft, takeRight, 'dp[i][j]': dp[i][j] },
          visualization: makeViz(flatIdx(i, j), [flatIdx(i + 1, j), flatIdx(i, j - 1)]),
        });
      }
    }

    const result = dp[0][n - 1] > 0;
    steps.push({
      line: 6,
      explanation: `dp[0][${n - 1}] = ${dp[0][n - 1]}. ${result ? 'Alice WINS' : 'Alice loses'}. Alice can guarantee net advantage of ${dp[0][n - 1]} stones.`,
      variables: { result, netAdvantage: dp[0][n - 1] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => {
            const i = Math.floor(k / n);
            const j = k % n;
            if (i > j) return [k, 'visited'];
            if (k === flatIdx(0, n - 1)) return [k, 'active'];
            if (filled[i][j]) return [k, dp[i][j] > 0 ? 'found' : 'mismatch'];
            return [k, 'default'];
          })
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default stoneGame;
