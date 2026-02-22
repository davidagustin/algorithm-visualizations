import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumOperationsReduceXToZero: AlgorithmDefinition = {
  id: 'minimum-operations-reduce-x-to-zero',
  title: 'Minimum Operations to Reduce X to Zero',
  leetcodeNumber: 1658,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and integer x, in one operation you can remove either the leftmost or rightmost element from nums and subtract its value from x. Return the minimum number of operations to reduce x to exactly 0, or -1 if impossible. Equivalently, find the longest subarray in the middle with sum equal to total - x.',
  tags: ['sliding window', 'array', 'prefix sum', 'hash map'],

  code: {
    pseudocode: `function minOperations(nums, x):
  target = sum(nums) - x
  if target < 0: return -1
  if target == 0: return len(nums)
  left = 0
  currentSum = 0
  maxLen = -1
  for right in range(len(nums)):
    currentSum += nums[right]
    while currentSum > target:
      currentSum -= nums[left]
      left += 1
    if currentSum == target:
      maxLen = max(maxLen, right - left + 1)
  return len(nums) - maxLen if maxLen != -1 else -1`,

    python: `def minOperations(nums: list[int], x: int) -> int:
    target = sum(nums) - x
    if target < 0: return -1
    if target == 0: return len(nums)
    left = 0
    currentSum = 0
    maxLen = -1
    for right in range(len(nums)):
        currentSum += nums[right]
        while currentSum > target:
            currentSum -= nums[left]
            left += 1
        if currentSum == target:
            maxLen = max(maxLen, right - left + 1)
    return len(nums) - maxLen if maxLen != -1 else -1`,

    javascript: `function minOperations(nums, x) {
  const target = nums.reduce((a, b) => a + b, 0) - x;
  if (target < 0) return -1;
  if (target === 0) return nums.length;
  let left = 0, currentSum = 0, maxLen = -1;
  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum > target) {
      currentSum -= nums[left++];
    }
    if (currentSum === target) {
      maxLen = Math.max(maxLen, right - left + 1);
    }
  }
  return maxLen === -1 ? -1 : nums.length - maxLen;
}`,

    java: `public int minOperations(int[] nums, int x) {
    int target = Arrays.stream(nums).sum() - x;
    if (target < 0) return -1;
    if (target == 0) return nums.length;
    int left = 0, currentSum = 0, maxLen = -1;
    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        while (currentSum > target) currentSum -= nums[left++];
        if (currentSum == target) maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen == -1 ? -1 : nums.length - maxLen;
}`,
  },

  defaultInput: {
    nums: [1, 1, 4, 2, 3],
    x: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 4, 2, 3],
      placeholder: '1,1,4,2,3',
      helperText: 'Array of positive integers',
    },
    {
      name: 'x',
      label: 'Target (x)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Value to reduce to zero',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];
    const total = nums.reduce((a, b) => a + b, 0);
    const target = total - x;

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
      explanation: `Total sum=${total}, x=${x}. We need middle subarray sum = total - x = ${target}. Minimizing operations = maximizing middle subarray length.`,
      variables: { total, x, target },
      visualization: makeViz({}, {}),
    });

    if (target < 0) {
      steps.push({
        line: 2,
        explanation: `Target ${target} < 0. Impossible to reduce x to 0. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    if (target === 0) {
      steps.push({
        line: 3,
        explanation: `Target=0, meaning we need to use all elements (no middle subarray). Answer = ${nums.length}.`,
        variables: { result: nums.length },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'found'])),
          {}
        ),
      });
      return steps;
    }

    let left = 0;
    let currentSum = 0;
    let maxLen = -1;

    for (let right = 0; right < nums.length; right++) {
      currentSum += nums[right];

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) highlights[i] = 'active';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `Expand right to index ${right} (value ${nums[right]}). currentSum=${currentSum}, target=${target}.`,
        variables: { left, right, currentSum, target },
        visualization: makeViz(highlights, labels),
      });

      while (currentSum > target) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) shrinkHighlights[i] = 'active';
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 10,
          explanation: `currentSum ${currentSum} > target ${target}. Remove nums[${left}]=${nums[left]} from left.`,
          variables: { left, right, removedValue: nums[left], currentSum, target },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        currentSum -= nums[left];
        left++;
      }

      if (currentSum === target) {
        const windowLen = right - left + 1;
        maxLen = Math.max(maxLen, windowLen);
        const foundHighlights: Record<number, string> = {};
        const foundLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) foundHighlights[i] = 'found';
        foundLabels[left] = 'L';
        foundLabels[right] = 'R';

        steps.push({
          line: 13,
          explanation: `currentSum=${currentSum} matches target! Window [${left},${right}] length=${windowLen}. Operations needed=${nums.length - windowLen}. Best maxLen=${maxLen}.`,
          variables: { left, right, currentSum, windowLen, operations: nums.length - windowLen, maxLen },
          visualization: makeViz(foundHighlights, foundLabels),
        });
      }
    }

    const result = maxLen === -1 ? -1 : nums.length - maxLen;

    steps.push({
      line: 14,
      explanation: `Done. Longest middle subarray with sum=${target} has length ${maxLen}. Minimum operations = ${nums.length} - ${maxLen} = ${result}.`,
      variables: { maxLen, result, total, x },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default minimumOperationsReduceXToZero;
