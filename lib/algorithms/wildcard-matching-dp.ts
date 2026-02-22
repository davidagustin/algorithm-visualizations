import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wildcardMatchingDp: AlgorithmDefinition = {
  id: 'wildcard-matching-dp',
  title: 'Wildcard Matching (DP)',
  leetcodeNumber: 44,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given string s and pattern p with "?" (single char) and "*" (any sequence including empty), determine if they match. dp[i][j] = true if s[0..i-1] matches p[0..j-1]. "*" can match empty (dp[i][j-1]) or extend (dp[i-1][j]).',
  tags: ['dynamic programming', 'string', 'wildcard', 'greedy'],

  code: {
    pseudocode: `function isMatch(s, p):
  m = len(s), n = len(p)
  dp[0][0] = true
  for j in 1..n:
    if p[j-1] == '*': dp[0][j] = dp[0][j-1]
  for i in 1..m:
    for j in 1..n:
      if p[j-1] == '*':
        dp[i][j] = dp[i][j-1] or dp[i-1][j]
      elif p[j-1] == '?' or p[j-1] == s[i-1]:
        dp[i][j] = dp[i-1][j-1]
  return dp[m][n]`,
    python: `def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for j in range(1, n+1):
        if p[j-1] == '*': dp[0][j] = dp[0][j-1]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-1] or dp[i-1][j]
            elif p[j-1] in ('?', s[i-1]):
                dp[i][j] = dp[i-1][j-1]
    return dp[m][n]`,
    javascript: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++)
    if (p[j-1]==='*') dp[0][j] = dp[0][j-1];
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (p[j-1]==='*') dp[i][j] = dp[i][j-1]||dp[i-1][j];
      else if (p[j-1]==='?'||p[j-1]===s[i-1]) dp[i][j]=dp[i-1][j-1];
  return dp[m][n];
}`,
    java: `public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m+1][n+1];
    dp[0][0] = true;
    for (int j = 1; j <= n; j++)
        if (p.charAt(j-1)=='*') dp[0][j]=dp[0][j-1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (p.charAt(j-1)=='*') dp[i][j]=dp[i][j-1]||dp[i-1][j];
            else if (p.charAt(j-1)=='?'||p.charAt(j-1)==s.charAt(i-1)) dp[i][j]=dp[i-1][j-1];
    return dp[m][n];
}`,
  },

  defaultInput: {
    s: 'adceb',
    p: '*a*b',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'adceb',
      placeholder: 'adceb',
      helperText: 'Input string',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: '*a*b',
      placeholder: '*a*b',
      helperText: 'Wildcard pattern with ? and *',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const m = s.length, n = p.length;
    const steps: AlgorithmStep[] = [];

    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];
    }

    steps.push({
      line: 1,
      explanation: `s="${s}", p="${p}". Base case dp[0][0]=true. Stars can match empty: dp[0][j] from dp[0][j-1].`,
      variables: { s, p, m, n },
      visualization: {
        type: 'array',
        array: dp[0].map(v => (v ? 1 : 0)),
        highlights: { 0: 'found' },
        labels: { 0: 'T' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') {
          dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
        } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        }

        steps.push({
          line: 7,
          explanation: `dp[${i}][${j}]: s[${i - 1}]='${s[i - 1]}', p[${j - 1}]='${p[j - 1]}'. dp[${i}][${j}]=${dp[i][j]}.`,
          variables: { i, j, 'dp[i][j]': dp[i][j] },
          visualization: {
            type: 'array',
            array: dp[i].map(v => (v ? 1 : 0)),
            highlights: { [j]: dp[i][j] ? 'found' : 'mismatch' },
            labels: { [j]: dp[i][j] ? 'T' : 'F' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Result = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].map(v => (v ? 1 : 0)),
        highlights: { [n]: dp[m][n] ? 'found' : 'mismatch' },
        labels: { [n]: dp[m][n] ? 'MATCH' : 'NO' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default wildcardMatchingDp;
