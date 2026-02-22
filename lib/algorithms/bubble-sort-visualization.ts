import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bubbleSortVisualization: AlgorithmDefinition = {
  id: 'bubble-sort-visualization',
  title: 'Bubble Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Repeatedly compare adjacent pairs and swap them if out of order. After each full pass, the largest unsorted element "bubbles" to its final position at the end. An optimized version stops early if no swaps occurred in a pass. O(n^2) worst case, O(n) best case.',
  tags: ['sorting', 'bubble', 'in-place', 'stable', 'comparison'],

  code: {
    pseudocode: `function bubbleSort(arr):
  n = len(arr)
  for i = 0 to n - 2:
    swapped = false
    for j = 0 to n - i - 2:
      if arr[j] > arr[j + 1]:
        swap(arr[j], arr[j + 1])
        swapped = true
    if not swapped: break`,

    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,

    java: `public int[] bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = tmp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`,
  },

  defaultInput: {
    arr: [64, 34, 25, 12, 22, 11, 90],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [64, 34, 25, 12, 22, 11, 90],
      placeholder: '64,34,25,12,22,11,90',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;
    const sortedFrom = n; // track where sorted region starts (from end)

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      sortedStart: number
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      for (let i = sortedStart; i < n; i++) merged[i] = 'sorted';
      for (const [k, v] of Object.entries(highlights)) merged[Number(k)] = v;
      return { type: 'array', array: [...arr], highlights: merged, labels };
    };

    steps.push({
      line: 1,
      explanation: `Start bubble sort on [${arr.join(', ')}]. Each pass bubbles the largest unsorted element to the end.`,
      variables: { array: [...arr] },
      visualization: makeViz({}, {}, sortedFrom),
    });

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      const sortedStart = n - i;

      steps.push({
        line: 3,
        explanation: `Pass ${i + 1}: compare adjacent pairs in indices [0..${n - i - 2}]. Sorted region: [${n - i}..${n - 1}].`,
        variables: { pass: i + 1, compareUntil: n - i - 2 },
        visualization: makeViz({}, {}, sortedStart),
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          line: 5,
          explanation: `Compare arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}.`,
          variables: { j, 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1] },
          visualization: makeViz(
            { [j]: 'comparing', [j + 1]: 'comparing' },
            { [j]: 'j', [j + 1]: 'j+1' },
            sortedStart
          ),
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;

          steps.push({
            line: 7,
            explanation: `${arr[j + 1]} > ${arr[j]}: swap! arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}.`,
            variables: { 'arr[j]': arr[j], 'arr[j+1]': arr[j + 1], swapped: true },
            visualization: makeViz(
              { [j]: 'swapping', [j + 1]: 'swapping' },
              { [j]: `${arr[j]}`, [j + 1]: `${arr[j + 1]}` },
              sortedStart
            ),
          });
        }
      }

      // Mark the newly sorted element
      steps.push({
        line: 4,
        explanation: `Pass ${i + 1} complete. arr[${n - i - 1}]=${arr[n - i - 1]} is now in its final sorted position.${!swapped ? ' No swaps — array is sorted early!' : ''}`,
        variables: { sortedElement: arr[n - i - 1], position: n - i - 1, swapped },
        visualization: makeViz({}, {}, n - i - 1),
      });

      if (!swapped) break;
    }

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 9,
      explanation: `Bubble sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default bubbleSortVisualization;
