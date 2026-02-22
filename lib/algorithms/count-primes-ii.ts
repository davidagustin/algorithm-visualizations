import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPrimesII: AlgorithmDefinition = {
  id: 'count-primes-ii',
  title: 'Count Primes',
  leetcodeNumber: 204,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count the number of prime numbers strictly less than n. Uses the Sieve of Eratosthenes: mark all multiples of each prime as composite, starting from 2. The remaining unmarked numbers are prime.',
  tags: ['math', 'sieve of eratosthenes', 'array'],

  code: {
    pseudocode: `function countPrimes(n):
  if n <= 2: return 0
  sieve = [true] * n
  sieve[0] = sieve[1] = false
  for i from 2 to sqrt(n):
    if sieve[i]:
      for j from i*i to n, step i:
        sieve[j] = false
  return count of true in sieve`,

    python: `def countPrimes(n: int) -> int:
    if n <= 2:
        return 0
    sieve = [True] * n
    sieve[0] = sieve[1] = False
    i = 2
    while i * i < n:
        if sieve[i]:
            for j in range(i * i, n, i):
                sieve[j] = False
        i += 1
    return sum(sieve)`,

    javascript: `function countPrimes(n) {
  if (n <= 2) return 0;
  const sieve = new Array(n).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i < n; i++) {
    if (sieve[i]) {
      for (let j = i * i; j < n; j += i) {
        sieve[j] = false;
      }
    }
  }
  return sieve.filter(Boolean).length;
}`,

    java: `public int countPrimes(int n) {
    if (n <= 2) return 0;
    boolean[] sieve = new boolean[n];
    Arrays.fill(sieve, true);
    sieve[0] = sieve[1] = false;
    for (int i = 2; (long)i*i < n; i++) {
        if (sieve[i])
            for (int j = i*i; j < n; j += i)
                sieve[j] = false;
    }
    int cnt = 0;
    for (boolean b : sieve) if (b) cnt++;
    return cnt;
}`,
  },

  defaultInput: { n: 20 },

  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 20, placeholder: '20', helperText: 'Count primes strictly less than n' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 30);
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    if (n <= 2) {
      steps.push({
        line: 2,
        explanation: `n = ${n} <= 2. No primes exist. Return 0.`,
        variables: { n, result: 0 },
        visualization: makeViz([0], { 0: 'found' }, { 0: 'count' }),
      });
      return steps;
    }

    const sieve = new Array(n).fill(1);
    sieve[0] = 0; sieve[1] = 0;

    steps.push({
      line: 4,
      explanation: `Initialize sieve of size ${n}. Mark index 0 and 1 as not prime.`,
      variables: { sieve: '[0,0,1,1,...]' },
      visualization: makeViz(
        sieve.map((_, i) => i),
        Object.fromEntries(sieve.map((v, i) => [i, v === 0 ? 'visited' : 'default'])),
        { 0: 'NP', 1: 'NP' }
      ),
    });

    for (let i = 2; i * i < n; i++) {
      if (sieve[i] === 1) {
        steps.push({
          line: 6,
          explanation: `${i} is prime. Mark all multiples of ${i} starting from ${i * i} as composite.`,
          variables: { prime: i, start: i * i },
          visualization: makeViz(
            sieve.map((_, idx) => idx),
            Object.fromEntries(sieve.map((v, idx) => [idx, idx === i ? 'active' : v === 0 ? 'visited' : 'default'])),
            { [i]: `p=${i}` }
          ),
        });

        for (let j = i * i; j < n; j += i) {
          sieve[j] = 0;
        }

        steps.push({
          line: 7,
          explanation: `Marked multiples of ${i}: ${Array.from({ length: Math.floor((n - 1 - i * i) / i) + 1 }, (_, k) => i * i + k * i).filter(v => v < n).join(', ')} as composite.`,
          variables: { composite_of: i },
          visualization: makeViz(
            sieve.map((_, idx) => idx),
            Object.fromEntries(sieve.map((v, idx) => [idx, idx === i ? 'found' : v === 0 ? 'mismatch' : 'default'])),
            { [i]: `p=${i}` }
          ),
        });
      }
    }

    const count = sieve.reduce((s, v) => s + v, 0);
    const primes = sieve.map((v, i) => v === 1 ? i : -1).filter(v => v >= 0);

    steps.push({
      line: 9,
      explanation: `Sieve complete. Primes < ${n}: [${primes.join(', ')}]. Count = ${count}.`,
      variables: { primes: primes.join(','), count },
      visualization: makeViz(
        sieve.map((_, i) => i),
        Object.fromEntries(sieve.map((v, i) => [i, v === 1 ? 'found' : 'visited'])),
        Object.fromEntries(primes.map(p => [p, 'P']))
      ),
    });

    return steps;
  },
};

export default countPrimesII;
