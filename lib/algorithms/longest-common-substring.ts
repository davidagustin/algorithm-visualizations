import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestCommonSubstring: AlgorithmDefinition = {
  id: 'longest-common-substring',
  title: 'Longest Common Substring',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings, find the length (and content) of the longest common substring. Unlike subsequence, a substring must be contiguous. The DP table dp[i][j] represents the length of the longest common substring ending at s1[i-1] and s2[j-1]. When characters match we extend from dp[i-1][j-1]; when they do not match the streak resets to 0. We track the maximum seen value and the position to reconstruct the substring.',
  tags: ['dp', 'string', 'substring', 'classic'],

  code: {
    pseudocode: `function longestCommonSubstring(s1, s2):
  m = len(s1), n = len(s2)
  dp = 2D array (m+1) x (n+1), all 0
  maxLen = 0, endIdx = 0
  for i from 1 to m:
    for j from 1 to n:
      if s1[i-1] == s2[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
        if dp[i][j] > maxLen:
          maxLen = dp[i][j]
          endIdx = i
      else:
        dp[i][j] = 0
  return s1[endIdx-maxLen..endIdx-1]`,
    python: `def longestCommonSubstring(s1: str, s2: str) -> str:
    m, n = len(s1), len(s2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    max_len, end_idx = 0, 0
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > max_len:
                    max_len = dp[i][j]
                    end_idx = i
            else:
                dp[i][j] = 0
    return s1[end_idx-max_len:end_idx]`,
    javascript: `function longestCommonSubstring(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  let maxLen = 0, endIdx = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        if (dp[i][j] > maxLen) { maxLen = dp[i][j]; endIdx = i; }
      } else {
        dp[i][j] = 0;
      }
    }
  }
  return s1.slice(endIdx - maxLen, endIdx);
}`,
    java: `public String longestCommonSubstring(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    int maxLen = 0, endIdx = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
                if (dp[i][j] > maxLen) { maxLen = dp[i][j]; endIdx = i; }
            } else {
                dp[i][j] = 0;
            }
        }
    }
    return s1.substring(endIdx - maxLen, endIdx);
}`,
  },

  defaultInput: {
    s1: 'abcdef',
    s2: 'zcdemf',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String 1',
      type: 'string',
      defaultValue: 'abcdef',
      placeholder: 'abcdef',
      helperText: 'First string',
    },
    {
      name: 's2',
      label: 'String 2',
      type: 'string',
      defaultValue: 'zcdemf',
      placeholder: 'zcdemf',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    let maxLen = 0;
    let endIdx = 0;

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
      explanation: `Find longest common substring of s1="${s1}" and s2="${s2}". dp[i][j] = LCS length ending at s1[i-1] and s2[j-1].`,
      variables: { m, n, maxLen, endIdx },
      visualization: makeViz({}),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const idx = i * (n + 1) + j;
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > maxLen) {
            maxLen = dp[i][j];
            endIdx = i;
            steps.push({
              line: 9,
              explanation: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. Extend: dp[${i}][${j}] = ${dp[i][j]}. New max! Substring so far: "${s1.slice(endIdx - maxLen, endIdx)}".`,
              variables: { i, j, maxLen, endIdx, currentSubstr: s1.slice(endIdx - maxLen, endIdx) },
              visualization: makeViz({ [idx]: 'found', [(i - 1) * (n + 1) + (j - 1)]: 'comparing' }),
            });
          } else {
            steps.push({
              line: 7,
              explanation: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}'. Extend: dp[${i}][${j}] = ${dp[i][j]}.`,
              variables: { i, j, 'dp[i][j]': dp[i][j], maxLen },
              visualization: makeViz({ [idx]: 'active', [(i - 1) * (n + 1) + (j - 1)]: 'comparing' }),
            });
          }
        } else {
          dp[i][j] = 0;
          steps.push({
            line: 12,
            explanation: `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}'. Streak resets. dp[${i}][${j}] = 0.`,
            variables: { i, j, 'dp[i][j]': 0, maxLen },
            visualization: makeViz({ [idx]: 'mismatch' }),
          });
        }
      }
    }

    const resultStr = s1.slice(endIdx - maxLen, endIdx);
    steps.push({
      line: 13,
      explanation: `Done. Longest common substring = "${resultStr}" (length ${maxLen}).`,
      variables: { result: resultStr, maxLen },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default longestCommonSubstring;
