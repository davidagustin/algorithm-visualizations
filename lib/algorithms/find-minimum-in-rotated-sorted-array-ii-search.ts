import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findMinInRotatedSortedArrayIISearch: AlgorithmDefinition = {
  id: 'find-minimum-in-rotated-sorted-array-ii-search',
  title: 'Find Minimum in Rotated Sorted Array II',
  leetcodeNumber: 154,
  difficulty: 'Hard',
  category: 'Sorting',
  description:
    'LC 154: Find minimum in a rotated sorted array that may contain duplicates. Binary search with duplicate handling: when nums[mid]==nums[hi], shrink hi by 1. Worst case O(n).',
  tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Sorting', 'Duplicates'],
  code: {
    pseudocode: `function findMin(nums):
  lo = 0, hi = n - 1
  while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] > nums[hi]:
      lo = mid + 1   # min is in right half
    elif nums[mid] < nums[hi]:
      hi = mid       # min is at mid or left
    else:
      hi--           # can't determine, shrink hi
  return nums[lo]`,
    python: `def findMin(nums):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        elif nums[mid] < nums[hi]:
            hi = mid
        else:
            hi -= 1
    return nums[lo]`,
    javascript: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else if (nums[mid] < nums[hi]) hi = mid;
    else hi--;
  }
  return nums[lo];
}`,
    java: `public int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else if (nums[mid] < nums[hi]) hi = mid;
        else hi--;
    }
    return nums[lo];
}`,
  },
  defaultInput: { nums: [2, 2, 2, 0, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Rotated Sorted Array',
      type: 'array',
      defaultValue: [2, 2, 2, 0, 1],
      placeholder: '2,2,2,0,1',
      helperText: 'Rotated sorted array with possible duplicates',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Find Min Rotated II', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find minimum in rotated sorted array [${nums.join(', ')}] (may have duplicates).`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    let lo = 0, hi = nums.length - 1;

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const hl: Record<number, string> = {};
      hl[lo] = 'pointer';
      hl[mid] = 'active';
      hl[hi] = 'comparing';

      steps.push({
        line: 3,
        explanation: `lo=${lo}(${nums[lo]}), hi=${hi}(${nums[hi]}), mid=${mid}(${nums[mid]}).`,
        variables: { lo, hi, mid, midVal: nums[mid], hiVal: nums[hi] },
        visualization: makeViz(hl, { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' },
          [{ key: 'nums[mid]', value: String(nums[mid]) }, { key: 'nums[hi]', value: String(nums[hi]) }]),
      });

      if (nums[mid] > nums[hi]) {
        steps.push({
          line: 5,
          explanation: `nums[${mid}]=${nums[mid]} > nums[${hi}]=${nums[hi]}. Rotation point in right half. lo=${mid + 1}.`,
          variables: { lo: mid + 1 },
          visualization: makeViz({ ...hl, [mid]: 'visited' }, {},
            [{ key: 'Direction', value: 'Right (min in right)' }]),
        });
        lo = mid + 1;
      } else if (nums[mid] < nums[hi]) {
        steps.push({
          line: 7,
          explanation: `nums[${mid}]=${nums[mid]} < nums[${hi}]=${nums[hi]}. Min is at mid or left. hi=${mid}.`,
          variables: { hi: mid },
          visualization: makeViz({ ...hl, [mid]: 'found' }, {},
            [{ key: 'Direction', value: 'Left (min at mid or left)' }]),
        });
        hi = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `nums[${mid}]=${nums[mid]} == nums[${hi}]=${nums[hi]}. Can't determine. Shrink hi: hi=${hi - 1}.`,
          variables: { hi: hi - 1 },
          visualization: makeViz({ ...hl, [hi]: 'visited' }, {},
            [{ key: 'Duplicate', value: 'Shrink hi by 1' }]),
        });
        hi--;
      }
    }

    steps.push({
      line: 1,
      explanation: `Minimum is nums[${lo}]=${nums[lo]}.`,
      variables: { minimum: nums[lo], index: lo },
      visualization: makeViz(
        { ...Object.fromEntries(nums.map((_, i) => [i, 'visited'])), [lo]: 'found' },
        { [lo]: 'min' },
        [{ key: 'Minimum', value: String(nums[lo]) }],
      ),
    });

    return steps;
  },
};

export default findMinInRotatedSortedArrayIISearch;
