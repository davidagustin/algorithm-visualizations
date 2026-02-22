import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortArray: AlgorithmDefinition = {
  id: 'sort-array',
  title: 'Sort Array (Merge Sort)',
  leetcodeNumber: 912,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Sort an array using merge sort. Divide the array into halves, recursively sort each half, then merge the sorted halves. O(n log n) time, O(n) space.',
  tags: ['Sorting', 'Array', 'Divide and Conquer', 'Merge Sort'],
  code: {
    pseudocode: `function mergeSort(nums, lo, hi):
  if lo >= hi: return
  mid = (lo + hi) / 2
  mergeSort(nums, lo, mid)
  mergeSort(nums, mid+1, hi)
  merge(nums, lo, mid, hi)

function merge(nums, lo, mid, hi):
  temp = nums[lo..hi]
  i = lo, j = mid+1, k = lo
  while i <= mid and j <= hi:
    if temp[i-lo] <= temp[j-lo]:
      nums[k++] = temp[i++ - lo]
    else:
      nums[k++] = temp[j++ - lo]
  copy remaining elements`,
    python: `def sortArray(nums):
    def merge_sort(lo, hi):
        if lo >= hi:
            return
        mid = (lo + hi) // 2
        merge_sort(lo, mid)
        merge_sort(mid + 1, hi)
        merge(lo, mid, hi)

    def merge(lo, mid, hi):
        temp = nums[lo:hi + 1]
        i, j, k = 0, mid - lo + 1, lo
        while i <= mid - lo and j < len(temp):
            if temp[i] <= temp[j]:
                nums[k] = temp[i]; i += 1
            else:
                nums[k] = temp[j]; j += 1
            k += 1
        while i <= mid - lo:
            nums[k] = temp[i]; i += 1; k += 1
        while j < len(temp):
            nums[k] = temp[j]; j += 1; k += 1

    merge_sort(0, len(nums) - 1)
    return nums`,
    javascript: `function sortArray(nums) {
  function mergeSort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  function merge(lo, mid, hi) {
    const temp = nums.slice(lo, hi + 1);
    let i = 0, j = mid - lo + 1, k = lo;
    while (i <= mid - lo && j < temp.length) {
      if (temp[i] <= temp[j]) nums[k++] = temp[i++];
      else nums[k++] = temp[j++];
    }
    while (i <= mid - lo) nums[k++] = temp[i++];
    while (j < temp.length) nums[k++] = temp[j++];
  }

  mergeSort(0, nums.length - 1);
  return nums;
}`,
    java: `public int[] sortArray(int[] nums) {
    mergeSort(nums, 0, nums.length - 1);
    return nums;
}

private void mergeSort(int[] nums, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(nums, lo, mid);
    mergeSort(nums, mid + 1, hi);
    merge(nums, lo, mid, hi);
}

private void merge(int[] nums, int lo, int mid, int hi) {
    int[] temp = Arrays.copyOfRange(nums, lo, hi + 1);
    int i = 0, j = mid - lo + 1, k = lo;
    while (i <= mid - lo && j < temp.length) {
        if (temp[i] <= temp[j]) nums[k++] = temp[i++];
        else nums[k++] = temp[j++];
    }
    while (i <= mid - lo) nums[k++] = temp[i++];
    while (j < temp.length) nums[k++] = temp[j++];
}`,
  },
  defaultInput: { nums: [5, 2, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 2, 3, 1],
      placeholder: '5,2,3,1',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      explanation: `Sort [${nums.join(', ')}] using merge sort.`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    function mergeSort(lo: number, hi: number, depth: number) {
      if (lo >= hi) return;

      const mid = Math.floor((lo + hi) / 2);

      // Show divide
      const divHl: Record<number, string> = {};
      for (let i = lo; i <= mid; i++) divHl[i] = 'pointer';
      for (let i = mid + 1; i <= hi; i++) divHl[i] = 'comparing';

      steps.push({
        line: 3,
        explanation: `Divide [${lo}..${hi}] at mid=${mid}. Left: indices [${lo}..${mid}], Right: indices [${mid + 1}..${hi}].`,
        variables: { lo, hi, mid, depth },
        visualization: makeViz(divHl, { [lo]: `lo=${lo}`, [mid]: 'mid', [hi]: `hi=${hi}` },
          [{ key: 'Action', value: 'Divide' }, { key: 'Depth', value: String(depth) }]),
      });

      mergeSort(lo, mid, depth + 1);
      mergeSort(mid + 1, hi, depth + 1);

      // Merge step
      const temp = nums.slice(lo, hi + 1);
      let i = 0;
      let j = mid - lo + 1;
      let k = lo;

      steps.push({
        line: 7,
        explanation: `Merge [${nums.slice(lo, mid + 1).join(', ')}] and [${nums.slice(mid + 1, hi + 1).join(', ')}].`,
        variables: { left: nums.slice(lo, mid + 1), right: nums.slice(mid + 1, hi + 1) },
        visualization: makeViz(divHl, {},
          [{ key: 'Action', value: 'Merge' }, { key: 'Left', value: nums.slice(lo, mid + 1).join(',') }, { key: 'Right', value: nums.slice(mid + 1, hi + 1).join(',') }]),
      });

      while (i <= mid - lo && j < temp.length) {
        if (temp[i] <= temp[j]) {
          nums[k] = temp[i];
          i++;
        } else {
          nums[k] = temp[j];
          j++;
        }
        k++;
      }
      while (i <= mid - lo) { nums[k] = temp[i]; i++; k++; }
      while (j < temp.length) { nums[k] = temp[j]; j++; k++; }

      const mergeHl: Record<number, string> = {};
      for (let x = lo; x <= hi; x++) mergeHl[x] = 'found';

      steps.push({
        line: 7,
        explanation: `Merged [${lo}..${hi}]: [${nums.slice(lo, hi + 1).join(', ')}].`,
        variables: { merged: nums.slice(lo, hi + 1), depth },
        visualization: makeViz(mergeHl, {},
          [{ key: 'Action', value: 'Merged' }, { key: 'Result', value: nums.slice(lo, hi + 1).join(', ') }]),
      });
    }

    if (n > 1) {
      mergeSort(0, n - 1, 0);
    }

    steps.push({
      line: 1,
      explanation: `Sort complete! Result: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [{ key: 'Sorted', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default sortArray;
