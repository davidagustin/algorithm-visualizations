import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const modularInverse: AlgorithmDefinition = {
  id: 'modular-inverse',
  title: 'Modular Inverse',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Find x such that a*x ≡ 1 (mod m) using the extended Euclidean algorithm. A modular inverse exists iff gcd(a,m)=1.',
  tags: ['Math', 'Number Theory', 'Modular Arithmetic', 'Extended GCD'],
  code: {
    pseudocode: `function modInverse(a, m):
  g, x, _ = extGcd(a, m)
  if g != 1: return "No inverse"
  return (x mod m + m) mod m

function extGcd(a, b):
  if b == 0: return (a, 1, 0)
  g, x1, y1 = extGcd(b, a mod b)
  return (g, y1, x1 - (a/b)*y1)`,
    python: `def mod_inverse(a, m):
    def ext_gcd(a, b):
        if b == 0: return a, 1, 0
        g, x1, y1 = ext_gcd(b, a % b)
        return g, y1, x1 - (a // b) * y1
    g, x, _ = ext_gcd(a % m, m)
    if g != 1:
        return None  # no inverse
    return (x % m + m) % m`,
    javascript: `function modInverse(a, m) {
  function extGcd(a, b) {
    if (b === 0) return [a, 1, 0];
    const [g, x1, y1] = extGcd(b, a % b);
    return [g, y1, x1 - Math.floor(a / b) * y1];
  }
  const [g, x] = extGcd(((a % m) + m) % m, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}`,
    java: `public Integer modInverse(int a, int m) {
    long[] res = extGcd(((a % m) + m) % m, m);
    if (res[0] != 1) return null;
    return (int)((res[1] % m + m) % m);
}`,
  },
  defaultInput: { a: 3, m: 11 },
  inputFields: [
    { name: 'a', label: 'a', type: 'number', defaultValue: 3, placeholder: 'e.g. 3', helperText: 'Find inverse of a' },
    { name: 'm', label: 'm (modulus)', type: 'number', defaultValue: 11, placeholder: 'e.g. 11' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const a = ((input.a as number) % (input.m as number) + (input.m as number)) % (input.m as number);
    const m = input.m as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find modular inverse of ${input.a} mod ${m}. Need x: ${a}*x ≡ 1 (mod ${m}).`,
      variables: { a, m },
      visualization: {
        type: 'array',
        array: [a, m, 0],
        highlights: { 0: 'active', 1: 'comparing', 2: 'visited' },
        labels: { 0: 'a', 1: 'm', 2: 'x' },
      },
    });

    // Iterative extended GCD
    let oldR = a, r = m;
    let oldS = 1, s = 0;

    const history: Array<{ oldR: number; r: number; oldS: number; s: number; q: number }> = [];

    while (r !== 0) {
      const q = Math.floor(oldR / r);
      history.push({ oldR, r, oldS, s, q });
      steps.push({
        line: 7,
        explanation: `extGcd: q=${q}, (${oldR}, ${r}) → (${r}, ${oldR % r}). s: (${oldS}, ${s}) → (${s}, ${oldS - q * s}).`,
        variables: { oldR, r, q, oldS, s },
        visualization: {
          type: 'array',
          array: [oldR, r, oldR % r, q, oldS, s],
          highlights: { 0: 'active', 1: 'comparing', 2: 'found', 3: 'visited', 4: 'current', 5: 'pointer' },
          labels: { 0: 'oldR', 1: 'r', 2: 'rem', 3: 'q', 4: 'oldS', 5: 's' },
        },
      });
      [oldR, r] = [r, oldR % r];
      [oldS, s] = [s, oldS - q * s];
    }

    const gcd = oldR;
    if (gcd !== 1) {
      steps.push({
        line: 3,
        explanation: `gcd(${a}, ${m}) = ${gcd} ≠ 1. No modular inverse exists.`,
        variables: { gcd, a, m },
        visualization: {
          type: 'array',
          array: [a, m, gcd],
          highlights: { 0: 'active', 1: 'comparing', 2: 'swapping' },
          labels: { 0: 'a', 1: 'm', 2: 'gcd≠1' },
        },
      });
      return steps;
    }

    const inv = ((oldS % m) + m) % m;
    steps.push({
      line: 4,
      explanation: `gcd=1. x = ${oldS}, modular inverse = (${oldS} mod ${m} + ${m}) mod ${m} = ${inv}.`,
      variables: { x: oldS, inverse: inv },
      visualization: {
        type: 'array',
        array: [a, m, inv, (a * inv) % m],
        highlights: { 0: 'active', 1: 'comparing', 2: 'sorted', 3: 'found' },
        labels: { 0: 'a', 1: 'm', 2: 'inv', 3: 'a*inv%m' },
      },
    });

    return steps;
  },
};

export default modularInverse;
