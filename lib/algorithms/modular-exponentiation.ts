import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const modularExponentiation: AlgorithmDefinition = {
  id: 'modular-exponentiation',
  title: 'Modular Exponentiation',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute base^exp mod m efficiently using fast exponentiation (square-and-multiply). Reduces O(exp) multiplications to O(log exp).',
  tags: ['Math', 'Number Theory', 'Modular Arithmetic'],
  code: {
    pseudocode: `function modpow(base, exp, mod):
  result = 1
  base = base mod mod
  while exp > 0:
    if exp is odd:
      result = result * base mod mod
    exp = exp >> 1
    base = base * base mod mod
  return result`,
    python: `def modpow(base, exp, mod):
    result = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            result = result * base % mod
        exp >>= 1
        base = base * base % mod
    return result`,
    javascript: `function modpow(base, exp, mod) {
  let result = 1;
  base %= mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = result * base % mod;
    exp >>= 1;
    base = base * base % mod;
  }
  return result;
}`,
    java: `public long modpow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}`,
  },
  defaultInput: { base: 3, exp: 13, mod: 1000 },
  inputFields: [
    { name: 'base', label: 'Base', type: 'number', defaultValue: 3, placeholder: 'e.g. 3' },
    { name: 'exp', label: 'Exponent', type: 'number', defaultValue: 13, placeholder: 'e.g. 13' },
    { name: 'mod', label: 'Modulus', type: 'number', defaultValue: 1000, placeholder: 'e.g. 1000' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let base = input.base as number;
    let exp = input.exp as number;
    const mod = input.mod as number;
    const steps: AlgorithmStep[] = [];
    let result = 1;
    base = base % mod;

    const makeViz = (res: number, b: number, e: number): ArrayVisualization => ({
      type: 'array',
      array: [res, b, e, mod],
      highlights: { 0: 'found', 1: 'active', 2: 'comparing', 3: 'visited' },
      labels: { 0: 'result', 1: 'base', 2: 'exp', 3: 'mod' },
    });

    steps.push({
      line: 1,
      explanation: `Compute ${input.base}^${input.exp} mod ${mod}. Init result=1, base=${base}.`,
      variables: { result, base, exp },
      visualization: makeViz(result, base, exp),
    });

    let iteration = 0;
    while (exp > 0) {
      iteration++;
      const bit = exp % 2;
      steps.push({
        line: 4,
        explanation: `Iteration ${iteration}: exp=${exp} (binary bit=${bit}). ${bit === 1 ? 'Odd — multiply result.' : 'Even — skip multiply.'}`,
        variables: { exp, bit, result, base },
        visualization: makeViz(result, base, exp),
      });

      if (bit === 1) {
        result = (result * base) % mod;
        steps.push({
          line: 5,
          explanation: `exp is odd. result = result * base mod ${mod} = ${result}.`,
          variables: { result, base, exp },
          visualization: makeViz(result, base, exp),
        });
      }

      exp = exp >> 1;
      base = (base * base) % mod;

      steps.push({
        line: 7,
        explanation: `Square base: base = ${base}. Halve exp: exp = ${exp}.`,
        variables: { result, base, exp },
        visualization: makeViz(result, base, exp),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. ${input.base}^${input.exp} mod ${mod} = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [result],
        highlights: { 0: 'sorted' },
        labels: { 0: 'answer' },
      },
    });

    return steps;
  },
};

export default modularExponentiation;
