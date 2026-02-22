import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gcdLcmVisualization: AlgorithmDefinition = {
  id: 'gcd-lcm-visualization',
  title: 'GCD & LCM Visualization',
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Compute GCD using the Euclidean algorithm and LCM using the formula lcm(a,b) = a*b/gcd(a,b). Visualize each division step.',
  tags: ['Math', 'Number Theory', 'GCD', 'LCM'],
  code: {
    pseudocode: `function gcd(a, b):
  while b != 0:
    a, b = b, a mod b
  return a

function lcm(a, b):
  return a / gcd(a, b) * b`,
    python: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a // gcd(a, b) * b`,
    javascript: `function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}`,
    java: `public int gcd(int a, int b) {
    while (b != 0) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a;
}
public int lcm(int a, int b) {
    return a / gcd(a, b) * b;
}`,
  },
  defaultInput: { a: 48, b: 18 },
  inputFields: [
    { name: 'a', label: 'a', type: 'number', defaultValue: 48, placeholder: 'e.g. 48' },
    { name: 'b', label: 'b', type: 'number', defaultValue: 18, placeholder: 'e.g. 18' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let a = Math.abs(input.a as number);
    let b = Math.abs(input.b as number);
    const steps: AlgorithmStep[] = [];

    const makeViz = (curA: number, curB: number, rem: number, phase: string): ArrayVisualization => {
      const array = [curA, curB, rem];
      const highlights: Record<number, string> = { 0: 'active', 1: 'comparing', 2: 'found' };
      const labels: Record<number, string> = { 0: 'a', 1: 'b', 2: phase };
      return { type: 'array', array, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Start GCD of ${a} and ${b} using Euclidean algorithm.`,
      variables: { a, b },
      visualization: makeViz(a, b, 0, 'rem'),
    });

    while (b !== 0) {
      const rem = a % b;
      steps.push({
        line: 2,
        explanation: `${a} mod ${b} = ${rem}. Next: a=${b}, b=${rem}.`,
        variables: { a, b, remainder: rem },
        visualization: makeViz(a, b, rem, `${a}%${b}`),
      });
      a = b;
      b = rem;
    }

    const gcdVal = a;
    steps.push({
      line: 5,
      explanation: `b=0, so GCD = ${gcdVal}.`,
      variables: { gcd: gcdVal },
      visualization: {
        type: 'array',
        array: [gcdVal, 0, 0],
        highlights: { 0: 'found', 1: 'visited', 2: 'visited' },
        labels: { 0: 'GCD', 1: 'b=0', 2: '' },
      },
    });

    const origA = Math.abs(input.a as number);
    const origB = Math.abs(input.b as number);
    const lcmVal = (origA / gcdVal) * origB;
    steps.push({
      line: 7,
      explanation: `LCM(${origA},${origB}) = ${origA}/${gcdVal} * ${origB} = ${lcmVal}.`,
      variables: { gcd: gcdVal, lcm: lcmVal },
      visualization: {
        type: 'array',
        array: [origA, origB, gcdVal, lcmVal],
        highlights: { 0: 'active', 1: 'comparing', 2: 'found', 3: 'sorted' },
        labels: { 0: 'a', 1: 'b', 2: 'GCD', 3: 'LCM' },
      },
    });

    return steps;
  },
};

export default gcdLcmVisualization;
