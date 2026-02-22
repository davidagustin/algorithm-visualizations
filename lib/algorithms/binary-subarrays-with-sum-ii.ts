import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binarySubarraysWithSumII: AlgorithmDefinition = {
  id: 'binary-subarrays-with-sum-ii',
  title: 'Binary Subarrays With Sum II',
  leetcodeNumber: 930,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count binary subarrays with sum exactly equal to goal. Use prefix sum with a frequency map: for each prefix sum, count how many times (prefixSum - goal) has appeared. A subarray [i..j] sums to goal iff prefixSum[j] - prefixSum[i-1] = goal. O(n) time.',
  tags: ['Prefix Sum', 'Hash Map', 'Array', 'Binary Array'],
  code: {
    pseudocode: `function numSubarraysWithSum(nums, goal):
  count = 0, prefixSum = 0
  freq = {0: 1}
  for num in nums:
    prefixSum += num
    count += freq.get(prefixSum - goal, 0)
    freq[prefixSum] = freq.get(prefixSum, 0) + 1
  return count`,
    python: `def numSubarraysWithSum(nums: list[int], goal: int) -> int:
    count = prefix_sum = 0
    freq = {0: 1}
    for num in nums:
        prefix_sum += num
        count += freq.get(prefix_sum - goal, 0)
        freq[prefix_sum] = freq.get(prefix_sum, 0) + 1
    return count`,
    javascript: `function numSubarraysWithSum(nums, goal) {
  let count = 0, prefixSum = 0;
  const freq = new Map([[0, 1]]);
  for (const num of nums) {
    prefixSum += num;
    count += freq.get(prefixSum - goal) ?? 0;
    freq.set(prefixSum, (freq.get(prefixSum) ?? 0) + 1);
  }
  return count;
}`,
    java: `public int numSubarraysWithSum(int[] nums, int goal) {
    int count = 0, prefixSum = 0;
    Map<Integer,Integer> freq = new HashMap<>();
    freq.put(0, 1);
    for (int num : nums) {
        prefixSum += num;
        count += freq.getOrDefault(prefixSum - goal, 0);
        freq.put(prefixSum, freq.getOrDefault(prefixSum, 0) + 1);
    }
    return count;
}`,
  },
  defaultInput: { nums: [1, 0, 1, 0, 1], goal: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1],
      placeholder: '1,0,1,0,1',
      helperText: 'Array of 0s and 1s',
    },
    {
      name: 'goal',
      label: 'Goal',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const goal = input.goal as number;
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
      explanation: `Count binary subarrays with sum = ${goal}. nums = [${nums.join(', ')}]. Use prefix sum + freq map.`,
      variables: { goal, count, prefixSum },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefixSum += nums[i];
      const need = prefixSum - goal;
      const found = freq.get(need) ?? 0;

      steps.push({
        line: 4,
        explanation: `Index ${i}: nums[${i}]=${nums[i]}, prefixSum=${prefixSum}. Look for ps-goal=${need} in freq: ${found} time(s).`,
        variables: { i, prefixSum, need, found },
        visualization: makeViz(
          { [i]: found > 0 ? 'found' : 'active' },
          { [i]: `ps=${prefixSum}` },
        ),
      });

      if (found > 0) {
        count += found;
        steps.push({
          line: 5,
          explanation: `count += ${found}. New count = ${count}.`,
          variables: { count, found },
          visualization: makeViz({ [i]: 'found' }, { [i]: `+${found} cnt=${count}` }),
        });
      }

      freq.set(prefixSum, (freq.get(prefixSum) ?? 0) + 1);
    }

    steps.push({
      line: 7,
      explanation: `Done. Binary subarrays with sum ${goal}: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${count}` },
      ),
    });

    return steps;
  },
};

export default binarySubarraysWithSumII;
