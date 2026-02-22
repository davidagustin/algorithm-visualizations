import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const factorialTrailingZeros: AlgorithmDefinition = {
  id: 'factorial-trailing-zeros',
  title: 'Factorial Trailing Zeros',
  leetcodeNumber: 172,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count the number of trailing zeros in n!. Trailing zeros come from factors of 10 = 2 × 5. Since factors of 2 are always more than factors of 5, we only count how many times 5 divides into n!. Count multiples of 5, 25, 125, ... using n/5 + n/25 + n/125 + ... in O(log n) time.',
  tags: ['Math'],
  code: {
    pseudocode: `function trailingZeroes(n):
  count = 0
  power = 5
  while power <= n:
    count += n / power
    power *= 5
  return count`,
    python: `def trailingZeroes(n):
    count = 0
    power = 5
    while power <= n:
        count += n // power
        power *= 5
    return count`,
    javascript: `function trailingZeroes(n) {
  let count = 0, power = 5;
  while (power <= n) {
    count += Math.floor(n / power);
    power *= 5;
  }
  return count;
}`,
    java: `public int trailingZeroes(int n) {
    int count = 0;
    for (long p = 5; p <= n; p *= 5)
        count += n / p;
    return count;
}`,
  },
  defaultInput: { n: 25 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 25,
      placeholder: 'e.g. 25',
      helperText: 'Count trailing zeros in n! (n >= 0)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const powers: { power: number; contribution: number }[] = [];

    const makeViz = (activeIdx: number, count: number): ArrayVisualization => {
      const arr = powers.map(p => p.contribution);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < powers.length; k++) {
        highlights[k] = k === activeIdx ? 'active' : (k < activeIdx ? 'sorted' : 'default');
        labels[k] = `÷${powers[k].power}`;
      }

      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels,
        auxData: {
          label: 'Trailing Zeros',
          entries: [
            { key: 'n', value: String(n) },
            { key: 'Total count', value: String(count) },
            ...powers.map((p, k) => ({
              key: `⌊${n}/${p.power}⌋`,
              value: String(p.contribution),
            })),
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Count trailing zeros in ${n}!. Trailing zeros = factors of 10 = 2×5. Since factors of 2 are plentiful, count multiples of 5 in n!.`,
      variables: { n },
      visualization: {
        type: 'array',
        array: [n],
        highlights: { 0: 'active' },
        labels: { 0: 'n' },
        auxData: {
          label: 'Strategy',
          entries: [
            { key: 'Key insight', value: 'Count factors of 5 in n!' },
            { key: 'Formula', value: '⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...' },
          ],
        },
      },
    });

    let count = 0;
    let power = 5;
    let idx = 0;

    steps.push({
      line: 2,
      explanation: `Initialize count=0, power=5. We will divide n by increasing powers of 5.`,
      variables: { count, power },
      visualization: makeViz(-1, count),
    });

    while (power <= n) {
      const contribution = Math.floor(n / power);
      powers.push({ power, contribution });

      steps.push({
        line: 4,
        explanation: `power=${power} <= n=${n}. ⌊${n}/${power}⌋ = ${contribution} multiples of ${power} in [1..${n}]. count = ${count} + ${contribution} = ${count + contribution}.`,
        variables: { power, contribution, count: count + contribution },
        visualization: makeViz(idx, count + contribution),
      });

      count += contribution;
      power *= 5;
      idx++;
    }

    if (powers.length === 0) {
      steps.push({
        line: 3,
        explanation: `power=5 > n=${n}. No multiples of 5 in [1..${n}]. Trailing zeros = 0.`,
        variables: { count: 0 },
        visualization: makeViz(-1, 0),
      });
    } else {
      steps.push({
        line: 5,
        explanation: `power=${power} > n=${n}. Loop ends. Total trailing zeros in ${n}! = ${count}.`,
        variables: { count, result: count },
        visualization: {
          type: 'array',
          array: powers.map(p => p.contribution),
          highlights: Object.fromEntries(powers.map((_, k) => [k, 'found'])),
          labels: Object.fromEntries(powers.map((p, k) => [k, `÷${p.power}`])),
          auxData: {
            label: 'Result',
            entries: [
              { key: `Trailing zeros in ${n}!`, value: String(count) },
            ],
          },
        },
      });
    }

    return steps;
  },
};

export default factorialTrailingZeros;
