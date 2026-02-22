import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findFirstAndLastPositionII: AlgorithmDefinition = {
  id: 'find-first-and-last-position-ii',
  title: 'Find First and Last Position II',
  leetcodeNumber: 34,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 34: Find the starting and ending position of a target in a sorted array. Run binary search twice: once biased left (first occurrence), once biased right (last occurrence). O(log n).',
  tags: ['Binary Search', 'Array', 'Sorting'],
  code: {
    pseudocode: `function searchRange(nums, target):
  first = binarySearch(nums, target, true)
  last = binarySearch(nums, target, false)
  return [first, last]

function binarySearch(nums, target, findFirst):
  lo = 0, hi = n-1, result = -1
  while lo <= hi:
    mid = (lo+hi)/2
    if nums[mid] == target:
      result = mid
      if findFirst: hi = mid-1  # continue left
      else: lo = mid+1  # continue right
    elif nums[mid] < target: lo = mid+1
    else: hi = mid-1
  return result`,
    python: `def searchRange(nums, target):
    def binary_search(find_first):
        lo, hi, result = 0, len(nums)-1, -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                result = mid
                if find_first: hi = mid - 1
                else: lo = mid + 1
            elif nums[mid] < target: lo = mid + 1
            else: hi = mid - 1
        return result
    return [binary_search(True), binary_search(False)]`,
    javascript: `function searchRange(nums, target) {
  function bs(findFirst) {
    let lo = 0, hi = nums.length - 1, result = -1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] === target) {
        result = mid;
        if (findFirst) hi = mid - 1;
        else lo = mid + 1;
      } else if (nums[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return result;
  }
  return [bs(true), bs(false)];
}`,
    java: `public int[] searchRange(int[] nums, int target) {
    return new int[]{binarySearch(nums, target, true), binarySearch(nums, target, false)};
}
private int binarySearch(int[] nums, int target, boolean findFirst) {
    int lo = 0, hi = nums.length - 1, result = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            result = mid;
            if (findFirst) hi = mid - 1;
            else lo = mid + 1;
        } else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return result;
}`,
  },
  defaultInput: { nums: [5, 7, 7, 8, 8, 10], target: 8 },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [5, 7, 7, 8, 8, 10],
      placeholder: '5,7,7,8,8,10',
      helperText: 'Sorted array of integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Value to find range of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const target = input.target as number;
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
      ...(auxEntries ? { auxData: { label: 'First & Last Pos', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find first and last position of ${target} in [${nums.join(', ')}].`,
      variables: { nums: [...nums], target },
      visualization: makeViz({}, {},
        [{ key: 'Target', value: String(target) }]),
    });

    function binarySearch(findFirst: boolean): number {
      let lo = 0, hi = nums.length - 1, result = -1;

      steps.push({
        line: 5,
        explanation: `Binary search for ${findFirst ? 'first' : 'last'} occurrence of ${target}.`,
        variables: { findFirst, lo, hi },
        visualization: makeViz(
          Object.fromEntries(nums.map((_, i) => [i, 'comparing'])),
          { [0]: 'lo', [nums.length - 1]: 'hi' },
          [{ key: 'Search', value: findFirst ? 'First' : 'Last' }],
        ),
      });

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const hl: Record<number, string> = {};
        if (lo <= nums.length - 1) hl[lo] = 'pointer';
        hl[mid] = 'active';
        if (hi <= nums.length - 1) hl[hi] = 'comparing';

        steps.push({
          line: 8,
          explanation: `lo=${lo}, hi=${hi}, mid=${mid}, nums[mid]=${nums[mid]}.`,
          variables: { lo, hi, mid, value: nums[mid] },
          visualization: makeViz(hl, { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' },
            [{ key: 'nums[mid]', value: String(nums[mid]) }, { key: 'target', value: String(target) }]),
        });

        if (nums[mid] === target) {
          result = mid;
          steps.push({
            line: 9,
            explanation: `Found target at index ${mid}. ${findFirst ? 'Continue left for first.' : 'Continue right for last.'}`,
            variables: { result, mid },
            visualization: makeViz({ ...hl, [mid]: 'found' }, { [mid]: findFirst ? 'first?' : 'last?' },
              [{ key: 'Found', value: String(mid) }, { key: 'Next', value: findFirst ? 'go left' : 'go right' }]),
          });
          if (findFirst) hi = mid - 1;
          else lo = mid + 1;
        } else if (nums[mid] < target) {
          lo = mid + 1;
          steps.push({
            line: 12,
            explanation: `nums[${mid}]=${nums[mid]} < target=${target}. Go right.`,
            variables: { lo },
            visualization: makeViz({ [mid]: 'visited' }, {},
              [{ key: 'Direction', value: 'Right' }]),
          });
        } else {
          hi = mid - 1;
          steps.push({
            line: 13,
            explanation: `nums[${mid}]=${nums[mid]} > target=${target}. Go left.`,
            variables: { hi },
            visualization: makeViz({ [mid]: 'visited' }, {},
              [{ key: 'Direction', value: 'Left' }]),
          });
        }
      }

      return result;
    }

    const first = binarySearch(true);
    const last = binarySearch(false);

    const hl: Record<number, string> = {};
    if (first !== -1 && last !== -1) {
      for (let i = first; i <= last; i++) hl[i] = 'found';
    }

    steps.push({
      line: 1,
      explanation: `Result: [${first}, ${last}]. ${first === -1 ? `Target ${target} not found.` : `Target ${target} at indices ${first} to ${last}.`}`,
      variables: { first, last },
      visualization: makeViz(hl,
        first !== -1 ? { [first]: 'first', [last]: 'last' } : {},
        [{ key: 'Range', value: `[${first}, ${last}]` }],
      ),
    });

    return steps;
  },
};

export default findFirstAndLastPositionII;
