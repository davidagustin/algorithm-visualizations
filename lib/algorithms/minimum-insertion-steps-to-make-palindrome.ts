import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumInsertionStepsToMakePalindrome: AlgorithmDefinition = {
  id: 'minimum-insertion-steps-to-make-palindrome',
  title: 'Minimum Insertion Steps to Make a String Palindrome',
  leetcodeNumber: 1312,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a string s, find the minimum number of characters to insert to make it a palindrome. Key insight: the minimum insertions equals n minus the length of the longest palindromic subsequence. The DP table dp[i][j] represents the minimum insertions needed to make s[i..j] a palindrome. If endpoints match, no insertion needed for them; otherwise take min of inserting at either end plus 1.',
  tags: ['dp', 'string', 'palindrome', 'insertion'],

  code: {
    pseudocode: `function minInsertions(s):
  n = len(s)
  dp = 2D array n x n, all 0
  for length from 2 to n:
    for i from 0 to n-length:
      j = i + length - 1
      if s[i] == s[j]:
        dp[i][j] = dp[i+1][j-1]
      else:
        dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])
  return dp[0][n-1]`,
    python: `def minInsertions(s: str) -> int:
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] if length > 2 else 0
            else:
                dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])
    return dp[0][n-1]`,
    javascript: `function minInsertions(s) {
  const n = s.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        dp[i][j] = len > 2 ? dp[i+1][j-1] : 0;
      } else {
        dp[i][j] = 1 + Math.min(dp[i+1][j], dp[i][j-1]);
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public int minInsertions(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j)) {
                dp[i][j] = len > 2 ? dp[i+1][j-1] : 0;
            } else {
                dp[i][j] = 1 + Math.min(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'mbadm',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'mbadm',
      placeholder: 'mbadm',
      helperText: 'String to convert into a palindrome with minimum insertions',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: n * n }, (_, k) => {
        const r = Math.floor(k / n);
        const c = k % n;
        return `(${r},${c})`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP for "${s}" (length ${n}). dp[i][j] = min insertions to make s[i..j] a palindrome.`,
      variables: { n, s },
      visualization: makeViz({}),
    });

    steps.push({
      line: 3,
      explanation: 'Base case: dp[i][i] = 0 for all i since single characters are already palindromes.',
      variables: { baseCaseSet: true },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i * n + i, 'found']))
      ),
    });

    for (let length = 2; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        const idx = i * n + j;
        if (s[i] === s[j]) {
          dp[i][j] = length > 2 ? dp[i + 1][j - 1] : 0;
          steps.push({
            line: 7,
            explanation: `s[${i}]='${s[i]}' == s[${j}]='${s[j]}'. Endpoints match. dp[${i}][${j}] = dp[${i + 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, length, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'found', [(i + 1) * n + (j - 1)]: 'comparing' }),
          });
        } else {
          dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
          steps.push({
            line: 9,
            explanation: `s[${i}]='${s[i]}' != s[${j}]='${s[j]}'. Insert. dp[${i}][${j}] = 1 + min(${dp[i + 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}.`,
            variables: { i, j, length, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({
              [idx]: 'active',
              [(i + 1) * n + j]: 'comparing',
              [i * n + (j - 1)]: 'comparing',
            }),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Result: minimum insertions = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz({ [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default minimumInsertionStepsToMakePalindrome;
