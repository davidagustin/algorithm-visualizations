import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const coinChangeWays: AlgorithmDefinition = {
  id: 'coin-change-ways',
  title: 'Coin Change II - Number of Combinations',
  leetcodeNumber: 518,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array coins and an integer amount, return the number of combinations that make up the amount. You may use each coin an unlimited number of times. This is the classic unbounded knapsack counting variant. dp[i] = number of ways to make amount i. For each coin, we iterate through all amounts from coin to target and add dp[amount - coin] to dp[amount].',
  tags: ['dp', 'unbounded knapsack', 'coin change', 'counting', 'combinations'],

  code: {
    pseudocode: `function change(amount, coins):
  dp = array of size amount+1, all 0
  dp[0] = 1  // one way to make amount 0: use no coins
  for coin in coins:
    for i from coin to amount:
      dp[i] += dp[i - coin]
  return dp[amount]`,
    python: `def change(amount: int, coins: list) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]`,
    javascript: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }
  return dp[amount];
}`,
    java: `public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    return dp[amount];
}`,
  },

  defaultInput: {
    coins: [1, 2, 5],
    amount: 5,
  },

  inputFields: [
    {
      name: 'coins',
      label: 'Coin Denominations',
      type: 'array',
      defaultValue: [1, 2, 5],
      placeholder: '1,2,5',
      helperText: 'Available coin denominations',
    },
    {
      name: 'amount',
      label: 'Target Amount',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target amount to make change for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const coins = input.coins as number[];
    const amount = input.amount as number;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(amount + 1).fill(0);
    dp[0] = 1;

    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights,
      labels: Array.from({ length: amount + 1 }, (_, i) => `amt=${i}`),
    });

    steps.push({
      line: 1,
      explanation: `Count combinations for amount=${amount} using coins=[${coins.join(', ')}]. dp[0]=1 (one way to make 0).`,
      variables: { amount, coins: coins.join(',') },
      visualization: makeViz({ 0: 'found' }),
    });

    for (const coin of coins) {
      steps.push({
        line: 3,
        explanation: `Processing coin=${coin}. For each amount >= coin, add ways to make (amount - coin).`,
        variables: { coin },
        visualization: makeViz({}),
      });

      for (let i = coin; i <= amount; i++) {
        const added = dp[i - coin];
        dp[i] += added;
        steps.push({
          line: 4,
          explanation: `coin=${coin}, amount=${i}: dp[${i}] += dp[${i} - ${coin}] = dp[${i - coin}] = ${added}. dp[${i}] = ${dp[i]}.`,
          variables: { coin, i, added, 'dp[i]': dp[i] },
          visualization: makeViz({ [i]: 'active', [i - coin]: 'comparing' }),
        });
      }

      steps.push({
        line: 5,
        explanation: `After processing coin=${coin}: dp = [${dp.join(', ')}].`,
        variables: { coin, dpState: dp.join(',') },
        visualization: makeViz({ [amount]: dp[amount] > 0 ? 'found' : 'active' }),
      });
    }

    steps.push({
      line: 6,
      explanation: `Total combinations to make amount ${amount} = dp[${amount}] = ${dp[amount]}.`,
      variables: { result: dp[amount] },
      visualization: makeViz({ [amount]: 'found' }),
    });

    return steps;
  },
};

export default coinChangeWays;
