import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kSumSubarrays: AlgorithmDefinition = {
  id: 'k-sum-subarrays',
  title: 'K-Sum Subarrays (Subarray Sum Equals K)',
  leetcodeNumber: 560,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of contiguous subarrays whose elements sum to k. Use a running prefix sum and a hash map that stores how many times each prefix sum has occurred. For each new prefix sum, check if (prefixSum - k) exists in the map; if so, those are valid subarrays ending here. O(n) time and space.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function subarraySum(nums, k):
  count = 0, prefixSum = 0
  map = {0: 1}
  for each num in nums:
    prefixSum += num
    if (prefixSum - k) in map:
      count += map[prefixSum - k]
    map[prefixSum] = map.get(prefixSum, 0) + 1
  return count`,
    python: `def subarraySum(nums, k):
    count = prefix_sum = 0
    freq = {0: 1}
    for num in nums:
        prefix_sum += num
        count += freq.get(prefix_sum - k, 0)
        freq[prefix_sum] = freq.get(prefix_sum, 0) + 1
    return count`,
    javascript: `function subarraySum(nums, k) {
  let count = 0, prefixSum = 0;
  const map = new Map([[0, 1]]);
  for (const num of nums) {
    prefixSum += num;
    count += map.get(prefixSum - k) || 0;
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
    java: `public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1);
    for (int num : nums) {
        prefixSum += num;
        count += map.getOrDefault(prefixSum - k, 0);
        map.put(prefixSum, map.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}`,
  },
  defaultInput: { nums: [1, 1, 1], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 1],
      placeholder: '1,1,1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target Sum (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      mapEntries: Map<number, number>,
      extraAux?: { key: string; value: string }[],
    ): ArrayVisualization => {
      const entries: { key: string; value: string }[] = [];
      mapEntries.forEach((v, key) => {
        entries.push({ key: `sum=${key}`, value: `count=${v}` });
      });
      if (extraAux) entries.push(...extraAux);
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: { label: 'Prefix Sum Map', entries },
      };
    };

    const map = new Map<number, number>([[0, 1]]);
    let count = 0;
    let prefixSum = 0;

    steps.push({
      line: 1,
      explanation: `Count subarrays with sum ${k} in [${nums.join(', ')}]. Initialize prefixSum=0, count=0, map={0:1}.`,
      variables: { k, prefixSum, count },
      visualization: makeViz({}, {}, map),
    });

    for (let i = 0; i < n; i++) {
      prefixSum += nums[i];

      const hl: Record<number, string> = {};
      for (let j = 0; j <= i; j++) hl[j] = 'active';

      steps.push({
        line: 5,
        explanation: `Process nums[${i}]=${nums[i]}. prefixSum = ${prefixSum - nums[i]} + ${nums[i]} = ${prefixSum}. Check if (${prefixSum} - ${k}) = ${prefixSum - k} is in map.`,
        variables: { i, num: nums[i], prefixSum, 'prefixSum-k': prefixSum - k },
        visualization: makeViz(hl, { [i]: `ps=${prefixSum}` }, map,
          [{ key: `Need sum=${prefixSum - k}?`, value: map.has(prefixSum - k) ? `Yes (${map.get(prefixSum - k)})` : 'No' }]),
      });

      const found = map.get(prefixSum - k) || 0;
      if (found > 0) {
        count += found;

        steps.push({
          line: 6,
          explanation: `Found! map[${prefixSum - k}] = ${found}. These are ${found} subarray(s) ending at index ${i} with sum ${k}. count = ${count}.`,
          variables: { count, found, 'prefixSum-k': prefixSum - k },
          visualization: makeViz(
            { ...hl, [i]: 'found' },
            { [i]: `+${found}` },
            map,
            [{ key: 'Subarrays found', value: String(count) }],
          ),
        });
      }

      map.set(prefixSum, (map.get(prefixSum) || 0) + 1);

      steps.push({
        line: 7,
        explanation: `Add prefixSum ${prefixSum} to map. map[${prefixSum}] = ${map.get(prefixSum)}.`,
        variables: { prefixSum, mapUpdate: `${prefixSum} -> ${map.get(prefixSum)}` },
        visualization: makeViz(hl, { [i]: `ps=${prefixSum}` }, map,
          [{ key: 'Total count', value: String(count) }]),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done! Total subarrays with sum ${k}: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        map,
        [{ key: 'Answer', value: String(count) }],
      ),
    });

    return steps;
  },
};

export default kSumSubarrays;
