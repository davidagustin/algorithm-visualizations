import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sqrtXII: AlgorithmDefinition = {
  id: 'sqrt-x-ii',
  title: 'Sqrt(x)',
  leetcodeNumber: 69,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given a non-negative integer x, return the square root of x rounded down to the nearest integer. Uses binary search between 0 and x to find the largest integer whose square is <= x.',
  tags: ['math', 'binary search'],

  code: {
    pseudocode: `function mySqrt(x):
  if x < 2: return x
  lo = 1, hi = x / 2
  while lo <= hi:
    mid = lo + (hi - lo) / 2
    if mid * mid == x: return mid
    elif mid * mid < x: lo = mid + 1
    else: hi = mid - 1
  return hi`,

    python: `def mySqrt(x: int) -> int:
    if x < 2:
        return x
    lo, hi = 1, x // 2
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid * mid == x:
            return mid
        elif mid * mid < x:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi`,

    javascript: `function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1, hi = Math.floor(x / 2);
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const sq = mid * mid;
    if (sq === x) return mid;
    else if (sq < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}`,

    java: `public int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x / 2;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        long sq = (long) mid * mid;
        if (sq == x) return mid;
        else if (sq < x) lo = mid + 1;
        else hi = mid - 1;
    }
    return hi;
}`,
  },

  defaultInput: { x: 36 },

  inputFields: [
    { name: 'x', label: 'x', type: 'number', defaultValue: 36, placeholder: '36', helperText: 'Non-negative integer to find square root of' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    if (x < 2) {
      steps.push({
        line: 2,
        explanation: `x = ${x} < 2, return ${x} directly.`,
        variables: { x, result: x },
        visualization: makeViz([x], { 0: 'found' }, { 0: 'x' }),
      });
      return steps;
    }

    let lo = 1;
    let hi = Math.floor(x / 2);

    steps.push({
      line: 3,
      explanation: `Initialize binary search: lo = ${lo}, hi = ${hi} (x/2).`,
      variables: { lo, hi, x },
      visualization: makeViz([lo, hi, x], { 0: 'pointer', 1: 'pointer', 2: 'active' }, { 0: 'lo', 1: 'hi', 2: 'x' }),
    });

    let iteration = 0;
    while (lo <= hi && iteration < 30) {
      iteration++;
      const mid = lo + Math.floor((hi - lo) / 2);
      const sq = mid * mid;

      steps.push({
        line: 5,
        explanation: `mid = ${mid}, mid*mid = ${sq}. Compare with x = ${x}.`,
        variables: { lo, hi, mid, 'mid*mid': sq, x },
        visualization: makeViz([lo, mid, hi, x], { 0: 'pointer', 1: 'comparing', 2: 'pointer', 3: 'active' }, { 0: 'lo', 1: 'mid', 2: 'hi', 3: 'x' }),
      });

      if (sq === x) {
        steps.push({
          line: 6,
          explanation: `Exact match! ${mid} * ${mid} = ${x}. Return ${mid}.`,
          variables: { result: mid },
          visualization: makeViz([mid], { 0: 'found' }, { 0: 'sqrt' }),
        });
        return steps;
      } else if (sq < x) {
        lo = mid + 1;
        steps.push({
          line: 7,
          explanation: `${sq} < ${x}, so sqrt is larger. Move lo to ${lo}.`,
          variables: { lo, hi },
          visualization: makeViz([lo, mid, hi, x], { 0: 'active', 1: 'visited', 2: 'pointer', 3: 'active' }, { 0: 'lo', 1: 'mid', 2: 'hi', 3: 'x' }),
        });
      } else {
        hi = mid - 1;
        steps.push({
          line: 8,
          explanation: `${sq} > ${x}, so sqrt is smaller. Move hi to ${hi}.`,
          variables: { lo, hi },
          visualization: makeViz([lo, mid, hi, x], { 0: 'pointer', 1: 'visited', 2: 'active', 3: 'active' }, { 0: 'lo', 1: 'mid', 2: 'hi', 3: 'x' }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `lo > hi. Return hi = ${hi} (floor of sqrt(${x})).`,
      variables: { result: hi },
      visualization: makeViz([hi], { 0: 'found' }, { 0: 'result' }),
    });

    return steps;
  },
};

export default sqrtXII;
