import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const powXNII: AlgorithmDefinition = {
  id: 'pow-x-n-ii',
  title: 'Pow(x, n)',
  leetcodeNumber: 50,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Implement pow(x, n), which calculates x raised to the power n. Uses fast exponentiation (binary exponentiation): repeatedly square x and halve n, multiplying into result when n is odd. Handles negative exponents by inverting x.',
  tags: ['math', 'recursion', 'binary exponentiation', 'divide and conquer'],

  code: {
    pseudocode: `function myPow(x, n):
  if n < 0:
    x = 1 / x
    n = -n
  result = 1
  while n > 0:
    if n is odd:
      result *= x
    x *= x
    n = floor(n / 2)
  return result`,

    python: `def myPow(x: float, n: int) -> float:
    if n < 0:
        x = 1 / x
        n = -n
    result = 1.0
    while n > 0:
        if n % 2 == 1:
            result *= x
        x *= x
        n //= 2
    return result`,

    javascript: `function myPow(x, n) {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let result = 1;
  while (n > 0) {
    if (n % 2 === 1) result *= x;
    x *= x;
    n = Math.floor(n / 2);
  }
  return result;
}`,

    java: `public double myPow(double x, int n) {
    long N = n;
    if (N < 0) { x = 1 / x; N = -N; }
    double result = 1;
    while (N > 0) {
        if (N % 2 == 1) result *= x;
        x *= x;
        N /= 2;
    }
    return result;
}`,
  },

  defaultInput: { x: 2, n: 10 },

  inputFields: [
    { name: 'x', label: 'Base (x)', type: 'number', defaultValue: 2, placeholder: '2', helperText: 'The base value' },
    { name: 'n', label: 'Exponent (n)', type: 'number', defaultValue: 10, placeholder: '10', helperText: 'The exponent (can be negative)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let x = input.x as number;
    let n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    if (n < 0) {
      x = 1 / x;
      n = -n;
      steps.push({
        line: 2,
        explanation: `n is negative. Invert x to ${x.toFixed(4)} and negate n to ${n}.`,
        variables: { x, n },
        visualization: makeViz([Math.round(x * 10000) / 10000, n, 1], { 0: 'active', 2: 'found' }, { 0: 'x', 1: 'n', 2: 'result' }),
      });
    }

    let result = 1;
    const history: number[] = [result];

    steps.push({
      line: 4,
      explanation: `Initialize result = 1. x = ${x.toFixed(4)}, n = ${n}.`,
      variables: { x, n, result },
      visualization: makeViz([Math.round(x * 10000) / 10000, n, result], { 2: 'active' }, { 0: 'x', 1: 'n', 2: 'result' }),
    });

    let iteration = 0;
    while (n > 0 && iteration < 20) {
      iteration++;
      const isOdd = n % 2 === 1;
      if (isOdd) {
        result *= x;
        history.push(Math.round(result * 10000) / 10000);
      }
      x *= x;
      n = Math.floor(n / 2);

      steps.push({
        line: isOdd ? 6 : 7,
        explanation: `n is ${isOdd ? 'odd' : 'even'}: ${isOdd ? `multiply result by x → ${result.toFixed(4)}. ` : ''}Square x → ${x.toFixed(4)}, n → ${n}.`,
        variables: { x: Math.round(x * 10000) / 10000, n, result: Math.round(result * 10000) / 10000 },
        visualization: makeViz(
          [Math.round(x * 10000) / 10000, n, Math.round(result * 10000) / 10000],
          { 0: isOdd ? 'comparing' : 'active', 1: 'active', 2: isOdd ? 'found' : 'pointer' },
          { 0: 'x', 1: 'n', 2: 'result' }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `n = 0. Return result = ${result.toFixed(6)}.`,
      variables: { result: Math.round(result * 1000000) / 1000000 },
      visualization: makeViz([Math.round(result * 10000) / 10000], { 0: 'found' }, { 0: 'result' }),
    });

    return steps;
  },
};

export default powXNII;
