import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const kDiffPairs: AlgorithmDefinition = {
  id: 'k-diff-pairs',
  title: 'K-diff Pairs in an Array',
  leetcodeNumber: 532,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array and an integer k, return the number of unique k-diff pairs. A k-diff pair is (nums[i], nums[j]) where i != j and abs(nums[i] - nums[j]) == k. Use a frequency map and check if num+k exists for each unique number.',
  tags: ['hash map', 'array', 'two pointers', 'sorting'],

  code: {
    pseudocode: `function findPairs(nums, k):
  if k < 0: return 0
  count = 0
  freq = frequency map of nums
  for num in freq.keys():
    if k == 0:
      if freq[num] >= 2: count++
    else:
      if num+k in freq: count++
  return count`,

    python: `def findPairs(nums: list[int], k: int) -> int:
    if k < 0:
        return 0
    freq = {}
    for n in nums:
        freq[n] = freq.get(n, 0) + 1
    count = 0
    for num in freq:
        if k == 0:
            if freq[num] >= 2:
                count += 1
        else:
            if num + k in freq:
                count += 1
    return count`,

    javascript: `function findPairs(nums, k) {
  if (k < 0) return 0;
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  let count = 0;
  for (const [num, f] of freq) {
    if (k === 0) {
      if (f >= 2) count++;
    } else {
      if (freq.has(num + k)) count++;
    }
  }
  return count;
}`,

    java: `public int findPairs(int[] nums, int k) {
    if (k < 0) return 0;
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.put(n, freq.getOrDefault(n, 0) + 1);
    int count = 0;
    for (int num : freq.keySet()) {
        if (k == 0) {
            if (freq.get(num) >= 2) count++;
        } else {
            if (freq.containsKey(num + k)) count++;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    nums: [3, 1, 4, 1, 5],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 4, 1, 5],
      placeholder: '3,1,4,1,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'k (difference)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target absolute difference',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: nums=${JSON.stringify(nums)}, k=${k}. Build frequency map first.`,
      variables: { k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    if (k < 0) {
      steps.push({
        line: 2,
        explanation: 'k is negative. No valid pairs possible. Return 0.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {},
          labels: {},
        },
      });
      return steps;
    }

    const freq = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      freq.set(n, (freq.get(n) || 0) + 1);
      steps.push({
        line: 4,
        explanation: `Add nums[${i}]=${n} to frequency map. freq[${n}]=${freq.get(n)}.`,
        variables: { i, value: n, freq: JSON.stringify(Object.fromEntries(freq)) },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active' },
          labels: { [i]: String(n) },
        },
      });
    }

    let count = 0;
    const keys = [...freq.keys()].sort((a, b) => a - b);

    for (const num of keys) {
      const f = freq.get(num)!;
      if (k === 0) {
        if (f >= 2) {
          count++;
          steps.push({
            line: 7,
            explanation: `k=0: num=${num} appears ${f} times (>= 2). Pair (${num},${num}) is valid. count=${count}.`,
            variables: { num, freq: f, count },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(
                nums.map((v, i) => [i, v === num ? 'found' : 'default'])
              ),
              labels: {},
            },
          });
        } else {
          steps.push({
            line: 6,
            explanation: `k=0: num=${num} appears only ${f} time. Cannot form pair. Skip.`,
            variables: { num, freq: f, count },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: {},
              labels: {},
            },
          });
        }
      } else {
        const target = num + k;
        if (freq.has(target)) {
          count++;
          steps.push({
            line: 9,
            explanation: `num=${num}, target=num+k=${target} exists in map. Pair (${num},${target}) found. count=${count}.`,
            variables: { num, target, k, count },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(
                nums.map((v, i) => [i, v === num || v === target ? 'found' : 'default'])
              ),
              labels: {},
            },
          });
        } else {
          steps.push({
            line: 8,
            explanation: `num=${num}, target=${target} not in map. No pair. Skip.`,
            variables: { num, target, k, count },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(
                nums.map((v, i) => [i, v === num ? 'comparing' : 'default'])
              ),
              labels: {},
            },
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Total unique k-diff pairs: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default kDiffPairs;
