import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const subarraySumEqualsK: AlgorithmDefinition = {
  id: 'subarray-sum-equals-k',
  title: 'Subarray Sum Equals K',
  leetcodeNumber: 560,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of continuous subarrays whose sum equals k. Use a prefix sum with a hash map: at each index i, compute prefix[i]. The number of subarrays ending at i with sum k equals the count of previous prefixes equal to prefix[i] - k. Store each prefix sum count in the map.',
  tags: ['prefix sum', 'hash map', 'subarray', 'counting'],

  code: {
    pseudocode: `function subarraySum(nums, k):
  count = 0, prefixSum = 0
  map = {0: 1}
  for each num in nums:
    prefixSum += num
    count += map.get(prefixSum - k, 0)
    map[prefixSum] += 1
  return count`,

    python: `def subarraySum(nums, k):
    count = 0
    prefix_sum = 0
    freq = {0: 1}
    for num in nums:
        prefix_sum += num
        count += freq.get(prefix_sum - k, 0)
        freq[prefix_sum] = freq.get(prefix_sum, 0) + 1
    return count`,

    javascript: `function subarraySum(nums, k) {
  let count = 0, prefixSum = 0;
  const freq = new Map([[0, 1]]);
  for (const num of nums) {
    prefixSum += num;
    count += freq.get(prefixSum - k) || 0;
    freq.set(prefixSum, (freq.get(prefixSum) || 0) + 1);
  }
  return count;
}`,

    java: `public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);
    for (int num : nums) {
        prefixSum += num;
        count += freq.getOrDefault(prefixSum - k, 0);
        freq.merge(prefixSum, 1, Integer::sum);
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
    const freq = new Map<number, number>([[0, 1]]);
    let count = 0;
    let prefixSum = 0;

    steps.push({
      line: 1,
      explanation: `Initialize: count=0, prefixSum=0, freq={0:1}. We need subarrays summing to k=${k}.`,
      variables: { count, prefixSum, k, freq: '{0:1}' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    for (let i = 0; i < nums.length; i++) {
      prefixSum += nums[i];
      const need = prefixSum - k;
      const found = freq.get(need) || 0;
      count += found;

      steps.push({
        line: 4,
        explanation: `i=${i}, nums[i]=${nums[i]}. prefixSum=${prefixSum}. Need prefix ${prefixSum}-${k}=${need}. Found ${found} time(s) in map. count=${count}.`,
        variables: { i, 'nums[i]': nums[i], prefixSum, need, found, count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: found > 0 ? 'found' : 'active' },
          labels: Object.fromEntries(nums.map((v, j) => [j,
            j < i ? 'visited' :
            j === i ? `ps=${prefixSum}` :
            `${v}`
          ])),
        },
      });

      freq.set(prefixSum, (freq.get(prefixSum) || 0) + 1);

      const freqStr = JSON.stringify(Object.fromEntries(freq));
      steps.push({
        line: 6,
        explanation: `Update freq map: freq[${prefixSum}]=${freq.get(prefixSum)}. Map: ${freqStr}.`,
        variables: { prefixSum, 'freq[prefixSum]': freq.get(prefixSum), count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'sorted' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j <= i ? `ps${j}=${nums.slice(0, j + 1).reduce((a, b) => a + b, 0)}` : `${v}`])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Done. Total subarrays with sum=${k}: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: { 0: `Result: ${count} subarrays` },
      },
    });

    return steps;
  },
};

export default subarraySumEqualsK;
