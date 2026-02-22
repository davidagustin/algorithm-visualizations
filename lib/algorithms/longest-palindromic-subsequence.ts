import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestPalindromicSubsequence: AlgorithmDefinition = {
  id: 'longest-palindromic-subsequence',
  title: 'Longest Palindromic Subsequence',
  leetcodeNumber: 516,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string s, find the length of the longest palindromic subsequence in s. A subsequence is a sequence derived by deleting some or no characters without changing the relative order. The DP approach compares the string against its reverse: dp[i][j] is the length of the longest palindromic subsequence in s[i..j]. If characters match, extend by 2; otherwise take the max of two subproblems.',
  tags: ['dp', 'string', 'palindrome', 'subsequence'],

  code: {
    pseudocode: `function longestPalindromeSubseq(s):
  n = len(s)
  dp = 2D array n x n, initialized to 0
  for i from 0 to n-1: dp[i][i] = 1  // single chars are palindromes
  for length from 2 to n:
    for i from 0 to n-length:
      j = i + length - 1
      if s[i] == s[j]:
        dp[i][j] = dp[i+1][j-1] + 2
      else:
        dp[i][j] = max(dp[i+1][j], dp[i][j-1])
  return dp[0][n-1]`,
    python: `def longestPalindromeSubseq(s: str) -> int:
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2 if length > 2 else 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]`,
    javascript: `function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        dp[i][j] = (len > 2 ? dp[i+1][j-1] : 0) + 2;
      } else {
        dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j)) {
                dp[i][j] = (len > 2 ? dp[i+1][j-1] : 0) + 2;
            } else {
                dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'bbbab',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'bbbab',
      placeholder: 'bbbab',
      helperText: 'Input string to find longest palindromic subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    const flatDP = (): number[] => dp.flat();
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
      explanation: `Start with string "${s}" of length ${n}. Initialize DP table.`,
      variables: { n, s },
      visualization: makeViz({}),
    });

    for (let i = 0; i < n; i++) {
      dp[i][i] = 1;
    }
    steps.push({
      line: 4,
      explanation: 'Set diagonal dp[i][i] = 1 since every single character is a palindrome of length 1.',
      variables: { diagonalSet: true },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i * n + i, 'found']))
      ),
    });

    for (let length = 2; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        const idx = i * n + j;
        if (s[i] === s[j]) {
          const inner = length > 2 ? dp[i + 1][j - 1] : 0;
          dp[i][j] = inner + 2;
          steps.push({
            line: 8,
            explanation: `s[${i}]='${s[i]}' == s[${j}]='${s[j]}'. Match! dp[${i}][${j}] = dp[${i + 1}][${j - 1}] + 2 = ${inner} + 2 = ${dp[i][j]}.`,
            variables: { i, j, length, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'found', [(i + 1) * n + (j - 1)]: 'comparing' }),
          });
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
          steps.push({
            line: 10,
            explanation: `s[${i}]='${s[i]}' != s[${j}]='${s[j]}'. Take max(dp[${i + 1}][${j}]=${dp[i + 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, length, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({
              [idx]: 'active',
              [(i + 1) * n + j]: 'comparing',
              [i * n + (j - 1)]: 'comparing',
            }),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Result: longest palindromic subsequence length = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz({ [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default longestPalindromicSubsequence;
