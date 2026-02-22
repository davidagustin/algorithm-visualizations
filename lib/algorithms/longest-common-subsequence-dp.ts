import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestCommonSubsequenceDp: AlgorithmDefinition = {
  id: 'longest-common-subsequence-dp',
  title: 'Longest Common Subsequence (DP)',
  leetcodeNumber: 1143,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Find the length of the longest common subsequence (LCS) of two strings. dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]. When characters match, extend the diagonal; otherwise take the max of skipping one character from either string.',
  tags: ['dynamic programming', 'string', 'lcs', 'classic'],

  code: {
    pseudocode: `function longestCommonSubsequence(text1, text2):
  m = len(text1), n = len(text2)
  dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
  for i in 1..m:
    for j in 1..n:
      if text1[i-1] == text2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]`,
    python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (text1[i-1]===text2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
      else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
  return dp[m][n];
}`,
    java: `public int longestCommonSubsequence(String text1, String text2) {
    int m=text1.length(),n=text2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++)
        for(int j=1;j<=n;j++)
            if(text1.charAt(i-1)==text2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;
            else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    return dp[m][n];
}`,
  },

  defaultInput: {
    text1: 'abcde',
    text2: 'ace',
  },

  inputFields: [
    {
      name: 'text1',
      label: 'Text 1',
      type: 'string',
      defaultValue: 'abcde',
      placeholder: 'abcde',
      helperText: 'First string',
    },
    {
      name: 'text2',
      label: 'Text 2',
      type: 'string',
      defaultValue: 'ace',
      placeholder: 'ace',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text1 = input.text1 as string;
    const text2 = input.text2 as string;
    const m = text1.length, n = text2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      line: 1,
      explanation: `text1="${text1}", text2="${text2}". Build LCS DP table. dp[i][j]=LCS of text1[0..i-1] and text2[0..j-1].`,
      variables: { text1, text2, m, n },
      visualization: {
        type: 'array',
        array: dp[0].slice(0, n + 1),
        highlights: {},
        labels: { 0: 'dp[0][0]=0' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({
            line: 6,
            explanation: `text1[${i - 1}]='${text1[i - 1]}' == text2[${j - 1}]='${text2[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}]+1 = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: true },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'found' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            line: 8,
            explanation: `text1[${i - 1}]='${text1[i - 1]}' != text2[${j - 1}]='${text2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
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
      line: 9,
      explanation: `LCS length = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `LCS=${dp[m][n]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestCommonSubsequenceDp;
