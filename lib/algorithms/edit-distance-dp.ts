import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const editDistanceDp: AlgorithmDefinition = {
  id: 'edit-distance-dp',
  title: 'Edit Distance (DP Visualization)',
  leetcodeNumber: 72,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2. Classic 2D DP: dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]. When characters match, no new cost; otherwise take 1 + min of insert/delete/replace.',
  tags: ['dynamic programming', 'string', 'edit distance', 'levenshtein'],

  code: {
    pseudocode: `function minDistance(word1, word2):
  m = len(word1), n = len(word2)
  dp[i][0] = i, dp[0][j] = j (base cases)
  for i in 1..m:
    for j in 1..n:
      if word1[i-1] == word2[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]`,
    python: `def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`,
    javascript: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (word1[i-1]===word2[j-1]) dp[i][j]=dp[i-1][j-1];
      else dp[i][j]=1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}`,
    java: `public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1.charAt(i-1)==word2.charAt(j-1)) dp[i][j]=dp[i-1][j-1];
            else dp[i][j]=1+Math.min(dp[i-1][j],Math.min(dp[i][j-1],dp[i-1][j-1]));
    return dp[m][n];
}`,
  },

  defaultInput: {
    word1: 'horse',
    word2: 'ros',
  },

  inputFields: [
    {
      name: 'word1',
      label: 'Word 1 (source)',
      type: 'string',
      defaultValue: 'horse',
      placeholder: 'horse',
      helperText: 'Source string',
    },
    {
      name: 'word2',
      label: 'Word 2 (target)',
      type: 'string',
      defaultValue: 'ros',
      placeholder: 'ros',
      helperText: 'Target string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const m = word1.length, n = word2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    steps.push({
      line: 2,
      explanation: `word1="${word1}", word2="${word2}". Base cases: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars).`,
      variables: { word1, word2, m, n },
      visualization: {
        type: 'array',
        array: dp[0],
        highlights: {},
        labels: { 0: 'base' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          steps.push({
            line: 6,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' == word2[${j - 1}]='${word2[j - 1]}'. No cost: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j], match: true },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'found' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          steps.push({
            line: 8,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' != word2[${j - 1}]='${word2[j - 1]}'. dp[${i}][${j}] = 1 + min(del=${dp[i - 1][j]}, ins=${dp[i][j - 1]}, rep=${dp[i - 1][j - 1]}) = ${dp[i][j]}.`,
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
      explanation: `Edit distance = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `ans=${dp[m][n]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default editDistanceDp;
