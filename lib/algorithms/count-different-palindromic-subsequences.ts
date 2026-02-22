import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const countDifferentPalindromicSubsequences: AlgorithmDefinition = {
  id: 'count-different-palindromic-subsequences',
  title: 'Count Different Palindromic Subsequences',
  leetcodeNumber: 730,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a string s containing only characters "a", "b", "c", and "d", return the number of distinct palindromic subsequences in s modulo 10^9 + 7. The DP table dp[i][j] represents the count of distinct palindromic subsequences in s[i..j]. When s[i] equals s[j], we find the next and previous occurrences of that character inside the range to handle duplicates and avoid overcounting.',
  tags: ['dp', 'string', 'palindrome', 'counting', 'modular arithmetic'],

  code: {
    pseudocode: `function countPalindromicSubsequences(s):
  MOD = 10^9 + 7
  n = len(s)
  dp = 2D array n x n, all 0
  for i from 0 to n-1: dp[i][i] = 1
  for length from 2 to n:
    for i from 0 to n-length:
      j = i + length - 1
      if s[i] == s[j]:
        lo = i+1, hi = j-1
        while lo <= hi and s[lo] != s[i]: lo++
        while lo <= hi and s[hi] != s[j]: hi--
        if lo > hi:      // no same char inside
          dp[i][j] = dp[i+1][j-1] * 2 + 2
        elif lo == hi:   // one same char inside
          dp[i][j] = dp[i+1][j-1] * 2 + 1
        else:            // two+ same chars inside
          dp[i][j] = dp[i+1][j-1] * 2 - dp[lo+1][hi-1]
      else:
        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
      dp[i][j] = ((dp[i][j] % MOD) + MOD) % MOD
  return dp[0][n-1]`,
    python: `def countPalindromicSubsequences(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)
    dp = [[0]*n for _ in range(n)]
    for i in range(n): dp[i][i] = 1
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i + length - 1
            if s[i] == s[j]:
                lo, hi = i+1, j-1
                while lo <= hi and s[lo] != s[i]: lo += 1
                while lo <= hi and s[hi] != s[j]: hi -= 1
                if lo > hi: dp[i][j] = dp[i+1][j-1]*2 + 2
                elif lo == hi: dp[i][j] = dp[i+1][j-1]*2 + 1
                else: dp[i][j] = dp[i+1][j-1]*2 - dp[lo+1][hi-1]
            else:
                dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
            dp[i][j] = (dp[i][j] % MOD + MOD) % MOD
    return dp[0][n-1]`,
    javascript: `function countPalindromicSubsequences(s) {
  const MOD = 1e9 + 7;
  const n = s.length;
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1;
      if (s[i] === s[j]) {
        let lo = i+1, hi = j-1;
        while (lo <= hi && s[lo] !== s[i]) lo++;
        while (lo <= hi && s[hi] !== s[j]) hi--;
        if (lo > hi) dp[i][j] = dp[i+1][j-1]*2 + 2;
        else if (lo === hi) dp[i][j] = dp[i+1][j-1]*2 + 1;
        else dp[i][j] = dp[i+1][j-1]*2 - dp[lo+1][hi-1];
      } else {
        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
      }
      dp[i][j] = ((dp[i][j] % MOD) + MOD) % MOD;
    }
  }
  return dp[0][n-1];
}`,
    java: `public int countPalindromicSubsequences(String s) {
    int MOD = 1_000_000_007, n = s.length();
    long[][] dp = new long[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n-len; i++) {
            int j = i+len-1;
            if (s.charAt(i) == s.charAt(j)) {
                int lo = i+1, hi = j-1;
                while (lo<=hi && s.charAt(lo)!=s.charAt(i)) lo++;
                while (lo<=hi && s.charAt(hi)!=s.charAt(j)) hi--;
                if (lo > hi) dp[i][j] = dp[i+1][j-1]*2+2;
                else if (lo==hi) dp[i][j] = dp[i+1][j-1]*2+1;
                else dp[i][j] = dp[i+1][j-1]*2-dp[lo+1][hi-1];
            } else {
                dp[i][j] = dp[i+1][j]+dp[i][j-1]-dp[i+1][j-1];
            }
            dp[i][j] = ((dp[i][j]%MOD)+MOD)%MOD;
        }
    }
    return (int)dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'bccb',
  },

  inputFields: [
    {
      name: 's',
      label: 'String (a/b/c/d only)',
      type: 'string',
      defaultValue: 'bccb',
      placeholder: 'bccb',
      helperText: 'String containing only a, b, c, d characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;
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
      explanation: `Initialize DP for "${s}" (length ${n}). Count distinct palindromic subsequences mod ${MOD}.`,
      variables: { n, MOD },
      visualization: makeViz({}),
    });

    for (let i = 0; i < n; i++) {
      dp[i][i] = 1;
    }
    steps.push({
      line: 5,
      explanation: 'Base case: dp[i][i] = 1 since each single character is a palindrome.',
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
          let lo = i + 1;
          let hi = j - 1;
          while (lo <= hi && s[lo] !== s[i]) lo++;
          while (lo <= hi && s[hi] !== s[j]) hi--;

          let inner = i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0;
          let caseLabel: string;

          if (lo > hi) {
            dp[i][j] = (inner * 2 + 2) % MOD;
            caseLabel = 'no same char inside: *2+2';
          } else if (lo === hi) {
            dp[i][j] = (inner * 2 + 1) % MOD;
            caseLabel = 'one same char inside: *2+1';
          } else {
            const loInner = lo + 1 <= hi - 1 ? dp[lo + 1][hi - 1] : 0;
            dp[i][j] = ((inner * 2 - loInner) % MOD + MOD) % MOD;
            caseLabel = 'two+ same chars inside: *2-inner';
          }
          steps.push({
            line: 12,
            explanation: `s[${i}]='${s[i]}' == s[${j}]='${s[j]}'. Match. ${caseLabel}. dp[${i}][${j}] = ${dp[i][j]}.`,
            variables: { i, j, length, lo, hi, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'found', [(i + 1) * n + (j - 1)]: 'comparing' }),
          });
        } else {
          const val =
            ((dp[i + 1 <= n - 1 ? i + 1 : i][j] +
              dp[i][j - 1 >= 0 ? j - 1 : j] -
              (i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0)) %
              MOD +
              MOD) %
            MOD;
          dp[i][j] = val;
          steps.push({
            line: 17,
            explanation: `s[${i}]='${s[i]}' != s[${j}]='${s[j]}'. dp[${i}][${j}] = dp[${i + 1}][${j}] + dp[${i}][${j - 1}] - dp[${i + 1}][${j - 1}] = ${val}.`,
            variables: { i, j, length, 'dp[i][j]': dp[i][j] },
            visualization: makeViz({ [idx]: 'active' }),
          });
        }
      }
    }

    steps.push({
      line: 20,
      explanation: `Result: ${dp[0][n - 1]} distinct palindromic subsequences in "${s}".`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz({ [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default countDifferentPalindromicSubsequences;
