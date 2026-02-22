import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const smallestDivisorGivenThreshold: AlgorithmDefinition = {
  id: 'smallest-divisor-given-threshold',
  title: 'Find the Smallest Divisor Given a Threshold',
  leetcodeNumber: 1283,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the smallest divisor such that the sum of ceil(nums[i] / divisor) for all i is at most threshold. Binary search on the divisor from 1 to max(nums).',
  tags: ['binary search', 'array', 'math'],

  code: {
    pseudocode: `function smallestDivisor(nums, threshold):
  lo = 1, hi = max(nums)
  while lo < hi:
    mid = (lo + hi) / 2
    total = sum(ceil(n / mid) for n in nums)
    if total <= threshold:
      hi = mid
    else:
      lo = mid + 1
  return lo`,
    python: `import math
def smallestDivisor(nums: list[int], threshold: int) -> int:
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        total = sum(math.ceil(n / mid) for n in nums)
        if total <= threshold:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    javascript: `function smallestDivisor(nums, threshold) {
  let lo = 1, hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const total = nums.reduce((s, n) => s + Math.ceil(n / mid), 0);
    if (total <= threshold) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int smallestDivisor(int[] nums, int threshold) {
    int lo = 1, hi = Arrays.stream(nums).max().getAsInt();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int total = 0;
        for (int n : nums) total += (n + mid - 1) / mid;
        if (total <= threshold) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    nums: [1, 2, 5, 9],
    threshold: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 5, 9],
      placeholder: '1,2,5,9',
      helperText: 'Comma-separated positive integers',
    },
    {
      name: 'threshold',
      label: 'Threshold',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Maximum allowed sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const threshold = input.threshold as number;
    const steps: AlgorithmStep[] = [];

    const computeTotal = (divisor: number) =>
      nums.reduce((s, n) => s + Math.ceil(n / divisor), 0);

    const makeViz = (divisor: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nums.map(n => Math.ceil(n / divisor)),
      highlights,
      labels: nums.reduce((acc, n, i) => ({ ...acc, [i]: `ceil(${n}/${divisor})` }), {}),
    });

    let lo = 1;
    let hi = Math.max(...nums);

    steps.push({
      line: 1,
      explanation: `Binary search divisor from 1 to ${hi}. threshold=${threshold}. nums=[${nums.join(', ')}].`,
      variables: { lo, hi, threshold },
      visualization: makeViz(1, {}),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const total = computeTotal(mid);

      steps.push({
        line: 4,
        explanation: `divisor=mid=${mid}. Sum of ceil(n/${mid}) = ${total}. threshold=${threshold}.`,
        variables: { lo, mid, hi, total, threshold },
        visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {})),
      });

      if (total <= threshold) {
        steps.push({
          line: 6,
          explanation: `Total ${total} <= threshold ${threshold}. Divisor ${mid} works. Try smaller. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {})),
        });
        hi = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `Total ${total} > threshold ${threshold}. Divisor ${mid} too small. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {})),
        });
        lo = mid + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Smallest divisor = ${lo}. Sum = ${computeTotal(lo)} <= threshold ${threshold}.`,
      variables: { result: lo, sum: computeTotal(lo), threshold },
      visualization: makeViz(lo, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {})),
    });

    return steps;
  },
};

export default smallestDivisorGivenThreshold;
