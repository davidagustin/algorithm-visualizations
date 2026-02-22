import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nthMagicalNumber: AlgorithmDefinition = {
  id: 'nth-magical-number',
  title: 'Nth Magical Number',
  leetcodeNumber: 878,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'A magical number is a positive integer divisible by either a or b. Given n, a, b, find the nth magical number modulo 10^9+7. Binary search on the value: count magical numbers up to mid using inclusion-exclusion with LCM(a, b).',
  tags: ['binary search', 'math', 'lcm', 'gcd'],

  code: {
    pseudocode: `function nthMagicalNumber(n, a, b):
  MOD = 10^9 + 7
  lcm = a * b / gcd(a, b)
  left = min(a, b)
  right = min(a, b) * n
  while left < right:
    mid = (left + right) / 2
    count = mid/a + mid/b - mid/lcm
    if count >= n:
      right = mid
    else:
      left = mid + 1
  return left % MOD`,

    python: `from math import gcd
def nthMagicalNumber(n: int, a: int, b: int) -> int:
    MOD = 10**9 + 7
    lcm = a * b // gcd(a, b)
    left, right = min(a, b), min(a, b) * n
    while left < right:
        mid = (left + right) // 2
        if mid // a + mid // b - mid // lcm >= n:
            right = mid
        else:
            left = mid + 1
    return left % MOD`,

    javascript: `function nthMagicalNumber(n, a, b) {
  const MOD = 1e9 + 7;
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const lcm = a * b / gcd(a, b);
  let left = Math.min(a, b), right = Math.min(a, b) * n;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (Math.floor(mid/a) + Math.floor(mid/b) - Math.floor(mid/lcm) >= n)
      right = mid;
    else left = mid + 1;
  }
  return left % MOD;
}`,

    java: `public int nthMagicalNumber(int n, int a, int b) {
    long MOD = 1000000007L;
    long lcm = (long) a / gcd(a, b) * b;
    long left = Math.min(a, b), right = (long) Math.min(a, b) * n;
    while (left < right) {
        long mid = (left + right) / 2;
        if (mid / a + mid / b - mid / lcm >= n) right = mid;
        else left = mid + 1;
    }
    return (int)(left % MOD);
}
private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
  },

  defaultInput: {
    n: 4,
    a: 2,
    b: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n (which magical number)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Find the nth magical number',
    },
    {
      name: 'a',
      label: 'a (first divisor)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'First divisor for magical numbers',
    },
    {
      name: 'b',
      label: 'b (second divisor)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Second divisor for magical numbers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const a = input.a as number;
    const b = input.b as number;
    const steps: AlgorithmStep[] = [];

    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
    const lcm = (a * b) / gcd(a, b);

    const countMagical = (mid: number) =>
      Math.floor(mid / a) + Math.floor(mid / b) - Math.floor(mid / lcm);

    const maxVal = Math.min(a, b) * n;
    const searchSpace = Array.from({ length: Math.min(maxVal, 20) }, (_, i) => i + 1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: searchSpace,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find ${n}th magical number divisible by ${a} or ${b}. LCM(${a},${b})=${lcm}. Search range [${Math.min(a, b)}, ${maxVal}].`,
      variables: { n, a, b, lcm, searchRange: `[${Math.min(a, b)}, ${maxVal}]` },
      visualization: makeViz(
        searchSpace.reduce((acc, v, i) => ({
          ...acc,
          [i]: v % a === 0 || v % b === 0 ? 'active' : 'sorted',
        }), {}),
        searchSpace.reduce((acc, v, i) => ({
          ...acc,
          [i]: v % a === 0 || v % b === 0 ? `${v}` : `${v}`,
        }), {})
      ),
    });

    let left = Math.min(a, b);
    let right = maxVal;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const count = countMagical(mid);

      steps.push({
        line: 6,
        explanation: `mid=${mid}. Magical numbers up to ${mid}: floor(${mid}/${a})+floor(${mid}/${b})-floor(${mid}/${lcm})=${count}. Need ${n}.`,
        variables: { left, right, mid, count, n, formula: `${Math.floor(mid / a)}+${Math.floor(mid / b)}-${Math.floor(mid / lcm)}=${count}` },
        visualization: makeViz(
          searchSpace.reduce((acc, v, i) => ({
            ...acc,
            [i]: v === mid ? 'comparing' : v % a === 0 || v % b === 0 ? 'active' : 'sorted',
          }), {}),
          { [mid - 1]: `cnt=${count}` }
        ),
      });

      if (count >= n) {
        steps.push({
          line: 8,
          explanation: `${count} >= ${n}. There are enough magical numbers up to ${mid}. right=${mid}.`,
          variables: { left, right, mid, count },
          visualization: makeViz(
            searchSpace.reduce((acc, v, i) => ({
              ...acc,
              [i]: v <= mid && (v % a === 0 || v % b === 0) ? 'found' : 'sorted',
            }), {}),
            { [mid - 1]: `ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 10,
          explanation: `${count} < ${n}. Not enough magical numbers up to ${mid}. left=${mid + 1}.`,
          variables: { left, right, mid, count },
          visualization: makeViz(
            searchSpace.reduce((acc, v, i) => ({
              ...acc,
              [i]: v <= mid ? 'mismatch' : 'sorted',
            }), {}),
            { [mid - 1]: `not enough` }
          ),
        });
        left = mid + 1;
      }
    }

    const MOD = 1000000007;
    steps.push({
      line: 11,
      explanation: `The ${n}th magical number is ${left}. Answer = ${left} % MOD = ${left % MOD}.`,
      variables: { nthMagical: left, result: left % MOD },
      visualization: makeViz(
        left <= searchSpace.length ? { [left - 1]: 'found' } : {},
        left <= searchSpace.length ? { [left - 1]: `${n}th=${left}` } : {}
      ),
    });

    return steps;
  },
};

export default nthMagicalNumber;
