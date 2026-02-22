import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumValueAtGivenIndex: AlgorithmDefinition = {
  id: 'maximum-value-at-given-index',
  title: 'Maximum Value at a Given Index in a Bounded Array',
  leetcodeNumber: 1802,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Build an array of n positive integers where the sum is at most maxSum, and maximize the value at index. Binary search on the peak value: for a given peak, compute the minimum sum needed and check if it fits within maxSum.',
  tags: ['binary search', 'greedy', 'math'],

  code: {
    pseudocode: `function maxValue(n, index, maxSum):
  lo = 1, hi = maxSum
  while lo < hi:
    mid = (lo + hi + 1) / 2
    if canPlace(n, index, mid, maxSum):
      lo = mid
    else:
      hi = mid - 1
  return lo

function minSum(n, index, val):
  left = min(val, index + 1)
  right = min(val, n - index)
  leftSum = arithmetic series of left decreasing values
  rightSum = arithmetic series of right decreasing values
  return leftSum + rightSum - val (subtract val counted twice)`,
    python: `def maxValue(n: int, index: int, maxSum: int) -> int:
    def minSum(val):
        def tri(k): return k * (k + 1) // 2
        left = min(val, index + 1)
        right = min(val, n - index)
        s = tri(left) + tri(right) - val
        if val > index + 1: s += n - index - right
        if val > n - index: s += index + 1 - left
        return s
    lo, hi = 1, maxSum
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if minSum(mid) <= maxSum: lo = mid
        else: hi = mid - 1
    return lo`,
    javascript: `function maxValue(n, index, maxSum) {
  const minSum = (val) => {
    const tri = (k) => k * (k + 1) / 2;
    const left = Math.min(val, index + 1);
    const right = Math.min(val, n - index);
    let s = tri(left) + tri(right) - val;
    if (val > index + 1) s += n - index - right;
    if (val > n - index) s += index + 1 - left;
    return s;
  };
  let lo = 1, hi = maxSum;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (minSum(mid) <= maxSum) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
    java: `public int maxValue(int n, int index, int maxSum) {
    long lo = 1, hi = maxSum;
    while (lo < hi) {
        long mid = (lo + hi + 1) / 2;
        if (minSum(n, index, mid) <= maxSum) lo = mid;
        else hi = mid - 1;
    }
    return (int) lo;
}
long minSum(int n, int index, long val) {
    long left = Math.min(val, index + 1);
    long right = Math.min(val, n - index);
    long s = left*(left+1)/2 + right*(right+1)/2 - val;
    if (val > index + 1) s += n - index - right;
    if (val > n - index) s += index + 1 - left;
    return s;
}`,
  },

  defaultInput: {
    n: 4,
    index: 2,
    maxSum: 6,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n (array length)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Length of the array',
    },
    {
      name: 'index',
      label: 'index',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Index to maximize',
    },
    {
      name: 'maxSum',
      label: 'maxSum',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Maximum allowed sum of array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const index = input.index as number;
    const maxSum = input.maxSum as number;
    const steps: AlgorithmStep[] = [];

    const tri = (k: number) => (k * (k + 1)) / 2;
    const computeMinSum = (val: number): number => {
      const left = Math.min(val, index + 1);
      const right = Math.min(val, n - index);
      let s = tri(left) + tri(right) - val;
      if (val > index + 1) s += n - index - right;
      if (val > n - index) s += index + 1 - left;
      return s;
    };

    const buildArray = (val: number): number[] => {
      const arr = new Array(n).fill(1);
      arr[index] = val;
      for (let i = index - 1; i >= 0; i--) arr[i] = Math.max(1, arr[i + 1] - 1);
      for (let i = index + 1; i < n; i++) arr[i] = Math.max(1, arr[i - 1] - 1);
      return arr;
    };

    let lo = 1;
    let hi = maxSum;

    steps.push({
      line: 1,
      explanation: `n=${n}, index=${index}, maxSum=${maxSum}. Binary search on peak value from 1 to ${hi}.`,
      variables: { n, index, maxSum, lo, hi },
      visualization: {
        type: 'array',
        array: buildArray(1),
        highlights: { [index]: 'active' },
        labels: { [index]: 'idx' },
      },
    });

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const minSum = computeMinSum(mid);

      steps.push({
        line: 4,
        explanation: `mid=${mid}. Minimum sum if peak=${mid}: ${minSum}. maxSum=${maxSum}.`,
        variables: { lo, mid, hi, minSum, maxSum },
        visualization: {
          type: 'array',
          array: buildArray(mid),
          highlights: { [index]: 'comparing' },
          labels: { [index]: `peak=${mid}` },
        },
      });

      if (minSum <= maxSum) {
        steps.push({
          line: 5,
          explanation: `minSum ${minSum} <= maxSum ${maxSum}. Peak ${mid} is feasible. Try larger. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: {
            type: 'array',
            array: buildArray(mid),
            highlights: { [index]: 'found' },
            labels: { [index]: `ok=${mid}` },
          },
        });
        lo = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `minSum ${minSum} > maxSum ${maxSum}. Peak ${mid} too large. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: {
            type: 'array',
            array: buildArray(mid),
            highlights: { [index]: 'mismatch' },
            labels: { [index]: `fail=${mid}` },
          },
        });
        hi = mid - 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Maximum value at index ${index} = ${lo}. Array: [${buildArray(lo).join(', ')}]. Sum=${computeMinSum(lo)}.`,
      variables: { result: lo, sum: computeMinSum(lo) },
      visualization: {
        type: 'array',
        array: buildArray(lo),
        highlights: { [index]: 'sorted' },
        labels: { [index]: `max=${lo}` },
      },
    });

    return steps;
  },
};

export default maximumValueAtGivenIndex;
