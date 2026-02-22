import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const primeFactorizationVisualization: AlgorithmDefinition = {
  id: 'prime-factorization-visualization',
  title: 'Prime Factorization',
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Find the prime factorization of n by trial division. Divide out each prime factor starting from 2 until n becomes 1.',
  tags: ['Math', 'Number Theory', 'Prime Factors'],
  code: {
    pseudocode: `function primeFactors(n):
  factors = []
  d = 2
  while d * d <= n:
    while n mod d == 0:
      factors.append(d)
      n /= d
    d++
  if n > 1:
    factors.append(n)
  return factors`,
    python: `def prime_factors(n):
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors`,
    javascript: `function primeFactors(n) {
  const factors = [];
  for (let d = 2; d * d <= n; d++) {
    while (n % d === 0) {
      factors.push(d);
      n = Math.floor(n / d);
    }
  }
  if (n > 1) factors.push(n);
  return factors;
}`,
    java: `public List<Integer> primeFactors(int n) {
    List<Integer> factors = new ArrayList<>();
    for (int d = 2; d * d <= n; d++) {
        while (n % d == 0) {
            factors.add(d);
            n /= d;
        }
    }
    if (n > 1) factors.add(n);
    return factors;
}`,
  },
  defaultInput: { n: 360 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 360,
      placeholder: 'e.g. 360',
      helperText: 'Find prime factorization of n (2-10000)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let n = Math.max(2, input.n as number);
    const origN = n;
    const steps: AlgorithmStep[] = [];
    const factors: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find prime factors of ${origN}.`,
      variables: { n: origN },
      visualization: {
        type: 'array',
        array: [n],
        highlights: { 0: 'active' },
        labels: { 0: 'n' },
      },
    });

    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        steps.push({
          line: 3,
          explanation: `d=${d} divides n=${n}. Extract all factors of ${d}.`,
          variables: { d, n },
          visualization: {
            type: 'array',
            array: [n, d, ...factors],
            highlights: { 0: 'active', 1: 'comparing', ...Object.fromEntries(factors.map((_, i) => [i + 2, 'found'])) },
            labels: { 0: 'n', 1: 'd', ...Object.fromEntries(factors.map((_, i) => [i + 2, 'f'])) },
          },
        });
        while (n % d === 0) {
          factors.push(d);
          n = Math.floor(n / d);
          steps.push({
            line: 4,
            explanation: `Factor out ${d}: n becomes ${n}. Factors so far: [${factors.join(', ')}].`,
            variables: { d, n, factors: [...factors] },
            visualization: {
              type: 'array',
              array: [n, d, ...factors],
              highlights: { 0: 'active', 1: 'comparing', ...Object.fromEntries(factors.map((_, i) => [i + 2, 'found'])) },
              labels: { 0: 'n', 1: 'd', ...Object.fromEntries(factors.map((_, i) => [i + 2, `f${i}`])) },
            },
          });
        }
      }
    }

    if (n > 1) {
      factors.push(n);
      steps.push({
        line: 8,
        explanation: `Remaining n=${n} > 1 is itself a prime factor.`,
        variables: { n, factors: [...factors] },
        visualization: {
          type: 'array',
          array: [...factors],
          highlights: { [factors.length - 1]: 'active', ...Object.fromEntries(factors.slice(0, -1).map((_, i) => [i, 'found'])) },
          labels: Object.fromEntries(factors.map((_, i) => [i, `f${i}`])),
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `${origN} = ${factors.join(' × ')}. Total ${factors.length} prime factor(s).`,
      variables: { n: origN, factors: [...factors] },
      visualization: {
        type: 'array',
        array: factors,
        highlights: Object.fromEntries(factors.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(factors.map((_, i) => [i, `p${i+1}`])),
      },
    });

    return steps;
  },
};

export default primeFactorizationVisualization;
