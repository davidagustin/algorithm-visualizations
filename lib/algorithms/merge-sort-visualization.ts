import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeSortVisualization: AlgorithmDefinition = {
  id: 'merge-sort-visualization',
  title: 'Merge Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Classic merge sort algorithm. Divide the array into halves, recursively sort each half, then merge the sorted halves together. Time: O(n log n), Space: O(n).',
  tags: ['Sorting', 'Divide and Conquer', 'Merge Sort', 'Recursion'],
  code: {
    pseudocode: `function mergeSort(arr, lo, hi):
  if lo >= hi: return
  mid = (lo + hi) / 2
  mergeSort(arr, lo, mid)
  mergeSort(arr, mid+1, hi)
  merge(arr, lo, mid, hi)

function merge(arr, lo, mid, hi):
  left = arr[lo..mid]
  right = arr[mid+1..hi]
  i = j = 0, k = lo
  while i < left.len and j < right.len:
    if left[i] <= right[j]: arr[k++] = left[i++]
    else: arr[k++] = right[j++]
  copy remaining`,
    python: `def merge_sort(arr):
    def sort(lo, hi):
        if lo >= hi: return
        mid = (lo + hi) // 2
        sort(lo, mid)
        sort(mid + 1, hi)
        merge(lo, mid, hi)

    def merge(lo, mid, hi):
        left = arr[lo:mid+1]
        right = arr[mid+1:hi+1]
        i = j = 0; k = lo
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                arr[k] = left[i]; i += 1
            else:
                arr[k] = right[j]; j += 1
            k += 1
        while i < len(left): arr[k] = left[i]; i += 1; k += 1
        while j < len(right): arr[k] = right[j]; j += 1; k += 1

    sort(0, len(arr) - 1)
    return arr`,
    javascript: `function mergeSort(arr) {
  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }
  function merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) arr[k++] = left[i++];
      else arr[k++] = right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
  }
  sort(0, arr.length - 1);
  return arr;
}`,
    java: `public void mergeSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}
private void merge(int[] arr, int lo, int mid, int hi) {
    int[] left = Arrays.copyOfRange(arr, lo, mid + 1);
    int[] right = Arrays.copyOfRange(arr, mid + 1, hi + 1);
    int i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
  },
  defaultInput: { nums: [38, 27, 43, 3, 9, 82, 10] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [38, 27, 43, 3, 9, 82, 10],
      placeholder: '38,27,43,3,9,82,10',
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
      ...(auxEntries ? { auxData: { label: 'Merge Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin merge sort on [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    function sort(lo: number, hi: number, depth: number) {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      const hl: Record<number, string> = {};
      for (let i = lo; i <= mid; i++) hl[i] = 'pointer';
      for (let i = mid + 1; i <= hi; i++) hl[i] = 'comparing';
      steps.push({
        line: 3,
        explanation: `Divide [${lo}..${hi}] at mid=${mid}.`,
        variables: { lo, hi, mid, depth },
        visualization: makeViz(hl, { [lo]: 'lo', [mid]: 'mid', [hi]: 'hi' },
          [{ key: 'Action', value: 'Divide' }, { key: 'Depth', value: String(depth) }]),
      });
      sort(lo, mid, depth + 1);
      sort(mid + 1, hi, depth + 1);
      const left = nums.slice(lo, mid + 1);
      const right = nums.slice(mid + 1, hi + 1);
      steps.push({
        line: 7,
        explanation: `Merge left=[${left.join(', ')}] and right=[${right.join(', ')}].`,
        variables: { left: [...left], right: [...right] },
        visualization: makeViz(hl, {},
          [{ key: 'Left', value: left.join(',') }, { key: 'Right', value: right.join(',') }]),
      });
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) nums[k++] = left[i++];
        else nums[k++] = right[j++];
      }
      while (i < left.length) nums[k++] = left[i++];
      while (j < right.length) nums[k++] = right[j++];
      const mergeHl: Record<number, string> = {};
      for (let x = lo; x <= hi; x++) mergeHl[x] = 'found';
      steps.push({
        line: 7,
        explanation: `Merged [${lo}..${hi}]: [${nums.slice(lo, hi + 1).join(', ')}].`,
        variables: { merged: nums.slice(lo, hi + 1) },
        visualization: makeViz(mergeHl, {},
          [{ key: 'Merged', value: nums.slice(lo, hi + 1).join(', ') }]),
      });
    }

    if (nums.length > 1) sort(0, nums.length - 1, 0);

    steps.push({
      line: 1,
      explanation: `Merge sort complete! Sorted: [${nums.join(', ')}].`,
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

export default mergeSortVisualization;
