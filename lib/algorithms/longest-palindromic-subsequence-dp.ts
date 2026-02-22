import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestPalindromicSubsequenceDp: AlgorithmDefinition = {
  id: 'longest-palindromic-subsequence-dp',
  title: 'Longest Palindromic Subsequence (DP)',
  leetcodeNumber: 516,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the length of the longest palindromic subsequence in a string. dp[i][j] = LPS length in s[i..j]. If s[i]==s[j], dp[i][j] = dp[i+1][j-1] + 2. Otherwise dp[i][j] = max(dp[i+1][j], dp[i][j-1]). Fill diagonally from smaller to larger intervals.',
  tags: ['dynamic programming', 'string', 'palindrome', 'interval dp'],

  code: {
    pseudocode: `function longestPalindromeSubseq(s):
  n = len(s)
  dp[i][i] = 1 for all i
  for length in 2..n:
    for i in 0..n-length:
      j = i + length - 1
      if s[i] == s[j]:
        dp[i][j] = dp[i+1][j-1] + 2
      else:
        dp[i][j] = max(dp[i+1][j], dp[i][j-1])
  return dp[0][n-1]`,
    python: `def longestPalindromeSubseq(s: str) -> int:
    n = len(s)
    dp = [[0]*n for _ in range(n)]
    for i in range(n): dp[i][i] = 1
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i+length-1
            if s[i]==s[j]:
                dp[i][j] = (dp[i+1][j-1] if length>2 else 0) + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]`,
    javascript: `function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++)
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1;
      if (s[i]===s[j]) dp[i][j]=(len>2?dp[i+1][j-1]:0)+2;
      else dp[i][j]=Math.max(dp[i+1][j],dp[i][j-1]);
    }
  return dp[0][n-1];
}`,
    java: `public int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i <= n-len; i++) {
            int j = i+len-1;
            if (s.charAt(i)==s.charAt(j)) dp[i][j]=(len>2?dp[i+1][j-1]:0)+2;
            else dp[i][j]=Math.max(dp[i+1][j],dp[i][j-1]);
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
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) dp[i][i] = 1;

    steps.push({
      line: 2,
      explanation: `s="${s}" (length ${n}). Initialize dp[i][i]=1 (single chars are palindromes).`,
      variables: { s, n },
      visualization: {
        type: 'array',
        array: dp.map(row => row[row.length - 1] || 0),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        if (s[i] === s[j]) {
          dp[i][j] = (len > 2 ? dp[i + 1][j - 1] : 0) + 2;
          steps.push({
            line: 7,
            explanation: `s[${i}]='${s[i]}' == s[${j}]='${s[j]}'. dp[${i}][${j}] = ${len > 2 ? 'dp[' + (i + 1) + '][' + (j - 1) + ']=' + dp[i + 1][j - 1] : '0'} + 2 = ${dp[i][j]}.`,
            variables: { i, j, len, 'dp[i][j]': dp[i][j] },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => dp[i][idx] || 0),
              highlights: { [i]: 'found', [j]: 'found' },
              labels: { [i]: `i=${i}`, [j]: `LPS=${dp[i][j]}` },
            } as ArrayVisualization,
          });
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
          steps.push({
            line: 9,
            explanation: `s[${i}]='${s[i]}' != s[${j}]='${s[j]}'. dp[${i}][${j}] = max(dp[${i + 1}][${j}]=${dp[i + 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, len, 'dp[i][j]': dp[i][j] },
            visualization: {
              type: 'array',
              array: s.split('').map((_, idx) => dp[i][idx] || 0),
              highlights: { [i]: 'comparing', [j]: 'comparing' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Longest palindromic subsequence = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => dp[0][i] || 0),
        highlights: { [n - 1]: 'found' },
        labels: { [n - 1]: `LPS=${dp[0][n - 1]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestPalindromicSubsequenceDp;
