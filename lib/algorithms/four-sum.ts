import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fourSum: AlgorithmDefinition = {
  id: 'four-sum',
  title: '4Sum',
  leetcodeNumber: 18,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an array of integers and a target, return all unique quadruplets [a, b, c, d] such that a + b + c + d = target. Sort the array first, fix two outer elements, then use two pointers for the inner pair.',
  tags: ['two pointers', 'array', 'sorting', 'hash table'],

  code: {
    pseudocode: `function fourSum(nums, target):
  sort(nums)
  result = []
  for i = 0 to n-4:
    if i > 0 and nums[i] == nums[i-1]: continue
    for j = i+1 to n-3:
      if j > i+1 and nums[j] == nums[j-1]: continue
      left = j+1, right = n-1
      while left < right:
        sum = nums[i]+nums[j]+nums[left]+nums[right]
        if sum == target:
          result.add(quadruplet)
          skip duplicates; left++; right--
        else if sum < target: left++
        else: right--
  return result`,

    python: `def fourSum(nums: list[int], target: int) -> list[list[int]]:
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        for j in range(i + 1, n - 2):
            if j > i + 1 and nums[j] == nums[j - 1]:
                continue
            left, right = j + 1, n - 1
            while left < right:
                s = nums[i] + nums[j] + nums[left] + nums[right]
                if s == target:
                    result.append([nums[i], nums[j], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]: left += 1
                    while left < right and nums[right] == nums[right - 1]: right -= 1
                    left += 1; right -= 1
                elif s < target:
                    left += 1
                else:
                    right -= 1
    return result`,

    javascript: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let left = j + 1, right = n - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++; right--;
        } else if (sum < target) left++;
        else right--;
      }
    }
  }
  return result;
}`,

    java: `public List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue;
            int left = j + 1, right = n - 1;
            while (left < right) {
                long sum = (long)nums[i] + nums[j] + nums[left] + nums[right];
                if (sum == target) {
                    result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < target) left++;
                else right--;
            }
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 0, -1, 0, -2, 2],
    target: 0,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 0, -1, 0, -2, 2],
      placeholder: '1,0,-1,0,-2,2',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: 'Target value for quadruplet sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.nums as number[];
    const target = input.target as number;
    const nums = [...original].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const n = nums.length;

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
      explanation: `Original array: [${original.join(', ')}]. Find all quadruplets summing to ${target}.`,
      variables: { original: [...original], target },
      visualization: { type: 'array', array: [...original], highlights: {}, labels: {} },
    });

    steps.push({
      line: 2,
      explanation: `Sort the array: [${nums.join(', ')}]. Sorting enables two-pointer technique and duplicate skipping.`,
      variables: { nums: [...nums] },
      visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    for (let i = 0; i < n - 3; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        steps.push({
          line: 5,
          explanation: `Skip duplicate at i=${i}: nums[${i}] = ${nums[i]} same as nums[${i - 1}].`,
          variables: { i, 'nums[i]': nums[i] },
          visualization: makeViz({ [i]: 'visited' }, { [i]: 'skip' }),
        });
        continue;
      }

      for (let j = i + 1; j < n - 2; j++) {
        if (j > i + 1 && nums[j] === nums[j - 1]) {
          steps.push({
            line: 7,
            explanation: `Skip duplicate at j=${j}: nums[${j}] = ${nums[j]} same as nums[${j - 1}].`,
            variables: { i, j, 'nums[j]': nums[j] },
            visualization: makeViz({ [i]: 'current', [j]: 'visited' }, { [i]: 'i', [j]: 'skip' }),
          });
          continue;
        }

        let left = j + 1;
        let right = n - 1;

        steps.push({
          line: 8,
          explanation: `Fix i=${i}(${nums[i]}), j=${j}(${nums[j]}). Set left=${left}, right=${right}. Need two more summing to ${target - nums[i] - nums[j]}.`,
          variables: { i, j, left, right, 'nums[i]': nums[i], 'nums[j]': nums[j] },
          visualization: makeViz(
            { [i]: 'current', [j]: 'active', [left]: 'pointer', [right]: 'pointer' },
            { [i]: 'i', [j]: 'j', [left]: 'L', [right]: 'R' }
          ),
        });

        while (left < right) {
          const sum = nums[i] + nums[j] + nums[left] + nums[right];

          steps.push({
            line: 10,
            explanation: `Sum = ${nums[i]} + ${nums[j]} + ${nums[left]} + ${nums[right]} = ${sum}. Target = ${target}.`,
            variables: { i, j, left, right, sum, target },
            visualization: makeViz(
              { [i]: 'current', [j]: 'active', [left]: 'comparing', [right]: 'comparing' },
              { [i]: 'i', [j]: 'j', [left]: 'L', [right]: 'R' }
            ),
          });

          if (sum === target) {
            result.push([nums[i], nums[j], nums[left], nums[right]]);
            steps.push({
              line: 11,
              explanation: `Found quadruplet! [${nums[i]}, ${nums[j]}, ${nums[left]}, ${nums[right]}]. Total found: ${result.length}.`,
              variables: { quadruplet: [nums[i], nums[j], nums[left], nums[right]], result: [...result] },
              visualization: makeViz(
                { [i]: 'found', [j]: 'found', [left]: 'found', [right]: 'found' },
                { [i]: 'i', [j]: 'j', [left]: 'L', [right]: 'R' }
              ),
            });
            left++;
            right--;
            while (left < right && nums[left] === nums[left - 1]) left++;
            while (left < right && nums[right] === nums[right + 1]) right--;
          } else if (sum < target) {
            left++;
          } else {
            right--;
          }
        }
      }
    }

    steps.push({
      line: 15,
      explanation: `Done! Found ${result.length} unique quadruplet(s): ${result.map(q => `[${q.join(',')}]`).join(', ') || 'none'}.`,
      variables: { result: [...result] },
      visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default fourSum;
