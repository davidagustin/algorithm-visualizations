import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfGoodPairs: AlgorithmDefinition = {
  id: 'number-of-good-pairs',
  title: 'Number of Good Pairs',
  leetcodeNumber: 1512,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array nums, return the number of good pairs (i, j) where nums[i] == nums[j] and i < j. For each new element, the number of new good pairs equals how many times this element has been seen before. Track frequencies with a hash map.',
  tags: ['hash map', 'array', 'counting', 'math'],

  code: {
    pseudocode: `function numIdenticalPairs(nums):
  count = 0
  freq = {}
  for n in nums:
    count += freq.get(n, 0)
    freq[n] = freq.get(n, 0) + 1
  return count`,
    python: `def numIdenticalPairs(nums):
    count = 0
    freq = {}
    for n in nums:
        count += freq.get(n, 0)
        freq[n] = freq.get(n, 0) + 1
    return count`,
    javascript: `function numIdenticalPairs(nums) {
  let count = 0;
  const freq = {};
  for (const n of nums) {
    count += freq[n] || 0;
    freq[n] = (freq[n] || 0) + 1;
  }
  return count;
}`,
    java: `public int numIdenticalPairs(int[] nums) {
    int count = 0;
    Map<Integer,Integer> freq = new HashMap<>();
    for (int n : nums) {
        count += freq.getOrDefault(n, 0);
        freq.merge(n, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 1, 1, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1, 1, 3],
      placeholder: '1,2,3,1,1,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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

    const freq: Record<number, number> = {};
    let count = 0;

    steps.push({
      line: 1,
      explanation: 'Initialize count=0 and empty frequency map.',
      variables: { count, freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const prevSeen = freq[n] || 0;
      const newPairs = prevSeen;

      steps.push({
        line: 4,
        explanation: `i=${i}, value=${n}: seen ${prevSeen} times before. Adds ${newPairs} new good pairs. count = ${count} + ${newPairs} = ${count + newPairs}`,
        variables: { i, value: n, prevSeen, newPairs, count: count + newPairs },
        visualization: makeViz(
          { [i]: newPairs > 0 ? 'found' : 'active' },
          { [i]: `+${newPairs}` }
        ),
      });

      count += newPairs;
      freq[n] = prevSeen + 1;

      steps.push({
        line: 5,
        explanation: `freq[${n}] updated to ${freq[n]}. Total count = ${count}.`,
        variables: { [`freq[${n}]`]: freq[n], count },
        visualization: makeViz({ [i]: 'sorted' }, { [i]: `cnt=${count}` }),
      });
    }

    steps.push({
      line: 6,
      explanation: `All elements processed. Total good pairs = ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nums.map((_, i) => [i, `${nums[i]}`]))
      ),
    });

    return steps;
  },
};

export default numberOfGoodPairs;
