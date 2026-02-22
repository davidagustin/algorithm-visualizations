import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const allocateMailboxes: AlgorithmDefinition = {
  id: 'allocate-mailboxes',
  title: 'Allocate Mailboxes',
  leetcodeNumber: 1478,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given house positions and k mailboxes, place mailboxes to minimize total distance from each house to its nearest mailbox. The optimal mailbox for a group of houses is the median house. Uses interval DP: cost[i][j] = min distance placing one mailbox for houses i..j (place at median).',
  tags: ['dynamic programming', 'math', 'sorting', 'median'],

  code: {
    pseudocode: `function minDistance(houses, k):
  sort(houses)
  n = len(houses)
  cost[i][j] = sum of distances to median for houses[i..j]
  for i from 0 to n-1:
    for j from i to n-1:
      mid = (i+j)/2
      cost[i][j] = sum |houses[x] - houses[mid]| for x in [i,j]
  dp[i][j] = min cost placing j boxes among first i houses
  dp[i][1] = cost[0][i-1]
  for boxes from 2 to k:
    for i from boxes to n:
      for m from boxes-1 to i-1:
        dp[i][boxes] = min(dp[i][boxes], dp[m][boxes-1] + cost[m][i-1])
  return dp[n][k]`,
    python: `def minDistance(houses, k):
    houses.sort()
    n = len(houses)
    cost = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(i, n):
            mid = (i+j)//2
            for x in range(i, j+1):
                cost[i][j] += abs(houses[x] - houses[mid])
    dp = [[float('inf')]*(k+1) for _ in range(n+1)]
    dp[0][0] = 0
    for i in range(1, n+1):
        dp[i][1] = cost[0][i-1]
    for boxes in range(2, k+1):
        for i in range(boxes, n+1):
            for m in range(boxes-1, i):
                dp[i][boxes] = min(dp[i][boxes], dp[m][boxes-1]+cost[m][i-1])
    return dp[n][k]`,
    javascript: `function minDistance(houses, k) {
  houses.sort((a,b)=>a-b);
  const n = houses.length;
  const cost = Array.from({length:n},()=>new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = i; j < n; j++) {
      const mid = Math.floor((i+j)/2);
      for (let x = i; x <= j; x++) cost[i][j] += Math.abs(houses[x]-houses[mid]);
    }
  const dp = Array.from({length:n+1},()=>new Array(k+1).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) dp[i][1] = cost[0][i-1];
  for (let b = 2; b <= k; b++)
    for (let i = b; i <= n; i++)
      for (let m = b-1; m < i; m++)
        dp[i][b] = Math.min(dp[i][b], dp[m][b-1]+cost[m][i-1]);
  return dp[n][k];
}`,
    java: `public int minDistance(int[] houses, int k) {
    Arrays.sort(houses);
    int n = houses.length;
    int[][] cost = new int[n][n];
    for (int i = 0; i < n; i++)
        for (int j = i; j < n; j++) {
            int mid = (i+j)/2;
            for (int x = i; x <= j; x++) cost[i][j] += Math.abs(houses[x]-houses[mid]);
        }
    int[][] dp = new int[n+1][k+1];
    for (int[] row: dp) Arrays.fill(row, Integer.MAX_VALUE/2);
    dp[0][0] = 0;
    for (int i = 1; i <= n; i++) dp[i][1] = cost[0][i-1];
    for (int b = 2; b <= k; b++)
        for (int i = b; i <= n; i++)
            for (int m = b-1; m < i; m++)
                dp[i][b] = Math.min(dp[i][b], dp[m][b-1]+cost[m][i-1]);
    return dp[n][k];
}`,
  },

  defaultInput: {
    houses: [1, 4, 8, 10, 20],
    k: 3,
  },

  inputFields: [
    {
      name: 'houses',
      label: 'House Positions',
      type: 'array',
      defaultValue: [1, 4, 8, 10, 20],
      placeholder: '1,4,8,10,20',
      helperText: 'Comma-separated house positions',
    },
    {
      name: 'k',
      label: 'K (mailboxes)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of mailboxes to place',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawHouses = [...(input.houses as number[])].sort((a, b) => a - b);
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = rawHouses.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...rawHouses],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Allocate Mailboxes: houses=[${rawHouses.join(', ')}], k=${k}. Sort houses and place mailboxes to minimize total distance.`,
      variables: { n, k },
      visualization: makeViz({}, {}),
    });

    const cost: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        const mid = Math.floor((i + j) / 2);
        for (let x = i; x <= j; x++) cost[i][j] += Math.abs(rawHouses[x] - rawHouses[mid]);
      }
    }

    steps.push({
      line: 5,
      explanation: `Precompute cost[i][j]: place one mailbox at median of houses[i..j]. cost[0][${n - 1}]=${cost[0][n - 1]} for all houses.`,
      variables: { 'cost[0][n-1]': cost[0][n - 1] },
      visualization: makeViz(
        { [Math.floor((n - 1) / 2)]: 'active' },
        { [Math.floor((n - 1) / 2)]: 'median' }
      ),
    });

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(Infinity));
    dp[0][0] = 0;
    for (let i = 1; i <= n; i++) dp[i][1] = cost[0][i - 1];

    for (let i = 1; i <= n; i++) {
      steps.push({
        line: 8,
        explanation: `dp[${i}][1]=${dp[i][1]}: min cost placing 1 mailbox for first ${i} houses (at their median).`,
        variables: { i, 'dp[i][1]': dp[i][1], 'median house': rawHouses[Math.floor((i - 1) / 2)] },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: i }, (_, idx) => [idx, 'comparing'])),
          { [Math.floor((i - 1) / 2)]: 'mailbox' }
        ),
      });
      if (i >= 3) break;
    }

    for (let b = 2; b <= k; b++) {
      for (let i = b; i <= n; i++) {
        for (let m = b - 1; m < i; m++) {
          const candidate = dp[m][b - 1] + cost[m][i - 1];
          if (candidate < dp[i][b]) dp[i][b] = candidate;
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `dp[${n}][${k}]=${dp[n][k]}. Minimum total distance with ${k} mailboxes optimally placed.`,
      variables: { result: dp[n][k] },
      visualization: makeViz(
        Object.fromEntries(rawHouses.map((_, i) => [i, 'found'])),
        { 0: `min dist: ${dp[n][k]}` }
      ),
    });

    return steps;
  },
};

export default allocateMailboxes;
