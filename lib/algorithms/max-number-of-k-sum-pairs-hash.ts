import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxNumberOfKSumPairsHash: AlgorithmDefinition = {
  id: 'max-number-of-k-sum-pairs-hash',
  title: 'Max Number of K-Sum Pairs (Hash Map)',
  leetcodeNumber: 1679,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array nums and an integer k, find the maximum number of pairs (i, j) where i != j and nums[i] + nums[j] == k. Each element can only be used once. Use a frequency hash map: for each element, check if complement (k - element) exists, and if so, form a pair and decrement both counts.',
  tags: ['hash map', 'array', 'two sum', 'greedy'],

  code: {
    pseudocode: `function maxOperations(nums, k):
  freq = {}
  ops = 0
  for n in nums:
    comp = k - n
    if freq.get(comp, 0) > 0:
      ops += 1
      freq[comp] -= 1
    else:
      freq[n] = freq.get(n, 0) + 1
  return ops`,
    python: `def maxOperations(nums, k):
    freq = {}
    ops = 0
    for n in nums:
        comp = k - n
        if freq.get(comp, 0) > 0:
            ops += 1
            freq[comp] -= 1
        else:
            freq[n] = freq.get(n, 0) + 1
    return ops`,
    javascript: `function maxOperations(nums, k) {
  const freq = new Map();
  let ops = 0;
  for (const n of nums) {
    const comp = k - n;
    if (freq.get(comp) > 0) {
      ops++;
      freq.set(comp, freq.get(comp) - 1);
    } else {
      freq.set(n, (freq.get(n)||0)+1);
    }
  }
  return ops;
}`,
    java: `public int maxOperations(int[] nums, int k) {
    Map<Integer,Integer> freq = new HashMap<>();
    int ops = 0;
    for (int n : nums) {
        int comp = k - n;
        if (freq.getOrDefault(comp,0) > 0) {
            ops++;
            freq.merge(comp, -1, Integer::sum);
        } else {
            freq.merge(n, 1, Integer::sum);
        }
    }
    return ops;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'K',
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

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    const freq = new Map<number, number>();
    let ops = 0;

    steps.push({
      line: 1,
      explanation: `Initialize frequency map and ops=0. Looking for pairs summing to k=${k}.`,
      variables: { k, ops, freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const comp = k - n;
      const compCount = freq.get(comp) || 0;

      if (compCount > 0) {
        ops++;
        freq.set(comp, compCount - 1);

        steps.push({
          line: 5,
          explanation: `nums[${i}]=${n}: complement=${comp} found in map (count was ${compCount}). Form a pair! ops=${ops}. freq[${comp}] -> ${compCount - 1}`,
          variables: { i, value: n, complement: comp, ops },
          visualization: makeViz({ [i]: 'found' }, { [i]: `pair!+${comp}` }),
        });
      } else {
        freq.set(n, (freq.get(n) || 0) + 1);

        steps.push({
          line: 8,
          explanation: `nums[${i}]=${n}: complement=${comp} not in map. Add ${n} to freq. freq[${n}]=${freq.get(n)}`,
          variables: { i, value: n, complement: comp, [`freq[${n}]`]: freq.get(n), ops },
          visualization: makeViz({ [i]: 'active' }, { [i]: `+${n}` }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Maximum k-sum pairs = ${ops}.`,
      variables: { result: ops },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default maxNumberOfKSumPairsHash;
