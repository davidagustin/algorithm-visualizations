import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const travelingSalesmanProblem: AlgorithmDefinition = {
  id: 'traveling-salesman-problem',
  title: 'Traveling Salesman Problem (TSP)',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Find the shortest route that visits every city exactly once and returns to the starting city. Classic TSP solved with bitmask DP (Held-Karp algorithm): dp[mask][i] = minimum distance to visit cities in mask, ending at city i, starting from city 0.',
  tags: ['Dynamic Programming', 'Bitmask', 'TSP', 'Graph', 'Held-Karp', 'Bit Manipulation'],
  code: {
    pseudocode: `function tsp(dist):
  n = number of cities
  INF = infinity
  dp[mask][i] = min dist visiting cities in mask, ending at i
  dp[1][0] = 0  // start at city 0
  for mask from 1 to 2^n-1:
    for i from 0 to n-1:
      if not (mask & (1<<i)): continue
      if dp[mask][i] == INF: continue
      for j from 0 to n-1:
        if mask & (1<<j): continue
        nm = mask | (1<<j)
        dp[nm][j] = min(dp[nm][j], dp[mask][i] + dist[i][j])
  full = (1<<n) - 1
  return min over i of dp[full][i] + dist[i][0]`,
    python: `def tsp(dist):
    n = len(dist)
    INF = float('inf')
    dp = [[INF]*n for _ in range(1<<n)]
    dp[1][0] = 0
    for mask in range(1, 1<<n):
        for i in range(n):
            if not (mask>>i&1) or dp[mask][i]==INF: continue
            for j in range(n):
                if mask>>j&1: continue
                nm = mask|(1<<j)
                dp[nm][j] = min(dp[nm][j], dp[mask][i]+dist[i][j])
    full = (1<<n)-1
    return min(dp[full][i]+dist[i][0] for i in range(1,n))`,
    javascript: `function tsp(dist) {
  const n = dist.length;
  const INF = Infinity;
  const dp = Array.from({length:1<<n},()=>new Array(n).fill(INF));
  dp[1][0] = 0;
  for (let mask=1;mask<(1<<n);mask++)
    for (let i=0;i<n;i++) {
      if (!(mask>>i&1)||dp[mask][i]===INF) continue;
      for (let j=0;j<n;j++) {
        if (mask>>j&1) continue;
        const nm=mask|(1<<j);
        dp[nm][j]=Math.min(dp[nm][j],dp[mask][i]+dist[i][j]);
      }
    }
  const full=(1<<n)-1;
  return Math.min(...Array.from({length:n-1},(_,k)=>dp[full][k+1]+dist[k+1][0]));
}`,
    java: `public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1<<n][n];
    for (int[] r:dp) Arrays.fill(r, Integer.MAX_VALUE/2);
    dp[1][0]=0;
    for (int mask=1;mask<(1<<n);mask++)
        for (int i=0;i<n;i++) {
            if ((mask>>i&1)==0||dp[mask][i]==Integer.MAX_VALUE/2) continue;
            for (int j=0;j<n;j++) {
                if ((mask>>j&1)!=0) continue;
                int nm=mask|(1<<j);
                dp[nm][j]=Math.min(dp[nm][j],dp[mask][i]+dist[i][j]);
            }
        }
    int full=(1<<n)-1, ans=Integer.MAX_VALUE;
    for (int i=1;i<n;i++) ans=Math.min(ans,dp[full][i]+dist[i][0]);
    return ans;
}`,
  },
  defaultInput: {
    dist: [[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]],
  },
  inputFields: [
    {
      name: 'dist',
      label: 'Distance Matrix (JSON)',
      type: 'string',
      defaultValue: '[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]',
      placeholder: '[[0,10],[10,0]]',
      helperText: 'JSON n x n symmetric distance matrix (max 4 cities)',
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
    const distN = dist.slice(0, n).map(row => row.slice(0, n));
    const INF = 99999;
    const size = 1 << n;

    const dpFlat: (number | null)[] = new Array(size * n).fill(INF);
    const labels: string[] = [];
    for (let mask = 0; mask < size; mask++) {
      for (let city = 0; city < n; city++) {
        labels.push(`${mask.toString(2).padStart(n,'0')}@C${city}`);
      }
    }
    const steps: AlgorithmStep[] = [];

    function idxF(mask: number, city: number): number { return mask * n + city; }
    function getV(mask: number, city: number): number { return dpFlat[idxF(mask, city)] as number; }
    function setV(mask: number, city: number, v: number): void { dpFlat[idxF(mask, city)] = v; }

    function makeViz(activeIdxF: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < size * n; i++) {
        if ((dpFlat[i] as number) < INF) highlights[i] = 'found';
      }
      if (activeIdxF !== null) highlights[activeIdxF] = 'active';
      return { type: 'dp-table', values: dpFlat.map(v => (v as number) >= INF ? null : v), highlights, labels };
    }

    setV(1, 0, 0);
    steps.push({
      line: 2,
      explanation: `TSP with ${n} cities (Held-Karp). dp[mask][i]=min dist visiting cities in mask ending at city i. Start at city 0: dp[{0}][0]=0.`,
      variables: { n, dist: distN },
      visualization: makeViz(idxF(1, 0)),
    });

    for (let mask = 1; mask < size; mask++) {
      for (let i = 0; i < n; i++) {
        if (!(mask >> i & 1)) continue;
        if (getV(mask, i) >= INF) continue;
        for (let j = 0; j < n; j++) {
          if (mask >> j & 1) continue;
          const nm = mask | (1 << j);
          const newCost = getV(mask, i) + distN[i][j];
          if (newCost < getV(nm, j)) {
            setV(nm, j, newCost);
            steps.push({
              line: 10,
              explanation: `mask=${mask.toString(2).padStart(n,'0')}, city ${i}->${j}: dist=${distN[i][j]}. dp[${nm.toString(2).padStart(n,'0')}][${j}]=${newCost}.`,
              variables: { mask, i, j, dist: distN[i][j], newCost },
              visualization: makeViz(idxF(nm, j)),
            });
          }
        }
      }
    }

    const fullMask = size - 1;
    let ans = INF;
    let bestIdx = idxF(fullMask, 0);
    for (let i = 1; i < n; i++) {
      const total = getV(fullMask, i) + distN[i][0];
      if (total < ans) {
        ans = total;
        bestIdx = idxF(fullMask, i);
      }
    }

    steps.push({
      line: 14,
      explanation: `Minimum TSP tour cost (visiting all ${n} cities and returning to start): ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(bestIdx),
    });

    return steps;
  },
};

export default travelingSalesmanProblem;
