import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromePartitioningIii: AlgorithmDefinition = {
  id: 'palindrome-partitioning-iii',
  title: 'Palindrome Partitioning III',
  leetcodeNumber: 1278,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given string s and integer k, partition s into exactly k non-empty substrings. The cost to make a substring a palindrome is the number of characters to change. Return the minimum total cost. Uses 2D DP: cost[i][j] = min changes to make s[i..j] a palindrome, then dp[i][j] = min cost for first i chars in j parts.',
  tags: ['dynamic programming', 'string', 'palindrome', 'partition'],

  code: {
    pseudocode: `function palindromePartition(s, k):
  n = len(s)
  cost[i][j] = min changes to make s[i..j] palindrome
  for i,j: cost[i][j] = count mismatches from ends inward
  dp[i][j] = min cost for first i chars using j parts
  dp[0][0] = 0
  for parts from 1 to k:
    for i from parts to n:
      for m from parts-1 to i-1:
        dp[i][parts] = min(dp[i][parts], dp[m][parts-1] + cost[m][i-1])
  return dp[n][k]`,
    python: `def palindromePartition(s: str, k: int) -> int:
    n = len(s)
    cost = [[0]*n for _ in range(n)]
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i+length-1
            cost[i][j] = cost[i+1][j-1] + (0 if s[i]==s[j] else 1)
    dp = [[float('inf')]*(k+1) for _ in range(n+1)]
    dp[0][0] = 0
    for parts in range(1, k+1):
        for i in range(parts, n+1):
            for m in range(parts-1, i):
                dp[i][parts] = min(dp[i][parts], dp[m][parts-1] + cost[m][i-1])
    return dp[n][k]`,
    javascript: `function palindromePartition(s, k) {
  const n = s.length;
  const cost = Array.from({length:n},()=>new Array(n).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1;
      cost[i][j] = cost[i+1][j-1] + (s[i]===s[j] ? 0 : 1);
    }
  const dp = Array.from({length:n+1},()=>new Array(k+1).fill(Infinity));
  dp[0][0] = 0;
  for (let p = 1; p <= k; p++)
    for (let i = p; i <= n; i++)
      for (let m = p-1; m < i; m++)
        dp[i][p] = Math.min(dp[i][p], dp[m][p-1] + cost[m][i-1]);
  return dp[n][k];
}`,
    java: `public int palindromePartition(String s, int k) {
    int n = s.length();
    int[][] cost = new int[n][n];
    for (int len = 2; len <= n; len++)
        for (int i = 0; i <= n-len; i++) {
            int j = i+len-1;
            cost[i][j] = cost[i+1][j-1] + (s.charAt(i)==s.charAt(j) ? 0 : 1);
        }
    int[][] dp = new int[n+1][k+1];
    for (int[] row: dp) Arrays.fill(row, Integer.MAX_VALUE/2);
    dp[0][0] = 0;
    for (int p = 1; p <= k; p++)
        for (int i = p; i <= n; i++)
            for (int m = p-1; m < i; m++)
                dp[i][p] = Math.min(dp[i][p], dp[m][p-1] + cost[m][i-1]);
    return dp[n][k];
}`,
  },

  defaultInput: {
    s: 'abc',
    k: 2,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'Input string',
    },
    {
      name: 'k',
      label: 'K (number of parts)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of parts to partition into',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const chars = s.split('');

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: chars.map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Palindrome Partitioning III: s="${s}", k=${k}. Find min changes to split s into ${k} palindrome parts.`,
      variables: { n, k },
      visualization: makeViz({}, {}),
    });

    const cost: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        cost[i][j] = (cost[i + 1] ? cost[i + 1][j - 1] : 0) + (s[i] === s[j] ? 0 : 1);
      }
    }

    steps.push({
      line: 3,
      explanation: `Precompute cost[i][j] = min changes to make s[i..j] a palindrome. cost[0][${n - 1}]=${cost[0][n - 1]} changes needed for whole string.`,
      variables: { 'cost[0][n-1]': cost[0][n - 1] },
      visualization: makeViz(
        Object.fromEntries(chars.map((_, i) => [i, 'comparing'])),
        Object.fromEntries(chars.map((c, i) => [i, c]))
      ),
    });

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(Infinity));
    dp[0][0] = 0;

    for (let p = 1; p <= k; p++) {
      for (let i = p; i <= n; i++) {
        for (let m = p - 1; m < i; m++) {
          const candidate = dp[m][p - 1] + cost[m][i - 1];
          if (candidate < dp[i][p]) dp[i][p] = candidate;
        }

        if (p <= 2 && i <= 4) {
          const highlights: Record<number, string> = {};
          for (let idx = 0; idx < i; idx++) highlights[idx] = 'active';
          steps.push({
            line: 9,
            explanation: `dp[${i}][${p}]=${dp[i][p] === Infinity ? 'inf' : dp[i][p]}. Min cost for first ${i} chars in ${p} palindrome parts.`,
            variables: { i, parts: p, 'dp[i][p]': dp[i][p] === Infinity ? 'inf' : dp[i][p] },
            visualization: makeViz(highlights, { 0: `${p}pts`, [i - 1]: `=${dp[i][p]}` }),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `dp[${n}][${k}]=${dp[n][k]}. Minimum changes to partition s into ${k} palindrome parts.`,
      variables: { result: dp[n][k] },
      visualization: makeViz(
        Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        { 0: `ans:${dp[n][k]}` }
      ),
    });

    return steps;
  },
};

export default palindromePartitioningIii;
