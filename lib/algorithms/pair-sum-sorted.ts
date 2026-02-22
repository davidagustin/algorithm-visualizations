import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pairSumSorted: AlgorithmDefinition = {
  id: 'pair-sum-sorted',
  title: 'Two Sum II - Sorted Array',
  leetcodeNumber: 167,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers that add up to a specific target. Return the indices of the two numbers. Uses two pointers converging from both ends.',
  tags: ['two pointers', 'array', 'sorted', 'binary search alternative'],

  code: {
    pseudocode: `function twoSum(nums, target):
  left = 0
  right = length(nums) - 1
  while left < right:
    sum = nums[left] + nums[right]
    if sum == target:
      return [left, right]
    else if sum < target:
      left = left + 1
    else:
      right = right - 1
  return [-1, -1]`,

    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    left = 0
    right = len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]`,

    javascript: `function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}`,

    java: `public int[] twoSum(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 7, 9, 11],
    target: 10,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 3, 5, 7, 9, 11],
      placeholder: '1,3,5,7,9,11',
      helperText: 'Comma-separated sorted integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Target value for the pair sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
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

    // Step: Initialize pointers
    let left = 0;
    let right = nums.length - 1;

    steps.push({
      line: 2,
      explanation: `Initialize left pointer at index 0 (value ${nums[left]}).`,
      variables: { left, right: '?', target },
      visualization: makeViz(
        { [left]: 'pointer' },
        { [left]: 'L' }
      ),
    });

    steps.push({
      line: 3,
      explanation: `Initialize right pointer at index ${right} (value ${nums[right]}).`,
      variables: { left, right, target },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    // Main loop
    while (left < right) {
      const sum = nums[left] + nums[right];

      // Show comparison
      steps.push({
        line: 5,
        explanation: `Compute sum: nums[${left}] + nums[${right}] = ${nums[left]} + ${nums[right]} = ${sum}. Target is ${target}.`,
        variables: { left, right, sum, target },
        visualization: makeViz(
          { [left]: 'active', [right]: 'active' },
          { [left]: 'L', [right]: 'R' }
        ),
      });

      if (sum === target) {
        // Found!
        steps.push({
          line: 7,
          explanation: `Sum ${sum} equals target ${target}. Found pair at indices [${left}, ${right}] with values [${nums[left]}, ${nums[right]}].`,
          variables: { left, right, sum, target, result: [left, right] },
          visualization: makeViz(
            { [left]: 'found', [right]: 'found' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        return steps;
      } else if (sum < target) {
        steps.push({
          line: 9,
          explanation: `Sum ${sum} < target ${target}. Need a larger sum, so move left pointer right.`,
          variables: { left, right, sum, target },
          visualization: makeViz(
            { [left]: 'active', [right]: 'pointer' },
            { [left]: 'L++', [right]: 'R' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 11,
          explanation: `Sum ${sum} > target ${target}. Need a smaller sum, so move right pointer left.`,
          variables: { left, right, sum, target },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'active' },
            { [left]: 'L', [right]: 'R--' }
          ),
        });
        right--;
      }
    }

    // No pair found
    steps.push({
      line: 12,
      explanation: 'Pointers crossed. No pair found that sums to the target.',
      variables: { left, right, target, result: [-1, -1] },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default pairSumSorted;
