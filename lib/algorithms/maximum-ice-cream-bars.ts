import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumIceCreamBars: AlgorithmDefinition = {
  id: 'maximum-ice-cream-bars',
  title: 'Maximum Ice Cream Bars',
  leetcodeNumber: 1833,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given ice cream bar costs and a budget of coins, find the maximum number of bars that can be bought. Greedy: sort costs in ascending order and greedily buy the cheapest bars first until the budget runs out.',
  tags: ['greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maxIceCream(costs, coins):
  sort costs ascending
  count = 0
  for each cost in sorted costs:
    if coins >= cost:
      coins -= cost
      count++
    else:
      break
  return count`,

    python: `def maxIceCream(costs: list[int], coins: int) -> int:
    costs.sort()
    count = 0
    for cost in costs:
        if coins >= cost:
            coins -= cost
            count += 1
        else:
            break
    return count`,

    javascript: `function maxIceCream(costs, coins) {
  costs.sort((a, b) => a - b);
  let count = 0;
  for (const cost of costs) {
    if (coins >= cost) { coins -= cost; count++; }
    else break;
  }
  return count;
}`,

    java: `public int maxIceCream(int[] costs, int coins) {
    Arrays.sort(costs);
    int count = 0;
    for (int cost : costs) {
        if (coins >= cost) { coins -= cost; count++; }
        else break;
    }
    return count;
}`,
  },

  defaultInput: {
    costs: [1, 3, 2, 4, 1],
    coins: 7,
  },

  inputFields: [
    {
      name: 'costs',
      label: 'Ice Cream Bar Costs',
      type: 'array',
      defaultValue: [1, 3, 2, 4, 1],
      placeholder: '1,3,2,4,1',
      helperText: 'Cost of each ice cream bar',
    },
    {
      name: 'coins',
      label: 'Budget (Coins)',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total coins available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const costsRaw = input.costs as number[];
    let coins = input.coins as number;
    const steps: AlgorithmStep[] = [];

    const costs = [...costsRaw].sort((a, b) => a - b);
    let count = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...costs],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort costs: [${costs.join(', ')}]. Budget=${coins}. Buy cheapest bars first.`,
      variables: { sortedCosts: costs.join(','), coins },
      visualization: makeViz(
        Object.fromEntries(costs.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    for (let i = 0; i < costs.length; i++) {
      const cost = costs[i];

      if (coins >= cost) {
        coins -= cost;
        count++;

        steps.push({
          line: 4,
          explanation: `costs[${i}]=${cost}: budget=${coins + cost} >= cost. Buy it! Remaining budget=${coins}. Bars bought=${count}.`,
          variables: { i, cost, remainingCoins: coins, count },
          visualization: makeViz(
            { [i]: 'found', ...Object.fromEntries(Array.from({ length: count - 1 }, (_, k) => [k, 'sorted'])) },
            { [i]: 'buy!' }
          ),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `costs[${i}]=${cost}: budget=${coins} < cost. Cannot afford. Stop.`,
          variables: { i, cost, remainingCoins: coins, count },
          visualization: makeViz(
            { [i]: 'mismatch', ...Object.fromEntries(Array.from({ length: count }, (_, k) => [k, 'found'])) },
            { [i]: 'too expensive' }
          ),
        });
        break;
      }
    }

    steps.push({
      line: 8,
      explanation: `Maximum ice cream bars that can be bought = ${count}. Remaining budget = ${coins}.`,
      variables: { result: count, remainingCoins: coins },
      visualization: makeViz(
        Object.fromEntries(costs.map((_, i) => [i, i < count ? 'found' : 'mismatch'])),
        { [count > 0 ? count - 1 : 0]: 'last bought' }
      ),
    });

    return steps;
  },
};

export default maximumIceCreamBars;
