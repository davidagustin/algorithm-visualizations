import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const selectionSortVisualization: AlgorithmDefinition = {
  id: 'selection-sort-visualization',
  title: 'Selection Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Find the minimum element from the unsorted portion and swap it with the first unsorted element. Repeat for each position. O(n^2) comparisons but only O(n) swaps — useful when writes are expensive. Not stable in the standard implementation.',
  tags: ['sorting', 'selection', 'in-place', 'minimum', 'comparison'],

  code: {
    pseudocode: `function selectionSort(arr):
  n = len(arr)
  for i = 0 to n - 2:
    minIdx = i
    for j = i + 1 to n - 1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    if minIdx != i:
      swap(arr[i], arr[minIdx])`,

    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,

    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,

    java: `public int[] selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) {
            int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
        }
    }
    return arr;
}`,
  },

  defaultInput: {
    arr: [64, 25, 12, 22, 11],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [64, 25, 12, 22, 11],
      placeholder: '64,25,12,22,11',
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
      sortedUntil: number
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      for (let i = 0; i < sortedUntil; i++) merged[i] = 'sorted';
      for (const [k, v] of Object.entries(highlights)) merged[Number(k)] = v;
      return { type: 'array', array: [...arr], highlights: merged, labels };
    };

    steps.push({
      line: 1,
      explanation: `Selection sort on [${arr.join(', ')}]. Each pass selects the minimum from the unsorted portion and places it at the front.`,
      variables: { array: [...arr] },
      visualization: makeViz({}, {}, 0),
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        line: 3,
        explanation: `Pass ${i + 1}: Find minimum in unsorted region [${i}..${n - 1}]. Current minimum candidate: arr[${i}] = ${arr[i]}.`,
        variables: { i, currentMin: arr[i], minIdx: i },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'min?' }, i),
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          line: 5,
          explanation: `Compare arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}.`,
          variables: { j, 'arr[j]': arr[j], minIdx, 'arr[minIdx]': arr[minIdx] },
          visualization: makeViz(
            { [minIdx]: 'active', [j]: 'comparing' },
            { [minIdx]: 'min', [j]: 'j' },
            i
          ),
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            line: 6,
            explanation: `New minimum found: arr[${j}]=${arr[j]}. Update minIdx = ${j}.`,
            variables: { minIdx, newMin: arr[minIdx] },
            visualization: makeViz(
              { [minIdx]: 'found' },
              { [minIdx]: 'new min' },
              i
            ),
          });
        }
      }

      if (minIdx !== i) {
        steps.push({
          line: 8,
          explanation: `Minimum of unsorted region is arr[${minIdx}]=${arr[minIdx]}. Swap with arr[${i}]=${arr[i]}.`,
          variables: { swapFrom: i, swapTo: minIdx, value: arr[minIdx] },
          visualization: makeViz(
            { [i]: 'swapping', [minIdx]: 'swapping' },
            { [i]: `${arr[minIdx]}`, [minIdx]: `${arr[i]}` },
            i
          ),
        });
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      }

      steps.push({
        line: 3,
        explanation: `arr[${i}]=${arr[i]} is now in its final sorted position.`,
        variables: { sortedElement: arr[i], position: i },
        visualization: makeViz({}, {}, i + 1),
      });
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 9,
      explanation: `Selection sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default selectionSortVisualization;
