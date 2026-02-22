import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const threeSumClosest: AlgorithmDefinition = {
  id: 'three-sum-closest',
  title: '3Sum Closest',
  leetcodeNumber: 16,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an integer array and a target, find three integers such that their sum is closest to target. Return the sum. Sort the array, then for each element use two pointers to find the closest pair sum.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function threeSumClosest(nums, target):
  sort(nums)
  closest = nums[0] + nums[1] + nums[2]
  for i = 0 to length(nums) - 3:
    left = i + 1
    right = length(nums) - 1
    while left < right:
      sum = nums[i] + nums[left] + nums[right]
      if |sum - target| < |closest - target|:
        closest = sum
      if sum < target: left++
      else if sum > target: right--
      else: return target
  return closest`,

    python: `def threeSumClosest(nums: list[int], target: int) -> int:
    nums.sort()
    closest = nums[0] + nums[1] + nums[2]
    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if abs(s - target) < abs(closest - target):
                closest = s
            if s < target:
                left += 1
            elif s > target:
                right -= 1
            else:
                return target
    return closest`,

    javascript: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let closest = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
      if (sum < target) left++;
      else if (sum > target) right--;
      else return target;
    }
  }
  return closest;
}`,

    java: `public int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int closest = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length - 2; i++) {
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;
            if (sum < target) left++;
            else if (sum > target) right--;
            else return target;
        }
    }
    return closest;
}`,
  },

  defaultInput: {
    nums: [-1, 2, 1, -4],
    target: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-1, 2, 1, -4],
      placeholder: '-1,2,1,-4',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Target sum to get closest to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.nums as number[];
    const target = input.target as number;
    const nums = [...original].sort((a, b) => a - b);
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

    steps.push({
      line: 1,
      explanation: `Find triplet sum closest to target = ${target}. Original: [${original.join(', ')}].`,
      variables: { original: [...original], target },
      visualization: { type: 'array', array: [...original], highlights: {}, labels: {} },
    });

    steps.push({
      line: 2,
      explanation: `Sort: [${nums.join(', ')}]. Now use two pointers.`,
      variables: { nums: [...nums] },
      visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    let closest = nums[0] + nums[1] + nums[2];

    steps.push({
      line: 3,
      explanation: `Initialize closest = nums[0] + nums[1] + nums[2] = ${nums[0]} + ${nums[1]} + ${nums[2]} = ${closest}.`,
      variables: { closest, target },
      visualization: makeViz({ 0: 'pointer', 1: 'pointer', 2: 'pointer' }, { 0: 'i', 1: 'L', 2: 'R' }),
    });

    for (let i = 0; i < nums.length - 2; i++) {
      let left = i + 1;
      let right = nums.length - 1;

      steps.push({
        line: 4,
        explanation: `Fix i=${i} (${nums[i]}). Set left=${left}, right=${right}.`,
        variables: { i, left, right, 'nums[i]': nums[i], closest },
        visualization: makeViz(
          { [i]: 'current', [left]: 'pointer', [right]: 'pointer' },
          { [i]: 'fix', [left]: 'L', [right]: 'R' }
        ),
      });

      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];

        steps.push({
          line: 8,
          explanation: `Sum = ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}. Target = ${target}. Closest so far = ${closest}.`,
          variables: { i, left, right, sum, target, closest },
          visualization: makeViz(
            { [i]: 'current', [left]: 'comparing', [right]: 'comparing' },
            { [i]: 'fix', [left]: 'L', [right]: 'R' }
          ),
        });

        if (Math.abs(sum - target) < Math.abs(closest - target)) {
          closest = sum;
          steps.push({
            line: 9,
            explanation: `|${sum} - ${target}| = ${Math.abs(sum - target)} is better. Update closest = ${closest}.`,
            variables: { sum, target, closest },
            visualization: makeViz(
              { [i]: 'found', [left]: 'found', [right]: 'found' },
              { [i]: 'fix', [left]: 'best', [right]: 'best' }
            ),
          });
        }

        if (sum === target) {
          steps.push({
            line: 12,
            explanation: `Exact match! Sum = target = ${target}. Return immediately.`,
            variables: { sum, target },
            visualization: makeViz(
              { [i]: 'found', [left]: 'found', [right]: 'found' },
              { [i]: 'fix', [left]: 'L', [right]: 'R' }
            ),
          });
          return steps;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `Done! Closest sum to target ${target} is ${closest} (diff = ${Math.abs(closest - target)}).`,
      variables: { closest, target, diff: Math.abs(closest - target) },
      visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default threeSumClosest;
