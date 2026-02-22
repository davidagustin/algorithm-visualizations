import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const cheapestFlightsKStopsDp: AlgorithmDefinition = {
  id: 'cheapest-flights-k-stops-dp',
  title: 'Cheapest Flights Within K Stops (DP/Bellman-Ford)',
  leetcodeNumber: 787,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find cheapest flight from src to dst with at most k stops using Bellman-Ford DP. dp[i][v] = minimum cost to reach v using exactly i edges. Run k+1 Bellman-Ford iterations, where each iteration allows one more stop. Key: use a copy of the previous iteration to avoid using more than i edges.',
  tags: ['graph', 'Bellman-Ford', 'dynamic programming', 'k stops', 'flights'],

  code: {
    pseudocode: `function findCheapestPrice(n, flights, src, dst, k):
  dp = array of INF, dp[src] = 0
  for i in 1 to k+1:
    temp = copy of dp
    for each flight (u, v, price):
      if dp[u] != INF:
        temp[v] = min(temp[v], dp[u] + price)
    dp = temp
  return dp[dst] if dp[dst] != INF else -1`,

    python: `def findCheapestPrice(n, flights, src, dst, k):
    INF = float('inf')
    dp = [INF] * n
    dp[src] = 0
    for _ in range(k+1):
        temp = dp[:]
        for u,v,price in flights:
            if dp[u] != INF and dp[u]+price < temp[v]:
                temp[v] = dp[u]+price
        dp = temp
    return dp[dst] if dp[dst] != INF else -1`,

    javascript: `function findCheapestPrice(n, flights, src, dst, k) {
  const INF = Infinity;
  let dp = new Array(n).fill(INF);
  dp[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = [...dp];
    for (const [u,v,price] of flights) {
      if (dp[u] !== INF && dp[u]+price < temp[v]) {
        temp[v] = dp[u]+price;
      }
    }
    dp = temp;
  }
  return dp[dst] === INF ? -1 : dp[dst];
}`,

    java: `public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] dp = new int[n];
    Arrays.fill(dp, Integer.MAX_VALUE/2);
    dp[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] temp = dp.clone();
        for (int[] f : flights)
            if (dp[f[0]] < Integer.MAX_VALUE/2 && dp[f[0]]+f[2] < temp[f[1]])
                temp[f[1]] = dp[f[0]]+f[2];
        dp = temp;
    }
    return dp[dst] >= Integer.MAX_VALUE/2 ? -1 : dp[dst];
}`,
  },

  defaultInput: {
    n: 4,
    flights: [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],
    src: 0,
    dst: 3,
    k: 1,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total cities (0 to n-1)',
    },
    {
      name: 'src',
      label: 'Source City',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Departure city',
    },
    {
      name: 'dst',
      label: 'Destination City',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Arrival city',
    },
    {
      name: 'k',
      label: 'Max Stops',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Maximum number of intermediate stops',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const flights = input.flights as number[][];
    const src = input.src as number;
    const dst = input.dst as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    let dp = new Array(n).fill(INF);
    dp[src] = 0;

    steps.push({
      line: 2,
      explanation: `Init DP: dp[${src}]=0, all others=INF. Run k+1=${k + 1} Bellman-Ford iterations (one per allowed edge).`,
      variables: { src, dst, k, iterations: k + 1 },
      visualization: {
        type: 'array',
        array: dp.map(d => (d === INF ? 999 : d)),
        highlights: { [src]: 'active', [dst]: 'pointer' },
        labels: { [src]: 'src=0', [dst]: 'dst' },
      },
    });

    for (let i = 0; i <= k; i++) {
      const temp = [...dp];
      let relaxed = false;

      for (const [u, v, price] of flights) {
        if (dp[u] !== INF && dp[u] + price < temp[v]) {
          const old = temp[v];
          temp[v] = dp[u] + price;
          relaxed = true;
          steps.push({
            line: 6,
            explanation: `Iteration ${i + 1} (stops used: ${i}): Flight ${u}->${v} (price ${price}). Cost ${dp[u]}+${price}=${temp[v]} < ${old === INF ? 'INF' : old}. Update temp[${v}]=${temp[v]}.`,
            variables: { iteration: i + 1, from: u, to: v, price, newCost: temp[v], stopsUsed: i },
            visualization: {
              type: 'array',
              array: temp.map(d => (d === INF ? 999 : d)),
              highlights: { [u]: 'active', [v]: 'comparing', [src]: 'sorted', [dst]: 'pointer' },
              labels: { [v]: `=${temp[v]}` },
            },
          });
        }
      }

      dp = temp;
      steps.push({
        line: 8,
        explanation: `After iteration ${i + 1} (at most ${i} stop${i === 1 ? '' : 's'}): dp = [${dp.map(d => (d === INF ? 'INF' : d)).join(', ')}].`,
        variables: { iteration: i + 1, dp: dp.map(d => (d === INF ? 'INF' : d)) },
        visualization: {
          type: 'array',
          array: dp.map(d => (d === INF ? 999 : d)),
          highlights: { [dst]: dp[dst] < INF ? 'found' : 'mismatch' },
          labels: { [dst]: `dst=${dp[dst] < INF ? dp[dst] : 'INF'}` },
        },
      });

      if (!relaxed) break;
    }

    steps.push({
      line: 9,
      explanation: `Final: cheapest flight from ${src} to ${dst} with at most ${k} stop${k === 1 ? '' : 's'} = ${dp[dst] === INF ? -1 : dp[dst]}.`,
      variables: { result: dp[dst] === INF ? -1 : dp[dst] },
      visualization: {
        type: 'array',
        array: dp.map(d => (d === INF ? 999 : d)),
        highlights: { [src]: 'found', [dst]: 'found' },
        labels: { [src]: 'src', [dst]: `ans=${dp[dst] === INF ? -1 : dp[dst]}` },
      },
    });

    return steps;
  },
};

export default cheapestFlightsKStopsDp;
