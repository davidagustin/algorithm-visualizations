import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestCommonSubsequence: AlgorithmDefinition = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  leetcodeNumber: 1143,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings text1 and text2, find the length of their longest common subsequence. A subsequence is derived by deleting some characters without changing the order. We use a 2D DP table where dp[i][j] represents the LCS length of text1[0..i-1] and text2[0..j-1].',
  tags: ['Dynamic Programming', 'String'],
  code: {
    pseudocode: `function longestCommonSubsequence(text1, text2):
  m = length(text1), n = length(text2)
  dp = (m+1) x (n+1) matrix of 0s
  for i from 1 to m:
    for j from 1 to n:
      if text1[i-1] == text2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]`,
    python: `def longestCommonSubsequence(text1, text2):
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
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp[m][n];
}`,
    java: `public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { text1: 'abcde', text2: 'ace' },
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
    const m = text1.length;
    const n = text2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    // Visualize as array showing the current row of the DP table
    // with auxData showing the full 2D table state
    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      currentI: number,
      currentJ: number
    ): ArrayVisualization {
      // Show the flattened 2D table as array
      const arr: number[] = [];
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          arr.push(dp[i][j]);

      const flatIdx = (i: number, j: number) => i * (n + 1) + j;
      const baseHighlights: Record<number, string> = {};
      // Mark all filled cells
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          if (i > 0 && j > 0 && (i < currentI || (i === currentI && j <= currentJ)))
            baseHighlights[flatIdx(i, j)] = 'found';

      const baseLabels: Record<number, string> = {};
      // Header labels
      baseLabels[0] = ' ';
      for (let j = 1; j <= n; j++) baseLabels[j] = text2[j - 1];
      for (let i = 1; i <= m; i++) baseLabels[flatIdx(i, 0)] = text1[i - 1];

      return {
        type: 'array',
        array: arr,
        highlights: { ...baseHighlights, ...highlights },
        labels: { ...baseLabels, ...labels },
        auxData: {
          label: 'LCS Table',
          entries: [
            { key: 'text1', value: text1 },
            { key: 'text2', value: text2 },
            { key: 'Position', value: `(${currentI}, ${currentJ})` },
            ...Array.from({ length: m + 1 }, (_, i) => ({
              key: i === 0 ? `  ${['_', ...text2.split('')].join(' ')}` : `${text1[i - 1]} ${dp[i].join(' ')}`,
              value: '',
            })),
          ],
        },
      };
    }

    const flatIdx = (i: number, j: number) => i * (n + 1) + j;

    steps.push({
      line: 1,
      explanation: `Compare "${text1}" (length ${m}) with "${text2}" (length ${n}). Build a ${m + 1}x${n + 1} DP table initialized to 0.`,
      variables: { text1, text2, m, n },
      visualization: makeViz({}, {}, 0, n),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;

          steps.push({
            line: 6,
            explanation: `text1[${i - 1}]='${text1[i - 1]}' == text2[${j - 1}]='${text2[j - 1]}'. Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1 = ${dp[i][j]}.`,
            variables: { i, j, char: text1[i - 1], 'dp[i][j]': dp[i][j] },
            visualization: makeViz(
              { [flatIdx(i, j)]: 'match', [flatIdx(i - 1, j - 1)]: 'comparing' },
              {},
              i, j
            ),
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);

          steps.push({
            line: 8,
            explanation: `text1[${i - 1}]='${text1[i - 1]}' != text2[${j - 1}]='${text2[j - 1]}'. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(
              { [flatIdx(i, j)]: 'active', [flatIdx(i - 1, j)]: 'comparing', [flatIdx(i, j - 1)]: 'comparing' },
              {},
              i, j
            ),
          });
        }
      }
    }

    // Final
    steps.push({
      line: 9,
      explanation: `dp[${m}][${n}] = ${dp[m][n]}. The longest common subsequence of "${text1}" and "${text2}" has length ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: makeViz(
        { [flatIdx(m, n)]: 'active' },
        {},
        m, n
      ),
    });

    return steps;
  },
};

export default longestCommonSubsequence;
