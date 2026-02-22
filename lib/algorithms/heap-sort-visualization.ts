import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const heapSortVisualization: AlgorithmDefinition = {
  id: 'heap-sort-visualization',
  title: 'Heap Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Heapsort builds a max-heap from the array, then repeatedly extracts the maximum element to build the sorted array. Time: O(n log n), Space: O(1) in-place.',
  tags: ['Sorting', 'Heap', 'Binary Heap', 'In-place'],
  code: {
    pseudocode: `function heapSort(arr):
  n = arr.length
  for i = n/2-1 down to 0:
    heapify(arr, n, i)
  for i = n-1 down to 1:
    swap(arr[0], arr[i])
    heapify(arr, i, 0)

function heapify(arr, n, i):
  largest = i
  l = 2*i+1; r = 2*i+2
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
  let largest = i, l = 2*i+1, r = 2*i+2;
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
private void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
        heapify(arr, n, largest);
    }
}`,
  },
  defaultInput: { nums: [12, 11, 13, 5, 6, 7] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [12, 11, 13, 5, 6, 7],
      placeholder: '12,11,13,5,6,7',
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
      ...(auxEntries ? { auxData: { label: 'Heap Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin heap sort on [${nums.join(', ')}]. First, build a max-heap.`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    function heapify(size: number, i: number) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      if (l < size && nums[l] > nums[largest]) largest = l;
      if (r < size && nums[r] > nums[largest]) largest = r;

      const hl: Record<number, string> = { [i]: 'active' };
      if (l < size) hl[l] = 'comparing';
      if (r < size) hl[r] = 'comparing';
      if (largest !== i) hl[largest] = 'swapping';

      steps.push({
        line: 9,
        explanation: `Heapify at index ${i}. Largest among i=${i}(${nums[i]}), l=${l}(${l < size ? nums[l] : 'N/A'}), r=${r}(${r < size ? nums[r] : 'N/A'}) is index ${largest}.`,
        variables: { i, largest, l, r },
        visualization: makeViz(hl, { [i]: 'i', [largest]: 'largest' },
          [{ key: 'Action', value: 'Heapify' }, { key: 'Root', value: String(nums[i]) }]),
      });

      if (largest !== i) {
        const tmp = nums[i]; nums[i] = nums[largest]; nums[largest] = tmp;
        steps.push({
          line: 15,
          explanation: `Swap arr[${i}]=${nums[i]} and arr[${largest}]=${nums[largest]} to maintain heap property.`,
          variables: { swapped: [i, largest] },
          visualization: makeViz({ [i]: 'swapping', [largest]: 'swapping' }, {},
            [{ key: 'Swapped', value: `arr[${i}]↔arr[${largest}]` }]),
        });
        heapify(size, largest);
      }
    }

    // Build max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    steps.push({
      line: 4,
      explanation: `Max-heap built: [${nums.join(', ')}]. Now extract elements one by one.`,
      variables: { heap: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'pointer'])),
        {},
        [{ key: 'Max-Heap', value: nums.join(', ') }],
      ),
    });

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      const tmp = nums[0]; nums[0] = nums[i]; nums[i] = tmp;

      const hl: Record<number, string> = { [0]: 'swapping', [i]: 'found' };
      for (let x = i + 1; x < n; x++) hl[x] = 'sorted';

      steps.push({
        line: 5,
        explanation: `Move max element ${nums[i]} to sorted position at index ${i}. Heap size now ${i}.`,
        variables: { extracted: nums[i], heapSize: i },
        visualization: makeViz(hl, { [i]: 'sorted' },
          [{ key: 'Extracted', value: String(nums[i]) }, { key: 'Heap size', value: String(i) }]),
      });

      heapify(i, 0);
    }

    steps.push({
      line: 1,
      explanation: `Heap sort complete! Sorted: [${nums.join(', ')}].`,
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

export default heapSortVisualization;
