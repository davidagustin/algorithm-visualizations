import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mobiusFunction: AlgorithmDefinition = {
  id: 'mobius-function',
  title: 'Möbius Function μ(n)',
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Compute the Möbius function μ(n): μ(1)=1, μ(n)=0 if n has a squared prime factor, μ(n)=(-1)^k if n is a product of k distinct primes. Uses a sieve.',
  tags: ['Math', 'Number Theory', 'Möbius', 'Sieve'],
  code: {
    pseudocode: `function mobiusSieve(n):
  mu[1] = 1
  for each prime p <= n:
    for multiples m of p:
      mu[m] *= -1
    for multiples m of p^2:
      mu[m] = 0
  return mu`,
    python: `def mobius_sieve(n):
    mu = [0] * (n + 1)
    mu[1] = 1
    primes = []
    is_composite = [False] * (n + 1)
    for i in range(2, n + 1):
        if not is_composite[i]:
            primes.append(i)
            mu[i] = -1
        for p in primes:
            if i * p > n: break
            is_composite[i * p] = True
            if i % p == 0:
                mu[i * p] = 0
                break
            mu[i * p] = -mu[i]
    return mu`,
    javascript: `function mobiusSieve(n) {
  const mu = new Array(n + 1).fill(0);
  mu[1] = 1;
  const primes = [];
  const isComposite = new Array(n + 1).fill(false);
  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]) { primes.push(i); mu[i] = -1; }
    for (const p of primes) {
      if (i * p > n) break;
      isComposite[i * p] = true;
      if (i % p === 0) { mu[i * p] = 0; break; }
      mu[i * p] = -mu[i];
    }
  }
  return mu;
}`,
    java: `public int[] mobiusSieve(int n) {
    int[] mu = new int[n + 1];
    mu[1] = 1;
    List<Integer> primes = new ArrayList<>();
    boolean[] isComp = new boolean[n + 1];
    for (int i = 2; i <= n; i++) {
        if (!isComp[i]) { primes.add(i); mu[i] = -1; }
        for (int p : primes) {
            if ((long)i * p > n) break;
            isComp[i * p] = true;
            if (i % p == 0) { mu[i * p] = 0; break; }
            mu[i * p] = -mu[i];
        }
    }
    return mu;
}`,
  },
  defaultInput: { n: 20 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 20,
      placeholder: 'e.g. 20',
      helperText: 'Compute μ(1)..μ(n) using linear sieve, n <= 40',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(2, input.n as number), 40);
    const steps: AlgorithmStep[] = [];
    const mu: number[] = new Array(n + 1).fill(0);
    mu[1] = 1;
    const primes: number[] = [];
    const isComposite: boolean[] = new Array(n + 1).fill(false);

    const makeViz = (active: number): ArrayVisualization => {
      const arr = Array.from({ length: n }, (_, i) => mu[i + 1]);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = String(i + 1);
        if (i + 1 === active) highlights[i] = 'active';
        else if (mu[i + 1] === 1) highlights[i] = 'found';
        else if (mu[i + 1] === -1) highlights[i] = 'comparing';
        else if (mu[i + 1] === 0) highlights[i] = 'visited';
        else highlights[i] = 'default';
      }
      return { type: 'array', array: arr, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Compute Möbius function for 1..${n}. μ(1)=1. Green=+1, Blue=-1, Gray=0 (has p²).`,
      variables: { n, mu1: 1 },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      if (!isComposite[i]) {
        primes.push(i);
        mu[i] = -1;
        steps.push({
          line: 4,
          explanation: `i=${i} is prime. μ(${i})=-1 (one prime factor).`,
          variables: { i, mu: mu[i] },
          visualization: makeViz(i),
        });
      }
      for (const p of primes) {
        if (i * p > n) break;
        isComposite[i * p] = true;
        if (i % p === 0) {
          mu[i * p] = 0;
          steps.push({
            line: 8,
            explanation: `${i}*${p}=${i*p}: ${i} divisible by ${p}, so ${i*p} has p²=${p}². μ(${i*p})=0.`,
            variables: { ip: i * p, mu: 0 },
            visualization: makeViz(i * p),
          });
          break;
        }
        mu[i * p] = -mu[i];
        steps.push({
          line: 9,
          explanation: `${i}*${p}=${i*p}: new prime factor ${p}. μ(${i*p})=-μ(${i})=${-mu[i]}.`,
          variables: { ip: i * p, mu: mu[i * p] },
          visualization: makeViz(i * p),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Möbius function computed for 1..${n}. Values: [${mu.slice(1).join(', ')}].`,
      variables: { mu: mu.slice(1) },
      visualization: makeViz(-1),
    });

    return steps;
  },
};

export default mobiusFunction;
