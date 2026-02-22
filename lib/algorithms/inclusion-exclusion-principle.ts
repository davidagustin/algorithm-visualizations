import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const inclusionExclusionPrinciple: AlgorithmDefinition = {
  id: 'inclusion-exclusion-principle',
  title: 'Inclusion-Exclusion Principle',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count integers from 1 to n divisible by at least one of the given divisors using inclusion-exclusion: |A∪B∪C| = |A|+|B|+|C| - |A∩B| - ... + |A∩B∩C|.',
  tags: ['Math', 'Combinatorics', 'Inclusion-Exclusion'],
  code: {
    pseudocode: `function inclusionExclusion(n, divisors):
  total = 0
  for mask from 1 to 2^|divisors| - 1:
    bits = popcount(mask)
    lcm_val = lcm of selected divisors
    if bits is odd: total += n / lcm_val
    else:           total -= n / lcm_val
  return total`,
    python: `from math import gcd
def inclusion_exclusion(n, divisors):
    total = 0
    k = len(divisors)
    for mask in range(1, 1 << k):
        bits = bin(mask).count('1')
        lcm_val = 1
        for i in range(k):
            if mask & (1 << i):
                lcm_val = lcm_val * divisors[i] // gcd(lcm_val, divisors[i])
        if bits % 2 == 1:
            total += n // lcm_val
        else:
            total -= n // lcm_val
    return total`,
    javascript: `function inclusionExclusion(n, divisors) {
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  let total = 0;
  for (let mask = 1; mask < (1 << divisors.length); mask++) {
    const bits = mask.toString(2).split('').filter(c=>c==='1').length;
    let lcmVal = 1;
    for (let i = 0; i < divisors.length; i++)
      if (mask & (1 << i)) lcmVal = lcm(lcmVal, divisors[i]);
    total += bits % 2 === 1 ? Math.floor(n / lcmVal) : -Math.floor(n / lcmVal);
  }
  return total;
}`,
    java: `public int inclusionExclusion(int n, int[] divs) {
    int total = 0;
    for (int mask = 1; mask < (1 << divs.length); mask++) {
        int bits = Integer.bitCount(mask);
        long lcm = 1;
        for (int i = 0; i < divs.length; i++)
            if ((mask & (1 << i)) != 0)
                lcm = lcm / gcd(lcm, divs[i]) * divs[i];
        total += (bits % 2 == 1 ? 1 : -1) * (n / lcm);
    }
    return total;
}`,
  },
  defaultInput: { n: 30, divisors: [2, 3, 5] },
  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 30, placeholder: 'e.g. 30', helperText: 'Count from 1 to n' },
    { name: 'divisors', label: 'Divisors', type: 'array', defaultValue: [2, 3, 5], placeholder: 'e.g. 2,3,5', helperText: 'Up to 3 divisors' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const divisors = (input.divisors as number[]).slice(0, 4);
    const k = divisors.length;
    const steps: AlgorithmStep[] = [];

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const lcm = (a: number, b: number) => Math.floor(a / gcd(a, b)) * b;

    steps.push({
      line: 1,
      explanation: `Count integers 1..${n} divisible by at least one of [${divisors.join(', ')}] using inclusion-exclusion.`,
      variables: { n, divisors },
      visualization: {
        type: 'array',
        array: divisors.map(d => Math.floor(n / d)),
        highlights: Object.fromEntries(divisors.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(divisors.map((d, i) => [i, `|A${i+1}|=⌊${n}/${d}⌋`])),
      },
    });

    let total = 0;
    const contributions: number[] = [];

    for (let mask = 1; mask < (1 << k); mask++) {
      let bits = 0;
      let lcmVal = 1;
      const selected: number[] = [];
      for (let i = 0; i < k; i++) {
        if (mask & (1 << i)) {
          bits++;
          lcmVal = lcm(lcmVal, divisors[i]);
          selected.push(divisors[i]);
        }
      }
      const count = Math.floor(n / lcmVal);
      const sign = bits % 2 === 1 ? 1 : -1;
      const contribution = sign * count;
      contributions.push(contribution);
      total += contribution;

      steps.push({
        line: 5,
        explanation: `mask=${mask.toString(2).padStart(k,'0')}: divisors=[${selected.join(',')}], lcm=${lcmVal}. ⌊${n}/${lcmVal}⌋=${count}, sign=${sign>0?'+':'-'}. total=${total}.`,
        variables: { mask, selected, lcm: lcmVal, count, sign, total },
        visualization: {
          type: 'array',
          array: contributions.slice(),
          highlights: {
            [contributions.length - 1]: sign > 0 ? 'found' : 'swapping',
            ...Object.fromEntries(contributions.slice(0,-1).map((_,i) => [i, 'visited'])),
          },
          labels: { [contributions.length - 1]: `${sign>0?'+':''}${contribution}` },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Total = ${total} integers from 1..${n} divisible by at least one of [${divisors.join(', ')}].`,
      variables: { total },
      visualization: {
        type: 'array',
        array: [total, n - total],
        highlights: { 0: 'sorted', 1: 'visited' },
        labels: { 0: 'divisible', 1: 'other' },
      },
    });

    return steps;
  },
};

export default inclusionExclusionPrinciple;
