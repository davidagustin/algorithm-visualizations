import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const waterAndJugProblem: AlgorithmDefinition = {
  id: 'water-and-jug-problem',
  title: 'Water and Jug Problem',
  leetcodeNumber: 365,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'You have two jugs of capacities x and y. Determine if it is possible to measure exactly target liters using these jugs. By Bezout theorem, we can measure any amount that is a multiple of GCD(x, y). So the answer is: target is reachable if target <= x + y and target % GCD(x, y) == 0.',
  tags: ['math', 'gcd', 'depth-first search'],

  code: {
    pseudocode: `function canMeasureWater(x, y, target):
  if target > x + y: return false
  if target == 0: return true
  g = gcd(x, y)
  return target % g == 0`,

    python: `from math import gcd
def canMeasureWater(x, y, target):
    if target > x + y:
        return False
    if target == 0:
        return True
    return target % gcd(x, y) == 0`,

    javascript: `function canMeasureWater(x, y, target) {
  if (target > x + y) return false;
  if (target === 0) return true;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  return target % gcd(x, y) === 0;
}`,

    java: `public boolean canMeasureWater(int x, int y, int target) {
    if (target > x + y) return false;
    if (target == 0) return true;
    return target % gcd(x, y) == 0;
}
private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
  },

  defaultInput: {
    x: 3,
    y: 5,
    target: 4,
  },

  inputFields: [
    {
      name: 'x',
      label: 'Jug 1 Capacity',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Capacity of first jug',
    },
    {
      name: 'y',
      label: 'Jug 2 Capacity',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Capacity of second jug',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Target number of liters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = input.x as number;
    const y = input.y as number;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (vals: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: vals,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Jug 1 capacity: ${x}, Jug 2 capacity: ${y}, target: ${target}. Total capacity: ${x + y}.`,
      variables: { x, y, target, totalCapacity: x + y },
      visualization: makeViz([x, y, target], { 0: 'active', 1: 'active', 2: 'comparing' }, { 0: `jug1=${x}`, 1: `jug2=${y}`, 2: `target=${target}` }),
    });

    if (target > x + y) {
      steps.push({
        line: 1,
        explanation: `target ${target} > total capacity ${x + y}. Impossible. Return false.`,
        variables: { result: false },
        visualization: makeViz([x, y, target], { 2: 'mismatch' }, { 0: `max=${x + y}`, 2: `target=${target}` }),
      });
      return steps;
    }

    if (target === 0) {
      steps.push({
        line: 2,
        explanation: 'target = 0. We already have 0 liters (empty jugs). Return true.',
        variables: { result: true },
        visualization: makeViz([x, y, 0], { 2: 'found' }, { 2: 'target=0' }),
      });
      return steps;
    }

    steps.push({
      line: 2,
      explanation: `target ${target} <= total capacity ${x + y}. Feasibility check passed. Now compute GCD(${x}, ${y}).`,
      variables: { x, y, target },
      visualization: makeViz([x, y], { 0: 'active', 1: 'active' }, { 0: String(x), 1: String(y) }),
    });

    const gcdSteps: [number, number][] = [];
    let a = x, b = y;
    while (b !== 0) {
      gcdSteps.push([a, b]);
      const r = a % b;
      a = b;
      b = r;
    }
    const g = a;

    for (const [ga, gb] of gcdSteps) {
      steps.push({
        line: 3,
        explanation: `GCD step: GCD(${ga}, ${gb}). ${ga} % ${gb} = ${ga % gb}. Continue with GCD(${gb}, ${ga % gb}).`,
        variables: { a: ga, b: gb, remainder: ga % gb },
        visualization: makeViz([ga, gb], { 0: 'comparing', 1: 'comparing' }, { 0: String(ga), 1: String(gb) }),
      });
    }

    steps.push({
      line: 3,
      explanation: `GCD(${x}, ${y}) = ${g}. By Bezout theorem, reachable amounts are multiples of ${g}.`,
      variables: { gcd: g },
      visualization: makeViz([g, target], { 0: 'active', 1: 'comparing' }, { 0: `gcd=${g}`, 1: `target=${target}` }),
    });

    const result = target % g === 0;
    steps.push({
      line: 4,
      explanation: `${target} % ${g} = ${target % g}. ${result ? `${target} is a multiple of ${g}. Can measure!` : `${target} is NOT a multiple of ${g}. Cannot measure.`} Return ${result}.`,
      variables: { target, gcd: g, remainder: target % g, result },
      visualization: makeViz([x, y, target], { 0: 'found', 1: 'found', 2: result ? 'found' : 'mismatch' }, { 2: result ? 'YES' : 'NO' }),
    });

    return steps;
  },
};

export default waterAndJugProblem;
