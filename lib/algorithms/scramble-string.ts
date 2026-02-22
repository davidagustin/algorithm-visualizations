import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const scrambleString: AlgorithmDefinition = {
  id: 'scramble-string',
  title: 'Scramble String',
  leetcodeNumber: 87,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'We use a binary tree to scramble a string s1: pick a non-leaf node, optionally swap its two children, and recurse. Given two strings s1 and s2, determine if s2 is a scrambled version of s1. The 3D DP solution uses dp[len][i][j] = true if s2[j..j+len-1] is a scramble of s1[i..i+len-1]. For each split point k, check both the swapped and non-swapped cases.',
  tags: ['dp', 'string', 'recursion', '3d dp'],

  code: {
    pseudocode: `function isScramble(s1, s2):
  n = len(s1)
  dp = 3D boolean array [n+1][n][n], all false
  // base case: length 1
  for i from 0 to n-1:
    for j from 0 to n-1:
      dp[1][i][j] = (s1[i] == s2[j])
  for len from 2 to n:
    for i from 0 to n-len:
      for j from 0 to n-len:
        for k from 1 to len-1:
          // no swap: s1[i..i+k-1] matches s2[j..j+k-1]
          //          and s1[i+k..i+len-1] matches s2[j+k..j+len-1]
          // swap: s1[i..i+k-1] matches s2[j+len-k..j+len-1]
          //       and s1[i+k..i+len-1] matches s2[j..j+len-k-1]
          if (dp[k][i][j] and dp[len-k][i+k][j+k]) or
             (dp[k][i][j+len-k] and dp[len-k][i+k][j]):
            dp[len][i][j] = true; break
  return dp[n][0][0]`,
    python: `def isScramble(s1: str, s2: str) -> bool:
    n = len(s1)
    dp = [[[False]*n for _ in range(n)] for _ in range(n+1)]
    for i in range(n):
        for j in range(n):
            dp[1][i][j] = s1[i] == s2[j]
    for length in range(2, n+1):
        for i in range(n - length + 1):
            for j in range(n - length + 1):
                for k in range(1, length):
                    if (dp[k][i][j] and dp[length-k][i+k][j+k]) or \
                       (dp[k][i][j+length-k] and dp[length-k][i+k][j]):
                        dp[length][i][j] = True
                        break
    return dp[n][0][0]`,
    javascript: `function isScramble(s1, s2) {
  const n = s1.length;
  const dp = Array.from({length: n+1}, () =>
    Array.from({length: n}, () => new Array(n).fill(false)));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      dp[1][i][j] = s1[i] === s2[j];
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      for (let j = 0; j <= n-len; j++) {
        for (let k = 1; k < len; k++) {
          if ((dp[k][i][j] && dp[len-k][i+k][j+k]) ||
              (dp[k][i][j+len-k] && dp[len-k][i+k][j])) {
            dp[len][i][j] = true; break;
          }
        }
      }
    }
  }
  return dp[n][0][0];
}`,
    java: `public boolean isScramble(String s1, String s2) {
    int n = s1.length();
    boolean[][][] dp = new boolean[n+1][n][n];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            dp[1][i][j] = s1.charAt(i) == s2.charAt(j);
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n-len; i++) {
            for (int j = 0; j <= n-len; j++) {
                for (int k = 1; k < len; k++) {
                    if ((dp[k][i][j] && dp[len-k][i+k][j+k]) ||
                        (dp[k][i][j+len-k] && dp[len-k][i+k][j])) {
                        dp[len][i][j] = true; break;
                    }
                }
            }
        }
    }
    return dp[n][0][0];
}`,
  },

  defaultInput: {
    s1: 'great',
    s2: 'rgeat',
  },

  inputFields: [
    {
      name: 's1',
      label: 'String s1',
      type: 'string',
      defaultValue: 'great',
      placeholder: 'great',
      helperText: 'The original string',
    },
    {
      name: 's2',
      label: 'String s2',
      type: 'string',
      defaultValue: 'rgeat',
      placeholder: 'rgeat',
      helperText: 'The possibly scrambled string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];
    const n = s1.length;

    // 3D DP: dp[len][i][j]
    const dp: boolean[][][] = Array.from({ length: n + 1 }, () =>
      Array.from({ length: n }, () => new Array(n).fill(false))
    );

    // Flatten for visualization: show dp[len] as n*n grid
    const makeViz = (len: number, highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dp[len].flat().map(v => (v ? 1 : 0)),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize 3D DP for s1="${s1}", s2="${s2}". dp[len][i][j] = is s2[j..j+len-1] a scramble of s1[i..i+len-1]?`,
      variables: { n, s1, s2 },
      visualization: makeViz(1, {}),
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        dp[1][i][j] = s1[i] === s2[j];
      }
    }

    steps.push({
      line: 5,
      explanation: `Base case: dp[1][i][j] = (s1[i] == s2[j]). Single characters match directly.`,
      variables: { length: 1 },
      visualization: makeViz(
        1,
        Object.fromEntries(
          dp[1].flatMap((row, i) =>
            row.map((v, j) => [i * n + j, v ? 'found' : 'mismatch'] as [number, string])
          )
        )
      ),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        for (let j = 0; j <= n - len; j++) {
          const idx = i * n + j;
          for (let k = 1; k < len; k++) {
            const noSwap = dp[k][i][j] && dp[len - k][i + k][j + k];
            const swap = dp[k][i][j + len - k] && dp[len - k][i + k][j];
            if (noSwap || swap) {
              dp[len][i][j] = true;
              steps.push({
                line: 12,
                explanation: `dp[${len}][${i}][${j}] = true. s1[${i}..${i + len - 1}]="${s1.slice(i, i + len)}" scrambles to s2[${j}..${j + len - 1}]="${s2.slice(j, j + len)}" with split k=${k} (${noSwap ? 'no swap' : 'swap'}).`,
                variables: { len, i, j, k, noSwap, swap },
                visualization: makeViz(len, { [idx]: 'found' }),
              });
              break;
            }
          }
          if (!dp[len][i][j]) {
            steps.push({
              line: 11,
              explanation: `dp[${len}][${i}][${j}] = false. No valid split found for s1[${i}..${i + len - 1}] and s2[${j}..${j + len - 1}].`,
              variables: { len, i, j },
              visualization: makeViz(len, { [idx]: 'mismatch' }),
            });
          }
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Result: dp[${n}][0][0] = ${dp[n][0][0]}. "${s2}" is${dp[n][0][0] ? '' : ' NOT'} a scramble of "${s1}".`,
      variables: { result: dp[n][0][0] },
      visualization: makeViz(n, { 0: dp[n][0][0] ? 'found' : 'mismatch' }),
    });

    return steps;
  },
};

export default scrambleString;
