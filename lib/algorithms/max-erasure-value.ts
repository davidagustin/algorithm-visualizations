import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxErasureValue: AlgorithmDefinition = {
  id: 'max-erasure-value',
  title: 'Maximum Erasure Value',
  leetcodeNumber: 1695,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given an array of positive integers nums, you can erase a subarray containing unique elements and earn a score equal to its sum. Find the maximum score achievable. Use a sliding window with a set to track unique elements. When a duplicate is encountered, shrink from the left until the duplicate is removed. Track maximum window sum.',
  tags: ['sliding window', 'hash set', 'array', 'unique elements'],

  code: {
    pseudocode: `function maximumUniqueSubarray(nums):
  left = 0
  seen = {}
  currentSum = 0
  result = 0
  for right in range(len(nums)):
    while nums[right] in seen:
      seen.remove(nums[left])
      currentSum -= nums[left]
      left += 1
    seen.add(nums[right])
    currentSum += nums[right]
    result = max(result, currentSum)
  return result`,

    python: `def maximumUniqueSubarray(nums: list[int]) -> int:
    left = 0
    seen = set()
    currentSum = 0
    result = 0
    for right in range(len(nums)):
        while nums[right] in seen:
            seen.discard(nums[left])
            currentSum -= nums[left]
            left += 1
        seen.add(nums[right])
        currentSum += nums[right]
        result = max(result, currentSum)
    return result`,

    javascript: `function maximumUniqueSubarray(nums) {
  let left = 0, currentSum = 0, result = 0;
  const seen = new Set();
  for (let right = 0; right < nums.length; right++) {
    while (seen.has(nums[right])) {
      seen.delete(nums[left]);
      currentSum -= nums[left];
      left++;
    }
    seen.add(nums[right]);
    currentSum += nums[right];
    result = Math.max(result, currentSum);
  }
  return result;
}`,

    java: `public int maximumUniqueSubarray(int[] nums) {
    int left = 0, currentSum = 0, result = 0;
    Set<Integer> seen = new HashSet<>();
    for (int right = 0; right < nums.length; right++) {
        while (seen.contains(nums[right])) {
            seen.remove(nums[left]);
            currentSum -= nums[left++];
        }
        seen.add(nums[right]);
        currentSum += nums[right];
        result = Math.max(result, currentSum);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [4, 2, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 2, 4, 5, 6],
      placeholder: '4,2,4,5,6',
      helperText: 'Array of positive integers',
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

    let left = 0;
    const seen = new Set<number>();
    let currentSum = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `Find max sum subarray with all unique elements. Array: [${nums.join(', ')}].`,
      variables: { left: 0, currentSum: 0, result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < nums.length; right++) {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) highlights[i] = 'active';
      highlights[right] = seen.has(nums[right]) ? 'mismatch' : 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 6,
        explanation: `Check nums[${right}]=${nums[right]}. ${seen.has(nums[right]) ? 'Duplicate found!' : 'Unique.'} Current window sum=${currentSum}.`,
        variables: { left, right, value: nums[right], isDuplicate: seen.has(nums[right]), currentSum },
        visualization: makeViz(highlights, labels),
      });

      while (seen.has(nums[right])) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) shrinkHighlights[i] = 'active';
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Duplicate ${nums[right]}! Remove nums[${left}]=${nums[left]} from left. currentSum=${currentSum - nums[left]}.`,
          variables: { left, right, removedValue: nums[left], newSum: currentSum - nums[left] },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        seen.delete(nums[left]);
        currentSum -= nums[left];
        left++;
      }

      seen.add(nums[right]);
      currentSum += nums[right];
      result = Math.max(result, currentSum);

      const finalHighlights: Record<number, string> = {};
      const finalLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        finalHighlights[i] = result === currentSum ? 'found' : 'active';
      }
      finalLabels[left] = 'L';
      finalLabels[right] = 'R';

      steps.push({
        line: 11,
        explanation: `Window [${left}, ${right}] all unique. Sum=${currentSum}. Best result=${result}.`,
        variables: { left, right, currentSum, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Maximum erasure value (max unique subarray sum) = ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxErasureValue;
