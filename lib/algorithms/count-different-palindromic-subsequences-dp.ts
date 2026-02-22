import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countDifferentPalindromicSubsequencesDp: AlgorithmDefinition = {
  id: 'count-different-palindromic-subsequences-dp',
  title: 'Count Different Palindromic Subsequences (DP)',
  leetcodeNumber: 730,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a string s containing only a, b, c, d, count the number of distinct non-empty palindromic subsequences. The result should be returned modulo 10^9 + 7. Uses interval DP where dp[i][j] is the count of distinct palindromic subsequences in s[i..j].',
  tags: ['dynamic programming', 'string', 'palindrome', 'interval dp'],

  code: {
    pseudocode: `function countPalindromicSubsequences(s):
  n = len(s), MOD = 1e9+7
  dp[i][j] = count of distinct palindromic subs in s[i..j]
  for each length L from 1 to n:
    for each i, j = i+L-1:
      if s[i] == s[j]:
        lo = i+1, hi = j-1
        while lo <= hi and s[lo] != s[i]: lo++
        while lo <= hi and s[hi] != s[j]: hi--
        if lo > hi: dp[i][j] = dp[i+1][j-1]*2 + 2
        elif lo == hi: dp[i][j] = dp[i+1][j-1]*2 + 1
        else: dp[i][j] = dp[i+1][j-1]*2 - dp[lo+1][hi-1]
      else:
        dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1]
  return dp[0][n-1] % MOD`,
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
            dp[i][j] = (dp[i][j] + MOD) % MOD
    return dp[0][n-1]`,
    javascript: `function countPalindromicSubsequences(s) {
  const MOD = 1e9 + 7, n = s.length;
  const dp = Array.from({length:n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1;
      if (s[i] === s[j]) {
        let lo = i+1, hi = j-1;
        while (lo <= hi && s[lo] !== s[i]) lo++;
        while (lo <= hi && s[hi] !== s[j]) hi--;
        if (lo > hi) dp[i][j] = dp[i+1][j-1]*2+2;
        else if (lo === hi) dp[i][j] = dp[i+1][j-1]*2+1;
        else dp[i][j] = dp[i+1][j-1]*2 - dp[lo+1][hi-1];
      } else {
        dp[i][j] = dp[i+1][j]+dp[i][j-1]-dp[i+1][j-1];
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
                if (lo>hi) dp[i][j] = dp[i+1][j-1]*2+2;
                else if (lo==hi) dp[i][j] = dp[i+1][j-1]*2+1;
                else dp[i][j] = dp[i+1][j-1]*2 - dp[lo+1][hi-1];
            } else dp[i][j] = dp[i+1][j]+dp[i][j-1]-dp[i+1][j-1];
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
      label: 'String (only a,b,c,d)',
      type: 'string',
      defaultValue: 'bccb',
      placeholder: 'bccb',
      helperText: 'String containing only characters a, b, c, d',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) dp[i][i] = 1;

    steps.push({
      line: 1,
      explanation: `Input s="${s}" (length ${n}). Initialize dp[i][i]=1 for all single characters.`,
      variables: { s, n },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => dp[i][i]),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        if (s[i] === s[j]) {
          let lo = i + 1, hi = j - 1;
          while (lo <= hi && s[lo] !== s[i]) lo++;
          while (lo <= hi && s[hi] !== s[j]) hi--;
          let val: number;
          if (lo > hi) val = (dp[i + 1] ? dp[i + 1][j - 1] : 0) * 2 + 2;
          else if (lo === hi) val = (dp[i + 1] ? dp[i + 1][j - 1] : 0) * 2 + 1;
          else val = (dp[i + 1] ? dp[i + 1][j - 1] : 0) * 2 - (dp[lo + 1] ? dp[lo + 1][hi - 1] : 0);
          dp[i][j] = ((val % MOD) + MOD) % MOD;
          steps.push({
            line: 6,
            explanation: `s[${i}]='${s[i]}' == s[${j}]='${s[j]}'. dp[${i}][${j}] = ${dp[i][j]} (matching ends, lo=${lo}, hi=${hi}).`,
            variables: { i, j, 'dp[i][j]': dp[i][j], lo, hi },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n),
              highlights: { [i]: 'active', [j]: 'active' },
              labels: { [i]: `i=${i}`, [j]: `j=${j}` },
            } as ArrayVisualization,
          });
        } else {
          const inner = i + 1 <= j - 1 ? dp[i + 1][j - 1] : 0;
          dp[i][j] = ((dp[i + 1][j] + dp[i][j - 1] - inner) % MOD + MOD) % MOD;
          steps.push({
            line: 14,
            explanation: `s[${i}]='${s[i]}' != s[${j}]='${s[j]}'. dp[${i}][${j}] = dp[${i + 1}][${j}] + dp[${i}][${j - 1}] - dp[${i + 1}][${j - 1}] = ${dp[i][j]}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] },
            visualization: {
              type: 'array',
              array: dp[i].slice(0, n),
              highlights: { [i]: 'comparing', [j]: 'comparing' },
              labels: { [i]: `i=${i}`, [j]: `j=${j}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `Answer = dp[0][${n - 1}] = ${dp[0][n - 1]}.`,
      variables: { result: dp[0][n - 1] },
      visualization: {
        type: 'array',
        array: dp[0].slice(0, n),
        highlights: { [n - 1]: 'found' },
        labels: { [n - 1]: `ans=${dp[0][n - 1]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default countDifferentPalindromicSubsequencesDp;
