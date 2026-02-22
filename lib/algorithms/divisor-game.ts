import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const divisorGame: AlgorithmDefinition = {
  id: 'divisor-game',
  title: 'Divisor Game',
  leetcodeNumber: 1025,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Alice and Bob alternate turns. On each turn, the current player picks a divisor x of n where 0 < x < n, then replaces n with n-x. The player who cannot make a move loses. dp[i] = true if the current player wins with number i. Alice wins iff n is even.',
  tags: ['dynamic programming', 'game theory', 'math'],

  code: {
    pseudocode: `function divisorGame(n):
  dp = boolean array of size n+1
  dp[1] = false  // no valid x for n=1
  for i from 2 to n:
    for x from 1 to i-1:
      if i % x == 0 and not dp[i - x]:
        dp[i] = true
        break
  return dp[n]
// Math insight: Alice wins iff n is even`,
    python: `def divisorGame(n: int) -> bool:
    dp = [False] * (n + 1)
    for i in range(2, n + 1):
        for x in range(1, i):
            if i % x == 0 and not dp[i - x]:
                dp[i] = True
                break
    return dp[n]`,
    javascript: `function divisorGame(n) {
  const dp = new Array(n + 1).fill(false);
  for (let i = 2; i <= n; i++) {
    for (let x = 1; x < i; x++) {
      if (i % x === 0 && !dp[i - x]) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`,
    java: `public boolean divisorGame(int n) {
    boolean[] dp = new boolean[n + 1];
    for (int i = 2; i <= n; i++) {
        for (int x = 1; x < i; x++) {
            if (i % x == 0 && !dp[i - x]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    n: 6,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Starting Number',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Starting value of n in the game',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(n + 1).fill(false);

    const makeViz = (dpArr: boolean[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v ? 1 : 0)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0..${n}]. dp[i] = true means current player wins with n=i. dp[1] = false (no valid move).`,
      variables: { n },
      visualization: makeViz([...dp], { 1: 'mismatch' }),
    });

    for (let i = 2; i <= n; i++) {
      for (let x = 1; x < i; x++) {
        if (i % x === 0 && !dp[i - x]) {
          dp[i] = true;
          steps.push({
            line: 5,
            explanation: `n=${i}: pick x=${x} (divisor of ${i}), leaves ${i - x} where opponent loses. dp[${i}] = true (Win).`,
            variables: { i, x, 'i-x': i - x, 'dp[i]': true },
            visualization: makeViz([...dp], { [i]: 'found', [i - x]: 'mismatch' }),
          });
          break;
        }
      }
      if (!dp[i]) {
        steps.push({
          line: 5,
          explanation: `n=${i}: no winning move found. dp[${i}] = false (Lose).`,
          variables: { i, 'dp[i]': false },
          visualization: makeViz([...dp], { [i]: 'mismatch' }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `dp[${n}] = ${dp[n]}. Alice ${dp[n] ? 'wins' : 'loses'} the divisor game.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: dp[n] ? 'found' : 'mismatch' }),
    });

    return steps;
  },
};

export default divisorGame;
