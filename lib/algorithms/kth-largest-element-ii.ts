import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthLargestElementII: AlgorithmDefinition = {
  id: 'kth-largest-element-ii',
  title: 'Kth Largest Element II',
  leetcodeNumber: 215,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 215: Find the kth largest element in an unsorted array. Uses Quickselect for average O(n) time. Partition around a pivot and recurse on the relevant side.',
  tags: ['Sorting', 'Array', 'Quickselect', 'Divide and Conquer', 'Heap'],
  code: {
    pseudocode: `function findKthLargest(nums, k):
  target = n - k  # kth largest = (n-k)th smallest
  return quickSelect(nums, 0, n-1, target)

function quickSelect(nums, lo, hi, target):
  pivot = nums[hi]
  i = lo - 1
  for j = lo to hi-1:
    if nums[j] <= pivot: swap(nums[++i], nums[j])
  swap(nums[i+1], nums[hi])
  p = i + 1
  if p == target: return nums[p]
  if p < target: return quickSelect(nums, p+1, hi, target)
  return quickSelect(nums, lo, p-1, target)`,
    python: `def findKthLargest(nums, k):
    target = len(nums) - k
    def quick_select(lo, hi):
        pivot = nums[hi]
        i = lo - 1
        for j in range(lo, hi):
            if nums[j] <= pivot:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]
        nums[i+1], nums[hi] = nums[hi], nums[i+1]
        p = i + 1
        if p == target: return nums[p]
        if p < target: return quick_select(p+1, hi)
        return quick_select(lo, p-1)
    return quick_select(0, len(nums)-1)`,
    javascript: `function findKthLargest(nums, k) {
  const target = nums.length - k;
  function quickSelect(lo, hi) {
    const pivot = nums[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (nums[j] <= pivot) { i++; [nums[i], nums[j]] = [nums[j], nums[i]]; }
    }
    [nums[i+1], nums[hi]] = [nums[hi], nums[i+1]];
    const p = i + 1;
    if (p === target) return nums[p];
    return p < target ? quickSelect(p+1, hi) : quickSelect(lo, p-1);
  }
  return quickSelect(0, nums.length - 1);
}`,
    java: `public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;
    return quickSelect(nums, 0, nums.length - 1, target);
}
private int quickSelect(int[] nums, int lo, int hi, int target) {
    int pivot = nums[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (nums[j] <= pivot) { i++; int t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
    }
    int t = nums[i+1]; nums[i+1] = nums[hi]; nums[hi] = t;
    int p = i + 1;
    if (p == target) return nums[p];
    return p < target ? quickSelect(nums, p+1, hi, target) : quickSelect(nums, lo, p-1, target);
}`,
  },
  defaultInput: { nums: [3, 2, 1, 5, 6, 4], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 1, 5, 6, 4],
      placeholder: '3,2,1,5,6,4',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Find the kth largest',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const target = n - k;
    let answer = -Infinity;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Kth Largest II', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find ${k}th largest in [${nums.join(', ')}]. Target index (0-based smallest): ${target}.`,
      variables: { nums: [...nums], k, target },
      visualization: makeViz({}, {},
        [{ key: 'k', value: String(k) }, { key: 'Target idx', value: String(target) }]),
    });

    function quickSelect(lo: number, hi: number): number {
      const pivot = nums[hi];
      let i = lo - 1;

      const hl: Record<number, string> = {};
      for (let x = lo; x <= hi; x++) hl[x] = 'comparing';
      hl[hi] = 'active';

      steps.push({
        line: 5,
        explanation: `Quickselect [${lo}..${hi}], pivot=${pivot} at index ${hi}. Target=${target}.`,
        variables: { lo, hi, pivot, target },
        visualization: makeViz(hl, { [hi]: 'pivot', [lo]: 'lo', [hi - 1]: 'hi' },
          [{ key: 'Pivot', value: String(pivot) }, { key: 'Range', value: `[${lo}..${hi}]` }]),
      });

      for (let j = lo; j < hi; j++) {
        if (nums[j] <= pivot) {
          i++;
          const tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        }
      }

      const tmp = nums[i + 1]; nums[i + 1] = nums[hi]; nums[hi] = tmp;
      const p = i + 1;

      const afterHl: Record<number, string> = {};
      for (let x = lo; x < p; x++) afterHl[x] = 'pointer';
      afterHl[p] = 'found';
      for (let x = p + 1; x <= hi; x++) afterHl[x] = 'comparing';

      steps.push({
        line: 11,
        explanation: `Pivot ${nums[p]} placed at index ${p}. ${p === target ? 'This is our answer!' : p < target ? 'Search right.' : 'Search left.'}`,
        variables: { p, pivotVal: nums[p], target },
        visualization: makeViz(afterHl, { [p]: 'pivot' },
          [{ key: 'Pivot at', value: String(p) }, { key: 'Target', value: String(target) }]),
      });

      if (p === target) {
        answer = nums[p];
        return nums[p];
      }
      if (p < target) return quickSelect(p + 1, hi);
      return quickSelect(lo, p - 1);
    }

    answer = quickSelect(0, n - 1);

    steps.push({
      line: 1,
      explanation: `The ${k}th largest element is ${answer}.`,
      variables: { answer, k },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, i) => [i, v === answer && nums.indexOf(answer) === i ? 'found' : 'visited'])),
        Object.fromEntries(nums.map((v, i) => [i, v === answer && nums.indexOf(answer) === i ? `${k}th` : ''])),
        [{ key: 'Answer', value: String(answer) }, { key: 'k', value: String(k) }],
      ),
    });

    return steps;
  },
};

export default kthLargestElementII;
