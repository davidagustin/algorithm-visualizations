import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countPairsWhoseSumIsLessThanTarget: AlgorithmDefinition = {
  id: 'count-pairs-whose-sum-is-less-than-target',
  title: 'Count Pairs Whose Sum is Less Than Target',
  leetcodeNumber: 2824,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given an integer array and a target, count the number of pairs (i, j) where i < j and nums[i] + nums[j] < target. Sort the array first, then use two pointers: if sum < target, all elements from left+1 to right pair with left, so add (right-left) to count.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function countPairs(nums, target):
  sort(nums)
  left = 0, right = n-1
  count = 0
  while left < right:
    if nums[left] + nums[right] < target:
      count += right - left
      left++
    else:
      right--
  return count`,

    python: `def countPairs(nums: list[int], target: int) -> int:
    nums.sort()
    left, right = 0, len(nums) - 1
    count = 0
    while left < right:
        if nums[left] + nums[right] < target:
            count += right - left
            left += 1
        else:
            right -= 1
    return count`,

    javascript: `function countPairs(nums, target) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1, count = 0;
  while (left < right) {
    if (nums[left] + nums[right] < target) {
      count += right - left;
      left++;
    } else {
      right--;
    }
  }
  return count;
}`,

    java: `public int countPairs(List<Integer> nums, int target) {
    Collections.sort(nums);
    int left = 0, right = nums.size() - 1, count = 0;
    while (left < right) {
        if (nums.get(left) + nums.get(right) < target) {
            count += right - left;
            left++;
        } else {
            right--;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [-1, 1, 2, 3, 1],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-1, 1, 2, 3, 1],
      placeholder: '-1,1,2,3,1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target sum threshold',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const sorted = [...rawNums].sort((a, b) => a - b);

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort array: [${sorted.join(', ')}]. Two pointers from ends. If sum < target, all pairs (left, left+1..right) are valid.`,
      variables: { sorted: [...sorted], target },
      visualization: makeViz(sorted, {}, {}),
    });

    let left = 0;
    let right = sorted.length - 1;
    let count = 0;

    steps.push({
      line: 2,
      explanation: `Initialize left=${left}, right=${right}, count=0.`,
      variables: { left, right, count, target },
      visualization: makeViz(sorted, { [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      const sum = sorted[left] + sorted[right];

      if (sum < target) {
        const pairs = right - left;
        count += pairs;
        steps.push({
          line: 5,
          explanation: `sum=${sorted[left]}+${sorted[right]}=${sum} < target=${target}. All ${pairs} pairs (${left}, ${left + 1}..${right}) valid. count=${count}. Move left.`,
          variables: { left, right, sum, count, newPairs: pairs },
          visualization: makeViz(
            sorted,
            { [left]: 'found', ...Object.fromEntries(Array.from({ length: right - left }, (_, k) => [k + left + 1, 'comparing'])) },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 8,
          explanation: `sum=${sorted[left]}+${sorted[right]}=${sum} >= target=${target}. Move right inward.`,
          variables: { left, right, sum, count },
          visualization: makeViz(sorted, { [left]: 'pointer', [right]: 'mismatch' }, { [left]: 'L', [right]: 'R' }),
        });
        right--;
      }
    }

    steps.push({
      line: 9,
      explanation: `Pointers met. Total valid pairs with sum < ${target}: ${count}.`,
      variables: { count },
      visualization: makeViz(sorted, {}, {}),
    });

    return steps;
  },
};

export default countPairsWhoseSumIsLessThanTarget;
