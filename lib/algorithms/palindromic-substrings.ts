import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const palindromicSubstrings: AlgorithmDefinition = {
  id: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  leetcodeNumber: 647,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string s, return the number of palindromic substrings in it. A substring is a contiguous sequence of characters within the string. The DP approach uses a 2D boolean table where dp[i][j] is true if s[i..j] is a palindrome. Single characters are always palindromes, pairs are palindromes when characters match, and longer substrings are palindromes when the endpoints match and the inner substring is a palindrome.',
  tags: ['dp', 'string', 'palindrome', 'substring'],

  code: {
    pseudocode: `function countSubstrings(s):
  n = len(s)
  dp = 2D boolean table n x n, all false
  count = 0
  for length from 1 to n:
    for i from 0 to n-length:
      j = i + length - 1
      if s[i] == s[j] and (length <= 2 or dp[i+1][j-1]):
        dp[i][j] = true
        count += 1
  return count`,
    python: `def countSubstrings(s: str) -> int:
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    count = 0
    for length in range(1, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length <= 2 or dp[i+1][j-1]):
                dp[i][j] = True
                count += 1
    return count`,
    javascript: `function countSubstrings(s) {
  const n = s.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(false));
  let count = 0;
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j] && (len <= 2 || dp[i+1][j-1])) {
        dp[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
    java: `public int countSubstrings(String s) {
    int n = s.length(), count = 0;
    boolean[][] dp = new boolean[n][n];
    for (int len = 1; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j) && (len <= 2 || dp[i+1][j-1])) {
                dp[i][j] = true;
                count++;
            }
        }
    }
    return count;
}`,
  },

  defaultInput: {
    s: 'aaa',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aaa',
      placeholder: 'aaa',
      helperText: 'Input string to count palindromic substrings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    let count = 0;

    const flatDP = (): number[] => dp.flat().map(v => (v ? 1 : 0));
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP table for string "${s}" of length ${n}. 1 means palindrome, 0 means not.`,
      variables: { n, count },
      visualization: makeViz({}),
    });

    for (let length = 1; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        const idx = i * n + j;
        const charsMatch = s[i] === s[j];
        const innerPalin = length <= 2 || dp[i + 1][j - 1];

        if (charsMatch && innerPalin) {
          dp[i][j] = true;
          count++;
          steps.push({
            line: 9,
            explanation: `s[${i}..${j}]="${s.slice(i, j + 1)}" is a palindrome (chars match: ${charsMatch}, inner ok: ${innerPalin}). count = ${count}.`,
            variables: { i, j, length, count, substring: s.slice(i, j + 1) },
            visualization: makeViz({ [idx]: 'found' }),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `s[${i}..${j}]="${s.slice(i, j + 1)}" is NOT a palindrome (chars match: ${charsMatch}, inner ok: ${innerPalin}).`,
            variables: { i, j, length, count, substring: s.slice(i, j + 1) },
            visualization: makeViz({ [idx]: 'mismatch' }),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Total palindromic substrings = ${count}.`,
      variables: { result: count },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default palindromicSubstrings;
