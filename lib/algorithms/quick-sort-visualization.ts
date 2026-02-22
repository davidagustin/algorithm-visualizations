import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const quickSortVisualization: AlgorithmDefinition = {
  id: 'quick-sort-visualization',
  title: 'Quick Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Classic quicksort algorithm. Choose a pivot, partition the array around it, then recursively sort each partition. Average O(n log n), worst case O(n²). In-place sorting.',
  tags: ['Sorting', 'Divide and Conquer', 'Quick Sort', 'Partitioning'],
  code: {
    pseudocode: `function quickSort(arr, lo, hi):
  if lo >= hi: return
  pivot = arr[hi]
  i = lo - 1
  for j = lo to hi-1:
    if arr[j] <= pivot:
      i++; swap(arr[i], arr[j])
  swap(arr[i+1], arr[hi])
  p = i + 1
  quickSort(arr, lo, p-1)
  quickSort(arr, p+1, hi)`,
    python: `def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo >= hi: return
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    p = i + 1
    quick_sort(arr, lo, p - 1)
    quick_sort(arr, p + 1, hi)
    return arr`,
    javascript: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return;
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+1], arr[hi]] = [arr[hi], arr[i+1]];
  const p = i + 1;
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}`,
    java: `public void quickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i+1]; arr[i+1] = arr[hi]; arr[hi] = tmp;
    int p = i + 1;
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}`,
  },
  defaultInput: { nums: [10, 7, 8, 9, 1, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 7, 8, 9, 1, 5],
      placeholder: '10,7,8,9,1,5',
      helperText: 'Comma-separated integers to sort',
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
      ...(auxEntries ? { auxData: { label: 'Quick Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin quick sort on [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    function partition(lo: number, hi: number): number {
      const pivot = nums[hi];
      let i = lo - 1;
      const hl: Record<number, string> = {};
      hl[hi] = 'active';
      for (let x = lo; x < hi; x++) hl[x] = 'comparing';

      steps.push({
        line: 3,
        explanation: `Partition [${lo}..${hi}], pivot=${pivot} at index ${hi}.`,
        variables: { lo, hi, pivot },
        visualization: makeViz(hl, { [hi]: 'pivot' },
          [{ key: 'Pivot', value: String(pivot) }, { key: 'Range', value: `[${lo}..${hi}]` }]),
      });

      for (let j = lo; j < hi; j++) {
        if (nums[j] <= pivot) {
          i++;
          const tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
          const swHl: Record<number, string> = { [i]: 'swapping', [j]: 'swapping', [hi]: 'active' };
          steps.push({
            line: 6,
            explanation: `arr[${j}]=${nums[j]} <= pivot=${pivot}, swap indices ${i} and ${j}.`,
            variables: { i, j, swapped: [nums[i], nums[j]] },
            visualization: makeViz(swHl, { [hi]: 'pivot', [i]: 'i' },
              [{ key: 'Swapped', value: `arr[${i}]↔arr[${j}]` }]),
          });
        }
      }

      const p = i + 1;
      const tmp2 = nums[p]; nums[p] = nums[hi]; nums[hi] = tmp2;

      const finalHl: Record<number, string> = {};
      for (let x = lo; x < p; x++) finalHl[x] = 'pointer';
      finalHl[p] = 'found';
      for (let x = p + 1; x <= hi; x++) finalHl[x] = 'comparing';

      steps.push({
        line: 8,
        explanation: `Pivot ${nums[p]} placed at index ${p}. Left: indices [${lo}..${p - 1}], Right: indices [${p + 1}..${hi}].`,
        variables: { pivotIndex: p, pivot: nums[p] },
        visualization: makeViz(finalHl, { [p]: 'pivot' },
          [{ key: 'Pivot placed', value: `index ${p}` }]),
      });

      return p;
    }

    function quickSort(lo: number, hi: number) {
      if (lo >= hi) return;
      const p = partition(lo, hi);
      quickSort(lo, p - 1);
      quickSort(p + 1, hi);
    }

    if (nums.length > 1) quickSort(0, nums.length - 1);

    steps.push({
      line: 1,
      explanation: `Quick sort complete! Sorted: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default quickSortVisualization;
