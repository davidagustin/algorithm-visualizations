import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findTargetIndicesAfterSorting: AlgorithmDefinition = {
  id: 'find-target-indices-after-sorting',
  title: 'Find Target Indices After Sorting Array',
  leetcodeNumber: 2089,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given an integer array and a target, sort the array and return the list of indices where the target appears. Use binary search to find the first and last occurrence of target in the sorted array, then generate the index list in O(log n) time.',
  tags: ['binary search', 'sorting', 'array'],

  code: {
    pseudocode: `function targetIndices(nums, target):
  sort(nums)
  first = lowerBound(nums, target)
  last = upperBound(nums, target)
  return [first, first+1, ..., last-1]`,

    python: `def targetIndices(nums: list[int], target: int) -> list[int]:
    nums.sort()
    first = bisect_left(nums, target)
    last = bisect_right(nums, target)
    return list(range(first, last))`,

    javascript: `function targetIndices(nums, target) {
  nums.sort((a, b) => a - b);
  let first = 0, last = nums.length;
  // lower bound
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1; else hi = mid;
  }
  first = lo;
  lo = 0; hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] <= target) lo = mid + 1; else hi = mid;
  }
  last = lo;
  return Array.from({length: last - first}, (_, i) => first + i);
}`,

    java: `public List<Integer> targetIndices(int[] nums, int target) {
    Arrays.sort(nums);
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (nums[mid] < target) lo = mid + 1; else hi = mid;
    }
    int first = lo;
    lo = 0; hi = nums.length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (nums[mid] <= target) lo = mid + 1; else hi = mid;
    }
    List<Integer> res = new ArrayList<>();
    for (int i = first; i < lo; i++) res.add(i);
    return res;
}`,
  },

  defaultInput: {
    nums: [1, 2, 5, 2, 3],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 5, 2, 3],
      placeholder: '1,2,5,2,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Value to find indices for after sorting',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const sorted = [...nums].sort((a, b) => a - b);
    const n = sorted.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: sorted,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort array: [${sorted.join(', ')}]. Find all indices of target=${target}.`,
      variables: { sorted: `[${sorted.join(', ')}]`, target },
      visualization: makeViz(
        sorted.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        sorted.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {})
      ),
    });

    // Find lower bound (first occurrence)
    let lo = 0, hi = n;
    steps.push({
      line: 2,
      explanation: `Find lower bound (first index where sorted[i] >= ${target}).`,
      variables: { lo, hi, target },
      visualization: makeViz(
        { 0: 'pointer', [n - 1]: 'pointer' },
        { 0: 'lo', [n - 1]: 'hi' }
      ),
    });

    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push({
        line: 3,
        explanation: `Lower bound: mid=${mid}, sorted[${mid}]=${sorted[mid]}. ${sorted[mid] < target ? `< ${target}, lo=${mid + 1}` : `>= ${target}, hi=${mid}`}.`,
        variables: { lo, hi, mid, 'sorted[mid]': sorted[mid], target },
        visualization: makeViz(
          { [lo]: 'active', [Math.min(hi, n) - 1]: 'active', [mid]: 'comparing' },
          { [lo]: 'lo', [Math.min(hi, n) - 1]: 'hi', [mid]: `${sorted[mid]}` }
        ),
      });
      if (sorted[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const first = lo;

    steps.push({
      line: 3,
      explanation: `Lower bound found at index ${first}.`,
      variables: { first },
      visualization: makeViz({ [first]: 'found' }, { [first]: `first=${first}` }),
    });

    // Find upper bound (one past last occurrence)
    lo = 0; hi = n;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push({
        line: 4,
        explanation: `Upper bound: mid=${mid}, sorted[${mid}]=${sorted[mid]}. ${sorted[mid] <= target ? `<= ${target}, lo=${mid + 1}` : `> ${target}, hi=${mid}`}.`,
        variables: { lo, hi, mid, 'sorted[mid]': sorted[mid], target },
        visualization: makeViz(
          { [lo]: 'active', [Math.min(hi, n) - 1]: 'active', [mid]: 'comparing' },
          { [lo]: 'lo', [Math.min(hi, n) - 1]: 'hi', [mid]: `${sorted[mid]}` }
        ),
      });
      if (sorted[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    const last = lo;

    const result = Array.from({ length: last - first }, (_, i) => first + i);

    steps.push({
      line: 5,
      explanation: `Target indices range: [${first}, ${last}). Result indices: [${result.join(', ')}].`,
      variables: { first, last, result: `[${result.join(', ')}]` },
      visualization: makeViz(
        sorted.reduce((acc, _, i) => ({
          ...acc,
          [i]: i >= first && i < last ? 'found' : 'sorted',
        }), {}),
        sorted.reduce((acc, _, i) => ({
          ...acc,
          ...(i >= first && i < last ? { [i]: `idx=${i}` } : {}),
        }), {})
      ),
    });

    return steps;
  },
};

export default findTargetIndicesAfterSorting;
