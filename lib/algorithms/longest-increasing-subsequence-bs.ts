import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingSubsequenceBs: AlgorithmDefinition = {
  id: 'longest-increasing-subsequence-bs',
  title: 'Longest Increasing Subsequence (Binary Search)',
  leetcodeNumber: 300,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the length of the longest strictly increasing subsequence using patience sorting with binary search. Maintain a tails array where tails[i] is the smallest tail element of any LIS of length i+1. Binary search to find where each new element fits.',
  tags: ['binary search', 'dynamic programming', 'patience sorting', 'array'],

  code: {
    pseudocode: `function lengthOfLIS(nums):
  tails = []
  for num in nums:
    lo = 0, hi = len(tails)
    while lo < hi:
      mid = (lo + hi) / 2
      if tails[mid] < num: lo = mid + 1
      else: hi = mid
    if lo == len(tails): tails.append(num)
    else: tails[lo] = num
  return len(tails)`,
    python: `import bisect
def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)`,
    javascript: `function lengthOfLIS(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}`,
    java: `public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int lo = 0, hi = tails.size();
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails.get(mid) < num) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(num);
        else tails.set(lo, num);
    }
    return tails.size();
}`,
  },

  defaultInput: {
    nums: [10, 9, 2, 5, 3, 7, 101, 18],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 9, 2, 5, 3, 7, 101, 18],
      placeholder: '10,9,2,5,3,7,101,18',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const tails: number[] = [];

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}]. Patience sort with binary search. tails[] tracks smallest tails of LIS candidates.`,
      variables: { n: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let k = 0; k < nums.length; k++) {
      const num = nums[k];

      steps.push({
        line: 3,
        explanation: `Process num=${num}. tails=[${tails.join(', ')}]. Binary search for insertion position.`,
        variables: { num, tails: tails.join(',') },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [k]: 'active' },
          labels: { [k]: `num=${num}` },
        },
      });

      let lo = 0;
      let hi = tails.length;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < num) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      const action = lo === tails.length ? 'append' : 'replace';
      tails[lo] = num;

      steps.push({
        line: 8,
        explanation: `${action === 'append' ? `Append ${num}: LIS length grows to ${tails.length}.` : `Replace tails[${lo}] with ${num}.`} tails=[${tails.join(', ')}].`,
        variables: { num, pos: lo, action, 'tails length': tails.length },
        visualization: {
          type: 'array',
          array: [...tails, ...new Array(nums.length - tails.length).fill(0)],
          highlights: { [lo]: action === 'append' ? 'found' : 'active' },
          labels: { [lo]: action === 'append' ? 'new' : 'upd' },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. LIS length = ${tails.length}. tails=[${tails.join(', ')}] (not the actual LIS, but its length).`,
      variables: { result: tails.length, tails: tails.join(',') },
      visualization: {
        type: 'array',
        array: [...tails],
        highlights: tails.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: {},
      },
    });

    return steps;
  },
};

export default longestIncreasingSubsequenceBs;
