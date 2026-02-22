import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const factorialTrailingZeroesII: AlgorithmDefinition = {
  id: 'factorial-trailing-zeroes-ii',
  title: 'Factorial Trailing Zeroes',
  leetcodeNumber: 172,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given an integer n, return the number of trailing zeroes in n!. Trailing zeroes come from factors of 10 = 2 * 5. Since there are always more factors of 2, we only count factors of 5: n/5 + n/25 + n/125 + ...',
  tags: ['math'],

  code: {
    pseudocode: `function trailingZeroes(n):
  count = 0
  while n >= 5:
    n = floor(n / 5)
    count += n
  return count`,

    python: `def trailingZeroes(n: int) -> int:
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count`,

    javascript: `function trailingZeroes(n) {
  let count = 0;
  while (n >= 5) {
    n = Math.floor(n / 5);
    count += n;
  }
  return count;
}`,

    java: `public int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        n /= 5;
        count += n;
    }
    return count;
}`,
  },

  defaultInput: { n: 25 },

  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 25, placeholder: '25', helperText: 'Find trailing zeroes in n!' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const contributions: number[] = [];
    const powers: number[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Count trailing zeroes in ${n}!. Trailing zeroes = factors of 10 = min(#2s, #5s). Count factors of 5 only (always fewer than 2s).`,
      variables: { n, count: 0 },
      visualization: makeViz([n], { 0: 'active' }, { 0: 'n' }),
    });

    let count = 0;
    let power = 5;
    while (n >= 5) {
      n = Math.floor(n / 5);
      count += n;
      contributions.push(n);
      powers.push(power);
      power *= 5;

      steps.push({
        line: 3,
        explanation: `n = floor(n/5) = ${n}. These are multiples of ${power / 5} in original n!. count += ${n} → count = ${count}.`,
        variables: { n, count, power: power / 5 },
        visualization: makeViz(
          contributions,
          Object.fromEntries(contributions.map((_, i) => [i, i === contributions.length - 1 ? 'active' : 'found'])),
          Object.fromEntries(powers.map((p, i) => [i, `÷${p}`]))
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `n < 5. Total trailing zeroes = ${count}. (Sum of contributions: ${contributions.join(' + ')} = ${count})`,
      variables: { result: count },
      visualization: makeViz(
        contributions.length > 0 ? contributions : [0],
        Object.fromEntries((contributions.length > 0 ? contributions : [0]).map((_, i) => [i, 'found'])),
        Object.fromEntries((contributions.length > 0 ? powers : [1]).map((p, i) => [i, `÷${p}`]))
      ),
    });

    return steps;
  },
};

export default factorialTrailingZeroesII;
