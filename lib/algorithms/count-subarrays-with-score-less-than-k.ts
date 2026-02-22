import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubarraysWithScoreLessThanK: AlgorithmDefinition = {
  id: 'count-subarrays-with-score-less-than-k',
  title: 'Count Subarrays With Score Less Than K',
  leetcodeNumber: 2302,
  difficulty: 'Hard',
  category: 'Prefix Sum',
  description:
    'The score of a subarray is defined as sum * length. Count subarrays with score < k. Use a sliding window: expand right, shrink left when score >= k. At each right position, all subarrays ending at right with left pointer in valid range contribute (right - left + 1) counts. O(n) time.',
  tags: ['Prefix Sum', 'Sliding Window', 'Array'],
  code: {
    pseudocode: `function countSubarrays(nums, k):
  count = 0, left = 0, windowSum = 0
  for right from 0 to n-1:
    windowSum += nums[right]
    while windowSum * (right - left + 1) >= k:
      windowSum -= nums[left]
      left++
    count += right - left + 1
  return count`,
    python: `def countSubarrays(nums: list[int], k: int) -> int:
    count = left = window_sum = 0
    for right, num in enumerate(nums):
        window_sum += num
        while window_sum * (right - left + 1) >= k:
            window_sum -= nums[left]
            left += 1
        count += right - left + 1
    return count`,
    javascript: `function countSubarrays(nums, k) {
  let count = 0, left = 0, windowSum = 0;
  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    while (windowSum * (right - left + 1) >= k) {
      windowSum -= nums[left++];
    }
    count += right - left + 1;
  }
  return count;
}`,
    java: `public long countSubarrays(int[] nums, long k) {
    long count = 0, windowSum = 0;
    int left = 0;
    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right];
        while (windowSum * (right - left + 1) >= k) windowSum -= nums[left++];
        count += right - left + 1;
    }
    return count;
}`,
  },
  defaultInput: { nums: [2, 1, 4, 3, 5], k: 10 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 4, 3, 5],
      placeholder: '2,1,4,3,5',
      helperText: 'Positive integers',
    },
    {
      name: 'k',
      label: 'k (score threshold)',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    let count = 0;
    let left = 0;
    let windowSum = 0;

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
      explanation: `Count subarrays with score (sum*length) < ${k}. nums = [${nums.join(', ')}]. Use sliding window.`,
      variables: { k, count, left },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < n; right++) {
      windowSum += nums[right];

      steps.push({
        line: 3,
        explanation: `Expand right to ${right}: nums[${right}]=${nums[right]}, windowSum=${windowSum}. Score = ${windowSum}*${right - left + 1}=${windowSum * (right - left + 1)}.`,
        variables: { right, left, windowSum, score: windowSum * (right - left + 1) },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: right - left + 1 }, (_, k) => [left + k, 'active'])),
            [right]: 'comparing',
          },
          { [left]: 'L', [right]: 'R' },
        ),
      });

      while (windowSum * (right - left + 1) >= k) {
        steps.push({
          line: 5,
          explanation: `Score ${windowSum * (right - left + 1)} >= ${k}. Shrink left: remove nums[${left}]=${nums[left]}.`,
          variables: { left, 'nums[left]': nums[left], windowSum },
          visualization: makeViz(
            {
              [left]: 'mismatch',
              ...Object.fromEntries(Array.from({ length: right - left }, (_, k) => [left + 1 + k, 'active'])),
              [right]: 'comparing',
            },
            { [left]: 'shrink', [right]: 'R' },
          ),
        });
        windowSum -= nums[left];
        left++;
      }

      const added = right - left + 1;
      count += added;

      steps.push({
        line: 7,
        explanation: `Valid window [${left}..${right}]. Adds ${added} subarrays ending at ${right}. count = ${count}.`,
        variables: { left, right, added, count },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: right - left + 1 }, (_, k) => [left + k, 'found'])),
          { [left]: 'L', [right]: `+${added}` },
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. Total subarrays with score < ${k}: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${count}` },
      ),
    });

    return steps;
  },
};

export default countSubarraysWithScoreLessThanK;
