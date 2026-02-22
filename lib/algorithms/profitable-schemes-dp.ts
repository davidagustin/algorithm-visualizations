import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const profitableSchemesDp: AlgorithmDefinition = {
  id: 'profitable-schemes-dp',
  title: 'Profitable Schemes - DP',
  leetcodeNumber: 879,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count subsets of crimes such that the total members used is at most n and total profit >= minProfit. Use 2D DP where dp[j][p] = ways to have j members and at least p profit. For each crime, update dp in reverse. Profit clamped at minProfit to avoid over-counting.',
  tags: ['dynamic programming', '2D knapsack', 'counting', 'modular arithmetic'],

  code: {
    pseudocode: `function profitableSchemes(n, minProfit, group, profit):
  MOD = 1e9 + 7
  dp[j][p] = ways using j members with at least p profit
  dp[0][0] = 1
  for each crime i:
    g = group[i], p = profit[i]
    for j from n down to g:
      for k from minProfit down to 0:
        dp[j][min(k+p, minProfit)] += dp[j-g][k]
  return sum(dp[j][minProfit]) for j in 0..n`,
    python: `def profitableSchemes(n: int, minProfit: int, group: list[int], profit: list[int]) -> int:
    MOD = 10**9 + 7
    dp = [[0] * (minProfit + 1) for _ in range(n + 1)]
    dp[0][0] = 1
    for g, p in zip(group, profit):
        for j in range(n, g - 1, -1):
            for k in range(minProfit, -1, -1):
                dp[j][min(k + p, minProfit)] = (dp[j][min(k+p,minProfit)] + dp[j-g][k]) % MOD
    return sum(dp[j][minProfit] for j in range(n + 1)) % MOD`,
    javascript: `function profitableSchemes(n, minProfit, group, profit) {
  const MOD = 1e9 + 7;
  const dp = Array.from({length: n+1}, () => new Array(minProfit+1).fill(0));
  dp[0][0] = 1;
  for (let i = 0; i < group.length; i++) {
    const g = group[i], p = profit[i];
    for (let j = n; j >= g; j--) {
      for (let k = minProfit; k >= 0; k--) {
        dp[j][Math.min(k+p,minProfit)] = (dp[j][Math.min(k+p,minProfit)] + dp[j-g][k]) % MOD;
      }
    }
  }
  return dp.reduce((s, row) => (s + row[minProfit]) % MOD, 0);
}`,
    java: `public int profitableSchemes(int n, int minProfit, int[] group, int[] profit) {
    final int MOD = 1_000_000_007;
    int[][] dp = new int[n+1][minProfit+1];
    dp[0][0] = 1;
    for (int i = 0; i < group.length; i++) {
        int g = group[i], p = profit[i];
        for (int j = n; j >= g; j--)
            for (int k = minProfit; k >= 0; k--)
                dp[j][Math.min(k+p,minProfit)] = (dp[j][Math.min(k+p,minProfit)] + dp[j-g][k]) % MOD;
    }
    int ans = 0;
    for (int j = 0; j <= n; j++) ans = (ans + dp[j][minProfit]) % MOD;
    return ans;
}`,
  },

  defaultInput: {
    n: 5,
    minProfit: 3,
    group: [2, 2],
    profit: [2, 3],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Max Members (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Maximum gang members available',
    },
    {
      name: 'minProfit',
      label: 'Min Profit',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minimum required profit',
    },
    {
      name: 'group',
      label: 'Group Sizes',
      type: 'array',
      defaultValue: [2, 2],
      placeholder: '2,2',
      helperText: 'Members required for each crime',
    },
    {
      name: 'profit',
      label: 'Profits',
      type: 'array',
      defaultValue: [2, 3],
      placeholder: '2,3',
      helperText: 'Profit from each crime',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const minProfit = input.minProfit as number;
    const group = input.group as number[];
    const profit = input.profit as number[];
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(minProfit + 1).fill(0));
    dp[0][0] = 1;

    const makeViz = (dpRow: number[], activeIdx: number): DPVisualization => {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < dpRow.length; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dpRow[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return {
        type: 'dp-table',
        values: dpRow.slice(),
        highlights,
        labels: dpRow.map((_, i) => `p>=${i}`),
      };
    };

    steps.push({
      line: 3,
      explanation: `Initialize dp[0..${n}][0..${minProfit}] = 0, dp[0][0] = 1. n=${n}, minProfit=${minProfit}.`,
      variables: { n, minProfit, crimes: group.length },
      visualization: makeViz([...dp[0]], 0),
    });

    for (let i = 0; i < group.length; i++) {
      const g = group[i];
      const p = profit[i];
      steps.push({
        line: 5,
        explanation: `Crime ${i + 1}: group=${g}, profit=${p}. Updating dp in reverse.`,
        variables: { crime: i + 1, g, p },
        visualization: makeViz([...dp[Math.min(g, n)]], -1),
      });
      for (let j = n; j >= g; j--) {
        for (let k = minProfit; k >= 0; k--) {
          const newP = Math.min(k + p, minProfit);
          if (dp[j - g][k] > 0) {
            dp[j][newP] = (dp[j][newP] + dp[j - g][k]) % MOD;
          }
        }
      }
      steps.push({
        line: 9,
        explanation: `After crime ${i + 1}: dp row j=${g} = [${dp[Math.min(g, n)].join(', ')}].`,
        variables: { crime: i + 1 },
        visualization: makeViz([...dp[Math.min(g, n)]], minProfit),
      });
    }

    let result = 0;
    for (let j = 0; j <= n; j++) result = (result + dp[j][minProfit]) % MOD;

    steps.push({
      line: 10,
      explanation: `Sum dp[j][${minProfit}] for j=0..${n} = ${result}. Total profitable schemes.`,
      variables: { result },
      visualization: makeViz([...dp[0]], minProfit),
    });

    return steps;
  },
};

export default profitableSchemesDp;
