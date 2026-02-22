import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCostToVisitEveryNode: AlgorithmDefinition = {
  id: 'minimum-cost-to-visit-every-node',
  title: 'Minimum Cost to Visit Every Node (TSP Variant)',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Find the minimum cost path that visits every node in a weighted graph starting from node 0. This is the Travelling Salesman Problem solved with bitmask DP: dp[mask][i] = minimum cost to have visited nodes in mask, currently at node i.',
  tags: ['Dynamic Programming', 'Bitmask', 'TSP', 'Graph', 'Bit Manipulation'],
  code: {
    pseudocode: `function minCostVisitAllNodes(dist):
  n = number of nodes
  INF = infinity
  dp[mask][i] = min cost visiting nodes in mask, ending at i
  dp[1][0] = 0  // start at node 0
  for mask from 1 to 2^n - 1:
    for i from 0 to n-1:
      if not (mask & (1<<i)): continue
      if dp[mask][i] == INF: continue
      for j from 0 to n-1:
        if mask & (1<<j): continue
        dp[mask|(1<<j)][j] = min(dp[mask|(1<<j)][j], dp[mask][i] + dist[i][j])
  return min over i of dp[(1<<n)-1][i]`,
    python: `def minCostVisitAllNodes(dist):
    n = len(dist)
    INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1, 1 << n):
        for i in range(n):
            if not (mask >> i & 1): continue
            if dp[mask][i] == INF: continue
            for j in range(n):
                if mask >> j & 1: continue
                nm = mask | (1 << j)
                dp[nm][j] = min(dp[nm][j], dp[mask][i] + dist[i][j])
    full = (1 << n) - 1
    return min(dp[full])`,
    javascript: `function minCostVisitAllNodes(dist) {
  const n = dist.length;
  const INF = Infinity;
  const dp = Array.from({length: 1<<n}, ()=>new Array(n).fill(INF));
  dp[1][0] = 0;
  for (let mask = 1; mask < (1<<n); mask++) {
    for (let i = 0; i < n; i++) {
      if (!(mask>>i&1) || dp[mask][i]===INF) continue;
      for (let j = 0; j < n; j++) {
        if (mask>>j&1) continue;
        const nm = mask|(1<<j);
        dp[nm][j] = Math.min(dp[nm][j], dp[mask][i]+dist[i][j]);
      }
    }
  }
  return Math.min(...dp[(1<<n)-1]);
}`,
    java: `public int minCostVisitAllNodes(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1<<n][n];
    for (int[] r : dp) Arrays.fill(r, Integer.MAX_VALUE/2);
    dp[1][0] = 0;
    for (int mask = 1; mask < (1<<n); mask++)
        for (int i = 0; i < n; i++) {
            if ((mask>>i&1)==0 || dp[mask][i]==Integer.MAX_VALUE/2) continue;
            for (int j = 0; j < n; j++) {
                if ((mask>>j&1)!=0) continue;
                int nm = mask|(1<<j);
                dp[nm][j] = Math.min(dp[nm][j], dp[mask][i]+dist[i][j]);
            }
        }
    int ans = Integer.MAX_VALUE;
    for (int x : dp[(1<<n)-1]) ans = Math.min(ans, x);
    return ans;
}`,
  },
  defaultInput: { dist: [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]] },
  inputFields: [
    {
      name: 'dist',
      label: 'Distance Matrix (JSON)',
      type: 'string',
      defaultValue: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]',
      placeholder: '[[0,10],[10,0]]',
      helperText: 'JSON 2D distance matrix (max 4 nodes)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let dist: number[][];
    try {
      dist = JSON.parse(input.dist as string) as number[][];
    } catch {
      dist = [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]];
    }
    const n = Math.min(dist.length, 4);
    const INF = 99999;
    const size = 1 << n;
    const dpFlat: (number | null)[] = new Array(size * n).fill(INF);
    const labels: string[] = [];
    for (let mask = 0; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        labels.push(`${mask.toString(2).padStart(n,'0')}@${i}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function idx(mask: number, node: number): number { return mask * n + node; }
    function getVal(mask: number, node: number): number { return dpFlat[idx(mask, node)] as number; }
    function setVal(mask: number, node: number, v: number): void { dpFlat[idx(mask, node)] = v; }

    function makeViz(activeIdxFlat: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < size * n; i++) {
        if ((dpFlat[i] as number) < INF) highlights[i] = 'found';
      }
      if (activeIdxFlat !== null) highlights[activeIdxFlat] = 'active';
      return { type: 'dp-table', values: dpFlat.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    setVal(1, 0, 0);
    steps.push({
      line: 2,
      explanation: `n=${n} nodes. dp[mask][i]=min cost visiting nodes in mask ending at i. dp[{node0}][0]=0.`,
      variables: { n },
      visualization: makeViz(idx(1, 0)),
    });

    for (let mask = 1; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask >> i & 1)) continue;
        if (getVal(mask, i) >= INF) continue;
        for (let j = 0; j < n; j++) {
          if (mask >> j & 1) continue;
          const nm = mask | (1 << j);
          const newCost = getVal(mask, i) + dist[i][j];
          if (newCost < getVal(nm, j)) {
            setVal(nm, j, newCost);
            steps.push({
              line: 10,
              explanation: `mask=${mask.toString(2).padStart(n,'0')}, i=${i}->j=${j}: cost=${getVal(mask,i)}+${dist[i][j]}=${newCost}. dp[${nm.toString(2).padStart(n,'0')}][${j}]=${newCost}.`,
              variables: { mask, i, j, newCost },
              visualization: makeViz(idx(nm, j)),
            });
          }
        }
      }
    }

    const fullMask = size - 1;
    let ans = INF;
    let bestIdx = 0;
    for (let i = 0; i < n; i++) {
      if (getVal(fullMask, i) < ans) {
        ans = getVal(fullMask, i);
        bestIdx = idx(fullMask, i);
      }
    }
    steps.push({
      line: 12,
      explanation: `Minimum cost to visit all ${n} nodes: ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(bestIdx),
    });

    return steps;
  },
};

export default minimumCostToVisitEveryNode;
