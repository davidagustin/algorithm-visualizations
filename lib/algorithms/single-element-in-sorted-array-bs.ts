import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const singleElementInSortedArrayBs: AlgorithmDefinition = {
  id: 'single-element-in-sorted-array-bs',
  title: 'Single Element in a Sorted Array (Binary Search)',
  leetcodeNumber: 540,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find the single non-duplicate element in a sorted array where every other element appears exactly twice. Binary search on even indices: if nums[mid] == nums[mid+1], the single element is to the right; otherwise it is at mid or to the left.',
  tags: ['binary search', 'array', 'bit manipulation'],

  code: {
    pseudocode: `function singleNonDuplicate(nums):
  lo = 0, hi = len(nums) - 1
  while lo < hi:
    mid = (lo + hi) / 2
    if mid is odd: mid -= 1  (ensure mid is even)
    if nums[mid] == nums[mid + 1]:
      lo = mid + 2
    else:
      hi = mid
  return nums[lo]`,
    python: `def singleNonDuplicate(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mid % 2 == 1:
            mid -= 1
        if nums[mid] == nums[mid + 1]:
            lo = mid + 2
        else:
            hi = mid
    return nums[lo]`,
    javascript: `function singleNonDuplicate(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2 === 1) mid--;
    if (nums[mid] === nums[mid + 1]) lo = mid + 2;
    else hi = mid;
  }
  return nums[lo];
}`,
    java: `public int singleNonDuplicate(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (mid % 2 == 1) mid--;
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return nums[lo];
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 3, 3, 4, 4, 8, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 1, 2, 3, 3, 4, 4, 8, 8],
      placeholder: '1,1,2,3,3,4,4,8,8',
      helperText: 'Sorted array where every element appears twice except one',
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
      explanation: `nums=[${nums.join(', ')}]. Find single element. Key insight: before the single element, pairs start at even indices. lo=${lo}, hi=${hi}.`,
      variables: { lo, hi },
      visualization: makeViz({ [lo]: 'active', [hi]: 'active' }, { [lo]: 'lo', [hi]: 'hi' }),
    });

    while (lo < hi) {
      let mid = (lo + hi) >> 1;

      steps.push({
        line: 3,
        explanation: `mid=${mid}${mid % 2 === 1 ? ' (odd, adjust to ' + (mid - 1) + ')' : ' (even, good)'}.`,
        variables: { lo, mid, hi },
        visualization: makeViz(
          { [lo]: 'active', [mid]: 'comparing', [hi]: 'active' },
          { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' }
        ),
      });

      if (mid % 2 === 1) mid--;

      steps.push({
        line: 5,
        explanation: `Even mid=${mid}. Compare nums[${mid}]=${nums[mid]} with nums[${mid + 1}]=${nums[mid + 1]}.`,
        variables: { lo, mid, hi, 'nums[mid]': nums[mid], 'nums[mid+1]': nums[mid + 1] },
        visualization: makeViz(
          { [lo]: 'active', [mid]: 'comparing', [mid + 1]: 'comparing', [hi]: 'active' },
          { [lo]: 'lo', [mid]: `${nums[mid]}`, [mid + 1]: `${nums[mid + 1]}`, [hi]: 'hi' }
        ),
      });

      if (nums[mid] === nums[mid + 1]) {
        steps.push({
          line: 6,
          explanation: `nums[${mid}]=nums[${mid + 1}]=${nums[mid]}. Pair is intact here. Single element is to the right. lo=${mid + 2}.`,
          variables: { lo: mid + 2, hi },
          visualization: makeViz(
            { [mid]: 'sorted', [mid + 1]: 'sorted' },
            { [mid]: 'pair', [mid + 1]: 'pair' }
          ),
        });
        lo = mid + 2;
      } else {
        steps.push({
          line: 8,
          explanation: `nums[${mid}]=${nums[mid]} != nums[${mid + 1}]=${nums[mid + 1]}. Pair is broken. Single element at mid or left. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(
            { [mid]: 'active', [mid + 1]: 'mismatch' },
            { [mid]: 'hi', [mid + 1]: 'diff' }
          ),
        });
        hi = mid;
      }
    }

    steps.push({
      line: 9,
      explanation: `Single element found at index ${lo}: nums[${lo}]=${nums[lo]}.`,
      variables: { result: nums[lo], index: lo },
      visualization: makeViz(
        { [lo]: 'found' },
        { [lo]: `SINGLE=${nums[lo]}` }
      ),
    });

    return steps;
  },
};

export default singleElementInSortedArrayBs;
