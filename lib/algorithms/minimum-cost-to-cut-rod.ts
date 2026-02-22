import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCostToCutRod: AlgorithmDefinition = {
  id: 'minimum-cost-to-cut-rod',
  title: 'Minimum Cost to Cut a Stick',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a rod of length n and cut positions, find the minimum cost to make all cuts. Cost of a cut = length of the segment being cut. DP on intervals: dp[i][j] = min cost to make all cuts between cut[i] and cut[j]. dp[i][j] = min over k of dp[i][k] + dp[k][j] + (cuts[j] - cuts[i]).',
  tags: ['Dynamic Programming', 'Interval DP'],
  code: {
    pseudocode: `function minCost(n, cuts):
  cuts = [0] + sort(cuts) + [n]
  m = length(cuts)
  dp[i][j] = min cost to make cuts between i and j
  for len from 2 to m-1:
    for i from 0 to m-1-len:
      j = i + len
      dp[i][j] = min over k in (i+1..j-1) of
        dp[i][k] + dp[k][j] + cuts[j] - cuts[i]
  return dp[0][m-1]`,
    python: `def minCost(n, cuts):
    cuts = sorted([0] + cuts + [n])
    m = len(cuts)
    dp = [[0]*m for _ in range(m)]
    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = float('inf')
            for k in range(i+1, j):
                dp[i][j] = min(dp[i][j],
                    dp[i][k] + dp[k][j] + cuts[j] - cuts[i])
    return dp[0][m-1]`,
    javascript: `function minCost(n, cuts) {
  cuts = [0, ...cuts.sort((a,b)=>a-b), n];
  const m = cuts.length;
  const dp = Array.from({length:m}, ()=>new Array(m).fill(0));
  for (let len = 2; len < m; len++) {
    for (let i = 0; i < m-len; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i+1; k < j; k++) {
        dp[i][j] = Math.min(dp[i][j],
          dp[i][k] + dp[k][j] + cuts[j] - cuts[i]);
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
    for (int len = 2; len < m; len++)
        for (int i = 0; i < m-len; i++) {
            int j = i + len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i+1; k < j; k++)
                dp[i][j] = Math.min(dp[i][j],
                    dp[i][k] + dp[k][j] + c[j] - c[i]);
        }
    return dp[0][m-1];
}`,
  },
  defaultInput: { n: 7, cuts: [1, 3, 4, 5] },
  inputFields: [
    {
      name: 'n',
      label: 'Rod Length (n)',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Total length of the rod',
    },
    {
      name: 'cuts',
      label: 'Cut Positions',
      type: 'array',
      defaultValue: [1, 3, 4, 5],
      placeholder: '1,3,4,5',
      helperText: 'Positions where cuts should be made',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const rawCuts = input.cuts as number[];
    const cuts = [0, ...rawCuts.slice().sort((a, b) => a - b), n];
    const m = cuts.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    const labels: string[] = [];
    for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) labels.push(`[${i},${j}]`);

    function flatDp(): (number | null)[] {
      return dp.flat().map(v => v === 0 ? null : v);
    }

    function makeViz(activeI: number, activeJ: number): DPVisualization {
      const vals = flatDp();
      const highlights: Record<number, string> = {};
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
          const idx = i * m + j;
          if (i === activeI && j === activeJ) highlights[idx] = 'active';
          else if (dp[i][j] > 0) highlights[idx] = 'found';
        }
      }
      return { type: 'dp-table', values: vals, highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Sorted cuts with endpoints: [${cuts.join(', ')}]. dp[i][j] = min cost to cut segment from cuts[i] to cuts[j].`,
      variables: { cuts, m },
      visualization: makeViz(-1, -1),
    });

    for (let len = 2; len < m; len++) {
      for (let i = 0; i < m - len; i++) {
        const j = i + len;
        dp[i][j] = Infinity;
        for (let k = i + 1; k < j; k++) {
          const candidate = dp[i][k] + dp[k][j] + cuts[j] - cuts[i];
          if (candidate < dp[i][j]) {
            dp[i][j] = candidate;
          }
        }

        steps.push({
          line: 7,
          explanation: `dp[${i}][${j}]: segment [${cuts[i]},${cuts[j]}], cost=${dp[i][j]}. Length ${cuts[j] - cuts[i]}.`,
          variables: { i, j, 'cuts[i]': cuts[i], 'cuts[j]': cuts[j], 'dp[i][j]': dp[i][j] },
          visualization: makeViz(i, j),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Answer = dp[0][${m - 1}] = ${dp[0][m - 1]}. Minimum cost to cut the rod.`,
      variables: { result: dp[0][m - 1] },
      visualization: makeViz(0, m - 1),
    });

    return steps;
  },
};

export default minimumCostToCutRod;
