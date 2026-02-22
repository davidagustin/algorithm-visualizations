import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNumberOfNiceSubarrays: AlgorithmDefinition = {
  id: 'count-number-of-nice-subarrays',
  title: 'Count Number of Nice Subarrays',
  leetcodeNumber: 1248,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of integers nums and an integer k, a subarray is nice if it contains exactly k odd numbers. Count all nice subarrays. Use the identity: exactly(k) = atMost(k) - atMost(k-1), where atMost(k) counts subarrays with at most k odd numbers using a sliding window.',
  tags: ['sliding window', 'math', 'prefix sum', 'counting'],

  code: {
    pseudocode: `function numberOfSubarrays(nums, k):
  return atMost(nums, k) - atMost(nums, k - 1)

function atMost(nums, k):
  left = 0
  oddCount = 0
  result = 0
  for right in range(len(nums)):
    if nums[right] % 2 == 1:
      oddCount += 1
    while oddCount > k:
      if nums[left] % 2 == 1:
        oddCount -= 1
      left += 1
    result += right - left + 1
  return result`,

    python: `def numberOfSubarrays(nums: list[int], k: int) -> int:
    def atMost(limit):
        left = odd = result = 0
        for right, num in enumerate(nums):
            if num % 2 == 1:
                odd += 1
            while odd > limit:
                if nums[left] % 2 == 1:
                    odd -= 1
                left += 1
            result += right - left + 1
        return result
    return atMost(k) - atMost(k - 1)`,

    javascript: `function numberOfSubarrays(nums, k) {
  function atMost(limit) {
    let left = 0, odd = 0, result = 0;
    for (let right = 0; right < nums.length; right++) {
      if (nums[right] % 2 === 1) odd++;
      while (odd > limit) {
        if (nums[left] % 2 === 1) odd--;
        left++;
      }
      result += right - left + 1;
    }
    return result;
  }
  return atMost(k) - atMost(k - 1);
}`,

    java: `public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}
private int atMost(int[] nums, int k) {
    int left = 0, odd = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odd++;
        while (odd > k) {
            if (nums[left] % 2 == 1) odd--;
            left++;
        }
        result += right - left + 1;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 1, 1],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 2, 1, 1],
      placeholder: '1,1,2,1,1',
      helperText: 'Array of integers',
    },
    {
      name: 'k',
      label: 'Odd Count (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Required number of odd elements in subarray',
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
      explanation: `Count subarrays with exactly k=${k} odd numbers. Use: exactly(k) = atMost(k) - atMost(k-1).`,
      variables: { k },
      visualization: makeViz({}, {}),
    });

    const atMost = (limit: number) => {
      let left = 0;
      let odd = 0;
      let result = 0;
      const trail: { left: number; right: number; odd: number; added: number }[] = [];
      for (let right = 0; right < nums.length; right++) {
        if (nums[right] % 2 === 1) odd++;
        while (odd > limit) {
          if (nums[left] % 2 === 1) odd--;
          left++;
        }
        const added = right - left + 1;
        result += added;
        trail.push({ left, right, odd, added });
      }
      return { result, trail };
    };

    const { result: atMostK, trail: trailK } = atMost(k);
    const { result: atMostKM1, trail: trailKM1 } = atMost(k - 1);

    steps.push({
      line: 4,
      explanation: `Computing atMost(${k}): count subarrays with at most ${k} odd numbers.`,
      variables: { limit: k },
      visualization: makeViz({}, {}),
    });

    for (const { left, right, odd, added } of trailK) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = nums[i] % 2 === 1 ? 'active' : 'comparing';
      }
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${k}): right=${right}, left=${left}, odd=${odd}. Adding ${added} subarrays.`,
        variables: { left, right, oddCount: odd, added, limit: k },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 4,
      explanation: `atMost(${k})=${atMostK}. Now computing atMost(${k - 1}).`,
      variables: { atMostK, nextLimit: k - 1 },
      visualization: makeViz({}, {}),
    });

    for (const { left, right, odd, added } of trailKM1) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = nums[i] % 2 === 1 ? 'found' : 'comparing';
      }
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `atMost(${k - 1}): right=${right}, left=${left}, odd=${odd}. Adding ${added} subarrays.`,
        variables: { left, right, oddCount: odd, added, limit: k - 1 },
        visualization: makeViz(highlights, labels),
      });
    }

    const result = atMostK - atMostKM1;

    steps.push({
      line: 2,
      explanation: `Done. exactly(${k}) = atMost(${k}) - atMost(${k - 1}) = ${atMostK} - ${atMostKM1} = ${result}.`,
      variables: { atMostK, atMostKM1, result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default countNumberOfNiceSubarrays;
