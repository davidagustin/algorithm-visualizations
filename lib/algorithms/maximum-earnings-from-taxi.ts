import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumEarningsFromTaxi: AlgorithmDefinition = {
  id: 'maximum-earnings-from-taxi',
  title: 'Maximum Earnings From Taxi',
  leetcodeNumber: 2008,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given sorted rides [start, end, tip], find the maximum earnings. dp[i] = max earnings at position i. For each position, either skip (dp[i] = dp[i-1]) or take a ride ending at i: dp[end] = max(dp[end], dp[start] + end - start + tip). Use coordinate-compressed DP over ride endpoints.',
  tags: ['dynamic programming', 'sorting', 'binary search', 'greedy'],

  code: {
    pseudocode: `function maxTaxiEarnings(n, rides):
  sort rides by end time
  dp = array of size n+1, all 0
  for each [start, end, tip] in rides:
    dp[end] = max(dp[end], dp[start] + end - start + tip)
  for i from 1 to n:
    dp[i] = max(dp[i], dp[i-1])
  return dp[n]`,
    python: `def maxTaxiEarnings(n: int, rides: list[list[int]]) -> int:
    dp = [0] * (n + 1)
    rides.sort(key=lambda r: r[1])
    for start, end, tip in rides:
        dp[end] = max(dp[end], dp[start] + end - start + tip)
    for i in range(1, n + 1):
        dp[i] = max(dp[i], dp[i-1])
    return dp[n]`,
    javascript: `function maxTaxiEarnings(n, rides) {
  const dp = new Array(n + 1).fill(0);
  rides.sort((a, b) => a[1] - b[1]);
  for (const [start, end, tip] of rides) {
    dp[end] = Math.max(dp[end], dp[start] + end - start + tip);
  }
  for (let i = 1; i <= n; i++) {
    dp[i] = Math.max(dp[i], dp[i-1]);
  }
  return dp[n];
}`,
    java: `public long maxTaxiEarnings(int n, int[][] rides) {
    long[] dp = new long[n + 1];
    Arrays.sort(rides, (a, b) -> a[1] - b[1]);
    for (int[] ride : rides) {
        dp[ride[1]] = Math.max(dp[ride[1]], dp[ride[0]] + ride[1] - ride[0] + ride[2]);
    }
    for (int i = 1; i <= n; i++) {
        dp[i] = Math.max(dp[i], dp[i-1]);
    }
    return dp[n];
}`,
  },

  defaultInput: {
    n: 7,
    rides: [2, 4, 6, 1, 5, 1, 5, 7, 7],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Road Length (n)',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Length of the road',
    },
    {
      name: 'rides',
      label: 'Rides (start,end,tip triples)',
      type: 'array',
      defaultValue: [2, 4, 6, 1, 5, 1, 5, 7, 7],
      placeholder: '2,4,6,1,5,1,5,7,7',
      helperText: 'Alternating start, end, tip for each ride',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const flatRides = input.rides as number[];
    const steps: AlgorithmStep[] = [];

    const rides: [number, number, number][] = [];
    for (let i = 0; i < flatRides.length - 2; i += 3) {
      rides.push([flatRides[i], flatRides[i + 1], flatRides[i + 2]]);
    }
    rides.sort((a, b) => a[1] - b[1]);

    const dp = new Array(n + 1).fill(0);

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dpArr],
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `n=${n}. Rides sorted by end: ${rides.map(r => `[${r.join(',')}]`).join(', ')}. Initialize dp[0..${n}]=0.`,
      variables: { n, numRides: rides.length },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (const [start, end, tip] of rides) {
      const earn = end - start + tip;
      const candidate = dp[start] + earn;
      if (candidate > dp[end]) {
        dp[end] = candidate;
        steps.push({
          line: 4,
          explanation: `Ride [${start},${end},tip=${tip}]: earnings = ${earn}. dp[${end}] = dp[${start}] + ${earn} = ${dp[end]}.`,
          variables: { start, end, tip, earnings: earn, 'dp[end]': dp[end] },
          visualization: makeViz([...dp], { [end]: 'found', [start]: 'comparing' }),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Ride [${start},${end},tip=${tip}]: earnings = ${earn}. Candidate ${candidate} <= dp[${end}]=${dp[end]}, skip.`,
          variables: { start, end, tip },
          visualization: makeViz([...dp], { [end]: 'active', [start]: 'comparing' }),
        });
      }
    }

    for (let i = 1; i <= n; i++) {
      if (dp[i - 1] > dp[i]) {
        dp[i] = dp[i - 1];
      }
    }

    steps.push({
      line: 7,
      explanation: `Propagate: dp[i] = max(dp[i], dp[i-1]). Final dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: 'found' }),
    });

    return steps;
  },
};

export default maximumEarningsFromTaxi;
