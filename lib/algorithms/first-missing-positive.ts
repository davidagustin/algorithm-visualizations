import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const firstMissingPositive: AlgorithmDefinition = {
  id: 'first-missing-positive',
  title: 'First Missing Positive',
  leetcodeNumber: 41,
  difficulty: 'Hard',
  category: 'Arrays',
  description:
    'Find the smallest missing positive integer from an unsorted array in O(n) time and O(1) space. Place each number in its correct position (num at index num-1), then scan for the first position where the value does not match.',
  tags: ['array', 'hash table', 'in-place', 'cyclic sort'],

  code: {
    pseudocode: `function firstMissingPositive(nums):
  n = length(nums)
  for i from 0 to n-1:
    while 1<=nums[i]<=n and nums[nums[i]-1]!=nums[i]:
      swap(nums[i], nums[nums[i]-1])
  for i from 0 to n-1:
    if nums[i] != i+1:
      return i+1
  return n+1`,

    python: `def firstMissingPositive(nums: list[int]) -> int:
    n = len(nums)
    for i in range(n):
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,

    javascript: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,

    java: `public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int j = nums[i] - 1;
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}`,
  },

  defaultInput: {
    nums: [3, 4, -1, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 4, -1, 1],
      placeholder: '3,4,-1,1',
      helperText: 'Unsorted integer array (can include negatives)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    steps.push({
      line: 1,
      explanation: `Array: ${JSON.stringify(nums)}, n=${n}. Phase 1: Cyclic sort - place each value v in position v-1 if 1 <= v <= n.`,
      variables: { n },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < n; i++) {
      while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
        const j = nums[i] - 1;

        steps.push({
          line: 4,
          explanation: `nums[${i}]=${nums[i]} should be at index ${j}. Swap nums[${i}] and nums[${j}].`,
          variables: { i, j, 'nums[i]': nums[i], 'nums[j]': nums[j] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'swapping', [j]: 'swapping' },
            labels: { [i]: `i`, [j]: `j` },
          },
        });

        [nums[i], nums[j]] = [nums[j], nums[i]];

        steps.push({
          line: 4,
          explanation: `After swap: ${JSON.stringify(nums)}.`,
          variables: { nums: JSON.stringify(nums) },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active', [j]: 'sorted' },
            labels: { [j]: `${nums[j]}` },
          },
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Phase 1 complete. Array: ${JSON.stringify(nums)}. Phase 2: Find first index where nums[i] != i+1.`,
      variables: { nums: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((_, i) => [i, String(i + 1)])),
      },
    });

    for (let i = 0; i < n; i++) {
      if (nums[i] !== i + 1) {
        steps.push({
          line: 7,
          explanation: `nums[${i}]=${nums[i]} != ${i + 1}. First missing positive is ${i + 1}.`,
          variables: { i, value: nums[i], expected: i + 1, result: i + 1 },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'mismatch' },
            labels: { [i]: `expect ${i + 1}` },
          },
        });
        return steps;
      }
      steps.push({
        line: 6,
        explanation: `nums[${i}]=${nums[i]} == ${i + 1}. This position is filled correctly.`,
        variables: { i, value: nums[i] },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'sorted' },
          labels: { [i]: 'ok' },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `All positions 1..${n} filled correctly. First missing positive is ${n + 1}.`,
      variables: { result: n + 1 },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default firstMissingPositive;
