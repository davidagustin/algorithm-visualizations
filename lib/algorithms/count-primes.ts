import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPrimes: AlgorithmDefinition = {
  id: 'count-primes',
  title: 'Count Primes',
  leetcodeNumber: 204,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count the number of prime numbers strictly less than n. Uses the Sieve of Eratosthenes: start with all numbers marked as prime, then for each prime p starting from 2, mark all multiples of p (starting at p*p) as composite. Count remaining primes.',
  tags: ['math', 'sieve', 'array'],

  code: {
    pseudocode: `function countPrimes(n):
  if n < 2: return 0
  sieve = array of true, length n
  sieve[0] = sieve[1] = false
  for p from 2 to sqrt(n):
    if sieve[p]:
      for multiple from p*p to n-1 step p:
        sieve[multiple] = false
  return count of true values in sieve`,

    python: `def countPrimes(n):
    if n < 2: return 0
    sieve = [True] * n
    sieve[0] = sieve[1] = False
    p = 2
    while p * p < n:
        if sieve[p]:
            for m in range(p*p, n, p):
                sieve[m] = False
        p += 1
    return sum(sieve)`,

    javascript: `function countPrimes(n) {
  if (n < 2) return 0;
  const sieve = new Array(n).fill(true);
  sieve[0] = sieve[1] = false;
  for (let p = 2; p * p < n; p++) {
    if (sieve[p]) {
      for (let m = p * p; m < n; m += p) sieve[m] = false;
    }
  }
  return sieve.filter(Boolean).length;
}`,

    java: `public int countPrimes(int n) {
    if (n < 2) return 0;
    boolean[] sieve = new boolean[n];
    Arrays.fill(sieve, true);
    sieve[0] = sieve[1] = false;
    for (int p = 2; (long)p*p < n; p++) {
        if (sieve[p]) for (int m = p*p; m < n; m += p) sieve[m] = false;
    }
    int cnt = 0;
    for (boolean b : sieve) if (b) cnt++;
    return cnt;
}`,
  },

  defaultInput: {
    n: 20,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 20,
      placeholder: '20',
      helperText: 'Count primes strictly less than n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    if (n < 2) {
      steps.push({
        line: 1,
        explanation: `n = ${n} < 2. No primes exist. Return 0.`,
        variables: { n, result: 0 },
        visualization: { type: 'array', array: [], highlights: {}, labels: {} } as ArrayVisualization,
      });
      return steps;
    }

    const sieve = new Array(n).fill(true);
    sieve[0] = false;
    sieve[1] = false;

    const makeViz = (): ArrayVisualization => ({
      type: 'array',
      array: sieve.map((v, i) => i),
      highlights: Object.fromEntries(sieve.map((v, i) => [i, v ? 'found' : 'mismatch'])),
      labels: Object.fromEntries(sieve.map((v, i) => [i, v ? 'P' : 'X'])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize sieve of size ${n}. Mark 0 and 1 as not prime. All others start as potentially prime.`,
      variables: { n },
      visualization: makeViz(),
    });

    for (let p = 2; p * p < n; p++) {
      if (sieve[p]) {
        steps.push({
          line: 5,
          explanation: `${p} is prime. Mark all multiples of ${p} starting at ${p * p} as composite.`,
          variables: { prime: p, startingMultiple: p * p },
          visualization: {
            type: 'array',
            array: sieve.map((_, i) => i),
            highlights: {
              ...Object.fromEntries(sieve.map((v, i) => [i, v ? 'found' : 'mismatch'])),
              [p]: 'active',
            },
            labels: { [p]: `p=${p}` },
          } as ArrayVisualization,
        });

        for (let m = p * p; m < n; m += p) {
          sieve[m] = false;
          steps.push({
            line: 7,
            explanation: `Mark ${m} = ${p} x ${m / p} as composite.`,
            variables: { multiple: m, prime: p },
            visualization: {
              type: 'array',
              array: sieve.map((_, i) => i),
              highlights: {
                ...Object.fromEntries(sieve.map((v, i) => [i, v ? 'found' : 'mismatch'])),
                [p]: 'active',
                [m]: 'swapping',
              },
              labels: { [p]: `p=${p}`, [m]: 'X' },
            } as ArrayVisualization,
          });
        }
      }
    }

    const count = sieve.filter(Boolean).length;
    steps.push({
      line: 8,
      explanation: `Sieve complete. Primes less than ${n}: ${sieve.map((v, i) => v ? i : -1).filter(i => i >= 0).join(', ')}. Count = ${count}.`,
      variables: { result: count },
      visualization: makeViz(),
    });

    return steps;
  },
};

export default countPrimes;
