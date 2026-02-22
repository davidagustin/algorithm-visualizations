import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestNumberAtLeastTwice: AlgorithmDefinition = {
  id: 'largest-number-at-least-twice',
  title: 'Largest Number At Least Twice of Others',
  leetcodeNumber: 747,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Determine if the largest element in the array is at least twice as large as every other element. If so, return the index of the largest element; otherwise return -1. Find the largest and second largest, then check if largest >= 2 * secondLargest.',
  tags: ['array', 'sorting', 'linear scan'],

  code: {
    pseudocode: `function dominantIndex(nums):
  maxIdx = index of max element
  for i in range(len(nums)):
    if i != maxIdx:
      if nums[maxIdx] < 2 * nums[i]:
        return -1
  return maxIdx`,
    python: `def dominantIndex(nums):
    max_idx = nums.index(max(nums))
    for i, x in enumerate(nums):
        if i != max_idx and nums[max_idx] < 2 * x:
            return -1
    return max_idx`,
    javascript: `function dominantIndex(nums) {
  const maxVal = Math.max(...nums);
  const maxIdx = nums.indexOf(maxVal);
  for (let i = 0; i < nums.length; i++) {
    if (i !== maxIdx && maxVal < 2 * nums[i]) return -1;
  }
  return maxIdx;
}`,
    java: `public int dominantIndex(int[] nums) {
    int maxIdx = 0;
    for (int i = 1; i < nums.length; i++)
        if (nums[i] > nums[maxIdx]) maxIdx = i;
    for (int i = 0; i < nums.length; i++)
        if (i != maxIdx && nums[maxIdx] < 2 * nums[i]) return -1;
    return maxIdx;
}`,
  },

  defaultInput: {
    nums: [3, 6, 1, 0],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 6, 1, 0],
      placeholder: '3,6,1,0',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const maxVal = Math.max(...nums);
    const maxIdx = nums.indexOf(maxVal);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find maximum element. Max = ${maxVal} at index ${maxIdx}.`,
      variables: { maxVal, maxIdx },
      visualization: makeViz({ [maxIdx]: 'found' }, { [maxIdx]: 'MAX' }),
    });

    let dominant = true;
    for (let i = 0; i < nums.length; i++) {
      if (i === maxIdx) continue;
      const threshold = 2 * nums[i];
      steps.push({
        line: 3,
        explanation: `Compare: nums[${maxIdx}]=${maxVal} vs 2 * nums[${i}]=${threshold}. ${maxVal >= threshold ? 'OK, max is large enough.' : 'FAIL, max is not twice this element.'}`,
        variables: { comparing: `nums[${i}]=${nums[i]}`, threshold, maxVal, passes: maxVal >= threshold },
        visualization: makeViz(
          { [maxIdx]: 'found', [i]: maxVal >= threshold ? 'sorted' : 'mismatch' },
          { [maxIdx]: 'MAX', [i]: `2x=${threshold}` }
        ),
      });

      if (maxVal < threshold) {
        dominant = false;
        steps.push({
          line: 5,
          explanation: `${maxVal} < ${threshold}. The largest element is NOT at least twice ${nums[i]}. Return -1.`,
          variables: { result: -1 },
          visualization: makeViz(
            { [maxIdx]: 'comparing', [i]: 'mismatch' },
            { [maxIdx]: 'MAX', [i]: 'blocker' }
          ),
        });
        return steps;
      }
    }

    if (dominant) {
      steps.push({
        line: 6,
        explanation: `Max element ${maxVal} at index ${maxIdx} is at least twice every other element. Return ${maxIdx}.`,
        variables: { result: maxIdx },
        visualization: makeViz(
          { [maxIdx]: 'found', ...Object.fromEntries(nums.map((_, i) => i !== maxIdx ? [i, 'sorted'] : []).filter(x => x.length > 0)) },
          { [maxIdx]: 'DOMINANT' }
        ),
      });
    }

    return steps;
  },
};

export default largestNumberAtLeastTwice;
