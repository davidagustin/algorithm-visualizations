import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const twoSumLessThanK: AlgorithmDefinition = {
  id: 'two-sum-less-than-k',
  title: 'Two Sum Less Than K',
  leetcodeNumber: 1099,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an integer array and integer k, find the maximum sum S such that there exist two indices i < j where nums[i] + nums[j] = S and S < k. Sort the array and use two pointers converging inward, tracking the best valid sum.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function twoSumLessThanK(nums, k):
  sort(nums)
  left = 0, right = n-1
  ans = -1
  while left < right:
    sum = nums[left] + nums[right]
    if sum < k:
      ans = max(ans, sum)
      left++
    else:
      right--
  return ans`,

    python: `def twoSumLessThanK(nums: list[int], k: int) -> int:
    nums.sort()
    left, right = 0, len(nums) - 1
    ans = -1
    while left < right:
        s = nums[left] + nums[right]
        if s < k:
            ans = max(ans, s)
            left += 1
        else:
            right -= 1
    return ans`,

    javascript: `function twoSumLessThanK(nums, k) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1, ans = -1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum < k) {
      ans = Math.max(ans, sum);
      left++;
    } else {
      right--;
    }
  }
  return ans;
}`,

    java: `public int twoSumLessThanK(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, right = nums.length - 1, ans = -1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum < k) {
            ans = Math.max(ans, sum);
            left++;
        } else right--;
    }
    return ans;
}`,
  },

  defaultInput: {
    nums: [34, 23, 1, 24, 75, 33, 54, 8],
    k: 60,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [34, 23, 1, 24, 75, 33, 54, 8],
      placeholder: '34,23,1,24,75,33,54,8',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 60,
      placeholder: '60',
      helperText: 'The sum must be strictly less than k',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const sorted = [...rawNums].sort((a, b) => a - b);
    const n = sorted.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sorted],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort: [${sorted.join(', ')}]. Use two pointers to find max pair sum < ${k}.`,
      variables: { sorted: [...sorted], k },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = n - 1;
    let ans = -1;

    steps.push({
      line: 2,
      explanation: `Initialize left=${left}, right=${right}, ans=-1 (no valid pair yet).`,
      variables: { left, right, ans },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      const sum = sorted[left] + sorted[right];

      if (sum < k) {
        const improved = sum > ans;
        if (improved) ans = sum;
        steps.push({
          line: 6,
          explanation: `sum=${sorted[left]}+${sorted[right]}=${sum} < k=${k}. Valid! ${improved ? `New best: ans=${ans}.` : `Not better than ans=${ans}.`} Move left.`,
          variables: { left, right, sum, ans, k },
          visualization: makeViz({ [left]: 'found', [right]: 'found' }, { [left]: 'L', [right]: 'R' }),
        });
        left++;
      } else {
        steps.push({
          line: 9,
          explanation: `sum=${sorted[left]}+${sorted[right]}=${sum} >= k=${k}. Too large. Move right.`,
          variables: { left, right, sum, ans, k },
          visualization: makeViz({ [left]: 'comparing', [right]: 'mismatch' }, { [left]: 'L', [right]: 'R' }),
        });
        right--;
      }
    }

    steps.push({
      line: 10,
      explanation: `Answer: ${ans}. ${ans === -1 ? 'No valid pair found.' : `Max pair sum less than ${k} is ${ans}.`}`,
      variables: { ans },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default twoSumLessThanK;
