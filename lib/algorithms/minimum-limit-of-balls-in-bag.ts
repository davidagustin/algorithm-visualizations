import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumLimitOfBallsInBag: AlgorithmDefinition = {
  id: 'minimum-limit-of-balls-in-bag',
  title: 'Minimum Limit of Balls in a Bag',
  leetcodeNumber: 1760,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given bags of balls and maxOperations splits, minimize the maximum number of balls in any bag. Binary search on the answer: for a given max bag size, count how many splits are needed and check if it is within maxOperations.',
  tags: ['binary search', 'array', 'greedy'],

  code: {
    pseudocode: `function minimumSize(nums, maxOperations):
  lo = 1, hi = max(nums)
  while lo < hi:
    mid = (lo + hi) / 2
    ops = sum(ceil(n / mid) - 1 for n in nums)
    if ops <= maxOperations:
      hi = mid
    else:
      lo = mid + 1
  return lo`,
    python: `import math
def minimumSize(nums: list[int], maxOperations: int) -> int:
    lo, hi = 1, max(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        ops = sum(math.ceil(n / mid) - 1 for n in nums)
        if ops <= maxOperations:
            hi = mid
        else:
            lo = mid + 1
    return lo`,
    javascript: `function minimumSize(nums, maxOperations) {
  let lo = 1, hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const ops = nums.reduce((s, n) => s + Math.ceil(n / mid) - 1, 0);
    if (ops <= maxOperations) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int minimumSize(int[] nums, int maxOperations) {
    int lo = 1, hi = Arrays.stream(nums).max().getAsInt();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int ops = 0;
        for (int n : nums) ops += (n - 1) / mid;
        if (ops <= maxOperations) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    nums: [9],
    maxOperations: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Bag Sizes',
      type: 'array',
      defaultValue: [9],
      placeholder: '9',
      helperText: 'Number of balls in each bag',
    },
    {
      name: 'maxOperations',
      label: 'maxOperations',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of bag splits allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const maxOperations = input.maxOperations as number;
    const steps: AlgorithmStep[] = [];

    const countOps = (maxSize: number) =>
      nums.reduce((s, n) => s + Math.ceil(n / maxSize) - 1, 0);

    const makeViz = (maxSize: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels: nums.reduce((acc, n, i) => ({
        ...acc,
        [i]: `bags=${Math.ceil(n / maxSize)}`,
      }), {}),
    });

    let lo = 1;
    let hi = Math.max(...nums);

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], maxOps=${maxOperations}. Binary search on max bag size from 1 to ${hi}.`,
      variables: { lo, hi, maxOperations },
      visualization: makeViz(hi, {}),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const ops = countOps(mid);

      steps.push({
        line: 4,
        explanation: `mid=${mid}. Operations needed to get all bags <= ${mid}: ${ops}. maxOps=${maxOperations}.`,
        variables: { lo, mid, hi, ops, maxOperations },
        visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {})),
      });

      if (ops <= maxOperations) {
        steps.push({
          line: 6,
          explanation: `ops=${ops} <= maxOps=${maxOperations}. Max size ${mid} works. Try smaller. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {})),
        });
        hi = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `ops=${ops} > maxOps=${maxOperations}. Max size ${mid} too small. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(mid, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {})),
        });
        lo = mid + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum possible maximum bag size = ${lo}. Requires ${countOps(lo)} operations.`,
      variables: { result: lo, ops: countOps(lo) },
      visualization: makeViz(lo, nums.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {})),
    });

    return steps;
  },
};

export default minimumLimitOfBallsInBag;
