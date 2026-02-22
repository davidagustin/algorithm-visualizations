import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxNumberOfKSumPairs: AlgorithmDefinition = {
  id: 'max-number-of-k-sum-pairs',
  title: 'Max Number of K-Sum Pairs',
  leetcodeNumber: 1679,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array and integer k, repeatedly remove pairs that sum to k. Maximize the number of operations. Use a hash map to count frequencies: for each number, check if its complement (k - num) exists in the map. If so, form a pair and decrement both counts.',
  tags: ['hash map', 'array', 'greedy', 'two sum'],

  code: {
    pseudocode: `function maxOperations(nums, k):
  freq = {}
  for num in nums:
    freq[num] = freq.get(num, 0) + 1
  ops = 0
  for num in freq:
    comp = k - num
    if comp in freq:
      if num == comp:
        ops += freq[num] // 2
      else if num < comp:
        ops += min(freq[num], freq[comp])
  return ops`,

    python: `from collections import Counter
def maxOperations(nums: list[int], k: int) -> int:
    freq = Counter(nums)
    ops = 0
    for num in list(freq.keys()):
        comp = k - num
        if comp in freq:
            if num == comp:
                ops += freq[num] // 2
            elif num < comp:
                ops += min(freq[num], freq[comp])
    return ops`,

    javascript: `function maxOperations(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  let ops = 0;
  for (const [num, cnt] of freq) {
    const comp = k - num;
    if (freq.has(comp)) {
      if (num === comp) ops += Math.floor(cnt / 2);
      else if (num < comp) ops += Math.min(cnt, freq.get(comp));
    }
  }
  return ops;
}`,

    java: `public int maxOperations(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    int ops = 0;
    for (int num : new HashSet<>(freq.keySet())) {
        int comp = k - num;
        if (!freq.containsKey(comp)) continue;
        if (num == comp) ops += freq.get(num) / 2;
        else if (num < comp) ops += Math.min(freq.get(num), freq.get(comp));
    }
    return ops;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 3, 2, 5],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 3, 2, 5],
      placeholder: '1,2,3,4,3,2,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target Sum k',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target pair sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const freq: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build frequency map for all elements. Target sum k = ${k}.`,
      variables: { freq: '{}', k },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      freq[nums[i]] = (freq[nums[i]] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `nums[${i}]=${nums[i]}. freq[${nums[i]}] = ${freq[nums[i]]}.`,
        variables: { i, num: nums[i], freq: JSON.stringify(freq) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `f=${freq[nums[i]]}` }),
      });
    }

    let ops = 0;
    const seen = new Set<number>();

    steps.push({
      line: 4,
      explanation: `Frequency map: ${JSON.stringify(freq)}. Now pair each number with its complement.`,
      variables: { freq: JSON.stringify(freq), ops: 0 },
      visualization: makeViz({}, {}),
    });

    for (const numStr of Object.keys(freq)) {
      const num = Number(numStr);
      if (seen.has(num)) continue;
      const comp = k - num;

      if (comp in freq) {
        const idx1 = nums.indexOf(num);
        const idx2 = nums.indexOf(comp);

        if (num === comp) {
          const pairs = Math.floor(freq[num] / 2);
          ops += pairs;
          seen.add(num);
          steps.push({
            line: 8,
            explanation: `num=${num} pairs with itself (k=${k}, ${num}+${num}=${num+num}). freq[${num}]=${freq[num]}. Pairs = floor(${freq[num]}/2) = ${pairs}. ops = ${ops}.`,
            variables: { num, freq: freq[num], pairs, ops },
            visualization: makeViz({ [idx1 >= 0 ? idx1 : 0]: 'found' }, { [idx1 >= 0 ? idx1 : 0]: `x${pairs}` }),
          });
        } else if (num < comp) {
          const pairs = Math.min(freq[num], freq[comp]);
          ops += pairs;
          seen.add(num);
          seen.add(comp);
          steps.push({
            line: 10,
            explanation: `num=${num} + complement=${comp} = ${k}. freq[${num}]=${freq[num]}, freq[${comp}]=${freq[comp]}. Pairs = min(${freq[num]},${freq[comp]}) = ${pairs}. ops = ${ops}.`,
            variables: { num, comp, freqNum: freq[num], freqComp: freq[comp], pairs, ops },
            visualization: makeViz(
              { [idx1 >= 0 ? idx1 : 0]: 'found', [idx2 >= 0 ? idx2 : 0]: 'found' },
              { [idx1 >= 0 ? idx1 : 0]: `${num}`, [idx2 >= 0 ? idx2 : 0]: `${comp}` }
            ),
          });
        }
      } else {
        steps.push({
          line: 5,
          explanation: `num=${num}: complement ${comp} not in freq. No pairs possible.`,
          variables: { num, comp, freq: JSON.stringify(freq), ops },
          visualization: makeViz({ [nums.indexOf(num) >= 0 ? nums.indexOf(num) : 0]: 'comparing' }, {}),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Maximum number of k-sum pair operations = ${ops}.`,
      variables: { result: ops },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxNumberOfKSumPairs;
