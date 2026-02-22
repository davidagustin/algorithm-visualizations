import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSubarraysWithBoundedMaximum: AlgorithmDefinition = {
  id: 'number-of-subarrays-with-bounded-maximum',
  title: 'Number of Subarrays with Bounded Maximum',
  leetcodeNumber: 795,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count subarrays where the maximum element is in [left, right]. Use the inclusion-exclusion principle: count(max <= right) - count(max <= left-1). The helper f(bound) counts subarrays with max <= bound by resetting start on elements > bound. O(n) time.',
  tags: ['Prefix Sum', 'Array', 'Counting'],
  code: {
    pseudocode: `function numSubarrayBoundedMax(nums, left, right):
  function count(bound):
    res = 0, cur = 0
    for num in nums:
      cur = cur + 1 if num <= bound else 0
      res += cur
    return res
  return count(right) - count(left - 1)`,
    python: `def numSubarrayBoundedMax(nums: list[int], left: int, right: int) -> int:
    def count(bound):
        res = cur = 0
        for num in nums:
            cur = cur + 1 if num <= bound else 0
            res += cur
        return res
    return count(right) - count(left - 1)`,
    javascript: `function numSubarrayBoundedMax(nums, left, right) {
  const count = bound => {
    let res = 0, cur = 0;
    for (const num of nums) {
      cur = num <= bound ? cur + 1 : 0;
      res += cur;
    }
    return res;
  };
  return count(right) - count(left - 1);
}`,
    java: `public int numSubarrayBoundedMax(int[] nums, int left, int right) {
    return count(nums, right) - count(nums, left - 1);
}
private int count(int[] nums, int bound) {
    int res = 0, cur = 0;
    for (int num : nums) {
        cur = num <= bound ? cur + 1 : 0;
        res += cur;
    }
    return res;
}`,
  },
  defaultInput: { nums: [2, 1, 4, 3], left: 2, right: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 4, 3],
      placeholder: '2,1,4,3',
      helperText: 'Positive integers',
    },
    {
      name: 'left',
      label: 'Left bound',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
    {
      name: 'right',
      label: 'Right bound',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const left = input.left as number;
    const right = input.right as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      explanation: `Count subarrays with max in [${left}, ${right}]. Use count(right) - count(left-1). nums = [${nums.join(', ')}].`,
      variables: { nums, left, right },
      visualization: makeViz({}, {}),
    });

    // count(right)
    let resRight = 0;
    let cur = 0;
    const countStepsRight: number[] = [];
    for (let i = 0; i < n; i++) {
      cur = nums[i] <= right ? cur + 1 : 0;
      resRight += cur;
      countStepsRight.push(cur);
      steps.push({
        line: 3,
        explanation: `count(${right}) - index ${i}: nums[${i}]=${nums[i]} <= ${right}? ${nums[i] <= right}. cur=${cur}, total=${resRight}.`,
        variables: { i, cur, resRight },
        visualization: makeViz(
          { [i]: nums[i] <= right ? 'found' : 'mismatch' },
          { [i]: `c=${cur}` },
        ),
      });
    }

    // count(left-1)
    let resLeft = 0;
    cur = 0;
    const bound2 = left - 1;
    for (let i = 0; i < n; i++) {
      cur = nums[i] <= bound2 ? cur + 1 : 0;
      resLeft += cur;
      steps.push({
        line: 3,
        explanation: `count(${bound2}) - index ${i}: nums[${i}]=${nums[i]} <= ${bound2}? ${nums[i] <= bound2}. cur=${cur}, total=${resLeft}.`,
        variables: { i, cur, resLeft },
        visualization: makeViz(
          { [i]: nums[i] <= bound2 ? 'active' : 'visited' },
          { [i]: `c=${cur}` },
        ),
      });
    }

    const result = resRight - resLeft;
    steps.push({
      line: 7,
      explanation: `count(${right})=${resRight} - count(${bound2})=${resLeft} = ${result}. Subarrays with max in [${left}, ${right}]: ${result}.`,
      variables: { resRight, resLeft, result },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, nums[i] >= left && nums[i] <= right ? 'found' : 'visited'])),
        { 0: `ans=${result}` },
      ),
    });

    return steps;
  },
};

export default numberOfSubarraysWithBoundedMaximum;
