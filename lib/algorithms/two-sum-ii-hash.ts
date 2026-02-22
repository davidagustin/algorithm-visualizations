import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const twoSumIiHash: AlgorithmDefinition = {
  id: 'two-sum-ii-hash',
  title: 'Two Sum (Hash Map)',
  leetcodeNumber: 1,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array of integers and a target, return indices of the two numbers that add up to the target. Uses a hash map to store each number and its index, enabling O(1) complement lookup for an overall O(n) solution.',
  tags: ['hash map', 'array', 'two sum'],

  code: {
    pseudocode: `function twoSum(nums, target):
  map = {}
  for i in range(len(nums)):
    complement = target - nums[i]
    if complement in map:
      return [map[complement], i]
    map[nums[i]] = i
  return []`,

    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,

    javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,

    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
  },

  defaultInput: {
    nums: [2, 7, 11, 15],
    target: 9,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 7, 11, 15],
      placeholder: '2,7,11,15',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Target sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const seen: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize an empty hash map to store number -> index mappings.',
      variables: { map: '{}', target },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];

      steps.push({
        line: 3,
        explanation: `Processing index ${i}: nums[${i}] = ${nums[i]}. Compute complement = ${target} - ${nums[i]} = ${complement}.`,
        variables: { i, current: nums[i], complement, map: JSON.stringify(seen) },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'curr' }),
      });

      if (complement in seen) {
        const foundIdx = seen[complement];
        steps.push({
          line: 5,
          explanation: `Complement ${complement} found in map at index ${foundIdx}. Return [${foundIdx}, ${i}].`,
          variables: { i, current: nums[i], complement, foundAt: foundIdx, result: [foundIdx, i] },
          visualization: makeViz({ [foundIdx]: 'found', [i]: 'found' }, { [foundIdx]: 'j', [i]: 'i' }),
        });
        return steps;
      }

      seen[nums[i]] = i;
      steps.push({
        line: 6,
        explanation: `Complement ${complement} not in map. Store nums[${i}]=${nums[i]} -> index ${i} in the map.`,
        variables: { i, current: nums[i], complement, map: JSON.stringify(seen) },
        visualization: makeViz({ [i]: 'visited' }, { [i]: 'stored' }),
      });
    }

    steps.push({
      line: 7,
      explanation: 'No valid pair found. Return empty array.',
      variables: { result: '[]' },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default twoSumIiHash;
