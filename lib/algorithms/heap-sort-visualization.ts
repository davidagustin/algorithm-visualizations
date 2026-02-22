import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const heapSortVisualization: AlgorithmDefinition = {
  id: 'heap-sort-visualization',
  title: 'Heap Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Build a max-heap from the array in O(n) time, then repeatedly extract the maximum element (root) and place it at the end of the array. Each extraction is O(log n), giving O(n log n) total. In-place with O(1) extra space.',
  tags: ['sorting', 'heap', 'max-heap', 'in-place', 'comparison'],

  code: {
    pseudocode: `function heapSort(arr):
  n = len(arr)
  // Build max heap
  for i = n/2 - 1 down to 0:
    heapify(arr, n, i)
  // Extract elements one by one
  for i = n - 1 down to 1:
    swap(arr[0], arr[i])
    heapify(arr, i, 0)

function heapify(arr, n, i):
  largest = i
  l = 2*i + 1, r = 2*i + 2
  if l < n and arr[l] > arr[largest]: largest = l
  if r < n and arr[r] > arr[largest]: largest = r
  if largest != i:
    swap(arr[i], arr[largest])
    heapify(arr, n, largest)`,

    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    l, r = 2*i+1, 2*i+2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,

    javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i;
  const l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,

    java: `public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2-1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        int tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp;
        heapify(arr, i, 0);
    }
}
void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        heapify(arr, n, largest);
    }
}`,
  },

  defaultInput: {
    arr: [12, 11, 13, 5, 6, 7],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [12, 11, 13, 5, 6, 7],
      placeholder: '12,11,13,5,6,7',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;
    let sortedStart = n;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      for (let i = sortedStart; i < n; i++) merged[i] = 'sorted';
      for (const [k, v] of Object.entries(highlights)) merged[Number(k)] = v;
      return { type: 'array', array: [...arr], highlights: merged, labels };
    };

    const heapify = (size: number, i: number) => {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      steps.push({
        line: 11,
        explanation: `Heapify at index ${i} (val=${arr[i]}). Children: left=${l < size ? `arr[${l}]=${arr[l]}` : 'none'}, right=${r < size ? `arr[${r}]=${arr[r]}` : 'none'}.`,
        variables: { i, 'arr[i]': arr[i], heapSize: size },
        visualization: makeViz(
          { [i]: 'active', ...(l < size ? { [l]: 'comparing' } : {}), ...(r < size ? { [r]: 'comparing' } : {}) },
          { [i]: 'root', ...(l < size ? { [l]: 'L' } : {}), ...(r < size ? { [r]: 'R' } : {}) }
        ),
      });

      if (l < size && arr[l] > arr[largest]) largest = l;
      if (r < size && arr[r] > arr[largest]) largest = r;

      if (largest !== i) {
        steps.push({
          line: 16,
          explanation: `arr[${largest}]=${arr[largest]} is largest. Swap with arr[${i}]=${arr[i]}.`,
          variables: { swapFrom: i, swapTo: largest },
          visualization: makeViz(
            { [i]: 'swapping', [largest]: 'swapping' },
            { [i]: `${arr[largest]}`, [largest]: `${arr[i]}` }
          ),
        });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(size, largest);
      }
    };

    steps.push({
      line: 1,
      explanation: `Heap sort on [${arr.join(', ')}]. Phase 1: Build max-heap from bottom up.`,
      variables: { array: [...arr] },
      visualization: makeViz({}, {}),
    });

    // Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        line: 4,
        explanation: `Build heap: heapify from index ${i} (val=${arr[i]}).`,
        variables: { i },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'heapify' }),
      });
      heapify(n, i);
    }

    steps.push({
      line: 6,
      explanation: `Max-heap built: [${arr.join(', ')}]. Root arr[0]=${arr[0]} is the maximum. Phase 2: Extract max repeatedly.`,
      variables: { heap: [...arr] },
      visualization: makeViz({ 0: 'found' }, { 0: 'max' }),
    });

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        line: 8,
        explanation: `Swap root (max=${arr[0]}) with last unsorted element arr[${i}]=${arr[i]}. Place ${arr[0]} in final position ${i}.`,
        variables: { extractedMax: arr[0], placedAt: i },
        visualization: makeViz({ 0: 'swapping', [i]: 'swapping' }, { 0: 'max', [i]: 'end' }),
      });

      [arr[0], arr[i]] = [arr[i], arr[0]];
      sortedStart = i;

      steps.push({
        line: 9,
        explanation: `arr[${i}]=${arr[i]} is now sorted. Re-heapify remaining ${i} elements.`,
        variables: { sortedElement: arr[i], heapSize: i },
        visualization: makeViz({}, {}),
      });

      heapify(i, 0);
    }

    sortedStart = 0;
    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 7,
      explanation: `Heap sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default heapSortVisualization;
