import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestNiceSubarray: AlgorithmDefinition = {
  id: 'longest-nice-subarray',
  title: 'Longest Nice Subarray',
  leetcodeNumber: 2401,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A subarray is called "nice" if the bitwise AND of every pair of elements in different positions is 0. This means no two elements share any set bit. Use a sliding window tracking which bits are used. When adding a new element conflicts with used bits, shrink from the left by un-setting those bits.',
  tags: ['sliding window', 'bit manipulation', 'array'],

  code: {
    pseudocode: `function longestNiceSubarray(nums):
  left = 0
  usedBits = 0
  result = 0
  for right in range(len(nums)):
    while usedBits & nums[right] != 0:
      usedBits ^= nums[left]
      left += 1
    usedBits |= nums[right]
    result = max(result, right - left + 1)
  return result`,

    python: `def longestNiceSubarray(nums: list[int]) -> int:
    left = 0
    usedBits = 0
    result = 0
    for right in range(len(nums)):
        while usedBits & nums[right]:
            usedBits ^= nums[left]
            left += 1
        usedBits |= nums[right]
        result = max(result, right - left + 1)
    return result`,

    javascript: `function longestNiceSubarray(nums) {
  let left = 0, usedBits = 0, result = 0;
  for (let right = 0; right < nums.length; right++) {
    while ((usedBits & nums[right]) !== 0) {
      usedBits ^= nums[left];
      left++;
    }
    usedBits |= nums[right];
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int longestNiceSubarray(int[] nums) {
    int left = 0, usedBits = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        while ((usedBits & nums[right]) != 0) {
            usedBits ^= nums[left++];
        }
        usedBits |= nums[right];
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, 8, 48, 10],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 8, 48, 10],
      placeholder: '1,3,8,48,10',
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
    let usedBits = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `A subarray is nice if all pairs have bitwise AND = 0 (no shared bits). Track usedBits to detect conflicts.`,
      variables: { left: 0, usedBits: '0b0', result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < nums.length; right++) {
      const conflictBits = usedBits & nums[right];

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = 'active';
      }
      highlights[right] = conflictBits !== 0 ? 'mismatch' : 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Check nums[${right}]=${nums[right]} (binary: ${nums[right].toString(2)}). usedBits=${usedBits.toString(2)}. Conflict bits=${conflictBits.toString(2)}.`,
        variables: { left, right, value: nums[right], usedBits: usedBits.toString(2), conflictBits: conflictBits.toString(2) },
        visualization: makeViz(highlights, labels),
      });

      while ((usedBits & nums[right]) !== 0) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) {
          shrinkHighlights[i] = 'active';
        }
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 6,
          explanation: `Conflict! Remove nums[${left}]=${nums[left]} (binary: ${nums[left].toString(2)}) from window by XOR-ing usedBits.`,
          variables: { left, right, removedValue: nums[left], prevUsedBits: usedBits.toString(2) },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        usedBits ^= nums[left];
        left++;
      }

      usedBits |= nums[right];
      result = Math.max(result, right - left + 1);

      const finalHighlights: Record<number, string> = {};
      const finalLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        finalHighlights[i] = result === right - left + 1 ? 'found' : 'active';
      }
      finalLabels[left] = 'L';
      finalLabels[right] = 'R';

      steps.push({
        line: 8,
        explanation: `Add nums[${right}]=${nums[right]} to window. usedBits=${usedBits.toString(2)}. Window length=${right - left + 1}. Best=${result}.`,
        variables: { left, right, usedBits: usedBits.toString(2), windowLength: right - left + 1, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. Longest nice subarray (all pairs have AND=0) has length ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestNiceSubarray;
