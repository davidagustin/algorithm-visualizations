import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countSubarraysWithFixedBounds: AlgorithmDefinition = {
  id: 'count-subarrays-with-fixed-bounds',
  title: 'Count Subarrays With Fixed Bounds',
  leetcodeNumber: 2444,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an integer array nums and two integers minK and maxK, a fixed-bound subarray has minimum element equal to minK and maximum element equal to maxK. Count the number of such subarrays. Track the last positions of minK, maxK, and any out-of-bound element. For each right index, count valid starting positions.',
  tags: ['sliding window', 'array', 'counting'],

  code: {
    pseudocode: `function countSubarrays(nums, minK, maxK):
  result = 0
  lastBad = -1
  lastMin = -1
  lastMax = -1
  for i in range(len(nums)):
    if nums[i] < minK or nums[i] > maxK:
      lastBad = i
    if nums[i] == minK:
      lastMin = i
    if nums[i] == maxK:
      lastMax = i
    result += max(0, min(lastMin, lastMax) - lastBad)
  return result`,

    python: `def countSubarrays(nums: list[int], minK: int, maxK: int) -> int:
    result = 0
    lastBad = lastMin = lastMax = -1
    for i, num in enumerate(nums):
        if num < minK or num > maxK:
            lastBad = i
        if num == minK:
            lastMin = i
        if num == maxK:
            lastMax = i
        result += max(0, min(lastMin, lastMax) - lastBad)
    return result`,

    javascript: `function countSubarrays(nums, minK, maxK) {
  let result = 0, lastBad = -1, lastMin = -1, lastMax = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minK || nums[i] > maxK) lastBad = i;
    if (nums[i] === minK) lastMin = i;
    if (nums[i] === maxK) lastMax = i;
    result += Math.max(0, Math.min(lastMin, lastMax) - lastBad);
  }
  return result;
}`,

    java: `public long countSubarrays(int[] nums, int minK, int maxK) {
    long result = 0;
    int lastBad = -1, lastMin = -1, lastMax = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] < minK || nums[i] > maxK) lastBad = i;
        if (nums[i] == minK) lastMin = i;
        if (nums[i] == maxK) lastMax = i;
        result += Math.max(0, Math.min(lastMin, lastMax) - lastBad);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 3, 5, 2, 7, 5],
    minK: 1,
    maxK: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5, 2, 7, 5],
      placeholder: '1,3,5,2,7,5',
      helperText: 'Array of integers',
    },
    {
      name: 'minK',
      label: 'Min Bound (minK)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Required minimum value in subarray',
    },
    {
      name: 'maxK',
      label: 'Max Bound (maxK)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Required maximum value in subarray',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const minK = input.minK as number;
    const maxK = input.maxK as number;
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

    let result = 0;
    let lastBad = -1;
    let lastMin = -1;
    let lastMax = -1;

    steps.push({
      line: 1,
      explanation: `Count subarrays where min=${minK} and max=${maxK}. Track last bad index (out-of-bounds value), last minK position, last maxK position.`,
      variables: { minK, maxK, lastBad: -1, lastMin: -1, lastMax: -1, result: 0 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const isBad = nums[i] < minK || nums[i] > maxK;
      const isMin = nums[i] === minK;
      const isMax = nums[i] === maxK;

      if (isBad) lastBad = i;
      if (isMin) lastMin = i;
      if (isMax) lastMax = i;

      const validStarts = Math.max(0, Math.min(lastMin, lastMax) - lastBad);
      result += validStarts;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      if (isBad) {
        highlights[i] = 'mismatch';
        labels[i] = 'bad';
      } else if (isMin && isMax) {
        highlights[i] = 'found';
        labels[i] = 'min=max';
      } else if (isMin) {
        highlights[i] = 'active';
        labels[i] = 'min';
      } else if (isMax) {
        highlights[i] = 'found';
        labels[i] = 'max';
      } else {
        highlights[i] = 'current';
      }

      if (lastBad >= 0) {
        highlights[lastBad] = 'mismatch';
        labels[lastBad] = 'bad';
      }

      steps.push({
        line: 6,
        explanation: `Index ${i}: value=${nums[i]}. ${isBad ? 'Out-of-bounds! lastBad=' + i : isMin ? 'Found minK! lastMin=' + i : isMax ? 'Found maxK! lastMax=' + i : 'In range'}. Valid starts this round=${validStarts}. Total=${result}.`,
        variables: { i, value: nums[i], lastBad, lastMin, lastMax, validStarts, result },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 13,
      explanation: `Done. Total subarrays with min=${minK} and max=${maxK} = ${result}.`,
      variables: { result, minK, maxK },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default countSubarraysWithFixedBounds;
