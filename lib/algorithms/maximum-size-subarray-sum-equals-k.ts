import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSizeSubarraySumEqualsK: AlgorithmDefinition = {
  id: 'maximum-size-subarray-sum-equals-k',
  title: 'Maximum Size Subarray Sum Equals k',
  leetcodeNumber: 325,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the maximum length of a subarray that sums to k. Use a prefix sum + hash map. Record the earliest index where each prefix sum occurs. For each index i, if (prefixSum - k) was seen at index j, subarray (j+1..i) sums to k with length i-j. O(n) time.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function maxSubArrayLen(nums, k):
  map = {0: -1}  # prefixSum -> earliest index
  prefixSum = 0, maxLen = 0
  for i from 0 to n-1:
    prefixSum += nums[i]
    if (prefixSum - k) in map:
      maxLen = max(maxLen, i - map[prefixSum - k])
    if prefixSum not in map:
      map[prefixSum] = i
  return maxLen`,
    python: `def maxSubArrayLen(nums: list[int], k: int) -> int:
    seen = {0: -1}
    prefix = 0
    max_len = 0
    for i, num in enumerate(nums):
        prefix += num
        if prefix - k in seen:
            max_len = max(max_len, i - seen[prefix - k])
        if prefix not in seen:
            seen[prefix] = i
    return max_len`,
    javascript: `function maxSubArrayLen(nums, k) {
  const seen = new Map([[0, -1]]);
  let prefix = 0, maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i];
    if (seen.has(prefix - k)) maxLen = Math.max(maxLen, i - seen.get(prefix - k));
    if (!seen.has(prefix)) seen.set(prefix, i);
  }
  return maxLen;
}`,
    java: `public int maxSubArrayLen(int[] nums, int k) {
    Map<Integer,Integer> seen = new HashMap<>();
    seen.put(0, -1);
    int prefix = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix += nums[i];
        if (seen.containsKey(prefix - k)) maxLen = Math.max(maxLen, i - seen.get(prefix - k));
        seen.putIfAbsent(prefix, i);
    }
    return maxLen;
}`,
  },
  defaultInput: { nums: [1, -1, 5, -2, 3], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, -1, 5, -2, 3],
      placeholder: '1,-1,5,-2,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'Target k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const seen = new Map<number, number>([[0, -1]]);
    let prefix = 0;
    let maxLen = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Seen (ps -> earliest idx)',
        entries: Array.from(seen.entries()).map(([s, idx]) => ({ key: `ps=${s}`, value: `idx=${idx}` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Find max subarray length with sum = ${k}. nums = [${nums.join(', ')}].`,
      variables: { k, maxLen },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefix += nums[i];
      const need = prefix - k;

      steps.push({
        line: 4,
        explanation: `Index ${i}: nums[${i}]=${nums[i]}, prefix=${prefix}. Need ps-k=${need} in seen? ${seen.has(need) ? `Yes at idx ${seen.get(need)}` : 'No'}.`,
        variables: { i, prefix, need },
        visualization: makeViz({ [i]: 'active' }, { [i]: `ps=${prefix}` }),
      });

      if (seen.has(need)) {
        const prevIdx = seen.get(need)!;
        const len = i - prevIdx;
        if (len > maxLen) maxLen = len;

        steps.push({
          line: 6,
          explanation: `Subarray [${prevIdx + 1}..${i}] has sum ${k}, length ${len}. maxLen = ${maxLen}.`,
          variables: { prevIdx, len, maxLen },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: len }, (_, k) => [prevIdx + 1 + k, 'found'])),
            { [prevIdx + 1]: 'start', [i]: `len=${len}` },
          ),
        });
      }

      if (!seen.has(prefix)) {
        seen.set(prefix, i);
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Maximum subarray length with sum ${k}: ${maxLen}.`,
      variables: { result: maxLen },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: `ans=${maxLen}` },
      ),
    });

    return steps;
  },
};

export default maximumSizeSubarraySumEqualsK;
