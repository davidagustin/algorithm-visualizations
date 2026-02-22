import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumAsciiDeleteSum: AlgorithmDefinition = {
  id: 'minimum-ascii-delete-sum',
  title: 'Minimum ASCII Delete Sum for Two Strings',
  leetcodeNumber: 712,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings s1 and s2, return the lowest ASCII sum of deleted characters to make both strings equal. A DP table is built where dp[i][j] represents the minimum delete sum to make s1[0..i-1] equal to s2[0..j-1]. When characters match, no deletion is needed; otherwise we pick the cheaper deletion from either string.',
  tags: ['dp', 'string', 'lcs variant', 'ascii'],

  code: {
    pseudocode: `function minimumDeleteSum(s1, s2):
  m = len(s1), n = len(s2)
  dp = 2D array of size (m+1) x (n+1)
  for i from 0 to m: dp[i][0] = sum of ASCII of s1[0..i-1]
  for j from 0 to n: dp[0][j] = sum of ASCII of s2[0..j-1]
  for i from 1 to m:
    for j from 1 to n:
      if s1[i-1] == s2[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = min(dp[i-1][j] + ascii(s1[i-1]),
                       dp[i][j-1] + ascii(s2[j-1]))
  return dp[m][n]`,
    python: `def minimumDeleteSum(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        dp[i][0] = dp[i-1][0] + ord(s1[i-1])
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] + ord(s2[j-1])
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = min(dp[i-1][j] + ord(s1[i-1]),
                               dp[i][j-1] + ord(s2[j-1]))
    return dp[m][n]`,
    javascript: `function minimumDeleteSum(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] + s1.charCodeAt(i-1);
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] + s2.charCodeAt(j-1);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = Math.min(dp[i-1][j] + s1.charCodeAt(i-1),
                            dp[0][j-1] + s2.charCodeAt(j-1));
      }
    }
  }
  return dp[m][n];
}`,
    java: `public int minimumDeleteSum(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] + s1.charAt(i-1);
    for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] + s2.charAt(j-1);
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(dp[i-1][j] + s1.charAt(i-1),
                                    dp[i][j-1] + s2.charAt(j-1));
            }
        }
    }
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
      label: 'String 1',
      type: 'string',
      defaultValue: 'sea',
      placeholder: 'sea',
      helperText: 'First input string',
    },
    {
      name: 's2',
      label: 'String 2',
      type: 'string',
      defaultValue: 'eat',
      placeholder: 'eat',
      helperText: 'Second input string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];
    const m = s1.length;
    const n = s2.length;
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
      explanation: `Initialize DP table of size ${m + 1} x ${n + 1}. s1="${s1}", s2="${s2}".`,
      variables: { m, n },
      visualization: makeViz({}),
    });

    for (let i = 1; i <= m; i++) {
      dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
      steps.push({
        line: 4,
        explanation: `dp[${i}][0] = ${dp[i][0]}: cost to delete s1[0..${i - 1}] = "${s1.slice(0, i)}".`,
        variables: { i, 'dp[i][0]': dp[i][0] },
        visualization: makeViz({ [i * (n + 1)]: 'active' }),
      });
    }

    for (let j = 1; j <= n; j++) {
      dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
      steps.push({
        line: 5,
        explanation: `dp[0][${j}] = ${dp[0][j]}: cost to delete s2[0..${j - 1}] = "${s2.slice(0, j)}".`,
        variables: { j, 'dp[0][j]': dp[0][j] },
        visualization: makeViz({ [j]: 'active' }),
      });
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const idx = i * (n + 1) + j;
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          steps.push({
            line: 9,
            explanation: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. No deletion needed. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, char: s1[i - 1], 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'found', [(i - 1) * (n + 1) + (j - 1)]: 'comparing' }),
          });
        } else {
          const delS1 = dp[i - 1][j] + s1.charCodeAt(i - 1);
          const delS2 = dp[i][j - 1] + s2.charCodeAt(j - 1);
          dp[i][j] = Math.min(delS1, delS2);
          steps.push({
            line: 11,
            explanation: `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}'. Min(delete s1: ${delS1}, delete s2: ${delS2}) = ${dp[i][j]}.`,
            variables: { i, j, delS1, delS2, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({
              [idx]: 'active',
              [(i - 1) * (n + 1) + j]: 'comparing',
              [i * (n + 1) + (j - 1)]: 'comparing',
            }),
          });
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `Result: minimum ASCII delete sum = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: makeViz({ [m * (n + 1) + n]: 'found' }),
    });

    return steps;
  },
};

export default minimumAsciiDeleteSum;
