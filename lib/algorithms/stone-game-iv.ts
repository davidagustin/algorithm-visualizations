import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stoneGameIv: AlgorithmDefinition = {
  id: 'stone-game-iv',
  title: 'Stone Game IV',
  leetcodeNumber: 1510,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Alice and Bob take turns removing a perfect square number of stones from a pile. The player who cannot make a move loses. Alice goes first. Determine if Alice can guarantee a win. dp[i] = true if the current player wins with i stones remaining.',
  tags: ['dynamic programming', 'game theory', 'math', 'perfect squares'],

  code: {
    pseudocode: `function winnerSquareGame(n):
  dp = boolean array of size n+1, all false
  for i from 1 to n:
    j = 1
    while j*j <= i:
      if not dp[i - j*j]: dp[i] = true; break
      j = j + 1
  return dp[n]`,
    python: `def winnerSquareGame(n: int) -> bool:
    dp = [False] * (n + 1)
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            if not dp[i - j * j]:
                dp[i] = True
                break
            j += 1
    return dp[n]`,
    javascript: `function winnerSquareGame(n) {
  const dp = new Array(n + 1).fill(false);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      if (!dp[i - j * j]) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}`,
    java: `public boolean winnerSquareGame(int n) {
    boolean[] dp = new boolean[n + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j * j <= i; j++) {
            if (!dp[i - j * j]) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    n: 7,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N (number of stones)',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Number of stones in the pile',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const limit = Math.min(n, 12);

    const dpArr = new Array(limit + 1).fill(false);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.slice(0, limit + 1).map((v: boolean) => (v ? 1 : 0)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Stone Game IV with n=${n} stones. dp[i]=1 means current player wins with i stones. dp[i]=0 means they lose.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 2,
      explanation: 'dp[0]=false: no stones means current player cannot move, so they lose.',
      variables: { 'dp[0]': false },
      visualization: makeViz({ 0: 'mismatch' }, { 0: 'L' }),
    });

    for (let i = 1; i <= limit; i++) {
      let won = false;
      for (let j = 1; j * j <= i; j++) {
        if (!dpArr[i - j * j]) {
          dpArr[i] = true;
          won = true;
          steps.push({
            line: 5,
            explanation: `i=${i}: Remove ${j * j} stones (${j}^2). dp[${i - j * j}]=false means opponent is in a losing state. dp[${i}]=Win.`,
            variables: { i, 'square removed': j * j, 'dp[i]': true },
            visualization: makeViz(
              { [i]: 'found', [i - j * j]: 'comparing' },
              { [i]: 'W', [i - j * j]: 'L' }
            ),
          });
          break;
        }
      }
      if (!won) {
        steps.push({
          line: 3,
          explanation: `i=${i}: All perfect square moves lead to a winning state for opponent. dp[${i}]=Lose.`,
          variables: { i, 'dp[i]': false },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'L' }),
        });
      }
    }

    const result = dpArr[limit];
    steps.push({
      line: 7,
      explanation: `dp[${n >= limit ? limit : n}]=${result}. ${result ? 'Alice wins' : 'Bob wins'} with optimal play.`,
      variables: { n, result: result ? 'Alice wins' : 'Bob wins' },
      visualization: makeViz({ [limit]: result ? 'found' : 'mismatch' }, { [limit]: result ? 'W' : 'L' }),
    });

    return steps;
  },
};

export default stoneGameIv;
