import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findPeakElement: AlgorithmDefinition = {
  id: 'find-peak-element',
  title: 'Find Peak Element',
  leetcodeNumber: 162,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find a peak element (strictly greater than its neighbors) in O(log n). Binary search: if nums[mid] < nums[mid+1], the peak is to the right; otherwise it is at mid or to the left.',
  tags: ['binary search', 'array'],

  code: {
    pseudocode: `function findPeakElement(nums):
  lo = 0, hi = len(nums) - 1
  while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] < nums[mid + 1]:
      lo = mid + 1
    else:
      hi = mid
  return lo`,
    python: `def findPeakElement(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
    javascript: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,
    java: `public int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 1],
      placeholder: '1,2,3,1',
      helperText: 'Comma-separated integers (no two adjacent equal)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let lo = 0;
    let hi = nums.length - 1;

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}]. Binary search for peak. lo=${lo}, hi=${hi}.`,
      variables: { lo, hi },
      visualization: makeViz({ [lo]: 'active', [hi]: 'active' }, { [lo]: 'lo', [hi]: 'hi' }),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;

      steps.push({
        line: 4,
        explanation: `mid=${mid}. nums[mid]=${nums[mid]}, nums[mid+1]=${nums[mid + 1]}.`,
        variables: { lo, mid, hi, 'nums[mid]': nums[mid], 'nums[mid+1]': nums[mid + 1] },
        visualization: makeViz(
          { [lo]: 'active', [mid]: 'comparing', [mid + 1]: 'comparing', [hi]: 'active' },
          { [lo]: 'lo', [mid]: 'mid', [mid + 1]: 'mid+1', [hi]: 'hi' }
        ),
      });

      if (nums[mid] < nums[mid + 1]) {
        steps.push({
          line: 5,
          explanation: `nums[${mid}]=${nums[mid]} < nums[${mid + 1}]=${nums[mid + 1]}. Peak is in right half. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(
            { [mid]: 'mismatch', [mid + 1]: 'active', [hi]: 'active' },
            { [mid]: 'skip', [mid + 1]: 'lo', [hi]: 'hi' }
          ),
        });
        lo = mid + 1;
      } else {
        steps.push({
          line: 7,
          explanation: `nums[${mid}]=${nums[mid]} >= nums[${mid + 1}]=${nums[mid + 1]}. Peak is at mid or left. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(
            { [lo]: 'active', [mid]: 'active' },
            { [lo]: 'lo', [mid]: 'hi' }
          ),
        });
        hi = mid;
      }
    }

    steps.push({
      line: 8,
      explanation: `Peak found at index ${lo}. nums[${lo}]=${nums[lo]} is a peak element.`,
      variables: { result: lo, 'nums[lo]': nums[lo] },
      visualization: makeViz(
        { [lo]: 'found' },
        { [lo]: `peak=${nums[lo]}` }
      ),
    });

    return steps;
  },
};

export default findPeakElement;
