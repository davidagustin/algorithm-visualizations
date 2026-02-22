import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumEqualFrequency: AlgorithmDefinition = {
  id: 'maximum-equal-frequency',
  title: 'Maximum Equal Frequency',
  leetcodeNumber: 1224,
  difficulty: 'Hard',
  category: 'Hash Map',
  description:
    'Given an array nums, find the maximum length prefix of nums such that after deleting exactly one element, every remaining element appears the same number of times. Use two frequency maps: count[v] tracks how many times value v appears, and freq[c] tracks how many values appear exactly c times.',
  tags: ['hash map', 'array', 'frequency', 'prefix'],

  code: {
    pseudocode: `function maxEqualFreq(nums):
  count = {}
  freq = {}
  maxFreq = 0
  result = 0
  for i, v in enumerate(nums):
    count[v]++
    freq[count[v]]++
    if count[v] > 1: freq[count[v]-1]--
    maxFreq = max(maxFreq, count[v])
    n = i + 1
    if (maxFreq * freq[maxFreq] == n and n != len(nums)):
      result = n
    elif (maxFreq * (freq[maxFreq]+1) == n+1):
      result = n
    elif (maxFreq == n):
      result = n
  return result`,
    python: `def maxEqualFreq(nums):
    from collections import defaultdict
    count = defaultdict(int)
    freq = defaultdict(int)
    maxFreq = result = 0
    for i, v in enumerate(nums):
        if count[v]: freq[count[v]] -= 1
        count[v] += 1
        freq[count[v]] += 1
        maxFreq = max(maxFreq, count[v])
        n = i + 1
        if (maxFreq == 1 or
            maxFreq * freq[maxFreq] == n - 1 or
            (maxFreq + 1) * freq[maxFreq + 1] == n - 1 or
            maxFreq * (freq[maxFreq] + 1) == n or
            maxFreq == n):
            result = n
    return result`,
    javascript: `function maxEqualFreq(nums) {
  const count = {}, freq = {};
  let maxFreq = 0, result = 0;
  for (let i = 0; i < nums.length; i++) {
    const v = nums[i];
    if (count[v]) freq[count[v]] = (freq[count[v]] || 0) - 1;
    count[v] = (count[v] || 0) + 1;
    freq[count[v]] = (freq[count[v]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[v]);
    const n = i + 1;
    if (maxFreq === 1 || maxFreq === n ||
        maxFreq * freq[maxFreq] === n - 1 ||
        maxFreq * (freq[maxFreq] + 1) === n) result = n;
  }
  return result;
}`,
    java: `public int maxEqualFreq(int[] nums) {
    Map<Integer,Integer> count = new HashMap<>(), freq = new HashMap<>();
    int maxFreq = 0, result = 0;
    for (int i = 0; i < nums.length; i++) {
        int v = nums[i];
        freq.merge(count.getOrDefault(v,0), -1, Integer::sum);
        count.merge(v, 1, Integer::sum);
        freq.merge(count.get(v), 1, Integer::sum);
        maxFreq = Math.max(maxFreq, count.get(v));
        int n = i + 1;
        if (maxFreq == 1 || maxFreq == n ||
            maxFreq * freq.getOrDefault(maxFreq,0) == n-1 ||
            maxFreq * (freq.getOrDefault(maxFreq,0)+1) == n) result = n;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 2, 1, 1, 5, 3, 3, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 2, 1, 1, 5, 3, 3, 5],
      placeholder: '2,2,1,1,5,3,3,5',
      helperText: 'Comma-separated positive integers',
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

    const count: Record<number, number> = {};
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: 'Initialize count map, freq map, maxFreq and result.',
      variables: { count: '{}', freq: '{}', maxFreq, result },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const v = nums[i];
      const oldCount = count[v] || 0;
      if (oldCount > 0) freq[oldCount] = (freq[oldCount] || 0) - 1;
      count[v] = oldCount + 1;
      freq[count[v]] = (freq[count[v]] || 0) + 1;
      maxFreq = Math.max(maxFreq, count[v]);
      const n = i + 1;

      const valid =
        maxFreq === 1 ||
        maxFreq === n ||
        maxFreq * (freq[maxFreq] || 0) === n - 1 ||
        maxFreq * ((freq[maxFreq] || 0) + 1) === n;

      if (valid) result = n;

      steps.push({
        line: 6,
        explanation: `i=${i}, v=${v}: count[${v}]=${count[v]}, maxFreq=${maxFreq}, n=${n}. Valid prefix? ${valid}. result=${result}`,
        variables: {
          i,
          v,
          [`count[${v}]`]: count[v],
          maxFreq,
          n,
          valid,
          result,
        },
        visualization: makeViz(
          { [i]: valid ? 'found' : 'active' },
          { [i]: `c=${count[v]}` }
        ),
      });
    }

    steps.push({
      line: 15,
      explanation: `Maximum valid prefix length is ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(nums.slice(0, result).map((_, i) => [i, 'sorted'])),
        { [result - 1]: `len=${result}` }
      ),
    });

    return steps;
  },
};

export default maximumEqualFrequency;
