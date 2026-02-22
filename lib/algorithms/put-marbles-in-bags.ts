import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const putMarblesInBags: AlgorithmDefinition = {
  id: 'put-marbles-in-bags',
  title: 'Put Marbles in Bags',
  leetcodeNumber: 2551,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'You have k bags and n marbles with weights. Distribute marbles into k non-empty groups (contiguous subarrays). The score of each bag is the sum of the first and last marble weights. Find the difference between maximum and minimum scores. Key insight: each split point i contributes weights[i] + weights[i+1] to the score. Pick the k-1 largest split costs for max and smallest for min.',
  tags: ['greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function putMarbles(weights, k):
  n = length(weights)
  if k == 1: return 0
  splitCosts = []
  for i from 0 to n-2:
    splitCosts.append(weights[i] + weights[i+1])
  sort splitCosts
  diff = 0
  for i from 0 to k-2:
    diff += splitCosts[n-1-i] - splitCosts[i]
  return diff`,

    python: `def putMarbles(weights: list[int], k: int) -> int:
    n = len(weights)
    if k == 1:
        return 0
    split_costs = sorted(weights[i] + weights[i+1] for i in range(n-1))
    return sum(split_costs[-(k-1):]) - sum(split_costs[:k-1])`,

    javascript: `function putMarbles(weights, k) {
  const n = weights.length;
  if (k === 1) return 0;
  const splitCosts = [];
  for (let i = 0; i < n - 1; i++) {
    splitCosts.push(weights[i] + weights[i + 1]);
  }
  splitCosts.sort((a, b) => a - b);
  let diff = 0;
  for (let i = 0; i < k - 1; i++) {
    diff += splitCosts[splitCosts.length - 1 - i] - splitCosts[i];
  }
  return diff;
}`,

    java: `public long putMarbles(int[] weights, int k) {
    int n = weights.length;
    if (k == 1) return 0;
    int[] costs = new int[n - 1];
    for (int i = 0; i < n - 1; i++)
        costs[i] = weights[i] + weights[i + 1];
    Arrays.sort(costs);
    long diff = 0;
    for (int i = 0; i < k - 1; i++)
        diff += (long)(costs[costs.length - 1 - i] - costs[i]);
    return diff;
}`,
  },

  defaultInput: {
    weights: [1, 3, 5, 1],
    k: 2,
  },

  inputFields: [
    {
      name: 'weights',
      label: 'Marble Weights',
      type: 'array',
      defaultValue: [1, 3, 5, 1],
      placeholder: '1,3,5,1',
      helperText: 'Weights of marbles in order',
    },
    {
      name: 'k',
      label: 'Number of Bags',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of bags to split marbles into',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const weights = input.weights as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = weights.length;

    steps.push({
      line: 1,
      explanation: `Distribute ${n} marbles into ${k} bags. The score is determined by first+last marble of each bag. Compute split costs.`,
      variables: { weights: [...weights], k },
      visualization: {
        type: 'array',
        array: [...weights],
        highlights: {},
        labels: {},
      },
    });

    if (k === 1) {
      steps.push({
        line: 2,
        explanation: 'Only one bag, no splits needed. Max and min scores are the same, difference is 0.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [...weights],
          highlights: { 0: 'found', [n - 1]: 'found' } as Record<number, string>,
          labels: {},
        },
      });
      return steps;
    }

    const splitCosts: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      const cost = weights[i] + weights[i + 1];
      splitCosts.push(cost);
      steps.push({
        line: 5,
        explanation: `Split between index ${i} and ${i + 1}: cost = weights[${i}] + weights[${i + 1}] = ${weights[i]} + ${weights[i + 1]} = ${cost}.`,
        variables: { i, cost, splitCosts: [...splitCosts] },
        visualization: {
          type: 'array',
          array: [...weights],
          highlights: { [i]: 'active', [i + 1]: 'comparing' } as Record<number, string>,
          labels: { [i]: `${weights[i]}`, [i + 1]: `${weights[i + 1]}` } as Record<number, string>,
        },
      });
    }

    const sorted = [...splitCosts].sort((a, b) => a - b);
    steps.push({
      line: 6,
      explanation: `Sort split costs: [${sorted.join(', ')}]. We need k-1=${k - 1} splits. Use largest for max score, smallest for min score.`,
      variables: { sorted: [...sorted], splitsNeeded: k - 1 },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: {},
        labels: Object.fromEntries(sorted.map((_, i) => [i, `c${i}`])) as Record<number, string>,
      },
    });

    let diff = 0;
    for (let i = 0; i < k - 1; i++) {
      const maxCost = sorted[sorted.length - 1 - i];
      const minCost = sorted[i];
      diff += maxCost - minCost;
      steps.push({
        line: 9,
        explanation: `Split ${i + 1}: max cost ${maxCost} - min cost ${minCost} = ${maxCost - minCost}. Running diff = ${diff}.`,
        variables: { i, maxCost, minCost, diff },
        visualization: {
          type: 'array',
          array: [...sorted],
          highlights: { [i]: 'active', [sorted.length - 1 - i]: 'found' } as Record<number, string>,
          labels: { [i]: 'min', [sorted.length - 1 - i]: 'max' } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Max score minus min score = ${diff}.`,
      variables: { result: diff },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: Object.fromEntries(sorted.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default putMarblesInBags;
