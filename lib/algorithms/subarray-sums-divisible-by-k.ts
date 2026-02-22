import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const subarraySumsDivisibleByK: AlgorithmDefinition = {
  id: 'subarray-sums-divisible-by-k',
  title: 'Subarray Sums Divisible by K',
  leetcodeNumber: 974,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count the number of non-empty subarrays whose sum is divisible by k. Use prefix sums mod k: two indices i and j give a subarray sum divisible by k if and only if prefix[i] % k == prefix[j] % k. Count pairs of equal remainders using a frequency map. Handle negative remainders by adding k before taking mod.',
  tags: ['prefix sum', 'hash map', 'modulo', 'counting'],

  code: {
    pseudocode: `function subarraysDivByK(nums, k):
  freq = {0: 1}, prefixMod = 0, count = 0
  for num in nums:
    prefixMod = ((prefixMod + num) % k + k) % k
    count += freq.get(prefixMod, 0)
    freq[prefixMod]++
  return count`,

    python: `def subarraysDivByK(nums, k):
    freq = {0: 1}
    prefix_mod = 0
    count = 0
    for num in nums:
        prefix_mod = (prefix_mod + num) % k
        if prefix_mod < 0:
            prefix_mod += k
        count += freq.get(prefix_mod, 0)
        freq[prefix_mod] = freq.get(prefix_mod, 0) + 1
    return count`,

    javascript: `function subarraysDivByK(nums, k) {
  const freq = new Map([[0, 1]]);
  let prefixMod = 0, count = 0;
  for (const num of nums) {
    prefixMod = ((prefixMod + num) % k + k) % k;
    count += freq.get(prefixMod) || 0;
    freq.set(prefixMod, (freq.get(prefixMod) || 0) + 1);
  }
  return count;
}`,

    java: `public int subarraysDivByK(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);
    int prefixMod = 0, count = 0;
    for (int num : nums) {
        prefixMod = ((prefixMod + num) % k + k) % k;
        count += freq.getOrDefault(prefixMod, 0);
        freq.merge(prefixMod, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [4, 5, 0, -2, -3, 1],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 5, 0, -2, -3, 1],
      placeholder: '4,5,0,-2,-3,1',
      helperText: 'Comma-separated integers (may be negative)',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Divisor',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const freq = new Map<number, number>([[0, 1]]);
    let prefixMod = 0;
    let count = 0;

    steps.push({
      line: 1,
      explanation: `Initialize freq={0:1}, prefixMod=0, count=0. Counting subarrays divisible by k=${k}.`,
      variables: { k, prefixMod, count, freq: '{0:1}' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    for (let i = 0; i < nums.length; i++) {
      const prev = prefixMod;
      prefixMod = ((prefixMod + nums[i]) % k + k) % k;
      const matches = freq.get(prefixMod) || 0;
      count += matches;

      steps.push({
        line: 3,
        explanation: `i=${i}, nums[i]=${nums[i]}. prefixMod=((${prev}+${nums[i]})%${k}+${k})%${k}=${prefixMod}. freq[${prefixMod}]=${matches} existing pairs. count=${count}.`,
        variables: { i, 'nums[i]': nums[i], prev, prefixMod, matches, count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: matches > 0 ? 'found' : 'active' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j === i ? `mod=${prefixMod}` : `${v}`])),
        },
      });

      freq.set(prefixMod, (freq.get(prefixMod) || 0) + 1);

      steps.push({
        line: 5,
        explanation: `freq[${prefixMod}] updated to ${freq.get(prefixMod)}. Running count = ${count}.`,
        variables: { 'freq[mod]': freq.get(prefixMod), count },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'visited' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j <= i ? `mod${j}=${((nums.slice(0, j + 1).reduce((a, b) => a + b, 0)) % k + k) % k}` : `${v}`])),
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `Total subarrays with sum divisible by ${k}: ${count}.`,
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

export default subarraySumsDivisibleByK;
