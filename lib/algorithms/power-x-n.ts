import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const powerXN: AlgorithmDefinition = {
  id: 'power-x-n',
  title: 'Pow(x, n)',
  leetcodeNumber: 50,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Implement pow(x, n) which calculates x raised to the power n. Fast exponentiation (binary exponentiation) halves the exponent at each step: if n is even, pow(x,n) = pow(x*x, n/2); if n is odd, multiply an extra x. This runs in O(log n) time instead of O(n).',
  tags: ['Math', 'Recursion', 'Divide and Conquer'],
  code: {
    pseudocode: `function myPow(x, n):
  if n < 0:
    x = 1/x, n = -n
  result = 1
  while n > 0:
    if n is odd:
      result *= x
    x = x * x
    n = n / 2
  return result`,
    python: `def myPow(x, n):
    if n < 0:
        x, n = 1 / x, -n
    result = 1
    while n > 0:
        if n % 2 == 1:
            result *= x
        x *= x
        n //= 2
    return result`,
    javascript: `function myPow(x, n) {
  if (n < 0) { x = 1 / x; n = -n; }
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
    {
      name: 'x',
      label: 'Base (x)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'The base value',
    },
    {
      name: 'n',
      label: 'Exponent (n)',
      type: 'number',
      defaultValue: 10,
      placeholder: 'e.g. 10',
      helperText: 'The exponent (can be negative)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let x = input.x as number;
    let n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const history: { x: number; n: number; result: number; action: string }[] = [];

    const makeViz = (activeIdx: number): ArrayVisualization => {
      const arr = history.map(h => Math.round(h.result * 1000) / 1000);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < history.length; i++) {
        highlights[i] = i === activeIdx ? 'active' : 'sorted';
        labels[i] = `n=${history[i].n}`;
      }
      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels,
        auxData: {
          label: 'Fast Exponentiation',
          entries: history.map((h, i) => ({
            key: `Step ${i + 1}`,
            value: `x=${Math.round(h.x * 1000) / 1000}, n=${h.n}, res=${Math.round(h.result * 1000) / 1000} [${h.action}]`,
          })),
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Compute ${x}^${n} using fast exponentiation. Time: O(log n) by halving exponent each step.`,
      variables: { x, n },
      visualization: {
        type: 'array',
        array: [x, n],
        highlights: { 0: 'active', 1: 'pointer' },
        labels: { 0: 'x', 1: 'n' },
        auxData: { label: 'Input', entries: [{ key: 'Goal', value: `${x}^${n}` }] },
      },
    });

    if (n < 0) {
      x = 1 / x;
      n = -n;
      steps.push({
        line: 2,
        explanation: `n is negative. Invert x: x = 1/${input.x} = ${Math.round(x * 10000) / 10000}, and negate n: n = ${n}.`,
        variables: { x, n },
        visualization: {
          type: 'array',
          array: [Math.round(x * 10000) / 10000, n],
          highlights: { 0: 'comparing', 1: 'comparing' },
          labels: { 0: 'x (inv)', 1: 'n (pos)' },
          auxData: { label: 'Negated', entries: [{ key: 'New x', value: String(Math.round(x * 10000) / 10000) }, { key: 'New n', value: String(n) }] },
        },
      });
    }

    let result = 1;
    let step = 0;

    steps.push({
      line: 4,
      explanation: `Initialize result = 1. We will accumulate odd-exponent multiplications here.`,
      variables: { result, x: Math.round(x * 10000) / 10000, n },
      visualization: makeViz(-1),
    });

    while (n > 0) {
      const isOdd = n % 2 === 1;
      history.push({ x: Math.round(x * 10000) / 10000, n, result: Math.round(result * 10000) / 10000, action: isOdd ? 'result *= x' : 'skip' });

      if (isOdd) {
        result *= x;
        steps.push({
          line: 6,
          explanation: `n=${n} is odd. Multiply result by x: result = ${Math.round(result * 10000) / 10000}. Then square x and halve n.`,
          variables: { n, x: Math.round(x * 10000) / 10000, result: Math.round(result * 10000) / 10000 },
          visualization: makeViz(step),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `n=${n} is even. Square x and halve n (result unchanged = ${Math.round(result * 10000) / 10000}).`,
          variables: { n, x: Math.round(x * 10000) / 10000, result: Math.round(result * 10000) / 10000 },
          visualization: makeViz(step),
        });
      }

      x *= x;
      n = Math.floor(n / 2);
      step++;
    }

    steps.push({
      line: 9,
      explanation: `n = 0, loop ends. Final result = ${Math.round(result * 10000) / 10000}.`,
      variables: { result: Math.round(result * 10000) / 10000 },
      visualization: {
        type: 'array',
        array: [Math.round(result * 10000) / 10000],
        highlights: { 0: 'found' },
        labels: { 0: 'answer' },
        auxData: {
          label: 'Result',
          entries: [
            { key: 'pow(x, n)', value: String(Math.round(result * 10000) / 10000) },
          ],
        },
      },
    });

    return steps;
  },
};

export default powerXN;
