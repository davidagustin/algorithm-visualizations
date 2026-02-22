import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sieveOfEratosthenesII: AlgorithmDefinition = {
  id: 'sieve-of-eratosthenes-ii',
  title: 'Sieve of Eratosthenes II',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Find all prime numbers up to n using the Sieve of Eratosthenes. Mark multiples of each prime as composite, leaving only primes unmarked.',
  tags: ['Math', 'Number Theory', 'Prime'],
  code: {
    pseudocode: `function sieve(n):
  isPrime = array of true, size n+1
  isPrime[0] = isPrime[1] = false
  for p from 2 to sqrt(n):
    if isPrime[p]:
      for multiple from p*p to n step p:
        isPrime[multiple] = false
  return all i where isPrime[i] is true`,
    python: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
        p += 1
    return [i for i in range(n + 1) if is_prime[i]]`,
    javascript: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let m = p * p; m <= n; m += p) {
        isPrime[m] = false;
      }
    }
  }
  return Array.from({length: n+1}, (_,i) => i).filter(i => isPrime[i]);
}`,
    java: `public List<Integer> sieve(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; (long)p * p <= n; p++) {
        if (isPrime[p]) {
            for (int m = p * p; m <= n; m += p)
                isPrime[m] = false;
        }
    }
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++)
        if (isPrime[i]) primes.add(i);
    return primes;
}`,
  },
  defaultInput: { n: 30 },
  inputFields: [
    {
      name: 'n',
      label: 'Upper Bound (n)',
      type: 'number',
      defaultValue: 30,
      placeholder: 'e.g. 30',
      helperText: 'Find all primes up to n (2-50)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(2, input.n as number), 50);
    const steps: AlgorithmStep[] = [];
    const isPrime: boolean[] = new Array(n + 1).fill(true);
    isPrime[0] = false;
    if (n >= 1) isPrime[1] = false;

    const makeViz = (active: number, marked: number[]): ArrayVisualization => {
      const array = Array.from({ length: n + 1 }, (_, i) => i);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (i < 2) { highlights[i] = 'visited'; labels[i] = 'X'; }
        else if (!isPrime[i]) { highlights[i] = 'visited'; labels[i] = 'X'; }
        else { highlights[i] = 'found'; }
      }
      for (const m of marked) {
        if (m <= n) { highlights[m] = 'swapping'; labels[m] = 'X'; }
      }
      if (active >= 0 && active <= n) highlights[active] = 'active';
      return { type: 'array', array, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Initialize sieve for n=${n}. Mark 0 and 1 as not prime.`,
      variables: { n, step: 'init' },
      visualization: makeViz(-1, []),
    });

    for (let p = 2; p * p <= n; p++) {
      if (isPrime[p]) {
        steps.push({
          line: 4,
          explanation: `p=${p} is prime. Will mark all multiples starting from p*p=${p * p}.`,
          variables: { p, pSquared: p * p },
          visualization: makeViz(p, []),
        });
        const newlyMarked: number[] = [];
        for (let m = p * p; m <= n; m += p) {
          isPrime[m] = false;
          newlyMarked.push(m);
          steps.push({
            line: 6,
            explanation: `Mark ${m} as composite (multiple of ${p}).`,
            variables: { p, multiple: m },
            visualization: makeViz(m, newlyMarked),
          });
        }
      }
    }

    const primes = Array.from({ length: n + 1 }, (_, i) => i).filter(i => isPrime[i]);
    steps.push({
      line: 8,
      explanation: `Sieve complete. Primes up to ${n}: [${primes.join(', ')}].`,
      variables: { primes, count: primes.length },
      visualization: makeViz(-1, []),
    });

    return steps;
  },
};

export default sieveOfEratosthenesII;
