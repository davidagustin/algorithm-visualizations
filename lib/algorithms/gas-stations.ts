import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gasStations: AlgorithmDefinition = {
  id: 'gas-stations',
  title: 'Gas Stations (Gas Station Circuit)',
  leetcodeNumber: 134,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'There are n gas stations along a circular route. Station i has gas[i] fuel and it costs cost[i] to travel to the next station. Find the starting station index to complete the circuit, or -1 if impossible. Key insight: if total gas >= total cost, a solution exists. Track tank balance; when it drops below 0, restart from the next station. O(n) time.',
  tags: ['Greedy', 'Array'],
  code: {
    pseudocode: `function canCompleteCircuit(gas, cost):
  totalSurplus = 0, currentTank = 0, start = 0
  for i from 0 to n-1:
    diff = gas[i] - cost[i]
    totalSurplus += diff
    currentTank += diff
    if currentTank < 0:
      start = i + 1
      currentTank = 0
  if totalSurplus >= 0:
    return start
  return -1`,
    python: `def canCompleteCircuit(gas, cost):
    total_surplus = current_tank = start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_surplus += diff
        current_tank += diff
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    return start if total_surplus >= 0 else -1`,
    javascript: `function canCompleteCircuit(gas, cost) {
  let totalSurplus = 0, currentTank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    totalSurplus += diff;
    currentTank += diff;
    if (currentTank < 0) {
      start = i + 1;
      currentTank = 0;
    }
  }
  return totalSurplus >= 0 ? start : -1;
}`,
    java: `public int canCompleteCircuit(int[] gas, int[] cost) {
    int totalSurplus = 0, currentTank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        totalSurplus += diff;
        currentTank += diff;
        if (currentTank < 0) {
            start = i + 1;
            currentTank = 0;
        }
    }
    return totalSurplus >= 0 ? start : -1;
}`,
  },
  defaultInput: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] },
  inputFields: [
    {
      name: 'gas',
      label: 'Gas',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Gas available at each station',
    },
    {
      name: 'cost',
      label: 'Cost',
      type: 'array',
      defaultValue: [3, 4, 5, 1, 2],
      placeholder: '3,4,5,1,2',
      helperText: 'Cost to travel to next station',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const gas = input.gas as number[];
    const cost = input.cost as number[];
    const steps: AlgorithmStep[] = [];
    const n = gas.length;

    // Visualize the net gain (gas - cost) at each station
    const diff = gas.map((g, i) => g - cost[i]);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...diff],
      highlights,
      labels,
      auxData: { label: 'Circuit State', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Find starting station for circuit. gas=[${gas.join(',')}], cost=[${cost.join(',')}]. Net gain at each station: [${diff.join(', ')}].`,
      variables: { gas, cost, diff },
      visualization: makeViz(
        {},
        Object.fromEntries(diff.map((d, i) => [i, `${gas[i]}-${cost[i]}=${d}`])),
        [{ key: 'Net gains', value: diff.join(', ') }],
      ),
    });

    let totalSurplus = 0;
    let currentTank = 0;
    let start = 0;

    steps.push({
      line: 2,
      explanation: `Initialize totalSurplus=0, currentTank=0, start=0.`,
      variables: { totalSurplus, currentTank, start },
      visualization: makeViz(
        { 0: 'pointer' },
        { 0: 'start' },
        [{ key: 'Start', value: '0' }, { key: 'Tank', value: '0' }, { key: 'Total', value: '0' }],
      ),
    });

    for (let i = 0; i < n; i++) {
      const d = diff[i];
      totalSurplus += d;
      currentTank += d;

      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) hl[j] = 'visited';
      hl[i] = d >= 0 ? 'active' : 'comparing';
      if (start <= i) hl[start] = 'pointer';

      steps.push({
        line: 4,
        explanation: `Station ${i}: gain ${gas[i]} gas, spend ${cost[i]}. Net = ${d}. currentTank = ${currentTank}, totalSurplus = ${totalSurplus}.`,
        variables: { i, 'gas[i]': gas[i], 'cost[i]': cost[i], diff: d, currentTank, totalSurplus, start },
        visualization: makeViz(
          hl,
          { [i]: `tank=${currentTank}`, [start]: 'start' },
          [{ key: 'Start', value: String(start) }, { key: 'Tank', value: String(currentTank) }, { key: 'Total Surplus', value: String(totalSurplus) }],
        ),
      });

      if (currentTank < 0) {
        steps.push({
          line: 7,
          explanation: `Tank < 0 (${currentTank})! Cannot start from station ${start}. Reset: start = ${i + 1}, currentTank = 0.`,
          variables: { oldStart: start, newStart: i + 1, currentTank: 0 },
          visualization: makeViz(
            { ...hl, [i]: 'mismatch' },
            { [i]: 'fail' },
            [{ key: 'New Start', value: String(i + 1) }, { key: 'Tank (reset)', value: '0' }],
          ),
        });
        start = i + 1;
        currentTank = 0;
      }
    }

    const result = totalSurplus >= 0 ? start : -1;

    const finalHl: Record<number, string> = {};
    if (result >= 0) {
      for (let i = 0; i < n; i++) finalHl[i] = 'found';
      finalHl[result] = 'active';
    } else {
      for (let i = 0; i < n; i++) finalHl[i] = 'mismatch';
    }

    steps.push({
      line: 9,
      explanation: totalSurplus >= 0
        ? `totalSurplus (${totalSurplus}) >= 0. A valid circuit exists starting from station ${start}.`
        : `totalSurplus (${totalSurplus}) < 0. Not enough total gas. No valid starting station exists.`,
      variables: { totalSurplus, result },
      visualization: makeViz(
        finalHl,
        result >= 0 ? { [result]: 'START' } : {},
        [{ key: 'Answer', value: result >= 0 ? `Station ${result}` : 'Impossible (-1)' }],
      ),
    });

    return steps;
  },
};

export default gasStations;
