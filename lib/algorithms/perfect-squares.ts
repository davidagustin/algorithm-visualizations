import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const perfectSquares: AlgorithmDefinition = {
  id: 'perfect-squares',
  title: 'Perfect Squares',
  leetcodeNumber: 279,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer n, return the least number of perfect square numbers that sum to n. Perfect squares: 1, 4, 9, 16, ... dp[i] = min perfect squares summing to i. For each perfect square s <= i, dp[i] = min(dp[i], dp[i-s] + 1).',
  tags: ['Dynamic Programming', 'Math', 'BFS'],
  code: {
    pseudocode: `function numSquares(n):
  squares = [i*i for i <= sqrt(n)]
  dp = array of size n+1, all Infinity
  dp[0] = 0
  for i from 1 to n:
    for sq in squares:
      if sq > i: break
      dp[i] = min(dp[i], dp[i - sq] + 1)
  return dp[n]`,
    python: `def numSquares(n):
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            dp[i] = min(dp[i], dp[i - j*j] + 1)
            j += 1
    return dp[n]`,
    javascript: `function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j*j] + 1);
    }
  }
  return dp[n];
}`,
    java: `public int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j*j] + 1);
        }
    }
    return dp[n];
}`,
  },
  defaultInput: { n: 12 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Target integer (1 to 50 for best visualization)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const INF = n + 1;
    const dp: (number | null)[] = new Array(n + 1).fill(null);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => String(i));

    const squares: number[] = [];
    for (let j = 1; j * j <= n; j++) squares.push(j * j);

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (dp[i] !== null && dp[i] !== INF) highlights[i] = 'found';
        else if (dp[i] === INF) highlights[i] = 'visited';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Perfect Squares: min count of perfect squares summing to n=${n}. Perfect squares up to ${n}: [${squares.join(', ')}].`,
      variables: { n, squares },
      visualization: makeViz(null, []),
    });

    dp[0] = 0;
    steps.push({
      line: 3,
      explanation: 'dp[0] = 0. Zero perfect squares needed to sum to 0.',
      variables: { 'dp[0]': 0 },
      visualization: makeViz(0, []),
    });

    for (let i = 1; i <= n; i++) {
      dp[i] = INF;
      let best = INF;
      let bestSq = -1;
      const tried: number[] = [];

      for (let j = 1; j * j <= i; j++) {
        const sq = j * j;
        const candidate = (dp[i - sq] as number) + 1;
        tried.push(i - sq);
        if (candidate < best) {
          best = candidate;
          bestSq = sq;
        }
      }

      dp[i] = best >= INF ? null : best;

      if (i <= 8 || i === n) {
        steps.push({
          line: 5,
          explanation: dp[i] !== null
            ? `dp[${i}] = ${dp[i]}. Best: use perfect square ${bestSq}, then dp[${i}-${bestSq}]=dp[${i - bestSq}]=${(dp[i - bestSq] as number)} → ${dp[i - bestSq]} + 1 = ${dp[i]}.`
            : `dp[${i}] = ∞. Cannot reach ${i} with perfect squares.`,
          variables: { i, 'dp[i]': dp[i], squares: squares.filter(s => s <= i) },
          visualization: makeViz(i, tried.filter(t => t >= 0)),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `dp[${n}] = ${dp[n]}. Minimum ${dp[n]} perfect square(s) sum to ${n}. (e.g., ${n} = ${Array.from({ length: dp[n] as number }, () => '□').join(' + ')})`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [
            i,
            i === n ? 'active' : dp[i] !== null ? 'found' : 'default',
          ])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default perfectSquares;
