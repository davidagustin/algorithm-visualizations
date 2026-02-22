import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const regularExpressionMatchingDp: AlgorithmDefinition = {
  id: 'regular-expression-matching-dp',
  title: 'Regular Expression Matching (DP)',
  leetcodeNumber: 10,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Implement regular expression matching with "." (any char) and "*" (zero or more of preceding). dp[i][j] = true if s[0..i-1] matches p[0..j-1]. If p[j-1]=="*", use zero occurrences (dp[i][j-2]) or one more occurrence if chars match.',
  tags: ['dynamic programming', 'string', 'regex', 'recursion'],

  code: {
    pseudocode: `function isMatch(s, p):
  m = len(s), n = len(p)
  dp[0][0] = true
  for j in 1..n:
    if p[j-1] == '*': dp[0][j] = dp[0][j-2]
  for i in 1..m:
    for j in 1..n:
      if p[j-1] == '*':
        dp[i][j] = dp[i][j-2]  // zero occurrences
        if p[j-2] == '.' or p[j-2] == s[i-1]:
          dp[i][j] |= dp[i-1][j]  // one more
      elif p[j-1] == '.' or p[j-1] == s[i-1]:
        dp[i][j] = dp[i-1][j-1]
  return dp[m][n]`,
    python: `def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for j in range(1, n+1):
        if p[j-1] == '*': dp[0][j] = dp[0][j-2]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]
                if p[j-2] in ('.', s[i-1]):
                    dp[i][j] |= dp[i-1][j]
            elif p[j-1] in ('.', s[i-1]):
                dp[i][j] = dp[i-1][j-1]
    return dp[m][n]`,
    javascript: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++)
    if (p[j-1]==='*') dp[0][j] = dp[0][j-2];
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (p[j-1]==='*') {
        dp[i][j] = dp[i][j-2];
        if (p[j-2]==='.'||p[j-2]===s[i-1]) dp[i][j] |= dp[i-1][j];
      } else if (p[j-1]==='.'||p[j-1]===s[i-1]) dp[i][j]=dp[i-1][j-1];
  return dp[m][n];
}`,
    java: `public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m+1][n+1];
    dp[0][0] = true;
    for (int j = 1; j <= n; j++)
        if (p.charAt(j-1)=='*') dp[0][j] = dp[0][j-2];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (p.charAt(j-1)=='*') {
                dp[i][j] = dp[i][j-2];
                if (p.charAt(j-2)=='.'||p.charAt(j-2)==s.charAt(i-1)) dp[i][j]|=dp[i-1][j];
            } else if (p.charAt(j-1)=='.'||p.charAt(j-1)==s.charAt(i-1)) dp[i][j]=dp[i-1][j-1];
    return dp[m][n];
}`,
  },

  defaultInput: {
    s: 'aab',
    p: 'c*a*b',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'Input string (lowercase letters only)',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: 'c*a*b',
      placeholder: 'c*a*b',
      helperText: 'Regex pattern with . and *',
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
      if (p[j - 1] === '*' && j >= 2) dp[0][j] = dp[0][j - 2];
    }

    steps.push({
      line: 1,
      explanation: `s="${s}", p="${p}". dp[0][0]=true. Handle star patterns for empty string.`,
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
          dp[i][j] = dp[i][j - 2];
          if (j >= 2 && (p[j - 2] === '.' || p[j - 2] === s[i - 1])) {
            dp[i][j] = dp[i][j] || dp[i - 1][j];
          }
        } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        }

        steps.push({
          line: 7,
          explanation: `dp[${i}][${j}]: s[${i - 1}]='${s[i - 1]}', p[${j - 1}]='${p[j - 1]}'. dp[${i}][${j}]=${dp[i][j]}.`,
          variables: { i, j, char: s[i - 1], pattern: p[j - 1], 'dp[i][j]': dp[i][j] },
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
      line: 15,
      explanation: `Result = dp[${m}][${n}] = ${dp[m][n]}. Pattern ${dp[m][n] ? 'matches' : 'does not match'}.`,
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

export default regularExpressionMatchingDp;
