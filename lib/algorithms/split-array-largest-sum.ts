import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitArrayLargestSum: AlgorithmDefinition = {
  id: 'split-array-largest-sum',
  title: 'Split Array Largest Sum',
  leetcodeNumber: 410,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Split an array into k non-empty subarrays to minimize the largest subarray sum. Binary search on the answer: the range is [max(nums), sum(nums)]. For each candidate mid, check if it is feasible to split into at most k subarrays with each subarray sum <= mid.',
  tags: ['binary search', 'dynamic programming', 'greedy', 'array'],

  code: {
    pseudocode: `function splitArray(nums, k):
  left = max(nums), right = sum(nums)
  while left < right:
    mid = left + (right - left) / 2
    if canSplit(nums, k, mid):
      right = mid
    else:
      left = mid + 1
  return left

function canSplit(nums, k, maxSum):
  parts = 1, curSum = 0
  for num in nums:
    if curSum + num > maxSum:
      parts++, curSum = 0
    curSum += num
  return parts <= k`,

    python: `def splitArray(nums: list[int], k: int) -> int:
    def canSplit(maxSum):
        parts, cur = 1, 0
        for n in nums:
            if cur + n > maxSum:
                parts += 1
                cur = 0
            cur += n
        return parts <= k

    left, right = max(nums), sum(nums)
    while left < right:
        mid = left + (right - left) // 2
        if canSplit(mid):
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function splitArray(nums, k) {
  const canSplit = (maxSum) => {
    let parts = 1, cur = 0;
    for (const n of nums) {
      if (cur + n > maxSum) { parts++; cur = 0; }
      cur += n;
    }
    return parts <= k;
  };
  let left = Math.max(...nums), right = nums.reduce((a, b) => a + b, 0);
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canSplit(mid)) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int splitArray(int[] nums, int k) {
    int left = 0, right = 0;
    for (int n : nums) { left = Math.max(left, n); right += n; }
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canSplit(nums, k, mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}
private boolean canSplit(int[] nums, int k, int maxSum) {
    int parts = 1, cur = 0;
    for (int n : nums) {
        if (cur + n > maxSum) { parts++; cur = 0; }
        cur += n;
    }
    return parts <= k;
}`,
  },

  defaultInput: {
    nums: [7, 2, 5, 10, 8],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [7, 2, 5, 10, 8],
      placeholder: '7,2,5,10,8',
      helperText: 'Comma-separated non-negative integers',
    },
    {
      name: 'k',
      label: 'Number of subarrays (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Split into this many subarrays',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const canSplit = (maxSum: number): { feasible: boolean; parts: number } => {
      let parts = 1;
      let cur = 0;
      for (const n of nums) {
        if (cur + n > maxSum) { parts++; cur = 0; }
        cur += n;
      }
      return { feasible: parts <= k, parts };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>, lo: number, hi: number, mid?: number): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Binary Search on Answer',
        entries: [
          { key: 'left (min candidate)', value: String(lo) },
          { key: 'right (max candidate)', value: String(hi) },
          ...(mid !== undefined ? [{ key: 'mid (testing)', value: String(mid) }] : []),
        ],
      },
    });

    let left = Math.max(...nums);
    let right = nums.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `Binary search on the answer. left = max(nums) = ${left}, right = sum(nums) = ${right}. Answer is in [${left}, ${right}].`,
      variables: { left, right, k },
      visualization: makeViz({}, {}, left, right),
    });

    let iteration = 0;
    while (left < right) {
      iteration++;
      const mid = left + Math.floor((right - left) / 2);
      const { feasible, parts } = canSplit(mid);

      steps.push({
        line: 3,
        explanation: `Iteration ${iteration}: mid = ${mid}. Test: can we split into <= ${k} subarrays with each sum <= ${mid}?`,
        variables: { left, right, mid, k },
        visualization: makeViz(
          nums.map((_, i) => ({ [i]: 'comparing' })).reduce((a, b) => ({ ...a, ...b }), {}),
          {},
          left, right, mid
        ),
      });

      steps.push({
        line: 11,
        explanation: `Greedy check with maxSum=${mid}: need ${parts} partition(s). ${feasible ? `${parts} <= ${k}, feasible!` : `${parts} > ${k}, not feasible.`}`,
        variables: { mid, partsNeeded: parts, k, feasible },
        visualization: makeViz(
          nums.map((_, i) => ({ [i]: feasible ? 'found' : 'mismatch' })).reduce((a, b) => ({ ...a, ...b }), {}),
          {},
          left, right, mid
        ),
      });

      if (feasible) {
        steps.push({
          line: 5,
          explanation: `mid=${mid} is feasible. Try smaller: right = ${mid}.`,
          variables: { left, right: mid },
          visualization: makeViz({}, {}, left, mid, mid),
        });
        right = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `mid=${mid} is NOT feasible. Need larger max sum: left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: makeViz({}, {}, mid + 1, right, mid),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 8,
      explanation: `Binary search converged. left = right = ${left}. Minimum possible largest sum is ${left}.`,
      variables: { result: left },
      visualization: makeViz(
        nums.map((_, i) => ({ [i]: 'sorted' })).reduce((a, b) => ({ ...a, ...b }), {}),
        {},
        left, left
      ),
    });

    return steps;
  },
};

export default splitArrayLargestSum;
