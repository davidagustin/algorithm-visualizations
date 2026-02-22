import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumAverageDifference: AlgorithmDefinition = {
  id: 'minimum-average-difference',
  title: 'Minimum Average Difference',
  leetcodeNumber: 2256,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the index with minimum average difference: |avg(nums[0..i]) - avg(nums[i+1..n-1])|. Use a prefix sum to compute left sum in O(1), derive right sum from total. Handle edge case where right side is empty (i == n-1). O(n) time.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function minimumAverageDifference(nums):
  n = len(nums)
  total = sum(nums)
  leftSum = 0, minDiff = INF, ans = 0
  for i from 0 to n-1:
    leftSum += nums[i]
    rightSum = total - leftSum
    leftAvg = leftSum // (i+1)
    rightAvg = 0 if i == n-1 else rightSum // (n-1-i)
    diff = abs(leftAvg - rightAvg)
    if diff < minDiff:
      minDiff = diff; ans = i
  return ans`,
    python: `def minimumAverageDifference(nums: list[int]) -> int:
    n = len(nums)
    total = sum(nums)
    left_sum = 0
    min_diff, ans = float('inf'), 0
    for i in range(n):
        left_sum += nums[i]
        right_sum = total - left_sum
        left_avg = left_sum // (i + 1)
        right_avg = 0 if i == n - 1 else right_sum // (n - 1 - i)
        diff = abs(left_avg - right_avg)
        if diff < min_diff:
            min_diff, ans = diff, i
    return ans`,
    javascript: `function minimumAverageDifference(nums) {
  const n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  let leftSum = 0, minDiff = Infinity, ans = 0;
  for (let i = 0; i < n; i++) {
    leftSum += nums[i];
    const rightSum = total - leftSum;
    const leftAvg = Math.floor(leftSum / (i + 1));
    const rightAvg = i === n - 1 ? 0 : Math.floor(rightSum / (n - 1 - i));
    const diff = Math.abs(leftAvg - rightAvg);
    if (diff < minDiff) { minDiff = diff; ans = i; }
  }
  return ans;
}`,
    java: `public int minimumAverageDifference(int[] nums) {
    int n = nums.length;
    long total = 0;
    for (int x : nums) total += x;
    long leftSum = 0, minDiff = Long.MAX_VALUE;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        leftSum += nums[i];
        long rightSum = total - leftSum;
        long leftAvg = leftSum / (i + 1);
        long rightAvg = i == n - 1 ? 0 : rightSum / (n - 1 - i);
        long diff = Math.abs(leftAvg - rightAvg);
        if (diff < minDiff) { minDiff = diff; ans = i; }
    }
    return ans;
}`,
  },
  defaultInput: { nums: [2, 5, 3, 9, 5, 3] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 5, 3, 9, 5, 3],
      placeholder: '2,5,3,9,5,3',
      helperText: 'Non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    let minDiff = Infinity;
    let ans = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find index with min avg difference. nums = [${nums.join(', ')}], total = ${total}.`,
      variables: { nums, total },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      leftSum += nums[i];
      const rightSum = total - leftSum;
      const leftAvg = Math.floor(leftSum / (i + 1));
      const rightAvg = i === n - 1 ? 0 : Math.floor(rightSum / (n - 1 - i));
      const diff = Math.abs(leftAvg - rightAvg);
      const prevMin = minDiff;
      if (diff < minDiff) { minDiff = diff; ans = i; }

      steps.push({
        line: 6,
        explanation: `Index ${i}: leftAvg=${leftAvg} (sum=${leftSum}/${i + 1}), rightAvg=${rightAvg}${i === n - 1 ? ' (empty)' : ` (sum=${rightSum}/${n - 1 - i})`}. diff=${diff}. minDiff=${minDiff}${diff < prevMin ? ' (new min!)' : ''}.`,
        variables: { i, leftAvg, rightAvg, diff, minDiff, ans },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, diff < prevMin ? 'found' : 'active'])),
            ...Object.fromEntries(Array.from({ length: n - i - 1 }, (_, k) => [i + 1 + k, 'comparing'])),
          },
          { [i]: `d=${diff}` },
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `Done. Index with minimum average difference: ${ans} (diff=${minDiff}).`,
      variables: { result: ans, minDiff },
      visualization: makeViz(
        { ...Object.fromEntries(nums.map((_, i) => [i, i === ans ? 'found' : 'visited'])) },
        { [ans]: `ans minD=${minDiff}` },
      ),
    });

    return steps;
  },
};

export default minimumAverageDifference;
