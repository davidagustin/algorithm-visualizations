import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const knightDialerII: AlgorithmDefinition = {
  id: 'knight-dialer-ii',
  title: 'Knight Dialer',
  leetcodeNumber: 935,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count distinct phone numbers of length n a knight can dial starting from any digit (0-9) on a phone keypad. Knight moves follow chess rules. dp[i][d] = ways to form numbers of length i ending at digit d. Transition via knight jumps.',
  tags: ['Dynamic Programming', 'State Machine', 'Graph'],
  code: {
    pseudocode: `function knightDialer(n):
  MOD = 1e9+7
  moves = {0:[4,6], 1:[6,8], 2:[7,9], 3:[4,8], 4:[0,3,9],
           5:[], 6:[0,1,7], 7:[2,6], 8:[1,3], 9:[2,4]}
  dp = [1]*10  // length 1: 1 way per digit
  for i from 2 to n:
    ndp = [0]*10
    for d in 0..9:
      for neighbor in moves[d]:
        ndp[neighbor] += dp[d]
    dp = ndp
  return sum(dp) % MOD`,
    python: `def knightDialer(n):
    MOD = 10**9 + 7
    moves = {0:[4,6],1:[6,8],2:[7,9],3:[4,8],4:[0,3,9],
             5:[],6:[0,1,7],7:[2,6],8:[1,3],9:[2,4]}
    dp = [1]*10
    for _ in range(n - 1):
        ndp = [0]*10
        for d in range(10):
            for nb in moves[d]:
                ndp[nb] = (ndp[nb] + dp[d]) % MOD
        dp = ndp
    return sum(dp) % MOD`,
    javascript: `function knightDialer(n) {
  const MOD = 1000000007;
  const moves = [[4,6],[6,8],[7,9],[4,8],[0,3,9],[],[0,1,7],[2,6],[1,3],[2,4]];
  let dp = new Array(10).fill(1);
  for (let i = 1; i < n; i++) {
    const ndp = new Array(10).fill(0);
    for (let d = 0; d < 10; d++)
      for (const nb of moves[d])
        ndp[nb] = (ndp[nb] + dp[d]) % MOD;
    dp = ndp;
  }
  return dp.reduce((s, v) => (s + v) % MOD, 0);
}`,
    java: `public int knightDialer(int n) {
    int MOD = 1_000_000_007;
    int[][] moves = {{4,6},{6,8},{7,9},{4,8},{0,3,9},{},{0,1,7},{2,6},{1,3},{2,4}};
    long[] dp = new long[10];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        long[] ndp = new long[10];
        for (int d = 0; d < 10; d++)
            for (int nb : moves[d])
                ndp[nb] = (ndp[nb] + dp[d]) % MOD;
        dp = ndp;
    }
    long ans = 0;
    for (long v : dp) ans = (ans + v) % MOD;
    return (int) ans;
}`,
  },
  defaultInput: { n: 3 },
  inputFields: [
    {
      name: 'n',
      label: 'Number Length (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Length of phone numbers to count',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];
    const moves: number[][] = [[4, 6], [6, 8], [7, 9], [4, 8], [0, 3, 9], [], [0, 1, 7], [2, 6], [1, 3], [2, 4]];
    let dp: number[] = new Array(10).fill(1);
    const labels: string[] = Array.from({ length: 10 }, (_, i) => `d${i}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < 10; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `n=${n}. Initialize dp=[1,1,...,1]: 1 way to be at each digit for length-1 numbers.`,
      variables: { n, dp: dp.slice() },
      visualization: makeViz(-1),
    });

    for (let i = 1; i < n; i++) {
      const ndp: number[] = new Array(10).fill(0);
      for (let d = 0; d < 10; d++) {
        for (const nb of moves[d]) {
          ndp[nb] = (ndp[nb] + dp[d]) % MOD;
        }
      }
      dp = ndp;
      const total = dp.reduce((s, v) => (s + v) % MOD, 0);

      steps.push({
        line: 7,
        explanation: `Length ${i + 1}: total=${total} ways. dp updated via knight jump transitions.`,
        variables: { length: i + 1, total },
        visualization: makeViz(-1),
      });
    }

    const result = dp.reduce((s, v) => (s + v) % MOD, 0);
    steps.push({
      line: 9,
      explanation: `Answer = sum(dp) = ${result}. Total distinct numbers of length ${n} a knight can dial.`,
      variables: { result },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default knightDialerII;
