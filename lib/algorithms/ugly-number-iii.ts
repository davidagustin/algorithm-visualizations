import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uglyNumberIII: AlgorithmDefinition = {
  id: 'ugly-number-iii',
  title: 'Ugly Number III',
  leetcodeNumber: 1201,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Find the nth positive integer that is divisible by a, b, or c. Uses binary search on the answer combined with inclusion-exclusion principle: count(x) = x/a + x/b + x/c - x/lcm(a,b) - x/lcm(b,c) - x/lcm(a,c) + x/lcm(a,b,c).',
  tags: ['math', 'binary search', 'inclusion-exclusion', 'lcm', 'gcd'],

  code: {
    pseudocode: `function nthUglyNumber(n, a, b, c):
  gcd(x,y) = x if y==0 else gcd(y, x%y)
  lcm(x,y) = x / gcd(x,y) * y
  ab = lcm(a,b), bc = lcm(b,c), ac = lcm(a,c), abc = lcm(ab,c)
  lo=1, hi=2e9
  while lo < hi:
    mid = (lo+hi)/2
    count = mid/a + mid/b + mid/c - mid/ab - mid/bc - mid/ac + mid/abc
    if count < n: lo = mid+1
    else: hi = mid
  return lo`,

    python: `from math import gcd
def nthUglyNumber(n, a, b, c):
    def lcm(x, y): return x // gcd(x,y) * y
    ab, bc, ac = lcm(a,b), lcm(b,c), lcm(a,c)
    abc = lcm(ab, c)
    lo, hi = 1, 2*10**9
    while lo < hi:
        mid = (lo + hi) // 2
        cnt = mid//a + mid//b + mid//c - mid//ab - mid//bc - mid//ac + mid//abc
        if cnt < n: lo = mid + 1
        else: hi = mid
    return lo`,

    javascript: `function nthUglyNumber(n, a, b, c) {
  const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
  const lcm = (x, y) => Math.floor(x / gcd(x, y)) * y;
  const ab = lcm(a,b), bc = lcm(b,c), ac = lcm(a,c), abc = lcm(ab,c);
  let lo = 1, hi = 2e9;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const cnt = Math.floor(mid/a)+Math.floor(mid/b)+Math.floor(mid/c)
              - Math.floor(mid/ab)-Math.floor(mid/bc)-Math.floor(mid/ac)
              + Math.floor(mid/abc);
    if (cnt < n) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,

    java: `public int nthUglyNumber(int n, int a, int b, int c) {
    long ab = lcm(a,b), bc = lcm(b,c), ac = lcm(a,c), abc = lcm(ab,c);
    long lo = 1, hi = 2_000_000_000L;
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        long cnt = mid/a+mid/b+mid/c-mid/ab-mid/bc-mid/ac+mid/abc;
        if (cnt < n) lo = mid + 1;
        else hi = mid;
    }
    return (int)lo;
}`,
  },

  defaultInput: { n: 5, a: 2, b: 3, c: 5 },

  inputFields: [
    { name: 'n', label: 'n', type: 'number', defaultValue: 5, placeholder: '5', helperText: 'Find the nth ugly number' },
    { name: 'a', label: 'a', type: 'number', defaultValue: 2, placeholder: '2', helperText: 'First divisor' },
    { name: 'b', label: 'b', type: 'number', defaultValue: 3, placeholder: '3', helperText: 'Second divisor' },
    { name: 'c', label: 'c', type: 'number', defaultValue: 5, placeholder: '5', helperText: 'Third divisor' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const a = input.a as number;
    const b = input.b as number;
    const c = input.c as number;
    const steps: AlgorithmStep[] = [];

    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    const lcm = (x: number, y: number): number => Math.floor(x / gcd(x, y)) * y;

    const ab = lcm(a, b);
    const bc = lcm(b, c);
    const ac = lcm(a, c);
    const abc = lcm(ab, c);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Find ${n}th number divisible by ${a}, ${b}, or ${c}. LCMs: lcm(a,b)=${ab}, lcm(b,c)=${bc}, lcm(a,c)=${ac}, lcm(a,b,c)=${abc}.`,
      variables: { n, a, b, c, ab, bc, ac, abc },
      visualization: makeViz([a, b, c, ab, bc, ac, abc], Object.fromEntries([0,1,2,3,4,5,6].map(i => [i, 'default'])), { 0: 'a', 1: 'b', 2: 'c', 3: 'ab', 4: 'bc', 5: 'ac', 6: 'abc' }),
    });

    let lo = 1;
    let hi = 2 * 1000000000;

    const count = (x: number) =>
      Math.floor(x / a) + Math.floor(x / b) + Math.floor(x / c)
      - Math.floor(x / ab) - Math.floor(x / bc) - Math.floor(x / ac)
      + Math.floor(x / abc);

    let iteration = 0;
    while (lo < hi && iteration < 40) {
      iteration++;
      const mid = lo + Math.floor((hi - lo) / 2);
      const cnt = count(mid);

      steps.push({
        line: 7,
        explanation: `Binary search: mid = ${mid}. count(${mid}) = ${cnt}. ${cnt < n ? `cnt < ${n}, move lo to ${mid + 1}` : `cnt >= ${n}, move hi to ${mid}`}.`,
        variables: { lo, hi, mid, count: cnt, n },
        visualization: makeViz([lo, mid, hi, cnt], { 0: 'pointer', 1: 'comparing', 2: 'pointer', 3: cnt < n ? 'mismatch' : 'found' }, { 0: 'lo', 1: 'mid', 2: 'hi', 3: 'cnt' }),
      });

      if (cnt < n) lo = mid + 1;
      else hi = mid;
    }

    steps.push({
      line: 10,
      explanation: `Binary search converged. lo = hi = ${lo}. The ${n}th ugly number (divisible by ${a}, ${b}, or ${c}) is ${lo}.`,
      variables: { result: lo },
      visualization: makeViz([lo], { 0: 'found' }, { 0: 'result' }),
    });

    return steps;
  },
};

export default uglyNumberIII;
