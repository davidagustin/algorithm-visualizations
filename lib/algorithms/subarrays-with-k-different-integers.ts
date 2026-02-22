import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const subarraysWithKDifferentIntegers: AlgorithmDefinition = {
  id: 'subarrays-with-k-different-integers',
  title: 'Subarrays with K Different Integers',
  leetcodeNumber: 992,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and an integer k, return the number of subarrays with exactly k different integers. Use the identity: exactly(k) = atMost(k) - atMost(k-1), where atMost(k) counts subarrays with at most k distinct integers using a sliding window. Each valid right endpoint contributes right - left + 1 subarrays.',
  tags: ['sliding window', 'hash map', 'counting', 'two pointers'],

  code: {
    pseudocode: `function subarraysWithKDistinct(nums, k):
  return atMost(nums, k) - atMost(nums, k - 1)

function atMost(nums, k):
  freq = {}
  left = 0
  result = 0
  for right in range(len(nums)):
    freq[nums[right]] = freq.get(nums[right], 0) + 1
    while len(freq) > k:
      freq[nums[left]] -= 1
      if freq[nums[left]] == 0:
        del freq[nums[left]]
      left += 1
    result += right - left + 1
  return result`,

    python: `def subarraysWithKDistinct(nums: list[int], k: int) -> int:
    def atMost(k):
        freq = {}
        left = result = 0
        for right, num in enumerate(nums):
            freq[num] = freq.get(num, 0) + 1
            while len(freq) > k:
                freq[nums[left]] -= 1
                if freq[nums[left]] == 0:
                    del freq[nums[left]]
                left += 1
            result += right - left + 1
        return result
    return atMost(k) - atMost(k - 1)`,

    javascript: `function subarraysWithKDistinct(nums, k) {
  function atMost(k) {
    const freq = new Map();
    let left = 0, result = 0;
    for (let right = 0; right < nums.length; right++) {
      freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);
      while (freq.size > k) {
        freq.set(nums[left], freq.get(nums[left]) - 1);
        if (freq.get(nums[left]) === 0) freq.delete(nums[left]);
        left++;
      }
      result += right - left + 1;
    }
    return result;
  }
  return atMost(k) - atMost(k - 1);
}`,

    java: `public int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}
private int atMost(int[] nums, int k) {
    Map<Integer,Integer> freq = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        freq.merge(nums[right], 1, Integer::sum);
        while (freq.size() > k) {
            freq.merge(nums[left], -1, Integer::sum);
            if (freq.get(nums[left]) == 0) freq.remove(nums[left]);
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 1, 2, 3],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 3],
      placeholder: '1,2,1,2,3',
      helperText: 'Array of positive integers',
    },
    {
      name: 'k',
      label: 'Distinct Count (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Exact number of distinct integers required',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
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

    steps.push({
      line: 1,
      explanation: `Count subarrays with exactly k=${k} distinct integers. Key: exactly(k) = atMost(k) - atMost(k-1).`,
      variables: { k },
      visualization: makeViz({}, {}),
    });

    const atMost = (limit: number): { count: number; stepsArr: { left: number; right: number; added: number }[] } => {
      const freq = new Map<number, number>();
      let left = 0;
      let result = 0;
      const stepsArr: { left: number; right: number; added: number }[] = [];
      for (let right = 0; right < nums.length; right++) {
        freq.set(nums[right], (freq.get(nums[right]) || 0) + 1);
        while (freq.size > limit) {
          const newVal = (freq.get(nums[left]) || 0) - 1;
          if (newVal === 0) freq.delete(nums[left]);
          else freq.set(nums[left], newVal);
          left++;
        }
        const added = right - left + 1;
        result += added;
        stepsArr.push({ left, right, added });
      }
      return { count: result, stepsArr };
    };

    const { count: atMostK, stepsArr: stepsK } = atMost(k);
    const { count: atMostKMinus1, stepsArr: stepsKMinus1 } = atMost(k - 1);

    steps.push({
      line: 4,
      explanation: `Compute atMost(${k}): count all subarrays with at most ${k} distinct integers.`,
      variables: { limit: k },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < stepsK.length; i++) {
      const { left, right, added } = stepsK[i];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = left; j <= right; j++) highlights[j] = 'active';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${k}): right=${right}, left=${left}. Window [${left},${right}] contributes ${added} subarrays.`,
        variables: { left, right, added, limit: k },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 4,
      explanation: `atMost(${k}) = ${atMostK}. Now compute atMost(${k - 1}) for subarrays with at most ${k - 1} distinct integers.`,
      variables: { atMostK, limit: k - 1 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < stepsKMinus1.length; i++) {
      const { left, right, added } = stepsKMinus1[i];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = left; j <= right; j++) highlights[j] = 'comparing';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${k - 1}): right=${right}, left=${left}. Window contributes ${added} subarrays.`,
        variables: { left, right, added, limit: k - 1 },
        visualization: makeViz(highlights, labels),
      });
    }

    const result = atMostK - atMostKMinus1;

    steps.push({
      line: 2,
      explanation: `Done. exactly(${k}) = atMost(${k}) - atMost(${k - 1}) = ${atMostK} - ${atMostKMinus1} = ${result}.`,
      variables: { atMostK, atMostKMinus1, result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default subarraysWithKDifferentIntegers;
