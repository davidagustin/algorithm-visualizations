import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shoppingOffers: AlgorithmDefinition = {
  id: 'shopping-offers',
  title: 'Shopping Offers',
  leetcodeNumber: 638,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given item prices, special bundle offers, and a needs vector, find the minimum cost to satisfy all needs. Use memoized DFS: at each state (needs vector), try buying each offer (if it fits), or buy items individually. Cache results by needs vector string key.',
  tags: ['dynamic programming', 'dfs', 'memoization', 'backtracking'],

  code: {
    pseudocode: `function shoppingOffers(price, special, needs):
  memo = {}
  function dfs(needs):
    key = str(needs)
    if key in memo: return memo[key]
    cost = sum(needs[i] * price[i])  // buy all individually
    for offer in special:
      newNeeds = needs.copy()
      valid = true
      for i in range(len(needs)):
        newNeeds[i] -= offer[i]
        if newNeeds[i] < 0: valid = false; break
      if valid:
        cost = min(cost, offer[-1] + dfs(newNeeds))
    memo[key] = cost
    return cost
  return dfs(needs)`,
    python: `def shoppingOffers(price: list[int], special: list[list[int]], needs: list[int]) -> int:
    memo = {}
    def dfs(state):
        key = tuple(state)
        if key in memo:
            return memo[key]
        cost = sum(state[i] * price[i] for i in range(len(price)))
        for offer in special:
            new_state = [state[i] - offer[i] for i in range(len(price))]
            if all(x >= 0 for x in new_state):
                cost = min(cost, offer[-1] + dfs(new_state))
        memo[key] = cost
        return cost
    return dfs(needs)`,
    javascript: `function shoppingOffers(price, special, needs) {
  const memo = new Map();
  function dfs(state) {
    const key = state.join(',');
    if (memo.has(key)) return memo.get(key);
    let cost = state.reduce((s, n, i) => s + n * price[i], 0);
    for (const offer of special) {
      const newState = state.map((n, i) => n - offer[i]);
      if (newState.every(x => x >= 0)) {
        cost = Math.min(cost, offer[offer.length-1] + dfs(newState));
      }
    }
    memo.set(key, cost);
    return cost;
  }
  return dfs(needs);
}`,
    java: `public int shoppingOffers(List<Integer> price, List<List<Integer>> special, List<Integer> needs) {
    Map<List<Integer>, Integer> memo = new HashMap<>();
    return dfs(price, special, needs, memo);
}
private int dfs(List<Integer> price, List<List<Integer>> special, List<Integer> needs, Map<List<Integer>, Integer> memo) {
    if (memo.containsKey(needs)) return memo.get(needs);
    int cost = 0;
    for (int i = 0; i < price.size(); i++) cost += needs.get(i) * price.get(i);
    for (List<Integer> offer : special) {
        List<Integer> newNeeds = new ArrayList<>(needs);
        boolean valid = true;
        for (int i = 0; i < price.size(); i++) {
            newNeeds.set(i, needs.get(i) - offer.get(i));
            if (newNeeds.get(i) < 0) { valid = false; break; }
        }
        if (valid) cost = Math.min(cost, offer.get(offer.size()-1) + dfs(price, special, newNeeds, memo));
    }
    memo.put(needs, cost);
    return cost;
}`,
  },

  defaultInput: {
    price: [2, 5],
    needs: [3, 2],
    special: [3, 0, 5, 1, 2, 10],
  },

  inputFields: [
    {
      name: 'price',
      label: 'Item Prices',
      type: 'array',
      defaultValue: [2, 5],
      placeholder: '2,5',
      helperText: 'Price per unit for each item',
    },
    {
      name: 'needs',
      label: 'Needs',
      type: 'array',
      defaultValue: [3, 2],
      placeholder: '3,2',
      helperText: 'How many of each item you need',
    },
    {
      name: 'special',
      label: 'Special Offers (flat, groups of n+1)',
      type: 'array',
      defaultValue: [3, 0, 5, 1, 2, 10],
      placeholder: '3,0,5,1,2,10',
      helperText: 'Each offer: item counts then price',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const price = input.price as number[];
    const needs = input.needs as number[];
    const flatSpecial = input.special as number[];
    const steps: AlgorithmStep[] = [];

    const n = price.length;
    const special: number[][] = [];
    for (let i = 0; i < flatSpecial.length; i += n + 1) {
      special.push(flatSpecial.slice(i, i + n + 1));
    }

    const memo: Map<string, number> = new Map();
    const statesVisited: string[] = [];

    function dfs(state: number[]): number {
      const key = state.join(',');
      if (memo.has(key)) return memo.get(key)!;
      let cost = state.reduce((s, ni, i) => s + ni * price[i], 0);
      statesVisited.push(key);
      steps.push({
        line: 5,
        explanation: `State [${state.join(',')}]: buy individually costs ${cost}.`,
        variables: { state: state.join(','), individualCost: cost },
        visualization: {
          type: 'array',
          array: [...state, cost],
          highlights: { [state.length]: 'active' },
          labels: Object.fromEntries([...state.map((_, i) => [i, `need${i}`]), [state.length, 'cost']]),
        },
      });
      for (let oi = 0; oi < special.length; oi++) {
        const offer = special[oi];
        const newState = state.map((ni, i) => ni - offer[i]);
        if (newState.every(x => x >= 0)) {
          const subCost = offer[n] + dfs(newState);
          if (subCost < cost) {
            cost = subCost;
            steps.push({
              line: 12,
              explanation: `Use offer ${oi + 1} [${offer.join(',')}]: new state [${newState.join(',')}], cost = ${offer[n]} + ${subCost - offer[n]} = ${subCost}.`,
              variables: { offer: offer.join(','), newState: newState.join(','), cost },
              visualization: {
                type: 'array',
                array: [...newState, cost],
                highlights: { [newState.length]: 'found' },
                labels: Object.fromEntries([...newState.map((_, i) => [i, `need${i}`]), [newState.length, 'cost']]),
              },
            });
          }
        }
      }
      memo.set(key, cost);
      return cost;
    }

    const result = dfs([...needs]);

    steps.push({
      line: 14,
      explanation: `Minimum cost to satisfy needs [${needs.join(',')}] = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...needs, result],
        highlights: { [needs.length]: 'found' },
        labels: Object.fromEntries([...needs.map((_, i) => [i, `need${i}`]), [needs.length, 'result']]),
      },
    });

    return steps;
  },
};

export default shoppingOffers;
