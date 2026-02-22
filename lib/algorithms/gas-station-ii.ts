import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gasStationIi: AlgorithmDefinition = {
  id: 'gas-station-ii',
  title: 'Gas Station (Detailed Tracking)',
  leetcodeNumber: 134,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given gas[i] (gas at station i) and cost[i] (gas to reach next station), find the starting station index to complete a circular route, or -1 if impossible. Greedy: if total gas >= total cost a solution exists. Track running tank; when it goes negative, reset start to next station.',
  tags: ['greedy', 'array'],

  code: {
    pseudocode: `function canCompleteCircuit(gas, cost):
  totalGas = sum(gas), totalCost = sum(cost)
  if totalGas < totalCost: return -1
  tank = 0, start = 0
  for i = 0 to n-1:
    tank += gas[i] - cost[i]
    if tank < 0:
      start = i + 1
      tank = 0
  return start`,

    python: `def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start`,

    javascript: `function canCompleteCircuit(gas, cost) {
  const totalGas = gas.reduce((a, b) => a + b, 0);
  const totalCost = cost.reduce((a, b) => a + b, 0);
  if (totalGas < totalCost) return -1;
  let tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return start;
}`,

    java: `public int canCompleteCircuit(int[] gas, int[] cost) {
    int totalGas = 0, totalCost = 0;
    for (int g : gas) totalGas += g;
    for (int c : cost) totalCost += c;
    if (totalGas < totalCost) return -1;
    int tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i];
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return start;
}`,
  },

  defaultInput: {
    gas: [1, 2, 3, 4, 5],
    cost: [3, 4, 5, 1, 2],
  },

  inputFields: [
    {
      name: 'gas',
      label: 'Gas at Each Station',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Gas available at each station',
    },
    {
      name: 'cost',
      label: 'Cost to Next Station',
      type: 'array',
      defaultValue: [3, 4, 5, 1, 2],
      placeholder: '3,4,5,1,2',
      helperText: 'Gas needed to travel to next station',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const gas = input.gas as number[];
    const cost = input.cost as number[];
    const steps: AlgorithmStep[] = [];
    const n = gas.length;

    const totalGas = gas.reduce((a, b) => a + b, 0);
    const totalCost = cost.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `totalGas=${totalGas}, totalCost=${totalCost}. ${totalGas < totalCost ? 'totalGas < totalCost, impossible. Return -1.' : 'Solution exists. Begin greedy scan.'}`,
      variables: { totalGas, totalCost },
      visualization: {
        type: 'array',
        array: gas.map((g, i) => g - cost[i]),
        highlights: Object.fromEntries(gas.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(gas.map((g, i) => [i, 'net:' + (g - cost[i])])),
      },
    });

    if (totalGas < totalCost) {
      return steps;
    }

    let tank = 0;
    let start = 0;

    steps.push({
      line: 3,
      explanation: 'Initialize tank=0, start=0. Scan stations tracking running tank.',
      variables: { tank, start },
      visualization: {
        type: 'array',
        array: [...gas],
        highlights: { [start]: 'pointer' },
        labels: { [start]: 'start' },
      },
    });

    for (let i = 0; i < n; i++) {
      const net = gas[i] - cost[i];
      tank += net;

      steps.push({
        line: 5,
        explanation: `Station ${i}: gas=${gas[i]}, cost=${cost[i]}, net=${net}. tank=${tank}. start=${start}.`,
        variables: { i, 'gas[i]': gas[i], 'cost[i]': cost[i], net, tank, start },
        visualization: {
          type: 'array',
          array: gas.map((g, k) => g - cost[k]),
          highlights: { [i]: tank < 0 ? 'mismatch' : 'active', [start]: 'pointer' },
          labels: { [i]: 'i', [start]: 'start' },
        },
      });

      if (tank < 0) {
        steps.push({
          line: 7,
          explanation: `tank=${tank} < 0. Cannot reach station ${i + 1} from start=${start}. Reset: start=${i + 1}, tank=0.`,
          variables: { tank, oldStart: start, newStart: i + 1 },
          visualization: {
            type: 'array',
            array: gas.map((g, k) => g - cost[k]),
            highlights: { [i]: 'mismatch', [Math.min(i + 1, n - 1)]: 'found' },
            labels: { [i]: 'fail', [Math.min(i + 1, n - 1)]: 'new start' },
          },
        });
        start = i + 1;
        tank = 0;
      }
    }

    steps.push({
      line: 8,
      explanation: `Scan complete. Starting at station ${start} allows completing the circular route.`,
      variables: { result: start },
      visualization: {
        type: 'array',
        array: [...gas],
        highlights: { [start]: 'found' },
        labels: { [start]: 'START' },
      },
    });

    return steps;
  },
};

export default gasStationIi;
