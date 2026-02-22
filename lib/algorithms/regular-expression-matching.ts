import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const regularExpressionMatching: AlgorithmDefinition = {
  id: 'regular-expression-matching',
  title: 'Regular Expression Matching',
  leetcodeNumber: 10,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    "Given string s and pattern p with '.' (any char) and '*' (zero or more of preceding), determine if p matches s entirely. dp[i][j] = true if p[0..j-1] matches s[0..i-1]. Flattened 2D table for visualization.",
  tags: ['Dynamic Programming', 'String', 'Recursion'],
  code: {
    pseudocode: `function isMatch(s, p):
  dp[0][0] = true
  for j from 2 to len(p):
    if p[j-1] == '*': dp[0][j] = dp[0][j-2]
  for i from 1 to len(s):
    for j from 1 to len(p):
      if p[j-1] == '*':
        dp[i][j] = dp[i][j-2]  // zero occurrences
        if p[j-2] == '.' or p[j-2] == s[i-1]:
          dp[i][j] |= dp[i-1][j]  // one or more
      elif p[j-1]=='.' or p[j-1]==s[i-1]:
        dp[i][j] = dp[i-1][j-1]
  return dp[len(s)][len(p)]`,
    python: `def isMatch(s, p):
    m, n = len(s), len(p)
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for j in range(2, n+1):
        if p[j-1] == '*': dp[0][j] = dp[0][j-2]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]
                if p[j-2] in ('.', s[i-1]):
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    return dp[m][n]`,
    javascript: `function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j++)
    if (p[j-1] === '*') dp[0][j] = dp[0][j-2];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j-1] === '*') {
        dp[i][j] = dp[i][j-2];
        if (p[j-2] === '.' || p[j-2] === s[i-1])
          dp[i][j] = dp[i][j] || dp[i-1][j];
      } else if (p[j-1] === '.' || p[j-1] === s[i-1]) {
        dp[i][j] = dp[i-1][j-1];
      }
    }
  }
  return dp[m][n];
}`,
    java: `public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m+1][n+1];
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)
        if (p.charAt(j-1) == '*') dp[0][j] = dp[0][j-2];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '*') {
                dp[i][j] = dp[i][j-2];
                if (p.charAt(j-2) == '.' || p.charAt(j-2) == s.charAt(i-1))
                    dp[i][j] |= dp[i-1][j];
            } else if (p.charAt(j-1) == '.' || p.charAt(j-1) == s.charAt(i-1)) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { s: 'aab', p: 'c*a*b' },
  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'Input string (letters only)',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: 'c*a*b',
      placeholder: 'c*a*b',
      helperText: "Pattern with '.' and '*'",
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const m = s.length;
    const n = p.length;
    const steps: AlgorithmStep[] = [];

    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    const filled: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    const flatIdx = (i: number, j: number) => i * (n + 1) + j;
    const totalCells = (m + 1) * (n + 1);

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          arr.push(filled[i][j] ? (dp[i][j] ? 1 : 0) : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
          if (i === 0 && j === 0) labels.push('""');
          else if (i === 0) labels.push(p[j - 1]);
          else if (j === 0) labels.push(s[i - 1]);
          else labels.push(`(${i},${j})`);
        }
      }
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < totalCells; k++) {
        const i = Math.floor(k / (n + 1));
        const j = k % (n + 1);
        if (filled[i][j]) highlights[k] = dp[i][j] ? 'found' : 'mismatch';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Regex Matching: does pattern "${p}" match string "${s}"? Build ${m + 1}x${n + 1} DP table. dp[i][j]=1 means p[0..j-1] matches s[0..i-1].`,
      variables: { s, p, m, n },
      visualization: makeViz(null, []),
    });

    dp[0][0] = true;
    filled[0][0] = true;
    steps.push({
      line: 2,
      explanation: 'dp[0][0] = true. Empty pattern matches empty string.',
      variables: {},
      visualization: makeViz(flatIdx(0, 0), []),
    });

    // Base row: empty string vs pattern
    for (let j = 2; j <= n; j++) {
      filled[0][j] = true;
      if (p[j - 1] === '*') {
        dp[0][j] = dp[0][j - 2];
        steps.push({
          line: 3,
          explanation: `dp[0][${j}]: p[${j - 1}]='*' can match zero of '${p[j - 2]}'. dp[0][${j}] = dp[0][${j - 2}] = ${dp[0][j - 2]}.`,
          variables: { j, 'dp[0][j]': dp[0][j] },
          visualization: makeViz(flatIdx(0, j), [flatIdx(0, j - 2)]),
        });
      }
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const k = flatIdx(i, j);
        const comparing: number[] = [];

        if (p[j - 1] === '*') {
          comparing.push(flatIdx(i, j - 2));
          dp[i][j] = dp[i][j - 2];
          if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
            comparing.push(flatIdx(i - 1, j));
            dp[i][j] = dp[i][j] || dp[i - 1][j];
          }
          filled[i][j] = true;
          steps.push({
            line: 6,
            explanation: `dp[${i}][${j}]: p[${j - 1}]='*'. Zero '${p[j - 2]}': dp[${i}][${j - 2}]=${dp[i][j - 2]}. ${p[j - 2] === '.' || p[j - 2] === s[i - 1] ? `'${p[j - 2]}' matches s[${i - 1}]='${s[i - 1]}': also check dp[${i - 1}][${j}]=${dp[i - 1][j]}.` : ''} Result: ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(k, comparing),
          });
        } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          filled[i][j] = true;
          steps.push({
            line: 10,
            explanation: `dp[${i}][${j}]: p[${j - 1}]='${p[j - 1]}' matches s[${i - 1}]='${s[i - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(k, [flatIdx(i - 1, j - 1)]),
          });
        } else {
          dp[i][j] = false;
          filled[i][j] = true;
          steps.push({
            line: 10,
            explanation: `dp[${i}][${j}]: p[${j - 1}]='${p[j - 1]}' != s[${i - 1}]='${s[i - 1]}'. No match. dp[${i}][${j}] = false.`,
            variables: { i, j, 'dp[i][j]': false },
            visualization: makeViz(k, []),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `dp[${m}][${n}] = ${dp[m][n]}. Pattern "${p}" ${dp[m][n] ? 'MATCHES' : 'does NOT match'} string "${s}".`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => {
            const i = Math.floor(k / (n + 1));
            const j = k % (n + 1);
            if (k === flatIdx(m, n)) return [k, 'active'];
            if (filled[i][j]) return [k, dp[i][j] ? 'found' : 'mismatch'];
            return [k, 'default'];
          })
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default regularExpressionMatching;
