import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubarrayWithSumK: AlgorithmDefinition = {
  id: 'longest-subarray-with-sum-k',
  title: 'Longest Subarray with Sum K',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array and a target sum k, find the length of the longest subarray with sum exactly equal to k. Uses prefix sums with a hash map: for each prefix sum, check if (prefixSum - k) exists in the map. The first occurrence index is stored to maximize the length.',
  tags: ['Prefix Sum', 'Hash Map', 'Sliding Window', 'Array'],
  code: {
    pseudocode: `function longestSubarrayWithSumK(nums, k):
  map = {0: -1}  // prefix sum -> first index
  prefixSum = 0
  maxLen = 0
  for i in 0..n-1:
    prefixSum += nums[i]
    if prefixSum - k in map:
      maxLen = max(maxLen, i - map[prefixSum - k])
    if prefixSum not in map:
      map[prefixSum] = i
  return maxLen`,
    python: `def longestSubarrayWithSumK(nums, k):
    prefix_map = {0: -1}
    prefix_sum = 0
    max_len = 0
    for i, num in enumerate(nums):
        prefix_sum += num
        if prefix_sum - k in prefix_map:
            max_len = max(max_len, i - prefix_map[prefix_sum - k])
        if prefix_sum not in prefix_map:
            prefix_map[prefix_sum] = i
    return max_len`,
    javascript: `function longestSubarrayWithSumK(nums, k) {
  const map = new Map([[0, -1]]);
  let prefixSum = 0, maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    if (map.has(prefixSum - k)) {
      maxLen = Math.max(maxLen, i - map.get(prefixSum - k));
    }
    if (!map.has(prefixSum)) map.set(prefixSum, i);
  }
  return maxLen;
}`,
    java: `public int longestSubarrayWithSumK(int[] nums, int k) {
    Map<Integer,Integer> map = new HashMap<>();
    map.put(0, -1);
    int sum=0, maxLen=0;
    for (int i=0;i<nums.length;i++) {
        sum+=nums[i];
        if (map.containsKey(sum-k)) maxLen=Math.max(maxLen,i-map.get(sum-k));
        if (!map.containsKey(sum)) map.put(sum,i);
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
      helperText: 'Input array (can contain negatives)',
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
    const n = nums.length;

    const prefixMap = new Map<number, number>([[0, -1]]);
    let prefixSum = 0;
    let maxLen = 0;
    let bestStart = -1, bestEnd = -1;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Longest Subarray Sum = ${k}`,
          entries: [
            { key: 'Prefix Sum', value: String(prefixSum) },
            { key: 'Max Length', value: String(maxLen) },
            { key: 'Map Size', value: String(prefixMap.size) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find longest subarray with sum = ${k}. Use prefix sum map: {0: -1}. For each i, check if prefixSum - ${k} exists.`,
      variables: { n, k },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefixSum += nums[i];
      const need = prefixSum - k;

      const h: Record<number, string> = { [i]: 'active' };
      const l: Record<number, string> = { [i]: `ps=${prefixSum}` };

      if (prefixMap.has(need)) {
        const prevIdx = prefixMap.get(need)!;
        const len = i - prevIdx;
        if (len > maxLen) {
          maxLen = len;
          bestStart = prevIdx + 1;
          bestEnd = i;
        }
        for (let j = prevIdx + 1; j <= i; j++) h[j] = 'found';
        steps.push({
          line: 6,
          explanation: `i=${i}: prefixSum=${prefixSum}, need=${need} found at index ${prevIdx}. Subarray [${prevIdx + 1}..${i}] sum=${k}, length=${len}. maxLen=${maxLen}.`,
          variables: { i, prefixSum, need, prevIdx, length: len, maxLen },
          visualization: makeViz(h, { [prevIdx + 1]: 'S', [i]: 'E', ...l }),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `i=${i}: prefixSum=${prefixSum}, need=${need} not in map. No valid subarray ending here yet.`,
          variables: { i, prefixSum, need, maxLen },
          visualization: makeViz(h, l),
        });
      }

      if (!prefixMap.has(prefixSum)) {
        prefixMap.set(prefixSum, i);
      }
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (i >= bestStart && i <= bestEnd) { finalH[i] = 'match'; finalL[i] = i === bestStart ? 'S' : i === bestEnd ? 'E' : ''; }
      else finalH[i] = 'visited';
    }
    steps.push({
      line: 10,
      explanation: `Done. Longest subarray with sum ${k}: length=${maxLen}${bestStart >= 0 ? `, indices [${bestStart}..${bestEnd}]` : ''}.`,
      variables: { result: maxLen, bestStart, bestEnd },
      visualization: makeViz(finalH, finalL),
    });

    return steps;
  },
};

export default longestSubarrayWithSumK;
