import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const coinChangeII: AlgorithmDefinition = {
  id: 'coin-change-ii',
  title: 'Coin Change II',
  leetcodeNumber: 518,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer amount and an array of coin denominations, return the number of combinations that make up that amount. Order does not matter. dp[i] = number of combinations to make amount i. For each coin, dp[j] += dp[j - coin].',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function change(amount, coins):
  dp = array of size amount+1, all 0
  dp[0] = 1
  for each coin in coins:
    for j from coin to amount:
      dp[j] += dp[j - coin]
  return dp[amount]`,
    python: `def change(amount, coins):
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
  defaultInput: { amount: 5, coins: [1, 2, 5] },
  inputFields: [
    {
      name: 'amount',
      label: 'Target Amount',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target amount (1 to 20 for best visualization)',
    },
    {
      name: 'coins',
      label: 'Coin Denominations',
      type: 'array',
      defaultValue: [1, 2, 5],
      placeholder: '1,2,5',
      helperText: 'Comma-separated coin denominations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const amount = input.amount as number;
    const coins = input.coins as number[];
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(amount + 1).fill(null);
    const labels: string[] = Array.from({ length: amount + 1 }, (_, i) => String(i));

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= amount; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= amount) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Coin Change II: count combinations to make amount=${amount} using coins [${coins.join(', ')}]. dp[j] = number of ways to make amount j.`,
      variables: { amount, coins },
      visualization: makeViz(null, []),
    });

    dp[0] = 1;
    steps.push({
      line: 2,
      explanation: 'dp[0] = 1. One way to make amount 0: use no coins.',
      variables: { 'dp[0]': 1 },
      visualization: makeViz(0, []),
    });

    for (let i = 1; i <= amount; i++) dp[i] = 0;
    steps.push({
      line: 2,
      explanation: `Initialize dp[1..${amount}] = 0. No ways to make any amount yet.`,
      variables: {},
      visualization: makeViz(null, []),
    });

    for (const coin of coins) {
      steps.push({
        line: 3,
        explanation: `Processing coin = ${coin}. For each amount j >= ${coin}, add dp[j-${coin}] to dp[j].`,
        variables: { coin },
        visualization: makeViz(null, []),
      });

      for (let j = coin; j <= amount; j++) {
        const prev = dp[j] as number;
        const added = dp[j - coin] as number;
        (dp[j] as number) += added;

        steps.push({
          line: 4,
          explanation: `coin=${coin}, j=${j}: dp[${j}] += dp[${j}-${coin}] = dp[${j - coin}] = ${added}. dp[${j}]: ${prev} + ${added} = ${dp[j]}.`,
          variables: { coin, j, 'dp[j]': dp[j], 'dp[j-coin]': added },
          visualization: makeViz(j, [j - coin]),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `dp[${amount}] = ${dp[amount]}. There are ${dp[amount]} combination(s) that make up amount ${amount}.`,
      variables: { result: dp[amount] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: amount + 1 }, (_, i) => [i, i === amount ? 'active' : 'found'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default coinChangeII;
