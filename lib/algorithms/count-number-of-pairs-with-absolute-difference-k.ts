import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNumberOfPairsWithAbsoluteDifferenceK: AlgorithmDefinition = {
  id: 'count-number-of-pairs-with-absolute-difference-k',
  title: 'Count Number of Pairs With Absolute Difference K',
  leetcodeNumber: 2006,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array nums and an integer k, return the number of pairs (i, j) where i < j and |nums[i] - nums[j]| == k. Use a hash map to store seen values; for each element check if element+k or element-k has been seen before.',
  tags: ['hash map', 'array', 'counting', 'absolute difference'],

  code: {
    pseudocode: `function countKDifference(nums, k):
  seen = {}
  count = 0
  for v in nums:
    count += seen.get(v-k, 0)
    count += seen.get(v+k, 0) if k != 0 else 0
    seen[v] = seen.get(v, 0) + 1
  return count`,
    python: `def countKDifference(nums, k):
    seen = {}
    count = 0
    for v in nums:
        count += seen.get(v - k, 0)
        if k != 0:
            count += seen.get(v + k, 0)
        seen[v] = seen.get(v, 0) + 1
    return count`,
    javascript: `function countKDifference(nums, k) {
  const seen = new Map();
  let count = 0;
  for (const v of nums) {
    count += seen.get(v - k) || 0;
    if (k !== 0) count += seen.get(v + k) || 0;
    seen.set(v, (seen.get(v) || 0) + 1);
  }
  return count;
}`,
    java: `public int countKDifference(int[] nums, int k) {
    Map<Integer,Integer> seen = new HashMap<>();
    int count = 0;
    for (int v : nums) {
        count += seen.getOrDefault(v-k, 0);
        if (k != 0) count += seen.getOrDefault(v+k, 0);
        seen.merge(v, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 1],
    k: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 2, 1],
      placeholder: '1,2,2,1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Required absolute difference',
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

    const seen = new Map<number, number>();
    let count = 0;

    steps.push({
      line: 1,
      explanation: `Initialize seen map and count=0. Looking for pairs with |diff|=${k}.`,
      variables: { k, count, seen: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const v = nums[i];
      const fromBelow = seen.get(v - k) || 0;
      const fromAbove = k !== 0 ? (seen.get(v + k) || 0) : 0;
      const newPairs = fromBelow + fromAbove;

      steps.push({
        line: 4,
        explanation: `v=${v}: check seen[${v - k}]=${fromBelow} (v-k pairs) + seen[${v + k}]=${fromAbove} (v+k pairs) = ${newPairs} new pairs.`,
        variables: { i, v, fromBelow, fromAbove, newPairs, count: count + newPairs },
        visualization: makeViz(
          { [i]: newPairs > 0 ? 'found' : 'active' },
          { [i]: `+${newPairs}` }
        ),
      });

      count += newPairs;
      seen.set(v, (seen.get(v) || 0) + 1);

      steps.push({
        line: 7,
        explanation: `Updated count=${count}. Added v=${v} to seen (seen[${v}]=${seen.get(v)}).`,
        variables: { count, [`seen[${v}]`]: seen.get(v) },
        visualization: makeViz({ [i]: 'sorted' }, { [i]: `c=${count}` }),
      });
    }

    steps.push({
      line: 8,
      explanation: `Total pairs with absolute difference ${k}: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default countNumberOfPairsWithAbsoluteDifferenceK;
