import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stoneGameIii: AlgorithmDefinition = {
  id: 'stone-game-iii',
  title: 'Stone Game III',
  leetcodeNumber: 1406,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Alice and Bob take turns picking 1, 2, or 3 stones from the front of a row of piles. The person who collects the most total stones wins. Alice goes first. Both play optimally. Return "Alice", "Bob", or "Tie". Uses DP where dp[i] = max score advantage the current player can gain starting from index i.',
  tags: ['dynamic programming', 'game theory', 'minimax'],

  code: {
    pseudocode: `function stoneGameIII(stoneValue):
  n = len(stoneValue)
  dp = array of size n+1, dp[n] = 0
  for i from n-1 downto 0:
    dp[i] = -infinity
    take = 0
    for k from 1 to 3:
      if i+k-1 < n: take += stoneValue[i+k-1]
      dp[i] = max(dp[i], take - dp[i+k])
  if dp[0] > 0: return "Alice"
  if dp[0] < 0: return "Bob"
  return "Tie"`,
    python: `def stoneGameIII(stoneValue):
    n = len(stoneValue)
    dp = [float('-inf')] * (n + 1)
    dp[n] = 0
    for i in range(n - 1, -1, -1):
        take = 0
        for k in range(1, 4):
            if i + k - 1 < n:
                take += stoneValue[i + k - 1]
                dp[i] = max(dp[i], take - dp[i + k])
    if dp[0] > 0: return "Alice"
    if dp[0] < 0: return "Bob"
    return "Tie"`,
    javascript: `function stoneGameIII(stoneValue) {
  const n = stoneValue.length;
  const dp = new Array(n + 1).fill(-Infinity);
  dp[n] = 0;
  for (let i = n - 1; i >= 0; i--) {
    let take = 0;
    for (let k = 1; k <= 3; k++) {
      if (i + k - 1 < n) {
        take += stoneValue[i + k - 1];
        dp[i] = Math.max(dp[i], take - dp[i + k]);
      }
    }
  }
  if (dp[0] > 0) return "Alice";
  if (dp[0] < 0) return "Bob";
  return "Tie";
}`,
    java: `public String stoneGameIII(int[] stoneValue) {
    int n = stoneValue.length;
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MIN_VALUE);
    dp[n] = 0;
    for (int i = n - 1; i >= 0; i--) {
        int take = 0;
        for (int k = 1; k <= 3; k++) {
            if (i + k - 1 < n) {
                take += stoneValue[i + k - 1];
                dp[i] = Math.max(dp[i], take - dp[i + k]);
            }
        }
    }
    if (dp[0] > 0) return "Alice";
    if (dp[0] < 0) return "Bob";
    return "Tie";
}`,
  },

  defaultInput: {
    stoneValue: [1, 2, 3, 7],
  },

  inputFields: [
    {
      name: 'stoneValue',
      label: 'Stone Values',
      type: 'array',
      defaultValue: [1, 2, 3, 7],
      placeholder: '1,2,3,7',
      helperText: 'Comma-separated stone values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stoneValue = input.stoneValue as number[];
    const steps: AlgorithmStep[] = [];
    const n = stoneValue.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...stoneValue],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Stone Game III: stones=[${stoneValue.join(', ')}]. Each player picks 1-3 stones from the front optimally.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    const dp = new Array(n + 1).fill(-Infinity);
    dp[n] = 0;

    steps.push({
      line: 3,
      explanation: 'Initialize dp[n]=0 (base case: no stones left means 0 advantage). dp[i] = score advantage current player gets from index i.',
      variables: { 'dp[n]': 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = n - 1; i >= 0; i--) {
      let take = 0;
      for (let k = 1; k <= 3; k++) {
        if (i + k - 1 < n) {
          take += stoneValue[i + k - 1];
          const val = take - dp[i + k];
          if (val > dp[i]) dp[i] = val;
        }
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let k = 0; k < Math.min(3, n - i); k++) {
        highlights[i + k] = k === 0 ? 'active' : 'comparing';
        labels[i + k] = `pick${k + 1}`;
      }

      steps.push({
        line: 7,
        explanation: `dp[${i}]=${dp[i]}. From index ${i}, current player gains ${dp[i]} more stones than opponent optimally.`,
        variables: { i, 'dp[i]': dp[i], 'best take': take },
        visualization: makeViz(highlights, labels),
      });
    }

    let winner: string;
    if (dp[0] > 0) winner = 'Alice';
    else if (dp[0] < 0) winner = 'Bob';
    else winner = 'Tie';

    steps.push({
      line: 11,
      explanation: `dp[0]=${dp[0]}. ${dp[0] > 0 ? 'Alice wins' : dp[0] < 0 ? 'Bob wins' : 'It is a Tie'}. Result: "${winner}".`,
      variables: { 'dp[0]': dp[0], winner },
      visualization: makeViz({ 0: 'found' }, { 0: winner }),
    });

    return steps;
  },
};

export default stoneGameIii;
