import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const interleavingStringDp: AlgorithmDefinition = {
  id: 'interleaving-string-dp',
  title: 'Interleaving String (DP)',
  leetcodeNumber: 97,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given strings s1, s2, s3, determine whether s3 is formed by interleaving s1 and s2. dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]. Transition uses last char from s1 or s2.',
  tags: ['dynamic programming', 'string', 'interleaving'],

  code: {
    pseudocode: `function isInterleave(s1, s2, s3):
  m=len(s1), n=len(s2)
  if m+n != len(s3): return false
  dp[i][j] = true if s3[0..i+j-1] = interleave(s1[0..i-1], s2[0..j-1])
  dp[0][0] = true
  for i: dp[i][0] = dp[i-1][0] and s1[i-1]==s3[i-1]
  for j: dp[0][j] = dp[0][j-1] and s2[j-1]==s3[j-1]
  for i,j:
    dp[i][j] = (dp[i-1][j] and s1[i-1]==s3[i+j-1]) or
               (dp[i][j-1] and s2[j-1]==s3[i+j-1])
  return dp[m][n]`,
    python: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    m, n = len(s1), len(s2)
    if m+n != len(s3): return False
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for i in range(1,m+1): dp[i][0]=dp[i-1][0] and s1[i-1]==s3[i-1]
    for j in range(1,n+1): dp[0][j]=dp[0][j-1] and s2[j-1]==s3[j-1]
    for i in range(1,m+1):
        for j in range(1,n+1):
            dp[i][j]=(dp[i-1][j] and s1[i-1]==s3[i+j-1]) or \
                     (dp[i][j-1] and s2[j-1]==s3[i+j-1])
    return dp[m][n]`,
    javascript: `function isInterleave(s1, s2, s3) {
  const m=s1.length,n=s2.length;
  if(m+n!==s3.length) return false;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(false));
  dp[0][0]=true;
  for(let i=1;i<=m;i++) dp[i][0]=dp[i-1][0]&&s1[i-1]===s3[i-1];
  for(let j=1;j<=n;j++) dp[0][j]=dp[0][j-1]&&s2[j-1]===s3[j-1];
  for(let i=1;i<=m;i++)
    for(let j=1;j<=n;j++)
      dp[i][j]=(dp[i-1][j]&&s1[i-1]===s3[i+j-1])||(dp[i][j-1]&&s2[j-1]===s3[i+j-1]);
  return dp[m][n];
}`,
    java: `public boolean isInterleave(String s1, String s2, String s3) {
    int m=s1.length(),n=s2.length();
    if(m+n!=s3.length()) return false;
    boolean[][] dp=new boolean[m+1][n+1];
    dp[0][0]=true;
    for(int i=1;i<=m;i++) dp[i][0]=dp[i-1][0]&&s1.charAt(i-1)==s3.charAt(i-1);
    for(int j=1;j<=n;j++) dp[0][j]=dp[0][j-1]&&s2.charAt(j-1)==s3.charAt(j-1);
    for(int i=1;i<=m;i++)
        for(int j=1;j<=n;j++)
            dp[i][j]=(dp[i-1][j]&&s1.charAt(i-1)==s3.charAt(i+j-1))||(dp[i][j-1]&&s2.charAt(j-1)==s3.charAt(i+j-1));
    return dp[m][n];
}`,
  },

  defaultInput: {
    s1: 'aab',
    s2: 'axy',
    s3: 'aaxaby',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String s1',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'First string',
    },
    {
      name: 's2',
      label: 'String s2',
      type: 'string',
      defaultValue: 'axy',
      placeholder: 'axy',
      helperText: 'Second string',
    },
    {
      name: 's3',
      label: 'String s3',
      type: 'string',
      defaultValue: 'aaxaby',
      placeholder: 'aaxaby',
      helperText: 'Target interleaved string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const s3 = input.s3 as string;
    const m = s1.length, n = s2.length;
    const steps: AlgorithmStep[] = [];

    if (m + n !== s3.length) {
      steps.push({
        line: 2,
        explanation: `len(s1)+len(s2)=${m + n} != len(s3)=${s3.length}. Cannot interleave.`,
        variables: { m, n, 's3.length': s3.length },
        visualization: {
          type: 'array',
          array: [0],
          highlights: { 0: 'mismatch' },
          labels: { 0: 'false' },
        } as ArrayVisualization,
      });
      return steps;
    }

    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
    for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];

    steps.push({
      line: 4,
      explanation: `s1="${s1}", s2="${s2}", s3="${s3}". Base cases initialized.`,
      variables: { s1, s2, s3 },
      visualization: {
        type: 'array',
        array: dp[0].map(v => (v ? 1 : 0)),
        highlights: { 0: 'found' },
        labels: { 0: 'dp[0][0]=T' },
      } as ArrayVisualization,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const fromS1 = dp[i - 1][j] && s1[i - 1] === s3[i + j - 1];
        const fromS2 = dp[i][j - 1] && s2[j - 1] === s3[i + j - 1];
        dp[i][j] = fromS1 || fromS2;

        steps.push({
          line: 9,
          explanation: `dp[${i}][${j}]: s3[${i + j - 1}]='${s3[i + j - 1]}'. From s1: ${fromS1}, from s2: ${fromS2}. dp=${dp[i][j]}.`,
          variables: { i, j, fromS1, fromS2, 'dp[i][j]': dp[i][j] },
          visualization: {
            type: 'array',
            array: dp[i].map(v => (v ? 1 : 0)),
            highlights: { [j]: dp[i][j] ? 'found' : 'mismatch' },
            labels: { [j]: dp[i][j] ? 'T' : 'F' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Result = dp[${m}][${n}] = ${dp[m][n]}. s3 ${dp[m][n] ? 'is' : 'is not'} an interleaving.`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].map(v => (v ? 1 : 0)),
        highlights: { [n]: dp[m][n] ? 'found' : 'mismatch' },
        labels: { [n]: dp[m][n] ? 'YES' : 'NO' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default interleavingStringDp;
