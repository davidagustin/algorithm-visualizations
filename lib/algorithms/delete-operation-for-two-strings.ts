import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deleteOperationForTwoStrings: AlgorithmDefinition = {
  id: 'delete-operation-for-two-strings',
  title: 'Delete Operation for Two Strings',
  leetcodeNumber: 583,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same. In each step you can delete exactly one character in either string. The answer equals len(word1) + len(word2) - 2 * LCS(word1, word2).',
  tags: ['dynamic programming', 'string', 'lcs'],

  code: {
    pseudocode: `function minDistance(word1, word2):
  m = len(word1), n = len(word2)
  dp[i][j] = LCS length of word1[0..i-1] and word2[0..j-1]
  for i in 1..m:
    for j in 1..n:
      if word1[i-1] == word2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  lcs = dp[m][n]
  return m + n - 2 * lcs`,
    python: `def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return m + n - 2 * dp[m][n]`,
    javascript: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return m + n - 2 * dp[m][n];
}`,
    java: `public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1.charAt(i-1) == word2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    return m + n - 2 * dp[m][n];
}`,
  },

  defaultInput: {
    word1: 'sea',
    word2: 'eat',
  },

  inputFields: [
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'sea',
      placeholder: 'sea',
      helperText: 'First string',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'eat',
      placeholder: 'eat',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const steps: AlgorithmStep[] = [];
    const m = word1.length;
    const n = word2.length;

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    steps.push({
      line: 1,
      explanation: `Start: word1="${word1}" (len=${m}), word2="${word2}" (len=${n}). Build LCS DP table.`,
      variables: { word1, word2, m, n },
      visualization: {
        type: 'array',
        array: dp[0],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({
            line: 6,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' == word2[${j - 1}]='${word2[j - 1]}'. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: true },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'found' },
              labels: { [j]: `dp[${i}][${j}]` },
            } as ArrayVisualization,
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            line: 8,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' != word2[${j - 1}]='${word2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: false },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'comparing' },
              labels: { [j]: `dp[${i}][${j}]` },
            } as ArrayVisualization,
          });
        }
      }
    }

    const lcs = dp[m][n];
    const result = m + n - 2 * lcs;
    steps.push({
      line: 10,
      explanation: `LCS = ${lcs}. Min deletions = ${m} + ${n} - 2*${lcs} = ${result}.`,
      variables: { lcs, m, n, result },
      visualization: {
        type: 'array',
        array: dp[m].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `LCS=${lcs}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default deleteOperationForTwoStrings;
