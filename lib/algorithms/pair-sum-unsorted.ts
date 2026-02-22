import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pairSumUnsorted: AlgorithmDefinition = {
  id: 'pair-sum-unsorted',
  title: 'Two Sum',
  leetcodeNumber: 1,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an array of integers and a target, return indices of the two numbers that add up to the target. Uses a hash map for O(n) lookup of complements.',
  tags: ['hash map', 'array', 'complement'],

  code: {
    pseudocode: `function twoSum(nums, target):
  map = {}
  for i = 0 to length(nums) - 1:
    complement = target - nums[i]
    if complement in map:
      return [map[complement], i]
    map[nums[i]] = i
  return [-1, -1]`,

    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return [-1, -1]`,

    javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [-1, -1];
}`,

    java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
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
      helperText: 'Comma-separated integers (unsorted is fine)',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Target value for the pair sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const map: Record<number, number> = {};

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      mapEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Hash Map',
        entries: mapEntries,
      },
    });

    const getMapEntries = (): { key: string; value: string }[] =>
      Object.entries(map).map(([val, idx]) => ({
        key: String(val),
        value: `idx ${idx}`,
      }));

    // Step: Initialize empty map
    steps.push({
      line: 2,
      explanation: 'Initialize an empty hash map to store seen values and their indices.',
      variables: { map: {}, target },
      visualization: makeViz({}, {}, []),
    });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];

      // Highlight current element
      const currentHighlights: Record<number, string> = {};
      const currentLabels: Record<number, string> = {};

      // Mark already-visited elements
      for (let j = 0; j < i; j++) {
        currentHighlights[j] = 'visited';
      }
      currentHighlights[i] = 'active';
      currentLabels[i] = 'i';

      // Step: Look at current element and compute complement
      steps.push({
        line: 4,
        explanation: `Element nums[${i}] = ${nums[i]}. Complement = ${target} - ${nums[i]} = ${complement}.`,
        variables: { i, 'nums[i]': nums[i], complement, map: { ...map } },
        visualization: makeViz(currentHighlights, currentLabels, getMapEntries()),
      });

      // Step: Check if complement is in map
      if (complement in map) {
        const j = map[complement];
        const foundHighlights: Record<number, string> = {};
        for (let k = 0; k < nums.length; k++) {
          if (k === j || k === i) {
            foundHighlights[k] = 'found';
          } else if (k < i) {
            foundHighlights[k] = 'visited';
          }
        }

        steps.push({
          line: 6,
          explanation: `Complement ${complement} found in map at index ${j}. Return [${j}, ${i}] with values [${nums[j]}, ${nums[i]}].`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], complement, result: [j, i] },
          visualization: makeViz(
            foundHighlights,
            { [j]: 'found', [i]: 'found' },
            getMapEntries()
          ),
        });

        return steps;
      }

      // Step: Complement not found, add current to map
      steps.push({
        line: 5,
        explanation: `Complement ${complement} not in map. Check failed.`,
        variables: { i, 'nums[i]': nums[i], complement, map: { ...map } },
        visualization: makeViz(currentHighlights, currentLabels, getMapEntries()),
      });

      map[nums[i]] = i;

      steps.push({
        line: 7,
        explanation: `Add nums[${i}] = ${nums[i]} to map with index ${i}.`,
        variables: { i, 'nums[i]': nums[i], map: { ...map } },
        visualization: makeViz(
          { ...currentHighlights, [i]: 'visited' },
          currentLabels,
          getMapEntries()
        ),
      });
    }

    // No pair found
    steps.push({
      line: 8,
      explanation: 'Iterated through entire array. No two numbers sum to the target.',
      variables: { target, result: [-1, -1] },
      visualization: makeViz({}, {}, getMapEntries()),
    });

    return steps;
  },
};

export default pairSumUnsorted;
