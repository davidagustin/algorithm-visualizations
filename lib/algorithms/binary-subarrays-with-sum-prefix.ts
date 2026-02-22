import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const binarySubarraysWithSumPrefix: AlgorithmDefinition = {
  id: 'binary-subarrays-with-sum-prefix',
  title: 'Binary Subarrays With Sum (Prefix Method)',
  leetcodeNumber: 930,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of non-empty subarrays of a binary array that sum to a target goal. Apply the prefix sum technique: maintain a frequency map of prefix sums. At each index, the count of valid subarrays ending here equals freq[prefixSum - goal]. This is the same approach as Subarray Sum Equals K applied to binary arrays.',
  tags: ['prefix sum', 'hash map', 'binary array', 'sliding window'],

  code: {
    pseudocode: `function numSubarraysWithSum(nums, goal):
  count = 0, prefixSum = 0
  freq = {0: 1}
  for num in nums:
    prefixSum += num
    count += freq.get(prefixSum - goal, 0)
    freq[prefixSum]++
  return count`,

    python: `def numSubarraysWithSum(nums, goal):
    count = 0
    prefix_sum = 0
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
    count += freq.get(prefixSum - goal) || 0;
    freq.set(prefixSum, (freq.get(prefixSum) || 0) + 1);
  }
  return count;
}`,

    java: `public int numSubarraysWithSum(int[] nums, int goal) {
    int count = 0, prefixSum = 0;
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);
    for (int num : nums) {
        prefixSum += num;
        count += freq.getOrDefault(prefixSum - goal, 0);
        freq.merge(prefixSum, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [1, 0, 1, 0, 1],
    goal: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1],
      placeholder: '1,0,1,0,1',
      helperText: 'Comma-separated 0s and 1s',
    },
    {
      name: 'goal',
      label: 'Goal Sum',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target sum for subarrays',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const goal = input.goal as number;
    const steps: AlgorithmStep[] = [];
    const freq = new Map<number, number>([[0, 1]]);
    let prefixSum = 0;
    let count = 0;

    steps.push({
      line: 1,
      explanation: `Initialize: count=0, prefixSum=0, freq={0:1}. Binary array: [${nums.join(', ')}]. Goal sum=${goal}.`,
      variables: { goal, prefixSum, count, freq: '{0:1}' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    for (let i = 0; i < nums.length; i++) {
      prefixSum += nums[i];
      const need = prefixSum - goal;
      const matches = freq.get(need) || 0;
      count += matches;

      steps.push({
        line: 4,
        explanation: `i=${i}, nums[i]=${nums[i]}. prefixSum=${prefixSum}. Need freq[${prefixSum}-${goal}]=freq[${need}]=${matches}. count=${count}.`,
        variables: { i, 'nums[i]': nums[i], prefixSum, need, matches, count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: matches > 0 ? 'found' : 'active' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j === i ? `ps=${prefixSum}` : `${v}`])),
        },
      });

      if (matches > 0) {
        steps.push({
          line: 5,
          explanation: `Found ${matches} subarray(s) ending at index ${i} with sum=${goal}. Cumulative count=${count}.`,
          variables: { subarraysEndingHere: matches, count },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'found' },
            labels: Object.fromEntries(nums.map((_, j) => [j, j === i ? `+${matches}` : ''])),
          },
        });
      }

      freq.set(prefixSum, (freq.get(prefixSum) || 0) + 1);

      steps.push({
        line: 6,
        explanation: `Update freq[${prefixSum}]=${freq.get(prefixSum)}. Total count so far: ${count}.`,
        variables: { prefixSum, 'freq[prefixSum]': freq.get(prefixSum), count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'visited' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j <= i ? `${v}` : `${v}`])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Done. Total subarrays with sum=${goal}: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: { 0: `Result: ${count}` },
      },
    });

    return steps;
  },
};

export default binarySubarraysWithSumPrefix;
