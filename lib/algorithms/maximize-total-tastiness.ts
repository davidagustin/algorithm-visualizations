import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximizeTotalTastiness: AlgorithmDefinition = {
  id: 'maximize-total-tastiness',
  title: 'Maximize Total Tastiness of Purchased Fruits',
  leetcodeNumber: 2431,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given fruits with prices and tastiness, a budget, and a coupon that halves one fruit price (rounded down), maximize total tastiness. Use 2D knapsack DP: dp[j][c] = max tastiness with budget j and c coupons used (c in {0,1}). For each fruit try not buying, buying without coupon, or buying with coupon.',
  tags: ['dynamic programming', '2D knapsack', 'greedy', 'array'],

  code: {
    pseudocode: `function maxTastiness(price, tastiness, maxAmount, maxCoupons):
  dp[j][c] = max tastiness with j budget and c coupons left
  dp[0][maxCoupons] = 0 (start with full coupon budget)
  for each fruit i:
    for j from maxAmount down to 0:
      for c from maxCoupons down to 0:
        // buy without coupon
        if j >= price[i]: dp[j][c] = max(dp[j][c], dp[j-price[i]][c] + tastiness[i])
        // buy with coupon
        discounted = price[i] // 2
        if c > 0 and j >= discounted: dp[j][c-1] = max(dp[j][c-1], dp[j-discounted][c] + tastiness[i])
  return max over all c of dp[maxAmount][c]`,
    python: `def maxTastiness(price: list[int], tastiness: list[int], maxAmount: int, maxCoupons: int) -> int:
    n = len(price)
    dp = [[0]*(maxCoupons+1) for _ in range(maxAmount+1)]
    for i in range(n):
        for j in range(maxAmount, -1, -1):
            for c in range(maxCoupons, -1, -1):
                if j >= price[i]:
                    dp[j][c] = max(dp[j][c], dp[j-price[i]][c] + tastiness[i])
                disc = price[i] // 2
                if c > 0 and j >= disc:
                    dp[j][c] = max(dp[j][c], dp[j-disc][c-1] + tastiness[i])
    return max(dp[maxAmount])`,
    javascript: `function maxTastiness(price, tastiness, maxAmount, maxCoupons) {
  const n = price.length;
  const dp = Array.from({length: maxAmount+1}, () => new Array(maxCoupons+1).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = maxAmount; j >= 0; j--) {
      for (let c = maxCoupons; c >= 0; c--) {
        if (j >= price[i])
          dp[j][c] = Math.max(dp[j][c], dp[j-price[i]][c] + tastiness[i]);
        const disc = Math.floor(price[i] / 2);
        if (c > 0 && j >= disc)
          dp[j][c] = Math.max(dp[j][c], dp[j-disc][c-1] + tastiness[i]);
      }
    }
  }
  return Math.max(...dp[maxAmount]);
}`,
    java: `public int maxTastiness(int[] price, int[] tastiness, int maxAmount, int maxCoupons) {
    int n = price.length;
    int[][] dp = new int[maxAmount+1][maxCoupons+1];
    for (int i = 0; i < n; i++) {
        for (int j = maxAmount; j >= 0; j--) {
            for (int c = maxCoupons; c >= 0; c--) {
                if (j >= price[i])
                    dp[j][c] = Math.max(dp[j][c], dp[j-price[i]][c] + tastiness[i]);
                int disc = price[i] / 2;
                if (c > 0 && j >= disc)
                    dp[j][c] = Math.max(dp[j][c], dp[j-disc][c-1] + tastiness[i]);
            }
        }
    }
    int ans = 0;
    for (int v : dp[maxAmount]) ans = Math.max(ans, v);
    return ans;
}`,
  },

  defaultInput: {
    price: [10, 20, 20],
    tastiness: [5, 8, 8],
    maxAmount: 20,
    maxCoupons: 1,
  },

  inputFields: [
    {
      name: 'price',
      label: 'Fruit Prices',
      type: 'array',
      defaultValue: [10, 20, 20],
      placeholder: '10,20,20',
      helperText: 'Price of each fruit',
    },
    {
      name: 'tastiness',
      label: 'Tastiness Values',
      type: 'array',
      defaultValue: [5, 8, 8],
      placeholder: '5,8,8',
      helperText: 'Tastiness of each fruit',
    },
    {
      name: 'maxAmount',
      label: 'Max Budget',
      type: 'number',
      defaultValue: 20,
      placeholder: '20',
      helperText: 'Maximum amount to spend',
    },
    {
      name: 'maxCoupons',
      label: 'Max Coupons',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of half-price coupons',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const price = input.price as number[];
    const tastiness = input.tastiness as number[];
    const maxAmount = input.maxAmount as number;
    const maxCoupons = input.maxCoupons as number;
    const steps: AlgorithmStep[] = [];

    const n = price.length;
    const dp: number[][] = Array.from({ length: maxAmount + 1 }, () => new Array(maxCoupons + 1).fill(0));

    const makeViz = (dpRow: number[], highlights: Record<number, string>, label: string): ArrayVisualization => ({
      type: 'array',
      array: [...dpRow],
      highlights,
      labels: Object.fromEntries(dpRow.map((_, i) => [i, `c=${i}`])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0..${maxAmount}][0..${maxCoupons}] = 0. dp[j][c] = max tastiness with budget j and c coupons available.`,
      variables: { maxAmount, maxCoupons, n },
      visualization: makeViz([...dp[0]], { 0: 'found' }, 'j=0'),
    });

    for (let i = 0; i < n; i++) {
      for (let j = maxAmount; j >= 0; j--) {
        for (let c = maxCoupons; c >= 0; c--) {
          if (j >= price[i]) {
            const candidate = dp[j - price[i]][c] + tastiness[i];
            if (candidate > dp[j][c]) {
              dp[j][c] = candidate;
            }
          }
          const disc = Math.floor(price[i] / 2);
          if (c > 0 && j >= disc) {
            const candidate = dp[j - disc][c - 1] + tastiness[i];
            if (candidate > dp[j][c]) {
              dp[j][c] = candidate;
            }
          }
        }
      }
      steps.push({
        line: 9,
        explanation: `After fruit ${i + 1} (price=${price[i]}, tastiness=${tastiness[i]}): dp[${maxAmount}] = [${dp[maxAmount].join(', ')}].`,
        variables: { fruit: i + 1, price: price[i], tastiness: tastiness[i] },
        visualization: makeViz([...dp[maxAmount]], { [maxCoupons]: 'active' }, `j=${maxAmount}`),
      });
    }

    const result = Math.max(...dp[maxAmount]);
    steps.push({
      line: 11,
      explanation: `Maximum tastiness with budget=${maxAmount} and up to ${maxCoupons} coupon(s) = ${result}.`,
      variables: { result },
      visualization: makeViz([...dp[maxAmount]], Object.fromEntries(dp[maxAmount].map((v, i) => [i, v === result ? 'found' : 'default'])), `j=${maxAmount}`),
    });

    return steps;
  },
};

export default maximizeTotalTastiness;
