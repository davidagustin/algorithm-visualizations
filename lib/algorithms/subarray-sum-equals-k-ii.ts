import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarraySumEqualsKII: AlgorithmDefinition = {
  id: 'subarray-sum-equals-k-ii',
  title: 'Subarray Sum Equals K II',
  leetcodeNumber: 560,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of contiguous subarrays whose sum equals k. Maintain a running prefix sum and a frequency map. For each index, check how many previous prefix sums equal (current - k); those subarrays end here and sum to k. O(n) time, O(n) space.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function subarraySum(nums, k):
  count = 0, prefixSum = 0
  freq = {0: 1}
  for num in nums:
    prefixSum += num
    count += freq.get(prefixSum - k, 0)
    freq[prefixSum] = freq.get(prefixSum, 0) + 1
  return count`,
    python: `def subarraySum(nums: list[int], k: int) -> int:
    count = prefix_sum = 0
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
    count += freq.get(prefixSum - k) ?? 0;
    freq.set(prefixSum, (freq.get(prefixSum) ?? 0) + 1);
  }
  return count;
}`,
    java: `public int subarraySum(int[] nums, int k) {
    int count = 0, prefixSum = 0;
    Map<Integer,Integer> freq = new HashMap<>();
    freq.put(0, 1);
    for (int num : nums) {
        prefixSum += num;
        count += freq.getOrDefault(prefixSum - k, 0);
        freq.put(prefixSum, freq.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}`,
  },
  defaultInput: { nums: [1, 2, 3, 2, 1], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 2, 1],
      placeholder: '1,2,3,2,1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target k',
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
    const n = nums.length;
    const freq = new Map<number, number>([[0, 1]]);
    let count = 0;
    let prefixSum = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Freq Map',
        entries: Array.from(freq.entries()).map(([s, c]) => ({ key: `ps=${s}`, value: `cnt=${c}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Count subarrays summing to k=${k} in [${nums.join(', ')}]. Initialize prefixSum=0, count=0, freq={0:1}.`,
      variables: { k, prefixSum, count },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefixSum += nums[i];
      const need = prefixSum - k;
      const found = freq.get(need) ?? 0;

      steps.push({
        line: 4,
        explanation: `Index ${i}: num=${nums[i]}, prefixSum=${prefixSum}. Need prefixSum-k=${need} in freq? ${found > 0 ? `Yes, ${found} time(s)` : 'No'}.`,
        variables: { i, num: nums[i], prefixSum, need, found },
        visualization: makeViz(
          { [i]: found > 0 ? 'found' : 'active' },
          { [i]: `ps=${prefixSum}` },
        ),
      });

      if (found > 0) {
        count += found;
        steps.push({
          line: 6,
          explanation: `Found ${found} subarray(s) ending at index ${i} with sum ${k}. count = ${count}.`,
          variables: { count, found },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${found}` }),
        });
      }

      freq.set(prefixSum, (freq.get(prefixSum) ?? 0) + 1);

      steps.push({
        line: 7,
        explanation: `Update freq[${prefixSum}] = ${freq.get(prefixSum)}.`,
        variables: { prefixSum, 'freq[ps]': freq.get(prefixSum) },
        visualization: makeViz({ [i]: 'visited' }, { [i]: `ps=${prefixSum}` }),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. Total subarrays with sum ${k}: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${count}` },
      ),
    });

    return steps;
  },
};

export default subarraySumEqualsKII;
