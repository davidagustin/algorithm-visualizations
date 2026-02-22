import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const distinctSubsequences: AlgorithmDefinition = {
  id: 'distinct-subsequences',
  title: 'Distinct Subsequences',
  leetcodeNumber: 115,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given strings s and t, return the number of distinct subsequences of s which equals t. A DP table dp[i][j] counts the number of ways to form t[0..j-1] using s[0..i-1]. If characters match, we can either use s[i-1] (adding dp[i-1][j-1] ways) or skip it (adding dp[i-1][j] ways). If they do not match, we can only skip s[i-1].',
  tags: ['dp', 'string', 'subsequence', 'counting'],

  code: {
    pseudocode: `function numDistinct(s, t):
  m = len(s), n = len(t)
  dp = 2D array (m+1) x (n+1), all 0
  for i from 0 to m: dp[i][0] = 1  // empty t matched by any prefix
  for i from 1 to m:
    for j from 1 to n:
      dp[i][j] = dp[i-1][j]  // skip s[i-1]
      if s[i-1] == t[j-1]:
        dp[i][j] += dp[i-1][j-1]  // use s[i-1]
  return dp[m][n]`,
    python: `def numDistinct(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = 1
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j]
            if s[i-1] == t[j-1]:
                dp[i][j] += dp[i-1][j-1]
    return dp[m][n]`,
    javascript: `function numDistinct(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = 1;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i-1][j];
      if (s[i-1] === t[j-1]) dp[i][j] += dp[i-1][j-1];
    }
  }
  return dp[m][n];
}`,
    java: `public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();
    long[][] dp = new long[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = 1;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j];
            if (s.charAt(i-1) == t.charAt(j-1)) dp[i][j] += dp[i-1][j-1];
        }
    }
    return (int) dp[m][n];
}`,
  },

  defaultInput: {
    s: 'rabbbit',
    t: 'rabbit',
  },

  inputFields: [
    {
      name: 's',
      label: 'Source String (s)',
      type: 'string',
      defaultValue: 'rabbbit',
      placeholder: 'rabbbit',
      helperText: 'The source string',
    },
    {
      name: 't',
      label: 'Target String (t)',
      type: 'string',
      defaultValue: 'rabbit',
      placeholder: 'rabbit',
      helperText: 'The target string to match as subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];
    const m = s.length;
    const n = t.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: (m + 1) * (n + 1) }, (_, k) => {
        const r = Math.floor(k / (n + 1));
        const c = k % (n + 1);
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP for s="${s}" and t="${t}". dp[i][j] = ways to form t[0..j-1] from s[0..i-1].`,
      variables: { m, n },
      visualization: makeViz({}),
    });

    for (let i = 0; i <= m; i++) {
      dp[i][0] = 1;
    }
    steps.push({
      line: 4,
      explanation: 'Set dp[i][0] = 1 for all i: empty target t can always be matched by deleting everything.',
      variables: { baseCaseSet: true },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: m + 1 }, (_, i) => [i * (n + 1), 'found']))
      ),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const idx = i * (n + 1) + j;
        dp[i][j] = dp[i - 1][j];
        if (s[i - 1] === t[j - 1]) {
          dp[i][j] += dp[i - 1][j - 1];
          steps.push({
            line: 8,
            explanation: `s[${i - 1}]='${s[i - 1]}' matches t[${j - 1}]='${t[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i - 1}][${j - 1}] = ${dp[i - 1][j]} + ${dp[i - 1][j - 1]} = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({
              [idx]: 'found',
              [(i - 1) * (n + 1) + j]: 'comparing',
              [(i - 1) * (n + 1) + (j - 1)]: 'comparing',
            }),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `s[${i - 1}]='${s[i - 1]}' != t[${j - 1}]='${t[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'active', [(i - 1) * (n + 1) + j]: 'comparing' }),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Result: dp[${m}][${n}] = ${dp[m][n]} distinct subsequences.`,
      variables: { result: dp[m][n] },
      visualization: makeViz({ [m * (n + 1) + n]: 'found' }),
    });

    return steps;
  },
};

export default distinctSubsequences;
