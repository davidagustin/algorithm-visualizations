import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumAsciiDeleteSumDp: AlgorithmDefinition = {
  id: 'minimum-ascii-delete-sum-dp',
  title: 'Minimum ASCII Delete Sum for Two Strings (DP)',
  leetcodeNumber: 712,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings s1 and s2, find the lowest ASCII sum of deleted characters to make them equal. dp[i][j] = min ASCII delete cost to make s1[0..i-1] == s2[0..j-1]. When chars match, no deletion; otherwise pick the cheaper deletion.',
  tags: ['dynamic programming', 'string', 'ascii', 'delete'],

  code: {
    pseudocode: `function minimumDeleteSum(s1, s2):
  m = len(s1), n = len(s2)
  dp[i][0] = sum of ASCII of s1[0..i-1]
  dp[0][j] = sum of ASCII of s2[0..j-1]
  for i in 1..m:
    for j in 1..n:
      if s1[i-1] == s2[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = min(dp[i-1][j] + ord(s1[i-1]),
                       dp[i][j-1] + ord(s2[j-1]))
  return dp[m][n]`,
    python: `def minimumDeleteSum(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1,m+1): dp[i][0]=dp[i-1][0]+ord(s1[i-1])
    for j in range(1,n+1): dp[0][j]=dp[0][j-1]+ord(s2[j-1])
    for i in range(1,m+1):
        for j in range(1,n+1):
            if s1[i-1]==s2[j-1]: dp[i][j]=dp[i-1][j-1]
            else: dp[i][j]=min(dp[i-1][j]+ord(s1[i-1]), dp[i][j-1]+ord(s2[j-1]))
    return dp[m][n]`,
    javascript: `function minimumDeleteSum(s1, s2) {
  const m=s1.length,n=s2.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=1;i<=m;i++) dp[i][0]=dp[i-1][0]+s1.charCodeAt(i-1);
  for(let j=1;j<=n;j++) dp[0][j]=dp[0][j-1]+s2.charCodeAt(j-1);
  for(let i=1;i<=m;i++)
    for(let j=1;j<=n;j++)
      if(s1[i-1]===s2[j-1]) dp[i][j]=dp[i-1][j-1];
      else dp[i][j]=Math.min(dp[i-1][j]+s1.charCodeAt(i-1),dp[i][j-1]+s2.charCodeAt(j-1));
  return dp[m][n];
}`,
    java: `public int minimumDeleteSum(String s1, String s2) {
    int m=s1.length(),n=s2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++) dp[i][0]=dp[i-1][0]+s1.charAt(i-1);
    for(int j=1;j<=n;j++) dp[0][j]=dp[0][j-1]+s2.charAt(j-1);
    for(int i=1;i<=m;i++)
        for(int j=1;j<=n;j++)
            if(s1.charAt(i-1)==s2.charAt(j-1)) dp[i][j]=dp[i-1][j-1];
            else dp[i][j]=Math.min(dp[i-1][j]+s1.charAt(i-1),dp[i][j-1]+s2.charAt(j-1));
    return dp[m][n];
}`,
  },

  defaultInput: {
    s1: 'sea',
    s2: 'eat',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String s1',
      type: 'string',
      defaultValue: 'sea',
      placeholder: 'sea',
      helperText: 'First string',
    },
    {
      name: 's2',
      label: 'String s2',
      type: 'string',
      defaultValue: 'eat',
      placeholder: 'eat',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const m = s1.length, n = s2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);

    steps.push({
      line: 2,
      explanation: `s1="${s1}", s2="${s2}". Base cases: cumulative ASCII sums for full deletions.`,
      variables: { s1, s2 },
      visualization: {
        type: 'array',
        array: dp[0].slice(0, n + 1),
        highlights: {},
        labels: { 0: 'dp[0][0]=0' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          steps.push({
            line: 7,
            explanation: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. No deletion: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n + 1),
              highlights: { [j]: 'found' },
              labels: { [j]: `${dp[i][j]}` },
            } as ArrayVisualization,
          });
        } else {
          const delS1 = dp[i - 1][j] + s1.charCodeAt(i - 1);
          const delS2 = dp[i][j - 1] + s2.charCodeAt(j - 1);
          dp[i][j] = Math.min(delS1, delS2);
          steps.push({
            line: 9,
            explanation: `s1[${i - 1}]='${s1[i - 1]}'(${s1.charCodeAt(i - 1)}) != s2[${j - 1}]='${s2[j - 1]}'(${s2.charCodeAt(j - 1)}). dp[${i}][${j}]=min(${delS1},${delS2})=${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
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
      line: 12,
      explanation: `Min ASCII delete sum = dp[${m}][${n}] = ${dp[m][n]}.`,
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

export default minimumAsciiDeleteSumDp;
