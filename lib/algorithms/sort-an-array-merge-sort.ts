import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const sortAnArrayMergeSort: AlgorithmDefinition = {
  id: 'sort-an-array-merge-sort',
  title: 'Sort an Array (Merge Sort)',
  leetcodeNumber: 912,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Sort an array using merge sort. Divide the array in half recursively until subarrays have one element, then merge sorted halves back together. At each merge step, compare elements from the left and right halves and place the smaller one. Time: O(n log n), Space: O(n). Stable sort with predictable performance.',
  tags: ['sorting', 'merge sort', 'divide and conquer', 'recursion'],

  code: {
    pseudocode: `function mergeSort(arr, left, right):
  if left >= right: return
  mid = (left + right) / 2
  mergeSort(arr, left, mid)
  mergeSort(arr, mid+1, right)
  merge(arr, left, mid, right)

function merge(arr, left, mid, right):
  L = arr[left..mid], R = arr[mid+1..right]
  i = 0, j = 0, k = left
  while i < len(L) and j < len(R):
    if L[i] <= R[j]: arr[k++] = L[i++]
    else: arr[k++] = R[j++]
  copy remaining elements`,

    python: `def sortArray(nums):
    def merge_sort(arr, left, right):
        if left >= right:
            return
        mid = (left + right) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        merge(arr, left, mid, right)

    def merge(arr, left, mid, right):
        L = arr[left:mid+1][:]
        R = arr[mid+1:right+1][:]
        i = j = 0
        k = left
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]; i += 1
            else:
                arr[k] = R[j]; j += 1
            k += 1
        while i < len(L): arr[k] = L[i]; i += 1; k += 1
        while j < len(R): arr[k] = R[j]; j += 1; k += 1

    merge_sort(nums, 0, len(nums) - 1)
    return nums`,

    javascript: `function sortArray(nums) {
  function mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = (left + right) >> 1;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  function merge(arr, left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length)
      arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];
  }
  mergeSort(nums, 0, nums.length - 1);
  return nums;
}`,

    java: `public int[] sortArray(int[] nums) {
    mergeSort(nums, 0, nums.length - 1);
    return nums;
}
void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
void merge(int[] arr, int left, int mid, int right) {
    int[] L = Arrays.copyOfRange(arr, left, mid + 1);
    int[] R = Arrays.copyOfRange(arr, mid + 1, right + 1);
    int i = 0, j = 0, k = left;
    while (i < L.length && j < R.length)
        arr[k++] = L[i] <= R[j] ? L[i++] : R[j++];
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];
}`,
  },

  defaultInput: {
    nums: [5, 2, 3, 1, 6, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [5, 2, 3, 1, 6, 4],
      placeholder: '5,2,3,1,6,4',
      helperText: 'Comma-separated integers to sort with merge sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Merge Sort on [${nums.join(', ')}]. Recursively divide array in half, then merge sorted halves.`,
      variables: { n: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    function mergeSort(arr: number[], left: number, right: number, depth: number): void {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 2,
        explanation: `Divide [${left}..${right}] at mid=${mid}. Left=[${left}..${mid}], Right=[${mid + 1}..${right}].`,
        variables: { left, right, mid, depth },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, i) => [i,
            i >= left && i <= mid ? 'active' :
            i > mid && i <= right ? 'comparing' :
            'default'
          ])),
          labels: { [left]: `L=${left}`, [mid]: `M=${mid}`, [right]: `R=${right}` },
        },
      });

      mergeSort(arr, left, mid, depth + 1);
      mergeSort(arr, mid + 1, right, depth + 1);

      // Merge
      const L = arr.slice(left, mid + 1);
      const R = arr.slice(mid + 1, right + 1);
      let i = 0;
      let j = 0;
      let k = left;

      steps.push({
        line: 8,
        explanation: `Merge [${L.join(',')}] and [${R.join(',')}] into arr[${left}..${right}].`,
        variables: { left, right, L: L.join(','), R: R.join(',') },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, idx) => [idx,
            idx >= left && idx <= right ? 'comparing' : 'default'
          ])),
          labels: { [left]: 'merge start', [right]: 'merge end' },
        },
      });

      while (i < L.length && j < R.length) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          steps.push({
            line: 11,
            explanation: `L[${i}]=${L[i]} <= R[${j}]=${R[j]}. Place ${L[i]} at arr[${k}].`,
            variables: { 'L[i]': L[i], 'R[j]': R[j], k, placed: L[i] },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [k]: 'found' },
              labels: { [k]: `${L[i]}` },
            },
          });
          i++;
        } else {
          arr[k] = R[j];
          steps.push({
            line: 12,
            explanation: `R[${j}]=${R[j]} < L[${i}]=${L[i]}. Place ${R[j]} at arr[${k}].`,
            variables: { 'L[i]': L[i], 'R[j]': R[j], k, placed: R[j] },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [k]: 'found' },
              labels: { [k]: `${R[j]}` },
            },
          });
          j++;
        }
        k++;
      }

      while (i < L.length) { arr[k++] = L[i++]; }
      while (j < R.length) { arr[k++] = R[j++]; }

      steps.push({
        line: 13,
        explanation: `Merge complete for [${left}..${right}]. Subarray: [${arr.slice(left, right + 1).join(', ')}].`,
        variables: { merged: arr.slice(left, right + 1).join(', ') },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, idx) => [idx,
            idx >= left && idx <= right ? 'sorted' : 'default'
          ])),
          labels: {},
        },
      });

      if (steps.length > 50) return;
    }

    mergeSort(nums, 0, nums.length - 1, 0);

    steps.push({
      line: 14,
      explanation: `Merge Sort complete. Sorted array: [${nums.join(', ')}].`,
      variables: { sorted: `[${nums.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default sortAnArrayMergeSort;
