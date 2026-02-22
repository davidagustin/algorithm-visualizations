import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const phiFunctionSieve: AlgorithmDefinition = {
  id: 'phi-function-sieve',
  title: "Euler's Phi Function Sieve",
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute Euler\'s totient function φ(i) for all i from 1 to n using a sieve similar to the Sieve of Eratosthenes. For each prime p, update all its multiples.',
  tags: ['Math', 'Number Theory', 'Euler Totient', 'Sieve'],
  code: {
    pseudocode: `function phiSieve(n):
  phi[i] = i for all i
  for i from 2 to n:
    if phi[i] == i:  # i is prime
      for j from i to n step i:
        phi[j] -= phi[j] / i
  return phi`,
    python: `def phi_sieve(n):
    phi = list(range(n + 1))
    for i in range(2, n + 1):
        if phi[i] == i:  # i is prime
            for j in range(i, n + 1, i):
                phi[j] -= phi[j] // i
    return phi`,
    javascript: `function phiSieve(n) {
  const phi = Array.from({length: n+1}, (_,i) => i);
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i) { // prime
      for (let j = i; j <= n; j += i) {
        phi[j] -= Math.floor(phi[j] / i);
      }
    }
  }
  return phi;
}`,
    java: `public int[] phiSieve(int n) {
    int[] phi = new int[n + 1];
    for (int i = 0; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) { // prime
            for (int j = i; j <= n; j += i)
                phi[j] -= phi[j] / i;
        }
    }
    return phi;
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
      helperText: 'Compute φ(1)..φ(n) using sieve, n <= 30',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(2, input.n as number), 30);
    const steps: AlgorithmStep[] = [];
    const phi: number[] = Array.from({ length: n + 1 }, (_, i) => i);

    const makeViz = (active: number, updated: number[]): ArrayVisualization => {
      const arr = phi.slice(1);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `φ(${i+1})`;
        if (i + 1 === active) highlights[i] = 'active';
        else if (updated.includes(i + 1)) highlights[i] = 'comparing';
        else if (phi[i + 1] < i + 1) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'array', array: arr, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Init φ(i)=i for all i from 0 to ${n}. Will sieve using primes.`,
      variables: { n },
      visualization: makeViz(-1, []),
    });

    for (let i = 2; i <= n; i++) {
      if (phi[i] === i) {
        // i is prime
        const updated: number[] = [];
        steps.push({
          line: 3,
          explanation: `φ(${i})=${i}, so ${i} is prime. Update all multiples of ${i}.`,
          variables: { prime: i },
          visualization: makeViz(i, []),
        });
        for (let j = i; j <= n; j += i) {
          phi[j] -= Math.floor(phi[j] / i);
          updated.push(j);
          steps.push({
            line: 5,
            explanation: `φ(${j}) -= φ(${j}+${i-phi[j+i-Math.floor(phi[j+i]!==undefined?1:0)]}...)/${i}. Now φ(${j})=${phi[j]}.`,
            variables: { j, phi_j: phi[j] },
            visualization: makeViz(j, updated.slice()),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Phi sieve complete. φ(1..${n}) = [${phi.slice(1).join(', ')}].`,
      variables: { phi: phi.slice(1) },
      visualization: makeViz(-1, []),
    });

    return steps;
  },
};

export default phiFunctionSieve;
