import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const contiguousArrayII: AlgorithmDefinition = {
  id: 'contiguous-array-ii',
  title: 'Contiguous Array II',
  leetcodeNumber: 525,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the maximum length subarray with an equal number of 0s and 1s. Replace 0 with -1, then the problem becomes finding the longest subarray with sum 0. Use a prefix sum + hash map: if prefix[i] was seen before at index j, subarray (j+1..i) has sum 0. O(n) time.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function findMaxLength(nums):
  maxLen = 0, prefixSum = 0
  map = {0: -1}   # prefixSum -> earliest index
  for i from 0 to n-1:
    prefixSum += (nums[i] == 1 ? 1 : -1)
    if prefixSum in map:
      maxLen = max(maxLen, i - map[prefixSum])
    else:
      map[prefixSum] = i
  return maxLen`,
    python: `def findMaxLength(nums: list[int]) -> int:
    max_len = prefix_sum = 0
    seen = {0: -1}
    for i, num in enumerate(nums):
        prefix_sum += 1 if num == 1 else -1
        if prefix_sum in seen:
            max_len = max(max_len, i - seen[prefix_sum])
        else:
            seen[prefix_sum] = i
    return max_len`,
    javascript: `function findMaxLength(nums) {
  let maxLen = 0, prefixSum = 0;
  const seen = new Map([[0, -1]]);
  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i] === 1 ? 1 : -1;
    if (seen.has(prefixSum)) {
      maxLen = Math.max(maxLen, i - seen.get(prefixSum));
    } else {
      seen.set(prefixSum, i);
    }
  }
  return maxLen;
}`,
    java: `public int findMaxLength(int[] nums) {
    int maxLen = 0, prefixSum = 0;
    Map<Integer,Integer> seen = new HashMap<>();
    seen.put(0, -1);
    for (int i = 0; i < nums.length; i++) {
        prefixSum += nums[i] == 1 ? 1 : -1;
        if (seen.containsKey(prefixSum))
            maxLen = Math.max(maxLen, i - seen.get(prefixSum));
        else
            seen.put(prefixSum, i);
    }
    return maxLen;
}`,
  },
  defaultInput: { nums: [0, 1, 0, 1, 1, 0, 0] },
  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [0, 1, 0, 1, 1, 0, 0],
      placeholder: '0,1,0,1,1,0,0',
      helperText: 'Array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const seen = new Map<number, number>([[0, -1]]);
    let maxLen = 0;
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
        label: 'Seen Map (ps -> idx)',
        entries: Array.from(seen.entries()).map(([s, idx]) => ({ key: `ps=${s}`, value: `idx=${idx}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Find max-length subarray with equal 0s and 1s in [${nums.join(', ')}]. Map 0→-1, 1→+1 and find longest subarray with sum 0.`,
      variables: { maxLen, prefixSum },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      const delta = nums[i] === 1 ? 1 : -1;
      prefixSum += delta;

      steps.push({
        line: 4,
        explanation: `Index ${i}: nums[${i}]=${nums[i]} (mapped to ${delta}), prefixSum = ${prefixSum}. Check if ${prefixSum} seen before.`,
        variables: { i, delta, prefixSum },
        visualization: makeViz({ [i]: 'active' }, { [i]: `ps=${prefixSum}` }),
      });

      if (seen.has(prefixSum)) {
        const prevIdx = seen.get(prefixSum)!;
        const len = i - prevIdx;
        if (len > maxLen) maxLen = len;

        steps.push({
          line: 6,
          explanation: `prefixSum=${prefixSum} seen at index ${prevIdx}. Subarray [${prevIdx + 1}..${i}] has equal 0s and 1s, length=${len}. maxLen=${maxLen}.`,
          variables: { prevIdx, len, maxLen },
          visualization: makeViz(
            Object.fromEntries(
              Array.from({ length: len }, (_, k) => [prevIdx + 1 + k, 'found']),
            ),
            { [prevIdx + 1]: 'start', [i]: `len=${len}` },
          ),
        });
      } else {
        seen.set(prefixSum, i);
        steps.push({
          line: 8,
          explanation: `prefixSum=${prefixSum} not seen. Record seen[${prefixSum}] = ${i}.`,
          variables: { prefixSum, 'seen[ps]': i },
          visualization: makeViz({ [i]: 'visited' }, { [i]: `ps=${prefixSum}` }),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Maximum length subarray with equal 0s and 1s: ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${maxLen}` },
      ),
    });

    return steps;
  },
};

export default contiguousArrayII;
