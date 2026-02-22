import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gasStationGreedy: AlgorithmDefinition = {
  id: 'gas-station-greedy',
  title: 'Gas Station (Greedy)',
  leetcodeNumber: 134,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'There are n gas stations in a circle. The i-th station has gas[i] fuel and costs cost[i] to travel to the next. Find the starting station index where you can complete the circuit, or -1 if impossible. Greedy: if total gas >= total cost, a solution exists. Track the running tank; when it goes negative, reset start to the next station.',
  tags: ['greedy', 'array', 'circular'],

  code: {
    pseudocode: `function canCompleteCircuit(gas, cost):
  totalGas = 0, tank = 0, start = 0
  for i from 0 to n-1:
    diff = gas[i] - cost[i]
    totalGas += diff
    tank += diff
    if tank < 0:
      start = i + 1
      tank = 0
  if totalGas >= 0: return start
  return -1`,

    python: `def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
    total = tank = start = 0
    for i, (g, c) in enumerate(zip(gas, cost)):
        diff = g - c
        total += diff
        tank += diff
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total >= 0 else -1`,

    javascript: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,

    java: `public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
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
      helperText: 'Fuel cost to travel to the next station',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const gas = input.gas as number[];
    const cost = input.cost as number[];
    const steps: AlgorithmStep[] = [];
    const n = gas.length;
    const diff = gas.map((g, i) => g - cost[i]);

    steps.push({
      line: 1,
      explanation: `Compute net gain at each station (gas - cost): [${diff.join(', ')}]. Start with tank=0, start=0.`,
      variables: { diff: [...diff], tank: 0, start: 0, totalGas: 0 },
      visualization: {
        type: 'array',
        array: [...diff],
        highlights: {},
        labels: Object.fromEntries(diff.map((d, i) => [i, d >= 0 ? `+${d}` : `${d}`])) as Record<number, string>,
      },
    });

    let total = 0;
    let tank = 0;
    let start = 0;

    for (let i = 0; i < n; i++) {
      const d = diff[i];
      total += d;
      tank += d;

      if (tank < 0) {
        steps.push({
          line: 7,
          explanation: `Station ${i}: net gain=${d}, tank drops to ${tank} < 0. Cannot start from ${start}. Reset: start=${i + 1}, tank=0.`,
          variables: { i, tank, start: i + 1, total },
          visualization: {
            type: 'array',
            array: [...diff],
            highlights: {
              ...Object.fromEntries(Array.from({ length: start }, (_, j) => [j, 'mismatch'])),
              [i]: 'active',
            } as Record<number, string>,
            labels: { [i + 1 < n ? i + 1 : 0]: 'new start' } as Record<number, string>,
          },
        });
        start = i + 1;
        tank = 0;
      } else {
        steps.push({
          line: 5,
          explanation: `Station ${i}: net gain=${d}, tank=${tank}. Still viable from start=${start}.`,
          variables: { i, tank, start, total },
          visualization: {
            type: 'array',
            array: [...diff],
            highlights: {
              [start]: 'found',
              [i]: 'active',
            } as Record<number, string>,
            labels: { [start]: 'start', [i]: `tank=${tank}` } as Record<number, string>,
          },
        });
      }
    }

    if (total >= 0) {
      steps.push({
        line: 9,
        explanation: `Total net gas=${total} >= 0. A solution exists. Starting station: ${start}.`,
        variables: { result: start, total },
        visualization: {
          type: 'array',
          array: [...diff],
          highlights: Object.fromEntries(diff.map((_, i) => [i, i === start ? 'found' : 'sorted'])) as Record<number, string>,
          labels: { [start]: 'START' } as Record<number, string>,
        },
      });
    } else {
      steps.push({
        line: 10,
        explanation: `Total net gas=${total} < 0. Impossible to complete the circuit. Return -1.`,
        variables: { result: -1, total },
        visualization: {
          type: 'array',
          array: [...diff],
          highlights: Object.fromEntries(diff.map((_, i) => [i, 'mismatch'])) as Record<number, string>,
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default gasStationGreedy;
