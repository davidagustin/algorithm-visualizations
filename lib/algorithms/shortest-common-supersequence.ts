import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const shortestCommonSupersequence: AlgorithmDefinition = {
  id: 'shortest-common-supersequence',
  title: 'Shortest Common Supersequence',
  leetcodeNumber: 1092,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given two strings str1 and str2, return the shortest string that has both str1 and str2 as subsequences. The length of the shortest common supersequence (SCS) equals len(str1) + len(str2) - LCS(str1, str2). We first compute the LCS table, then backtrack to reconstruct the SCS string by including shared characters once and non-shared characters from both strings.',
  tags: ['dp', 'string', 'lcs', 'supersequence'],

  code: {
    pseudocode: `function shortestCommonSupersequence(str1, str2):
  m = len(str1), n = len(str2)
  dp = (m+1) x (n+1) table for LCS lengths
  for i from 1 to m:
    for j from 1 to n:
      if str1[i-1] == str2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  // Reconstruct SCS by backtracking
  result = ""
  i = m, j = n
  while i > 0 and j > 0:
    if str1[i-1] == str2[j-1]:
      result = str1[i-1] + result; i--; j--
    elif dp[i-1][j] > dp[i][j-1]:
      result = str1[i-1] + result; i--
    else:
      result = str2[j-1] + result; j--
  while i > 0: result = str1[i-1] + result; i--
  while j > 0: result = str2[j-1] + result; j--
  return result`,
    python: `def shortestCommonSupersequence(str1: str, str2: str) -> str:
    m, n = len(str1), len(str2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(1, m+1):
        for j in range(1, n+1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    i, j, res = m, n, ""
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            res = str1[i-1] + res; i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            res = str1[i-1] + res; i -= 1
        else:
            res = str2[j-1] + res; j -= 1
    while i > 0: res = str1[i-1] + res; i -= 1
    while j > 0: res = str2[j-1] + res; j -= 1
    return res`,
    javascript: `function shortestCommonSupersequence(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = str1[i-1] === str2[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
  let i = m, j = n, res = '';
  while (i > 0 && j > 0) {
    if (str1[i-1] === str2[j-1]) { res = str1[i-1]+res; i--; j--; }
    else if (dp[i-1][j] > dp[i][j-1]) { res = str1[i-1]+res; i--; }
    else { res = str2[j-1]+res; j--; }
  }
  while (i > 0) { res = str1[i-1]+res; i--; }
  while (j > 0) { res = str2[j-1]+res; j--; }
  return res;
}`,
    java: `public String shortestCommonSupersequence(String str1, String str2) {
    int m = str1.length(), n = str2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = str1.charAt(i-1)==str2.charAt(j-1) ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j],dp[i][j-1]);
    StringBuilder res = new StringBuilder();
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1.charAt(i-1)==str2.charAt(j-1)) { res.insert(0,str1.charAt(i-1)); i--; j--; }
        else if (dp[i-1][j]>dp[i][j-1]) { res.insert(0,str1.charAt(i-1)); i--; }
        else { res.insert(0,str2.charAt(j-1)); j--; }
    }
    while (i>0) { res.insert(0,str1.charAt(i-1)); i--; }
    while (j>0) { res.insert(0,str2.charAt(j-1)); j--; }
    return res.toString();
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
      helperText: 'First input string',
    },
    {
      name: 'str2',
      label: 'String 2',
      type: 'string',
      defaultValue: 'cab',
      placeholder: 'cab',
      helperText: 'Second input string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str1 = input.str1 as string;
    const str2 = input.str2 as string;
    const steps: AlgorithmStep[] = [];
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: (m + 1) * (n + 1) }, (_, k) => {
        const r = Math.floor(k / (n + 1));
        const c = k % (n + 1);
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Build LCS table for str1="${str1}" and str2="${str2}". SCS length = m + n - LCS.`,
      variables: { m, n },
      visualization: makeViz({}),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const idx = i * (n + 1) + j;
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          steps.push({
            line: 6,
            explanation: `str1[${i - 1}]='${str1[i - 1]}' == str2[${j - 1}]='${str2[j - 1]}'. LCS extends: dp[${i}][${j}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'found', [(i - 1) * (n + 1) + (j - 1)]: 'comparing' }),
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          steps.push({
            line: 8,
            explanation: `str1[${i - 1}]='${str1[i - 1]}' != str2[${j - 1}]='${str2[j - 1]}'. dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'active', [(i - 1) * (n + 1) + j]: 'comparing', [i * (n + 1) + (j - 1)]: 'comparing' }),
          });
        }
      }
    }

    // Backtrack to build SCS
    let i = m;
    let j = n;
    let result = '';
    steps.push({
      line: 10,
      explanation: `LCS length = ${dp[m][n]}. SCS length = ${m} + ${n} - ${dp[m][n]} = ${m + n - dp[m][n]}. Now backtracking to build SCS.`,
      variables: { lcsLength: dp[m][n], scsLength: m + n - dp[m][n] },
      visualization: makeViz({ [m * (n + 1) + n]: 'found' }),
    });

    while (i > 0 && j > 0) {
      const idx = i * (n + 1) + j;
      if (str1[i - 1] === str2[j - 1]) {
        result = str1[i - 1] + result;
        steps.push({
          line: 14,
          explanation: `Match at (${i},${j}): add '${str1[i - 1]}' once to SCS. result="${result}".`,
          variables: { i, j, result },
          visualization: makeViz({ [idx]: 'found' }),
        });
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        result = str1[i - 1] + result;
        steps.push({
          line: 16,
          explanation: `Take from str1: add '${str1[i - 1]}' to SCS. result="${result}".`,
          variables: { i, j, result },
          visualization: makeViz({ [idx]: 'active', [(i - 1) * (n + 1) + j]: 'comparing' }),
        });
        i--;
      } else {
        result = str2[j - 1] + result;
        steps.push({
          line: 18,
          explanation: `Take from str2: add '${str2[j - 1]}' to SCS. result="${result}".`,
          variables: { i, j, result },
          visualization: makeViz({ [idx]: 'active', [i * (n + 1) + (j - 1)]: 'comparing' }),
        });
        j--;
      }
    }

    while (i > 0) {
      result = str1[i - 1] + result;
      i--;
    }
    while (j > 0) {
      result = str2[j - 1] + result;
      j--;
    }

    steps.push({
      line: 22,
      explanation: `Shortest Common Supersequence = "${result}" (length ${result.length}).`,
      variables: { result, length: result.length },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default shortestCommonSupersequence;
