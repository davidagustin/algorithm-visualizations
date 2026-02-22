import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertionSortII: AlgorithmDefinition = {
  id: 'insertion-sort-ii',
  title: 'Insertion Sort II',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Insertion sort variant: build a sorted subarray by repeatedly picking the next element and inserting it into its correct position via backward shifting. Time: O(n²), Space: O(1).',
  tags: ['Sorting', 'Insertion Sort', 'In-place', 'Stable'],
  code: {
    pseudocode: `function insertionSort(arr):
  for i = 1 to n-1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j+1] = arr[j]
      j--
    arr[j+1] = key`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr`,
    javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j];
      j--;
    }
    arr[j+1] = key;
  }
  return arr;
}`,
    java: `public int[] insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    return arr;
}`,
  },
  defaultInput: { nums: [5, 3, 8, 4, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 3, 8, 4, 2],
      placeholder: '5,3,8,4,2',
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
      ...(auxEntries ? { auxData: { label: 'Insertion Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin insertion sort on [${nums.join(', ')}].`,
      variables: { nums: [...nums] },
      visualization: makeViz({ [0]: 'found' }, { [0]: 'sorted' }),
    });

    for (let i = 1; i < nums.length; i++) {
      const key = nums[i];
      let j = i - 1;

      const hl: Record<number, string> = {};
      for (let x = 0; x < i; x++) hl[x] = 'found';
      hl[i] = 'active';

      steps.push({
        line: 2,
        explanation: `Pick key=${key} at index ${i}. Sorted subarray: [${nums.slice(0, i).join(', ')}].`,
        variables: { i, key, sortedPart: nums.slice(0, i) },
        visualization: makeViz(hl, { [i]: 'key' },
          [{ key: 'Key', value: String(key) }, { key: 'i', value: String(i) }]),
      });

      while (j >= 0 && nums[j] > key) {
        nums[j + 1] = nums[j];
        const shiftHl: Record<number, string> = {};
        for (let x = 0; x <= i; x++) shiftHl[x] = 'comparing';
        shiftHl[j] = 'swapping';
        shiftHl[j + 1] = 'swapping';

        steps.push({
          line: 5,
          explanation: `arr[${j}]=${nums[j]} > key=${key}, shift right. arr[${j + 1}]=${nums[j]}.`,
          variables: { j, shifted: nums[j] },
          visualization: makeViz(shiftHl, { [j + 1]: 'shift' },
            [{ key: 'Shift', value: `arr[${j}]→arr[${j + 1}]` }]),
        });
        j--;
      }

      nums[j + 1] = key;

      const insertHl: Record<number, string> = {};
      for (let x = 0; x <= i; x++) insertHl[x] = 'found';
      insertHl[j + 1] = 'pointer';

      steps.push({
        line: 7,
        explanation: `Insert key=${key} at index ${j + 1}. Sorted: [${nums.slice(0, i + 1).join(', ')}].`,
        variables: { insertAt: j + 1, key },
        visualization: makeViz(insertHl, { [j + 1]: 'key' },
          [{ key: 'Inserted', value: `${key} at index ${j + 1}` }]),
      });
    }

    steps.push({
      line: 1,
      explanation: `Insertion sort complete! Sorted: [${nums.join(', ')}].`,
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

export default insertionSortII;
