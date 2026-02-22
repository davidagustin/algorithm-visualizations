import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const coinChangeMinCoins: AlgorithmDefinition = {
  id: 'coin-change-min-coins',
  title: 'Coin Change - Minimum Coins',
  leetcodeNumber: 322,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of coin denominations and a target amount, find the minimum number of coins needed to make up that amount. Uses bottom-up DP where dp[i] represents the minimum coins needed for amount i. For each amount, try every coin and take the minimum.',
  tags: ['dynamic programming', 'knapsack', 'coins', 'unbounded'],

  code: {
    pseudocode: `function coinChange(coins, amount):
  dp = array of size amount+1, filled with Infinity
  dp[0] = 0
  for i from 1 to amount:
    for each coin in coins:
      if coin <= i:
        dp[i] = min(dp[i], dp[i - coin] + 1)
  return dp[amount] if dp[amount] != Infinity else -1`,
    python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    java: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  },

  defaultInput: {
    coins: [1, 5, 6, 9],
    amount: 11,
  },

  inputFields: [
    {
      name: 'coins',
      label: 'Coin Denominations',
      type: 'array',
      defaultValue: [1, 5, 6, 9],
      placeholder: '1,5,6,9',
      helperText: 'Comma-separated coin values',
    },
    {
      name: 'amount',
      label: 'Target Amount',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Amount to make change for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const coins = input.coins as number[];
    const amount = input.amount as number;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v === Infinity ? -1 : v)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: 'Initialize dp array of size amount+1 with Infinity. dp[0] = 0 since 0 coins needed for amount 0.',
      variables: { dp: '[0, INF, INF, ...]', amount },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= amount; i++) {
      for (const coin of coins) {
        if (coin <= i) {
          const prev = dp[i - coin];
          if (prev !== Infinity && prev + 1 < dp[i]) {
            dp[i] = prev + 1;
            steps.push({
              line: 6,
              explanation: `Amount ${i}: using coin ${coin}, dp[${i}] updated to dp[${i - coin}] + 1 = ${dp[i]}.`,
              variables: { i, coin, 'dp[i]': dp[i], 'dp[i-coin]': prev },
              visualization: makeViz([...dp], { [i]: 'active', [i - coin]: 'comparing' }),
            });
          }
        }
      }
      if (dp[i] === Infinity) {
        steps.push({
          line: 6,
          explanation: `Amount ${i}: no coin can reach this amount, dp[${i}] stays Infinity.`,
          variables: { i, 'dp[i]': 'INF' },
          visualization: makeViz([...dp], { [i]: 'mismatch' }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Result: dp[${amount}] = ${dp[amount] === Infinity ? -1 : dp[amount]}. Minimum coins needed.`,
      variables: { result: dp[amount] === Infinity ? -1 : dp[amount] },
      visualization: makeViz([...dp], { [amount]: 'found' }),
    });

    return steps;
  },
};

export default coinChangeMinCoins;
