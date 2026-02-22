import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const divisorFunction: AlgorithmDefinition = {
  id: 'divisor-function',
  title: 'Divisor Function σ(n)',
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Compute σ(n) — the sum of all divisors of n — and τ(n) — the count of divisors. Enumerate divisors up to √n and add both d and n/d.',
  tags: ['Math', 'Number Theory', 'Divisors'],
  code: {
    pseudocode: `function divisors(n):
  divs = []
  for d from 1 to sqrt(n):
    if n mod d == 0:
      divs.append(d)
      if d != n/d: divs.append(n/d)
  sort(divs)
  return divs, sum(divs)`,
    python: `def divisors(n):
    divs = []
    d = 1
    while d * d <= n:
        if n % d == 0:
            divs.append(d)
            if d != n // d:
                divs.append(n // d)
        d += 1
    divs.sort()
    return divs, sum(divs)`,
    javascript: `function divisors(n) {
  const divs = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      divs.push(d);
      if (d !== n / d) divs.push(n / d);
    }
  }
  divs.sort((a, b) => a - b);
  return { divs, sigma: divs.reduce((a,b)=>a+b,0) };
}`,
    java: `public List<Integer> divisors(int n) {
    List<Integer> divs = new ArrayList<>();
    for (int d = 1; (long)d*d <= n; d++) {
        if (n % d == 0) {
            divs.add(d);
            if (d != n / d) divs.add(n / d);
        }
    }
    Collections.sort(divs);
    return divs;
}`,
  },
  defaultInput: { n: 60 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 60,
      placeholder: 'e.g. 60',
      helperText: 'Find all divisors of n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.max(1, input.n as number);
    const steps: AlgorithmStep[] = [];
    const divisors: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find all divisors of ${n}. Check d from 1 to √${n} ≈ ${Math.floor(Math.sqrt(n))}.`,
      variables: { n, sqrtN: Math.floor(Math.sqrt(n)) },
      visualization: {
        type: 'array',
        array: [n],
        highlights: { 0: 'active' },
        labels: { 0: 'n' },
      },
    });

    for (let d = 1; d * d <= n; d++) {
      if (n % d === 0) {
        divisors.push(d);
        const pair = n / d;
        if (d !== pair) divisors.push(pair);
        steps.push({
          line: 4,
          explanation: `d=${d} divides ${n}: add ${d}${d !== pair ? ` and ${pair}` : ''}.`,
          variables: { d, pair, divisorsSoFar: divisors.slice().sort((a, b) => a - b) },
          visualization: {
            type: 'array',
            array: divisors.slice().sort((a, b) => a - b),
            highlights: {
              ...Object.fromEntries(divisors.map((_, i) => [i, 'found'])),
            },
            labels: Object.fromEntries(divisors.slice().sort((a, b) => a - b).map((v, i) => [i, String(v)])),
          },
        });
      } else {
        steps.push({
          line: 3,
          explanation: `d=${d}: ${n}%${d}=${n % d} ≠ 0. Not a divisor.`,
          variables: { d, remainder: n % d },
          visualization: {
            type: 'array',
            array: divisors.slice().sort((a, b) => a - b),
            highlights: Object.fromEntries(divisors.map((_, i) => [i, 'found'])),
            labels: { 0: `checking d=${d}` },
          },
        });
      }
    }

    divisors.sort((a, b) => a - b);
    const sigma = divisors.reduce((a, b) => a + b, 0);
    const tau = divisors.length;

    steps.push({
      line: 8,
      explanation: `Divisors of ${n}: [${divisors.join(', ')}]. τ(${n})=${tau}, σ(${n})=${sigma}.`,
      variables: { divisors, tau, sigma },
      visualization: {
        type: 'array',
        array: divisors,
        highlights: Object.fromEntries(divisors.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(divisors.map((v, i) => [i, String(v)])),
      },
    });

    return steps;
  },
};

export default divisorFunction;
