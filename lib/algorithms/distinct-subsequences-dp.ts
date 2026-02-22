import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const distinctSubsequencesDp: AlgorithmDefinition = {
  id: 'distinct-subsequences-dp',
  title: 'Distinct Subsequences (DP)',
  leetcodeNumber: 115,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given strings s and t, return the number of distinct subsequences of s that equal t. dp[i][j] = number of ways to form t[0..j-1] from s[0..i-1]. When s[i-1]==t[j-1], we can use or skip the match: dp[i][j] = dp[i-1][j-1] + dp[i-1][j].',
  tags: ['dynamic programming', 'string', 'subsequence', 'counting'],

  code: {
    pseudocode: `function numDistinct(s, t):
  m = len(s), n = len(t)
  dp[i][0] = 1 for all i (empty t has one subsequence)
  dp[0][j] = 0 for j>0 (empty s can't match non-empty t)
  for i in 1..m:
    for j in 1..n:
      dp[i][j] = dp[i-1][j]  // skip s[i-1]
      if s[i-1] == t[j-1]:
        dp[i][j] += dp[i-1][j-1]  // use s[i-1]
  return dp[m][n]`,
    python: `def numDistinct(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = 1
    for i in range(1, m+1):
        for j in range(1, n+1):
            dp[i][j] = dp[i-1][j]
            if s[i-1] == t[j-1]:
                dp[i][j] += dp[i-1][j-1]
    return dp[m][n]`,
    javascript: `function numDistinct(s, t) {
  const m = s.length, n = t.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = 1;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      dp[i][j] = dp[i-1][j];
      if (s[i-1]===t[j-1]) dp[i][j]+=dp[i-1][j-1];
    }
  return dp[m][n];
}`,
    java: `public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();
    long[][] dp = new long[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = 1;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j];
            if (s.charAt(i-1)==t.charAt(j-1)) dp[i][j]+=dp[i-1][j-1];
        }
    return (int)dp[m][n];
}`,
  },

  defaultInput: {
    s: 'rabbbit',
    t: 'rabbit',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s (source)',
      type: 'string',
      defaultValue: 'rabbbit',
      placeholder: 'rabbbit',
      helperText: 'Source string',
    },
    {
      name: 't',
      label: 'String t (target)',
      type: 'string',
      defaultValue: 'rabbit',
      placeholder: 'rabbit',
      helperText: 'Target subsequence string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const m = s.length, n = t.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = 1;

    steps.push({
      line: 2,
      explanation: `s="${s}", t="${t}". dp[i][0]=1 (empty t has 1 match). dp[0][j>0]=0 (empty s, no match).`,
      variables: { s, t, m, n },
      visualization: {
        type: 'array',
        array: dp[0].slice(0, n + 1),
        highlights: { 0: 'found' },
        labels: { 0: '1' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = dp[i - 1][j];
        if (s[i - 1] === t[j - 1]) {
          dp[i][j] += dp[i - 1][j - 1];
          steps.push({
            line: 8,
            explanation: `s[${i - 1}]='${s[i - 1]}' == t[${j - 1}]='${t[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j}] + dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: true },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'found' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        } else {
          steps.push({
            line: 6,
            explanation: `s[${i - 1}]='${s[i - 1]}' != t[${j - 1}]='${t[j - 1]}'. Skip: dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: false },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'comparing' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Distinct subsequences = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `ans=${dp[m][n]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default distinctSubsequencesDp;
