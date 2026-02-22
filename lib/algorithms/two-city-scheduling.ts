import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const twoCityScheduling: AlgorithmDefinition = {
  id: 'two-city-scheduling',
  title: 'Two City Scheduling',
  leetcodeNumber: 1029,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'A company must send n people to city A and n people to city B. Given costs[i] = [costA, costB] for each person, minimize total cost. Greedily: sort by the difference (costA - costB) and send the first n people to city A (those who most prefer A), and the rest to city B.',
  tags: ['greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function twoCitySchedCost(costs):
  sort costs by (costs[i][0] - costs[i][1]) ascending
  total = 0
  n = length(costs) / 2
  for i = 0 to n-1:
    total += costs[i][0]  // send to city A
  for i = n to 2n-1:
    total += costs[i][1]  // send to city B
  return total`,

    python: `def twoCitySchedCost(costs: list[list[int]]) -> int:
    costs.sort(key=lambda x: x[0] - x[1])
    n = len(costs) // 2
    total = 0
    for i in range(n):
        total += costs[i][0]
    for i in range(n, 2 * n):
        total += costs[i][1]
    return total`,

    javascript: `function twoCitySchedCost(costs) {
  costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
  const n = costs.length / 2;
  let total = 0;
  for (let i = 0; i < n; i++) total += costs[i][0];
  for (let i = n; i < 2 * n; i++) total += costs[i][1];
  return total;
}`,

    java: `public int twoCitySchedCost(int[][] costs) {
    Arrays.sort(costs, (a, b) -> (a[0] - a[1]) - (b[0] - b[1]));
    int n = costs.length / 2, total = 0;
    for (int i = 0; i < n; i++) total += costs[i][0];
    for (int i = n; i < 2 * n; i++) total += costs[i][1];
    return total;
}`,
  },

  defaultInput: {
    costs: [10, 20, 30, 200, 400, 50, 30, 20],
  },

  inputFields: [
    {
      name: 'costs',
      label: 'Costs (interleaved costA,costB pairs)',
      type: 'array',
      defaultValue: [10, 20, 30, 200, 400, 50, 30, 20],
      placeholder: '10,20,30,200,400,50,30,20',
      helperText: 'Pairs: costA,costB for each person',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.costs as number[];
    const steps: AlgorithmStep[] = [];

    const costs: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      costs.push([flat[i], flat[i + 1]]);
    }
    const n = Math.floor(costs.length / 2);

    steps.push({
      line: 1,
      explanation: `Parsed ${costs.length} people. Need to send ${n} to city A and ${n} to city B.`,
      variables: { people: costs.length, n },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    const sorted = [...costs].sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
    const diffs = sorted.map(c => c[0] - c[1]);

    steps.push({
      line: 2,
      explanation: `Sort by (costA - costB): ${sorted.map(c => '[' + c[0] + ',' + c[1] + ']').join(', ')}. Negative diff = prefers A, positive = prefers B.`,
      variables: { diffs: diffs.join(', ') },
      visualization: {
        type: 'array',
        array: diffs,
        highlights: Object.fromEntries(diffs.map((_, i) => [i, i < n ? 'found' : 'comparing'])),
        labels: { [n - 1]: 'A/B boundary', [n]: 'B start' },
      },
    });

    let total = 0;

    for (let i = 0; i < n; i++) {
      total += sorted[i][0];
      steps.push({
        line: 5,
        explanation: `Person ${i + 1}: send to city A (costA=${sorted[i][0]}, diff=${diffs[i]}). Running total=${total}.`,
        variables: { i, costA: sorted[i][0], total },
        visualization: {
          type: 'array',
          array: sorted.map(c => c[0] - c[1]),
          highlights: { [i]: 'found' },
          labels: { [i]: 'A' },
        },
      });
    }

    for (let i = n; i < 2 * n; i++) {
      total += sorted[i][1];
      steps.push({
        line: 7,
        explanation: `Person ${i + 1}: send to city B (costB=${sorted[i][1]}, diff=${diffs[i]}). Running total=${total}.`,
        variables: { i, costB: sorted[i][1], total },
        visualization: {
          type: 'array',
          array: sorted.map(c => c[0] - c[1]),
          highlights: { [i]: 'active' },
          labels: { [i]: 'B' },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Minimum total cost = ${total}.`,
      variables: { result: total },
      visualization: {
        type: 'array',
        array: sorted.map(c => c[0] - c[1]),
        highlights: Object.fromEntries(diffs.map((_, i) => [i, 'sorted'])),
        labels: { [n - 1]: 'last A', [n]: 'first B' },
      },
    });

    return steps;
  },
};

export default twoCityScheduling;
