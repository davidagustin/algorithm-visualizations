import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const carFleetIntervals: AlgorithmDefinition = {
  id: 'car-fleet-intervals',
  title: 'Car Fleet (Interval Approach)',
  leetcodeNumber: 853,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given car positions and speeds heading toward target, determine how many fleets arrive together. Model each car as an interval: sort by position descending. Compute arrival time for each car; if a car\'s arrival time <= the fleet ahead, it merges. Use a stack tracking fleet arrival times. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Monotonic Stack', 'Sorting'],
  code: {
    pseudocode: `function carFleet(target, position, speed):
  cars = zip(position, speed) sorted by pos descending
  stack = []
  for (pos, spd) in cars:
    time = (target - pos) / spd
    if stack empty or time > stack.top:
      stack.push(time)  // new fleet
    // else: merges into fleet ahead
  return len(stack)`,
    python: `def carFleet(target, position, speed):
    cars = sorted(zip(position, speed), reverse=True)
    stack = []
    for pos, spd in cars:
        t = (target - pos) / spd
        if not stack or t > stack[-1]:
            stack.append(t)
    return len(stack)`,
    javascript: `function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, speed[i]])
                        .sort((a, b) => b[0] - a[0]);
  const stack = [];
  for (const [pos, spd] of cars) {
    const t = (target - pos) / spd;
    if (!stack.length || t > stack[stack.length - 1]) {
      stack.push(t);
    }
  }
  return stack.length;
}`,
    java: `public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];
    for (int i = 0; i < n; i++) cars[i] = new double[]{position[i], speed[i]};
    Arrays.sort(cars, (a,b)->Double.compare(b[0],a[0]));
    Stack<Double> stack = new Stack<>();
    for (double[] c : cars) {
        double t = (target - c[0]) / c[1];
        if (stack.isEmpty() || t > stack.peek()) stack.push(t);
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
      label: 'Target Position',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Destination position',
    },
    {
      name: 'position',
      label: 'Car Positions',
      type: 'array',
      defaultValue: [10, 8, 0, 5, 3],
      placeholder: '[10,8,0,5,3]',
      helperText: 'Starting positions of cars',
    },
    {
      name: 'speed',
      label: 'Car Speeds',
      type: 'array',
      defaultValue: [2, 4, 1, 1, 3],
      placeholder: '[2,4,1,1,3]',
      helperText: 'Speed of each car',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = Number(input.target) || 12;
    const position = input.position as number[];
    const speed = input.speed as number[];
    const n = Math.min(position.length, speed.length);
    const flat = position.slice(0, n);
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Fleets (stack)', entries: auxEntries } } : {}),
    });

    const cars = position.slice(0, n).map((p, i) => ({ pos: p, spd: speed[i], origIdx: i }));
    cars.sort((a, b) => b.pos - a.pos);

    steps.push({ line: 2,
      explanation: `target=${target}. Sort by position desc: [${cars.map(c=>`(p=${c.pos},s=${c.spd})`).join(', ')}].`,
      variables: { target, cars: cars.map(c=>({ pos: c.pos, spd: c.spd })) },
      visualization: makeViz({}, {}) });

    const stack: number[] = [];

    for (let i = 0; i < cars.length; i++) {
      const { pos, spd, origIdx } = cars[i];
      const t = (target - pos) / spd;
      const hl: Record<number, string> = { [origIdx]: 'active' };
      for (let j = 0; j < i; j++) { hl[cars[j].origIdx] = 'visited'; }

      steps.push({ line: 5,
        explanation: `Car at pos=${pos}, speed=${spd}. Arrival time = (${target}-${pos})/${spd} = ${t.toFixed(2)}.`,
        variables: { pos, speed: spd, arrivalTime: parseFloat(t.toFixed(2)), fleets: stack.length },
        visualization: makeViz(hl, { [origIdx]: `p=${pos}` },
          stack.map((tt, k) => ({ key: `fleet${k}`, value: `t=${tt.toFixed(2)}` }))) });

      if (!stack.length || t > stack[stack.length - 1]) {
        stack.push(t);
        hl[origIdx] = 'found';
        steps.push({ line: 7,
          explanation: `New fleet! t=${t.toFixed(2)} > top=${stack[stack.length - 2]?.toFixed(2) ?? 'N/A'}. Fleets: ${stack.length}.`,
          variables: { t: parseFloat(t.toFixed(2)), fleets: stack.length },
          visualization: makeViz(hl, { [origIdx]: `fleet${stack.length-1}` },
            stack.map((tt, k) => ({ key: `fleet${k}`, value: `t=${tt.toFixed(2)}` }))) });
      } else {
        hl[origIdx] = 'sorted';
        steps.push({ line: 8,
          explanation: `Merges into fleet ahead. t=${t.toFixed(2)} <= top=${stack[stack.length - 1].toFixed(2)}. No new fleet.`,
          variables: { t: parseFloat(t.toFixed(2)), fleets: stack.length },
          visualization: makeViz(hl, {},
            stack.map((tt, k) => ({ key: `fleet${k}`, value: `t=${tt.toFixed(2)}` }))) });
      }
    }

    const finalHl: Record<number, string> = {};
    flat.forEach((_, j) => { finalHl[j] = 'found'; });
    steps.push({ line: 9, explanation: `Done. ${stack.length} fleets reach target=${target}.`,
      variables: { fleets: stack.length },
      visualization: makeViz(finalHl, {}, [{ key: 'Fleets', value: String(stack.length) }]) });

    return steps;
  },
};

export default carFleetIntervals;
