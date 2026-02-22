import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertionSortVisualization: AlgorithmDefinition = {
  id: 'insertion-sort-visualization',
  title: 'Insertion Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Build a sorted portion of the array one element at a time. For each element, shift all larger elements in the sorted portion one position right, then insert the current element into its correct position. O(n^2) worst case, O(n) best case (already sorted).',
  tags: ['sorting', 'insertion', 'in-place', 'stable'],

  code: {
    pseudocode: `function insertionSort(arr):
  for i = 1 to n - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j]
      j -= 1
    arr[j + 1] = key`,

    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,

    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,

    java: `public int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
  },

  defaultInput: {
    arr: [12, 11, 13, 5, 6],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [12, 11, 13, 5, 6],
      placeholder: '12,11,13,5,6',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      sortedUpTo: number
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      for (let i = 0; i <= sortedUpTo; i++) merged[i] = 'sorted';
      for (const [k, v] of Object.entries(highlights)) merged[Number(k)] = v;
      return { type: 'array', array: [...arr], highlights: merged, labels };
    };

    steps.push({
      line: 1,
      explanation: `Start insertion sort on [${arr.join(', ')}]. Element at index 0 (${arr[0]}) is trivially sorted.`,
      variables: { array: [...arr] },
      visualization: makeViz({ 0: 'sorted' }, { 0: 'sorted' }, 0),
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];

      steps.push({
        line: 2,
        explanation: `Outer loop i=${i}. Pick key = arr[${i}] = ${key}. Will insert into sorted portion [0..${i - 1}].`,
        variables: { i, key, sortedPortion: arr.slice(0, i) },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'key' }, i - 1),
      });

      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        steps.push({
          line: 5,
          explanation: `arr[${j}]=${arr[j]} > key=${key}. Shift arr[${j}] one position right.`,
          variables: { j, 'arr[j]': arr[j], key },
          visualization: makeViz(
            { [j]: 'comparing', [j + 1]: 'swapping' },
            { [j]: 'shift', [j + 1]: 'key' },
            i - 1
          ),
        });

        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;

      steps.push({
        line: 7,
        explanation: `Insert key=${key} at index ${j + 1}. Sorted portion is now [0..${i}]: [${arr.slice(0, i + 1).join(', ')}].`,
        variables: { key, insertedAt: j + 1, sortedPortion: arr.slice(0, i + 1) },
        visualization: makeViz({ [j + 1]: 'found' }, { [j + 1]: 'inserted' }, i),
      });
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 8,
      explanation: `Insertion sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default insertionSortVisualization;
