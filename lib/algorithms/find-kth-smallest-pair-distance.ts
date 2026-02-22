import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findKthSmallestPairDistance: AlgorithmDefinition = {
  id: 'find-kth-smallest-pair-distance',
  title: 'Find K-th Smallest Pair Distance',
  leetcodeNumber: 719,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given an integer array, find the k-th smallest distance among all pairs. Sort the array, then binary search on the answer: count how many pairs have distance <= mid using a sliding window. Find the smallest distance where count >= k.',
  tags: ['binary search', 'array', 'sorting', 'sliding window', 'two pointers'],

  code: {
    pseudocode: `function smallestDistancePair(nums, k):
  sort nums
  lo = 0, hi = nums[n-1] - nums[0]
  while lo < hi:
    mid = (lo + hi) / 2
    count = countPairs(nums, mid)
    if count >= k: hi = mid
    else: lo = mid + 1
  return lo

function countPairs(nums, maxDist):
  count = 0, left = 0
  for right in range(n):
    while nums[right] - nums[left] > maxDist:
      left++
    count += right - left
  return count`,
    python: `def smallestDistancePair(nums: list[int], k: int) -> int:
    nums.sort()
    n = len(nums)
    def count(mid):
        c, left = 0, 0
        for right in range(n):
            while nums[right] - nums[left] > mid:
                left += 1
            c += right - left
        return c
    lo, hi = 0, nums[-1] - nums[0]
    while lo < hi:
        mid = (lo + hi) // 2
        if count(mid) >= k: hi = mid
        else: lo = mid + 1
    return lo`,
    javascript: `function smallestDistancePair(nums, k) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const count = (mid) => {
    let c = 0, left = 0;
    for (let right = 0; right < n; right++) {
      while (nums[right] - nums[left] > mid) left++;
      c += right - left;
    }
    return c;
  };
  let lo = 0, hi = nums[n - 1] - nums[0];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (count(mid) >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int smallestDistancePair(int[] nums, int k) {
    Arrays.sort(nums);
    int n = nums.length, lo = 0, hi = nums[n-1] - nums[0];
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int c = 0, left = 0;
        for (int right = 0; right < n; right++) {
            while (nums[right] - nums[left] > mid) left++;
            c += right - left;
        }
        if (c >= k) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    nums: [1, 3, 1],
    k: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 1],
      placeholder: '1,3,1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Find the k-th smallest pair distance',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])].sort((a, b) => a - b);
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const countPairs = (maxDist: number): number => {
      let count = 0;
      let left = 0;
      for (let right = 0; right < n; right++) {
        while (nums[right] - nums[left] > maxDist) left++;
        count += right - left;
      }
      return count;
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sorted nums: [${nums.join(', ')}]. k=${k}. Binary search on distance from 0 to ${nums[n - 1] - nums[0]}.`,
      variables: { k, lo: 0, hi: nums[n - 1] - nums[0] },
      visualization: makeViz({}, {}),
    });

    let lo = 0;
    let hi = nums[n - 1] - nums[0];

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const c = countPairs(mid);

      steps.push({
        line: 5,
        explanation: `mid=${mid}. Pairs with distance <= ${mid}: count=${c}. k=${k}.`,
        variables: { lo, mid, hi, count: c, k },
        visualization: makeViz(
          { [0]: 'active', [n - 1]: 'active' },
          { [0]: `min=${nums[0]}`, [n - 1]: `max=${nums[n - 1]}` }
        ),
      });

      if (c >= k) {
        steps.push({
          line: 6,
          explanation: `count=${c} >= k=${k}. Distance ${mid} might be the answer. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz({ [0]: 'sorted', [n - 1]: 'sorted' }, { [0]: 'L', [n - 1]: 'R' }),
        });
        hi = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `count=${c} < k=${k}. Distance ${mid} is too small. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz({ [0]: 'mismatch', [n - 1]: 'mismatch' }, { [0]: 'L', [n - 1]: 'R' }),
        });
        lo = mid + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Binary search complete. The k-th (k=${k}) smallest pair distance = ${lo}.`,
      variables: { result: lo, k },
      visualization: makeViz(
        nums.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        {}
      ),
    });

    return steps;
  },
};

export default findKthSmallestPairDistance;
