import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSizeSubarraySumAdvanced: AlgorithmDefinition = {
  id: 'minimum-size-subarray-sum-advanced',
  title: 'Minimum Size Subarray Sum (Advanced)',
  leetcodeNumber: 209,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If no such subarray, return 0. Uses a sliding window: expand right, shrink left when sum >= target. Track minimum window length.',
  tags: ['Sliding Window', 'Two Pointers', 'Binary Search', 'Prefix Sum'],
  code: {
    pseudocode: `function minSubArrayLen(target, nums):
  left = 0, sum = 0, minLen = infinity
  for right in 0..n-1:
    sum += nums[right]
    while sum >= target:
      minLen = min(minLen, right - left + 1)
      sum -= nums[left]
      left++
  return minLen if minLen != inf else 0`,
    python: `def minSubArrayLen(target, nums):
    left = cur_sum = 0
    min_len = float('inf')
    for right in range(len(nums)):
        cur_sum += nums[right]
        while cur_sum >= target:
            min_len = min(min_len, right - left + 1)
            cur_sum -= nums[left]
            left += 1
    return min_len if min_len != float('inf') else 0`,
    javascript: `function minSubArrayLen(target, nums) {
  let left=0, sum=0, minLen=Infinity;
  for (let right=0;right<nums.length;right++) {
    sum+=nums[right];
    while (sum>=target) {
      minLen=Math.min(minLen,right-left+1);
      sum-=nums[left++];
    }
  }
  return minLen===Infinity?0:minLen;
}`,
    java: `public int minSubArrayLen(int target, int[] nums) {
    int left=0,sum=0,minLen=Integer.MAX_VALUE;
    for (int right=0;right<nums.length;right++) {
        sum+=nums[right];
        while (sum>=target) {
            minLen=Math.min(minLen,right-left+1);
            sum-=nums[left++];
        }
    }
    return minLen==Integer.MAX_VALUE?0:minLen;
}`,
  },
  defaultInput: { nums: [2, 3, 1, 2, 4, 3], target: 7 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 3, 1, 2, 4, 3],
      placeholder: '2,3,1,2,4,3',
      helperText: 'Array of positive integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Minimum subarray sum target',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, minLen: number, sum: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Min Subarray Sum >= ${target}`,
          entries: [
            { key: 'Window Sum', value: String(sum) },
            { key: 'Min Length', value: minLen === Infinity ? 'not found' : String(minLen) },
            { key: 'Target', value: String(target) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find shortest subarray with sum >= ${target}. Sliding window expands right, shrinks left when sum satisfies target.`,
      variables: { n, target },
      visualization: makeViz({}, {}, Infinity, 0),
    });

    let left = 0, sum = 0, minLen = Infinity;
    for (let right = 0; right < n; right++) {
      sum += nums[right];
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = left; i <= right; i++) h[i] = i === right ? 'active' : 'pointer';
      l[left] = 'L'; l[right] = 'R';

      if (sum >= target) {
        while (sum >= target) {
          const len = right - left + 1;
          if (len < minLen) minLen = len;
          const h2: Record<number, string> = {};
          const l2: Record<number, string> = { [left]: 'L', [right]: 'R' };
          for (let i = left; i <= right; i++) h2[i] = 'found';
          steps.push({
            line: 5,
            explanation: `Sum=${sum} >= ${target}. Window [${left}..${right}], length=${len}. minLen=${minLen}. Shrink from left.`,
            variables: { left, right, sum, length: len, minLen },
            visualization: makeViz(h2, l2, minLen, sum),
          });
          sum -= nums[left];
          left++;
        }
      } else {
        steps.push({
          line: 3,
          explanation: `Expand: added nums[${right}]=${nums[right]}. Sum=${sum} < ${target}. Window [${left}..${right}].`,
          variables: { right, left, sum, minLen },
          visualization: makeViz(h, l, minLen, sum),
        });
      }
    }

    const result = minLen === Infinity ? 0 : minLen;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 8,
      explanation: `Done. Minimum subarray length with sum >= ${target} = ${result === 0 ? 'not found (0)' : result}.`,
      variables: { result },
      visualization: makeViz(finalH, {}, minLen, sum),
    });

    return steps;
  },
};

export default minimumSizeSubarraySumAdvanced;
