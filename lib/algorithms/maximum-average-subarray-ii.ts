import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumAverageSubarrayIi: AlgorithmDefinition = {
  id: 'maximum-average-subarray-ii',
  title: 'Maximum Average Subarray II',
  leetcodeNumber: 644,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums of n elements and integer k, find a contiguous subarray of length >= k that has the maximum average value. Use binary search on the answer combined with a sliding window technique. Check if there exists a subarray of length >= k with average >= mid.',
  tags: ['sliding window', 'binary search', 'array'],

  code: {
    pseudocode: `function findMaxAverage(nums, k):
  lo = min(nums), hi = max(nums)
  while hi - lo > 1e-5:
    mid = (lo + hi) / 2
    if canAchieve(nums, k, mid):
      lo = mid
    else:
      hi = mid
  return lo

function canAchieve(nums, k, target):
  // subtract target from all elements, check if any subarray of len>=k has sum>=0
  prefix sum of (nums[i]-target)
  use sliding window minimum of prefix[0..i-k]`,

    python: `def findMaxAverage(nums: list[int], k: int) -> float:
    def check(target):
        total = sum(nums[i] - target for i in range(k))
        if total >= 0: return True
        prev_sum = 0
        min_prev = 0
        for i in range(k, len(nums)):
            total += nums[i] - target - (nums[i-k] - target)
            prev_sum += nums[i-k] - target
            min_prev = min(min_prev, prev_sum)
            if total - min_prev >= 0: return True
        return False
    lo, hi = min(nums), max(nums)
    while hi - lo > 1e-5:
        mid = (lo + hi) / 2
        if check(mid): lo = mid
        else: hi = mid
    return lo`,

    javascript: `function findMaxAverage(nums, k) {
  const check = target => {
    let total = nums.slice(0, k).reduce((s, x) => s + x - target, 0);
    if (total >= 0) return true;
    let prevSum = 0, minPrev = 0;
    for (let i = k; i < nums.length; i++) {
      total += nums[i] - target - (nums[i-k] - target);
      prevSum += nums[i-k] - target;
      minPrev = Math.min(minPrev, prevSum);
      if (total - minPrev >= 0) return true;
    }
    return false;
  };
  let lo = Math.min(...nums), hi = Math.max(...nums);
  while (hi - lo > 1e-5) {
    const mid = (lo + hi) / 2;
    if (check(mid)) lo = mid; else hi = mid;
  }
  return lo;
}`,

    java: `public double findMaxAverage(int[] nums, int k) {
    double lo = Arrays.stream(nums).min().getAsInt();
    double hi = Arrays.stream(nums).max().getAsInt();
    while (hi - lo > 1e-5) {
        double mid = (lo + hi) / 2;
        if (check(nums, k, mid)) lo = mid; else hi = mid;
    }
    return lo;
}
private boolean check(int[] nums, int k, double target) {
    double total = 0, prevSum = 0, minPrev = 0;
    for (int i = 0; i < k; i++) total += nums[i] - target;
    if (total >= 0) return true;
    for (int i = k; i < nums.length; i++) {
        total += nums[i] - target - (nums[i-k] - target);
        prevSum += nums[i-k] - target;
        minPrev = Math.min(minPrev, prevSum);
        if (total - minPrev >= 0) return true;
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [1, 12, -5, -6, 50, 3],
    k: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 12, -5, -6, 50, 3],
      placeholder: '1,12,-5,-6,50,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Minimum Length k',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Subarray must have length >= k',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    let lo = Math.min(...nums);
    let hi = Math.max(...nums);

    steps.push({
      line: 1,
      explanation: `Binary search on answer in range [${lo}, ${hi}]. For each midpoint, check if any subarray of length >= ${k} has average >= mid.`,
      variables: { lo, hi, k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let iterations = 0;
    while (hi - lo > 1e-5 && iterations < 6) {
      iterations++;
      const mid = (lo + hi) / 2;

      // Check if achievable
      let total = 0;
      for (let i = 0; i < k; i++) total += nums[i] - mid;
      let achievable = total >= 0;
      let prevSum = 0;
      let minPrev = 0;

      if (!achievable) {
        for (let i = k; i < n; i++) {
          total += nums[i] - mid - (nums[i - k] - mid);
          prevSum += nums[i - k] - mid;
          minPrev = Math.min(minPrev, prevSum);
          if (total - minPrev >= 0) { achievable = true; break; }
        }
      }

      steps.push({
        line: 4,
        explanation: `Iteration ${iterations}: mid = ${mid.toFixed(4)}. ${achievable ? `Achievable! Move lo up to ${mid.toFixed(4)}.` : `Not achievable. Move hi down to ${mid.toFixed(4)}.`}`,
        variables: { lo: lo.toFixed(4), hi: hi.toFixed(4), mid: mid.toFixed(4), achievable },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: Object.fromEntries(nums.map((v, i) => [i, v >= mid ? 'found' : 'active'])),
          labels: { 0: `lo=${lo.toFixed(1)}`, [n - 1]: `hi=${hi.toFixed(1)}` },
        } as ArrayVisualization,
      });

      if (achievable) lo = mid;
      else hi = mid;
    }

    steps.push({
      line: 8,
      explanation: `Converged. Maximum average for subarray of length >= ${k} = ${lo.toFixed(5)}.`,
      variables: { result: lo.toFixed(5) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumAverageSubarrayIi;
