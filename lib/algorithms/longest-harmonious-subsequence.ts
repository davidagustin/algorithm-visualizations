import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestHarmoniousSubsequence: AlgorithmDefinition = {
  id: 'longest-harmonious-subsequence',
  title: 'Longest Harmonious Subsequence',
  leetcodeNumber: 594,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'A harmonious subsequence has max and min elements differing by exactly 1. Count frequencies of each number in a hash map, then for each number check if num+1 also exists. The harmonious subsequence length is freq[num] + freq[num+1]. Return the maximum such length.',
  tags: ['hash map', 'array', 'subsequence'],

  code: {
    pseudocode: `function findLHS(nums):
  freq = {}
  for num in nums:
    freq[num] = freq.get(num, 0) + 1
  best = 0
  for num in freq:
    if num + 1 in freq:
      best = max(best, freq[num] + freq[num + 1])
  return best`,

    python: `from collections import Counter
def findLHS(nums: list[int]) -> int:
    freq = Counter(nums)
    best = 0
    for num in freq:
        if num + 1 in freq:
            best = max(best, freq[num] + freq[num + 1])
    return best`,

    javascript: `function findLHS(nums) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  let best = 0;
  for (const [num, cnt] of freq) {
    if (freq.has(num + 1))
      best = Math.max(best, cnt + freq.get(num + 1));
  }
  return best;
}`,

    java: `public int findLHS(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    int best = 0;
    for (int num : freq.keySet())
        if (freq.containsKey(num + 1))
            best = Math.max(best, freq.get(num) + freq.get(num + 1));
    return best;
}`,
  },

  defaultInput: {
    nums: [1, 3, 2, 2, 5, 2, 3, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 2, 2, 5, 2, 3, 7],
      placeholder: '1,3,2,2,5,2,3,7',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const freq: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Build a frequency map of all numbers in the array.',
      variables: { freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      freq[nums[i]] = (freq[nums[i]] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `nums[${i}]=${nums[i]}. freq[${nums[i]}] = ${freq[nums[i]]}.`,
        variables: { i, num: nums[i], freq: JSON.stringify(freq) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `f=${freq[nums[i]]}` }),
      });
    }

    steps.push({
      line: 4,
      explanation: `Frequency map complete: ${JSON.stringify(freq)}. Now find the best harmonious pair.`,
      variables: { freq: JSON.stringify(freq), best: 0 },
      visualization: makeViz({}, {}),
    });

    let best = 0;
    for (const numStr of Object.keys(freq)) {
      const num = Number(numStr);
      if ((num + 1) in freq) {
        const len = freq[num] + freq[num + 1];
        const prevBest = best;
        best = Math.max(best, len);

        const idxNums = nums.map((n, i) => (n === num || n === num + 1) ? i : -1).filter(i => i >= 0);
        const hlMap: Record<number, string> = {};
        const lbMap: Record<number, string> = {};
        for (const idx of idxNums) {
          hlMap[idx] = 'found';
          lbMap[idx] = String(nums[idx]);
        }

        steps.push({
          line: 7,
          explanation: `num=${num}: freq[${num}]=${freq[num]}, freq[${num + 1}]=${freq[num + 1]}. Harmonious length = ${len}. best = max(${prevBest}, ${len}) = ${best}.`,
          variables: { num, freqNum: freq[num], freqNumPlus1: freq[num + 1], length: len, best },
          visualization: makeViz(hlMap, lbMap),
        });
      } else {
        steps.push({
          line: 6,
          explanation: `num=${num}: ${num + 1} not in freq. No harmonious pair. Skip.`,
          variables: { num, best },
          visualization: makeViz({}, {}),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `All numbers checked. Longest harmonious subsequence = ${best}.`,
      variables: { result: best },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestHarmoniousSubsequence;
