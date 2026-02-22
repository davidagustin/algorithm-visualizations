import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromicSubstringsDp: AlgorithmDefinition = {
  id: 'palindromic-substrings-dp',
  title: 'Palindromic Substrings (DP)',
  leetcodeNumber: 647,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count all palindromic substrings in a string. dp[i][j] = true if s[i..j] is a palindrome. A substring is palindromic if s[i]==s[j] and dp[i+1][j-1] is true (or length <= 2). Fill from shorter to longer substrings.',
  tags: ['dynamic programming', 'string', 'palindrome', 'counting'],

  code: {
    pseudocode: `function countSubstrings(s):
  n = len(s), count = 0
  dp[i][j] = true if s[i..j] is palindrome
  for i from n-1 to 0:
    dp[i][i] = true, count++
    for j from i+1 to n-1:
      if s[i]==s[j] and (j-i<=2 or dp[i+1][j-1]):
        dp[i][j] = true, count++
  return count`,
    python: `def countSubstrings(s: str) -> int:
    n, count = len(s), 0
    dp = [[False]*n for _ in range(n)]
    for i in range(n-1, -1, -1):
        for j in range(i, n):
            if s[i]==s[j] and (j-i<=2 or dp[i+1][j-1]):
                dp[i][j] = True
                count += 1
    return count`,
    javascript: `function countSubstrings(s) {
  const n = s.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(false));
  let count = 0;
  for (let i = n-1; i >= 0; i--)
    for (let j = i; j < n; j++)
      if (s[i]===s[j]&&(j-i<=2||dp[i+1][j-1])) {
        dp[i][j]=true; count++;
      }
  return count;
}`,
    java: `public int countSubstrings(String s) {
    int n = s.length(), count = 0;
    boolean[][] dp = new boolean[n][n];
    for (int i = n-1; i >= 0; i--)
        for (int j = i; j < n; j++)
            if (s.charAt(i)==s.charAt(j)&&(j-i<=2||dp[i+1][j-1])) {
                dp[i][j]=true; count++;
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
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    let count = 0;

    steps.push({
      line: 1,
      explanation: `s="${s}" (length ${n}). Will fill dp[i][j]=true if s[i..j] is palindrome. count starts at 0.`,
      variables: { s, n, count },
      visualization: {
        type: 'array',
        array: s.split('').map(c => c.charCodeAt(0) - 96),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = n - 1; i >= 0; i--) {
      for (let j = i; j < n; j++) {
        if (s[i] === s[j] && (j - i <= 2 || dp[i + 1][j - 1])) {
          dp[i][j] = true;
          count++;
          steps.push({
            line: 6,
            explanation: `s[${i}..${j}]="${s.slice(i, j + 1)}" is a palindrome. count=${count}.`,
            variables: { i, j, substring: s.slice(i, j + 1), count },
            visualization: {
              type: 'array',
              array: s.split('').map(c => c.charCodeAt(0) - 96),
              highlights: Object.fromEntries(
                Array.from({ length: j - i + 1 }, (_, k) => [i + k, 'found'])
              ),
              labels: { [i]: `i=${i}`, [j]: `j=${j}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Total palindromic substrings = ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: s.split('').map(c => c.charCodeAt(0) - 96),
        highlights: {},
        labels: { 0: `count=${count}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default palindromicSubstringsDp;
