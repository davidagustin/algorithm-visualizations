import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const houseRobberIv: AlgorithmDefinition = {
  id: 'house-robber-iv',
  title: 'House Robber IV',
  leetcodeNumber: 2560,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given house values and a minimum number of houses k to rob, find the minimum possible maximum robbery (capability) such that the robber can steal from at least k houses without robbing two adjacent houses. Binary search on capability, greedily check feasibility.',
  tags: ['binary search', 'greedy', 'dynamic programming'],

  code: {
    pseudocode: `function minCapability(nums, k):
  left = min(nums)
  right = max(nums)
  while left < right:
    mid = (left + right) / 2
    count = canRob(nums, mid, k)
    if count >= k:
      right = mid
    else:
      left = mid + 1
  return left

function canRob(nums, cap, k):
  count = 0, i = 0
  while i < len(nums):
    if nums[i] <= cap:
      count++, i += 2
    else:
      i += 1
  return count`,

    python: `def minCapability(nums: list[int], k: int) -> int:
    def canRob(cap):
        count = i = 0
        while i < len(nums):
            if nums[i] <= cap:
                count += 1
                i += 2
            else:
                i += 1
        return count >= k
    left, right = min(nums), max(nums)
    while left < right:
        mid = (left + right) // 2
        if canRob(mid): right = mid
        else: left = mid + 1
    return left`,

    javascript: `function minCapability(nums, k) {
  const canRob = (cap) => {
    let count = 0, i = 0;
    while (i < nums.length) {
      if (nums[i] <= cap) { count++; i += 2; }
      else i++;
    }
    return count >= k;
  };
  let left = Math.min(...nums), right = Math.max(...nums);
  while (left < right) {
    const mid = (left + right) >> 1;
    if (canRob(mid)) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int minCapability(int[] nums, int k) {
    int left = Integer.MAX_VALUE, right = 0;
    for (int n : nums) { left = Math.min(left, n); right = Math.max(right, n); }
    while (left < right) {
        int mid = (left + right) / 2;
        int count = 0;
        for (int i = 0; i < nums.length; ) {
            if (nums[i] <= mid) { count++; i += 2; } else i++;
        }
        if (count >= k) right = mid; else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    nums: [2, 3, 5, 9],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'House Values',
      type: 'array',
      defaultValue: [2, 3, 5, 9],
      placeholder: '2,3,5,9',
      helperText: 'Values in each house',
    },
    {
      name: 'k',
      label: 'Minimum Houses to Rob',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Must rob at least k houses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const canRob = (cap: number): number => {
      let count = 0, i = 0;
      while (i < nums.length) {
        if (nums[i] <= cap) { count++; i += 2; }
        else i++;
      }
      return count;
    };

    let left = Math.min(...nums);
    let right = Math.max(...nums);

    steps.push({
      line: 1,
      explanation: `Houses: [${nums.join(', ')}]. Need to rob >= ${k} houses. Binary search capability from ${left} to ${right}.`,
      variables: { left, right, k },
      visualization: makeViz(
        nums.reduce((acc, _, i) => ({ ...acc, [i]: 'pointer' }), {}),
        nums.reduce((acc, v, i) => ({ ...acc, [i]: `val=${v}` }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const count = canRob(mid);

      steps.push({
        line: 4,
        explanation: `Try capability=${mid}. Can rob ${count} houses (need ${k}).`,
        variables: { left, right, capability: mid, robbedCount: count, k },
        visualization: makeViz(
          nums.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? 'active' : 'mismatch' }), {}),
          nums.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? `rob` : `skip` }), {})
        ),
      });

      if (count >= k) {
        steps.push({
          line: 7,
          explanation: `${count} >= ${k}. Capability ${mid} works. Try lower: right = ${mid}.`,
          variables: { left, right, capability: mid, count },
          visualization: makeViz(
            nums.reduce((acc, v, i) => ({ ...acc, [i]: v <= mid ? 'found' : 'sorted' }), {}),
            { 0: `cap=${mid} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `${count} < ${k}. Capability ${mid} too low. Try higher: left = ${mid + 1}.`,
          variables: { left, right, capability: mid, count },
          visualization: makeViz(
            nums.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            { 0: `cap=${mid} low` }
          ),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum capability = ${left}. Robber can steal from ${k} houses without exceeding this value.`,
      variables: { result: left },
      visualization: makeViz(
        nums.reduce((acc, v, i) => ({ ...acc, [i]: v <= left ? 'found' : 'sorted' }), {}),
        { 0: `min cap=${left}` }
      ),
    });

    return steps;
  },
};

export default houseRobberIv;
