import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestCommonSupersequenceDp: AlgorithmDefinition = {
  id: 'shortest-common-supersequence-dp',
  title: 'Shortest Common Supersequence (DP)',
  leetcodeNumber: 1092,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given two strings str1 and str2, find the shortest string that has both as subsequences. Build LCS with DP, then reconstruct the supersequence by merging both strings along the LCS path.',
  tags: ['dynamic programming', 'string', 'lcs', 'reconstruction'],

  code: {
    pseudocode: `function shortestCommonSupersequence(str1, str2):
  compute LCS dp table
  reconstruct SCS by tracing dp from dp[m][n]:
    if str1[i-1]==str2[j-1]: take char, move diagonal
    elif dp[i-1][j] >= dp[i][j-1]: take str1[i-1], move up
    else: take str2[j-1], move left
  append remaining chars of str1 or str2
  return reversed result`,
    python: `def shortestCommonSupersequence(str1: str, str2: str) -> str:
    m, n = len(str1), len(str2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1,m+1):
        for j in range(1,n+1):
            if str1[i-1]==str2[j-1]: dp[i][j]=dp[i-1][j-1]+1
            else: dp[i][j]=max(dp[i-1][j],dp[i][j-1])
    i,j,res=m,n,[]
    while i>0 and j>0:
        if str1[i-1]==str2[j-1]: res.append(str1[i-1]);i-=1;j-=1
        elif dp[i-1][j]>=dp[i][j-1]: res.append(str1[i-1]);i-=1
        else: res.append(str2[j-1]);j-=1
    res.extend(reversed(str1[:i]));res.extend(reversed(str2[:j]))
    return ''.join(reversed(res))`,
    javascript: `function shortestCommonSupersequence(str1, str2) {
  const m=str1.length,n=str2.length;
  const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)
    if(str1[i-1]===str2[j-1])dp[i][j]=dp[i-1][j-1]+1;
    else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
  let i=m,j=n,res='';
  while(i>0&&j>0)
    if(str1[i-1]===str2[j-1]){res=str1[i-1]+res;i--;j--;}
    else if(dp[i-1][j]>=dp[i][j-1]){res=str1[i-1]+res;i--;}
    else{res=str2[j-1]+res;j--;}
  return str1.slice(0,i)+str2.slice(0,j)+res;
}`,
    java: `public String shortestCommonSupersequence(String str1, String str2) {
    int m=str1.length(),n=str2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++)for(int j=1;j<=n;j++)
        if(str1.charAt(i-1)==str2.charAt(j-1))dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    StringBuilder sb=new StringBuilder();
    int i=m,j=n;
    while(i>0&&j>0)
        if(str1.charAt(i-1)==str2.charAt(j-1)){sb.append(str1.charAt(i-1));i--;j--;}
        else if(dp[i-1][j]>=dp[i][j-1]){sb.append(str1.charAt(i-1));i--;}
        else{sb.append(str2.charAt(j-1));j--;}
    while(i>0)sb.append(str1.charAt(i---1));
    while(j>0)sb.append(str2.charAt(j---1));
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    str1: 'abac',
    str2: 'cab',
  },

  inputFields: [
    {
      name: 'str1',
      label: 'String 1',
      type: 'string',
      defaultValue: 'abac',
      placeholder: 'abac',
      helperText: 'First string',
    },
    {
      name: 'str2',
      label: 'String 2',
      type: 'string',
      defaultValue: 'cab',
      placeholder: 'cab',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str1 = input.str1 as string;
    const str2 = input.str2 as string;
    const m = str1.length, n = str2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    steps.push({
      line: 1,
      explanation: `str1="${str1}", str2="${str2}". Compute LCS table. LCS length = ${dp[m][n]}.`,
      variables: { str1, str2, lcs: dp[m][n] },
      visualization: {
        type: 'array',
        array: dp[m].slice(0, n + 1),
        highlights: { [n]: 'found' },
        labels: { [n]: `LCS=${dp[m][n]}` },
      } as ArrayVisualization,
    });

    let i = m, j = n;
    let res = '';
    const traceSteps: string[] = [];

    while (i > 0 && j > 0) {
      if (str1[i - 1] === str2[j - 1]) {
        res = str1[i - 1] + res;
        traceSteps.push(`Match '${str1[i - 1]}' at i=${i},j=${j}`);
        steps.push({
          line: 3,
          explanation: `str1[${i - 1}]='${str1[i - 1]}' == str2[${j - 1}]='${str2[j - 1]}'. Add to SCS: "${res}".`,
          variables: { i, j, result: res },
          visualization: {
            type: 'array',
            array: res.split('').map(c => c.charCodeAt(0) - 96),
            highlights: { [res.length - 1]: 'found' },
            labels: { [res.length - 1]: str1[i - 1] },
          } as ArrayVisualization,
        });
        i--; j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        res = str1[i - 1] + res;
        traceSteps.push(`Take str1[${i - 1}]='${str1[i - 1]}'`);
        steps.push({
          line: 5,
          explanation: `dp[${i - 1}][${j}]>= dp[${i}][${j - 1}]. Take str1[${i - 1}]='${str1[i - 1]}'. SCS="${res}".`,
          variables: { i, j, result: res },
          visualization: {
            type: 'array',
            array: res.split('').map(c => c.charCodeAt(0) - 96),
            highlights: { [res.length - 1]: 'active' },
            labels: { [res.length - 1]: str1[i - 1] },
          } as ArrayVisualization,
        });
        i--;
      } else {
        res = str2[j - 1] + res;
        traceSteps.push(`Take str2[${j - 1}]='${str2[j - 1]}'`);
        steps.push({
          line: 7,
          explanation: `dp[${i}][${j - 1}] > dp[${i - 1}][${j}]. Take str2[${j - 1}]='${str2[j - 1]}'. SCS="${res}".`,
          variables: { i, j, result: res },
          visualization: {
            type: 'array',
            array: res.split('').map(c => c.charCodeAt(0) - 96),
            highlights: { [res.length - 1]: 'active' },
            labels: { [res.length - 1]: str2[j - 1] },
          } as ArrayVisualization,
        });
        j--;
      }
    }

    const remaining = str1.slice(0, i) + str2.slice(0, j);
    res = remaining + res;
    steps.push({
      line: 8,
      explanation: `Append remaining: "${remaining}". Final SCS = "${res}" (length ${res.length}).`,
      variables: { result: res, length: res.length },
      visualization: {
        type: 'array',
        array: res.split('').map(c => c.charCodeAt(0) - 96),
        highlights: {},
        labels: { 0: 'SCS' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default shortestCommonSupersequenceDp;
