import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const coinChangeCombinations: AlgorithmDefinition = {
  id: 'coin-change-combinations',
  title: 'Coin Change II - Count Combinations',
  leetcodeNumber: 518,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count the number of combinations of coins that sum to the target amount. Unlike min-coins, order does not matter. Process each coin once (outer loop) and update dp[j] += dp[j - coin] for j from coin to amount. This avoids counting permutations.',
  tags: ['dynamic programming', 'knapsack', 'unbounded', 'counting'],

  code: {
    pseudocode: `function change(amount, coins):
  dp = array of size amount+1, dp[0] = 1, rest = 0
  for each coin in coins:
    for j from coin to amount:
      dp[j] += dp[j - coin]
  return dp[amount]`,
    python: `def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for j in range(coin, amount + 1):
            dp[j] += dp[j - coin]
    return dp[amount]`,
    javascript: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const coin of coins) {
    for (let j = coin; j <= amount; j++) {
      dp[j] += dp[j - coin];
    }
  }
  return dp[amount];
}`,
    java: `public int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins) {
        for (int j = coin; j <= amount; j++) {
            dp[j] += dp[j - coin];
        }
    }
    return dp[amount];
}`,
  },

  defaultInput: {
    amount: 5,
    coins: [1, 2, 5],
  },

  inputFields: [
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target amount to make change for',
    },
    {
      name: 'coins',
      label: 'Coin Denominations',
      type: 'array',
      defaultValue: [1, 2, 5],
      placeholder: '1,2,5',
      helperText: 'Available coin denominations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const amount = input.amount as number;
    const coins = input.coins as number[];
    const steps: AlgorithmStep[] = [];

    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dpArr],
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0..${amount}] = 0, dp[0] = 1 (one way to make 0). Outer loop over coins avoids permutations.`,
      variables: { amount, coins: coins.join(',') },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (const coin of coins) {
      steps.push({
        line: 3,
        explanation: `Processing coin = ${coin}. For each j from ${coin} to ${amount}, dp[j] += dp[j - ${coin}].`,
        variables: { coin },
        visualization: makeViz([...dp], {}),
      });
      for (let j = coin; j <= amount; j++) {
        dp[j] += dp[j - coin];
        steps.push({
          line: 4,
          explanation: `dp[${j}] += dp[${j - coin}] = ${dp[j - coin]}. dp[${j}] is now ${dp[j]}.`,
          variables: { j, coin, 'dp[j]': dp[j], 'dp[j-coin]': dp[j - coin] },
          visualization: makeViz([...dp], { [j]: 'active', [j - coin]: 'comparing' }),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Number of coin combinations summing to ${amount} = dp[${amount}] = ${dp[amount]}.`,
      variables: { result: dp[amount] },
      visualization: makeViz([...dp], { [amount]: 'found' }),
    });

    return steps;
  },
};

export default coinChangeCombinations;
