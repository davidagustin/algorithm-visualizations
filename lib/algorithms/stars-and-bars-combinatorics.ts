import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const starsAndBarsCombinatorics: AlgorithmDefinition = {
  id: 'stars-and-bars-combinatorics',
  title: 'Stars and Bars Combinatorics',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count the number of ways to distribute n identical items into k distinct bins using the stars-and-bars formula: C(n+k-1, k-1). Visualize the formula and enumerate small cases.',
  tags: ['Math', 'Combinatorics', 'Stars and Bars'],
  code: {
    pseudocode: `function starsAndBars(n, k):
  # Ways to put n identical items in k bins
  # = C(n + k - 1, k - 1)
  return nCr(n + k - 1, k - 1)

function nCr(n, r):
  if r > n: return 0
  result = 1
  for i from 0 to r-1:
    result = result * (n - i) / (i + 1)
  return result`,
    python: `from math import comb
def stars_and_bars(n, k):
    # C(n + k - 1, k - 1)
    return comb(n + k - 1, k - 1)`,
    javascript: `function starsAndBars(n, k) {
  function nCr(n, r) {
    if (r > n) return 0;
    let result = 1;
    for (let i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  }
  return nCr(n + k - 1, k - 1);
}`,
    java: `public long starsAndBars(int n, int k) {
    return nCr(n + k - 1, k - 1);
}
private long nCr(int n, int r) {
    if (r > n) return 0;
    long result = 1;
    for (int i = 0; i < r; i++) {
        result = result * (n - i) / (i + 1);
    }
    return result;
}`,
  },
  defaultInput: { n: 5, k: 3 },
  inputFields: [
    { name: 'n', label: 'Items (n)', type: 'number', defaultValue: 5, placeholder: 'e.g. 5', helperText: 'Identical items to distribute' },
    { name: 'k', label: 'Bins (k)', type: 'number', defaultValue: 3, placeholder: 'e.g. 3', helperText: 'Distinct bins' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    function nCr(a: number, b: number): number {
      if (b > a || b < 0) return 0;
      if (b === 0 || b === a) return 1;
      let result = 1;
      for (let i = 0; i < b; i++) {
        result = Math.round(result * (a - i) / (i + 1));
      }
      return result;
    }

    const totalN = n + k - 1;
    const chooseR = k - 1;
    const answer = nCr(totalN, chooseR);

    steps.push({
      line: 1,
      explanation: `Distribute ${n} identical items into ${k} bins. Formula: C(n+k-1, k-1) = C(${totalN}, ${chooseR}).`,
      variables: { n, k, formula: `C(${totalN},${chooseR})` },
      visualization: {
        type: 'array',
        array: [n, k, totalN, chooseR],
        highlights: { 0: 'active', 1: 'comparing', 2: 'found', 3: 'found' },
        labels: { 0: 'n', 1: 'k', 2: 'n+k-1', 3: 'k-1' },
      },
    });

    steps.push({
      line: 2,
      explanation: `Think of it as placing ${n} stars and ${k-1} bars in a row of ${totalN} symbols.`,
      variables: { stars: n, bars: k - 1, total: totalN },
      visualization: {
        type: 'array',
        array: [n, k - 1, totalN],
        highlights: { 0: 'found', 1: 'comparing', 2: 'active' },
        labels: { 0: 'stars', 1: 'bars', 2: 'total' },
      },
    });

    // Show C(totalN, chooseR) computation
    let pascal = 1;
    const pascalSteps: number[] = [1];
    for (let i = 0; i < chooseR; i++) {
      pascal = Math.round(pascal * (totalN - i) / (i + 1));
      pascalSteps.push(pascal);
      steps.push({
        line: 9,
        explanation: `C(${totalN},${chooseR}) step ${i+1}: multiply by ${totalN - i}/${i+1}. Running product = ${pascal}.`,
        variables: { step: i + 1, product: pascal },
        visualization: {
          type: 'array',
          array: pascalSteps.slice(),
          highlights: { [pascalSteps.length - 1]: 'active', ...Object.fromEntries(pascalSteps.slice(0,-1).map((_,j) => [j,'found'])) },
          labels: { [pascalSteps.length - 1]: 'current' },
        },
      });
    }

    // Enumerate distributions for small cases
    if (n <= 5 && k <= 3) {
      const distributions: number[][] = [];
      const generate = (remaining: number, bins: number, current: number[]) => {
        if (bins === 1) { distributions.push([...current, remaining]); return; }
        for (let i = 0; i <= remaining; i++) {
          generate(remaining - i, bins - 1, [...current, i]);
        }
      };
      generate(n, k, []);
      steps.push({
        line: 4,
        explanation: `All ${answer} distributions of ${n} items into ${k} bins enumerated.`,
        variables: { count: distributions.length, example: distributions[0] },
        visualization: {
          type: 'array',
          array: distributions[0] ?? [],
          highlights: Object.fromEntries((distributions[0] ?? []).map((_, i) => [i, 'found'])),
          labels: Object.fromEntries((distributions[0] ?? []).map((_, i) => [i, `b${i+1}`])),
        },
      });
    }

    steps.push({
      line: 4,
      explanation: `Answer: C(${totalN}, ${chooseR}) = ${answer} ways to distribute ${n} items into ${k} bins.`,
      variables: { n, k, answer },
      visualization: {
        type: 'array',
        array: [n, k, answer],
        highlights: { 0: 'active', 1: 'comparing', 2: 'sorted' },
        labels: { 0: 'n', 1: 'k', 2: 'ways' },
      },
    });

    return steps;
  },
};

export default starsAndBarsCombinatorics;
