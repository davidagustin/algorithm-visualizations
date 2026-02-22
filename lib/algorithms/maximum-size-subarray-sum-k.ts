import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSizeSubarraySumK: AlgorithmDefinition = {
  id: 'maximum-size-subarray-sum-k',
  title: 'Maximum Size Subarray Sum Equals K',
  leetcodeNumber: 325,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the maximum length of a subarray that sums to k. Use prefix sums: for each index i with prefix sum S, if S-k was seen before at index j, then subarray [j+1..i] sums to k. Track the first occurrence of each prefix sum in a hash map to maximize the subarray length.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function maxSubArrayLen(nums, k):
  map = {0: -1}
  prefixSum = 0
  maxLen = 0
  for i from 0 to n-1:
    prefixSum += nums[i]
    if (prefixSum - k) in map:
      maxLen = max(maxLen, i - map[prefixSum - k])
    if prefixSum not in map:
      map[prefixSum] = i
  return maxLen`,
    python: `def maxSubArrayLen(nums, k):
    map = {0: -1}
    prefix = 0
    max_len = 0
    for i, num in enumerate(nums):
        prefix += num
        if prefix - k in map:
            max_len = max(max_len, i - map[prefix - k])
        if prefix not in map:
            map[prefix] = i
    return max_len`,
    javascript: `function maxSubArrayLen(nums, k) {
  const map = new Map([[0, -1]]);
  let prefix = 0, maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i];
    if (map.has(prefix - k))
      maxLen = Math.max(maxLen, i - map.get(prefix - k));
    if (!map.has(prefix)) map.set(prefix, i);
  }
  return maxLen;
}`,
    java: `public int maxSubArrayLen(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, -1);
    int prefix = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix += nums[i];
        if (map.containsKey(prefix - k))
            maxLen = Math.max(maxLen, i - map.get(prefix - k));
        if (!map.containsKey(prefix)) map.put(prefix, i);
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
      placeholder: '[1,-1,5,-2,3]',
      helperText: 'Array of integers (can include negatives)',
    },
    {
      name: 'k',
      label: 'Target Sum k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const map = new Map<number, number>([[0, -1]]);
    let prefix = 0;
    let maxLen = 0;
    let bestStart = -1;
    let bestEnd = -1;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Prefix Sum Map', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Find longest subarray summing to k=${k}. Use prefix sum: if prefix[i] - prefix[j] = k, then subarray [j+1..i] sums to k. Map stores first occurrence of each prefix sum.`,
      variables: { k },
      visualization: makeViz({}, {}, [
        { key: 'k', value: String(k) },
        { key: 'prefix', value: '0' },
        { key: 'maxLen', value: '0' },
        { key: 'map', value: '{0: -1}' },
      ]),
    });

    for (let i = 0; i < nums.length; i++) {
      prefix += nums[i];
      const target = prefix - k;
      const hl: Record<number, string> = {};
      for (let j = 0; j <= i; j++) hl[j] = 'visited';
      hl[i] = 'active';

      const mapEntries = Array.from(map.entries()).map(([s, idx]) => ({ key: `ps=${s}`, value: `idx=${idx}` }));

      if (map.has(target)) {
        const prevIdx = map.get(target)!;
        const len = i - prevIdx;
        if (len > maxLen) {
          maxLen = len;
          bestStart = prevIdx + 1;
          bestEnd = i;
        }
        const matchHl: Record<number, string> = { ...hl };
        for (let j = prevIdx + 1; j <= i; j++) matchHl[j] = 'found';
        steps.push({
          line: 7,
          explanation: `i=${i}: prefix=${prefix}. prefix-k = ${prefix}-${k} = ${target}. Found in map at idx ${prevIdx}! Subarray [${prevIdx+1}..${i}] sums to ${k}. Length=${len}. maxLen=${maxLen}.`,
          variables: { i, prefix, target, prevIdx, len, maxLen },
          visualization: makeViz(matchHl, { [prevIdx + 1]: 'L', [i]: 'R' }, [
            { key: 'prefix', value: String(prefix) },
            { key: 'prefix - k', value: String(target) },
            { key: 'found at', value: String(prevIdx) },
            { key: 'length', value: String(len) },
            { key: 'maxLen', value: String(maxLen) },
            ...mapEntries,
          ]),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `i=${i}: prefix=${prefix}. prefix-k = ${target}. Not in map. ${map.has(prefix) ? `prefix=${prefix} already in map (keep first occurrence).` : `Record map[${prefix}] = ${i}.`}`,
          variables: { i, prefix, target, maxLen },
          visualization: makeViz(hl, { [i]: `ps=${prefix}` }, [
            { key: 'prefix', value: String(prefix) },
            { key: 'prefix - k', value: String(target) },
            { key: 'maxLen', value: String(maxLen) },
            ...mapEntries,
          ]),
        });
      }

      if (!map.has(prefix)) map.set(prefix, i);
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < nums.length; j++) {
      finalHl[j] = bestStart !== -1 && j >= bestStart && j <= bestEnd ? 'found' : 'visited';
    }

    steps.push({
      line: 10,
      explanation: `Done! Maximum subarray length with sum = ${k} is ${maxLen}${bestStart !== -1 ? ` (indices ${bestStart}..${bestEnd})` : ''}.`,
      variables: { result: maxLen },
      visualization: makeViz(finalHl, bestStart !== -1 ? { [bestStart]: 'L', [bestEnd]: 'R' } : {}, [
        { key: 'maxLen', value: String(maxLen) },
        { key: 'best subarray', value: bestStart !== -1 ? `[${bestStart}..${bestEnd}]` : 'none' },
        { key: 'target k', value: String(k) },
      ]),
    });

    return steps;
  },
};

export default maximumSizeSubarraySumK;
