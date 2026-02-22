import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const tossStrangeCoins: AlgorithmDefinition = {
  id: 'toss-strange-coins',
  title: 'Toss Strange Coins',
  leetcodeNumber: 1230,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given n coins where coin i has probability prob[i] of landing heads, find the probability that exactly target coins land heads. Uses DP: dp[i][j] = probability of exactly j heads after tossing the first i coins. Transition: dp[i][j] = dp[i-1][j-1]*prob[i] + dp[i-1][j]*(1-prob[i]).',
  tags: ['dynamic programming', 'probability', 'math'],

  code: {
    pseudocode: `function probabilityOfHeads(prob, target):
  n = len(prob)
  dp[i][j] = P(exactly j heads in first i coins)
  dp[0][0] = 1.0
  for i from 1 to n:
    dp[i][0] = dp[i-1][0] * (1-prob[i-1])
    for j from 1 to i:
      dp[i][j] = dp[i-1][j-1]*prob[i-1] + dp[i-1][j]*(1-prob[i-1])
  return dp[n][target]`,
    python: `def probabilityOfHeads(prob, target):
    n = len(prob)
    dp = [[0.0]*(n+1) for _ in range(n+1)]
    dp[0][0] = 1.0
    for i in range(1, n+1):
        dp[i][0] = dp[i-1][0] * (1-prob[i-1])
        for j in range(1, i+1):
            dp[i][j] = dp[i-1][j-1]*prob[i-1] + dp[i-1][j]*(1-prob[i-1])
    return dp[n][target]`,
    javascript: `function probabilityOfHeads(prob, target) {
  const n = prob.length;
  const dp = Array.from({length:n+1},()=>new Array(n+1).fill(0));
  dp[0][0] = 1;
  for (let i=1;i<=n;i++) {
    dp[i][0] = dp[i-1][0]*(1-prob[i-1]);
    for (let j=1;j<=i;j++)
      dp[i][j] = dp[i-1][j-1]*prob[i-1] + dp[i-1][j]*(1-prob[i-1]);
  }
  return dp[n][target];
}`,
    java: `public double probabilityOfHeads(double[] prob, int target) {
    int n = prob.length;
    double[][] dp = new double[n+1][n+1];
    dp[0][0] = 1.0;
    for (int i=1;i<=n;i++) {
        dp[i][0] = dp[i-1][0]*(1-prob[i-1]);
        for (int j=1;j<=i;j++)
            dp[i][j] = dp[i-1][j-1]*prob[i-1] + dp[i-1][j]*(1-prob[i-1]);
    }
    return dp[n][target];
}`,
  },

  defaultInput: {
    prob: [0.4, 0.5, 0.6],
    target: 2,
  },

  inputFields: [
    {
      name: 'prob',
      label: 'Probabilities',
      type: 'array',
      defaultValue: [0.4, 0.5, 0.6],
      placeholder: '0.4,0.5,0.6',
      helperText: 'Probability of heads for each coin',
    },
    {
      name: 'target',
      label: 'Target Heads',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Exact number of heads desired',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const prob = input.prob as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = prob.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: prob.map((p: number) => Math.round(p * 100)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Toss Strange Coins: probs=[${prob.join(', ')}], target=${target}. Find P(exactly ${target} heads).`,
      variables: { n, target },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
    dp[0][0] = 1.0;

    steps.push({
      line: 3,
      explanation: 'dp[0][0]=1.0. With 0 coins tossed, probability of exactly 0 heads is 1.',
      variables: { 'dp[0][0]': 1.0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 1; i <= n; i++) {
      dp[i][0] = dp[i - 1][0] * (1 - prob[i - 1]);
      for (let j = 1; j <= i; j++) {
        dp[i][j] = dp[i - 1][j - 1] * prob[i - 1] + dp[i - 1][j] * (1 - prob[i - 1]);
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      highlights[i - 1] = 'active';
      labels[i - 1] = `p=${prob[i - 1]}`;

      steps.push({
        line: 6,
        explanation: `Coin ${i} (p=${prob[i - 1]}): dp[${i}][${target <= i ? target : i}]=${dp[i][Math.min(target, i)].toFixed(4)}. Include heads or tails contribution.`,
        variables: {
          coin: i,
          prob: prob[i - 1],
          'dp[i][target]': dp[i][Math.min(target, i)].toFixed(4),
          'P(0 heads so far)': dp[i][0].toFixed(4),
        },
        visualization: makeViz(highlights, labels),
      });
    }

    const result = dp[n][target];
    steps.push({
      line: 9,
      explanation: `dp[${n}][${target}]=${result.toFixed(6)}. Probability of exactly ${target} heads with all ${n} coins tossed.`,
      variables: { result: result.toFixed(6) },
      visualization: makeViz(
        Object.fromEntries(prob.map((_, i) => [i, 'found'])),
        { 0: `P=${result.toFixed(3)}` }
      ),
    });

    return steps;
  },
};

export default tossStrangeCoins;
