import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumDeletionsOnString: AlgorithmDefinition = {
  id: 'maximum-deletions-on-string',
  title: 'Maximum Deletions on a String',
  leetcodeNumber: 2430,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a string s, you can delete s[0..k-1] if s[0..k-1] == s[k..2k-1]. Maximize total operations. Uses DP: dp[i] = max operations starting at index i. Precompute LCP table to check prefix match in O(1).',
  tags: ['dynamic programming', 'string', 'lcp', 'prefix'],

  code: {
    pseudocode: `function deleteString(s):
  n = len(s)
  lcp[i][j] = longest common prefix of s[i:] and s[j:]
  build lcp from bottom-right
  dp[n] = 0
  for i from n-1 to 0:
    dp[i] = 1
    for k in 1..floor((n-i)/2)+1:
      if lcp[i][i+k] >= k:
        dp[i] = max(dp[i], 1 + dp[i+k])
  return dp[0]`,
    python: `def deleteString(s: str) -> int:
    n = len(s)
    lcp = [[0]*(n+1) for _ in range(n+1)]
    for i in range(n-1, -1, -1):
        for j in range(n-1, -1, -1):
            if s[i] == s[j]:
                lcp[i][j] = lcp[i+1][j+1] + 1
    dp = [1] * n
    for i in range(n-2, -1, -1):
        for k in range(1, (n-i)//2 + 1):
            if lcp[i][i+k] >= k:
                dp[i] = max(dp[i], 1 + dp[i+k])
    return dp[0]`,
    javascript: `function deleteString(s) {
  const n = s.length;
  const lcp = Array.from({length:n+1},()=>new Array(n+1).fill(0));
  for (let i = n-1; i >= 0; i--)
    for (let j = n-1; j >= 0; j--)
      if (s[i] === s[j]) lcp[i][j] = lcp[i+1][j+1]+1;
  const dp = new Array(n).fill(1);
  for (let i = n-2; i >= 0; i--)
    for (let k = 1; k <= Math.floor((n-i)/2); k++)
      if (lcp[i][i+k] >= k) dp[i] = Math.max(dp[i], 1+dp[i+k]);
  return dp[0];
}`,
    java: `public int deleteString(String s) {
    int n = s.length();
    int[][] lcp = new int[n+1][n+1];
    for (int i = n-1; i >= 0; i--)
        for (int j = n-1; j >= 0; j--)
            if (s.charAt(i)==s.charAt(j)) lcp[i][j]=lcp[i+1][j+1]+1;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = n-2; i >= 0; i--)
        for (int k = 1; k <= (n-i)/2; k++)
            if (lcp[i][i+k] >= k) dp[i] = Math.max(dp[i], 1+dp[i+k]);
    return dp[0];
}`,
  },

  defaultInput: {
    s: 'abcabcdabc',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcabcdabc',
      placeholder: 'abcabcdabc',
      helperText: 'Input string for deletion operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const lcp: number[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (s[i] === s[j]) lcp[i][j] = lcp[i + 1][j + 1] + 1;
      }
    }

    steps.push({
      line: 1,
      explanation: `Input s="${s}" (length ${n}). Build LCP table. lcp[i][j] = longest common prefix of s[i:] and s[j:].`,
      variables: { s, n },
      visualization: {
        type: 'array',
        array: lcp[0].slice(0, n),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const dp: number[] = new Array(n).fill(1);

    steps.push({
      line: 5,
      explanation: `Initialize dp[i]=1 for all i (minimum 1 operation from any position).`,
      variables: { dp: JSON.stringify(dp) },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    for (let i = n - 2; i >= 0; i--) {
      for (let k = 1; k <= Math.floor((n - i) / 2); k++) {
        if (lcp[i][i + k] >= k) {
          const prev = dp[i];
          dp[i] = Math.max(dp[i], 1 + dp[i + k]);
          if (dp[i] > prev) {
            steps.push({
              line: 8,
              explanation: `i=${i}, k=${k}: lcp[${i}][${i + k}]=${lcp[i][i + k]} >= ${k}. dp[${i}] = max(${prev}, 1+dp[${i + k}]=${1 + dp[i + k]}) = ${dp[i]}.`,
              variables: { i, k, 'dp[i]': dp[i] },
              visualization: {
                type: 'array',
                array: [...dp],
                highlights: { [i]: 'active', [i + k]: 'found' },
                labels: { [i]: `dp=${dp[i]}`, [i + k]: `+${dp[i + k]}` },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Result: dp[0] = ${dp[0]}. Maximum deletion operations = ${dp[0]}.`,
      variables: { result: dp[0] },
      visualization: {
        type: 'array',
        array: [...dp],
        highlights: { 0: 'found' },
        labels: { 0: `ans=${dp[0]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumDeletionsOnString;
