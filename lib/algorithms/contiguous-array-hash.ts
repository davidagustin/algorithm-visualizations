import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const contiguousArrayHash: AlgorithmDefinition = {
  id: 'contiguous-array-hash',
  title: 'Contiguous Array (Equal 0s and 1s)',
  leetcodeNumber: 525,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Find the maximum length subarray with an equal number of 0s and 1s. Replace 0s with -1 and use prefix sums: when the same prefix sum appears again, the subarray between those indices has equal counts of 0s and 1s. Store first occurrences in a hash map.',
  tags: ['hash map', 'prefix sum', 'array', 'binary'],

  code: {
    pseudocode: `function findMaxLength(nums):
  map = {0: -1}
  prefixSum = 0
  maxLen = 0
  for i, num in enumerate(nums):
    prefixSum += 1 if num == 1 else -1
    if prefixSum in map:
      maxLen = max(maxLen, i - map[prefixSum])
    else:
      map[prefixSum] = i
  return maxLen`,

    python: `def findMaxLength(nums: list[int]) -> int:
    seen = {0: -1}
    total = maxLen = 0
    for i, n in enumerate(nums):
        total += 1 if n == 1 else -1
        if total in seen:
            maxLen = max(maxLen, i - seen[total])
        else:
            seen[total] = i
    return maxLen`,

    javascript: `function findMaxLength(nums) {
  const seen = new Map([[0, -1]]);
  let total = 0, maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    total += nums[i] === 1 ? 1 : -1;
    if (seen.has(total)) maxLen = Math.max(maxLen, i - seen.get(total));
    else seen.set(total, i);
  }
  return maxLen;
}`,

    java: `public int findMaxLength(int[] nums) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, -1);
    int total = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        total += nums[i] == 1 ? 1 : -1;
        if (seen.containsKey(total)) maxLen = Math.max(maxLen, i - seen.get(total));
        else seen.put(total, i);
    }
    return maxLen;
}`,
  },

  defaultInput: {
    nums: [0, 1, 0, 0, 1, 1, 0],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [0, 1, 0, 0, 1, 1, 0],
      placeholder: '0,1,0,0,1,1,0',
      helperText: 'Array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const seen: Record<number, number> = { 0: -1 };
    let prefixSum = 0;
    let maxLen = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize map with {0: -1} to handle subarrays starting from index 0. Treat 0 as -1 and 1 as +1 in the running sum.',
      variables: { seen: '{0:-1}', prefixSum: 0, maxLen: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const delta = nums[i] === 1 ? 1 : -1;
      prefixSum += delta;

      steps.push({
        line: 5,
        explanation: `i=${i}: nums[${i}]=${nums[i]} -> delta=${delta}. prefixSum = ${prefixSum}. Check if ${prefixSum} is in map.`,
        variables: { i, num: nums[i], delta, prefixSum, seen: JSON.stringify(seen), maxLen },
        visualization: makeViz({ [i]: 'active' }, { [i]: `ps=${prefixSum}` }),
      });

      if (prefixSum in seen) {
        const len = i - seen[prefixSum];
        const prevMaxLen = maxLen;
        maxLen = Math.max(maxLen, len);

        const start = seen[prefixSum] + 1;
        const hlMap: Record<number, string> = {};
        for (let k = start; k <= i; k++) hlMap[k] = 'found';

        steps.push({
          line: 7,
          explanation: `prefixSum ${prefixSum} was first seen at index ${seen[prefixSum]}. Subarray [${start}..${i}] has equal 0s and 1s. Length = ${len}. maxLen = max(${prevMaxLen}, ${len}) = ${maxLen}.`,
          variables: { prefixSum, firstSeen: seen[prefixSum], length: len, maxLen },
          visualization: makeViz(hlMap, { [start]: 'start', [i]: 'end' }),
        });
      } else {
        seen[prefixSum] = i;
        steps.push({
          line: 9,
          explanation: `prefixSum ${prefixSum} not yet seen. Store map[${prefixSum}] = ${i}.`,
          variables: { prefixSum, i, seen: JSON.stringify(seen), maxLen },
          visualization: makeViz({ [i]: 'visited' }, { [i]: 'stored' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum length of subarray with equal 0s and 1s = ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default contiguousArrayHash;
