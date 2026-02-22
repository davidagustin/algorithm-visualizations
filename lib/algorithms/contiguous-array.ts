import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const contiguousArray: AlgorithmDefinition = {
  id: 'contiguous-array',
  title: 'Contiguous Array',
  leetcodeNumber: 525,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Find the maximum length subarray with equal number of 0s and 1s. Replace 0s with -1s and compute prefix sums. If the same prefix sum appears twice, the subarray between those indices has equal 0s and 1s. Track first occurrence of each prefix sum in a hash map.',
  tags: ['Prefix Sum', 'Hash Map', 'Array'],
  code: {
    pseudocode: `function findMaxLength(nums):
  replace 0s with -1s
  map = {0: -1}
  prefixSum = 0
  maxLen = 0
  for i from 0 to n-1:
    prefixSum += nums[i]  // -1 or 1
    if prefixSum in map:
      maxLen = max(maxLen, i - map[prefixSum])
    else:
      map[prefixSum] = i
  return maxLen`,
    python: `def findMaxLength(nums):
    map = {0: -1}
    prefix = 0
    max_len = 0
    for i, num in enumerate(nums):
        prefix += 1 if num == 1 else -1
        if prefix in map:
            max_len = max(max_len, i - map[prefix])
        else:
            map[prefix] = i
    return max_len`,
    javascript: `function findMaxLength(nums) {
  const map = new Map([[0, -1]]);
  let prefix = 0, maxLen = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i] === 1 ? 1 : -1;
    if (map.has(prefix)) {
      maxLen = Math.max(maxLen, i - map.get(prefix));
    } else {
      map.set(prefix, i);
    }
  }
  return maxLen;
}`,
    java: `public int findMaxLength(int[] nums) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, -1);
    int prefix = 0, maxLen = 0;
    for (int i = 0; i < nums.length; i++) {
        prefix += nums[i] == 1 ? 1 : -1;
        if (map.containsKey(prefix))
            maxLen = Math.max(maxLen, i - map.get(prefix));
        else
            map.put(prefix, i);
    }
    return maxLen;
}`,
  },
  defaultInput: { nums: [0, 1, 0, 0, 1, 1, 0] },
  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [0, 1, 0, 0, 1, 1, 0],
      placeholder: '[0,1,0,0,1,1,0]',
      helperText: 'Array containing only 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const transformed = nums.map(n => n === 1 ? 1 : -1);
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
      explanation: `Transform: replace 0→-1, keep 1→1. Transformed: [${transformed.join(', ')}]. Track prefix sums; equal 0s and 1s means prefix sum returns to same value.`,
      variables: { transformed, map: { '0': -1 } },
      visualization: makeViz({}, {}, [
        { key: 'prefix', value: '0' },
        { key: 'map', value: '{0: -1}' },
        { key: 'maxLen', value: '0' },
      ]),
    });

    for (let i = 0; i < nums.length; i++) {
      prefix += transformed[i];
      const hl: Record<number, string> = {};
      for (let j = 0; j <= i; j++) hl[j] = 'visited';
      hl[i] = 'active';

      const mapSnapshot = Array.from(map.entries()).map(([k, v]) => ({ key: `sum=${k}`, value: `idx=${v}` }));

      if (map.has(prefix)) {
        const prevIdx = map.get(prefix)!;
        const len = i - prevIdx;
        if (len > maxLen) {
          maxLen = len;
          bestStart = prevIdx + 1;
          bestEnd = i;
        }
        for (let j = prevIdx + 1; j <= i; j++) hl[j] = 'found';
        steps.push({
          line: 8,
          explanation: `prefix[${i}] = ${prefix}. SEEN before at index ${prevIdx}! Subarray [${prevIdx+1}..${i}] has equal 0s and 1s. Length = ${len}. maxLen = ${maxLen}.`,
          variables: { i, prefix, prevIdx, len, maxLen },
          visualization: makeViz(hl, { [i]: `ps=${prefix}`, [prevIdx + 1]: 'L', [i]: 'R' }, [
            { key: 'prefix', value: String(prefix) },
            { key: 'prev seen at', value: String(prevIdx) },
            { key: 'subarray length', value: String(len) },
            { key: 'maxLen', value: String(maxLen) },
            ...mapSnapshot,
          ]),
        });
      } else {
        map.set(prefix, i);
        steps.push({
          line: 10,
          explanation: `prefix[${i}] = ${prefix}. Not seen before. Record map[${prefix}] = ${i}.`,
          variables: { i, prefix, maxLen },
          visualization: makeViz(hl, { [i]: `ps=${prefix}` }, [
            { key: 'prefix', value: String(prefix) },
            { key: 'first seen at', value: String(i) },
            { key: 'maxLen', value: String(maxLen) },
            ...Array.from(map.entries()).map(([k, v]) => ({ key: `sum=${k}`, value: `idx=${v}` })),
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < nums.length; j++) {
      finalHl[j] = bestStart !== -1 && j >= bestStart && j <= bestEnd ? 'found' : 'visited';
    }

    steps.push({
      line: 11,
      explanation: `Done! Maximum length subarray with equal 0s and 1s = ${maxLen}${bestStart !== -1 ? ` (indices ${bestStart}..${bestEnd})` : ''}.`,
      variables: { result: maxLen },
      visualization: makeViz(finalHl, bestStart !== -1 ? { [bestStart]: 'L', [bestEnd]: 'R' } : {}, [
        { key: 'maxLen', value: String(maxLen) },
        { key: 'best subarray', value: bestStart !== -1 ? `[${bestStart}..${bestEnd}]` : 'none' },
      ]),
    });

    return steps;
  },
};

export default contiguousArray;
