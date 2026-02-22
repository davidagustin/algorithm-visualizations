import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCoinCombination: AlgorithmDefinition = {
  id: 'minimum-coin-combination',
  title: 'Minimum Coin Combination',
  leetcodeNumber: 322,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of coin denominations and a target amount, find the minimum number of coins needed to make up that amount. If impossible, return -1. We use bottom-up DP where dp[i] = minimum coins to make amount i.',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function coinChange(coins, amount):
  dp = array of size amount+1, all Infinity
  dp[0] = 0
  for i from 1 to amount:
    for each coin in coins:
      if coin <= i and dp[i - coin] + 1 < dp[i]:
        dp[i] = dp[i - coin] + 1
  return dp[amount] == Infinity ? -1 : dp[amount]`,
    python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1
    return dp[amount] if dp[amount] != float('inf') else -1`,
    javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
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
            if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  },
  defaultInput: {
    coins: [1, 2, 5],
    amount: 11,
  },
  inputFields: [
    {
      name: 'coins',
      label: 'Coin Denominations',
      type: 'array',
      defaultValue: [1, 2, 5],
      placeholder: '1,2,5',
      helperText: 'Comma-separated coin values',
    },
    {
      name: 'amount',
      label: 'Target Amount',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Target amount to make change for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const coins = input.coins as number[];
    const amount = input.amount as number;
    const steps: AlgorithmStep[] = [];
    const INF = amount + 1;

    const dp: (number | null)[] = new Array(amount + 1).fill(null);
    const labels: string[] = Array.from({ length: amount + 1 }, (_, i) => String(i));

    function makeViz(
      activeIdx: number | null,
      comparingIndices: number[],
      computedUpTo: number
    ): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= computedUpTo; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= amount) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return {
        type: 'dp-table',
        values: dp.slice(),
        highlights,
        labels,
      };
    }

    // Init
    steps.push({
      line: 1,
      explanation: `Create dp array of size ${amount + 1}. dp[i] = minimum coins to make amount i. Initialize all to INF.`,
      variables: { coins, amount },
      visualization: makeViz(null, [], -1),
    });

    dp[0] = 0;
    steps.push({
      line: 2,
      explanation: 'Set dp[0] = 0. Zero coins needed to make amount 0.',
      variables: { 'dp[0]': 0 },
      visualization: makeViz(0, [], 0),
    });

    steps.push({
      line: 3,
      explanation: `Fill dp[1] through dp[${amount}]. For each amount i, try each coin and take the minimum.`,
      variables: { coins },
      visualization: makeViz(null, [], 0),
    });

    for (let i = 1; i <= amount; i++) {
      let best = INF;
      let bestCoin = -1;
      const triedIndices: number[] = [];

      for (const coin of coins) {
        if (coin <= i && dp[i - coin] !== null) {
          triedIndices.push(i - coin);
          const candidate = (dp[i - coin] as number) + 1;
          if (candidate < best) {
            best = candidate;
            bestCoin = coin;
          }
        }
      }

      dp[i] = best >= INF ? null : best;

      if (i <= 5 || i === amount || (dp[i] !== null && dp[i] !== dp[i - 1])) {
        steps.push({
          line: 5,
          explanation: dp[i] !== null
            ? `dp[${i}] = ${dp[i]}. Best option: use coin ${bestCoin}, then dp[${i}-${bestCoin}] = dp[${i - bestCoin}] = ${dp[i - bestCoin]}, so ${(dp[i - bestCoin] as number)} + 1 = ${dp[i]}.`
            : `dp[${i}] = INF. No coin combination can make amount ${i}.`,
          variables: { i, 'dp[i]': dp[i], coins },
          visualization: makeViz(i, triedIndices, i),
        });
      }
    }

    // Final
    const result = dp[amount] !== null ? dp[amount] : -1;
    steps.push({
      line: 7,
      explanation: result === -1
        ? `dp[${amount}] = INF. Cannot make amount ${amount} with given coins. Return -1.`
        : `dp[${amount}] = ${result}. Minimum ${result} coin(s) needed to make amount ${amount}.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: amount + 1 }, (_, i) => [
            i,
            i === amount ? 'active' : dp[i] !== null ? 'found' : 'default',
          ])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default minimumCoinCombination;
