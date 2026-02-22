import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthLargestInteger: AlgorithmDefinition = {
  id: 'kth-largest-integer',
  title: 'Kth Largest Integer (Quickselect)',
  leetcodeNumber: 215,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Find the kth largest element in an unsorted array using Quickselect. Partition around a pivot: elements >= pivot go left, elements < pivot go right. If the pivot lands at position k-1, we found our answer. Otherwise recurse on the relevant side. Average O(n) time.',
  tags: ['Sorting', 'Array', 'Quickselect'],
  code: {
    pseudocode: `function findKthLargest(nums, k):
  target = k - 1
  lo = 0, hi = n - 1
  while lo <= hi:
    pivotIdx = partition(nums, lo, hi)
    if pivotIdx == target:
      return nums[pivotIdx]
    else if pivotIdx < target:
      lo = pivotIdx + 1
    else:
      hi = pivotIdx - 1

function partition(nums, lo, hi):
  pivot = nums[hi]
  i = lo
  for j from lo to hi-1:
    if nums[j] >= pivot:
      swap nums[i], nums[j]
      i++
  swap nums[i], nums[hi]
  return i`,
    python: `def findKthLargest(nums, k):
    def partition(lo, hi):
        pivot = nums[hi]
        i = lo
        for j in range(lo, hi):
            if nums[j] >= pivot:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
        nums[i], nums[hi] = nums[hi], nums[i]
        return i

    target = k - 1
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        pivot_idx = partition(lo, hi)
        if pivot_idx == target:
            return nums[pivot_idx]
        elif pivot_idx < target:
            lo = pivot_idx + 1
        else:
            hi = pivot_idx - 1`,
    javascript: `function findKthLargest(nums, k) {
  const target = k - 1;
  let lo = 0, hi = nums.length - 1;

  function partition(lo, hi) {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (nums[j] >= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
  }

  while (lo <= hi) {
    const pivotIdx = partition(lo, hi);
    if (pivotIdx === target) return nums[pivotIdx];
    else if (pivotIdx < target) lo = pivotIdx + 1;
    else hi = pivotIdx - 1;
  }
}`,
    java: `public int findKthLargest(int[] nums, int k) {
    int target = k - 1, lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int pivotIdx = partition(nums, lo, hi);
        if (pivotIdx == target) return nums[pivotIdx];
        else if (pivotIdx < target) lo = pivotIdx + 1;
        else hi = pivotIdx - 1;
    }
    return -1;
}

private int partition(int[] nums, int lo, int hi) {
    int pivot = nums[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (nums[j] >= pivot) {
            int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
            i++;
        }
    }
    int tmp = nums[i]; nums[i] = nums[hi]; nums[hi] = tmp;
    return i;
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
      label: 'K',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Find the kth largest element',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const target = k - 1;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Quickselect', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find the ${k}th largest in [${nums.join(', ')}]. Target index (descending) = ${target}. Use quickselect with descending partition.`,
      variables: { k, target, nums: [...nums] },
      visualization: makeViz({}, {}, [{ key: 'k', value: String(k) }, { key: 'Target idx', value: String(target) }]),
    });

    let lo = 0;
    let hi = n - 1;
    let iterations = 0;
    const maxIter = n * 2;

    while (lo <= hi && iterations < maxIter) {
      iterations++;

      // Partition
      const pivot = nums[hi];
      let i = lo;

      const partHl: Record<number, string> = {};
      for (let x = 0; x < lo; x++) partHl[x] = 'sorted';
      for (let x = hi + 1; x < n; x++) partHl[x] = 'sorted';
      partHl[hi] = 'comparing';

      steps.push({
        line: 13,
        explanation: `Partition [${lo}..${hi}] with pivot = nums[${hi}] = ${pivot}. Elements >= ${pivot} go left (for descending order).`,
        variables: { lo, hi, pivot, i },
        visualization: makeViz(partHl, { [hi]: `pivot=${pivot}`, [lo]: 'lo' },
          [{ key: 'Pivot', value: String(pivot) }, { key: 'Range', value: `[${lo}, ${hi}]` }]),
      });

      for (let j = lo; j < hi; j++) {
        if (nums[j] >= pivot) {
          if (i !== j) {
            // swap
            [nums[i], nums[j]] = [nums[j], nums[i]];

            steps.push({
              line: 16,
              explanation: `nums[${j}]=${nums[j]} >= pivot ${pivot}. Swap nums[${i}] and nums[${j}]. i becomes ${i + 1}.`,
              variables: { j, i, 'nums[j]': nums[j], 'nums[i]': nums[i] },
              visualization: makeViz(
                { ...partHl, [i]: 'swapping', [j]: 'swapping' },
                { [i]: `i=${i}`, [j]: `j=${j}`, [hi]: 'pivot' },
              ),
            });
          }
          i++;
        }
      }

      // Place pivot
      [nums[i], nums[hi]] = [nums[hi], nums[i]];

      const afterPartHl: Record<number, string> = {};
      for (let x = 0; x < lo; x++) afterPartHl[x] = 'sorted';
      for (let x = hi + 1; x < n; x++) afterPartHl[x] = 'sorted';
      for (let x = lo; x < i; x++) afterPartHl[x] = 'pointer'; // >= pivot
      afterPartHl[i] = 'active'; // pivot position
      for (let x = i + 1; x <= hi; x++) afterPartHl[x] = 'visited'; // < pivot

      steps.push({
        line: 18,
        explanation: `Pivot ${pivot} placed at index ${i}. Left side (>= pivot): [${nums.slice(lo, i).join(',')}]. Right side (< pivot): [${nums.slice(i + 1, hi + 1).join(',')}].`,
        variables: { pivotIdx: i, pivot },
        visualization: makeViz(afterPartHl, { [i]: `pivot@${i}` },
          [{ key: 'Pivot position', value: String(i) }, { key: 'Target', value: String(target) }]),
      });

      if (i === target) {
        steps.push({
          line: 6,
          explanation: `Pivot index ${i} == target ${target}. The ${k}th largest element is ${nums[i]}!`,
          variables: { result: nums[i], pivotIdx: i },
          visualization: makeViz(
            { [i]: 'found' },
            { [i]: `answer=${nums[i]}` },
            [{ key: 'Answer', value: String(nums[i]) }],
          ),
        });
        return steps;
      } else if (i < target) {
        steps.push({
          line: 8,
          explanation: `Pivot index ${i} < target ${target}. Search right half: lo = ${i + 1}.`,
          variables: { lo: i + 1, hi },
          visualization: makeViz(afterPartHl, { [i]: 'done' },
            [{ key: 'Search', value: `right [${i + 1}..${hi}]` }]),
        });
        lo = i + 1;
      } else {
        steps.push({
          line: 10,
          explanation: `Pivot index ${i} > target ${target}. Search left half: hi = ${i - 1}.`,
          variables: { lo, hi: i - 1 },
          visualization: makeViz(afterPartHl, { [i]: 'done' },
            [{ key: 'Search', value: `left [${lo}..${i - 1}]` }]),
        });
        hi = i - 1;
      }
    }

    return steps;
  },
};

export default kthLargestInteger;
