import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const strangePrinter: AlgorithmDefinition = {
  id: 'strange-printer',
  title: 'Strange Printer',
  leetcodeNumber: 664,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A strange printer can only print a sequence of the same character in one turn and can start a new turn from any position. Find the minimum number of turns to print a given string. Uses interval DP where dp[i][j] = min turns to print s[i..j]. Key insight: if s[i]==s[k], we can merge turns.',
  tags: ['dynamic programming', 'interval dp', 'string'],

  code: {
    pseudocode: `function strangePrinter(s):
  n = len(s)
  dp = 2D array n x n, initialized to 0
  for length from 1 to n:
    for i from 0 to n-length:
      j = i + length - 1
      dp[i][j] = dp[i+1][j] + 1  // print s[i] alone
      for k from i+1 to j:
        if s[k] == s[i]:
          dp[i][j] = min(dp[i][j], dp[i+1][k] + dp[k][j])
  return dp[0][n-1]`,

    python: `def strangePrinter(s):
    n = len(s)
    dp = [[0]*n for _ in range(n)]
    for length in range(1, n+1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = dp[i+1][j] + 1 if i < j else 1
            for k in range(i+1, j+1):
                if s[k] == s[i]:
                    dp[i][j] = min(dp[i][j],
                        (dp[i+1][k] if i+1<=k-1 else 0) + dp[k][j])
    return dp[0][n-1]`,

    javascript: `function strangePrinter(s) {
  const n = s.length;
  const dp = Array.from({length:n}, () => new Array(n).fill(0));
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = (i < j ? dp[i+1][j] : 0) + 1;
      for (let k = i+1; k <= j; k++) {
        if (s[k] === s[i]) {
          const left = (i+1 <= k-1) ? dp[i+1][k] : 0;
          dp[i][j] = Math.min(dp[i][j], left + dp[k][j]);
        }
      }
    }
  }
  return dp[0][n-1];
}`,

    java: `public int strangePrinter(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int len = 1; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = (i < j ? dp[i+1][j] : 0) + 1;
            for (int k = i+1; k <= j; k++) {
                if (s.charAt(k) == s.charAt(i)) {
                    int left = (i+1 <= k-1) ? dp[i+1][k] : 0;
                    dp[i][j] = Math.min(dp[i][j], left + dp[k][j]);
                }
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'aaabbb',
  },

  inputFields: [
    {
      name: 's',
      label: 'String to Print',
      type: 'string',
      defaultValue: 'aaabbb',
      placeholder: 'aaabbb',
      helperText: 'String consisting of lowercase letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    steps.push({
      line: 1,
      explanation: `Strange Printer on "${s}" (length ${n}). dp[i][j] = min turns to print s[i..j]. Fill by increasing interval length.`,
      variables: { s, n },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    const loggedRows: number[] = [];

    for (let len = 1; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = (i < j ? dp[i + 1][j] : 0) + 1;
        for (let k = i + 1; k <= j; k++) {
          if (s[k] === s[i]) {
            const left = i + 1 <= k - 1 ? dp[i + 1][k] : 0;
            dp[i][j] = Math.min(dp[i][j], left + dp[k][j]);
          }
        }
      }

      if (len <= 4 && !loggedRows.includes(len)) {
        loggedRows.push(len);
        const displayRow = dp[0].slice(0, n);
        steps.push({
          line: 5,
          explanation: `Interval length ${len}: computed dp[i][i+${len - 1}] for all i. For single chars, cost=1. Merge if s[k]==s[i].`,
          variables: { intervalLength: len, dp_0_to: dp[0][len - 1] },
          visualization: {
            type: 'array',
            array: displayRow,
            highlights: Object.fromEntries(
              Array.from({ length: n - len + 1 }, (_, i) => [i, 'active'])
            ),
            labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
          },
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum turns to print "${s}" is dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { answer: dp[0][n - 1] },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => dp[0][i]),
        highlights: { [n - 1]: 'found' },
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default strangePrinter;
