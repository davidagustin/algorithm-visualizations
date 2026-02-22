import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const eulersTotientFunction: AlgorithmDefinition = {
  id: 'eulers-totient-function',
  title: "Euler's Totient Function",
  difficulty: 'Medium',
  category: 'Math',
  description:
    "Compute φ(n) — the count of integers from 1 to n that are coprime to n. Uses prime factorization: φ(n) = n * ∏(1 - 1/p) for each prime factor p of n.",
  tags: ['Math', 'Number Theory', 'Euler', 'Totient'],
  code: {
    pseudocode: `function totient(n):
  result = n
  p = 2
  while p*p <= n:
    if n mod p == 0:
      while n mod p == 0:
        n /= p
      result -= result / p
    p++
  if n > 1:
    result -= result / n
  return result`,
    python: `def totient(n):
    result = n
    p = 2
    temp = n
    while p * p <= temp:
        if temp % p == 0:
            while temp % p == 0:
                temp //= p
            result -= result // p
        p += 1
    if temp > 1:
        result -= result // temp
    return result`,
    javascript: `function totient(n) {
  let result = n;
  let temp = n;
  for (let p = 2; p * p <= temp; p++) {
    if (temp % p === 0) {
      while (temp % p === 0) temp = Math.floor(temp / p);
      result -= Math.floor(result / p);
    }
  }
  if (temp > 1) result -= Math.floor(result / temp);
  return result;
}`,
    java: `public int totient(int n) {
    int result = n;
    int temp = n;
    for (int p = 2; p * p <= temp; p++) {
        if (temp % p == 0) {
            while (temp % p == 0) temp /= p;
            result -= result / p;
        }
    }
    if (temp > 1) result -= result / temp;
    return result;
}`,
  },
  defaultInput: { n: 36 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 36,
      placeholder: 'e.g. 36',
      helperText: 'Compute φ(n) for n (2-100)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origN = input.n as number;
    const steps: AlgorithmStep[] = [];
    let result = origN;
    let temp = origN;
    const primeFactors: number[] = [];

    const makeViz = (res: number, p: number, t: number): ArrayVisualization => ({
      type: 'array',
      array: [origN, res, p, t],
      highlights: { 0: 'visited', 1: 'found', 2: 'active', 3: 'comparing' },
      labels: { 0: 'n', 1: 'φ(n)', 2: 'p', 3: 'temp' },
    });

    steps.push({
      line: 1,
      explanation: `Compute φ(${origN}). Start with result=${result}, temp=${temp}.`,
      variables: { n: origN, result, temp },
      visualization: makeViz(result, 2, temp),
    });

    for (let p = 2; p * p <= temp; p++) {
      if (temp % p === 0) {
        primeFactors.push(p);
        steps.push({
          line: 4,
          explanation: `p=${p} divides temp=${temp}. Apply φ formula: result -= result/${p} = ${result} - ${Math.floor(result / p)} = ${result - Math.floor(result / p)}.`,
          variables: { p, temp, result },
          visualization: makeViz(result, p, temp),
        });
        result -= Math.floor(result / p);
        while (temp % p === 0) temp = Math.floor(temp / p);
        steps.push({
          line: 5,
          explanation: `After removing all ${p}s: temp=${temp}, result=${result}.`,
          variables: { p, temp, result },
          visualization: makeViz(result, p, temp),
        });
      }
    }

    if (temp > 1) {
      primeFactors.push(temp);
      steps.push({
        line: 9,
        explanation: `Remaining temp=${temp} > 1 is a prime factor. result -= result/${temp} = ${result - Math.floor(result / temp)}.`,
        variables: { temp, result },
        visualization: makeViz(result, temp, temp),
      });
      result -= Math.floor(result / temp);
    }

    steps.push({
      line: 11,
      explanation: `φ(${origN}) = ${result}. Prime factors used: [${primeFactors.join(', ')}].`,
      variables: { n: origN, phi: result, primeFactors },
      visualization: {
        type: 'array',
        array: [origN, result, ...primeFactors],
        highlights: { 0: 'visited', 1: 'sorted', ...Object.fromEntries(primeFactors.map((_, i) => [i + 2, 'found'])) },
        labels: { 0: 'n', 1: 'φ(n)', ...Object.fromEntries(primeFactors.map((_, i) => [i + 2, 'prime'])) },
      },
    });

    return steps;
  },
};

export default eulersTotientFunction;
