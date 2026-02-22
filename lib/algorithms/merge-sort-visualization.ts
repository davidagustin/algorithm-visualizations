import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeSortVisualization: AlgorithmDefinition = {
  id: 'merge-sort-visualization',
  title: 'Merge Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Divide-and-conquer sorting algorithm. Recursively split the array into halves until single elements remain, then merge sorted halves back together by comparing and placing elements in order. Achieves O(n log n) time and O(n) space.',
  tags: ['sorting', 'divide and conquer', 'merge', 'recursion'],

  code: {
    pseudocode: `function mergeSort(arr):
  if len(arr) <= 1: return arr
  mid = len(arr) / 2
  left = mergeSort(arr[:mid])
  right = mergeSort(arr[mid:])
  return merge(left, right)

function merge(left, right):
  result = []
  while left and right:
    if left[0] <= right[0]:
      result.append(left.pop(0))
    else:
      result.append(right.pop(0))
  return result + left + right`,

    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,

    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,

    java: `public int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));
    return merge(left, right);
}
private int[] merge(int[] left, int[] right) {
    int[] result = new int[left.length + right.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length)
        result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    return result;
}`,
  },

  defaultInput: {
    arr: [38, 27, 43, 3, 9, 82, 10],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [38, 27, 43, 3, 9, 82, 10],
      placeholder: '38,27,43,3,9,82,10',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    let arr = [...initial];
    const n = arr.length;

    const makeViz = (
      current: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: current,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start merge sort on [${arr.join(', ')}]. Recursively divide into halves, then merge sorted halves.`,
      variables: { array: [...arr] },
      visualization: makeViz(arr, {}, {}),
    });

    // Simulate merge sort iteratively (bottom-up for clear visualization)
    // Show split phases first
    const mid1 = Math.floor(n / 2);
    const leftHL: Record<number, string> = {};
    const rightHL: Record<number, string> = {};
    for (let i = 0; i < mid1; i++) leftHL[i] = 'active';
    for (let i = mid1; i < n; i++) rightHL[i] = 'comparing';

    steps.push({
      line: 3,
      explanation: `Split array at mid=${mid1}: left half [${arr.slice(0, mid1).join(', ')}] and right half [${arr.slice(mid1).join(', ')}].`,
      variables: { mid: mid1, left: arr.slice(0, mid1), right: arr.slice(mid1) },
      visualization: makeViz(arr, { ...leftHL, ...rightHL }, { [0]: 'left', [mid1]: 'right' }),
    });

    // Bottom-up merge sort visualization
    let size = 1;
    while (size < n) {
      const newArr = [...arr];
      for (let start = 0; start < n; start += 2 * size) {
        const mid = Math.min(start + size, n);
        const end = Math.min(start + 2 * size, n);

        // Show the two halves being merged
        const mergeHL: Record<number, string> = {};
        for (let i = start; i < mid; i++) mergeHL[i] = 'active';
        for (let i = mid; i < end; i++) mergeHL[i] = 'comparing';

        steps.push({
          line: 8,
          explanation: `Merge subarrays [${arr.slice(start, mid).join(', ')}] and [${arr.slice(mid, end).join(', ')}] (indices ${start}-${mid - 1} and ${mid}-${end - 1}).`,
          variables: { left: arr.slice(start, mid), right: arr.slice(mid, end), mergeSize: size },
          visualization: makeViz([...arr], mergeHL, { [start]: 'L', [mid < n ? mid : mid - 1]: 'R' }),
        });

        // Perform merge
        const left = arr.slice(start, mid);
        const right = arr.slice(mid, end);
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
          const compareHL: Record<number, string> = {};
          compareHL[start + i] = 'swapping';
          compareHL[mid + j] = 'swapping';

          if (left[i] <= right[j]) {
            newArr[k] = left[i++];
          } else {
            newArr[k] = right[j++];
          }
          k++;
        }
        while (i < left.length) newArr[k++] = left[i++];
        while (j < right.length) newArr[k++] = right[j++];

        // Show merged result
        const sortedHL: Record<number, string> = {};
        for (let s = start; s < end; s++) sortedHL[s] = 'sorted';

        steps.push({
          line: 13,
          explanation: `Merged result: [${newArr.slice(start, end).join(', ')}] placed at indices ${start}-${end - 1}.`,
          variables: { merged: newArr.slice(start, end) },
          visualization: makeViz([...newArr], sortedHL, {}),
        });
      }
      arr = newArr;
      size *= 2;
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 6,
      explanation: `Merge sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: makeViz(arr, finalHL, {}),
    });

    return steps;
  },
};

export default mergeSortVisualization;
