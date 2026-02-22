import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const specialArrayWithXElements: AlgorithmDefinition = {
  id: 'special-array-with-x-elements',
  title: 'Special Array With X Elements Greater Than or Equal X',
  leetcodeNumber: 1608,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given an array of non-negative integers, find a number x such that exactly x elements in the array are greater than or equal to x. The array is not modified. Binary search on x from 0 to n, checking each candidate by counting elements >= x.',
  tags: ['binary search', 'array', 'counting'],

  code: {
    pseudocode: `function specialArray(nums):
  n = length(nums)
  sort(nums)
  for x from 0 to n:
    count = elements >= x in nums
    if count == x:
      return x
  return -1`,

    python: `def specialArray(nums: list[int]) -> int:
    nums.sort()
    n = len(nums)
    for x in range(n + 1):
        # binary search for first element >= x
        lo, hi = 0, n
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        count = n - lo
        if count == x:
            return x
    return -1`,

    javascript: `function specialArray(nums) {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  for (let x = 0; x <= n; x++) {
    let lo = 0, hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (n - lo === x) return x;
  }
  return -1;
}`,

    java: `public int specialArray(int[] nums) {
    Arrays.sort(nums);
    int n = nums.length;
    for (int x = 0; x <= n; x++) {
        int lo = 0, hi = n;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (nums[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        if (n - lo == x) return x;
    }
    return -1;
}`,
  },

  defaultInput: {
    nums: [3, 5, 0, 3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 5, 0, 3, 4],
      placeholder: '3,5,0,3,4',
      helperText: 'Non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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
      explanation: `Sort array: [${sorted.join(', ')}]. Try x from 0 to ${n}.`,
      variables: { sorted: `[${sorted.join(', ')}]`, n },
      visualization: makeViz(
        sorted.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        sorted.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {})
      ),
    });

    for (let x = 0; x <= n; x++) {
      let lo = 0;
      let hi = n;

      steps.push({
        line: 3,
        explanation: `Try x=${x}. Binary search for first element >= ${x}.`,
        variables: { x, searching: `first index where sorted[i] >= ${x}` },
        visualization: makeViz(
          sorted.reduce((acc, v, i) => ({ ...acc, [i]: v >= x ? 'active' : 'mismatch' }), {}),
          { 0: `x=${x}` }
        ),
      });

      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);

        steps.push({
          line: 5,
          explanation: `mid=${mid}, sorted[${mid}]=${sorted[mid]}. ${sorted[mid] < x ? `${sorted[mid]} < ${x}, move lo to ${mid + 1}` : `${sorted[mid]} >= ${x}, move hi to ${mid}`}.`,
          variables: { lo, hi, mid, 'sorted[mid]': sorted[mid], x },
          visualization: makeViz(
            { [lo]: 'active', [Math.min(hi, n) - 1]: 'active', [mid]: 'comparing' },
            { [lo]: 'lo', [Math.min(hi, n) - 1]: 'hi', [mid]: `${sorted[mid]}` }
          ),
        });

        if (sorted[mid] < x) lo = mid + 1;
        else hi = mid;
      }

      const count = n - lo;

      steps.push({
        line: 6,
        explanation: `For x=${x}: first index >= ${x} is at lo=${lo}. Count = ${n} - ${lo} = ${count}. ${count === x ? `count == x! Return ${x}.` : `count != x, continue.`}`,
        variables: { x, firstIdx: lo, count, match: count === x },
        visualization: makeViz(
          sorted.reduce((acc, _, i) => ({
            ...acc,
            [i]: i >= lo ? 'found' : 'mismatch',
          }), {}),
          { [lo]: `cnt=${count}` }
        ),
      });

      if (count === x) return steps;
    }

    steps.push({
      line: 7,
      explanation: 'No valid x found. Return -1.',
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default specialArrayWithXElements;
