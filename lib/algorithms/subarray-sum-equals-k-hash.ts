import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarraySumEqualsKHash: AlgorithmDefinition = {
  id: 'subarray-sum-equals-k-hash',
  title: 'Subarray Sum Equals K (Hash Map)',
  leetcodeNumber: 560,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Count the number of subarrays whose elements sum to k. Uses prefix sums stored in a hash map: for each index, check if (prefixSum - k) exists in the map, meaning a subarray ending here has sum k. Achieves O(n) time complexity.',
  tags: ['hash map', 'prefix sum', 'subarray', 'counting'],

  code: {
    pseudocode: `function subarraySum(nums, k):
  map = {0: 1}
  prefixSum = 0
  count = 0
  for num in nums:
    prefixSum += num
    count += map.get(prefixSum - k, 0)
    map[prefixSum] = map.get(prefixSum, 0) + 1
  return count`,

    python: `def subarraySum(nums: list[int], k: int) -> int:
    prefix = {0: 1}
    total = count = 0
    for num in nums:
        total += num
        count += prefix.get(total - k, 0)
        prefix[total] = prefix.get(total, 0) + 1
    return count`,

    javascript: `function subarraySum(nums, k) {
  const prefix = new Map([[0, 1]]);
  let total = 0, count = 0;
  for (const num of nums) {
    total += num;
    count += prefix.get(total - k) || 0;
    prefix.set(total, (prefix.get(total) || 0) + 1);
  }
  return count;
}`,

    java: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefix = new HashMap<>();
    prefix.put(0, 1);
    int total = 0, count = 0;
    for (int num : nums) {
        total += num;
        count += prefix.getOrDefault(total - k, 0);
        prefix.merge(total, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [1, 1, 1, 2, 3],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 1, 2, 3],
      placeholder: '1,1,1,2,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target Sum k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const prefixMap: Record<number, number> = { 0: 1 };
    let prefixSum = 0;
    let count = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize prefix map with {0: 1} representing an empty prefix sum of 0 seen once. This handles subarrays starting from index 0.',
      variables: { prefixMap: '{0:1}', prefixSum: 0, count: 0, k },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      prefixSum += nums[i];

      steps.push({
        line: 5,
        explanation: `Index ${i}: nums[${i}]=${nums[i]}. prefixSum = ${prefixSum}. Looking for prefixSum - k = ${prefixSum} - ${k} = ${prefixSum - k} in map.`,
        variables: { i, 'nums[i]': nums[i], prefixSum, need: prefixSum - k, count, prefixMap: JSON.stringify(prefixMap) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `ps=${prefixSum}` }),
      });

      const matches = prefixMap[prefixSum - k] || 0;
      if (matches > 0) {
        count += matches;
        steps.push({
          line: 6,
          explanation: `Found ${matches} prefix(es) equal to ${prefixSum - k}. Each represents a subarray ending at index ${i} with sum ${k}. count = ${count}.`,
          variables: { prefixSum, need: prefixSum - k, matches, count },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${matches}` }),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `No prefix sum of ${prefixSum - k} in map. No new subarrays found ending here. count = ${count}.`,
          variables: { prefixSum, need: prefixSum - k, matches: 0, count },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: 'miss' }),
        });
      }

      prefixMap[prefixSum] = (prefixMap[prefixSum] || 0) + 1;
      steps.push({
        line: 7,
        explanation: `Store prefixSum ${prefixSum} in map. map[${prefixSum}] = ${prefixMap[prefixSum]}.`,
        variables: { prefixSum, mapEntry: prefixMap[prefixSum], prefixMap: JSON.stringify(prefixMap), count },
        visualization: makeViz({ [i]: 'visited' }, { [i]: `stored` }),
      });
    }

    steps.push({
      line: 8,
      explanation: `All elements processed. Total subarrays with sum ${k} = ${count}.`,
      variables: { result: count },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default subarraySumEqualsKHash;
