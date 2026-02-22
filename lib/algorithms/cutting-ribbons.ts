import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cuttingRibbons: AlgorithmDefinition = {
  id: 'cutting-ribbons',
  title: 'Cutting Ribbons',
  leetcodeNumber: 1891,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given ribbons of various lengths and integer k, find the maximum length you can cut each ribbon into such that you get at least k pieces. Binary search on the ribbon length from 1 to max(ribbons).',
  tags: ['binary search', 'array', 'greedy'],

  code: {
    pseudocode: `function maxLength(ribbons, k):
  lo = 1, hi = max(ribbons)
  while lo < hi:
    mid = (lo + hi + 1) / 2
    pieces = sum(floor(r / mid) for r in ribbons)
    if pieces >= k:
      lo = mid
    else:
      hi = mid - 1
  return lo if sum(floor(r/lo) for r in ribbons) >= k else 0`,
    python: `def maxLength(ribbons: list[int], k: int) -> int:
    lo, hi = 1, max(ribbons)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if sum(r // mid for r in ribbons) >= k:
            lo = mid
        else:
            hi = mid - 1
    return lo if sum(r // lo for r in ribbons) >= k else 0`,
    javascript: `function maxLength(ribbons, k) {
  let lo = 1, hi = Math.max(...ribbons);
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const pieces = ribbons.reduce((s, r) => s + Math.floor(r / mid), 0);
    if (pieces >= k) lo = mid;
    else hi = mid - 1;
  }
  return ribbons.reduce((s, r) => s + Math.floor(r / lo), 0) >= k ? lo : 0;
}`,
    java: `public int maxLength(int[] ribbons, int k) {
    int lo = 1, hi = 0;
    for (int r : ribbons) hi = Math.max(hi, r);
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        int pieces = 0;
        for (int r : ribbons) pieces += r / mid;
        if (pieces >= k) lo = mid; else hi = mid - 1;
    }
    int total = 0;
    for (int r : ribbons) total += r / lo;
    return total >= k ? lo : 0;
}`,
  },

  defaultInput: {
    ribbons: [9, 7, 5],
    k: 3,
  },

  inputFields: [
    {
      name: 'ribbons',
      label: 'Ribbon Lengths',
      type: 'array',
      defaultValue: [9, 7, 5],
      placeholder: '9,7,5',
      helperText: 'Comma-separated ribbon lengths',
    },
    {
      name: 'k',
      label: 'k (minimum pieces)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minimum number of pieces required',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ribbons = input.ribbons as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const countPieces = (len: number) => ribbons.reduce((s, r) => s + Math.floor(r / len), 0);

    const makeViz = (len: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...ribbons],
      highlights,
      labels: ribbons.reduce((acc, r, i) => ({ ...acc, [i]: `floor(${r}/${len})=${Math.floor(r / len)}` }), {}),
    });

    let lo = 1;
    let hi = Math.max(...ribbons);

    steps.push({
      line: 1,
      explanation: `ribbons=[${ribbons.join(', ')}], k=${k}. Binary search length from 1 to ${hi}.`,
      variables: { lo, hi, k },
      visualization: makeViz(hi, {}),
    });

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const pieces = countPieces(mid);

      steps.push({
        line: 4,
        explanation: `mid=${mid}. Total pieces of length ${mid}: ${pieces}. Need k=${k}.`,
        variables: { lo, mid, hi, pieces, k },
        visualization: makeViz(mid, ribbons.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {})),
      });

      if (pieces >= k) {
        steps.push({
          line: 6,
          explanation: `pieces=${pieces} >= k=${k}. Length ${mid} works. Try larger. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: makeViz(mid, ribbons.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {})),
        });
        lo = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `pieces=${pieces} < k=${k}. Length ${mid} too large. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: makeViz(mid, ribbons.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {})),
        });
        hi = mid - 1;
      }
    }

    const finalPieces = countPieces(lo);
    const result = finalPieces >= k ? lo : 0;

    steps.push({
      line: 9,
      explanation: `Maximum ribbon length = ${result}. Gives ${finalPieces} pieces (need ${k}).`,
      variables: { result, pieces: finalPieces, k },
      visualization: makeViz(result || 1, ribbons.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {})),
    });

    return steps;
  },
};

export default cuttingRibbons;
