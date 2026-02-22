import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfDivisorsSieve: AlgorithmDefinition = {
  id: 'number-of-divisors-sieve',
  title: 'Number of Divisors Sieve',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute τ(i) — the number of divisors — for every i from 1 to n using a sieve. For each i, increment the divisor count for all its multiples.',
  tags: ['Math', 'Number Theory', 'Divisors', 'Sieve'],
  code: {
    pseudocode: `function divisorSieve(n):
  tau[i] = 0 for all i
  for i from 1 to n:
    for j from i to n step i:
      tau[j]++
  return tau`,
    python: `def divisor_sieve(n):
    tau = [0] * (n + 1)
    for i in range(1, n + 1):
        for j in range(i, n + 1, i):
            tau[j] += 1
    return tau`,
    javascript: `function divisorSieve(n) {
  const tau = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++)
    for (let j = i; j <= n; j += i)
      tau[j]++;
  return tau;
}`,
    java: `public int[] divisorSieve(int n) {
    int[] tau = new int[n + 1];
    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j += i)
            tau[j]++;
    return tau;
}`,
  },
  defaultInput: { n: 24 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 24,
      placeholder: 'e.g. 24',
      helperText: 'Compute number of divisors τ(1)..τ(n), n <= 30',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(1, input.n as number), 30);
    const steps: AlgorithmStep[] = [];
    const tau: number[] = new Array(n + 1).fill(0);

    const makeViz = (active: number, updated: number[]): ArrayVisualization => {
      const arr = tau.slice(1);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `τ(${i+1})`;
        if (i + 1 === active) highlights[i] = 'active';
        else if (updated.includes(i + 1)) highlights[i] = 'comparing';
        else if (tau[i + 1] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'array', array: arr, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Count divisors for 1..${n}. For each i, add 1 to τ(j) for every multiple j of i.`,
      variables: { n },
      visualization: makeViz(-1, []),
    });

    for (let i = 1; i <= n; i++) {
      const updatedInRound: number[] = [];
      steps.push({
        line: 3,
        explanation: `i=${i}: increment τ for all multiples of ${i} up to ${n}.`,
        variables: { i },
        visualization: makeViz(i, []),
      });
      for (let j = i; j <= n; j += i) {
        tau[j]++;
        updatedInRound.push(j);
        steps.push({
          line: 4,
          explanation: `τ(${j})++ = ${tau[j]} (${i} is a divisor of ${j}).`,
          variables: { i, j, tau_j: tau[j] },
          visualization: makeViz(j, updatedInRound.slice()),
        });
      }
    }

    // Find highly composite numbers
    const maxTau = Math.max(...tau.slice(1));
    const hcn = tau.slice(1).map((t, i) => ({ n: i + 1, tau: t })).filter(x => x.tau === maxTau);

    steps.push({
      line: 6,
      explanation: `Sieve complete. τ(1..${n}) = [${tau.slice(1).join(', ')}]. Max divisors = ${maxTau} (at n=${hcn.map(x=>x.n).join(',')}).`,
      variables: { tau: tau.slice(1), maxTau, mostDivisible: hcn },
      visualization: {
        type: 'array',
        array: tau.slice(1),
        highlights: Object.fromEntries(tau.slice(1).map((t, i) => [i, t === maxTau ? 'sorted' : t > 0 ? 'found' : 'default'])),
        labels: Object.fromEntries(tau.slice(1).map((_, i) => [i, `τ(${i+1})`])),
      },
    });

    return steps;
  },
};

export default numberOfDivisorsSieve;
