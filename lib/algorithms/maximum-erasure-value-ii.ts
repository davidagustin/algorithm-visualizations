import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumErasureValueIi: AlgorithmDefinition = {
  id: 'maximum-erasure-value-ii',
  title: 'Maximum Erasure Value II',
  leetcodeNumber: 1695,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers nums, find the maximum sum of a subarray with all unique elements. When a duplicate is found, shrink the window from the left until the duplicate is removed. Track the maximum window sum seen.',
  tags: ['Sliding Window', 'Hash Set', 'Two Pointers', 'Array'],
  code: {
    pseudocode: `function maximumUniqueSubarray(nums):
  left = 0, sum = 0, maxSum = 0
  seen = set()
  for right in 0..n-1:
    while nums[right] in seen:
      seen.remove(nums[left])
      sum -= nums[left]
      left++
    seen.add(nums[right])
    sum += nums[right]
    maxSum = max(maxSum, sum)
  return maxSum`,
    python: `def maximumUniqueSubarray(nums):
    seen = set()
    left = cur_sum = max_sum = 0
    for right, num in enumerate(nums):
        while num in seen:
            seen.remove(nums[left])
            cur_sum -= nums[left]
            left += 1
        seen.add(num)
        cur_sum += num
        max_sum = max(max_sum, cur_sum)
    return max_sum`,
    javascript: `function maximumUniqueSubarray(nums) {
  const seen = new Set();
  let left=0, curSum=0, maxSum=0;
  for (let right=0;right<nums.length;right++) {
    while (seen.has(nums[right])) {
      seen.delete(nums[left]);
      curSum-=nums[left++];
    }
    seen.add(nums[right]);
    curSum+=nums[right];
    maxSum=Math.max(maxSum,curSum);
  }
  return maxSum;
}`,
    java: `public int maximumUniqueSubarray(int[] nums) {
    Set<Integer> seen=new HashSet<>();
    int left=0,curSum=0,maxSum=0;
    for (int right=0;right<nums.length;right++) {
        while (seen.contains(nums[right])) { seen.remove(nums[left]); curSum-=nums[left++]; }
        seen.add(nums[right]); curSum+=nums[right];
        maxSum=Math.max(maxSum,curSum);
    }
    return maxSum;
}`,
  },
  defaultInput: { nums: [4, 2, 4, 5, 6] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 4, 5, 6],
      placeholder: '4,2,4,5,6',
      helperText: 'Array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const seen = new Set<number>();
    let left = 0, curSum = 0, maxSum = 0;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Max Erasure Value (Unique Subarray)',
          entries: [
            { key: 'Window Sum', value: String(curSum) },
            { key: 'Max Sum', value: String(maxSum) },
            { key: 'Window', value: `[${left}..right]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find max sum subarray with all unique elements. Sliding window with set to track uniqueness.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < n; right++) {
      while (seen.has(nums[right])) {
        seen.delete(nums[left]);
        curSum -= nums[left];
        const h: Record<number, string> = { [left]: 'mismatch', [right]: 'comparing' };
        steps.push({
          line: 5,
          explanation: `Duplicate nums[${right}]=${nums[right]} found. Remove nums[${left}]=${nums[left]} from window. Sum=${curSum - 0}.`,
          variables: { left, right, removed: nums[left], duplicate: nums[right] },
          visualization: makeViz(h, { [left]: 'rem', [right]: 'dup' }),
        });
        left++;
      }

      seen.add(nums[right]);
      curSum += nums[right];
      if (curSum > maxSum) maxSum = curSum;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        h[i] = curSum === maxSum ? 'found' : 'pointer';
      }
      h[right] = 'active';
      l[left] = 'L'; l[right] = 'R';

      steps.push({
        line: 8,
        explanation: `Add nums[${right}]=${nums[right]}. Window [${left}..${right}], sum=${curSum}. maxSum=${maxSum}.`,
        variables: { right, left, num: nums[right], curSum, maxSum },
        visualization: makeViz(h, l),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 10,
      explanation: `Done. Maximum sum of unique-element subarray = ${maxSum}.`,
      variables: { result: maxSum },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default maximumErasureValueIi;
