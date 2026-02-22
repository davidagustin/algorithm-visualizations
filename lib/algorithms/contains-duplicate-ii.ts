import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const containsDuplicateIi: AlgorithmDefinition = {
  id: 'contains-duplicate-ii',
  title: 'Contains Duplicate II',
  leetcodeNumber: 219,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array and an integer k, return true if there are two distinct indices i and j such that nums[i] == nums[j] and abs(i - j) <= k. Use a hash map to track the last seen index of each value.',
  tags: ['hash map', 'array', 'sliding window', 'duplicates'],

  code: {
    pseudocode: `function containsNearbyDuplicate(nums, k):
  indexMap = {}
  for i from 0 to length(nums)-1:
    val = nums[i]
    if val in indexMap and i - indexMap[val] <= k:
      return true
    indexMap[val] = i
  return false`,

    python: `def containsNearbyDuplicate(nums: list[int], k: int) -> bool:
    index_map = {}
    for i, val in enumerate(nums):
        if val in index_map and i - index_map[val] <= k:
            return True
        index_map[val] = i
    return False`,

    javascript: `function containsNearbyDuplicate(nums, k) {
  const indexMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    if (indexMap.has(val) && i - indexMap.get(val) <= k) {
      return true;
    }
    indexMap.set(val, i);
  }
  return false;
}`,

    java: `public boolean containsNearbyDuplicate(int[] nums, int k) {
    Map<Integer, Integer> indexMap = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int val = nums[i];
        if (indexMap.containsKey(val) && i - indexMap.get(val) <= k) {
            return true;
        }
        indexMap.put(val, i);
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 1, 2, 3],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1, 2, 3],
      placeholder: '1,2,3,1,2,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'k (max index distance)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum allowed index difference',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const indexMap = new Map<number, number>();

    steps.push({
      line: 1,
      explanation: `Start with an empty index map. We will track the last seen index of each value and check if any duplicate is within distance k=${k}.`,
      variables: { k, indexMap: '{}' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      const highlights: Record<number, string> = { [i]: 'active' };
      const labels: Record<number, string> = { [i]: `i=${i}` };

      if (indexMap.has(val)) {
        const prevIdx = indexMap.get(val)!;
        const dist = i - prevIdx;
        highlights[prevIdx] = 'comparing';
        labels[prevIdx] = `prev`;

        if (dist <= k) {
          highlights[i] = 'found';
          highlights[prevIdx] = 'found';
          steps.push({
            line: 5,
            explanation: `nums[${i}]=${val} was seen before at index ${prevIdx}. Distance = ${dist} <= k=${k}. Return true!`,
            variables: { i, val, prevIdx, dist, k, result: true },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights,
              labels,
            },
          });
          return steps;
        } else {
          steps.push({
            line: 5,
            explanation: `nums[${i}]=${val} was seen at index ${prevIdx}, but distance ${dist} > k=${k}. Update map and continue.`,
            variables: { i, val, prevIdx, dist, k },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights,
              labels,
            },
          });
        }
      } else {
        steps.push({
          line: 3,
          explanation: `nums[${i}]=${val} not seen before. Record index ${i} in map.`,
          variables: { i, val, k },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights,
            labels,
          },
        });
      }

      indexMap.set(val, i);
    }

    steps.push({
      line: 7,
      explanation: 'No nearby duplicates found within distance k. Return false.',
      variables: { result: false },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default containsDuplicateIi;
