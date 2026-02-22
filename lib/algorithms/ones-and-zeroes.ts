import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const onesAndZeroes: AlgorithmDefinition = {
  id: 'ones-and-zeroes',
  title: 'Ones and Zeroes',
  leetcodeNumber: 474,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of binary strings strs, and two integers m and n, return the size of the largest subset of strs such that there are at most m 0s and n 1s in the subset. This is a 2D 0/1 knapsack problem: dp[i][j] = largest subset using at most i zeros and j ones. For each string, count its zeros and ones, then update the DP table backwards to avoid using the same string twice.',
  tags: ['dp', '2d knapsack', '0/1 knapsack', 'binary strings'],

  code: {
    pseudocode: `function findMaxForm(strs, m, n):
  dp = 2D array (m+1) x (n+1), all 0
  for each string s in strs:
    zeros = count of '0' in s
    ones = count of '1' in s
    for i from m downto zeros:
      for j from n downto ones:
        dp[i][j] = max(dp[i][j], dp[i-zeros][j-ones] + 1)
  return dp[m][n]`,
    python: `def findMaxForm(strs: list, m: int, n: int) -> int:
    dp = [[0]*(n+1) for _ in range(m+1)]
    for s in strs:
        zeros = s.count('0')
        ones = s.count('1')
        for i in range(m, zeros-1, -1):
            for j in range(n, ones-1, -1):
                dp[i][j] = max(dp[i][j], dp[i-zeros][j-ones]+1)
    return dp[m][n]`,
    javascript: `function findMaxForm(strs, m, n) {
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (const s of strs) {
    const zeros = (s.match(/0/g)||[]).length;
    const ones = (s.match(/1/g)||[]).length;
    for (let i = m; i >= zeros; i--)
      for (let j = n; j >= ones; j--)
        dp[i][j] = Math.max(dp[i][j], dp[i-zeros][j-ones]+1);
  }
  return dp[m][n];
}`,
    java: `public int findMaxForm(String[] strs, int m, int n) {
    int[][] dp = new int[m+1][n+1];
    for (String s : strs) {
        int zeros=0, ones=0;
        for (char c : s.toCharArray()) { if(c=='0') zeros++; else ones++; }
        for (int i=m; i>=zeros; i--)
            for (int j=n; j>=ones; j--)
                dp[i][j] = Math.max(dp[i][j], dp[i-zeros][j-ones]+1);
    }
    return dp[m][n];
}`,
  },

  defaultInput: {
    strs: ['10', '0001', '111001', '1', '0'],
    m: 5,
    n: 3,
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Binary Strings',
      type: 'array',
      defaultValue: ['10', '0001', '111001', '1', '0'],
      placeholder: '10,0001,111001,1,0',
      helperText: 'Array of binary strings',
    },
    {
      name: 'm',
      label: 'Max Zeros (m)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum number of 0s allowed in subset',
    },
    {
      name: 'n',
      label: 'Max Ones (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum number of 1s allowed in subset',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const m = input.m as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    const flatDP = (): number[] => dp.flat();
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: flatDP(),
      highlights,
      labels: Array.from({ length: (m + 1) * (n + 1) }, (_, k) => {
        const r = Math.floor(k / (n + 1));
        const c = k % (n + 1);
        return `0s=${r},1s=${c}`;
      }),
    });

    steps.push({
      line: 1,
      explanation: `2D knapsack: m=${m} max zeros, n=${n} max ones. ${strs.length} strings. dp[i][j] = max subset size with at most i zeros and j ones.`,
      variables: { m, n, strings: strs.length },
      visualization: makeViz({}),
    });

    for (let si = 0; si < strs.length; si++) {
      const s = strs[si];
      const zeros = (s.match(/0/g) || []).length;
      const ones = (s.match(/1/g) || []).length;

      steps.push({
        line: 3,
        explanation: `String "${s}": zeros=${zeros}, ones=${ones}. Update DP backwards.`,
        variables: { string: s, zeros, ones },
        visualization: makeViz({}),
      });

      for (let i = m; i >= zeros; i--) {
        for (let j = n; j >= ones; j--) {
          const candidate = dp[i - zeros][j - ones] + 1;
          const prevIdx = (i - zeros) * (n + 1) + (j - ones);
          const curIdx = i * (n + 1) + j;
          if (candidate > dp[i][j]) {
            dp[i][j] = candidate;
            steps.push({
              line: 6,
              explanation: `dp[${i}][${j}] = max(${dp[i][j]}, dp[${i - zeros}][${j - ones}]+1) = ${dp[i][j]}. Include "${s}" in subset.`,
              variables: { i, j, 'dp[i][j]': dp[i][j], zeros, ones },
              visualization: makeViz({ [curIdx]: 'found', [prevIdx]: 'comparing' }),
            });
          }
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Largest subset size with at most ${m} zeros and ${n} ones = dp[${m}][${n}] = ${dp[m][n]}.`,
      variables: { result: dp[m][n] },
      visualization: makeViz({ [m * (n + 1) + n]: 'found' }),
    });

    return steps;
  },
};

export default onesAndZeroes;
