import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const guessNumberHigherOrLowerIi: AlgorithmDefinition = {
  id: 'guess-number-higher-or-lower-ii',
  title: 'Guess Number Higher or Lower II',
  leetcodeNumber: 375,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the minimum amount of money needed to guarantee a win in the number guessing game from 1 to n. If you guess wrong you pay the guess amount. dp[i][j] = min cost to guarantee finding the number in range [i,j]. For each pivot k, you pay k plus the worst case of the two sides.',
  tags: ['dynamic programming', 'game theory', 'minimax', 'interval dp'],

  code: {
    pseudocode: `function getMoneyAmount(n):
  dp[i][j] = min cost to guarantee win in range [i,j]
  dp[i][i] = 0 (only one number, no cost)
  for len from 2 to n:
    for i from 1 to n-len+1:
      j = i + len - 1
      dp[i][j] = infinity
      for k from i to j:
        cost = k + max(dp[i][k-1], dp[k+1][j])
        dp[i][j] = min(dp[i][j], cost)
  return dp[1][n]`,
    python: `def getMoneyAmount(n: int) -> int:
    dp = [[0] * (n + 2) for _ in range(n + 2)]
    for length in range(2, n + 1):
        for i in range(1, n - length + 2):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j + 1):
                cost = k + max(dp[i][k-1], dp[k+1][j])
                dp[i][j] = min(dp[i][j], cost)
    return dp[1][n]`,
    javascript: `function getMoneyAmount(n) {
  const dp = Array.from({length: n+2}, () => new Array(n+2).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 1; i <= n-len+1; i++) {
      const j = i+len-1;
      dp[i][j] = Infinity;
      for (let k = i; k <= j; k++) {
        const cost = k + Math.max(dp[i][k-1], dp[k+1][j]);
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[1][n];
}`,
    java: `public int getMoneyAmount(int n) {
    int[][] dp = new int[n+2][n+2];
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n-len+1; i++) {
            int j = i+len-1;
            dp[i][j] = Integer.MAX_VALUE/2;
            for (int k = i; k <= j; k++) {
                int cost = k + Math.max(dp[i][k-1], dp[k+1][j]);
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[1][n];
}`,
  },

  defaultInput: {
    n: 6,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Guess number from 1 to N',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const display = Math.min(n, 8);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: Array.from({ length: display }, (_, i) => i + 1),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Guess Number II with n=${n}. Find min money to guarantee winning. Paying k when wrong means worst-case analysis.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));

    steps.push({
      line: 3,
      explanation: 'Base case: dp[i][i]=0 for all i. Single number costs nothing (guaranteed correct guess).',
      variables: {},
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: display }, (_, i) => [i, 'active'])),
        Object.fromEntries(Array.from({ length: display }, (_, i) => [i, `${i + 1}`]))
      ),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 1; i <= n - len + 1; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        let bestK = i;
        for (let k = i; k <= j; k++) {
          const cost = k + Math.max(dp[i][k - 1], dp[k + 1][j]);
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            bestK = k;
          }
        }

        if (len <= 3 || (i === 1 && j === n)) {
          const highlights: Record<number, string> = {};
          const labels: Record<number, string> = {};
          for (let idx = i - 1; idx < Math.min(j, display); idx++) {
            highlights[idx] = 'comparing';
          }
          if (bestK - 1 < display) {
            highlights[bestK - 1] = 'active';
            labels[bestK - 1] = `k=${bestK}`;
          }

          steps.push({
            line: 7,
            explanation: `dp[${i}][${j}]=${dp[i][j]}. Best pivot k=${bestK} costs $${bestK} + worst-case of two sub-ranges.`,
            variables: { i, j, bestPivot: bestK, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[1][${n}]=${dp[1][n]}. Minimum money needed to guarantee a win guessing 1 to ${n}.`,
      variables: { result: dp[1][n] },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: display }, (_, i) => [i, 'found'])),
        { 0: `$${dp[1][n]}` }
      ),
    });

    return steps;
  },
};

export default guessNumberHigherOrLowerIi;
