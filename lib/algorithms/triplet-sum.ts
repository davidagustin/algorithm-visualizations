import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const tripletSum: AlgorithmDefinition = {
  id: 'triplet-sum',
  title: '3Sum',
  leetcodeNumber: 15,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0. The solution sorts the array first, then fixes one element and uses two pointers to find the remaining pair.',
  tags: ['two pointers', 'array', 'sorting'],

  code: {
    pseudocode: `function threeSum(nums):
  sort(nums)
  result = []
  for i = 0 to length(nums) - 3:
    if i > 0 and nums[i] == nums[i-1]:
      continue
    left = i + 1
    right = length(nums) - 1
    while left < right:
      sum = nums[i] + nums[left] + nums[right]
      if sum == 0:
        result.add([nums[i], nums[left], nums[right]])
        left++; right--
        while left < right and nums[left] == nums[left-1]: left++
      else if sum < 0:
        left++
      else:
        right--
  return result`,

    python: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return result`,

    javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        left++; right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,

    java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++; right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [-1, 0, 1, 2, -1, -4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-1, 0, 1, 2, -1, -4],
      placeholder: '-1,0,1,2,-1,-4',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.nums as number[];
    const nums = [...original].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    // Step: Show original array
    steps.push({
      line: 1,
      explanation: `Original array: [${original.join(', ')}]. We need to find all unique triplets that sum to zero.`,
      variables: { original: [...original] },
      visualization: { type: 'array', array: [...original], highlights: {}, labels: {} },
    });

    // Step: Sort
    steps.push({
      line: 2,
      explanation: `Sort the array: [${nums.join(', ')}]. Sorting enables the two-pointer approach and duplicate skipping.`,
      variables: { nums: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    for (let i = 0; i < nums.length - 2; i++) {
      // Skip duplicates for i
      if (i > 0 && nums[i] === nums[i - 1]) {
        steps.push({
          line: 5,
          explanation: `nums[${i}] = ${nums[i]} is same as nums[${i - 1}]. Skip to avoid duplicate triplets.`,
          variables: { i, 'nums[i]': nums[i], result: [...result] },
          visualization: makeViz({ [i]: 'visited', [i - 1]: 'visited' }, { [i]: 'skip' }),
        });
        continue;
      }

      let left = i + 1;
      let right = nums.length - 1;

      // Step: Fix element i
      steps.push({
        line: 4,
        explanation: `Fix nums[${i}] = ${nums[i]}. Set left = ${left}, right = ${right}. Find pairs that sum to ${-nums[i]}.`,
        variables: { i, 'nums[i]': nums[i], left, right, target: -nums[i] },
        visualization: makeViz(
          { [i]: 'current', [left]: 'pointer', [right]: 'pointer' },
          { [i]: 'fix', [left]: 'L', [right]: 'R' }
        ),
      });

      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];

        // Step: Compute sum
        steps.push({
          line: 9,
          explanation: `Sum = nums[${i}] + nums[${left}] + nums[${right}] = ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`,
          variables: { i, left, right, sum, 'nums[i]': nums[i], 'nums[left]': nums[left], 'nums[right]': nums[right] },
          visualization: makeViz(
            { [i]: 'current', [left]: 'comparing', [right]: 'comparing' },
            { [i]: 'fix', [left]: 'L', [right]: 'R' }
          ),
        });

        if (sum === 0) {
          result.push([nums[i], nums[left], nums[right]]);
          steps.push({
            line: 11,
            explanation: `Found triplet! [${nums[i]}, ${nums[left]}, ${nums[right]}]. Add to results.`,
            variables: { triplet: [nums[i], nums[left], nums[right]], result: [...result] },
            visualization: makeViz(
              { [i]: 'found', [left]: 'found', [right]: 'found' },
              { [i]: 'fix', [left]: 'L', [right]: 'R' }
            ),
          });
          left++;
          right--;
          while (left < right && nums[left] === nums[left - 1]) left++;
        } else if (sum < 0) {
          steps.push({
            line: 15,
            explanation: `Sum ${sum} < 0. Need larger values, move left pointer right.`,
            variables: { sum, left, right },
            visualization: makeViz(
              { [i]: 'current', [left]: 'active', [right]: 'pointer' },
              { [i]: 'fix', [left]: 'L++', [right]: 'R' }
            ),
          });
          left++;
        } else {
          steps.push({
            line: 17,
            explanation: `Sum ${sum} > 0. Need smaller values, move right pointer left.`,
            variables: { sum, left, right },
            visualization: makeViz(
              { [i]: 'current', [left]: 'pointer', [right]: 'active' },
              { [i]: 'fix', [left]: 'L', [right]: 'R--' }
            ),
          });
          right--;
        }
      }
    }

    // Final result
    steps.push({
      line: 18,
      explanation: `Done! Found ${result.length} unique triplet(s): ${result.map(t => `[${t.join(',')}]`).join(', ') || 'none'}.`,
      variables: { result: [...result] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default tripletSum;
