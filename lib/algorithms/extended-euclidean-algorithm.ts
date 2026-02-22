import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const extendedEuclideanAlgorithm: AlgorithmDefinition = {
  id: 'extended-euclidean-algorithm',
  title: 'Extended Euclidean Algorithm',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Find integers x, y such that ax + by = gcd(a,b) using the extended Euclidean algorithm. Back-substitutes quotients to find Bezout coefficients.',
  tags: ['Math', 'Number Theory', 'GCD', 'Extended GCD'],
  code: {
    pseudocode: `function extGcd(a, b):
  if b == 0: return (a, 1, 0)
  g, x1, y1 = extGcd(b, a mod b)
  x = y1
  y = x1 - (a div b) * y1
  return (g, x, y)`,
    python: `def ext_gcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x1, y1 = ext_gcd(b, a % b)
    return g, y1, x1 - (a // b) * y1`,
    javascript: `function extGcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = extGcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}`,
    java: `public long[] extGcd(long a, long b) {
    if (b == 0) return new long[]{a, 1, 0};
    long[] r = extGcd(b, a % b);
    return new long[]{r[0], r[2], r[1] - (a / b) * r[2]};
}`,
  },
  defaultInput: { a: 35, b: 15 },
  inputFields: [
    { name: 'a', label: 'a', type: 'number', defaultValue: 35, placeholder: 'e.g. 35' },
    { name: 'b', label: 'b', type: 'number', defaultValue: 15, placeholder: 'e.g. 15' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origA = input.a as number;
    const origB = input.b as number;
    const steps: AlgorithmStep[] = [];

    // Iterative extended GCD with step recording
    const callStack: Array<{ a: number; b: number }> = [];
    let a = origA;
    let b = origB;

    steps.push({
      line: 1,
      explanation: `Extended GCD(${origA}, ${origB}). Find x,y such that ${origA}*x + ${origB}*y = gcd.`,
      variables: { a: origA, b: origB },
      visualization: {
        type: 'array',
        array: [origA, origB, 0, 0, 0],
        highlights: { 0: 'active', 1: 'comparing', 2: 'visited', 3: 'visited', 4: 'visited' },
        labels: { 0: 'a', 1: 'b', 2: 'gcd', 3: 'x', 4: 'y' },
      },
    });

    // Forward pass
    while (b !== 0) {
      callStack.push({ a, b });
      steps.push({
        line: 3,
        explanation: `extGcd(${a}, ${b}): recurse with extGcd(${b}, ${a % b}) since ${a}%${b}=${a % b}.`,
        variables: { a, b, rem: a % b, quotient: Math.floor(a / b) },
        visualization: {
          type: 'array',
          array: [a, b, a % b, Math.floor(a / b)],
          highlights: { 0: 'active', 1: 'comparing', 2: 'found', 3: 'visited' },
          labels: { 0: 'a', 1: 'b', 2: 'rem', 3: 'q' },
        },
      });
      const newB = a % b;
      a = b;
      b = newB;
    }

    // Base case
    let x = 1;
    let y = 0;
    const gcd = a;

    steps.push({
      line: 2,
      explanation: `Base case: b=0, return gcd=${gcd}, x=1, y=0.`,
      variables: { gcd, x, y },
      visualization: {
        type: 'array',
        array: [a, 0, gcd, x, y],
        highlights: { 0: 'found', 1: 'visited', 2: 'sorted', 3: 'active', 4: 'comparing' },
        labels: { 0: 'a', 1: 'b', 2: 'gcd', 3: 'x', 4: 'y' },
      },
    });

    // Backtrack
    while (callStack.length > 0) {
      const frame = callStack.pop()!;
      const q = Math.floor(frame.a / frame.b);
      const newX = y;
      const newY = x - q * y;
      x = newX;
      y = newY;
      steps.push({
        line: 5,
        explanation: `Back in extGcd(${frame.a}, ${frame.b}): x=y1=${x}, y=x1-q*y1=${y} (q=${q}).`,
        variables: { a: frame.a, b: frame.b, q, x, y },
        visualization: {
          type: 'array',
          array: [frame.a, frame.b, gcd, x, y],
          highlights: { 0: 'active', 1: 'comparing', 2: 'sorted', 3: 'found', 4: 'found' },
          labels: { 0: 'a', 1: 'b', 2: 'gcd', 3: 'x', 4: 'y' },
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `Done: gcd(${origA},${origB})=${gcd}. ${origA}*(${x}) + ${origB}*(${y}) = ${origA * x + origB * y}.`,
      variables: { gcd, x, y, verify: origA * x + origB * y },
      visualization: {
        type: 'array',
        array: [origA, origB, gcd, x, y],
        highlights: { 0: 'visited', 1: 'visited', 2: 'sorted', 3: 'active', 4: 'comparing' },
        labels: { 0: 'a', 1: 'b', 2: 'gcd', 3: 'x', 4: 'y' },
      },
    });

    return steps;
  },
};

export default extendedEuclideanAlgorithm;
