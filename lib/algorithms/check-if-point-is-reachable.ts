import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfPointIsReachable: AlgorithmDefinition = {
  id: 'check-if-point-is-reachable',
  title: 'Check if Point is Reachable',
  leetcodeNumber: 2543,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Starting from (1,1), can you reach (targetX, targetY) using two operations: (x,y)->(x+y,y) or (x,y)->(x,x+y)? Working backwards: if max > min, subtract min from max (reverse of addition). This is like GCD. Point is reachable iff targetX and targetY share gcd that is a power of 2 (since we start at (1,1)).',
  tags: ['math', 'number theory', 'gcd'],

  code: {
    pseudocode: `function isReachable(targetX, targetY):
  // gcd(targetX, targetY) must be power of 2
  // Work backwards: if both > 1, reduce by gcd-like steps
  g = gcd(targetX, targetY)
  // g must be a power of 2 (i.e., g & (g-1) == 0)
  return (g & (g-1)) == 0`,

    python: `from math import gcd
def isReachable(targetX: int, targetY: int) -> bool:
    g = gcd(targetX, targetY)
    return (g & (g - 1)) == 0`,

    javascript: `function isReachable(targetX, targetY) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const g = gcd(targetX, targetY);
  return (g & (g - 1)) === 0;
}`,

    java: `public boolean isReachable(int targetX, int targetY) {
    int g = gcd(targetX, targetY);
    return (g & (g - 1)) == 0;
}
private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
  },

  defaultInput: { targetX: 6, targetY: 9 },

  inputFields: [
    { name: 'targetX', label: 'Target X', type: 'number', defaultValue: 6, placeholder: '6', helperText: 'Target x coordinate' },
    { name: 'targetY', label: 'Target Y', type: 'number', defaultValue: 9, placeholder: '9', helperText: 'Target y coordinate' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let tx = input.targetX as number;
    let ty = input.targetY as number;
    const steps: AlgorithmStep[] = [];

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Check if (${tx},${ty}) is reachable from (1,1). Reverse operation: subtract smaller from larger (like Euclidean GCD).`,
      variables: { targetX: tx, targetY: ty },
      visualization: makeViz([tx, ty], { 0: 'active', 1: 'active' }, { 0: `X=${tx}`, 1: `Y=${ty}` }),
    });

    // Simulate backward steps
    const history: number[][] = [[tx, ty]];
    let a = tx, b = ty;
    let iteration = 0;
    while (a !== b && iteration < 20) {
      iteration++;
      if (a > b) a = a % b || b;
      else b = b % a || a;
      if (a === 0 || b === 0) break;
      history.push([a, b]);

      steps.push({
        line: 3,
        explanation: `Backward step: reduce (${history[history.length - 2][0]},${history[history.length - 2][1]}) → (${a},${b}).`,
        variables: { a, b },
        visualization: makeViz([a, b], { 0: 'comparing', 1: 'comparing' }, { 0: `a=${a}`, 1: `b=${b}` }),
      });
    }

    const g = gcd(tx, ty);
    const isPowerOf2 = g > 0 && (g & (g - 1)) === 0;

    steps.push({
      line: 4,
      explanation: `gcd(${tx},${ty}) = ${g}. Is power of 2? ${g} in binary = ${g.toString(2)}. (g & (g-1)) = ${g & (g - 1)}. Result: ${isPowerOf2}.`,
      variables: { g, binary: g.toString(2), isPowerOf2 },
      visualization: makeViz([tx, ty, g], { 0: 'active', 1: 'active', 2: isPowerOf2 ? 'found' : 'mismatch' }, { 0: `X=${tx}`, 1: `Y=${ty}`, 2: `gcd=${g}` }),
    });

    steps.push({
      line: 5,
      explanation: `Point (${tx},${ty}) is ${isPowerOf2 ? '' : 'NOT '}reachable from (1,1). gcd=${g} is ${isPowerOf2 ? 'a power of 2' : 'not a power of 2'}.`,
      variables: { result: isPowerOf2 },
      visualization: makeViz([tx, ty], { 0: isPowerOf2 ? 'found' : 'mismatch', 1: isPowerOf2 ? 'found' : 'mismatch' }, { 0: `X=${tx}`, 1: `Y=${ty}` }),
    });

    return steps;
  },
};

export default checkIfPointIsReachable;
