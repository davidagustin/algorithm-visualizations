import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToCutStick: AlgorithmDefinition = {
  id: 'minimum-cost-to-cut-stick',
  title: 'Minimum Cost to Cut a Stick',
  leetcodeNumber: 1547,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a stick of length n and cut positions, find the minimum total cost to make all cuts. Cost of a cut equals the current stick length. Use interval DP: dp[i][j] = min cost to make all cuts between positions cuts[i] and cuts[j], considering augmented endpoints 0 and n.',
  tags: ['dynamic programming', 'interval dp', 'divide and conquer'],

  code: {
    pseudocode: `function minCost(n, cuts):
  cuts = sort([0] + cuts + [n])
  m = len(cuts)
  dp[i][j] = 0 for all i, j
  for length from 2 to m-1:
    for i from 0 to m-1-length:
      j = i + length
      dp[i][j] = Infinity
      for k from i+1 to j-1:
        dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + cuts[j] - cuts[i])
  return dp[0][m-1]`,
    python: `def minCost(n: int, cuts: list[int]) -> int:
    cuts = sorted([0] + cuts + [n])
    m = len(cuts)
    dp = [[0] * m for _ in range(m)]
    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i + 1, j):
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + cuts[j] - cuts[i])
    return dp[0][m-1]`,
    javascript: `function minCost(n, cuts) {
  cuts = [0, ...cuts.sort((a,b)=>a-b), n];
  const m = cuts.length;
  const dp = Array.from({length:m}, () => new Array(m).fill(0));
  for (let len = 2; len < m; len++) {
    for (let i = 0; i <= m - len - 1; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + cuts[j] - cuts[i]);
      }
    }
  }
  return dp[0][m-1];
}`,
    java: `public int minCost(int n, int[] cuts) {
    int[] c = new int[cuts.length + 2];
    c[0] = 0; c[c.length-1] = n;
    for (int i = 0; i < cuts.length; i++) c[i+1] = cuts[i];
    Arrays.sort(c);
    int m = c.length;
    int[][] dp = new int[m][m];
    for (int len = 2; len < m; len++) {
        for (int i = 0; i <= m - len - 1; i++) {
            int j = i + len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + c[j] - c[i]);
            }
        }
    }
    return dp[0][m-1];
}`,
  },

  defaultInput: {
    n: 7,
    cuts: [1, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Stick Length',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Length of the stick',
    },
    {
      name: 'cuts',
      label: 'Cut Positions',
      type: 'array',
      defaultValue: [1, 3, 4, 5],
      placeholder: '1,3,4,5',
      helperText: 'Positions to cut the stick',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const cutsInput = input.cuts as number[];
    const steps: AlgorithmStep[] = [];

    const cuts = [0, ...cutsInput.slice().sort((a, b) => a - b), n];
    const m = cuts.length;
    const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));

    steps.push({
      line: 2,
      explanation: `Sort cuts with endpoints: [${cuts.join(', ')}]. m = ${m} points.`,
      variables: { cuts: cuts.join(','), m },
      visualization: {
        type: 'array',
        array: [...cuts],
        highlights: { 0: 'pointer', [m - 1]: 'pointer' },
        labels: Object.fromEntries(cuts.map((v, i) => [i, String(v)])),
      },
    });

    for (let len = 2; len < m; len++) {
      for (let i = 0; i <= m - len - 1; i++) {
        const j = i + len;
        dp[i][j] = Infinity;
        for (let k = i + 1; k < j; k++) {
          const candidate = dp[i][k] + dp[k][j] + cuts[j] - cuts[i];
          if (candidate < dp[i][j]) {
            dp[i][j] = candidate;
            steps.push({
              line: 10,
              explanation: `Interval [${cuts[i]},${cuts[j]}]: cut at ${cuts[k]}, cost = ${dp[i][k]} + ${dp[k][j]} + ${cuts[j] - cuts[i]} = ${dp[i][j]}.`,
              variables: { i, j, k, 'cuts[i]': cuts[i], 'cuts[j]': cuts[j], 'cuts[k]': cuts[k], 'dp[i][j]': dp[i][j] },
              visualization: {
                type: 'array',
                array: [...cuts],
                highlights: { [i]: 'active', [j]: 'active', [k]: 'found' },
                labels: { [i]: `i=${cuts[i]}`, [j]: `j=${cuts[j]}`, [k]: `k=${cuts[k]}` },
              },
            });
          }
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Minimum cost to cut stick of length ${n} at all positions = ${dp[0][m - 1]}.`,
      variables: { result: dp[0][m - 1] },
      visualization: {
        type: 'array',
        array: [...cuts],
        highlights: { 0: 'found', [m - 1]: 'found' },
        labels: { 0: 'start', [m - 1]: 'end' },
      },
    });

    return steps;
  },
};

export default minimumCostToCutStick;
