import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitArrayLargestSumBs: AlgorithmDefinition = {
  id: 'split-array-largest-sum-bs',
  title: 'Split Array Largest Sum (Binary Search)',
  leetcodeNumber: 410,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Split an array into k non-empty subarrays to minimize the largest subarray sum. Binary search on the answer: find the minimum possible maximum subarray sum by checking feasibility using a greedy left-to-right scan.',
  tags: ['binary search', 'greedy', 'array', 'dynamic programming'],

  code: {
    pseudocode: `function splitArray(nums, k):
  lo = max(nums), hi = sum(nums)
  while lo < hi:
    mid = (lo + hi) / 2
    if canSplit(nums, k, mid):
      hi = mid
    else:
      lo = mid + 1
  return lo

function canSplit(nums, k, maxSum):
  parts = 1, current = 0
  for n in nums:
    if current + n <= maxSum: current += n
    else: parts++, current = n
    if parts > k: return false
  return true`,
    python: `def splitArray(nums: list[int], k: int) -> int:
    def canSplit(maxSum):
        parts, current = 1, 0
        for n in nums:
            if current + n <= maxSum:
                current += n
            else:
                parts += 1
                current = n
                if parts > k:
                    return False
        return True
    lo, hi = max(nums), sum(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if canSplit(mid): hi = mid
        else: lo = mid + 1
    return lo`,
    javascript: `function splitArray(nums, k) {
  const canSplit = (maxSum) => {
    let parts = 1, current = 0;
    for (const n of nums) {
      if (current + n <= maxSum) current += n;
      else { parts++; current = n; if (parts > k) return false; }
    }
    return true;
  };
  let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canSplit(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int splitArray(int[] nums, int k) {
    int lo = 0, hi = 0;
    for (int n : nums) { lo = Math.max(lo, n); hi += n; }
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int parts = 1, cur = 0;
        for (int n : nums) {
            if (cur + n <= mid) cur += n;
            else { parts++; cur = n; if (parts > k) { lo = mid + 1; break; } }
        }
        if (parts <= k) hi = mid; else lo = mid + 1;
    }
    return lo;
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
      label: 'k (subarrays)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of subarrays to split into',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const canSplit = (maxSum: number): { result: boolean; splits: number[] } => {
      const splits: number[] = [];
      let parts = 1;
      let current = 0;
      for (let i = 0; i < nums.length; i++) {
        if (current + nums[i] <= maxSum) {
          current += nums[i];
        } else {
          splits.push(i - 1);
          parts++;
          current = nums[i];
          if (parts > k) return { result: false, splits };
        }
      }
      return { result: true, splits };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let lo = Math.max(...nums);
    let hi = nums.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}], k=${k}. Binary search on max subarray sum: lo=${lo}, hi=${hi}.`,
      variables: { lo, hi, k },
      visualization: makeViz({}, nums.reduce((acc, n, i) => ({ ...acc, [i]: `${n}` }), {})),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const { result, splits } = canSplit(mid);

      const highlights: Record<number, string> = {};
      nums.forEach((_, i) => {
        highlights[i] = splits.includes(i) ? 'pointer' : (result ? 'active' : 'mismatch');
      });

      steps.push({
        line: 4,
        explanation: `mid=${mid}. Can split into ${k} parts with max sum ${mid}? ${result ? 'YES' : 'NO'}.`,
        variables: { lo, mid, hi, result, splitPoints: splits.join(',') },
        visualization: makeViz(highlights, nums.reduce((acc, n, i) => ({ ...acc, [i]: `${n}` }), {})),
      });

      if (result) {
        steps.push({
          line: 5,
          explanation: `Max sum ${mid} allows ${k} parts. Try smaller. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(highlights, {}),
        });
        hi = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `Max sum ${mid} needs more than ${k} parts. Try larger. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}), {}),
        });
        lo = mid + 1;
      }
    }

    const { splits } = canSplit(lo);
    const finalHighlights: Record<number, string> = {};
    nums.forEach((_, i) => { finalHighlights[i] = splits.includes(i) ? 'pointer' : 'sorted'; });

    steps.push({
      line: 9,
      explanation: `Minimum largest subarray sum = ${lo}. Split at indices: [${splits.join(', ')}].`,
      variables: { result: lo, splitPoints: splits.join(',') },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default splitArrayLargestSumBs;
