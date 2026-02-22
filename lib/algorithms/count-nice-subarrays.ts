import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNiceSubarrays: AlgorithmDefinition = {
  id: 'count-nice-subarrays',
  title: 'Count Number of Nice Subarrays',
  leetcodeNumber: 1248,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of integers and k, return the number of nice subarrays — subarrays containing exactly k odd numbers. Uses the "at most k" trick: count(exactly k) = count(at most k) - count(at most k-1).',
  tags: ['sliding window', 'prefix sum', 'two pointers', 'counting'],

  code: {
    pseudocode: `function numberOfSubarrays(nums, k):
  return atMost(nums, k) - atMost(nums, k-1)

function atMost(nums, k):
  left = 0, odds = 0, count = 0
  for right = 0 to len(nums)-1:
    if nums[right] is odd: odds += 1
    while odds > k:
      if nums[left] is odd: odds -= 1
      left += 1
    count += right - left + 1
  return count`,

    python: `def numberOfSubarrays(nums: list[int], k: int) -> int:
    def atMost(k):
        left = odds = count = 0
        for right in range(len(nums)):
            if nums[right] % 2 == 1:
                odds += 1
            while odds > k:
                if nums[left] % 2 == 1:
                    odds -= 1
                left += 1
            count += right - left + 1
        return count
    return atMost(k) - atMost(k - 1)`,

    javascript: `function numberOfSubarrays(nums, k) {
  const atMost = (k) => {
    let left = 0, odds = 0, count = 0;
    for (let right = 0; right < nums.length; right++) {
      if (nums[right] % 2 === 1) odds++;
      while (odds > k) {
        if (nums[left] % 2 === 1) odds--;
        left++;
      }
      count += right - left + 1;
    }
    return count;
  };
  return atMost(k) - atMost(k - 1);
}`,

    java: `public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}
private int atMost(int[] nums, int k) {
    int left = 0, odds = 0, count = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odds++;
        while (odds > k) {
            if (nums[left] % 2 == 1) odds--;
            left++;
        }
        count += right - left + 1;
    }
    return count;
}`,
  },

  defaultInput: { nums: [1, 1, 2, 1, 1], k: 3 },

  inputFields: [
    {
      name: 'nums',
      label: 'Integer Array',
      type: 'array',
      defaultValue: [1, 1, 2, 1, 1],
      placeholder: '1,1,2,1,1',
      helperText: 'Array of integers',
    },
    {
      name: 'k',
      label: 'Exact Odd Count (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of odd integers each subarray must have',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]) || [1, 1, 2, 1, 1];
    const k = (input.k as number) ?? 3;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      count: number,
      odds: number,
      windowLeft: number,
      windowRight: number
    ): ArrayVisualization => ({
      type: 'array',
      array: nums,
      highlights,
      labels,
      auxData: {
        label: 'Algorithm State',
        entries: [
          { key: 'odds in window', value: `${odds}` },
          { key: 'subarrays found', value: `${count}` },
          { key: 'window', value: windowRight >= windowLeft ? `[${windowLeft}..${windowRight}]` : 'empty' },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Count subarrays with exactly k=${k} odd numbers. Strategy: atMost(k) - atMost(k-1). Now running atMost(k=${k}).`,
      variables: { k, strategy: 'atMost(k) - atMost(k-1)' },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v % 2 === 1 ? 'comparing' : 'default'])),
        Object.fromEntries(nums.map((v, i) => [i, v % 2 === 1 ? 'odd' : ''])),
        0, 0, 0, -1
      ),
    });

    // Run atMost(k)
    const atMostK = (() => {
      let left = 0, odds = 0, count = 0;
      for (let right = 0; right < n; right++) {
        if (nums[right] % 2 === 1) odds++;
        while (odds > k) {
          if (nums[left] % 2 === 1) odds--;
          left++;
        }
        count += right - left + 1;
      }
      return count;
    })();

    const atMostKm1 = (() => {
      let left = 0, odds = 0, count = 0;
      for (let right = 0; right < n; right++) {
        if (nums[right] % 2 === 1) odds++;
        while (odds > k - 1) {
          if (nums[left] % 2 === 1) odds--;
          left++;
        }
        count += right - left + 1;
      }
      return count;
    })();

    // Now simulate step-by-step for atMost(k)
    let left = 0;
    let odds = 0;
    let count = 0;

    for (let right = 0; right < n; right++) {
      if (nums[right] % 2 === 1) odds++;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = left; i <= right; i++) h[i] = nums[i] % 2 === 1 ? 'active' : 'sorted';
      h[right] = nums[right] % 2 === 1 ? 'comparing' : 'visited';
      l[left] = 'L';
      l[right] = 'R';

      while (odds > k) {
        if (nums[left] % 2 === 1) odds--;
        h[left] = 'mismatch';
        steps.push({
          line: 8,
          explanation: `odds(${odds + (nums[left] % 2 === 1 ? 1 : 0)}) > k(${k}). Remove nums[${left}]=${nums[left]} from window. Move left to ${left + 1}.`,
          variables: { left: left + 1, right, odds, count },
          visualization: makeViz(h, l, count, odds, left + 1, right),
        });
        left++;
        if (left <= right) l[left] = 'L';
      }

      count += right - left + 1;

      steps.push({
        line: 10,
        explanation: `Window [${left}..${right}] has ${odds} odd(s) <= k=${k}. Adds ${right - left + 1} valid subarrays ending at index ${right}. Total count=${count}.`,
        variables: { left, right, odds, addedSubarrays: right - left + 1, count },
        visualization: makeViz(
          Object.fromEntries([...Array(n)].map((_, i) => [i, i < left ? 'visited' : i <= right ? (nums[i] % 2 === 1 ? 'found' : 'active') : 'default'])),
          { [left]: 'L', [right]: 'R' },
          count, odds, left, right
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `atMost(${k})=${atMostK}, atMost(${k - 1})=${atMostKm1}. Result = ${atMostK} - ${atMostKm1} = ${atMostK - atMostKm1} nice subarrays with exactly ${k} odd numbers.`,
      variables: { atMostK, atMostKm1, result: atMostK - atMostKm1 },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v % 2 === 1 ? 'found' : 'active'])),
        {},
        atMostK - atMostKm1, 0, 0, n - 1
      ),
    });

    return steps;
  },
};

export default countNiceSubarrays;
