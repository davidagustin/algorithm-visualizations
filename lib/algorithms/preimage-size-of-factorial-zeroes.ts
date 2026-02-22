import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const preimageSizeOfFactorialZeroes: AlgorithmDefinition = {
  id: 'preimage-size-of-factorial-zeroes',
  title: 'Preimage Size of Factorial Zeroes Function',
  leetcodeNumber: 793,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given k, find how many non-negative integers n have exactly k trailing zeroes in n!. Trailing zeroes come from factors of 5. The count of zeroes for n! is sum of floor(n/5^i). Binary search finds the first n with >= k and >= k+1 zeroes, and the answer is their difference.',
  tags: ['binary search', 'math', 'factorial'],

  code: {
    pseudocode: `function preimageSizeFZF(k):
  return leftBound(k + 1) - leftBound(k)

function leftBound(k):
  left = 0, right = 5 * (k + 1)
  while left < right:
    mid = (left + right) / 2
    zeroes = trailingZeroes(mid)
    if zeroes >= k:
      right = mid
    else:
      left = mid + 1
  return left

function trailingZeroes(n):
  count = 0
  while n >= 5:
    n = n / 5
    count += n
  return count`,

    python: `def preimageSizeFZF(k: int) -> int:
    def trailingZeroes(n):
        count = 0
        while n >= 5:
            n //= 5
            count += n
        return count
    def leftBound(k):
        lo, hi = 0, 5 * (k + 1)
        while lo < hi:
            mid = (lo + hi) // 2
            if trailingZeroes(mid) >= k:
                hi = mid
            else:
                lo = mid + 1
        return lo
    return leftBound(k + 1) - leftBound(k)`,

    javascript: `function preimageSizeFZF(k) {
  const trailingZeroes = (n) => {
    let count = 0;
    while (n >= 5) { n = Math.floor(n / 5); count += n; }
    return count;
  };
  const leftBound = (k) => {
    let lo = 0, hi = 5 * (k + 1);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (trailingZeroes(mid) >= k) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  return leftBound(k + 1) - leftBound(k);
}`,

    java: `public int preimageSizeFZF(int k) {
    return (int)(leftBound(k + 1) - leftBound(k));
}
private long trailingZeroes(long n) {
    long c = 0; while (n >= 5) { n /= 5; c += n; } return c;
}
private long leftBound(long k) {
    long lo = 0, hi = 5L * (k + 1);
    while (lo < hi) {
        long mid = (lo + hi) / 2;
        if (trailingZeroes(mid) >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    k: 5,
  },

  inputFields: [
    {
      name: 'k',
      label: 'k (trailing zeroes)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of trailing zeroes to count preimage size for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const trailingZeroes = (n: number): number => {
      let count = 0, x = n;
      while (x >= 5) { x = Math.floor(x / 5); count += x; }
      return count;
    };

    const searchSpace = Array.from({ length: Math.min(5 * (k + 1) + 1, 30) }, (_, i) => i);

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
      explanation: `Find how many n have exactly ${k} trailing zeroes in n!. Trailing zeroes: sum of floor(n/5^i).`,
      variables: { k },
      visualization: makeViz(
        searchSpace.reduce((acc, v, i) => ({
          ...acc,
          [i]: trailingZeroes(v) === k ? 'active' : 'sorted',
        }), {}),
        searchSpace.reduce((acc, v, i) => ({
          ...acc,
          [i]: `z=${trailingZeroes(v)}`,
        }), {})
      ),
    });

    // Find leftBound(k)
    steps.push({
      line: 5,
      explanation: `Find first n where trailing zeroes of n! >= ${k}.`,
      variables: { targetZeroes: k },
      visualization: makeViz({}, {}),
    });

    let lo = 0, hi = Math.min(5 * (k + 1), searchSpace.length - 1);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const z = trailingZeroes(mid);

      steps.push({
        line: 7,
        explanation: `leftBound(${k}): mid=${mid}, zeroes(${mid}!)=${z}. ${z >= k ? `>= ${k}, hi=${mid}` : `< ${k}, lo=${mid + 1}`}.`,
        variables: { lo, hi, mid, zeroesAtMid: z, target: k },
        visualization: makeViz(
          { [lo]: 'active', [Math.min(hi, searchSpace.length) - 1]: 'active', [mid]: 'comparing' },
          { [lo]: 'lo', [Math.min(hi, searchSpace.length) - 1]: 'hi', [mid]: `z=${z}` }
        ),
      });

      if (z >= k) hi = mid; else lo = mid + 1;
    }
    const lb1 = lo;

    steps.push({
      line: 9,
      explanation: `leftBound(${k}) = ${lb1}. First n where n! has >= ${k} trailing zeroes.`,
      variables: { leftBound_k: lb1 },
      visualization: makeViz({ [lb1]: 'found' }, { [lb1]: `lb(${k})=${lb1}` }),
    });

    // Find leftBound(k+1)
    lo = 0; hi = Math.min(5 * (k + 2), searchSpace.length - 1);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const z = trailingZeroes(mid);

      steps.push({
        line: 7,
        explanation: `leftBound(${k + 1}): mid=${mid}, zeroes(${mid}!)=${z}. ${z >= k + 1 ? `>= ${k + 1}, hi=${mid}` : `< ${k + 1}, lo=${mid + 1}`}.`,
        variables: { lo, hi, mid, zeroesAtMid: z, target: k + 1 },
        visualization: makeViz(
          { [lo]: 'active', [Math.min(hi, searchSpace.length) - 1]: 'active', [mid]: 'comparing' },
          { [lo]: 'lo', [Math.min(hi, searchSpace.length) - 1]: 'hi', [mid]: `z=${z}` }
        ),
      });

      if (z >= k + 1) hi = mid; else lo = mid + 1;
    }
    const lb2 = lo;

    steps.push({
      line: 9,
      explanation: `leftBound(${k + 1}) = ${lb2}. Answer = lb(${k + 1}) - lb(${k}) = ${lb2} - ${lb1} = ${lb2 - lb1}.`,
      variables: { leftBound_k_plus_1: lb2, leftBound_k: lb1, result: lb2 - lb1 },
      visualization: makeViz(
        searchSpace.reduce((acc, v, i) => ({
          ...acc,
          [i]: v >= lb1 && v < lb2 ? 'found' : 'sorted',
        }), {}),
        { [lb1]: `ans=${lb2 - lb1}` }
      ),
    });

    return steps;
  },
};

export default preimageSizeOfFactorialZeroes;
