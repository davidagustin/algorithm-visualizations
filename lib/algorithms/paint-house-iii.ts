import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const paintHouseIii: AlgorithmDefinition = {
  id: 'paint-house-iii',
  title: 'Paint House III',
  leetcodeNumber: 1473,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Paint n houses with k colors to form exactly target neighborhoods. Some houses are already painted (value > 0). Minimize total cost. State: dp[i][j][t] = min cost to paint houses 0..i where house i has color j and there are t neighborhoods. Uses 3D DP with transitions across colors.',
  tags: ['dynamic programming', '3d dp', 'grid', 'optimization'],

  code: {
    pseudocode: `function minCost(houses, cost, n, k, target):
  dp[i][j][t] = min cost for first i+1 houses, house i color j, t neighborhoods
  Initialize dp[0][j][1] based on whether house 0 is precolored
  for i from 1 to n-1:
    for j from 1 to k: (color)
      for t from 1 to target:
        for pj from 1 to k: (prev color)
          new_t = t if j==pj else t-1
          dp[i][j][t] = min(dp[i][j][t], dp[i-1][pj][new_t] + paintCost)
  return min of dp[n-1][*][target]`,
    python: `def minCost(houses, cost, n, k, target):
    INF = float('inf')
    dp = [[[INF]*(target+1) for _ in range(k+1)] for _ in range(n)]
    for j in range(1, k+1):
        if houses[0]==0: dp[0][j][1] = cost[0][j-1]
        elif houses[0]==j: dp[0][j][1] = 0
    for i in range(1,n):
        for j in range(1,k+1):
            if houses[i] and houses[i]!=j: continue
            paint = 0 if houses[i] else cost[i][j-1]
            for t in range(1,target+1):
                for pj in range(1,k+1):
                    nt = t if j==pj else t-1
                    if nt>=1 and dp[i-1][pj][nt]<INF:
                        dp[i][j][t]=min(dp[i][j][t],dp[i-1][pj][nt]+paint)
    ans = min(dp[n-1][j][target] for j in range(1,k+1))
    return -1 if ans==INF else ans`,
    javascript: `function minCost(houses, cost, n, k, target) {
  const INF = Infinity;
  const dp = Array.from({length:n},()=>Array.from({length:k+1},()=>Array(target+1).fill(INF)));
  for (let j=1;j<=k;j++) {
    if (!houses[0]) dp[0][j][1]=cost[0][j-1];
    else if (houses[0]===j) dp[0][j][1]=0;
  }
  for (let i=1;i<n;i++)
    for (let j=1;j<=k;j++) {
      if (houses[i]&&houses[i]!==j) continue;
      const paint = houses[i] ? 0 : cost[i][j-1];
      for (let t=1;t<=target;t++)
        for (let pj=1;pj<=k;pj++) {
          const nt = j===pj ? t : t-1;
          if (nt>=1&&dp[i-1][pj][nt]<INF)
            dp[i][j][t]=Math.min(dp[i][j][t],dp[i-1][pj][nt]+paint);
        }
    }
  const ans=Math.min(...Array.from({length:k},(_,j)=>dp[n-1][j+1][target]));
  return ans===INF?-1:ans;
}`,
    java: `public int minCost(int[] houses, int[][] cost, int n, int k, int target) {
    int INF = Integer.MAX_VALUE/2;
    int[][][] dp = new int[n][k+1][target+1];
    for (int[][] a:dp) for(int[] b:a) Arrays.fill(b,INF);
    for (int j=1;j<=k;j++) {
        if (houses[0]==0) dp[0][j][1]=cost[0][j-1];
        else if (houses[0]==j) dp[0][j][1]=0;
    }
    for (int i=1;i<n;i++)
        for (int j=1;j<=k;j++) {
            if (houses[i]!=0&&houses[i]!=j) continue;
            int paint=houses[i]!=0?0:cost[i][j-1];
            for (int t=1;t<=target;t++)
                for (int pj=1;pj<=k;pj++) {
                    int nt=j==pj?t:t-1;
                    if (nt>=1&&dp[i-1][pj][nt]<INF)
                        dp[i][j][t]=Math.min(dp[i][j][t],dp[i-1][pj][nt]+paint);
                }
        }
    int ans=INF;
    for (int j=1;j<=k;j++) ans=Math.min(ans,dp[n-1][j][target]);
    return ans==INF?-1:ans;
}`,
  },

  defaultInput: {
    houses: [0, 0, 0, 0, 0],
    cost: [[1, 10], [10, 1], [10, 1], [1, 10], [5, 1]],
    n: 5,
    k: 2,
    target: 3,
  },

  inputFields: [
    {
      name: 'houses',
      label: 'Houses (0=unpainted)',
      type: 'array',
      defaultValue: [0, 0, 0, 0, 0],
      placeholder: '0,0,0,0,0',
      helperText: 'Precolored houses (0 means unpainted)',
    },
    {
      name: 'cost',
      label: 'Paint Costs per house per color',
      type: 'array',
      defaultValue: [[1, 10], [10, 1], [10, 1], [1, 10], [5, 1]],
      placeholder: '[[1,10],[10,1],...]',
      helperText: '2D array: cost[i][j] = cost to paint house i with color j+1',
    },
    {
      name: 'n',
      label: 'Number of Houses',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total number of houses',
    },
    {
      name: 'k',
      label: 'Number of Colors',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Total number of colors available',
    },
    {
      name: 'target',
      label: 'Target Neighborhoods',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Required number of neighborhoods',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const houses = input.houses as number[];
    const cost = input.cost as number[][];
    const n = input.n as number;
    const k = input.k as number;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const INF = 1e9;
    const dp: number[][][] = Array.from({ length: n }, () =>
      Array.from({ length: k + 1 }, () => Array(target + 1).fill(INF))
    );

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    // Init first house
    for (let j = 1; j <= k; j++) {
      if (houses[0] === 0) dp[0][j][1] = cost[0][j - 1];
      else if (houses[0] === j) dp[0][j][1] = 0;
    }

    const initRow = Array.from({ length: k }, (_, j) => dp[0][j + 1][1] === INF ? -1 : dp[0][j + 1][1]);
    steps.push({
      line: 3,
      explanation: `Initialize house 0. Cost per color for 1 neighborhood: [${initRow.join(', ')}] (-1 = invalid)`,
      variables: { house: 0, precolor: houses[0], neighborhoods: 1 },
      visualization: makeViz(initRow, {}, {}),
    });

    for (let i = 1; i < n; i++) {
      for (let j = 1; j <= k; j++) {
        if (houses[i] && houses[i] !== j) continue;
        const paint = houses[i] ? 0 : cost[i][j - 1];
        for (let t = 1; t <= target; t++) {
          for (let pj = 1; pj <= k; pj++) {
            const nt = j === pj ? t : t - 1;
            if (nt >= 1 && dp[i - 1][pj][nt] < INF) {
              dp[i][j][t] = Math.min(dp[i][j][t], dp[i - 1][pj][nt] + paint);
            }
          }
        }
      }

      const rowSlice = Array.from({ length: k }, (_, j) => dp[i][j + 1][Math.min(target, i + 1)] === INF ? -1 : dp[i][j + 1][Math.min(target, i + 1)]);
      const hi: Record<number, string> = {};
      let bestIdx = 0;
      for (let j = 1; j < rowSlice.length; j++) {
        if (rowSlice[j] !== -1 && (rowSlice[bestIdx] === -1 || rowSlice[j] < rowSlice[bestIdx])) bestIdx = j;
      }
      if (rowSlice[bestIdx] !== -1) hi[bestIdx] = 'active';

      steps.push({
        line: 9,
        explanation: `House ${i}: dp costs for target neighborhoods so far: [${rowSlice.join(', ')}]`,
        variables: { house: i, color: bestIdx + 1, minCost: rowSlice[bestIdx] },
        visualization: makeViz(rowSlice, hi, {}),
      });
    }

    let ans = INF;
    for (let j = 1; j <= k; j++) if (dp[n - 1][j][target] < ans) ans = dp[n - 1][j][target];
    if (ans === INF) ans = -1;

    const finalRow = Array.from({ length: k }, (_, j) => dp[n - 1][j + 1][target] === INF ? -1 : dp[n - 1][j + 1][target]);
    steps.push({
      line: 12,
      explanation: `Final answer: minimum cost to paint all houses with exactly ${target} neighborhoods = ${ans}`,
      variables: { answer: ans, target },
      visualization: makeViz(finalRow, {}, {}),
    });

    return steps;
  },
};

export default paintHouseIii;
