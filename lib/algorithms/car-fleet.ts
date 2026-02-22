import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const carFleet: AlgorithmDefinition = {
  id: 'car-fleet',
  title: 'Car Fleet',
  leetcodeNumber: 853,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Determine how many car fleets arrive at a target destination. Sort cars by position (descending). Compute each car\'s time-to-target. Use a stack: if the current car arrives after (or equal to) the car ahead, it forms a new fleet; otherwise it merges and inherits the slower time.',
  tags: ['Stack', 'Array', 'Sorting', 'Greedy'],
  code: {
    pseudocode: `function carFleet(target, position, speed):
  cars = sort(zip(position, speed)) descending by position
  stack = []
  for pos, spd in cars:
    time = (target - pos) / spd
    if stack empty or time > stack.top:
      stack.push(time)
    // else: this car catches up, merges with fleet ahead
  return length of stack`,
    python: `def carFleet(target, position, speed):
    cars = sorted(zip(position, speed), reverse=True)
    stack = []
    for pos, spd in cars:
        time = (target - pos) / spd
        if not stack or time > stack[-1]:
            stack.append(time)
    return len(stack)`,
    javascript: `function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]])
    .sort((a, b) => b[0] - a[0]);
  const stack = [];
  for (const [pos, spd] of cars) {
    const time = (target - pos) / spd;
    if (!stack.length || time > stack[stack.length - 1]) {
      stack.push(time);
    }
  }
  return stack.length;
}`,
    java: `public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> position[b] - position[a]);
    Deque<Double> stack = new ArrayDeque<>();
    for (int i : idx) {
        double time = (double)(target - position[i]) / speed[i];
        if (stack.isEmpty() || time > stack.peek()) {
            stack.push(time);
        }
    }
    return stack.size();
}`,
  },
  defaultInput: {
    target: 12,
    position: [10, 8, 0, 5, 3],
    speed: [2, 4, 1, 1, 3],
  },
  inputFields: [
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 12,
      placeholder: 'e.g. 12',
      helperText: 'Target destination position',
    },
    {
      name: 'position',
      label: 'Positions',
      type: 'array',
      defaultValue: [10, 8, 0, 5, 3],
      placeholder: 'e.g. 10,8,0,5,3',
      helperText: 'Starting positions of cars',
    },
    {
      name: 'speed',
      label: 'Speeds',
      type: 'array',
      defaultValue: [2, 4, 1, 1, 3],
      placeholder: 'e.g. 2,4,1,1,3',
      helperText: 'Speeds of corresponding cars',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number;
    const position = (input.position as number[]).slice();
    const speed = (input.speed as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];

    // Sort by position descending
    const cars = position.map((p, i) => ({ pos: p, spd: speed[i] }))
      .sort((a, b) => b.pos - a.pos);
    const sortedPositions = cars.map(c => c.pos);

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < sortedPositions.length; i++) {
        if (i < (activeIdx ?? -1)) {
          highlights[i] = 'sorted';
        } else if (i === activeIdx) {
          highlights[i] = 'current';
          labels[i] = 'curr';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: sortedPositions,
        highlights,
        labels,
        auxData: {
          label: 'Fleet Stack (arrival times)',
          entries: [
            { key: 'Target', value: String(target) },
            { key: 'Stack (times)', value: stack.length > 0 ? `[${stack.map(t => t.toFixed(2)).join(', ')}]` : '[]' },
            { key: 'Fleets so far', value: String(stack.length) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort cars by position descending: ${cars.map(c => `pos=${c.pos},spd=${c.spd}`).join(' | ')}. Cars closer to target are processed first.`,
      variables: { target, cars: cars.map(c => `(${c.pos},${c.spd})`) },
      visualization: makeViz(null),
    });

    for (let i = 0; i < cars.length; i++) {
      const { pos, spd } = cars[i];
      const time = (target - pos) / spd;

      steps.push({
        line: 3,
        explanation: `Car at pos=${pos}, speed=${spd}: time to target = (${target}-${pos})/${spd} = ${time.toFixed(2)}. Compare with stack top.`,
        variables: { pos, spd, time: time.toFixed(2), stackTop: stack.length > 0 ? stack[stack.length - 1].toFixed(2) : 'empty' },
        visualization: makeViz(i),
      });

      if (stack.length === 0 || time > stack[stack.length - 1]) {
        stack.push(time);
        steps.push({
          line: 5,
          explanation: `time=${time.toFixed(2)} > stack top (${stack.length > 1 ? stack[stack.length - 2].toFixed(2) : 'none'}). New fleet! Push time ${time.toFixed(2)}. Total fleets: ${stack.length}.`,
          variables: { pushed: time.toFixed(2), fleets: stack.length },
          visualization: makeViz(i),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `time=${time.toFixed(2)} <= stack top ${stack[stack.length - 1].toFixed(2)}. This car catches up and joins the fleet ahead. No new fleet.`,
          variables: { time: time.toFixed(2), mergesInto: stack[stack.length - 1].toFixed(2) },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `All cars processed. Total car fleets = ${stack.length}.`,
      variables: { result: stack.length },
      visualization: (() => {
        const h: Record<number, string> = {};
        for (let i = 0; i < sortedPositions.length; i++) h[i] = 'found';
        return {
          type: 'array' as const,
          array: sortedPositions,
          highlights: h,
          labels: {},
          auxData: {
            label: 'Result',
            entries: [{ key: 'Number of Car Fleets', value: String(stack.length) }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default carFleet;
